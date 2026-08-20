import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import type { UserProfile } from '../context/ProfileContext';
import { useNavigation } from '../context/NavigationContext';
import { Plus, X, ArrowRight, RefreshCw, GraduationCap, Check } from 'lucide-react';

const INTERESTS_OPTIONS = [
  'Artificial Intelligence / Machine Learning',
  'Data Science',
  'Web Development',
  'Cybersecurity',
  'Robotics',
  'Research',
  'Other'
];

export const Profile: React.FC = () => {
  const { profile, updateProfile, resetProfile, isProfileSetup } = useProfile();
  const { navigateTo } = useNavigation();

  // Initialize form state
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [preferredTypes, setPreferredTypes] = useState<('Internship' | 'Hackathon' | 'Research')[]>(profile.preferredTypes || []);
  const [experienceLevel, setExperienceLevel] = useState<UserProfile['experienceLevel']>(profile.experienceLevel || '');
  const [preferredLocation, setPreferredLocation] = useState<UserProfile['preferredLocation']>(profile.preferredLocation || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');

  // Sync state if profile context loads asynchronously
  useEffect(() => {
    if (profile) {
      setInterests(profile.interests || []);
      setPreferredTypes(profile.preferredTypes || []);
      setExperienceLevel(profile.experienceLevel || '');
      setPreferredLocation(profile.preferredLocation || '');
      setSkills(profile.skills || []);
    }
  }, [profile]);

  // Handle Interest Chip toggling
  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Handle Look For (preferredTypes) toggling
  const handleTypeToggle = (type: 'Internship' | 'Hackathon' | 'Research') => {
    if (preferredTypes.includes(type)) {
      setPreferredTypes(preferredTypes.filter(t => t !== type));
    } else {
      setPreferredTypes([...preferredTypes, type]);
    }
  };

  // Handle skills inputs
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skills.some(s => s.toLowerCase() === clean.toLowerCase())) {
      setSkills([...skills, clean]);
      setSkillInput('');
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation
    if (interests.length === 0) {
      setError('Please select at least one field of interest.');
      return;
    }
    if (preferredTypes.length === 0) {
      setError('Please select at least one option for what you are looking for.');
      return;
    }
    if (!experienceLevel) {
      setError('Please select your experience level.');
      return;
    }
    if (!preferredLocation) {
      setError('Please select your preferred location.');
      return;
    }

    setError('');

    // 2. Save Profile State (keep placeholder name/email for compatibility)
    const updatedProfile: UserProfile = {
      name: profile.name || 'Student',
      email: profile.email || '',
      interests,
      skills,
      preferredTypes,
      experienceLevel,
      preferredLocation
    };

    updateProfile(updatedProfile);

    // 3. Navigate to results
    navigateTo('results');
  };

  const handleClear = () => {
    if (window.confirm('Clear all selection preferences?')) {
      resetProfile();
      setInterests([]);
      setPreferredTypes([]);
      setExperienceLevel('');
      setPreferredLocation('');
      setSkills([]);
      setSkillInput('');
      setError('');
    }
  };

  const popularSkills = ['React', 'Python', 'Machine Learning', 'Data Structures', 'C++', 'UI/UX Design', 'Figma', 'Solidity', 'SQL', 'Git'];

  return (
    <div>
      <section className="profile-card" style={{ maxWidth: '800px' }}>
        <header className="profile-card-header">
          <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: 'var(--accent-light)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '0.75rem' }}>
            <GraduationCap size={28} />
          </div>
          <h1 className="profile-card-title">Personalize for Me</h1>
          <p className="profile-card-subtitle">
            Let us know what you are looking for to match you with matching internships, hackathons, and research projects.
          </p>
        </header>

        {error && (
          <div style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          
          {/* 1. Interests (Selectable chips/cards) */}
          <div className="form-group">
            <h2 className="form-label" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>1. Fields of Interest *</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Select all areas that excite you.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {INTERESTS_OPTIONS.map((interest) => {
                const selected = interests.includes(interest);
                return (
                  <div
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                      backgroundColor: selected ? 'var(--accent-light)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: selected ? 'var(--shadow-sm)' : 'none',
                      fontWeight: selected ? 600 : 500,
                      color: selected ? 'var(--accent-hover)' : 'var(--text-primary)'
                    }}
                    onMouseOver={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }
                    }}
                  >
                    <span>{interest}</span>
                    {selected && (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '50%' }}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. What are you looking for? (Multi check cards) */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <h2 className="form-label" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>2. What are you looking for? *</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Choose one or more opportunity pathways.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {(['Internship', 'Hackathon', 'Research'] as const).map((type) => {
                const selected = preferredTypes.includes(type);
                let label = '';
                if (type === 'Internship') label = 'Internships';
                if (type === 'Hackathon') label = 'Hackathons';
                if (type === 'Research') label = 'Research Opportunities';

                return (
                  <div
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    style={{
                      padding: '1.25rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: selected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: selected ? 'var(--primary-hover)' : 'var(--text-primary)'
                    }}
                    onMouseOver={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!selected) {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }
                    }}
                  >
                    <div style={{ fontSize: '1.1rem' }}>{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Experience level & 4. Location preference */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
            {/* Experience Level */}
            <div className="form-group">
              <h2 className="form-label" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>3. Experience Level *</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Select the description that fits you best.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(['Beginner', 'Some projects', 'Intermediate', 'Advanced'] as const).map((level) => {
                  const selected = experienceLevel === level;
                  let label = '';
                  if (level === 'Beginner') label = 'Beginner (Little or no coding experience)';
                  if (level === 'Some projects') label = 'Some projects (Academic or personal work)';
                  if (level === 'Intermediate') label = 'Intermediate (Previous internships/work)';
                  if (level === 'Advanced') label = 'Advanced (Highly experienced programmer)';

                  return (
                    <label
                      key={level}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${selected ? 'var(--secondary)' : 'var(--border)'}`,
                        backgroundColor: selected ? 'var(--secondary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: selected ? 600 : 500,
                        color: selected ? 'var(--secondary-hover)' : 'var(--text-primary)',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <input
                        type="radio"
                        name="experienceLevel"
                        value={level}
                        checked={selected}
                        onChange={() => setExperienceLevel(level)}
                        style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--secondary)' }}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Location Preference */}
            <div className="form-group">
              <h2 className="form-label" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>4. Preferred Location *</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Where do you want to work?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(['Remote', 'India', 'Anywhere'] as const).map((loc) => {
                  const selected = preferredLocation === loc;
                  let label = '';
                  if (loc === 'Remote') label = 'Remote Only (Work from anywhere)';
                  if (loc === 'India') label = 'In India (In-person or hybrid roles)';
                  if (loc === 'Anywhere') label = 'Anywhere (Open to all opportunities)';

                  return (
                    <label
                      key={loc}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                        backgroundColor: selected ? 'var(--primary-light)' : 'var(--bg-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: selected ? 600 : 500,
                        color: selected ? 'var(--primary-hover)' : 'var(--text-primary)',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <input
                        type="radio"
                        name="preferredLocation"
                        value={loc}
                        checked={selected}
                        onChange={() => setPreferredLocation(loc)}
                        style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Skills (Optional Tags builder) */}
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <h2 className="form-label" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>5. Skills & Technologies</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Add tools/languages to improve score accuracy (Optional).</p>
            
            <div className="skills-input-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Type skill (e.g. Python, Solidity) and click '+'"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <button type="button" className="btn btn-secondary" onClick={() => handleAddSkill()} style={{ padding: '0.8rem 1.25rem' }}>
                <Plus size={20} />
              </button>
            </div>
            
            {/* Active Skills Tag Tray */}
            {skills.length > 0 && (
              <div className="skills-list-container">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-input-tag">
                    {skill}
                    <button type="button" className="remove-skill-btn" onClick={() => handleRemoveSkill(skill)}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Popular Skills Suggestions */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '0.5rem', fontWeight: 500 }}>Popular suggestions:</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                {popularSkills.map((skill) => {
                  if (skills.includes(skill)) return null;
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => setSkills([...skills, skill])}
                      style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      + {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            {isProfileSetup ? (
              <button type="button" className="btn btn-secondary" onClick={handleClear}>
                <RefreshCw size={16} /> Reset Preferences
              </button>
            ) : (
              <div></div>
            )}
            
            <button type="submit" className="btn btn-accent btn-hero-cta" style={{ margin: 0, padding: '0.8rem 2rem' }}>
              <span>Find My Opportunities</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
