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
  phaseAngleDegrees: number;
  isWithinHeroWindow: boolean; // 35° to 65°
  isAboveHorizon: boolean;
  statusText: string;
  ageDays?: number;
}

export interface SkyObject {
  name: string;
  type: 'star' | 'planet' | 'moon' | 'messier' | 'nebula' | 'galaxy' | 'cluster' | 'double-star';
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
  type: 'planet' | 'moon' | 'star' | 'double-star' | 'nebula' | 'galaxy' | 'cluster';
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
  type: 'guide' | 'download' | 'tool' | 'external' | 'placeholder';
  status?: 'available' | 'coming-soon' | 'placeholder';
  url?: string;
  downloadUrl?: string;
  content?: string;
}
