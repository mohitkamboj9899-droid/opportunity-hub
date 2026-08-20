import React, { useState, useMemo } from 'react';
import { useOpportunities } from '../context/OpportunitiesContext';
import { OpportunityCard } from '../components/OpportunityCard';
import { useNavigation } from '../context/NavigationContext';
import { Search, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export const Discover: React.FC = () => {
  const { navigateTo } = useNavigation();
  const { opportunities, loading } = useOpportunities();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedLocation('All');
    setSelectedLevel('All');
  };

  // Check if any filters are active
  const isFilteringActive = useMemo(() => {
    return searchQuery !== '' || selectedType !== 'All' || selectedLocation !== 'All' || selectedLevel !== 'All';
  }, [searchQuery, selectedType, selectedLocation, selectedLevel]);

  // Combined logical AND filtering
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // 1. Search Query filter (matches Title, Organization, Skills, Tags, and Description)
      const matchesSearch = searchQuery === '' || 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        opp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. Opportunity Type filter
      const matchesType = selectedType === 'All' || opp.type === selectedType;

      // 3. Location filter
      let matchesLocation = true;
      const isOppIndia = opp.location.includes('India') || opp.location.includes('KA') || opp.location.includes('DL') || opp.location.includes('UP');
      
      if (selectedLocation === 'Remote') {
        matchesLocation = opp.remote;
      } else if (selectedLocation === 'India') {
        matchesLocation = !opp.remote && isOppIndia;
      } else if (selectedLocation === 'Other') {
        matchesLocation = !opp.remote && !isOppIndia;
      }

      // 4. Experience Level filter
      const matchesLevel = selectedLevel === 'All' || opp.experienceLevel === selectedLevel;

      // All filters must evaluate to true
      return matchesSearch && matchesType && matchesLocation && matchesLevel;
    });
  }, [opportunities, searchQuery, selectedType, selectedLocation, selectedLevel]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="discover-hero">
        <div className="discover-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.35rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Sparkles size={14} />
            <span>Launch Your Student Career</span>
          </div>
          <h1 className="hero-title" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Find opportunities that <span>move you forward</span>.
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '650px', margin: '0 auto 1.5rem auto' }}>
            Discover top-tier internships, hackathons, and research opportunities in one place, tailored for students.
          </p>
          <button 
            className="btn btn-accent btn-hero-cta" 
            onClick={() => navigateTo('profile')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span>🎯 Personalize for Me</span>
          </button>
        </div>
      </section>

      {/* Search and Filters controls card */}
      <section className="controls-card">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, organization, skills (e.g. PyTorch), description details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-grid">
          {/* Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Opportunity Type</label>
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Internship">Internships</option>
              <option value="Hackathon">Hackathons</option>
              <option value="Research">Research Opportunities</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="filter-group">
            <label className="filter-label">Location</label>
            <select
              className="filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="All">All Locations</option>
              <option value="India">India</option>
              <option value="Remote">Remote</option>
              <option value="Other">Other / International</option>
            </select>
          </div>

          {/* Experience level Filter */}
          <div className="filter-group">
            <label className="filter-label">Experience</label>
            <select
              className="filter-select"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Some projects">Some projects</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </section>

      {/* Results Header Metadata */}
      <div className="results-meta">
        <h2 className="results-count">
          Showing {filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
        </h2>
        {isFilteringActive && (
          <button className="clear-btn" onClick={handleClearFilters}>
            <RefreshCw size={14} />
            Reset all filters
          </button>
        )}
      </div>

      {/* Opportunities Grid / Empty State */}
      {filteredOpportunities.length > 0 ? (
        <div className="opportunity-grid">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <AlertCircle size={32} />
          </div>
          <h3>No opportunities found</h3>
          <p>Try changing your search or filters to see more results.</p>
          <button className="btn btn-primary btn-sm" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
