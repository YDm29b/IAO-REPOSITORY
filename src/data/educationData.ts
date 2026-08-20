import { EducationTopic } from '../types';

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: 'astronomy-basics',
    title: 'Astronomy Basics',
    description: 'Build a foundation in stars, planets, galaxies, nebulae, and the large-scale structure of the universe.',
    icon: 'star',
    category: 'basics',
    subtopics: [
      {
        id: 'stars',
        title: 'Stars & Stellar Evolution',
        description: 'How stars form, shine, evolve, and eventually become stellar remnants.',
        content: `Stars are enormous, self-gravitating spheres of hot plasma. Most of their energy is produced by nuclear fusion in their cores.

Key Concepts:
• Main Sequence: Most stars spend the majority of their lives converting hydrogen into helium in their cores.
• Spectral Classification: Stars are commonly classified as O, B, A, F, G, K, and M. O-type stars are the hottest, while M-type stars are the coolest.
• The Sun: Our Sun is a G2V main-sequence star.
• Stellar Evolution: A star's future depends strongly on its initial mass.
• Low- and Intermediate-Mass Stars: These eventually expand into giant stars, lose their outer layers, and leave behind white dwarfs.
• Massive Stars: These can end their lives in core-collapse supernovae, leaving neutron stars or black holes.

The Hertzsprung-Russell (H-R) Diagram:
The H-R diagram compares stellar luminosity with surface temperature or spectral type. It helps astronomers understand stellar populations and evolutionary stages.`
      },
      {
        id: 'planets',
        title: 'Planets & the Solar System',
        description: 'Explore the planets, smaller Solar System bodies, and the basic physics of planetary orbits.',
        content: `Our Solar System contains the Sun, eight planets, dwarf planets, moons, asteroids, comets, and smaller bodies.

Planet Groups:
• Terrestrial Planets: Mercury, Venus, Earth, and Mars are relatively small, rocky, and dense.
• Gas Giants: Jupiter and Saturn are dominated by hydrogen and helium and have no solid surface like Earth.
• Ice Giants: Uranus and Neptune contain larger proportions of water, ammonia, and methane-rich materials beneath their atmospheres.
• Dwarf Planets: Pluto, Ceres, Eris, Haumea, and Makemake are examples recognized by the International Astronomical Union.

Orbital Motion:
Planets follow elliptical orbits around the Sun. Their orbital periods and distances are related through Kepler's laws of planetary motion.

Exoplanets:
Exoplanets are planets orbiting stars beyond our Solar System. Common detection methods include:
• Transit Method: Detecting the small decrease in a star's brightness when a planet passes in front of it.
• Radial Velocity Method: Measuring the star's motion caused by the gravitational pull of an orbiting planet.`
      },
      {
        id: 'galaxies',
        title: 'Galaxies & the Large-Scale Universe',
        description: 'Understand galaxy types, their structure, and the role of dark matter and supermassive black holes.',
        content: `A galaxy is a gravitationally bound system containing stars, gas, dust, and dark matter.

Major Galaxy Types:
• Spiral Galaxies: Have rotating disks, central bulges, and spiral arms. The Milky Way is a barred spiral galaxy.
• Elliptical Galaxies: Range from nearly spherical to elongated systems and generally contain older stellar populations.
• Irregular Galaxies: Do not have a simple regular shape and may be strongly affected by gravitational interactions.

The Milky Way:
Our Solar System is located in the Milky Way's disk, roughly 26,000 light-years from the Galactic Center.

Supermassive Black Holes:
Most large galaxies contain a supermassive black hole at or near their centers. The Milky Way's central black hole is Sagittarius A*, with a mass of about four million Suns.

Dark Matter:
Observations such as galaxy rotation curves and gravitational lensing indicate that galaxies contain substantial amounts of matter that does not emit or absorb light in the usual way. This unseen component is called dark matter.`
      },
      {
        id: 'nebulae',
        title: 'Nebulae & Stellar Nurseries',
        description: 'Learn how clouds of gas and dust reveal both the birth and death of stars.',
        content: `A nebula is a cloud of gas, dust, or ionized material in space. Nebulae can be associated with star formation, dying stars, or the remains of stellar explosions.

Major Types:
• Emission Nebulae: Ionized gas glows after absorbing energetic radiation from nearby stars. The Orion Nebula is a famous example.
• Reflection Nebulae: Dust scatters and reflects light from nearby stars.
• Dark Nebulae: Dense clouds block light from objects behind them. The Horsehead Nebula is a well-known example.
• Planetary Nebulae: Expanding shells of gas produced during the late evolution of many Sun-like stars.
• Supernova Remnants: Expanding clouds of material left behind after certain massive stars explode.

Star Formation:
Dense regions within molecular clouds can collapse under gravity and eventually form protostars. These regions are often called stellar nurseries.`
      },
      {
        id: 'star-clusters',
        title: 'Star Clusters: Open & Globular',
        description: 'Compare two major types of stellar clusters and learn why astronomers use them to study stellar evolution.',
        content: `Star clusters are groups of stars that are gravitationally associated and often formed from the same giant molecular cloud.

Open Clusters:
• Usually contain tens to thousands of stars.
• Generally lie within the Milky Way's disk.
• Often contain relatively young stars.
• Examples include the Pleiades (M45) and the Hyades.

Globular Clusters:
• Contain thousands to millions of stars.
• Have compact, roughly spherical structures.
• Orbit mainly in the Galactic halo.
• Tend to contain very old stellar populations.
• Examples include M13 in Hercules and Omega Centauri.

Because cluster stars formed from similar material and at roughly the same time, clusters are valuable laboratories for testing theories of stellar evolution.`
      }
    ]
  },

  {
    id: 'understanding-telescopes',
    title: 'Understanding Telescopes',
    description: 'Learn how aperture, focal length, magnification, optical design, and telescope mounts affect observations.',
    icon: 'telescope',
    category: 'telescopes',
    subtopics: [
      {
        id: 'aperture',
        title: 'Aperture: Light Gathering & Resolution',
        description: 'Understand why telescope aperture is one of the most important factors in observational astronomy.',
        content: `Aperture is the diameter of a telescope's primary light-gathering lens or mirror.

Why Aperture Matters:
• Light Gathering: The amount of light collected increases with the area of the aperture, which is proportional to D².
• Resolution: Larger apertures can theoretically distinguish finer details.
• Fainter Objects: More collected light makes faint astronomical objects easier to observe.

For two telescopes observing under the same conditions, the light-gathering ratio is approximately:

Light-Gathering Ratio = (D₂ / D₁)²

For example, a 400 mm telescope has about 3,265 times the light-gathering area of a 7 mm dark-adapted pupil.

Angular Resolution:
A commonly used approximation for the Dawes limit is:

θ ≈ 116 / D(mm) arcseconds

Atmospheric turbulence can prevent a telescope from reaching its theoretical resolution, so aperture alone does not determine the quality of an observation.`
      },
      {
        id: 'focal-length',
        title: 'Focal Length & Focal Ratio',
        description: 'Learn how focal length and focal ratio influence magnification, field of view, and imaging.',
        content: `Focal Length:
The focal length is the distance over which an optical system brings incoming parallel light to focus.

Focal Ratio:
f/N = F / D

where F is the focal length and D is the aperture.

Fast Systems:
• Lower focal ratios such as f/4–f/6.
• Generally provide wider fields of view.
• Often useful for deep-sky astrophotography.
• Usually place greater demands on optical correction and focusing.

Slow Systems:
• Higher focal ratios such as f/8–f/15.
• Generally provide narrower fields of view.
• Can be well suited to lunar, planetary, and double-star observing.
• Are often more forgiving of some optical aberrations.`
      },
      {
        id: 'magnification',
        title: 'Magnification & Eyepiece Optics',
        description: 'Calculate telescope magnification and understand exit pupil and useful magnification.',
        content: `Telescope Magnification:

M = F(scope) / f(eyepiece)

For example, a 1,000 mm focal-length telescope used with a 10 mm eyepiece produces 100× magnification.

Exit Pupil:
The exit pupil is the diameter of the beam of light leaving the eyepiece.

EP = D(scope) / M

A lower magnification produces a larger exit pupil, while higher magnification produces a smaller exit pupil.

Useful Magnification:
There is no single universal maximum magnification. A rough guideline is around 2× the aperture in millimetres under excellent conditions, but atmospheric seeing, optical quality, observer skill, and the target all affect the practical limit.

Excessive magnification does not create additional detail. It simply enlarges an image that may already be limited by the telescope or atmosphere.`
      },
      {
        id: 'telescope-types',
        title: 'Telescope Designs',
        description: 'Compare refractors, reflectors, and compound telescopes and understand their main strengths and limitations.',
        content: `Refractors:
Use lenses as their primary objective.
• Simple optical design.
• Usually require little maintenance.
• Achromatic designs can show chromatic aberration.
• Apochromatic designs use more advanced optical correction to greatly reduce false color.

Reflectors:
Use mirrors to collect and focus light.
• Newtonian telescopes are a common reflector design.
• No chromatic aberration from the primary mirror.
• Often provide relatively large apertures for the cost.
• Mirrors require accurate alignment, known as collimation.

Compound Telescopes:
Combine lenses and mirrors.
• Schmidt-Cassegrain telescopes use a corrector plate and multiple mirrors.
• Maksutov-Cassegrain telescopes use a strongly curved meniscus corrector.
• These designs provide long effective focal lengths in relatively compact tubes.

No telescope design is universally best. The ideal choice depends on aperture, portability, observing targets, budget, and whether the telescope is intended for visual astronomy or astrophotography.`
      }
    ]
  },

  {
    id: 'moon-planets',
    title: 'Moon & Planets',
    description: 'Learn how to observe the Moon and planets and recognize the features visible through a telescope.',
    icon: 'moon',
    category: 'moon-planets',
    subtopics: [
      {
        id: 'moon-phases',
        title: 'Moon Phases & Lunar Observation',
        description: 'Understand the lunar cycle and learn why the terminator is especially useful for observing surface detail.',
        content: `The Moon completes one orbit around Earth relative to the background stars in about 27.3 days. The cycle from one New Moon to the next takes about 29.5 days because Earth is also moving around the Sun.

The Lunar Terminator:
The terminator is the boundary between the illuminated and dark portions of the Moon.

Why Observe Near the Terminator?
Low-angle sunlight creates long shadows across the lunar surface, making craters, mountains, valleys, and other features easier to see.

Features Worth Observing:
• Tycho: Young crater with a prominent ray system.
• Copernicus: Large crater with bright rays and a complex central peak.
• Clavius: Large, heavily cratered formation.
• Plato: Large crater with a relatively dark, smooth floor.
• Mare Imbrium: One of the Moon's major basaltic plains.
• Montes Apenninus: A prominent lunar mountain range.`
      },
      {
        id: 'planetary-observation',
        title: 'Planetary Observation Techniques',
        description: 'Learn how atmospheric conditions, telescope setup, and filters affect planetary observations.',
        content: `Planetary observation is strongly affected by atmospheric seeing, telescope collimation, thermal equilibrium, and the altitude of the target above the horizon.

Venus:
• Its changing phases are easily observed.
• Surface details are difficult in visible light because of its thick cloud cover.

Mars:
• Surface features are most favorable near opposition.
• Dark albedo features and polar caps can sometimes be observed.
• Red or orange filters may improve contrast for some features.

Jupiter:
• Equatorial cloud belts are prominent.
• The Great Red Spot is a large atmospheric storm.
• The four Galilean moons—Io, Europa, Ganymede, and Callisto—can be observed with small telescopes.

Saturn:
• Its rings are among the most recognizable telescopic features.
• The Cassini Division can be visible under good conditions.
• Titan is usually the easiest Saturnian moon to identify.`
      }
    ]
  },

  {
    id: 'constellations',
    title: 'Constellations & Seasonal Sky',
    description: 'Learn to identify constellations, use bright stars as guides, and navigate the night sky from Islamabad.',
    icon: 'constellation',
    category: 'constellations',
    subtopics: [
      {
        id: 'major-constellations',
        title: 'Major Constellations Visible from Islamabad',
        description: 'Identify important northern and equatorial constellations visible from approximately 33.5° N latitude.',
        content: `Islamabad lies at approximately 33.5° north latitude. This allows observers to see many northern and equatorial constellations, as well as some southern constellations that rise above the horizon.

Circumpolar or Nearly Circumpolar Constellations:
• Ursa Major: Contains the Big Dipper asterism.
• Cassiopeia: Recognizable by its W or M-shaped pattern.
• Ursa Minor: Contains Polaris, the North Star.

Finding Polaris:
The two stars at the outer edge of the Big Dipper's bowl, Merak and Dubhe, can be used as pointer stars to locate Polaris.

The altitude of the North Celestial Pole is approximately equal to the observer's latitude, so Polaris appears about 33.5° above the northern horizon from Islamabad.`
      },
      {
        id: 'seasonal-visibility',
        title: 'Seasonal Night Sky',
        description: 'Explore some of the most recognizable constellations and targets visible during different seasons.',
        content: `The night sky changes throughout the year because Earth revolves around the Sun. A useful rule is that stars appear to shift by roughly 2 hours of right ascension over one month.

Winter:
• Orion
• Taurus
• Canis Major
• Gemini
• Pleiades (M45)
• Sirius

Spring:
• Leo
• Virgo
• Boötes
• Arcturus
• Virgo Galaxy Cluster

Summer:
• Cygnus
• Lyra
• Aquila
• Scorpius
• Sagittarius
• Summer Triangle

Autumn:
• Pegasus
• Andromeda
• Cassiopeia
• Perseus
• Andromeda Galaxy (M31)

Exact visibility depends on the date, time, observing location, and horizon obstructions.`
      },
      {
        id: 'identifying-constellations',
        title: 'Star Hopping & Sky Navigation',
        description: 'Learn how to find unfamiliar celestial objects by moving from bright reference stars to progressively fainter targets.',
        content: `Star hopping is a method of locating celestial objects without relying entirely on computerized GoTo systems.

Basic Method:
1. Identify a bright, easily recognizable reference star or asterism.
2. Compare its position with a star chart or planetarium application.
3. Move through the field using progressively fainter stars as landmarks.
4. Continue until the target object is reached.

Example:
• Find the Big Dipper in Ursa Major.
• Use its handle to locate Arcturus.
• Continue toward Spica in Virgo.

Star hopping is particularly useful for learning the structure of the night sky and developing observational skills.`
      }
    ]
  },

  {
    id: 'astrophotography',
    title: 'Astrophotography',
    description: 'Learn the fundamentals of capturing stars, planets, nebulae, and galaxies with cameras and telescopes.',
    icon: 'camera',
    category: 'astrophotography',
    subtopics: [
      {
        id: 'introduction',
        title: 'Introduction to Astrophotography',
        description: 'Understand the cameras, optics, mounts, and tracking systems used to photograph the night sky.',
        content: `Astrophotography is the practice of recording astronomical objects using cameras and optical systems.

Basic Equipment:
• Camera: DSLR, mirrorless, or dedicated astronomical camera.
• Lens or Telescope: The optical system determines the field of view and image scale.
• Mount: A tracking mount compensates for Earth's rotation during longer exposures.
• Tripod: Provides stability for camera and tracking setups.

Tracking:
Earth rotates approximately 15° per hour relative to the stars. Long-exposure astrophotography therefore usually requires accurate tracking to prevent stars from appearing as trails.

Different Targets Require Different Setups:
• Milky Way: Often photographed with a wide-angle lens.
• Nebulae and galaxies: Usually benefit from tracking and longer focal lengths.
• Planets: Often photographed through a telescope using very short exposures and video capture.`
      },
      {
        id: 'basic-concepts',
        title: 'Exposure, Calibration & Image Stacking',
        description: 'Learn how exposure settings, calibration frames, and stacking improve astrophotographs.',
        content: `Exposure:
Astrophotographers balance aperture, shutter speed, ISO or gain, and the brightness of the target.

The 500 Rule:
A rough guideline for estimating the longest exposure before noticeable star trailing is:

Maximum Exposure ≈ 500 / focal length(mm)

This is only an approximation. Sensor resolution, pixel size, image scale, and personal tolerance for trailing can change the practical limit. The NPF rule is generally more precise.

Calibration Frames:
• Light Frames: Images containing the astronomical target.
• Dark Frames: Recorded with the same exposure conditions but with no light reaching the sensor. They help characterize thermal signal and hot pixels.
• Flat Frames: Images of a uniformly illuminated field used to correct vignetting and dust shadows.
• Bias Frames: Very short exposures used to characterize the camera's readout signal.

Stacking:
Combining multiple exposures can improve the signal-to-noise ratio and reveal faint structures that are difficult to see in a single exposure.

Common Software:
• Siril
• DeepSkyStacker
• PixInsight
• Adobe Lightroom`
      }
    ]
  },

  {
    id: 'light-pollution',
    title: 'Light Pollution',
    description: 'Understand artificial skyglow, the Bortle scale, and practical approaches to preserving dark skies.',
    icon: 'moon',
    category: 'light-pollution',
    content: `Light pollution is excessive, poorly directed, or unnecessarily bright artificial light at night.

Why It Matters:
• Reduces the visibility of stars and faint deep-sky objects.
• Makes astronomical observation more difficult.
• Can affect nocturnal wildlife and ecosystems.
• Represents wasted energy when lighting is excessive or poorly designed.

Bortle Dark-Sky Scale:
The Bortle scale ranges from Class 1, the darkest skies, to Class 9, bright inner-city skies.

• Class 1: Exceptional dark-sky conditions. The Milky Way is extremely detailed and zodiacal light is prominent.
• Class 3–4: Rural to rural/suburban transition. The Milky Way remains clearly visible but some skyglow is present.
• Class 5–6: Suburban conditions. Skyglow becomes obvious and faint Milky Way structure is reduced.
• Class 7–9: Suburban/urban to inner-city conditions. Only the brightest stars and planets are easily visible.

Reducing Light Pollution:
• Use fully shielded outdoor fixtures.
• Aim lights downward rather than toward the sky.
• Use appropriate brightness rather than excessive illumination.
• Turn off unnecessary lights when they are not needed.

For astronomical observing, moving farther from major urban areas is often more effective than relying solely on filters.`
  },

  {
    id: 'astronomy-glossary',
    title: 'Astronomy Glossary',
    description: 'Search common astronomical terms, coordinate systems, telescope concepts, and observational measurements.',
    icon: 'book',
    category: 'glossary',
    content: `Astronomy Glossary:

• Absolute Magnitude (M): The apparent magnitude an object would have if it were placed at a standard distance of 10 parsecs.
• Altitude: The angular height of an object above the local horizon, measured from 0° to 90°.
• Aperture: The diameter of a telescope's primary light-gathering lens or mirror.
• Azimuth: The horizontal direction of an object, measured around the horizon from North.
• Celestial Equator: The projection of Earth's equator onto the celestial sphere.
• Collimation: The process of aligning a telescope's optical components.
• Declination (Dec, δ): The celestial equivalent of latitude, measured north or south of the celestial equator.
• Deep-Sky Object (DSO): An astronomical object outside the Solar System, such as a galaxy, nebula, or star cluster.
• Ecliptic: The apparent annual path of the Sun across the celestial sphere.
• Exit Pupil: The diameter of the light beam leaving an eyepiece and entering the observer's eye.
• Focal Length: The distance from an optical system's principal point to the point where parallel incoming rays are brought to focus.
• Focal Ratio (f/N): Focal length divided by aperture diameter.
• Light-Year: The distance light travels through vacuum in one Julian year, approximately 9.46 trillion kilometres.
• Limiting Magnitude: The faintest apparent magnitude detectable under particular observing conditions.
• Meridian: An imaginary great circle passing through the celestial poles and the observer's zenith.
• Parsec (pc): A unit of astronomical distance equal to approximately 3.26 light-years.
• Polar Alignment: Aligning a telescope mount's polar axis with Earth's rotational axis.
• Right Ascension (RA, α): A celestial coordinate similar to longitude, measured in hours, minutes, and seconds.
• Seeing: Atmospheric turbulence that causes astronomical images to blur or distort.
• Zenith: The point in the sky directly overhead, at an altitude of 90°.`
  }
];
