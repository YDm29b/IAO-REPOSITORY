import * as Astronomy from 'astronomy-engine';
import { OBSERVATORY_CONFIG } from '../config/observatory';
import { MoonCalculation, SkyObject, CelestialTarget } from '../types';

/**
 * Production-Grade Astronomy & Ephemeris Service for IAO (Islamabad Astronomical Observatory)
 *
 * Implements high-precision astronomical algorithms (VSOP87 planetary theory, ELP2000-82B lunar model,
 * topocentric refraction, and J2000 coordinate transformations) via astronomy-engine.
 *
 * All celestial targets are evaluated against IAO's strict altitude constraint:
 * 35.0° <= altitude <= 65.0°
 *
 * Telescope suitability is calculated against IAO's optical fleet:
 * 1. 16-inch Meade Schmidt-Cassegrain (Alt-Az, 406mm aperture, 4064mm FL)
 * 2. 10-inch Meade Schmidt-Cassegrain (Alt-Az, 254mm aperture, 2500mm FL, 0.45" resolution)
 * 3. Celestron EdgeHD 8" (EQ Mount, 203mm aperture, 2032mm FL, flat-field aplanatic SCT)
 */

export const IAO_TELESCOPES = {
  MEADE_16: {
    id: 'meade-16',
    name: '16-inch Meade Schmidt-Cassegrain',
    apertureMm: 406,
    focalLengthMm: 4064,
    focalRatio: 'f/10',
    mount: 'Heavy-Duty Fork Alt-Az',
    resolvingPowerArcsec: 0.28,
    limitingMag: 15.6,
    specialty: 'Faint deep-sky nebulae, faint galaxies, resolving dense globular cluster cores, and high-power deep imaging.',
  },
  MEADE_10: {
    id: 'meade-10',
    name: '10-inch Meade Schmidt-Cassegrain',
    apertureMm: 254,
    focalLengthMm: 2500,
    focalRatio: 'f/10',
    mount: 'Alt-Az Mount',
    resolvingPowerArcsec: 0.45,
    limitingMag: 14.7,
    specialty: 'High-resolution lunar surface features, planetary discs, atmospheric cloud bands, and tight double stars.',
  },
  EDGE_HD_8: {
    id: 'edgehd-8',
    name: 'Celestron EdgeHD 8" (EQ Mount)',
    apertureMm: 203,
    focalLengthMm: 2032,
    focalRatio: 'f/10 (f/7 reducer / f/2 HyperStar compatible)',
    mount: 'Precision Equatorial (EQ)',
    resolvingPowerArcsec: 0.57,
    limitingMag: 14.0,
    specialty: 'Wide-field flat-field imaging, extended open clusters, large emission nebulae, and astro-photometric tracking.',
  },
};

