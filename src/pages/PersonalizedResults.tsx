import React, { useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useNavigation } from '../context/NavigationContext';
import { useSaved } from '../context/SavedContext';
import { useOpportunities } from '../context/OpportunitiesContext';
import type { Opportunity } from '../data/opportunities';
import { Sparkles, Sliders, ArrowRight, CheckCircle, HelpCircle, Calendar, MapPin, Heart, Info } from 'lucide-react';

interface MatchedOpportunity extends Opportunity {
  matchScore: number;
  matchedInterests: string[];
  matchedSkills: string[];
  explanation: string;
  isExactLevel: boolean;
}

// Interest keyword matching helper using Structured opportunity fields
const isInterestMatched = (interest: string, opp: Opportunity): boolean => {
  const searchableText = [
    opp.title,
    opp.organization,
    opp.description,
    ...opp.skills,
    ...opp.tags
  ].map(s => s.toLowerCase());

  const checkKeywords = (keywords: string[]) => {
    return searchableText.some(text => keywords.some(kw => text.includes(kw.toLowerCase())));
  };

  switch (interest) {
    case 'Artificial Intelligence / Machine Learning':
      return checkKeywords(['machine learning', 'ai', 'deep learning', 'computer vision', 'reinforcement learning', 'pytorch', 'tensorflow', 'computational ai']);
    case 'Data Science':
      return checkKeywords(['data science', 'data analysis', 'probability', 'stats', 'statistics', 'python', 'hpc', 'data analytics']);
    case 'Web Development':
      return checkKeywords(['web development', 'frontend', 'backend', 'full-stack', 'react', 'solidity', 'javascript', 'typescript', 'ethers.js', 'html', 'css', 'dapp', 'web3', 'checkout']);
    case 'Cybersecurity':
      return checkKeywords(['cyber security', 'cybersecurity', 'security', 'penetration testing', 'vulnerability', 'owasp']);
    case 'Robotics':
      return checkKeywords(['robotics', 'robot', 'c++', 'systems programming', 'linux kernel', 'hpc']);
    case 'Research':
      return checkKeywords(['research', 'academic', 'fellowship', 'cern', 'iisc', 'theory', 'laboratory', 'computational', 'experimental']);
    case 'Other':
      return true; // Fallback
    default:
      return false;
  }
};

// Experience mapping points (Weight: 20%)
const getExperiencePoints = (studentLvl: string, oppLvl: string): number => {
  if (studentLvl === oppLvl) return 20;

  const levels = ['Beginner', 'Some projects', 'Intermediate', 'Advanced'];
  const studentIdx = levels.indexOf(studentLvl);
  const oppIdx = levels.indexOf(oppLvl);

  if (studentIdx !== -1 && oppIdx !== -1) {
    const diff = Math.abs(studentIdx - oppIdx);
    if (diff === 1) return 12; // Adjacent match
    if (diff === 2) return 5;  // Semi-adjacent match
  }
  return 0; // Far match
};

// Dynamic explanation builder based strictly on real overlapping data
const buildExplanation = (
  opp: Opportunity,
  matchedInterests: string[],
  matchedSkills: string[],
  isExactLevel: boolean
): string => {
  const clauses: string[] = [];
  
  // 1. Interest & Skill overlaps
  if (matchedInterests.length > 0 && matchedSkills.length > 0) {
    clauses.push(`matches your interest in ${matchedInterests[0]} and aligns with your ${matchedSkills.slice(0, 2).join(' & ')} skill${matchedSkills.length > 1 ? 's' : ''}`);
  } else if (matchedInterests.length > 0) {
    clauses.push(`matches your interest in ${matchedInterests[0]}`);
  } else if (matchedSkills.length > 0) {
    clauses.push(`aligns with your skill in ${matchedSkills.slice(0, 2).join(' & ')}`);
  }
  
  // 2. Experience level compatibility
  if (isExactLevel) {
    clauses.push(`fits your ${opp.experienceLevel} level`);
  }

  // Determine starting context
  const locPrefix = opp.remote ? 'Remote' : (opp.location.includes('India') || opp.location.includes('KA') || opp.location.includes('DL') || opp.location.includes('UP') ? 'In-person India' : 'Global');

  if (clauses.length === 0) {
    return `${locPrefix} ${opp.type.toLowerCase()} matching your preferences.`;
  }
  
  return `${locPrefix} ${opp.type.toLowerCase()} that ${clauses.join(' and ')}.`;
};

