/**
 * IST Astronomical Observatory (IAO) - Central Configuration
 * 
 * AUDIT NOTICE:
 * All external links, contact numbers, map URLs, social links, and coordinates
 * in this file are temporary development placeholders until officially confirmed
 * and provided by the IAO administrative leadership.
 */

export const OBSERVATORY_CONFIG = {
  name: 'IST Astronomical Observatory',
  shortName: 'IAO',
  institution: 'Institute of Space Technology (IST)',
  city: 'Islamabad',
  country: 'Pakistan',
  
  /**
   * IAO Coordinates (Confirmed On-Site GPS Survey)
   * Exact rooftop coordinates: 33°31'11.0"N 73°10'32.2"E
   */
  coordinates: {
    latitude: 33.519722, // Degrees North (Confirmed On-Site GPS: 33°31'11.0"N)
    longitude: 73.175611, // Degrees East (Confirmed On-Site GPS: 73°10'32.2"E)
    elevationMeters: 540,
    isConfirmed: true, // Confirmed via on-site GPS measurement
    note: 'Official on-site GPS coordinates: 33°31\'11.0"N 73°10\'32.2"E (IST Islamabad)',
  },

  /**
   * IAO Light Pollution & Sky Background Brightness (Confirmed 2025 Reading)
   * Source: lightpollutionmap.info at confirmed IAO GPS coordinates (33.519722°N, 73.175611°E).
   * 
   * Measurement: Mean sky brightness above 30° altitude = 19.11 mag/arcsec² (Bortle Class 6).
   * (Chosen over raw zenith value to match IAO's 35°–65° usable observing altitude range).
   * 
   * Historical Baseline: 2016 reading at this site was 19.89 mag/arcsec² (Bortle 5),
   * documenting roughly 8.5%/year sky brightness degradation over the decade.
   */
  lightPollution: {
    bortleScale: 6,
    skyBackgroundMPSAS: 19.11, // mag/arcsec² (mean sky brightness above 30° altitude)
    siteNELM: 5.0, // Naked-Eye Limiting Magnitude for point sources (Bortle 6)
    contrastMarginMPSAS: 1.0, // Minimum contrast required: SB <= skyBackgroundMPSAS - contrastMargin
    isConfirmed: true, // Confirmed 2025 reading from lightpollutionmap.info
    note: 'Source: lightpollutionmap.info (2025 reading, mean >30° alt: 19.11 MPSAS / Bortle 6). 2016 baseline was 19.89 MPSAS (Bortle 5), showing ~8.5%/yr degradation.',
  },

  /**
   * Observing Window Rule for Hero Moon
   * Moon is displayed in the hero scene only when altitude is between min and max altitude.
   */
  heroMoonAltitudeRange: {
    minDegrees: 35,
    maxDegrees: 65,
  },

  /**
   * Virtual Astronomy Observatory (VAO) External Link
   * Placeholder URL pending official IAO VAO deployment
   */
  VAO_URL: 'https://vao.ist.edu.pk',

  /**
   * Google Maps Location URL for IAO
   * Placeholder URL pending official IAO Google Maps pin
   */
  GOOGLE_MAPS_URL: 'https://maps.google.com/?q=Institute+of+Space+Technology+Islamabad',
  
  /**
   * Google Maps Embed URL
   * Placeholder campus map embed
   */
  GOOGLE_MAPS_EMBED_URL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13295.385217992984!2d73.16335343476906!3d33.522238472506894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfec069f1a0d3f%3A0x6b772093557e4e08!2sInstitute%20of%20Space%20Technology%20(IST)!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s',

  /**
   * Social Media Channels
   * Placeholder handles pending official IAO social accounts
   */
  socialLinks: {
    facebook: 'https://facebook.com/istobservatory',
    instagram: 'https://instagram.com/istobservatory',
    x: 'https://x.com/istobservatory',
    youtube: 'https://youtube.com/@istobservatory',
  },

  /**
   * Contact and Inquiries
   * Placeholder contact details pending official IAO confirmation
   */
  contact: {
    email: 'iao@ist.edu.pk',
    phone: '+92 51 9075100',
    address: 'Institute of Space Technology, 1 Toll Plaza, Islamabad Expressway, Islamabad 44000, Pakistan',
  },

  /**
   * Institutional Partners & Parent Bodies
   */
  partners: [
    {
      name: 'Space & Astronomy Research Lab (SARL)',
      short: 'SARL',
      url: 'https://sarl.ist.edu.pk',
    },
    {
      name: 'National Center of GIS and Space Applications (NCGSA)',
      short: 'NCGSA',
      url: 'https://ncgsa.org.pk',
    },
    {
      name: 'Institute of Space Technology (IST)',
      short: 'IST',
      url: 'https://ist.edu.pk',
    },
    {
      name: 'Pakistan Space & Upper Atmosphere Research Commission (SUPARCO)',
      short: 'SUPARCO',
      url: 'https://suparco.gov.pk',
    },
  ],
};