// Catalogue of Prominent Deep-Sky Objects (Messier & NGC) with Photometric Surface Brightness
export const DEEP_SKY_CATALOGUE: Array<{
  id: string;
  name: string;
  catalogId: string;
  type: 'nebula' | 'galaxy' | 'cluster';
  categoryLabel: string;
  raHours: number;
  decDeg: number;
  mag: number;
  surfaceBrightness: number; // Mean visual surface brightness in mag/arcsec² (MPSAS)
  isCompactHighContrast: boolean; // Flag for compact emission shells / dense cluster cores that pierce light pollution under magnification
  constellation: string;
  description: string;
  apparentSize: string;
  bestTelescope: string;
  telescopeReason: string;
  compatibleTelescopes: string[];
}> = [
  {
    id: 'm42',
    name: 'Orion Nebula',
    catalogId: 'M42 / NGC 1976',
    type: 'nebula',
    categoryLabel: 'Diffuse Emission Nebula',
    raHours: 5.59,
    decDeg: -5.39,
    mag: 4.0,
    // Source: O'Meara (2007) "The Messier Objects", Cambridge Univ Press; SIMBAD / ESO-VLT Huygens core H-alpha/OIII surface photometry
    surfaceBrightness: 17.5,
    isCompactHighContrast: true, // Bright ionized Trapezium core maintains high visual contrast against urban skyglow
    constellation: 'Orion',
    description: 'Vast stellar nursery with illuminated gas filaments and the central Trapezium cluster.',
    apparentSize: '65 × 60 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Flat-field aplanatic optics frame the entire extended gas cloud without coma distortion across the outer nebula.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm31',
    name: 'Andromeda Galaxy',
    catalogId: 'M31 / NGC 224',
    type: 'galaxy',
    categoryLabel: 'Major Spiral Galaxy',
    raHours: 0.71,
    decDeg: 41.27,
    mag: 3.44,
    // Source: RC3 - Third Reference Catalogue of Bright Galaxies (de Vaucouleurs et al. 1991); NASA/IPAC Extragalactic Database (NED) mean disc B/V photometry
    surfaceBrightness: 22.2,
    isCompactHighContrast: false, // Huge 3° × 1° disc; diffuse outer spiral arms wash out under urban light pollution, only stellar nucleus remains visible
    constellation: 'Andromeda',
    description: 'Nearest major spiral galaxy to the Milky Way, displaying dust lanes and dense galactic core.',
    apparentSize: '190 × 60 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Wide-field capability with f/7 reducer or HyperStar captures the expansive 3-degree disc and satellite galaxies (M32/M110).',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm45',
    name: 'Pleiades (Seven Sisters)',
    catalogId: 'M45 / Melotte 22',
    type: 'cluster',
    categoryLabel: 'Open Star Cluster',
    raHours: 3.79,
    decDeg: 24.11,
    mag: 1.6,
    // Source: Burnham's Celestial Handbook (1978); SIMBAD Melotte 22 stellar photometry
    surfaceBrightness: 22.5,
    isCompactHighContrast: true, // Star cluster: individual member stars (mags 2.8–5.5) are point sources easily resolved despite diffuse nebulosity fading
    constellation: 'Taurus',
    description: 'Spectacular bright cluster enveloped in delicate sapphire reflection nebulosity.',
    apparentSize: '110 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Edge-to-edge pin-point flat-field field of view frames all main blue giants simultaneously.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm13',
    name: 'Great Hercules Cluster',
    catalogId: 'M13 / NGC 6205',
    type: 'cluster',
    categoryLabel: 'Globular Star Cluster',
    raHours: 16.69,
    decDeg: 36.46,
    mag: 5.8,
    // Source: Harris, W.E. (1996/2010 edition) "Catalog of Parameters for Milky Way Globular Clusters", AJ 112, 1487; Kepple & Sanner (1998)
    surfaceBrightness: 19.8,
    isCompactHighContrast: true, // High core concentration index; dense central stellar core resolves in 10"/16" SCTs at high magnification
    constellation: 'Hercules',
    description: 'Dense swarm of over 300,000 ancient stars concentrated toward a blazing core.',
    apparentSize: '20 arcmin',
    bestTelescope: IAO_TELESCOPES.MEADE_16.name,
    telescopeReason: '16" massive 406mm aperture and 4064mm focal length resolve individual pinpoint stars right into the core.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name, IAO_TELESCOPES.EDGE_HD_8.name],
  },
  {
    id: 'm57',
    name: 'Ring Nebula',
    catalogId: 'M57 / NGC 6720',
    type: 'nebula',
    categoryLabel: 'Planetary Nebula',
    raHours: 18.89,
    decDeg: 33.03,
    mag: 8.8,
    // Source: O'Meara (1998) "Deep-Sky Companions: The Messier Objects", Cambridge Univ Press; Kepple & Sanner "Night Sky Observer's Guide" Vol 2; ESO [OIII] 500.7nm shell photometry
    surfaceBrightness: 19.5,
    isCompactHighContrast: true, // Compact 1.4 arcmin planetary nebula with peak [OIII] line emission shell (~18.2 MPSAS); high magnification darkens exit pupil, providing high contrast
    constellation: 'Lyra',
    description: 'Glowing smoke-ring shell of ionized gas ejected by an aging white dwarf star.',
    apparentSize: '1.4 × 1.0 arcmin',
    bestTelescope: IAO_TELESCOPES.MEADE_16.name,
    telescopeReason: 'High light-gathering power and 4064mm focal length deliver exceptional image scale on the 1.4 arcmin ring structure.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name, IAO_TELESCOPES.EDGE_HD_8.name],
  },
  {
    id: 'm27',
    name: 'Dumbbell Nebula',
    catalogId: 'M27 / NGC 6853',
    type: 'nebula',
    categoryLabel: 'Planetary Nebula',
    raHours: 19.99,
    decDeg: 22.72,
    mag: 7.5,
    // Source: O'Meara (1998) "Deep-Sky Companions: The Messier Objects"; ESO H-alpha & [OIII] planetary nebula survey
    surfaceBrightness: 20.2,
    isCompactHighContrast: true, // High-contrast central hourglass lobes visible with UHTC coatings / OIII narrowband filtering
    constellation: 'Vulpecula',
    description: 'Bright bi-polar expanding gas envelope showing vivid apple-core silhouette.',
    apparentSize: '8.0 × 5.6 arcmin',
    bestTelescope: IAO_TELESCOPES.MEADE_16.name,
    telescopeReason: 'Deep light grasp brings out subtle outer oxygen-III gas wings and faint central star.',
    compatibleTelescopes: [IAO_TELESCOPES.EDGE_HD_8.name, IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm51',
    name: 'Whirlpool Galaxy',
    catalogId: 'M51 / NGC 5194',
    type: 'galaxy',
    categoryLabel: 'Interacting Grand-Design Spiral',
    raHours: 13.50,
    decDeg: 47.20,
    mag: 8.4,
    // Source: RC3 - Third Reference Catalogue of Bright Galaxies (de Vaucouleurs et al. 1991); NASA/IPAC Extragalactic Database (NED)
    surfaceBrightness: 21.7,
    isCompactHighContrast: false, // Diffuse face-on spiral disc (~2.9 mag fainter than Bortle 6.5 sky); severely washed out in urban background glow
    constellation: 'Canes Venatici',
    description: 'Face-on spiral galaxy interacting with companion NGC 5195 via tidal bridge.',
    apparentSize: '11.2 × 6.9 arcmin',
    bestTelescope: IAO_TELESCOPES.MEADE_16.name,
    telescopeReason: 'UHTC coatings and 16" primary mirror reveal intricate spiral arms, HII starburst regions, and companion bridge.',
    compatibleTelescopes: [IAO_TELESCOPES.EDGE_HD_8.name, IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm81_m82',
    name: "Bode's & Cigar Galaxies",
    catalogId: 'M81 / M82',
    type: 'galaxy',
    categoryLabel: 'Galaxy Pair',
    raHours: 9.93,
    decDeg: 69.07,
    mag: 6.9,
    // Source: RC3 (de Vaucouleurs et al. 1991); Holmberg (1958) "Photometric Study of Galaxies", Medd. Lund Obs.
    surfaceBrightness: 21.7,
    isCompactHighContrast: false, // Extended galactic discs wash out under urban light pollution
    constellation: 'Ursa Major',
    description: 'Brilliant grand-design spiral M81 paired with explosive starburst galaxy M82.',
    apparentSize: '27 × 14 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Equatorial flat-field optics frame both galaxies comfortably in a single high-contrast field.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm8',
    name: 'Lagoon Nebula',
    catalogId: 'M8 / NGC 6523',
    type: 'nebula',
    categoryLabel: 'Emission Nebula & Cluster',
    raHours: 18.06,
    decDeg: -24.38,
    mag: 6.0,
    // Source: O'Meara (1998) Messier Objects; SIMBAD NGC 6523 Hourglass nebula photometry
    surfaceBrightness: 22.0,
    isCompactHighContrast: false, // Expansive 90×40 arcmin outer emission nebulosity washes out into urban skyglow
    constellation: 'Sagittarius',
    description: 'Vibrant interstellar cloud bisected by a dark dust lane with embedded open cluster NGC 6530.',
    apparentSize: '90 × 40 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Fast focal capability and wide field showcase the expansive nebulosity and glowing dark lane.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm44',
    name: 'Beehive Cluster (Praesepe)',
    catalogId: 'M44 / NGC 2632',
    type: 'cluster',
    categoryLabel: 'Open Star Cluster',
    raHours: 8.67,
    decDeg: 19.67,
    mag: 3.7,
    // Source: SIMBAD Praesepe / Melotte 88 open cluster stellar catalog
    surfaceBrightness: 21.5,
    isCompactHighContrast: true, // Bright cluster of pinpoint stars (mags 6.0–8.5) visible through aperture light-gathering
    constellation: 'Cancer',
    description: 'Rich swarm of dozens of shimmering stars visible to the naked eye under dark skies.',
    apparentSize: '95 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Diffraction-limited wide field delivers sharp star points from edge to edge without vignetting.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name],
  },
  {
    id: 'm22',
    name: 'Great Sagittarius Cluster',
    catalogId: 'M22 / NGC 6656',
    type: 'cluster',
    categoryLabel: 'Globular Star Cluster',
    raHours: 18.61,
    decDeg: -23.90,
    mag: 5.1,
    // Source: Harris (1996/2010) Globular Cluster Catalog; Kepple & Sanner (1998)
    surfaceBrightness: 20.4,
    isCompactHighContrast: true, // High core stellar density; bright giant branch stars resolve under high power
    constellation: 'Sagittarius',
    description: 'One of the closest and brightest globular clusters in the night sky, spanning ~70,000 stars.',
    apparentSize: '32 arcmin',
    bestTelescope: IAO_TELESCOPES.MEADE_16.name,
    telescopeReason: 'Superb light collection pulls out faint red giant stars across the extensive halo.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name, IAO_TELESCOPES.EDGE_HD_8.name],
  },
  {
    id: 'ngc869_884',
    name: 'Double Cluster in Perseus',
    catalogId: 'NGC 869 / NGC 884',
    type: 'cluster',
    categoryLabel: 'Double Open Cluster',
    raHours: 2.33,
    decDeg: 57.15,
    mag: 3.7,
    // Source: SIMBAD NGC 869/884; WEBDA Open Cluster Database
    surfaceBrightness: 20.8,
    isCompactHighContrast: true, // Brilliant swarm of luminous blue and red supergiant point sources
    constellation: 'Perseus',
    description: 'Pair of dazzling young star clusters filled with bright blue and red supergiant stars.',
    apparentSize: '60 arcmin',
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Flat-field optical tube renders both twin cluster cores simultaneously with high color fidelity.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name, IAO_TELESCOPES.MEADE_16.name],
  },
  {
    id: 'm11',
    name: 'Wild Duck Cluster',
    catalogId: 'M11 / NGC 6705',
    type: 'cluster',
    categoryLabel: 'Dense Open Star Cluster',
    raHours: 18.85,
    decDeg: -6.27,
    mag: 5.8,
    // Source: SIMBAD NGC 6705; WEBDA Open Cluster Database
    surfaceBrightness: 20.0,
    isCompactHighContrast: true, // Extremely compact and rich stellar cluster; sharp point stars pierce urban background
    constellation: 'Scutum',
    description: 'One of the most compact and richest open clusters known, containing nearly 2,900 stars.',
    apparentSize: '14 arcmin',
    bestTelescope: IAO_TELESCOPES.MEADE_10.name,
    telescopeReason: 'High visual contrast and resolving power break the V-shaped flight formation into individual stars.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.EDGE_HD_8.name],
  },
];

// Catalogue of Bright Stars and Double Stars
export const BRIGHT_STARS_CATALOGUE: Array<{
  name: string;
  catalogId?: string;
  raHours: number;
  decDeg: number;
  mag: number;
  constellation: string;
  spectralColor: string;
  isDouble?: boolean;
  doubleDetails?: string;
  description: string;
}> = [
  { name: 'Polaris', catalogId: 'Alpha UMi', raHours: 2.53, decDeg: 89.26, mag: 1.98, constellation: 'Ursa Minor', spectralColor: '#fff8f0', isDouble: true, doubleDetails: 'Mag 2.0 / 9.0 pair (18" separation)', description: 'The North Star and celestial pivot point for northern observers.' },
  { name: 'Sirius', catalogId: 'Alpha CMa', raHours: 6.75, decDeg: -16.72, mag: -1.46, constellation: 'Canis Major', spectralColor: '#d6ecff', description: 'The brightest star in the night sky, radiating intense blue-white brilliance.' },
  { name: 'Vega', catalogId: 'Alpha Lyr', raHours: 18.62, decDeg: 38.78, mag: 0.03, constellation: 'Lyra', spectralColor: '#e0efff', description: 'Sapphire luminary of the Summer Triangle, prominent in high northern altitudes.' },
  { name: 'Arcturus', catalogId: 'Alpha Boo', raHours: 14.26, decDeg: 19.18, mag: -0.05, constellation: 'Boötes', spectralColor: '#ffd79e', description: 'Brilliant golden-orange giant star with high proper motion.' },
  { name: 'Capella', catalogId: 'Alpha Aur', raHours: 5.28, decDeg: 45.99, mag: 0.08, constellation: 'Auriga', spectralColor: '#fff1bb', description: 'Golden quadruple star system high in the northern sky.' },
  { name: 'Rigel', catalogId: 'Beta Ori', raHours: 5.24, decDeg: -8.20, mag: 0.13, constellation: 'Orion', spectralColor: '#bbdfff', isDouble: true, doubleDetails: 'Mag 0.1 / 6.8 pair (9.5" separation)', description: 'Luminous blue supergiant marking the foot of Orion.' },
  { name: 'Betelgeuse', catalogId: 'Alpha Ori', raHours: 5.92, decDeg: 7.41, mag: 0.50, constellation: 'Orion', spectralColor: '#ff9666', description: 'Semiregular variable red supergiant with immense physical diameter.' },
  { name: 'Altair', catalogId: 'Alpha Aql', raHours: 19.84, decDeg: 8.87, mag: 0.77, constellation: 'Aquila', spectralColor: '#f2f7ff', description: 'Rapidly rotating white main-sequence star of the Summer Triangle.' },
  { name: 'Aldebaran', catalogId: 'Alpha Tau', raHours: 4.60, decDeg: 16.51, mag: 0.85, constellation: 'Taurus', spectralColor: '#ffad73', description: 'The fiery eye of Taurus, an orange giant star.' },
  { name: 'Antares', catalogId: 'Alpha Sco', raHours: 16.49, decDeg: -26.43, mag: 1.06, constellation: 'Scorpius', spectralColor: '#ff7755', description: 'Heart of the Scorpion, a massive red supergiant.' },
  { name: 'Spica', catalogId: 'Alpha Vir', raHours: 13.42, decDeg: -11.16, mag: 0.98, constellation: 'Virgo', spectralColor: '#dbeaff', description: 'Blue spectroscopic binary star with intense luminosity.' },
  { name: 'Pollux', catalogId: 'Beta Gem', raHours: 7.76, decDeg: 28.03, mag: 1.14, constellation: 'Gemini', spectralColor: '#ffe2b3', description: 'Orange giant star and host to an extrasolar planet.' },
  { name: 'Deneb', catalogId: 'Alpha Cyg', raHours: 20.69, decDeg: 45.28, mag: 1.25, constellation: 'Cygnus', spectralColor: '#edf6ff', description: 'Extremely luminous white supergiant marking the tail of Cygnus.' },
  { name: 'Regulus', catalogId: 'Alpha Leo', raHours: 10.14, decDeg: 11.97, mag: 1.36, constellation: 'Leo', spectralColor: '#e0efff', description: 'Heart of the Lion, a quadruple star system with rapid rotational flattening.' },
  { name: 'Castor', catalogId: 'Alpha Gem', raHours: 7.58, decDeg: 31.89, mag: 1.58, constellation: 'Gemini', spectralColor: '#f2f8ff', isDouble: true, doubleDetails: 'Telescopic double resolved at ~5" separation', description: 'Fascinating sextuple star system cleanly split into two bright white components in small telescopes.' },
  { name: 'Albireo', catalogId: 'Beta Cyg', raHours: 19.51, decDeg: 27.96, mag: 3.05, constellation: 'Cygnus', spectralColor: '#ffd89e', isDouble: true, doubleDetails: 'Golden Topaz (3.1 mag) & Sapphire Blue (5.1 mag) at 34" separation', description: 'Famous crown-jewel double star showing striking gold and sapphire color contrast.' },
  { name: 'Mizar & Alcor', catalogId: 'Zeta UMa', raHours: 13.40, decDeg: 54.92, mag: 2.23, constellation: 'Ursa Major', spectralColor: '#eaf4ff', isDouble: true, doubleDetails: 'Mizar A/B split at 14.4", paired with Alcor at 11.8 arcmin', description: 'Famous naked-eye and telescopic multiple system in the handle of the Big Dipper.' },
  { name: 'Dubhe', catalogId: 'Alpha UMa', raHours: 11.06, decDeg: 61.75, mag: 1.79, constellation: 'Ursa Major', spectralColor: '#ffd79e', description: 'Pointer star directing toward Polaris in Ursa Major.' },
  { name: 'Merak', catalogId: 'Beta UMa', raHours: 11.03, decDeg: 56.38, mag: 2.37, constellation: 'Ursa Major', spectralColor: '#edf5ff', description: 'Southern pointer star of Ursa Major.' },
  { name: 'Alioth', catalogId: 'Epsilon UMa', raHours: 12.90, decDeg: 55.96, mag: 1.77, constellation: 'Ursa Major', spectralColor: '#f0f7ff', description: 'Brightest star in the Great Bear constellation.' },
  { name: 'Alkaid', catalogId: 'Eta UMa', raHours: 13.79, decDeg: 49.31, mag: 1.86, constellation: 'Ursa Major', spectralColor: '#d6ecff', description: 'Easternmost star of the Big Dipper handle.' },
  { name: 'Schedar', catalogId: 'Alpha Cas', raHours: 0.68, decDeg: 56.54, mag: 2.24, constellation: 'Cassiopeia', spectralColor: '#ffd89e', description: 'Orange giant star anchoring the W-asterism of Cassiopeia.' },
  { name: 'Caph', catalogId: 'Beta Cas', raHours: 0.15, decDeg: 59.15, mag: 2.28, constellation: 'Cassiopeia', spectralColor: '#fff6e6', description: 'Subgiant star at the western tip of Cassiopeia.' },
];

// Constellation Stick Figures for the Sky Map
export const CONSTELLATION_LINES = [
  // Big Dipper (Ursa Major)
  ['Dubhe', 'Merak'],
  ['Merak', 'Alioth'],
  ['Alioth', 'Mizar & Alcor'],
  ['Mizar & Alcor', 'Alkaid'],
  // Orion
  ['Betelgeuse', 'Rigel'],
  // Summer Triangle
  ['Vega', 'Deneb'],
  ['Deneb', 'Altair'],
  ['Altair', 'Vega'],
  // Gemini
  ['Castor', 'Pollux'],
  // Cassiopeia
  ['Schedar', 'Caph'],
];

export function getObserver(): Astronomy.Observer {
  return new Astronomy.Observer(
    OBSERVATORY_CONFIG.coordinates.latitude,
    OBSERVATORY_CONFIG.coordinates.longitude,
    OBSERVATORY_CONFIG.coordinates.elevationMeters
  );
}

/**
 * Calculates current Moon status and altitude/azimuth at IAO
 */
export function calculateMoonData(date: Date = new Date()): MoonCalculation | null {
  try {
    const observer = getObserver();
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, date);
    const moonPhaseAngle = Astronomy.MoonPhase(date); // 0 to 360 degrees
    
    // Equatorial position of Moon for observer
    const equator = Astronomy.Equator(Astronomy.Body.Moon, date, observer, true, true);
    
    // Topocentric Horizon position (Altitude & Azimuth)
    const horizon = Astronomy.Horizon(date, observer, equator.ra, equator.dec, 'normal');

    const altitudeDeg = horizon.altitude;
    const azimuthDeg = horizon.azimuth;
    const isAboveHorizon = altitudeDeg > 0;
    
    const { minDegrees, maxDegrees } = OBSERVATORY_CONFIG.heroMoonAltitudeRange;
    const isWithinHeroWindow = altitudeDeg >= minDegrees && altitudeDeg <= maxDegrees;

    // Determine Phase Name
    let phaseName = 'New Moon';
    if (moonPhaseAngle >= 355 || moonPhaseAngle < 5) phaseName = 'New Moon';
    else if (moonPhaseAngle < 85) phaseName = 'Waxing Crescent';
    else if (moonPhaseAngle < 95) phaseName = 'First Quarter';
    else if (moonPhaseAngle < 175) phaseName = 'Waxing Gibbous';
    else if (moonPhaseAngle < 185) phaseName = 'Full Moon';
    else if (moonPhaseAngle < 265) phaseName = 'Waning Gibbous';
    else if (moonPhaseAngle < 275) phaseName = 'Third Quarter';
    else phaseName = 'Waning Crescent';

    let statusText = 'Below Horizon';
    if (isAboveHorizon) {
      if (isWithinHeroWindow) {
        statusText = `Within IAO ${minDegrees}°–${maxDegrees}° prime window`;
      } else if (altitudeDeg < minDegrees) {
        statusText = `Low Altitude (${altitudeDeg.toFixed(1)}°) — Below prime window`;
      } else {
        statusText = `High Altitude (${altitudeDeg.toFixed(1)}°) — Above prime window`;
      }
    }

    return {
      phaseName,
      illuminationFraction: illum.phase_fraction,
      illuminationPercentage: Math.round(illum.phase_fraction * 100),
      altitudeDegrees: parseFloat(altitudeDeg.toFixed(1)),
      azimuthDegrees: parseFloat(azimuthDeg.toFixed(1)),
      phaseAngleDegrees: parseFloat(moonPhaseAngle.toFixed(1)),
      isWaxing: moonPhaseAngle > 0 && moonPhaseAngle < 180,
      isWithinHeroWindow,
      isAboveHorizon,
      statusText,
      ageDays: parseFloat((moonPhaseAngle / 360 * 29.53).toFixed(1)),
    };
  } catch (err) {
    console.error('Failed to compute lunar astronomy data:', err);
    return null;
  }
}

