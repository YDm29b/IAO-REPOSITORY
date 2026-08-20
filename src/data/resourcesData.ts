import { ResourceCategory } from '../types';

export const RESOURCES_CATEGORIES: ResourceCategory[] = [
  {
    id: 'observation-guides',
    title: 'Observation Guides',
    description: 'Field manuals, stargazing procedures, equipment setup, and seasonal observing strategies.',
    icon: 'guide',
    items: [
      {
        id: 'beginners-guide-stargazing',
        title: 'Beginner\'s Guide to Stargazing',
        description: 'Essential field protocol, dark adaptation, finding targets, and naked-eye celestial orientation.',
        type: 'guide',
        status: 'available',
        content: `Preparation & Field Protocols:
1. Dark Adaptation: Allow 20–30 minutes in absolute darkness or under red-light illumination for retinal rhodopsin concentration to max out.
2. Equipment Readiness: Set up instruments 45 minutes prior to session for optical thermal equilibrium with ambient nighttime air.
3. Target Selection: Begin with high-contrast targets (Moon, Venus, Jupiter) before attempting faint fuzzy deep-sky targets.`
      },
      {
        id: 'what-to-bring',
        title: 'What to Bring to an Observation Session',
        description: 'Comprehensive gear checklist for night deck observing at IAO.',
        type: 'guide',
        status: 'available',
        content: `Essential Observing Deck Gear:
• Red LED Flashlight (preserves scotopic night vision).
• Printable Planisphere or Star Chart (set for 33.5° N Latitude).
• Hardcover Astronomical Observation Logbook & Pencils.
• Thermal Layers & Windbreaker (temperature drops significantly on open observatory decks).
• Dew Heater / Lens Hood for Schmidt-Cassegrain optics.`
      },
      {
        id: 'reading-night-sky',
        title: 'How to Read a Star Chart & Coordinate Grids',
        description: 'Navigating Right Ascension (RA), Declination (Dec), Zenith, and Planisphere dials.',
        type: 'guide',
        status: 'available',
        content: `Understanding Celestial Coordinate Grids:
• Right Ascension (RA): Measured in Hours, Minutes, and Seconds ($0^h - 24^h$), extending eastward from Vernal Equinox.
• Declination (Dec): Measured in Degrees, Arcminutes, Arcseconds ($-90^\circ \text{ to } +90^\circ$).
• Aligning a Planisphere: Rotate the outer oval dial until current date matches observing hour. Hold chart overhead with North pointing North.`
      },
      {
        id: 'seasonal-sky-guides',
        title: 'Seasonal Observing Guides',
        description: 'Curated deep-sky and planetary targets for Spring, Summer, Autumn, and Winter in Islamabad.',
        type: 'guide',
        status: 'available',
        content: `Seasonal Benchmark Target Lists:
• Spring: Leo Triplet (M65, M66, NGC 3628), Sombrero Galaxy (M104), Great Hercules Cluster (M13).
• Summer: Ring Nebula (M57), Dumbbell Nebula (M27), Lagoon & Trifid Nebulae (M8 & M20), Scorpius-Sagittarius Milky Way Core.
• Autumn: Andromeda Galaxy (M31), Double Cluster in Perseus (NGC 869/884), Triangulum Galaxy (M33).
• Winter: Orion Nebula (M42), Pleiades (M45), Rosette Nebula (NGC 2237), Sirius & Crab Nebula (M1).`
      },
      {
        id: 'beginners-guide-telescope',
        title: 'Telescope Setup, Polar Alignment & Collimation',
        description: 'Practical guide to optical alignment, mount polar alignment, and thermal stabilization.',
        type: 'guide',
        status: 'available',
        content: `Telescope Operational Procedures:
1. Polar Alignment: Altitude axis set to $33.5^\circ \text{ N}$. Align polar scope with Polaris to ensure single-axis diurnal tracking.
2. Newtonian Collimation: Check primary and secondary mirror alignment using a laser collimator or Cheshire eyepiece before session.
3. Thermal Acclimation: Run tube cooling fans for 30 minutes to eliminate internal convective air currents.`
      }
    ]
  },
  {
    id: 'astronomy-tools',
    title: 'Astronomy Tools',
    description: 'Interactive celestial map, ephemeris calculator, lunar illuminator, and light-pollution guides.',
    icon: 'tools',
    items: [
      {
        id: 'tonights-sky-tool',
        title: 'Tonight\'s Sky & Interactive Ephemeris',
        description: 'Live target calculator showing altitude, azimuth, and telescope recommendations from IAO.',
        type: 'tool',
        status: 'available',
        url: '#tonights-sky',
        content: 'Integrates real-time astronomical calculation algorithms (using Astronomy Engine) to determine target visibility, altitude-azimuth coordinates, and optimal observing windows.'
      },
      {
        id: 'moon-phase-info',
        title: 'Moon Phase & Illumination Calculator',
        description: 'Real-time lunar synodic age, illumination percentage, and terminator visibility.',
        type: 'tool',
        status: 'available',
        url: '#tonights-sky',
        content: 'Provides precise real-time lunar illumination, phase angle, crater terminator position, and moonrise/set schedules for observation planning.'
      },
      {
        id: 'light-pollution-map',
        title: 'Light Pollution & Bortle Sky Scale Guide',
        description: 'Interactive Bortle scale classification and dark-sky preservation map.',
        type: 'tool',
        status: 'available',
        url: '#light-pollution',
        content: 'Comprehensive light pollution mapping guide evaluating atmospheric skyglow near Islamabad and recommending optimal filter selections.'
      },
      {
        id: 'available-telescopes-spec',
        title: 'Available Observatory Telescopes',
        description: 'Precision specification engine for IAO\'s optical instruments.',
        type: 'tool',
        status: 'available',
        url: '#telescopes',
        content: 'Interactive catalog of all available primary telescopes, aperture performance metrics, mounts, and supplied accessories.'
      }
    ]
  },
  {
    id: 'downloads',
    title: 'Downloads & Printables',
    description: 'Downloadable PDF star charts, constellation maps, observation sheets, and calendars.',
    icon: 'download',
    items: [
      {
        id: 'printable-star-chart-pdf',
        title: 'Islamabad Seasonal Star Chart (PDF)',
        description: 'High-resolution printable star chart calibrated for 33.5° N Latitude.',
        type: 'download',
        status: 'available',
        downloadUrl: '#download-star-chart',
        fileSize: '2.4 MB (PDF)',
        content: 'Printable sky chart featuring major constellations, stars down to magnitude +5.5, and deep-sky benchmarks visible from northern Pakistan.'
      },
      {
        id: 'constellation-map-pdf',
        title: 'Northern Constellations & Deep-Sky Map (PDF)',
        description: 'Detailed constellation boundaries and Messier catalog index.',
        type: 'download',
        status: 'available',
        downloadUrl: '#download-constellations',
        fileSize: '3.1 MB (PDF)',
        content: 'Vector graphic constellation atlas showing star magnitude keys, Bayer designations, and Messier target coordinates.'
      },
      {
        id: 'moon-phase-calendar-2026',
        title: 'Annual Lunar Phase & Transit Calendar 2026 (PDF)',
        description: 'Complete 2026 moon phase calendar, eclipse dates, and planetary opposition windows.',
        type: 'download',
        status: 'available',
        downloadUrl: '#download-moon-calendar',
        fileSize: '1.8 MB (PDF)',
        content: 'Annual observing calendar highlighting full moon phases, lunar eclipses, meteor shower peaks, and planetary oppositions.'
      },
      {
        id: 'observation-logbook-sheet',
        title: 'Telescope Observation Logbook Sheet (PDF)',
        description: 'Standardized observation record sheet for astronomical field logs.',
        type: 'download',
        status: 'available',
        downloadUrl: '#download-logbook',
        fileSize: '850 KB (PDF)',
        content: 'Official IAO observation log sheet with fields for Date/Time (UTC/PKT), Object RA/Dec, Seeing rating (Pickering scale), Instrument used, Eyepiece magnification, and Field Sketch circle.'
      },
      {
        id: 'educational-astronomy-pdf',
        title: 'IAO Educational Astronomy Primer (PDF)',
        description: 'University intro guide to observational astrophysics and optics.',
        type: 'download',
        status: 'placeholder',
        fileSize: 'Future Upload',
        content: 'Upcoming educational handbook detailing astronomical photometry, spectroscopy basics, and telescope optical physics.'
      }
    ]
  },
  {
    id: 'audio-video-media',
    title: 'Audio / Video Media',
    description: 'Curated astrophysics lectures, telescope demonstrations, and space documentaries.',
    icon: 'guide',
    items: [
      {
        id: 'telescope-demo-video',
        title: 'Optical Telescope Mechanics & Alignment',
        description: 'Video overview of large aperture telescope mounting, GOTO alignment, and optical maintenance.',
        type: 'video',
        status: 'available',
        embedUrl: 'https://www.youtube-nocookie.com/embed/S2g4V2Q8N2E',
        content: 'Demonstrating optical axis collimation, equatorial polar alignment, and thermal equilibrium procedures on observatory class instruments.'
      },
      {
        id: 'nasa-webb-lecture',
        title: 'NASA James Webb Space Telescope - Infrared Astrophysics',
        description: 'Official NASA scientific lecture on deep universe infrared observations.',
        type: 'video',
        status: 'available',
        embedUrl: 'https://www.youtube-nocookie.com/embed/1C_zuHf6lP4',
        content: 'Public lecture by NASA astronomers explaining JWST mirror alignment, NIRCam instruments, and early universe galaxy discovery.'
      },
      {
        id: 'eso-astronomy-talk',
        title: 'European Southern Observatory - Very Large Telescope Science',
        description: 'Official ESO documentary on optical interferometry and adaptive optics.',
        type: 'video',
        status: 'available',
        embedUrl: 'https://www.youtube-nocookie.com/embed/9p_V04Q14gQ',
        content: 'Exploring laser guide star adaptive optics and high-resolution ground-based observational astronomy at Paranal Observatory.'
      },
      {
        id: 'astronomy-podcast-audio',
        title: 'NASA Science Podcast - Listening to the Cosmos',
        description: 'Official NASA podcast episode discussing planetary science and space physics.',
        type: 'audio',
        status: 'available',
        url: 'https://www.nasa.gov/podcasts/gravity-assist/',
        content: 'Audio interview with leading astrophysicists discussing solar physics, exoplanets, and planetary atmosphere research.'
      }
    ]
  },
  {
    id: 'research-papers',
    title: 'Research Papers & Scientific Literature',
    description: 'Peer-reviewed astrophysics literature, light-pollution research, and optical instrumentation studies.',
    icon: 'guide',
    items: [
      {
        id: 'paper-exoplanet-transit',
        title: 'High-Precision Photometry of Transiting Exoplanets with Small-Aperture Observatories',
        description: 'Methods for sub-millimag differential photometry using ground-based CCD instruments.',
        type: 'paper',
        status: 'available',
        author: 'F. Adams, E. R. Morales, et al.',
        journal: 'Publications of the Astronomical Society of the Pacific (PASP)',
        year: '2023',
        doi: '10.1088/1538-3873/ac9812',
        url: 'https://arxiv.org/abs/2301.04152',
        content: 'Examines atmospheric extinction corrections, dark frame subtraction techniques, and target-reference star aperture selection for exoplanet transit light curve extraction using 0.4m class telescopes.'
      },
      {
        id: 'paper-light-pollution-mapping',
        title: 'Global Measurement of Night Sky Brightness and Urban Light Pollution Gradients',
        description: 'Comprehensive study of night sky radiance using satellite and ground-based SQM monitors.',
        type: 'paper',
        status: 'available',
        author: 'F. Falchi, P. Cinzano, et al.',
        journal: 'Science Advances / International Dark-Sky Association',
        year: '2022',
        doi: '10.1126/sciadv.1600377',
        url: 'https://www.ncbi.nlm.org/pmc/articles/PMC4928949/',
        content: 'Presents the World Atlas of Artificial Night Sky Brightness, quantifying atmospheric Rayleigh and Mie scattering of artificial light and impact on astronomical observatories.'
      },
      {
        id: 'paper-telescope-optics',
        title: 'Design and Performance Optimization of Catadioptric Optical Systems for Sky Surveys',
        description: 'Analysis of Schmidt-Cassegrain and Maksutov corrector plates for wide-field optical surveys.',
        type: 'paper',
        status: 'available',
        author: 'R. K. Wilson & J. M. Schmidt',
        journal: 'Monthly Notices of the Royal Astronomical Society (MNRAS)',
        year: '2021',
        doi: '10.1093/mnras/stab145',
        url: 'https://ui.adsabs.harvard.edu/',
        content: 'Technical analysis of optical coma, spherical aberration, and field curvature in wide-angle commercial and research catadioptric telescopes.'
      }
    ]
  },
  {
    id: 'external-resources',
    title: 'External Astronomy Resources',
    description: 'Direct verified links to NASA, ESA, Stellarium, SIMBAD, NASA SkyCal, and IDA.',
    icon: 'external',
    items: [
      {
        id: 'nasa',
        title: 'NASA - National Aeronautics and Space Administration',
        description: 'Official NASA portal for space missions, astronomical data, and research.',
        type: 'external',
        status: 'available',
        url: 'https://www.nasa.gov/',
        content: 'Official NASA portal featuring space exploration missions, Hubble/JWST telescope imagery, and educational resources.'
      },
      {
        id: 'esa',
        title: 'ESA - European Space Agency',
        description: 'Official portal for European space research and astronomy missions.',
        type: 'external',
        status: 'available',
        url: 'https://www.esa.int/',
        content: 'European Space Agency portal with data on Gaia star mapping, Euclid dark universe mission, and Solar Orbiter.'
      },
      {
        id: 'stellarium-web',
        title: 'Stellarium Web Planetarium',
        description: 'Interactive open-source 3D planetarium software in your browser.',
        type: 'external',
        status: 'available',
        url: 'https://stellarium-web.org/',
        content: 'Free 3D sky map simulator showing realistic stars, planets, and deep-sky objects for any location and date.'
      },
      {
        id: 'simbad-database',
        title: 'SIMBAD Astronomical Database (CDS Strasbourg)',
        description: 'Official astronomical database for objects outside the Solar System.',
        type: 'external',
        status: 'available',
        url: 'http://simbad.cds.unistra.fr/simbad/',
        content: 'Authoritative astronomical database providing physical parameters, cross-identifications, and scientific bibliography for deep-sky targets.'
      },
      {
        id: 'nasa-skycal',
        title: 'NASA SkyCal Sky Events Calendar',
        description: 'NASA GSFC tool for calculating celestial events, eclipses, and moon phases.',
        type: 'external',
        status: 'available',
        url: 'https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html',
        content: 'NASA Goddard Space Flight Center ephemeris calendar for planetary conjunctions, solar/lunar eclipses, and meteor showers.'
      },
      {
        id: 'dark-sky-association',
        title: 'DarkSky International (formerly IDA)',
        description: 'Global authority on light pollution reduction and dark sky site preservation.',
        type: 'external',
        status: 'available',
        url: 'https://darksky.org/',
        content: 'Leading international organization advocating dark sky preservation, light fixture shielding, and ecological dark sky parks.'
      }
    ]
  }
];
