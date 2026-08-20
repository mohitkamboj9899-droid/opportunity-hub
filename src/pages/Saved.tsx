import React, { useMemo } from 'react';
import { useSaved } from '../context/SavedContext';
import { useNavigation } from '../context/NavigationContext';
import { useOpportunities } from '../context/OpportunitiesContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { Heart, Compass } from 'lucide-react';

export const Saved: React.FC = () => {
  const { savedIds } = useSaved();
  const { navigateTo } = useNavigation();
  const { opportunities, loading } = useOpportunities();

  const savedOpportunities = useMemo(() => {
    return opportunities.filter((opp) => savedIds.includes(opp.id));
  }, [opportunities, savedIds]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <header className="hero-header" style={{ marginBottom: '2rem' }}>
        <h1 className="hero-title">
          Your <span>Saved Opportunities</span>
        </h1>
        <p className="hero-subtitle">
          Keep track of deadlines and manage your active applications.
        </p>
      </header>

      {/* Grid or Empty State */}
      {savedOpportunities.length > 0 ? (
        <div className="opportunity-grid">
          {savedOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <Heart size={32} />
          </div>
          <h3>No saved opportunities yet</h3>
          <p>Click the heart icon on any opportunity card to save it here for quick reference.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('discover')}>
            <Compass size={16} /> Explore Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
