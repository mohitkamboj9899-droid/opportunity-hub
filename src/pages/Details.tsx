import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { useSaved } from '../context/SavedContext';
import { useOpportunities } from '../context/OpportunitiesContext';
import { ArrowLeft, MapPin, Award, Globe, Heart, ExternalLink } from 'lucide-react';

export const Details: React.FC = () => {
  const { selectedOppId, goBack } = useNavigation();
  const { isSaved, toggleSave } = useSaved();
  const { opportunities, loading } = useOpportunities();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const opp = opportunities.find((o) => o.id === selectedOppId);
  const saved = opp ? isSaved(opp.id) : false;

  const isSafeUrl = (url: string) => {
    const trimmed = url.trim().toLowerCase();
    return trimmed.startsWith('http://') || trimmed.startsWith('https://');
  };

  if (!opp) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Opportunity Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          The opportunity you are looking for does not exist or has expired.
        </p>
        <button className="btn btn-primary" onClick={goBack}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Days remaining helper
  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = getDaysRemaining(opp.deadline);

  return (
    <div>
      {/* Back Navigation Header */}
      <button className="back-btn" onClick={goBack}>
        <ArrowLeft size={18} />
        Back to listings
      </button>

      <div className="detail-layout">
        {/* Main Details Section */}
        <main className="detail-main">
          <div className="detail-header">
            <div className="detail-title-row">
              <h1 className="detail-title">{opp.title}</h1>
            </div>
            <p className="detail-org">{opp.organization}</p>
            
            <div className="detail-pills">
              <span className={`opp-type-badge ${opp.type.toLowerCase()}`}>
                {opp.type}
              </span>
              <span className="detail-pill">
                <MapPin size={14} />
                {opp.location}
              </span>
              {opp.remote && (
                <span className="detail-pill">
                  <Globe size={14} />
                  Remote Friendly
                </span>
              )}
              <span className="detail-pill">
                <Award size={14} />
                {opp.experienceLevel}
              </span>
              {daysLeft > 0 && daysLeft <= 15 && (
                <span className="detail-pill urgency">
                  Closing in {daysLeft} {daysLeft === 1 ? 'day' : 'days'}!
                </span>
              )}
            </div>
          </div>

          <section className="detail-section">
            <h2 className="detail-section-title">About the Role / Event</h2>
            <p className="detail-body-text">{opp.description}</p>
          </section>

          <section className="detail-section">
            <h2 className="detail-section-title">Eligibility Criteria</h2>
            <p className="detail-body-text">{opp.eligibility}</p>
          </section>

          <section className="detail-section">
            <h2 className="detail-section-title">Target Skills</h2>
            <div className="detail-skills-list">
              {opp.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar Info Section */}
        <aside className="detail-sidebar">
          <h2 className="sidebar-heading">Quick Information</h2>
          
          <div className="sidebar-info-row">
            <span className="sidebar-info-label">Organization</span>
            <span className="sidebar-info-value">{opp.organization}</span>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-info-label">Type</span>
            <span className="sidebar-info-value">{opp.type}</span>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-info-label">Location</span>
            <span className="sidebar-info-value">{opp.location}</span>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-info-label">Work Mode</span>
            <span className="sidebar-info-value">{opp.remote ? 'Remote' : 'In-Person'}</span>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-info-label">Experience</span>
            <span className="sidebar-info-value">{opp.experienceLevel}</span>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-info-label">Deadline</span>
            <span className="sidebar-info-value">{formatDate(opp.deadline)}</span>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a 
              href={isSafeUrl(opp.applicationUrl) ? opp.applicationUrl : '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-full"
            >
              Apply Now
              <ExternalLink size={16} />
            </a>

            <button 
              className={`btn btn-secondary btn-full ${saved ? 'saved' : ''}`}
              onClick={() => toggleSave(opp.id)}
              style={{ color: saved ? 'var(--danger)' : 'inherit', borderColor: saved ? 'var(--danger)' : 'var(--border)' }}
            >
              <Heart size={16} fill={saved ? 'var(--danger)' : 'none'} />
              {saved ? 'Saved to Hub' : 'Save for Later'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
