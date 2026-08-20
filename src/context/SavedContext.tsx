import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useProfile } from './ProfileContext';

interface SavedContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => void;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const SavedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { userId } = useProfile();

  // Load saved opportunities based on Auth State
  useEffect(() => {
    const loadSavedData = async () => {
      if (isSupabaseConfigured && userId) {
        // Authenticated Database mode
        try {
          const { data, error } = await supabase
            .from('saved_opportunities')
            .select('opportunity_id')
            .eq('user_id', userId);

          if (!error && data) {
            setSavedIds(data.map(item => String(item.opportunity_id)));
            return;
          }
        } catch (e) {
          console.warn('Failed to load saved items from database:', e);
        }
      }

      // Guest LocalStorage fallback mode
      try {
        const stored = localStorage.getItem('opp_hub_saved');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const sanitized = parsed.filter((item): item is string => typeof item === 'string');
            setSavedIds(sanitized);
          } else {
            setSavedIds([]);
          }
        } else {
          setSavedIds([]);
        }
      } catch (e) {
        console.error('Failed to load saved opportunities locally:', e);
      }
    };

    loadSavedData();
  }, [userId]);

  // Toggle Save
  const toggleSave = async (id: string) => {
    if (typeof id !== 'string') return;

    // 1. Optimistic Local State update
    const alreadySaved = savedIds.includes(id);
    let updated: string[];
    if (alreadySaved) {
      updated = savedIds.filter(item => item !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);

    // 2. Save locally for guest sync
    try {
      localStorage.setItem('opp_hub_saved', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    // 3. Save to live Supabase DB
    if (isSupabaseConfigured && userId) {
      try {
        if (alreadySaved) {
          const { error } = await supabase
            .from('saved_opportunities')
            .delete()
            .eq('user_id', userId)
            .eq('opportunity_id', id);
          if (error) console.error('Failed to remove save from DB:', error.message);
        } else {
          const { error } = await supabase
            .from('saved_opportunities')
            .insert({
              user_id: userId,
              opportunity_id: id
            });
          if (error) console.error('Failed to add save to DB:', error.message);
        }
      } catch (e) {
        console.error('Database connection error during saved toggle:', e);
      }
    }
  };

  const isSaved = (id: string) => {
    if (typeof id !== 'string') return false;
    return savedIds.includes(id);
  };

  return (
    <SavedContext.Provider value={{ savedIds, isSaved, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};
