import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Opportunity, getOpportunities } from '../data/opportunities';

interface OpportunitiesContextType {
  opportunities: Opportunity[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export const OpportunitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAndSetOpportunities = async () => {
    setLoading(true);
    try {
      const data = await getOpportunities();
      setOpportunities(data);
    } catch (e) {
      console.error('Failed to load opportunities in provider:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetOpportunities();
  }, []);

  return (
    <OpportunitiesContext.Provider value={{ opportunities, loading, refresh: fetchAndSetOpportunities }}>
      {children}
    </OpportunitiesContext.Provider>
  );
};

export const useOpportunities = () => {
  const context = useContext(OpportunitiesContext);
  if (!context) {
    throw new Error('useOpportunities must be used within an OpportunitiesProvider');
  }
  return context;
};
