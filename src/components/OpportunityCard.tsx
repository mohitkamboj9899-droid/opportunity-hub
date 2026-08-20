import React from 'react';
import type { Opportunity } from '../data/opportunities';
import { useSaved } from '../context/SavedContext';
import { useNavigation } from '../context/NavigationContext';
import { Calendar, MapPin, Heart, ArrowRight } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const { isSaved, toggleSave } = useSaved();
  const { navigateTo } = useNavigation();
  const saved = isSaved(opportunity.id);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper to check if deadline is near (within 30 days)
  const isDeadlineNear = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 30;
  };

  const typeClass = opportunity.type.toLowerCase();
  const nearDeadline = isDeadlineNear(opportunity.deadline);

  return (
    <article 
      className="opp-card"
      onClick={() => navigateTo('details', opportunity.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className="opp-card-header">
        <span className={`opp-type-badge ${typeClass}`}>
          {opportunity.type}
        </span>
        <button 
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card navigation click trigger
            toggleSave(opportunity.id);
          }}
          title={saved ? 'Remove from Saved' : 'Save Opportunity'}
        >
          <Heart size={18} fill={saved ? 'var(--danger)' : 'none'} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 className="opp-title">
          {opportunity.title}
        </h3>
        <p className="opp-org">{opportunity.organization}</p>

        <div className="opp-meta-list">
          <div className="opp-meta-item">
            <MapPin size={15} />
            <span>
              {opportunity.location} {opportunity.remote && '(Remote)'}
            </span>
          </div>
          
          <div className="opp-meta-item" style={{ color: nearDeadline ? 'var(--danger)' : 'inherit' }}>
            <Calendar size={15} />
            <span style={{ fontWeight: nearDeadline ? 600 : 'normal' }}>
              Deadline: {formatDate(opportunity.deadline)} {nearDeadline && ' (Closing Soon!)'}
            </span>
          </div>
        </div>

        {/* Combine Skills & Tags in a unified pills tray */}
        <div className="tags-container" style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
          {opportunity.skills.slice(0, 2).map((skill, index) => (
            <span key={`skill-${index}`} className="tag-badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              {skill}
            </span>
          ))}
          {opportunity.tags.slice(0, 2).map((tag, index) => (
            <span key={`tag-${index}`} className="tag-badge">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="opp-card-actions" style={{ marginTop: '1.25rem' }}>
        <button 
          className="btn btn-secondary btn-full btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            navigateTo('details', opportunity.id);
          }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}
        >
          <span>View Opportunity</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
};