export const PersonalizedResults: React.FC = () => {
  const { profile, isProfileSetup } = useProfile();
  const { navigateTo } = useNavigation();
  const { isSaved, toggleSave } = useSaved();
  const { opportunities, loading } = useOpportunities();

  // Recommendation engine matching logic (Phase 1 & Phase 2)
  const matchedList = useMemo(() => {
    if (!isProfileSetup) return [];

    const results: MatchedOpportunity[] = [];

    opportunities.forEach((opp) => {
      // ==========================================
      // PHASE 1: HARD FILTERS
      // ==========================================

      // 1. Path/Opportunity Type Filter
      // Must match one of the student's selected pathways
      const typeMatches = profile.preferredTypes.includes(opp.type);
      if (!typeMatches) return; // Discard completely

      // 2. Location Compatibility Filter
      let locationEligible = false;
      const isOppIndia = opp.location.includes('India') || opp.location.includes('KA') || opp.location.includes('DL') || opp.location.includes('UP');

      if (profile.preferredLocation === 'Remote') {
        // Must be explicitly remote
        locationEligible = opp.remote;
      } else if (profile.preferredLocation === 'India') {
        // Located in India OR remote and available to Indian students
        locationEligible = isOppIndia || opp.remote;
      } else if (profile.preferredLocation === 'Anywhere') {
        // No location restrictions
        locationEligible = true;
      }

      if (!locationEligible) return; // Discard completely

      // ==========================================
      // PHASE 2: RELEVANCE RANKING (Deterministic)
      // ==========================================

      // A. Interests (35%)
      const matchedInterests = profile.interests.filter(interest => isInterestMatched(interest, opp));
      const interestPoints = profile.interests.length > 0 
        ? (matchedInterests.length / profile.interests.length) * 35 
        : 0;

      // B. Skills (35%)
      const matchedSkills = opp.skills.filter((skill) =>
        profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
      );
      const skillPoints = opp.skills.length > 0 
        ? (matchedSkills.length / opp.skills.length) * 35 
        : 35; // default if opp requires no skills

      // C. Experience level (20%)
      const experiencePoints = getExperiencePoints(profile.experienceLevel, opp.experienceLevel);
      const isExactLevel = profile.experienceLevel === opp.experienceLevel;

      // D. Other Relevance Signals (10%)
      let otherPoints = 0;
      // Location alignment bonus
      if (profile.preferredLocation === 'Remote' && opp.remote) otherPoints += 5;
      if (profile.preferredLocation === 'India' && isOppIndia) otherPoints += 5;
      // Tag keywords overlap
      const hasTagOverlap = opp.tags.some(tag => 
        profile.skills.some(s => s.toLowerCase() === tag.toLowerCase()) ||
        profile.interests.some(i => i.toLowerCase().includes(tag.toLowerCase()))
      );
      if (hasTagOverlap) otherPoints += 5;

      // Final total score
      const matchScore = Math.round(interestPoints + skillPoints + experiencePoints + otherPoints);

      // Generate description explanation using real data
      const explanation = buildExplanation(opp, matchedInterests, matchedSkills, isExactLevel);

      results.push({
        ...opp,
        matchScore,
        matchedInterests,
        matchedSkills,
        explanation,
        isExactLevel
      });
    });

    // Sort by match percentage descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [opportunities, profile, isProfileSetup]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isProfileSetup) {
    return (
      <div className="empty-state" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <div className="empty-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Sparkles size={32} />
        </div>
        <h3>Find Your Best Matches</h3>
        <p>
          Setup your personalization profile by specifying your interests, goals, and skills to let the engine rank and filter opportunities for you.
        </p>
        <button className="btn btn-accent" onClick={() => navigateTo('profile')}>
          Setup Profile <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="results-header-glow">
        <span className="match-metric-badge">Personalization Engine</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          🎯 Your Best Matches
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', fontSize: '1rem', lineHeight: '1.5' }}>
          Here are your top matching student opportunities, calculated deterministically using your target location compatibility and pathway choices.
        </p>
      </section>

      {/* Profile preferences summary overview block */}
      <div className="profile-summary-bar">
        <div className="profile-summary-text" style={{ lineHeight: '1.6' }}>
          <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            Based on your interests in {profile.interests.join(', ')}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            <span>Looking for:</span> {profile.preferredTypes.map(t => t === 'Research' ? 'Research Opportunities' : `${t}s`).join(' & ')} • <span>Location:</span> {profile.preferredLocation}
          </div>
        </div>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => navigateTo('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', height: 'fit-content' }}
        >
          <Sliders size={14} /> Edit Preferences
        </button>
      </div>

      {/* Engine Status Banner */}
      <div className="engine-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'rgba(79, 70, 229, 0.2)' }}>
        <CheckCircle size={18} />
        <span>Eligibility Hard Filters applied. Rankings scored by: Interests (35%), Skills (35%), Experience (20%), and Signals (10%).</span>
      </div>

      {/* Matches Grid */}
      {matchedList.length > 0 ? (
        <div className="opportunity-grid" style={{ marginTop: '2rem' }}>
          {matchedList.map((opp) => {
            const saved = isSaved(opp.id);
            const typeClass = opp.type.toLowerCase();

            return (
              <article 
                key={opp.id} 
                className="opp-card" 
                onClick={() => navigateTo('details', opp.id)}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                {/* Card Header */}
                <div className="opp-card-header">
                  <span className={`opp-type-badge ${typeClass}`}>
                    {opp.type}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* Visual Match Percentage Badge */}
                    <span 
                      style={{
                        backgroundColor: opp.matchScore >= 85 ? 'var(--success)' : 'var(--primary)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.3rem 0.65rem',
                        borderRadius: '50px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      {opp.matchScore}% Match
                    </span>
                    
                    <button 
                      className={`save-btn ${saved ? 'saved' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(opp.id);
                      }}
                      title={saved ? 'Remove from Saved' : 'Save Opportunity'}
                    >
                      <Heart size={18} fill={saved ? 'var(--danger)' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 className="opp-title">{opp.title}</h3>
                  <p className="opp-org">{opp.organization}</p>

                  <div className="opp-meta-list">
                    <div className="opp-meta-item">
                      <MapPin size={15} />
                      <span>{opp.location} {opp.remote && '(Remote)'}</span>
                    </div>
                    
                    <div className="opp-meta-item">
                      <Calendar size={15} />
                      <span>Deadline: {formatDate(opp.deadline)}</span>
                    </div>
                  </div>

                  {/* Why this matches you dynamic explanation block */}
                  <div 
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '4px solid var(--accent)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.45',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}
                  >
                    <Info size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.1rem' }} />
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Why it matches: </strong> 
                      <span>{opp.explanation}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="opp-card-actions" style={{ marginTop: '1.25rem' }}>
                  <button 
                    className="btn btn-secondary btn-full btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('details', opp.id);
                    }}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>View Opportunity</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state" style={{ padding: '3.5rem 1.5rem', maxWidth: '550px', margin: '2rem auto' }}>
          <div className="empty-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <HelpCircle size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            We couldn't find an exact match right now.
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Try selecting Remote or Anywhere, or broaden your opportunity type.
          </p>
          <button className="btn btn-accent" onClick={() => navigateTo('profile')}>
            Edit Preferences
          </button>
        </div>
      )}
    </div>
  );
};
