export interface TelescopeSpecification {
  aperture: string;
  focalLength: string;
  opticalDesign: string;
  mount: string;
  focalRatio?: string;
  coatings?: string;
  primaryMirror?: string;
  trackingAndGoto?: string;
  focus?: string;
  power?: string;
  resolvingPower?: string;
  limitingMagnitude?: string;
  tube?: string;
  etalonBandpass?: string;
  tuning?: string;
  focuser?: string;
  blockingFilterOptions?: string;
  otaWeight?: string;
  appearance?: string;
  suppliedAccessories?: string;
  highestUsefulMagnification?: string;
  secondaryObstruction?: string;
  correctorLenses?: string;
  mirrorLocks?: string;
  compatibility?: string;
  quantity?: number;
}

export interface Telescope {
  id: string;
  title: string;
  subtitle: string;
  mountType: 'Alt-Az Mount' | 'EQ Mount';
  quantity: number;
  badge?: string;
  category: 'Deep Sky & Planetary' | 'Solar Research' | 'High-Resolution Imaging';
  summary: string;
  specs: TelescopeSpecification;
  imagePlaceholder: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Nebula' | 'Planet' | 'Moon' | 'Sun' | 'Observatory Grounds';
  caption: string;
  targetObject: string;
  equipment: string;
  date: string;
  creditPlaceholder: string;
  imageUrl?: string;
  placeholderColor?: string;
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  isHead?: boolean;
  department: string;
  bio: string;
  avatarPlaceholder?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isPlaceholder?: boolean;
}

export interface WeatherData {
  temperature: number;
  cloudCover: number;
  windSpeed: number;
  windDirection?: number;
  humidity?: number;
  weatherCode: number;
  conditionText: string;
  isSessionViable: boolean;
  viabilityNote: string;
  lastUpdated: string;
  sourceUrl: string;
}

export interface MoonCalculation {
  phaseName: string;
  illuminationFraction: number; // 0 to 1
  illuminationPercentage: number; // 0 to 100
  altitudeDegrees: number;
  azimuthDegrees: number;
  phaseAngleDegrees: number; // 0 to 360 degrees (ecliptic longitude phase angle: <180 = Waxing, >=180 = Waning)
  isWaxing: boolean;
  isWithinHeroWindow: boolean; // 35° to 65°
  isAboveHorizon: boolean;
  statusText: string;
  ageDays?: number;
  riseTimeStr?: string;       // local time only, e.g. "16:35" or "Does not rise today"
  setTimeStr?: string;        // local time only, e.g. "02:30" or "Does not set today"
  riseIsNextDay?: boolean;    // true if rise occurs on the following calendar day
  setIsNextDay?: boolean;     // true if set occurs on the following calendar day
}

export interface SkyObject {
  name: string;
  type: 'star' | 'planet' | 'moon' | 'sun' | 'messier' | 'nebula' | 'galaxy' | 'cluster' | 'double-star';
  ra: number; // in hours
  dec: number; // in degrees
  mag: number;
  altitude?: number;
  azimuth?: number;
  constellation?: string;
}

export interface CelestialTarget {
  id: string;
  name: string;
  catalogId?: string;
  type: 'planet' | 'moon' | 'sun' | 'star' | 'double-star' | 'nebula' | 'galaxy' | 'cluster';
  categoryLabel: string;
  constellation: string;
  mag: number;
  altitude: number;
  azimuth: number;
  raHours: number;
  decDeg: number;
  isWithinIAOWindow: boolean; // 35° <= altitude <= 65°
  isAboveHorizon: boolean;
  bestTelescope: string;
  telescopeReason: string;
  compatibleTelescopes: string[];
  color?: string;
  spectralColor?: string;
  phaseFraction?: number;
  description: string;
  surfaceBrightness?: number; // mag/arcsec² for extended objects
  visibilityQuality?: 'prime' | 'moderate' | 'marginal' | 'washed_out';
  contrastNote?: string;
  isLightPollutionPass?: boolean;
}

export interface EducationTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'basics' | 'telescopes' | 'moon-planets' | 'constellations' | 'astrophotography' | 'light-pollution' | 'glossary';
  content?: string;
  subtopics?: EducationSubtopic[];
}

export interface EducationSubtopic {
  id: string;
  title: string;
  description: string;
  content?: string;
}

export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: ResourceItem[];
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'download' | 'tool' | 'external' | 'placeholder' | 'video' | 'audio' | 'paper';
  status?: 'available' | 'coming-soon' | 'placeholder';
  url?: string;
  downloadUrl?: string;
  content?: string;
  author?: string;
  journal?: string;
  year?: string;
  doi?: string;
  embedUrl?: string;
  fileSize?: string;
}

// Observation Session Booking & Availability Types
export type ObservationSessionType = 'solar' | 'night';
export type ObservingConditionStatus = 'OPEN' | 'CONDITIONALLY_OPEN' | 'CLOSED';

export interface ObservationSlot {
  slotId: number; // 1 to 6
  name: string; // e.g. "Slot 1"
  time: string; // e.g. "7:00 AM – 8:00 AM"
  sessionType: ObservationSessionType;
  maxGroups: number; // 3
  maxPeoplePerGroup: number; // 5
  bookedGroups: number;
  remainingSlots: number;
  isFullyBooked: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  status: ObservingConditionStatus;
  statusNote: string;
  weatherSummary: {
    cloudCover: number;
    windSpeed: number;
    weatherCode: number;
    conditionText: string;
    temperature: number;
  };
  slots: ObservationSlot[];
  systemSettings?: SystemSettings;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  numberOfPeople: number; // 1 to 5
}

export interface BookingRequest extends CustomerInput {
  date: string; // YYYY-MM-DD
  slotId: number; // 1 to 6
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type BookingStatus = 'CONFIRMED' | 'PENDING_PAYMENT' | 'CANCELLED';

export interface BookingRecord {
  id: string;
  bookingReference: string; // e.g. IAO-2026-X89K2
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
  };
  date: string;
  slotId: number;
  slotTime: string;
  sessionType: ObservationSessionType;
  numberOfPeople: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  amountPaid: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscribeInput {
  email: string;
}

export interface SubscriberRecord {
  id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  bookingsOpen: boolean;
  paymentRequired: boolean;
  updatedAt?: string;
}

export interface AdminOverviewStats {
  todayStr: string;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  todayBookingsCount: number;
  todayAttendees: number;
  totalRevenue: number;
  totalSubscribers: number;
  systemSettings: SystemSettings;
}

export interface DatabaseAuditStatus {
  engine: string;
  isProductionReady: boolean;
  storagePath: string;
  totalCustomers: number;
  totalBookings: number;
  totalSubscribers: number;
  postgresEnvDetected: boolean;
}