/**
 * Evaluates telescope suitability for Solar System and Stellar Targets based on IAO specs
 */
function getStarOrPlanetTelescopeSuitability(
  name: string,
  type: 'planet' | 'moon' | 'star' | 'double-star',
  isDouble?: boolean
): { bestTelescope: string; telescopeReason: string; compatibleTelescopes: string[] } {
  if (type === 'moon') {
    return {
      bestTelescope: IAO_TELESCOPES.MEADE_10.name,
      telescopeReason: '2500mm focal length and 0.45" resolving power deliver crisp, high-contrast lunar rilles, crater walls, and mountain shadows.',
      compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.EDGE_HD_8.name],
    };
  }

  if (type === 'planet') {
    if (name === 'Saturn') {
      return {
        bestTelescope: IAO_TELESCOPES.MEADE_10.name,
        telescopeReason: 'High visual sharpness reveals the Cassini Division, Encke gap, ring shadows, and major moons (Titan, Rhea).',
        compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.EDGE_HD_8.name],
      };
    }
    if (name === 'Jupiter') {
      return {
        bestTelescope: IAO_TELESCOPES.MEADE_10.name,
        telescopeReason: 'Ideal focal ratio and optical resolution highlight atmospheric cloud belts, the Great Red Spot, and Galilean moon transits.',
        compatibleTelescopes: [IAO_TELESCOPES.MEADE_16.name, IAO_TELESCOPES.EDGE_HD_8.name],
      };
    }
    if (name === 'Mars') {
      return {
        bestTelescope: IAO_TELESCOPES.MEADE_16.name,
        telescopeReason: 'Massive 406mm aperture and maximum magnification resolve subtle albedo markings and polar ice caps on small planetary disc.',
        compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name, IAO_TELESCOPES.EDGE_HD_8.name],
      };
    }
    if (name === 'Venus' || name === 'Mercury') {
      return {
        bestTelescope: IAO_TELESCOPES.MEADE_10.name,
        telescopeReason: 'Closed optical tube limits internal thermal currents when tracking bright inner planet crescent phases.',
        compatibleTelescopes: [IAO_TELESCOPES.EDGE_HD_8.name, IAO_TELESCOPES.MEADE_16.name],
      };
    }
    return {
      bestTelescope: IAO_TELESCOPES.MEADE_16.name,
      telescopeReason: '16" aperture brings sufficient light gathering for distinct planetary disk resolution and outer moons.',
      compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name],
    };
  }

  if (isDouble || type === 'double-star') {
    return {
      bestTelescope: IAO_TELESCOPES.MEADE_10.name,
      telescopeReason: '0.45 arcsecond resolving power provides clean Airy disk separation with excellent chromatic distinction.',
      compatibleTelescopes: [IAO_TELESCOPES.EDGE_HD_8.name, IAO_TELESCOPES.MEADE_16.name],
    };
  }

  // Single Stars
  return {
    bestTelescope: IAO_TELESCOPES.EDGE_HD_8.name,
    telescopeReason: 'Flat-field aplanatic SCT produces pinpoint star shapes across wide visual eyepieces.',
    compatibleTelescopes: [IAO_TELESCOPES.MEADE_10.name, IAO_TELESCOPES.MEADE_16.name],
  };
}

