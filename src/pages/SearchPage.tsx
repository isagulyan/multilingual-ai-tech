import { useEffect, useState } from 'react';
import { getArticles } from '../lib/api';
import { ArticleCard } from '../components/ArticleCard';
import { useApp } from '../context/AppContext';
import { t } from '../lib/i18n';
import { Search, ChevronLeft } from 'lucide-react';
import type { Article } from '../lib/supabase';

export default function SearchPage() {
  const { language, searchQuery, setCurrentPage, setCurrentArticleSlug } = useApp();
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(false);
      try {
        const articles = await getArticles({ language, search: searchQuery, limit: 20 });
        setResults(articles);
      } catch (err) {
        console.error('Search error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, language]);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors mb-6"
        >
          <ChevronLeft size={18} /> {t(language, 'common.back')}
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t(language, 'common.search')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? `"${searchQuery}"`
              : t(language, 'nav.search')}
          </p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">{t(language, 'common.loading')}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/40">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {t(language, 'common.error_try_again')}
            </p>
          </div>
        )}

        {!loading && !error && results.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              {t(language, 'common.error')}
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>
            {results.map(article => (
              <button
                key={article.id}
                onClick={() => { setCurrentArticleSlug(article.slug); setCurrentPage('article'); }}
                className="w-full text-left"
              >
                <ArticleCard article={article} variant="horizontal" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
