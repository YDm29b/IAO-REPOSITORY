import { ResourceCategory, ResourceItem } from '../types';

export const RESOURCES_CATEGORIES: ResourceCategory[] = [
  {
    id: 'observation-guides',
    title: 'Observation Guides',
    description: 'Practical guides for stargazing and telescope use',
    icon: 'guide',
    items: [
      {
        id: 'beginners-guide-stargazing',
        title: 'Beginner\'s Guide to Stargazing',
        description: 'Essential tips and techniques for your first stargazing sessions',
        type: 'guide',
        status: 'placeholder',
        content: 'A comprehensive guide covering equipment selection, finding dark sky locations, basic constellation identification, and tips for your first observing sessions.'
      },
      {
        id: 'what-to-bring',
        title: 'What to Bring to an Observation Session',
        description: 'Checklist of essential items for a successful observation session',
        type: 'guide',
        status: 'placeholder',
        content: 'Detailed checklist including appropriate clothing, red-light flashlights, star charts, notebooks, and other essentials for comfortable and productive observing sessions.'
      },
      {
        id: 'reading-night-sky',
        title: 'How to Read the Night Sky',
        description: 'Understanding star charts, coordinates, and sky orientation',
        type: 'guide',
        status: 'placeholder',
        content: 'Learn to interpret star charts, understand celestial coordinates (right ascension and declination), and orient yourself under the night sky.'
      },
      {
        id: 'seasonal-sky-guides',
        title: 'Seasonal Sky Guides',
        description: 'What to observe in each season from Islamabad',
        type: 'guide',
        status: 'placeholder',
        content: 'Seasonal guides highlighting the best objects to observe during each season, including prominent constellations, planets, and deep-sky objects visible from Islamabad.'
      },
      {
        id: 'beginners-guide-telescope',
        title: 'Beginner\'s Guide to Using a Telescope',
        description: 'Basic telescope operation and alignment techniques',
        type: 'guide',
        status: 'placeholder',
        content: 'Step-by-step instructions for setting up and using your first telescope, including alignment, focusing, and basic observation techniques.'
      }
    ]
  },
  {
    id: 'star-charts-downloads',
    title: 'Star Charts & Downloads',
    description: 'Printable materials and downloadable resources',
    icon: 'download',
    items: [
      {
        id: 'printable-star-charts',
        title: 'Printable Star Charts',
        description: 'Downloadable star charts for the current season',
        type: 'download',
        status: 'placeholder',
        content: 'Printable star charts optimized for viewing from Islamabad, featuring major constellations and bright stars visible in the current season.'
      },
      {
        id: 'moon-phase-calendar',
        title: 'Moon Phase Calendar',
        description: 'Downloadable calendar showing moon phases for the year',
        type: 'download',
        status: 'placeholder',
        content: 'Annual moon phase calendar indicating full moons, new moons, and optimal observing windows for each month.'
      },
      {
        id: 'constellation-maps',
        title: 'Constellation Maps',
        description: 'Detailed constellation maps with major stars and deep-sky objects',
        type: 'download',
        status: 'placeholder',
        content: 'High-resolution constellation maps showing star patterns, major stars, and notable deep-sky objects for each constellation.'
      },
      {
        id: 'observation-checklist',
        title: 'Observation Checklist',
        description: 'Printable checklist for observation sessions',
        type: 'download',
        status: 'placeholder',
        content: 'Comprehensive observation checklist covering equipment preparation, site selection, weather considerations, and observation planning.'
      },
      {
        id: 'telescope-observation-sheets',
        title: 'Telescope Observation Sheets',
        description: 'Record sheets for documenting your observations',
        type: 'download',
        status: 'placeholder',
        content: 'Printable observation log sheets for recording object details, observing conditions, equipment used, and sketching what you observe.'
      }
    ]
  },
  {
    id: 'astronomy-tools',
    title: 'Astronomy Tools',
    description: 'Interactive tools and calculators for astronomers',
    icon: 'tools',
    items: [
      {
        id: 'tonights-sky',
        title: 'Tonight\'s Sky / Visible Objects',
        description: 'Interactive map showing objects visible tonight from Islamabad',
        type: 'tool',
        status: 'available',
        url: '#tonights-sky',
        content: 'Live interactive tool showing celestial objects currently visible from IAO, including planets, major stars, and deep-sky objects with real-time position data.'
      },
      {
        id: 'moon-phase-info',
        title: 'Moon Phase Information',
        description: 'Current moon phase and illumination data',
        type: 'tool',
        status: 'available',
        url: '#tonights-sky',
        content: 'Real-time moon phase calculator showing current illumination, age, and position information for optimal observing planning.'
      },
      {
        id: 'altitude-azimuth',
        title: 'Altitude/Azimuth Information',
        description: 'Celestial object position calculator',
        type: 'tool',
        status: 'available',
        url: '#tonights-sky',
        content: 'Interactive tool for calculating altitude and azimuth coordinates of celestial objects from your observing location.'
      },
      {
        id: 'observation-planner',
        title: 'Observation Planner',
        description: 'Plan your observation sessions based on conditions',
        type: 'tool',
        status: 'placeholder',
        content: 'Tool to help plan observation sessions based on weather conditions, moon phase, and object visibility for optimal observing opportunities.'
      },
      {
        id: 'light-pollution-map',
        title: 'Light Pollution Information/Map',
        description: 'Interactive light pollution map and Bortle scale data',
        type: 'tool',
        status: 'available',
        url: '#light-pollution',
        content: 'Comprehensive light pollution guide with Bortle scale information and dark sky site recommendations around Islamabad.'
      }
    ]
  },
  {
    id: 'iao-materials',
    title: 'IAO Observation Materials',
    description: 'Observatory-specific guides and resources',
    icon: 'observatory',
    items: [
      {
        id: 'iao-observation-guides',
        title: 'IAO Observation Guides',
        description: 'Official guides for observing at IAO',
        type: 'guide',
        status: 'placeholder',
        content: 'Official IAO guides covering observatory procedures, equipment usage, and best practices for observation sessions at the IST Astronomical Observatory.'
      },
      {
        id: 'telescope-specifications',
        title: 'Telescope Specifications',
        description: 'Detailed specifications for IAO telescopes',
        type: 'guide',
        status: 'available',
        url: '#telescopes',
        content: 'Complete specifications and capabilities for all telescopes available at IAO, including aperture, focal length, and recommended targets.'
      },
      {
        id: 'session-guidelines',
        title: 'Observation Session Guidelines',
        description: 'Guidelines and protocols for observation sessions',
        type: 'guide',
        status: 'placeholder',
        content: 'Official guidelines for observation sessions including safety protocols, equipment handling, and observatory etiquette.'
      },
      {
        id: 'observatory-policies',
        title: 'Observatory Policies and Guidelines',
        description: 'Official IAO policies and operational guidelines',
        type: 'guide',
        status: 'placeholder',
        content: 'Comprehensive policy document covering observatory access, usage rules, safety procedures, and administrative guidelines for IAO visitors.'
      },
      {
        id: 'student-materials',
        title: 'Student Observation Materials',
        description: 'Educational materials for student observation programs',
        type: 'guide',
        status: 'placeholder',
        content: 'Educational resources and worksheets designed for student observation programs, including observation logs and learning objectives.'
      },
      {
        id: 'research-links',
        title: 'Research and Publication Links',
        description: 'Links to IAO research publications and collaborations',
        type: 'external',
        status: 'placeholder',
        content: 'Links to research publications, collaborative projects, and academic work conducted at or in partnership with IAO.'
      }
    ]
  },
  {
    id: 'external-resources',
    title: 'External Astronomy Resources',
    description: 'Curated links to reputable astronomy resources',
    icon: 'external',
    items: [
      {
        id: 'nasa',
        title: 'NASA',
        description: 'National Aeronautics and Space Administration',
        type: 'external',
        status: 'available',
        url: 'https://www.nasa.gov/',
        content: 'Official NASA website featuring the latest space news, mission updates, educational resources, and stunning imagery from space exploration.'
      },
      {
        id: 'esa',
        title: 'ESA',
        description: 'European Space Agency',
        type: 'external',
        status: 'available',
        url: 'https://www.esa.int/',
        content: 'European Space Agency website with information on European space missions, research programs, and educational resources.'
      },
      {
        id: 'stellarium',
        title: 'Stellarium',
        description: 'Free open-source planetarium software',
        type: 'external',
        status: 'available',
        url: 'https://stellarium.org/',
        content: 'Stellarium is a free open-source planetarium software that shows a realistic sky in 3D, perfect for planning observation sessions.'
      },
      {
        id: 'simbad',
        title: 'SIMBAD',
        description: 'Astronomical database for objects outside the solar system',
        type: 'external',
        status: 'available',
        url: 'http://simbad.u-strasbg.fr/simbad/',
        content: 'SIMBAD is an astronomical database that provides basic data, cross-identifications, and bibliography for astronomical objects outside the solar system.'
      },
      {
        id: 'nasa-skycal',
        title: 'NASA SkyCal',
        description: 'NASA Sky Events Calendar',
        type: 'external',
        status: 'available',
        url: 'https://eclipse.gsfc.nasa.gov/SKYCAL/SKYCAL.html',
        content: 'NASA\'s Sky Events Calendar showing daily sky events including moon phases, meteor showers, and planetary configurations.'
      },
      {
        id: 'dark-sky-association',
        title: 'International Dark-Sky Association',
        description: 'Organization dedicated to preserving dark skies',
        type: 'external',
        status: 'available',
        url: 'https://www.darksky.org/',
        content: 'International Dark-Sky Association works to protect the night sky from light pollution through education and advocacy.'
      }
    ]
  }
];
