import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  name: string;
  email: string;
  interests: string[];
  skills: string[];
  preferredTypes: ('Internship' | 'Hackathon' | 'Research')[];
  experienceLevel: 'Beginner' | 'Some projects' | 'Intermediate' | 'Advanced' | '';
  preferredLocation: 'Remote' | 'India' | 'Anywhere' | '';
}

interface ProfileContextType {
  profile: UserProfile;
  isProfileSetup: boolean;
  userId: string | null;
  updateProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  email: '',
  interests: [],
  skills: [],
  preferredTypes: [],
  experienceLevel: '',
  preferredLocation: ''
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isProfileSetup, setIsProfileSetup] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Helper to check if a profile is completely configured
  const checkIsProfileSetup = (prof: UserProfile) => {
    return (
      prof.interests.length > 0 &&
      prof.preferredTypes.length > 0 &&
      prof.experienceLevel !== '' &&
      prof.preferredLocation !== ''
    );
  };

  // 1. Listen to Auth State changes in Supabase, with guest local session loader
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserId(session?.user?.id || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserId(session?.user?.id || null);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback: retrieve simulated auth session
      try {
        const storedSession = localStorage.getItem('opp_hub_mock_session');
        if (storedSession) {
          setUserId(storedSession);
        }
      } catch (e) {
        console.error('Failed to load local mock session:', e);
      }
    }
  }, []);

  // 2. Fetch and Sync Profile from DB or LocalStorage
  useEffect(() => {
    const loadProfileData = async () => {
      if (isSupabaseConfigured && userId) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (!error && data) {
            const dbProfile: UserProfile = {
              name: data.name || '',
              email: '', // Stored in Auth.users
              interests: Array.isArray(data.interests) ? data.interests : [],
              skills: Array.isArray(data.skills) ? data.skills : [],
              preferredTypes: Array.isArray(data.preferred_types) ? data.preferred_types : [],
              experienceLevel: data.experience_level || '',
              preferredLocation: data.preferred_location || ''
            };
            setProfile(dbProfile);
            setIsProfileSetup(checkIsProfileSetup(dbProfile));
            return;
          }
        } catch (e) {
          console.warn('Could not load profile from database:', e);
        }
      }

      // Guest / local fallback load
      const prefix = userId ? `_${userId}` : '';
      try {
        const stored = localStorage.getItem(`opp_hub_profile${prefix}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const localProfile: UserProfile = {
            name: typeof parsed.name === 'string' ? parsed.name : '',
            email: typeof parsed.email === 'string' ? parsed.email : '',
            interests: Array.isArray(parsed.interests) ? parsed.interests.filter((i: any) => typeof i === 'string') : [],
            skills: Array.isArray(parsed.skills) ? parsed.skills.filter((s: any) => typeof s === 'string') : [],
            preferredTypes: Array.isArray(parsed.preferredTypes) ? parsed.preferredTypes.filter((t: any) => ['Internship', 'Hackathon', 'Research'].includes(t)) : [],
            experienceLevel: ['Beginner', 'Some projects', 'Intermediate', 'Advanced'].includes(parsed.experienceLevel) ? parsed.experienceLevel : '',
            preferredLocation: ['Remote', 'India', 'Anywhere'].includes(parsed.preferredLocation) ? parsed.preferredLocation : ''
          };
          setProfile(localProfile);
          setIsProfileSetup(checkIsProfileSetup(localProfile));
        } else {
          setProfile(defaultProfile);
          setIsProfileSetup(false);
        }
      } catch (e) {
        console.error('Failed to load profile from localStorage:', e);
      }
    };

    loadProfileData();
  }, [userId]);

  const updateProfile = async (newProfile: UserProfile) => {
    const sanitized: UserProfile = {
      name: typeof newProfile.name === 'string' ? newProfile.name : '',
      email: typeof newProfile.email === 'string' ? newProfile.email : '',
      interests: Array.isArray(newProfile.interests) ? newProfile.interests.filter(i => typeof i === 'string') : [],
      skills: Array.isArray(newProfile.skills) ? newProfile.skills.filter(s => typeof s === 'string') : [],
      preferredTypes: Array.isArray(newProfile.preferredTypes) ? newProfile.preferredTypes.filter((t: any) => ['Internship', 'Hackathon', 'Research'].includes(t)) : [],
      experienceLevel: ['Beginner', 'Some projects', 'Intermediate', 'Advanced'].includes(newProfile.experienceLevel) ? newProfile.experienceLevel : '',
      preferredLocation: ['Remote', 'India', 'Anywhere'].includes(newProfile.preferredLocation) ? newProfile.preferredLocation : ''
    };

    setProfile(sanitized);
    setIsProfileSetup(checkIsProfileSetup(sanitized));

    const prefix = userId ? `_${userId}` : '';
    try {
      localStorage.setItem(`opp_hub_profile${prefix}`, JSON.stringify(sanitized));
    } catch (e) {
      console.error('Failed to save profile locally:', e);
    }

    if (isSupabaseConfigured && userId) {
      try {
        await supabase
          .from('user_profiles')
          .upsert({
            id: userId,
            name: sanitized.name,
            interests: sanitized.interests,
            skills: sanitized.skills,
            preferred_types: sanitized.preferredTypes,
            experience_level: sanitized.experienceLevel,
            preferred_location: sanitized.preferredLocation,
            updated_at: new Date().toISOString()
          });
      } catch (e) {
        console.error('Database connection error during profile update:', e);
      }
    }
  };

  const resetProfile = async () => {
    setProfile(defaultProfile);
    setIsProfileSetup(false);
    
    const prefix = userId ? `_${userId}` : '';
    try {
      localStorage.removeItem(`opp_hub_profile${prefix}`);
    } catch (e) {
      console.error('Failed to clear local profile:', e);
    }

    if (isSupabaseConfigured && userId) {
      try {
        await supabase
          .from('user_profiles')
          .delete()
          .eq('id', userId);
      } catch (e) {
        console.error('Failed to delete database profile:', e);
      }
    }
  };

  // Sign In Integration
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error ? error.message : null };
      } catch (e: any) {
        return { error: e.message || 'Authentication connection failed.' };
      }
    } else {
      // Simulate successful login
      const mockId = `mock-user-${email.split('@')[0]}`;
      try {
        localStorage.setItem('opp_hub_mock_session', mockId);
        setUserId(mockId);
        return { error: null };
      } catch (e) {
        return { error: 'Failed to write mock session.' };
      }
    }
  };

  // Sign Up Integration
  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error ? error.message : null };
      } catch (e: any) {
        return { error: e.message || 'Registration connection failed.' };
      }
    } else {
      // Simulate successful registration
      const mockId = `mock-user-${email.split('@')[0]}`;
      try {
        localStorage.setItem('opp_hub_mock_session', mockId);
        setUserId(mockId);
        return { error: null };
      } catch (e) {
        return { error: 'Failed to write mock session.' };
      }
    }
  };

  // Sign Out Integration
  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Sign out error:', e);
      }
    } else {
      try {
        localStorage.removeItem('opp_hub_mock_session');
      } catch (e) {
        console.error('Failed to remove mock session:', e);
      }
    }
    setUserId(null);
    setProfile(defaultProfile);
    setIsProfileSetup(false);
  };

  return (
    <ProfileContext.Provider value={{ profile, isProfileSetup, userId, updateProfile, resetProfile, signIn, signUp, signOut }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
