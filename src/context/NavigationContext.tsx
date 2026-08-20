import React, { createContext, useContext, useState, useEffect } from 'react';

export type Page = 'discover' | 'saved' | 'profile' | 'results' | 'details';

interface NavigationContextType {
  currentPage: Page;
  selectedOppId: string | null;
  history: Page[];
  navigateTo: (page: Page, oppId?: string | null) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('discover');
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [history, setHistory] = useState<Page[]>(['discover']);

  // Handle browser back button (optional improvement)
  useEffect(() => {
    const handlePopState = () => {
      // Basic fallback
      setCurrentPage('discover');
      setSelectedOppId(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: Page, oppId: string | null = null) => {
    setHistory((prev) => [...prev, page]);
    setCurrentPage(page);
    setSelectedOppId(oppId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current page
      const prevPage = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentPage(prevPage);
      // Keep selected ID if returning to details (unlikely but safe)
      if (prevPage !== 'details') {
        setSelectedOppId(null);
      }
    } else {
      setCurrentPage('discover');
      setSelectedOppId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NavigationContext.Provider value={{ currentPage, selectedOppId, history, navigateTo, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
