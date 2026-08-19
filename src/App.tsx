import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TonightsSky } from './components/TonightsSky';
import { Telescopes } from './components/Telescopes';
import { ImageGallery } from './components/ImageGallery';
import { Foundation } from './components/Foundation';
import { Team } from './components/Team';
import { FindUs } from './components/FindUs';
import { Faqs } from './components/Faqs';
import { Footer } from './components/Footer';
import { PlaceholderPage } from './components/PlaceholderPage';
import { LightPollution } from './components/LightPollution';
import { Education } from './components/Education';
import { Resources } from './components/Resources';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');

  // Handle hash-based routing for sub-pages & bookmarking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['book-session', 'education', 'resources', 'newsletter', 'light-pollution'].includes(hash)) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (route: string) => {
    setCurrentRoute(route);
    if (route === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = `/${route}`;
    }
  };

  return (
    <div className="site-background">
      
      {/* Sticky Translucent Header Navigation */}
      <Navbar 
        onNavigatePage={navigateToPage} 
        currentRoute={currentRoute} 
      />

      <main id="main-content">
        {currentRoute === 'home' ? (
          <>
            {/* Atmospheric Hero with live moon and weather telemetry */}
            <Hero onNavigatePage={navigateToPage} />

            {/* Tonight’s Sky Ephemeris & Interactive Map */}
            <TonightsSky onNavigatePage={navigateToPage} />

            {/* Available Telescopes & Precision Instrumentation */}
            <Telescopes />

            {/* Image Gallery Carousel */}
            <ImageGallery />

            {/* Foundation & Academic Mission */}
            <Foundation />

            {/* Observatory Team */}
            <Team />

            {/* Find Us Location & Let's Connect Social Channels (Side-by-side on desktop) */}
            <FindUs />

            {/* Frequently Asked Questions (FAQs) */}
            <Faqs />
          </>
        ) : currentRoute === 'light-pollution' ? (
          <LightPollution onNavigateHome={() => navigateToPage('home')} />
        ) : currentRoute === 'education' ? (
          <Education onNavigateHome={() => navigateToPage('home')} onNavigatePage={navigateToPage} />
        ) : currentRoute === 'resources' ? (
          <Resources onNavigateHome={() => navigateToPage('home')} onNavigatePage={navigateToPage} />
        ) : (
          <PlaceholderPage
            type={currentRoute as 'book-session' | 'newsletter'}
            onNavigateHome={() => navigateToPage('home')}
          />
        )}
      </main>

      {/* Dark Footer */}
      <Footer onNavigatePage={navigateToPage} />

    </div>
  );
}

export default App;
