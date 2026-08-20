import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default Slot Capacity & Rules
export const SLOT_CAPACITY = 3; // Maximum 3 groups/bookings per slot
export const MAX_PEOPLE_PER_GROUP = 5; // Maximum 5 attendees per group

export const DEFAULT_SLOTS = [
  { slotId: 1, name: 'Slot 1', time: '7:00 AM – 8:00 AM', sessionType: 'solar', maxGroups: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP },
  { slotId: 2, name: 'Slot 2', time: '8:00 AM – 9:00 AM', sessionType: 'solar', maxGroups: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP },
  { slotId: 3, name: 'Slot 3', time: '9:00 AM – 10:00 AM', sessionType: 'solar', maxGroups: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP },
  { slotId: 4, name: 'Slot 4', time: '8:30 PM – 9:30 PM', sessionType: 'night', maxGroups: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP },
  { slotId: 5, name: 'Slot 5', time: '9:30 PM – 10:30 PM', sessionType: 'night', maxGroups: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP },
  { slotId: 6, name: 'Slot 6', time: '10:30 PM – 11:30 PM', sessionType: 'night', maxGroups: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP }
];

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDB() {
  ensureDataDirExists();
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      systemSettings: {
        bookingsOpen: true,
        paymentRequired: true,
        updatedAt: new Date().toISOString()
      },
      customers: [],
      bookings: [],
      subscribers: [],
      slotConfig: {
        capacityPerSlot: SLOT_CAPACITY,
        maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.systemSettings) {
      parsed.systemSettings = {
        bookingsOpen: true,
        paymentRequired: true,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB file, returning fallback data', err);
    return { 
      systemSettings: { bookingsOpen: true, paymentRequired: true, updatedAt: new Date().toISOString() },
      customers: [], 
      bookings: [], 
      subscribers: [], 
      slotConfig: { capacityPerSlot: SLOT_CAPACITY, maxPeoplePerGroup: MAX_PEOPLE_PER_GROUP } 
    };
  }
}

function saveDB(data) {
  ensureDataDirExists();
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Generate unique booking reference (e.g., IAO-2026-X89K2)
function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'IAO-2026-';
  for (let i = 0; i < 5; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

// --- SYSTEM OPERATIONAL SETTINGS ---

export function getSystemSettings() {
  const db = loadDB();
  return db.systemSettings || { bookingsOpen: true, paymentRequired: true, updatedAt: new Date().toISOString() };
}

export function updateSystemSettings({ bookingsOpen, paymentRequired }) {
  const db = loadDB();
  if (!db.systemSettings) {
    db.systemSettings = { bookingsOpen: true, paymentRequired: true, updatedAt: new Date().toISOString() };
  }

  if (typeof bookingsOpen === 'boolean') {
    db.systemSettings.bookingsOpen = bookingsOpen;
  }
  if (typeof paymentRequired === 'boolean') {
    db.systemSettings.paymentRequired = paymentRequired;
  }
  db.systemSettings.updatedAt = new Date().toISOString();

  saveDB(db);
  return db.systemSettings;
}

// --- BOOKING OPERATIONS ---

export function getSlotAvailability(date) {
  const db = loadDB();
  const dateBookings = db.bookings.filter(
    (b) => b.date === date && b.status !== 'CANCELLED'
  );

  return DEFAULT_SLOTS.map((slot) => {
    const bookedGroups = dateBookings.filter((b) => b.slotId === slot.slotId).length;
    const remainingSlots = Math.max(0, slot.maxGroups - bookedGroups);
    const isFullyBooked = bookedGroups >= slot.maxGroups;

    return {
      ...slot,
      bookedGroups,
      remainingSlots,
      isFullyBooked
    };
  });
}

export function createBooking({ name, email, phone, numberOfPeople, date, slotId, weatherStatus }) {
  const settings = getSystemSettings();

  // 1. Check Global System Settings: Bookings Open
  if (settings.bookingsOpen === false) {
    throw { statusCode: 403, message: 'Observation Session Bookings are currently closed by observatory administration.' };
  }

  // 2. Weather availability check
  if (weatherStatus === 'CLOSED') {
    throw { statusCode: 400, message: 'Observation sessions are unavailable on this date due to weather conditions.' };
  }

  // 3. Input Validation
  if (!name || name.trim().length < 2) {
    throw { statusCode: 400, message: 'Please provide a valid full name (at least 2 characters).' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw { statusCode: 400, message: 'Please provide a valid email address.' };
  }

  const phoneRegex = /^[\d\+\-\s\(\)]{7,20}$/;
  if (!phone || !phoneRegex.test(phone.trim())) {
    throw { statusCode: 400, message: 'Please provide a valid contact phone number.' };
  }

  const peopleCount = parseInt(numberOfPeople, 10);
  if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > MAX_PEOPLE_PER_GROUP) {
    throw { statusCode: 400, message: `Group size must be between 1 and ${MAX_PEOPLE_PER_GROUP} people per booking.` };
  }

  const targetSlotId = parseInt(slotId, 10);
  const slotDef = DEFAULT_SLOTS.find((s) => s.slotId === targetSlotId);
  if (!slotDef) {
    throw { statusCode: 400, message: 'Invalid observation slot selected.' };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    throw { statusCode: 400, message: 'Invalid observation date format.' };
  }

  // Synchronized state check & update to prevent race conditions
  const db = loadDB();

  // Check capacity for target date and slot
  const currentSlotBookings = db.bookings.filter(
    (b) => b.date === date && b.slotId === targetSlotId && b.status !== 'CANCELLED'
  );

  if (currentSlotBookings.length >= slotDef.maxGroups) {
    throw { statusCode: 409, message: `Slot ${targetSlotId} (${slotDef.time}) is fully booked for ${date}. Maximum capacity reached.` };
  }

  // Customer entity management
  let customer = db.customers.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
  const nowStr = new Date().toISOString();

  if (!customer) {
    customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      createdAt: nowStr
    };
    db.customers.push(customer);
  } else {
    customer.name = name.trim();
    customer.phone = phone.trim();
  }

  // Generate unique booking record
  let bookingReference = generateBookingReference();
  while (db.bookings.some((b) => b.bookingReference === bookingReference)) {
    bookingReference = generateBookingReference();
  }

  // Handle Payment Required Setting
  const isPaymentRequired = settings.paymentRequired !== false;
  const initialStatus = isPaymentRequired ? 'PENDING_PAYMENT' : 'CONFIRMED';
  const initialPaymentStatus = isPaymentRequired ? 'PENDING' : 'COMPLETED';

  const newBooking = {
    id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    bookingReference,
    customerId: customer.id,
    customer: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt
    },
    date,
    slotId: targetSlotId,
    slotTime: slotDef.time,
    sessionType: slotDef.sessionType,
    numberOfPeople: peopleCount,
    status: initialStatus,
    paymentStatus: initialPaymentStatus,
    amountPaid: isPaymentRequired ? 0 : 1500,
    createdAt: nowStr,
    updatedAt: nowStr
  };

  db.bookings.push(newBooking);
  saveDB(db);

  return newBooking;
}

export function updateBookingPayment(bookingReference, { paymentId, status, amountPaid }) {
  const db = loadDB();
  const booking = db.bookings.find((b) => b.bookingReference === bookingReference);

  if (!booking) {
    throw { statusCode: 444, message: 'Booking reference not found.' };
  }

  booking.paymentStatus = status; // 'COMPLETED', 'FAILED', 'CANCELLED'
  if (status === 'COMPLETED') {
    booking.status = 'CONFIRMED';
    booking.paymentId = paymentId || `pay_${Date.now()}`;
    booking.amountPaid = amountPaid || 0;
  } else if (status === 'FAILED' || status === 'CANCELLED') {
    booking.status = 'PENDING_PAYMENT';
  }

  booking.updatedAt = new Date().toISOString();
  saveDB(db);

  return booking;
}

export function getBookingByReference(bookingReference) {
  const db = loadDB();
  return db.bookings.find((b) => b.bookingReference === bookingReference) || null;
}

// --- ADMIN DASHBOARD OPERATIONS ---

export function getAllBookings({ date, slotId, status, sessionType, search } = {}) {
  const db = loadDB();
  let results = [...db.bookings];

  if (date) {
    results = results.filter((b) => b.date === date);
  }
  if (slotId) {
    const sId = parseInt(slotId, 10);
    results = results.filter((b) => b.slotId === sId);
  }
  if (status) {
    results = results.filter((b) => b.status === status);
  }
  if (sessionType) {
    results = results.filter((b) => b.sessionType === sessionType);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    results = results.filter((b) =>
      b.bookingReference.toLowerCase().includes(q) ||
      b.customer.name.toLowerCase().includes(q) ||
      b.customer.email.toLowerCase().includes(q) ||
      b.customer.phone.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return results;
}

export function updateBookingStatus(bookingReference, { status, paymentStatus }) {
  const db = loadDB();
  const booking = db.bookings.find((b) => b.bookingReference === bookingReference);

  if (!booking) {
    throw { statusCode: 404, message: 'Booking reference not found.' };
  }

  if (status) {
    booking.status = status; // 'CONFIRMED', 'PENDING_PAYMENT', 'CANCELLED'
  }
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus; // 'COMPLETED', 'PENDING', 'FAILED', 'CANCELLED'
  }

  booking.updatedAt = new Date().toISOString();
  saveDB(db);
  return booking;
}

export function deleteBooking(bookingReference) {
  const db = loadDB();
  const index = db.bookings.findIndex((b) => b.bookingReference === bookingReference);

  if (index === -1) {
    throw { statusCode: 404, message: 'Booking reference not found.' };
  }

  const removed = db.bookings.splice(index, 1)[0];
  saveDB(db);
  return removed;
}

export function getAdminOverviewStats() {
  const db = loadDB();
  const todayStr = new Date().toISOString().split('T')[0];

  const totalBookings = db.bookings.length;
  const confirmedBookings = db.bookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookings = db.bookings.filter(b => b.status === 'PENDING_PAYMENT').length;
  const cancelledBookings = db.bookings.filter(b => b.status === 'CANCELLED').length;

  const todayBookings = db.bookings.filter(b => b.date === todayStr && b.status !== 'CANCELLED');
  const todayAttendees = todayBookings.reduce((sum, b) => sum + (b.numberOfPeople || 1), 0);

  const totalRevenue = db.bookings
    .filter(b => b.paymentStatus === 'COMPLETED')
    .reduce((sum, b) => sum + (b.amountPaid || 1500), 0);

  const totalSubscribers = db.subscribers.filter(s => s.status === 'ACTIVE').length;

  return {
    todayStr,
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    todayBookingsCount: todayBookings.length,
    todayAttendees,
    totalRevenue,
    totalSubscribers,
    systemSettings: db.systemSettings
  };
}

export function getDatabaseAuditStatus() {
  const db = loadDB();
  const hasPostgresEnv = !!process.env.DATABASE_URL;

  return {
    engine: hasPostgresEnv ? 'PostgreSQL / Supabase (Configured)' : 'Local File Persistence (db.json)',
    isProductionReady: hasPostgresEnv,
    storagePath: DB_FILE,
    totalCustomers: db.customers.length,
    totalBookings: db.bookings.length,
    totalSubscribers: db.subscribers.length,
    postgresEnvDetected: hasPostgresEnv
  };
}

// --- NEWSLETTER OPERATIONS ---

export function subscribeNewsletter(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw { statusCode: 400, message: 'Please enter a valid email address.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = loadDB();

  const existing = db.subscribers.find((s) => s.email === cleanEmail);
  const nowStr = new Date().toISOString();

  if (existing) {
    if (existing.status === 'ACTIVE') {
      return { status: 'ALREADY_SUBSCRIBED', subscriber: existing, message: 'This email is already subscribed to the IAO celestial newsletter.' };
    } else {
      existing.status = 'ACTIVE';
      existing.updatedAt = nowStr;
      saveDB(db);
      return { status: 'RESUBSCRIBED', subscriber: existing, message: 'Welcome back! Your subscription has been reactivated.' };
    }
  }

  const newSub = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    email: cleanEmail,
    status: 'ACTIVE',
    createdAt: nowStr,
    updatedAt: nowStr
  };

  db.subscribers.push(newSub);
  saveDB(db);

  return { status: 'SUBSCRIBED', subscriber: newSub, message: 'Thank you for subscribing to the IAO Astronomical Observatory Newsletter!' };
}

export function unsubscribeNewsletter(email) {
  const cleanEmail = email.trim().toLowerCase();
  const db = loadDB();
  const subscriber = db.subscribers.find((s) => s.email === cleanEmail);

  if (!subscriber) {
    throw { statusCode: 404, message: 'Subscription record not found.' };
  }

  subscriber.status = 'UNSUBSCRIBED';
  subscriber.updatedAt = new Date().toISOString();
  saveDB(db);

  return { status: 'UNSUBSCRIBED', message: 'You have been successfully unsubscribed from the newsletter.' };
}

export function getAllSubscribers() {
  const db = loadDB();
  return db.subscribers || [];
}

export function deleteSubscriber(email) {
  const cleanEmail = email.trim().toLowerCase();
  const db = loadDB();
  const index = db.subscribers.findIndex((s) => s.email === cleanEmail);

  if (index === -1) {
    throw { statusCode: 404, message: 'Subscriber email not found.' };
  }

  const removed = db.subscribers.splice(index, 1)[0];
  saveDB(db);
  return removed;
}
