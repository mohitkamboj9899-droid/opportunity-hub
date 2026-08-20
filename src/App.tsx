import React from 'react';
import { OpportunitiesProvider } from './context/OpportunitiesContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { SavedProvider } from './context/SavedContext';
import { ProfileProvider } from './context/ProfileContext';
import { Navbar } from './components/Navbar';
import { Discover } from './pages/Discover';
import { Details } from './pages/Details';
import { Saved } from './pages/Saved';
import { Profile } from './pages/Profile';
import { PersonalizedResults } from './pages/PersonalizedResults';

// Subcomponent to handle routing logic inside NavigationProvider
const AppContent: React.FC = () => {
  const { currentPage } = useNavigation();

  // Route/Page rendering switch
  const renderPage = () => {
    switch (currentPage) {
      case 'discover':
        return <Discover />;
      case 'details':
        return <Details />;
      case 'saved':
        return <Saved />;
      case 'profile':
        return <Profile />;
      case 'results':
        return <PersonalizedResults />;
      default:
        return <Discover />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer style={{ 
        textAlign: 'center', 
        padding: '2rem 1.5rem', 
        borderTop: '1px solid var(--border)', 
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        marginTop: '3rem'
      }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Opportunity Hub</strong> • Made for Students
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Opportunity Hub MVP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <OpportunitiesProvider>
      <NavigationProvider>
        <ProfileProvider>
          <SavedProvider>
            <AppContent />
          </SavedProvider>
        </ProfileProvider>
      </NavigationProvider>
    </OpportunitiesProvider>
  );
}

export default App;
