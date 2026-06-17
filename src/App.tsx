import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import AdminPage from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import { AIChatWidget } from './components/AIChatWidget';
import { useApp } from './context/AppContext';
import { AppProvider } from './context/AppContext';

const STATIC_PAGES = ['about', 'contact', 'privacy', 'terms', 'disclaimer'];

function AppContent() {
  const { currentPage, currentArticleSlug, currentCategorySlug } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, currentArticleSlug, currentCategorySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full mb-4">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const isStaticPage = STATIC_PAGES.includes(currentPage);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'article' && currentArticleSlug && <ArticlePage slug={currentArticleSlug} />}
        {currentPage === 'category' && currentCategorySlug && <CategoryPage slug={currentCategorySlug} />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'terms' && <TermsPage />}
        {currentPage === 'disclaimer' && <DisclaimerPage />}
        {currentPage === 'newsletter' && (
          <div className="max-w-[1400px] mx-auto px-6 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Newsletter Signup</h1>
              <p className="text-gray-600 dark:text-gray-400">Newsletter subscription page</p>
            </div>
          </div>
        )}
      </main>
      {!isStaticPage && <AIChatWidget />}
      <Footer />
      <CookieBanner />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