/**
 * Evaluates target visibility under IAO's light-polluted sky (Fourth Visibility Filter).
 * 
 * Physics Principles:
 * 1. Point Sources (Stars, Planets, Moon, Double Stars, Cluster Point Stars):
 *    Light is concentrated onto an Airy diffraction disk. Telescope aperture gathers more light:
 *      Telescope_Limiting_Mag = site_NELM + 5 * log10(aperture_mm / 7)
 *    Under Bortle 6.5 (site_NELM = 4.8), 8" (203mm) reaches mag 12.1, 10" (254mm) reaches mag 12.6, 16" (406mm) reaches mag 13.6.
 *    Point sources are visible if apparent magnitude mv <= Telescope_Limiting_Mag.
 * 
 * 2. Diffuse Extended Sources (Face-on Galaxies, Wide Faint Nebulae):
 *    Light is spread over an angular area. The background sky glow (skyBackgroundMPSAS = 18.8 mag/arcsec²)
 *    reduces contrast. For positive visual contrast, surface brightness must be brighter than sky background:
 *      Contrast Criterion: SB <= skyBackgroundMPSAS - contrastMarginMPSAS
 *    (Note: Magnitudes are inverted: smaller numerical value = brighter surface brightness).
 *    If SB > skyBackgroundMPSAS - contrastMarginMPSAS, the diffuse light blends into the bright grey sky glow.
 * 
 * 3. Compact / High-Contrast Sources (Planetary Nebulae like M57/M27, Emission Cores like M42, Dense Clusters like M13):
 *    Unlike diffuse face-on spiral galaxies, compact emission nebulae have narrow [OIII] / H-alpha line emission
 *    and small angular diameter (<2 arcmin). In 10" and 16" SCTs, high magnification darkens the exit pupil and
 *    uniform sky background while preserving object visibility. Dense globular/open clusters resolve into individual
 *    point-source stars. These objects remain observable under urban skies.
 */
