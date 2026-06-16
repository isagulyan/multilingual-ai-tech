import { useState, useEffect } from 'react';
import {
  Search, Sun, Moon, Menu, X, Globe, ChevronDown,
  Zap, Brain, Shield, Server, TrendingUp, DollarSign,
  Star, Cloud, BarChart2, MessageSquare, Lock, Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t, type Language } from '../lib/i18n';
import { SocialIcons } from './SocialIcons';

const categoryIcons: Record<string, React.ReactNode> = {
  'artificial-intelligence': <Brain size={16} />,
  'chatgpt-ai-tools': <MessageSquare size={16} />,
  'technology-news': <Zap size={16} />,
  'saas-reviews': <Star size={16} />,
  'web-hosting-reviews': <Server size={16} />,
  'vpn-reviews': <Shield size={16} />,
  'cybersecurity': <Lock size={16} />,
  'digital-marketing': <TrendingUp size={16} />,
  'business-growth': <BarChart2 size={16} />,
  'investing': <DollarSign size={16} />,
  'cloud-computing': <Cloud size={16} />,
};

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const navCategories = [
  { slug: 'artificial-intelligence', key: 'nav.ai' },
  { slug: 'technology-news', key: 'nav.tech' },
  { slug: 'saas-reviews', key: 'nav.saas' },
  { slug: 'web-hosting-reviews', key: 'nav.hosting' },
  { slug: 'vpn-reviews', key: 'nav.vpn' },
  { slug: 'cybersecurity', key: 'nav.security' },
  { slug: 'digital-marketing', key: 'nav.marketing' },
  { slug: 'investing', key: 'nav.finance' },
  { slug: 'cloud-computing', key: 'nav.cloud' },
];

export default function Header() {
  const { theme, toggleTheme, language, setLanguage, setCurrentPage, setCurrentCategorySlug, searchQuery, setSearchQuery, setIsAdminView } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleCategories = navCategories.slice(0, 6);
  const moreCategories = navCategories.slice(6);

  const handleCategoryClick = (slug: string) => {
    setCurrentCategorySlug(slug);
    setCurrentPage('category');
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    setCurrentCategorySlug(null);
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    setIsAdminView(true);
    setCurrentPage('admin');
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('search');
      setSearchOpen(false);
    }
  };

  const currentLang = languages.find(l => l.code === language)!;

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-gray-950 dark:bg-black text-gray-400 text-xs py-2 border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span>Your #1 Source for Tech, AI & Business Intelligence</span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-slow"></span>
              Live: 250,000+ Monthly Readers
            </span>
          </div>
          <div className="flex items-center gap-4">
            <SocialIcons variant="header" />
            <span className="w-px h-4 bg-gray-700" />
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Settings size={12} />
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-lg dark:shadow-black/40 border-b border-gray-200/80 dark:border-gray-700/80'
          : 'bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
          {/* Logo and actions row */}
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Zap size={18} className="text-white" fill="currentColor" />
              </div>
              <div className="leading-none">
                <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Tech<span className="text-brand-600">Pulse</span>
                </div>
                <div className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Media
                </div>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <button onClick={handleHomeClick} className="nav-link px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                {t(language, 'nav.home')}
              </button>
              {visibleCategories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="nav-link px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1.5"
                >
                  {categoryIcons[cat.slug]}
                  {t(language, cat.key)}
                </button>
              ))}
              {moreCategories.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                    className="nav-link px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1"
                  >
                    {t(language, 'nav.more')}
                    <ChevronDown size={14} className={`transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moreMenuOpen && (
                    <div className="absolute top-full right-0 mt-1 w-56 card py-1.5 animate-fade-in z-50">
                      {moreCategories.map(cat => (
                        <button
                          key={cat.slug}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {categoryIcons[cat.slug]}
                          {t(language, cat.key)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Language switcher */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Globe size={16} />
                  <span>{currentLang.flag}</span>
                  <ChevronDown size={12} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {langMenuOpen && (
                  <div className="absolute top-full right-0 mt-1 w-44 card py-1.5 animate-fade-in z-50">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setLangMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          language === lang.code
                            ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        {lang.label}
                        {language === lang.code && (
                          <span className="ml-auto w-1.5 h-1.5 bg-brand-500 rounded-full"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Subscribe CTA */}
              <button
                onClick={() => setCurrentPage('newsletter')}
                className="hidden md:flex btn-primary"
              >
                {t(language, 'nav.subscribe')}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar (expanded) */}
          {searchOpen && (
            <div className="pb-3 animate-slide-up">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  placeholder={t(language, 'nav.search')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field pl-10 pr-4"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 animate-slide-up">
            <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-1">
              <button
                onClick={handleHomeClick}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {t(language, 'nav.home')}
              </button>
              {navCategories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {categoryIcons[cat.slug]}
                  {t(language, cat.key)}
                </button>
              ))}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 px-1">
                  Follow Us
                </p>
                <SocialIcons variant="header" />
              </div>
              <div className="pt-2">
                <button onClick={handleAdminClick} className="btn-ghost w-full justify-start">
                  <Settings size={16} /> {t(language, 'nav.admin')}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Overlay for dropdowns */}
      {(moreMenuOpen || langMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setMoreMenuOpen(false); setLangMenuOpen(false); }}
        />
      )}
    </>
  );
}
