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
import { LightPollution } from './components/LightPollution';
import { Education } from './components/Education';
import { Resources } from './components/Resources';
import { Booking } from './components/Booking';
import { Newsletter } from './components/Newsletter';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedEducationTopic, setSelectedEducationTopic] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(
    sessionStorage.getItem('iao_admin_token')
  );

  // Handle hash-based routing for sub-pages & topic deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const fullHash = window.location.hash.replace('#/', '').replace('#', '');
      const [route, queryString] = fullHash.split('?');
      
      if (['book-session', 'education', 'resources', 'newsletter', 'light-pollution', 'admin'].includes(route)) {
        setCurrentRoute(route);
        if (route === 'education' && queryString) {
          const params = new URLSearchParams(queryString);
          const topic = params.get('topic');
          if (topic) setSelectedEducationTopic(topic);
        }
      } else {
        setCurrentRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (route: string, topicId?: string) => {
    setCurrentRoute(route);
    if (route === 'home') {
      window.location.hash = '';
    } else if (route === 'education' && topicId) {
      setSelectedEducationTopic(topicId);
      window.location.hash = `/${route}?topic=${topicId}`;
    } else {
      window.location.hash = `/${route}`;
    }
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    sessionStorage.setItem('iao_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    sessionStorage.removeItem('iao_admin_token');
    navigateToPage('home');
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

            {/* Image Gallery Carousel */}
            <ImageGallery />

            {/* Available Telescopes & Precision Instrumentation */}
            <Telescopes />

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
          <Education 
            onNavigateHome={() => navigateToPage('home')} 
            onNavigatePage={navigateToPage}
            selectedTopicId={selectedEducationTopic} 
          />
        ) : currentRoute === 'resources' ? (
          <Resources onNavigateHome={() => navigateToPage('home')} onNavigatePage={navigateToPage} />
        ) : currentRoute === 'book-session' ? (
          <Booking onNavigateHome={() => navigateToPage('home')} />
        ) : currentRoute === 'newsletter' ? (
          <Newsletter onNavigateHome={() => navigateToPage('home')} />
        ) : currentRoute === 'admin' ? (
          adminToken ? (
            <AdminDashboard 
              token={adminToken}
              onLogout={handleAdminLogout}
              onNavigateHome={() => navigateToPage('home')}
            />
          ) : (
            <AdminLogin 
              onLoginSuccess={handleAdminLoginSuccess}
              onNavigateHome={() => navigateToPage('home')}
            />
          )
        ) : (
          <Hero onNavigatePage={navigateToPage} />
        )}
      </main>

      {/* Dark Footer */}
      <Footer onNavigatePage={navigateToPage} />

    </div>
  );
}

export default App;