export function evaluateLightPollutionVisibility(target: {
  name: string;
  type: string;
  mag: number;
  surfaceBrightness?: number;
  isCompactHighContrast?: boolean;
  bestTelescope?: string;
}): {
  isObservable: boolean;
  visibilityQuality: 'prime' | 'moderate' | 'marginal' | 'washed_out';
  contrastNote: string;
} {
  const lp = OBSERVATORY_CONFIG.lightPollution;
  const isExtended = ['galaxy', 'nebula', 'cluster'].includes(target.type);

  // 1. Point Sources (Stars, Planets, Moon, Double Stars)
  if (!isExtended || target.type === 'moon') {
    let apertureMm = 203;
    if (target.bestTelescope?.includes('16-inch')) apertureMm = 406;
    else if (target.bestTelescope?.includes('10-inch')) apertureMm = 254;

    const telescopeNELM = lp.siteNELM + 5 * Math.log10(apertureMm / 7);

    if (target.mag <= telescopeNELM - 3.0) {
      return {
        isObservable: true,
        visibilityQuality: 'prime',
        contrastNote: `Point source cuts through Bortle ${lp.bortleScale} sky glow with high signal-to-noise ratio.`,
      };
    } else if (target.mag <= telescopeNELM) {
      return {
        isObservable: true,
        visibilityQuality: 'moderate',
        contrastNote: `Point source detectable in ${apertureMm}mm telescope (limiting mag ${telescopeNELM.toFixed(1)} under site skyglow).`,
      };
    } else {
      return {
        isObservable: false,
        visibilityQuality: 'washed_out',
        contrastNote: `Apparent magnitude (${target.mag}) exceeds site telescope limiting magnitude (${telescopeNELM.toFixed(1)}).`,
      };
    }
  }

  // 2. Compact / High-Contrast Extended Objects (Planetary Nebulae, Emission Cores, Star Clusters)
  if (target.isCompactHighContrast) {
    if (target.type === 'cluster') {
      return {
        isObservable: true,
        visibilityQuality: 'prime',
        contrastNote: `Cluster point-source star members cut through Bortle ${lp.bortleScale} sky glow with sharp resolution.`,
      };
    }

    // Planetary nebulae (e.g. M57, M27) and bright emission cores (M42)
    return {
      isObservable: true,
      visibilityQuality: target.surfaceBrightness && target.surfaceBrightness <= lp.skyBackgroundMPSAS ? 'prime' : 'moderate',
      contrastNote: `Compact high-contrast emission shell (${target.surfaceBrightness} mag/arcsec²) observable under high magnification / [OIII] filtering.`,
    };
  }

  // 3. Diffuse Extended Objects (Galaxies, Wide Faint Nebulae)
  // Contrast rule: SB <= skyBackgroundMPSAS - contrastMarginMPSAS
  const sb = target.surfaceBrightness ?? 22.0;
  const contrastThreshold = lp.skyBackgroundMPSAS - lp.contrastMarginMPSAS; // e.g. 18.8 - 1.0 = 17.8 MPSAS

  if (sb <= contrastThreshold) {
    return {
      isObservable: true,
      visibilityQuality: 'moderate',
      contrastNote: `Surface brightness (${sb} mag/arcsec²) provides sufficient contrast above site sky background (${lp.skyBackgroundMPSAS} mag/arcsec²).`,
    };
  }

  // Diffuse object is washed out into the grey background skyglow
  const deltaFromSky = (sb - lp.skyBackgroundMPSAS).toFixed(1);
  return {
    isObservable: false,
    visibilityQuality: 'washed_out',
    contrastNote: `Diffuse surface brightness (${sb} mag/arcsec²) is ${deltaFromSky} mag fainter than Islamabad skyglow (~${lp.skyBackgroundMPSAS} mag/arcsec²). Washed out in telescope without dark-sky site.`,
  };
}

