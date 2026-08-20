import express from 'express';
import { 
  getSlotAvailability, 
  createBooking, 
  updateBookingPayment, 
  getBookingByReference, 
  subscribeNewsletter, 
  unsubscribeNewsletter,
  getSystemSettings,
  updateSystemSettings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAdminOverviewStats,
  getDatabaseAuditStatus,
  getAllSubscribers,
  deleteSubscriber
} from './db.js';
import { evaluateObservingConditions } from './weatherEngine.js';
import { createPaymentIntent, verifyPayment, getPaymentConfig } from './paymentEngine.js';
import { checkAdminCredentials, generateAdminToken, adminAuthMiddleware } from './auth.js';

export const app = express();

app.use(express.json());

// Basic CORS & Security Headers Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- PUBLIC ENDPOINTS ---

// GET /api/system-settings (Public System Controls Status)
app.get('/api/system-settings', (req, res) => {
  try {
    const settings = getSystemSettings();
    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve system operational settings.' });
  }
});

// GET /api/availability?date=YYYY-MM-DD
app.get('/api/availability', async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const weatherResult = await evaluateObservingConditions(date);
    const slots = getSlotAvailability(date);
    const systemSettings = getSystemSettings();

    return res.json({
      date,
      status: weatherResult.status,
      statusNote: weatherResult.statusNote,
      weatherSummary: weatherResult.weatherSummary,
      slots,
      systemSettings
    });
  } catch (err) {
    console.error('Error fetching availability:', err);
    return res.status(err.statusCode || 500).json({ error: err.message || 'Server error checking availability' });
  }
});

// POST /api/bookings (Public Booking Submission)
app.post('/api/bookings', async (req, res) => {
  try {
    const { name, email, phone, numberOfPeople, date, slotId } = req.body;

    // 1. Global System Settings Check: Bookings Open
    const settings = getSystemSettings();
    if (settings.bookingsOpen === false) {
      return res.status(403).json({ 
        error: 'Observation Session Bookings are currently closed by observatory administration.' 
      });
    }

    // 2. Weather Availability Authority Check
    const weatherResult = await evaluateObservingConditions(date);
    if (weatherResult.status === 'CLOSED') {
      return res.status(400).json({ 
        error: 'Observation sessions are unavailable on this date due to weather conditions.' 
      });
    }

    // 3. Server-side Capacity & Entity Validation
    const booking = createBooking({
      name,
      email,
      phone,
      numberOfPeople,
      date,
      slotId,
      weatherStatus: weatherResult.status
    });

    // 4. Check Payment Required Setting
    let paymentIntent = null;
    if (settings.paymentRequired !== false) {
      paymentIntent = await createPaymentIntent({
        bookingReference: booking.bookingReference,
        amount: 1500, // PKR
        customerEmail: email
      });
    }

    return res.status(201).json({
      success: true,
      booking,
      paymentIntent,
      paymentRequired: settings.paymentRequired !== false
    });
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json({ error: err.message || 'Failed to create observation booking.' });
  }
});

// POST /api/payments/verify
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { bookingReference, paymentId, action } = req.body;

    if (!bookingReference) {
      return res.status(400).json({ error: 'Missing booking reference.' });
    }

    const verification = await verifyPayment({ paymentId, bookingReference, action });

    const updatedBooking = updateBookingPayment(bookingReference, {
      paymentId: verification.transactionId,
      status: verification.status,
      amountPaid: verification.amountPaid || 0
    });

    return res.json({
      success: verification.verified,
      booking: updatedBooking,
      verification
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'Payment verification failed.' });
  }
});

// GET /api/bookings/:reference
app.get('/api/bookings/:reference', (req, res) => {
  const booking = getBookingByReference(req.params.reference);
  if (!booking) {
    return res.status(404).json({ error: 'Booking reference not found.' });
  }
  return res.json({ booking });
});

// GET /api/payment-config
app.get('/api/payment-config', (req, res) => {
  return res.json(getPaymentConfig());
});

// POST /api/newsletter/subscribe
app.post('/api/newsletter/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    const result = subscribeNewsletter(email);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'Newsletter subscription failed.' });
  }
});

// POST /api/newsletter/unsubscribe
app.post('/api/newsletter/unsubscribe', (req, res) => {
  try {
    const { email } = req.body;
    const result = unsubscribeNewsletter(email);
    return res.json(result);
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'Unsubscribe failed.' });
  }
});

// --- PROTECTED ADMIN API ENDPOINTS ---

// POST /api/admin/login (Admin Login)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!checkAdminCredentials(username, password)) {
    return res.status(401).json({ error: 'Invalid admin username or password.' });
  }

  const token = generateAdminToken(username);
  return res.json({
    success: true,
    token,
    user: { username, role: 'ADMIN' }
  });
});

// GET /api/admin/verify (Verify Token)
app.get('/api/admin/verify', adminAuthMiddleware, (req, res) => {
  return res.json({ success: true, user: req.adminUser });
});

// GET /api/admin/settings (Fetch System Settings)
app.get('/api/admin/settings', adminAuthMiddleware, (req, res) => {
  return res.json(getSystemSettings());
});

// PATCH /api/admin/settings (Update Operational System Controls)
app.patch('/api/admin/settings', adminAuthMiddleware, (req, res) => {
  try {
    const { bookingsOpen, paymentRequired } = req.body;
    const updated = updateSystemSettings({ bookingsOpen, paymentRequired });
    return res.json({ success: true, systemSettings: updated });
  } catch (err) {
    return res.status(400).json({ error: 'Failed to update system operational settings.' });
  }
});

// GET /api/admin/overview (Dashboard Metrics)
app.get('/api/admin/overview', adminAuthMiddleware, (req, res) => {
  try {
    const stats = getAdminOverviewStats();
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate admin overview stats.' });
  }
});

// GET /api/admin/bookings (Filterable Bookings List)
app.get('/api/admin/bookings', adminAuthMiddleware, (req, res) => {
  try {
    const { date, slotId, status, sessionType, search } = req.query;
    const bookings = getAllBookings({ date, slotId, status, sessionType, search });
    return res.json({ count: bookings.length, bookings });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin bookings list.' });
  }
});

// PATCH /api/admin/bookings/:reference (Update Booking Status)
app.patch('/api/admin/bookings/:reference', adminAuthMiddleware, (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updated = updateBookingStatus(req.params.reference, { status, paymentStatus });
    return res.json({ success: true, booking: updated });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'Failed to update booking status.' });
  }
});

// DELETE /api/admin/bookings/:reference (Delete Booking)
app.delete('/api/admin/bookings/:reference', adminAuthMiddleware, (req, res) => {
  try {
    const removed = deleteBooking(req.params.reference);
    return res.json({ success: true, removed });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'Failed to delete booking.' });
  }
});

// GET /api/admin/subscribers (Newsletter Subscribers List)
app.get('/api/admin/subscribers', adminAuthMiddleware, (req, res) => {
  try {
    const subscribers = getAllSubscribers();
    return res.json({ count: subscribers.length, subscribers });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch subscribers.' });
  }
});

// DELETE /api/admin/subscribers/:email (Remove Subscriber)
app.delete('/api/admin/subscribers/:email', adminAuthMiddleware, (req, res) => {
  try {
    const removed = deleteSubscriber(req.params.email);
    return res.json({ success: true, removed });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ error: err.message || 'Failed to remove subscriber.' });
  }
});

// GET /api/admin/database-status (Database Audit & Production Readiness)
app.get('/api/admin/database-status', adminAuthMiddleware, (req, res) => {
  return res.json(getDatabaseAuditStatus());
});
