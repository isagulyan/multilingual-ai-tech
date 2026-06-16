import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Language } from '../lib/i18n';

type Theme = 'light' | 'dark';

type AppContextType = {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  currentArticleSlug: string | null;
  setCurrentArticleSlug: (slug: string | null) => void;
  currentCategorySlug: string | null;
  setCurrentCategorySlug: (slug: string | null) => void;
  isAdminView: boolean;
  setIsAdminView: (v: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['en', 'fr', 'de'].includes(stored)) return stored;
    const browserLang = navigator.language.slice(0, 2) as Language;
    if (['en', 'fr', 'de'].includes(browserLang)) return browserLang;
    return 'en';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(null);
  const [currentCategorySlug, setCurrentCategorySlug] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    // Navigate to home so all content re-fetches in the new language
    setCurrentPage('home');
    setCurrentArticleSlug(null);
    setCurrentCategorySlug(null);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      language, setLanguage,
      searchQuery, setSearchQuery,
      currentPage, setCurrentPage,
      currentArticleSlug, setCurrentArticleSlug,
      currentCategorySlug, setCurrentCategorySlug,
      isAdminView, setIsAdminView,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