/**
 * Calculates all current celestial objects (Planets, Moon, Deep-Sky, Stars) for IAO,
 * applying the 35°–65° altitude filter, telescope suitability matching, and
 * the two-tier Light Pollution contrast filter.
 */
export function calculateVisibleSkyObjects(date: Date = new Date()): {
  stars: Array<SkyObject & { spectralColor: string; isVisible: boolean; isWithinWindow: boolean }>;
  planets: Array<SkyObject & { isVisible: boolean; isWithinWindow: boolean; color: string }>;
  moon: SkyObject & { isVisible: boolean; isWithinWindow: boolean; phaseFraction: number; phaseName: string };
  deepSky: Array<SkyObject & { isVisible: boolean; isWithinWindow: boolean; categoryLabel: string }>;
  observableTargets: CelestialTarget[];
  allSkyTargets: CelestialTarget[];
} {
  const observer = getObserver();
  const MIN_ALT = 35.0;
  const MAX_ALT = 65.0;

  const allSkyTargets: CelestialTarget[] = [];

  // 1. Calculate Stars & Double Stars
  const stars = BRIGHT_STARS_CATALOGUE.map((star) => {
    const hor = Astronomy.Horizon(date, observer, star.raHours, star.decDeg, 'normal');
    const altitude = parseFloat(hor.altitude.toFixed(1));
    const azimuth = parseFloat(hor.azimuth.toFixed(1));
    const isAboveHorizon = altitude > 0;
    const isWithinWindow = altitude >= MIN_ALT && altitude <= MAX_ALT;

    const targetType: 'double-star' | 'star' = star.isDouble ? 'double-star' : 'star';
    const suitability = getStarOrPlanetTelescopeSuitability(star.name, targetType, star.isDouble);
    const lpEval = evaluateLightPollutionVisibility({
      name: star.name,
      type: targetType,
      mag: star.mag,
      bestTelescope: suitability.bestTelescope,
    });

    const target: CelestialTarget = {
      id: `star-${star.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: star.name,
      catalogId: star.catalogId,
      type: targetType,
      categoryLabel: star.isDouble ? 'Binary / Multiple Star' : 'Prominent Star',
      constellation: star.constellation,
      mag: star.mag,
      altitude,
      azimuth,
      raHours: star.raHours,
      decDeg: star.decDeg,
      isWithinIAOWindow: isWithinWindow,
      isAboveHorizon,
      bestTelescope: suitability.bestTelescope,
      telescopeReason: suitability.telescopeReason,
      compatibleTelescopes: suitability.compatibleTelescopes,
      spectralColor: star.spectralColor,
      description: star.description + (star.doubleDetails ? ` (${star.doubleDetails})` : ''),
      visibilityQuality: lpEval.visibilityQuality,
      contrastNote: lpEval.contrastNote,
      isLightPollutionPass: lpEval.isObservable,
    };

    allSkyTargets.push(target);

    return {
      name: star.name,
      type: targetType,
      ra: star.raHours,
      dec: star.decDeg,
      mag: star.mag,
      altitude,
      azimuth,
      constellation: star.constellation,
      spectralColor: star.spectralColor,
      isVisible: isAboveHorizon,
      isWithinWindow,
    };
  });

  // 2. Calculate Planets
  const planetBodies = [
    { body: Astronomy.Body.Venus, name: 'Venus', color: '#fff5cc', defaultMag: -4.2, desc: 'Brilliant inner world showing prominent crescent phases.' },
    { body: Astronomy.Body.Mars, name: 'Mars', color: '#ff7a59', defaultMag: 0.2, desc: 'The Red Planet with visible dark albedo features and polar ice caps.' },
    { body: Astronomy.Body.Jupiter, name: 'Jupiter', color: '#ffd9aa', defaultMag: -2.4, desc: 'Giant gas world with atmospheric cloud belts, Great Red Spot, and 4 Galilean moons.' },
    { body: Astronomy.Body.Saturn, name: 'Saturn', color: '#eedd99', defaultMag: 0.6, desc: 'Lord of the Rings, featuring the bright ring system, Cassini Division, and moons.' },
    { body: Astronomy.Body.Mercury, name: 'Mercury', color: '#e2e8f0', defaultMag: -0.5, desc: 'Swift innermost planet with rapidly changing phases near the twilight horizon.' },
    { body: Astronomy.Body.Uranus, name: 'Uranus', color: '#a5f3fc', defaultMag: 5.7, desc: 'Ice giant visible as a subtle cyan disc in observatory telescopes.' },
    { body: Astronomy.Body.Neptune, name: 'Neptune', color: '#818cf8', defaultMag: 7.8, desc: 'Distant outermost giant glowing with deep azure hue.' },
  ];

  const planets = planetBodies.map((p) => {
    const eq = Astronomy.Equator(p.body, date, observer, true, true);
    const hor = Astronomy.Horizon(date, observer, eq.ra, eq.dec, 'normal');
    const illum = Astronomy.Illumination(p.body, date);
    const altitude = parseFloat(hor.altitude.toFixed(1));
    const azimuth = parseFloat(hor.azimuth.toFixed(1));
    const isAboveHorizon = altitude > 0;
    const isWithinWindow = altitude >= MIN_ALT && altitude <= MAX_ALT;
    const computedMag = illum ? parseFloat(illum.mag.toFixed(1)) : p.defaultMag;

    const suitability = getStarOrPlanetTelescopeSuitability(p.name, 'planet');
    const lpEval = evaluateLightPollutionVisibility({
      name: p.name,
      type: 'planet',
      mag: computedMag,
      bestTelescope: suitability.bestTelescope,
    });

    const target: CelestialTarget = {
      id: `planet-${p.name.toLowerCase()}`,
      name: p.name,
      catalogId: `Solar System Planet`,
      type: 'planet',
      categoryLabel: 'Major Planet',
      constellation: '', // Dynamically placed in current zodiac
      mag: computedMag,
      altitude,
      azimuth,
      raHours: eq.ra,
      decDeg: eq.dec,
      isWithinIAOWindow: isWithinWindow,
      isAboveHorizon,
      bestTelescope: suitability.bestTelescope,
      telescopeReason: suitability.telescopeReason,
      compatibleTelescopes: suitability.compatibleTelescopes,
      color: p.color,
      description: p.desc,
      visibilityQuality: lpEval.visibilityQuality,
      contrastNote: lpEval.contrastNote,
      isLightPollutionPass: lpEval.isObservable,
    };

    allSkyTargets.push(target);

    return {
      name: p.name,
      type: 'planet' as const,
      ra: eq.ra,
      dec: eq.dec,
      mag: computedMag,
      altitude,
      azimuth,
      color: p.color,
      isVisible: isAboveHorizon,
      isWithinWindow,
    };
  });

  // 3. Calculate Moon
  const moonEq = Astronomy.Equator(Astronomy.Body.Moon, date, observer, true, true);
  const moonHor = Astronomy.Horizon(date, observer, moonEq.ra, moonEq.dec, 'normal');
  const moonIllum = Astronomy.Illumination(Astronomy.Body.Moon, date);
  const moonAltitude = parseFloat(moonHor.altitude.toFixed(1));
  const moonAzimuth = parseFloat(moonHor.azimuth.toFixed(1));
  const moonIsAboveHorizon = moonAltitude > 0;
  const moonIsWithinWindow = moonAltitude >= MIN_ALT && moonAltitude <= MAX_ALT;
  const moonCalc = calculateMoonData(date);
  const moonPhaseName = moonCalc ? moonCalc.phaseName : 'Moon';

  const moonSuitability = getStarOrPlanetTelescopeSuitability('Moon', 'moon');
  const moonLpEval = evaluateLightPollutionVisibility({
    name: 'Moon',
    type: 'moon',
    mag: -12.0,
    bestTelescope: moonSuitability.bestTelescope,
  });

  const moonTarget: CelestialTarget = {
    id: 'lunar-moon',
    name: 'The Moon',
    catalogId: `Phase: ${moonPhaseName} (${Math.round(moonIllum.phase_fraction * 100)}%)`,
    type: 'moon',
    categoryLabel: 'Natural Satellite',
    constellation: '',
    mag: -12.0,
    altitude: moonAltitude,
    azimuth: moonAzimuth,
    raHours: moonEq.ra,
    decDeg: moonEq.dec,
    isWithinIAOWindow: moonIsWithinWindow,
    isAboveHorizon: moonIsAboveHorizon,
    bestTelescope: moonSuitability.bestTelescope,
    telescopeReason: moonSuitability.telescopeReason,
    compatibleTelescopes: moonSuitability.compatibleTelescopes,
    phaseFraction: moonIllum.phase_fraction,
    description: `Currently ${Math.round(moonIllum.phase_fraction * 100)}% illuminated (${moonPhaseName}). Prime lunar terminator details visible.`,
    visibilityQuality: moonLpEval.visibilityQuality,
    contrastNote: moonLpEval.contrastNote,
    isLightPollutionPass: moonLpEval.isObservable,
  };

  allSkyTargets.push(moonTarget);

  const moon = {
    name: 'Moon',
    type: 'moon' as const,
    ra: moonEq.ra,
    dec: moonEq.dec,
    mag: -12.0,
    altitude: moonAltitude,
    azimuth: moonAzimuth,
    isVisible: moonIsAboveHorizon,
    isWithinWindow: moonIsWithinWindow,
    phaseFraction: moonIllum.phase_fraction,
    phaseName: moonPhaseName,
  };

  // 4. Calculate Deep-Sky Objects
  const deepSky = DEEP_SKY_CATALOGUE.map((dso) => {
    const hor = Astronomy.Horizon(date, observer, dso.raHours, dso.decDeg, 'normal');
    const altitude = parseFloat(hor.altitude.toFixed(1));
    const azimuth = parseFloat(hor.azimuth.toFixed(1));
    const isAboveHorizon = altitude > 0;
    const isWithinWindow = altitude >= MIN_ALT && altitude <= MAX_ALT;

    const lpEval = evaluateLightPollutionVisibility({
      name: dso.name,
      type: dso.type,
      mag: dso.mag,
      surfaceBrightness: dso.surfaceBrightness,
      isCompactHighContrast: dso.isCompactHighContrast,
      bestTelescope: dso.bestTelescope,
    });

    const target: CelestialTarget = {
      id: dso.id,
      name: dso.name,
      catalogId: dso.catalogId,
      type: dso.type,
      categoryLabel: dso.categoryLabel,
      constellation: dso.constellation,
      mag: dso.mag,
      surfaceBrightness: dso.surfaceBrightness,
      altitude,
      azimuth,
      raHours: dso.raHours,
      decDeg: dso.decDeg,
      isWithinIAOWindow: isWithinWindow,
      isAboveHorizon,
      bestTelescope: dso.bestTelescope,
      telescopeReason: dso.telescopeReason,
      compatibleTelescopes: dso.compatibleTelescopes,
      description: dso.description,
      visibilityQuality: lpEval.visibilityQuality,
      contrastNote: lpEval.contrastNote,
      isLightPollutionPass: lpEval.isObservable,
    };

    allSkyTargets.push(target);

    return {
      name: dso.name,
      type: dso.type,
      ra: dso.raHours,
      dec: dso.decDeg,
      mag: dso.mag,
      altitude,
      azimuth,
      constellation: dso.constellation,
      categoryLabel: dso.categoryLabel,
      isVisible: isAboveHorizon,
      isWithinWindow,
    };
  });

  // 5. Filter for ONLY targets strictly within IAO's 35°–65° observing window AND passing the Light Pollution contrast filter
  const observableTargets = allSkyTargets
    .filter((target) => target.isWithinIAOWindow && target.bestTelescope && target.isLightPollutionPass)
    .sort((a, b) => {
      // Prioritize Moon and Planets first, then by visual magnitude
      const typeRank = (t: string) => {
        if (t === 'moon') return 1;
        if (t === 'planet') return 2;
        if (t === 'nebula' || t === 'galaxy' || t === 'cluster') return 3;
        return 4;
      };
      const rankDiff = typeRank(a.type) - typeRank(b.type);
      if (rankDiff !== 0) return rankDiff;
      return a.mag - b.mag;
    });

  return {
    stars,
    planets,
    moon,
    deepSky,
    observableTargets,
    allSkyTargets,
  };
}
