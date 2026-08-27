# IST Astronomical Observatory (IAO) — Official Website

Official web platform for the **IST Astronomical Observatory (IAO)** at the Institute of Space Technology (IST), Islamabad, Pakistan. Built with React, TypeScript, Vite, Tailwind CSS, and browser-side astronomical ephemeris calculations via Astronomy Engine.

---

## Features

- **Atmospheric Observatory Hero**: Layered cinematic night sky with dynamic starry background, subtle periodic shooting stars, horizon skyline, satellite dish silhouette with Alt/Az tracking reticles, observatory deck with perimeter red LED strip lighting, and realistic stylized silhouettes of the 16-inch Meade and Celestron EdgeHD telescopes.
- **Dynamic Browser-Side Live Moon Engine**: Visually rendered in the hero only when lunar altitude at IAO is between **35° and 65°**, computing phase angles, illumination percentages, and topocentric coordinates in the browser with zero quota-limited API dependencies.
- **Live Weather Card**: Real-time temperature, cloud cover, and wind velocity telemetry fetched from Open-Meteo with 15-minute client-side caching, observing condition heuristics, and graceful fallback states.
- **Tonight's Sky Ephemeris**: Interactive stereographic celestial dome canvas allowing visitors to explore visible stars, constellations (Big Dipper, Orion, Summer Triangle, Gemini, Cassiopeia), visible planets (Venus, Mars, Jupiter, Saturn), and the Moon with drag-to-pan, zoom, and reset view controls.
- **Telescopes & Instrumentation Fleet**: Complete factual catalog of all 5 observatory instruments across 4 models (16-inch Meade, 10-inch Meade, Lunt 152mm Solar, and 2× Celestron EdgeHD 8-inch) with expandable technical specifications.
- **Captured at IAO Gallery**: Accessible, touch-responsive astrophotography slideshow with pause/play autoplay controls, slide indicators, and editable archive slots.
- **Institutional Foundation & Leadership**: Dedicated sections for IAO's academic heritage, Observatory Head spotlight, team directory, visiting guidelines, embedded map, social channels, and FAQ accordion.
- **Dedicated Sub-Page Routes**: Seamless hash-routing for upcoming portals (`#book-session`, `#resources`, `#newsletter`, `#light-pollution`).

---

## Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The site will run locally at `http://localhost:5173`.

### 3. Production Build & Validation
```bash
npm run build
npm run preview
```

---

## Comprehensive Audit of Items Pending Official IAO Approval

The following items are currently configured with safe, clearly-marked temporary development placeholders and require official material or verification from the IAO administration before production launch:

| Category | Configuration / File Location | Status | Action Required from IAO |
| :--- | :--- | :--- | :--- |
| **Telescope-Deck Coordinates** | `src/config/observatory.ts` (`coordinates`) | `isConfirmed: false` *(Dev Approximation)* | Provide surveyed GPS coordinates of the telescope roof deck. |
| **Official Logo & Wordmark** | `public/favicon.svg` & `src/components/Navbar.tsx` | Placeholder Vector Dome | Provide official IAO vector or high-resolution logo asset. |
| **Virtual Observatory Link (VAO)** | `src/config/observatory.ts` (`VAO_URL`) | Placeholder URL | Confirm official external URL for the Virtual Astronomy Observatory. |
| **Google Maps Pin & Embed** | `src/config/observatory.ts` (`GOOGLE_MAPS_URL`) | Placeholder Link & Embed | Provide direct Google Maps location pin and approved embed URL. |
| **Contact Inquiries** | `src/config/observatory.ts` (`contact`) | Placeholder Email & Phone | Confirm official public inquiry email address and telephone extension. |
| **Social Media Channels** | `src/config/observatory.ts` (`socialLinks`) | Placeholder Handles | Confirm official Facebook, Instagram, X, and YouTube account links. |
| **Observatory Head Profile** | `src/data/teamData.ts` (`OBSERVATORY_HEAD`) | Placeholder Slot | Provide official name, title, headshot photo, and biographical statement. |
| **Observatory Staff Directory** | `src/data/teamData.ts` (`TEAM_MEMBERS`) | Placeholder Slots | Provide approved team member names, roles, photos, and brief bios. |
| **Astrophotography Images** | `src/data/galleryData.ts` (`GALLERY_DATA`) | Placeholder Archive Slots | Provide genuine telescope-captured astrophotography assets and credits. |
| **Foundation & History Copy** | `src/components/Foundation.tsx` | Placeholder Text | Provide approved institutional history, charter, and mission copy. |
| **Operational & Visiting FAQs** | `src/data/faqsData.ts` (`FAQS_DATA`) | Placeholder Text | Provide verified visitor booking rules, night deck dark-adaptation rules, and weather policies. |

---

## Project Structure

```
├── src/
│   ├── config/
│   │   └── observatory.ts       # Centralized observatory coordinates, URLs, partners & contact
│   ├── data/
│   │   ├── telescopesData.ts    # Factual specifications for all 5 telescopes
│   │   ├── galleryData.ts       # Astrophotography slots, captions & target metadata
│   │   ├── teamData.ts          # Observatory Head & team profile fields
│   │   └── faqsData.ts          # Operational & visiting FAQ items
│   ├── services/
│   │   ├── astronomyService.ts  # Browser-side lunar and planetary calculations (Astronomy Engine)
│   │   └── weatherService.ts    # Open-Meteo telemetry integration & caching
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky translucent header with accessible dropdowns & drawer
│   │   ├── Hero.tsx             # Layered parallax hero, live moon & glass cards
│   │   ├── TonightsSky.tsx      # Interactive celestial dome canvas & camera stream slot
│   │   ├── Telescopes.tsx       # Fleet cards & expandable specs accordion
│   │   ├── ImageGallery.tsx     # Astrophotography slideshow carousel
│   │   ├── Foundation.tsx       # Academic heritage & mission
│   │   ├── Team.tsx             # Head profile & team member slots
│   │   ├── FindUs.tsx           # Google Maps embed & night deck protocols
│   │   ├── Connect.tsx          # Social media channel cards
│   │   ├── Faqs.tsx             # Accessible accordion
│   │   ├── Footer.tsx           # Institutional partners, affiliations & copyright
│   │   └── PlaceholderPage.tsx  # Coming-soon template for booking & resource routes
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
└── public/
    └── favicon.svg              # Observatory dome gold vector emblem
```
