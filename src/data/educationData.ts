import { EducationTopic, EducationSubtopic } from '../types';

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: 'astronomy-basics',
    title: 'Astronomy Basics',
    description: 'Learn about the fundamental objects and phenomena in our universe',
    icon: 'star',
    category: 'basics',
    subtopics: [
      {
        id: 'stars',
        title: 'Stars',
        description: 'Understanding stellar evolution, classification, and life cycles',
        content: 'Stars are massive luminous spheres of plasma held together by gravity. They range from tiny red dwarfs to massive supergiants, and their life cycles depend on their mass.'
      },
      {
        id: 'planets',
        title: 'Planets',
        description: 'Explore the planets of our solar system and beyond',
        content: 'Planets are celestial bodies orbiting stars. In our solar system, we have eight planets divided into terrestrial and gas giant categories.'
      },
      {
        id: 'galaxies',
        title: 'Galaxies',
        description: 'Discover the structure and types of galaxies in the universe',
        content: 'Galaxies are massive systems containing stars, gas, dust, and dark matter bound together by gravity. They come in various shapes including spiral, elliptical, and irregular.'
      },
      {
        id: 'nebulae',
        title: 'Nebulae',
        description: 'Learn about stellar nurseries and the birthplaces of stars',
        content: 'Nebulae are vast clouds of gas and dust in space. They serve as the birthplaces of stars and planetary systems, and can be emission, reflection, or dark nebulae.'
      },
      {
        id: 'star-clusters',
        title: 'Star Clusters',
        description: 'Understanding groups of stars that formed together',
        content: 'Star clusters are groups of stars that formed from the same molecular cloud. They come in two main types: open clusters (loose groups of young stars) and globular clusters (dense spherical groups of old stars).'
      }
    ]
  },
  {
    id: 'understanding-telescopes',
    title: 'Understanding Telescopes',
    description: 'Learn how telescopes work and the key specifications to understand',
    icon: 'telescope',
    category: 'telescopes',
    subtopics: [
      {
        id: 'how-telescopes-work',
        title: 'How Telescopes Work',
        description: 'The optical principles behind astronomical telescopes',
        content: 'Telescopes collect light from distant objects and focus it to form an image. They use either lenses (refractors) or mirrors (reflectors) to gather and concentrate light.'
      },
      {
        id: 'aperture',
        title: 'Aperture',
        description: 'Why aperture is the most important telescope specification',
        content: 'Aperture is the diameter of the main lens or mirror. Larger apertures collect more light, allowing you to see fainter objects and resolve finer details.'
      },
      {
        id: 'focal-length',
        title: 'Focal Length',
        description: 'Understanding focal length and its effect on magnification',
        content: 'Focal length determines the telescope\'s magnification and field of view. Longer focal lengths provide higher magnification but narrower fields of view.'
      },
      {
        id: 'telescope-types',
        title: 'Telescope Types',
        description: 'Different telescope designs and their advantages',
        content: 'Common telescope types include refractors (using lenses), reflectors (using mirrors), and compound telescopes (combining both). Each has advantages for different observing goals.'
      }
    ]
  },
  {
    id: 'moon-planets',
    title: 'Moon & Planets',
    description: 'Learn about lunar observation and planetary viewing techniques',
    icon: 'moon',
    category: 'moon-planets',
    subtopics: [
      {
        id: 'moon-phases',
        title: 'Moon Phases',
        description: 'Understanding the lunar cycle and observing the Moon',
        content: 'The Moon goes through phases as it orbits Earth, from new moon to full moon and back. Each phase offers different observing opportunities and challenges.'
      },
      {
        id: 'planetary-observation',
        title: 'Planetary Observation',
        description: 'Techniques for observing planets in our solar system',
        content: 'Planets are among the most rewarding targets for amateur astronomers. Each planet offers unique features to observe, from Jupiter\'s bands to Saturn\'s rings.'
      }
    ]
  },
  {
    id: 'constellations',
    title: 'Constellations',
    description: 'Learn to identify major constellations and their seasonal visibility',
    icon: 'constellation',
    category: 'constellations',
    subtopics: [
      {
        id: 'major-constellations',
        title: 'Major Constellations',
        description: 'The most prominent constellations visible from Islamabad',
        content: 'From Islamabad, you can observe major constellations like Orion, Ursa Major, Cassiopeia, and Scorpius depending on the season.'
      },
      {
        id: 'identifying-constellations',
        title: 'How to Identify Constellations',
        description: 'Techniques and tips for constellation recognition',
        content: 'Learning constellations requires practice and reference to star charts. Start with bright, recognizable patterns and use them as anchors to find fainter constellations.'
      },
      {
        id: 'seasonal-visibility',
        title: 'Seasonal Visibility',
        description: 'Which constellations are visible in each season',
        content: 'Different constellations are visible in different seasons due to Earth\'s orbit around the Sun. Winter offers excellent views of Orion and surrounding winter constellations.'
      }
    ]
  },
  {
    id: 'astrophotography',
    title: 'Astrophotography',
    description: 'Introduction to photographing the night sky',
    icon: 'camera',
    category: 'astrophotography',
    subtopics: [
      {
        id: 'introduction',
        title: 'Introduction to Astrophotography',
        description: 'Getting started with night sky photography',
        content: 'Astrophotography combines photography with astronomy to capture images of celestial objects. Basic equipment includes a camera, tripod, and for deeper imaging, a telescope mount.'
      },
      {
        id: 'basic-concepts',
        title: 'Basic Observing and Imaging Concepts',
        description: 'Essential concepts for successful astrophotography',
        content: 'Key concepts include exposure time, ISO settings, focusing techniques, and image processing. Understanding these fundamentals is crucial for capturing clear night sky images.'
      }
    ]
  },
  {
    id: 'light-pollution',
    title: 'Light Pollution',
    description: 'Understanding light pollution and its impact on astronomy',
    icon: 'moon',
    category: 'light-pollution',
    content: 'This comprehensive guide covers the impact of artificial light on astronomical observation, the Bortle scale, and practical steps for dark-sky conservation.'
  },
  {
    id: 'astronomy-glossary',
    title: 'Astronomy Glossary',
    description: 'Common astronomical terminology and concepts explained',
    icon: 'book',
    category: 'glossary',
    content: 'A comprehensive glossary of astronomical terms including magnitudes, right ascension, declination, angular separation, and other essential concepts for astronomers.'
  }
];
