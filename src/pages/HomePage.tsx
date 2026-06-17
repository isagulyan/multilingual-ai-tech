import { useEffect, useState } from 'react';
import { getArticles, getCategories, getAffiliateProducts, subscribeNewsletter } from '../lib/api';
import { ArticleCard, SectionHeader } from '../components/ArticleCard';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import { t } from '../lib/i18n';
import { Mail, Star, TrendingUp, Zap, Brain, Sparkles, Shield, Server, Lock, Cloud, DollarSign, BarChart2, MessageSquare, Wallet } from 'lucide-react';
import type { Article, Category, AffiliateProduct } from '../lib/supabase';

function CategoryIcon({ icon }: { icon: string }) {
  const size = 20;
  switch (icon) {
    case 'Brain': return <Brain size={size} />;
    case 'Zap': return <Zap size={size} />;
    case 'Star': return <Star size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Server': return <Server size={size} />;
    case 'Lock': return <Lock size={size} />;
    case 'Cloud': return <Cloud size={size} />;
    case 'DollarSign': return <DollarSign size={size} />;
    case 'BarChart2': return <BarChart2 size={size} />;
    case 'MessageSquare': return <MessageSquare size={size} />;
    case 'TrendingUp': return <TrendingUp size={size} />;
    case 'Wallet': return <Wallet size={size} />;
    default: return <Sparkles size={size} />;
  }
}

export default function HomePage() {
  const { language, setCurrentPage, setCurrentArticleSlug, setCurrentCategorySlug } = useApp();
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [breakingArticles, setBreakingArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topAffiliates, setTopAffiliates] = useState<AffiliateProduct[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  useSEO({ canonical: '/' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, breaking, trending, picks, latest, cats, affiliates] = await Promise.all([
          getArticles({ language, featured: true, limit: 3 }),
          getArticles({ language, breaking: true, limit: 5 }),
          getArticles({ language, trending: true, limit: 6 }),
          getArticles({ language, editorsPick: true, limit: 4 }),
          getArticles({ language, limit: 8 }),
          getCategories(language),
          getAffiliateProducts({ language, featured: true, limit: 5 }),
        ]);

        setFeaturedArticles(featured);
        setBreakingArticles(breaking);
        setTrendingArticles(trending);
        setEditorsPicks(picks);
        setLatestArticles(latest);
        setCategories(cats);
        setTopAffiliates(affiliates);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus('loading');
    try {
      await subscribeNewsletter(newsletterEmail, '', language);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (error) {
      console.error('Newsletter error:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      {featuredArticles.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 py-8">
          <button
            onClick={() => {
              setCurrentArticleSlug(featuredArticles[0].slug);
              setCurrentPage('article');
            }}
            className="w-full"
          >
            <ArticleCard article={featuredArticles[0]} variant="hero" />
          </button>
        </section>
      )}

      {/* Breaking News Ticker */}
      {breakingArticles.length > 0 && (
        <section className="bg-red-50 dark:bg-red-950/20 border-y border-red-200 dark:border-red-900/40 py-3 overflow-hidden">
          <div className="flex items-center gap-3 px-6">
            <div className="flex items-center gap-1.5 flex-shrink-0 bg-red-600 text-white px-2.5 py-1 rounded font-bold text-xs uppercase tracking-wide">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              Breaking
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-8 ticker-content">
                {[...breakingArticles, ...breakingArticles].map((article, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentArticleSlug(article.slug);
                      setCurrentPage('article');
                    }}
                    className="flex-shrink-0 text-sm text-red-900 dark:text-red-200 hover:text-red-700 dark:hover:text-red-300 transition-colors whitespace-nowrap font-medium"
                  >
                    {article.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Featured Articles Grid */}
        {featuredArticles.length > 1 && (
          <section className="mb-16">
            <SectionHeader
              title={t(language, 'home.featured')}
              accent="bg-brand-500"
              showViewAll
              onViewAll={() => setCurrentPage('home')}
              viewAllLabel={t(language, 'categories.view_all')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.slice(1).map(article => (
                <button
                  key={article.id}
                  onClick={() => {
                    setCurrentArticleSlug(article.slug);
                    setCurrentPage('article');
                  }}
                  className="text-left"
                >
                  <ArticleCard article={article} variant="featured" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="mb-16">
            <SectionHeader
              title={t(language, 'categories.title')}
              accent="bg-orange-500"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCurrentCategorySlug(cat.slug);
                    setCurrentPage('category');
                  }}
                  className="group"
                >
                  <div className="card p-4 text-center hover:border-brand-500 transition-all h-full flex flex-col items-center justify-center gap-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon icon={cat.icon} />
                    </div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white text-center leading-tight">
                      {cat.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Trending Articles */}
        {trendingArticles.length > 0 && (
          <section className="mb-16">
            <SectionHeader
              title={t(language, 'home.trending')}
              accent="bg-orange-500"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {trendingArticles.slice(0, 3).map(article => (
                <button
                  key={article.id}
                  onClick={() => {
                    setCurrentArticleSlug(article.slug);
                    setCurrentPage('article');
                  }}
                  className="text-left"
                >
                  <ArticleCard article={article} variant="featured" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Two Column Layout - Articles + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Articles */}
          <div className="lg:col-span-2">
            <SectionHeader
              title={t(language, 'home.latest')}
              accent="bg-brand-500"
            />
            <div className="space-y-4">
              {latestArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => {
                    setCurrentArticleSlug(article.slug);
                    setCurrentPage('article');
                  }}
                  className="w-full text-left"
                >
                  <ArticleCard article={article} variant="horizontal" />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Newsletter */}
            <div className="card bg-gradient-to-br from-brand-50 dark:from-brand-950/30 to-brand-100/50 dark:to-brand-950/50 border-brand-200/60 dark:border-brand-800/40 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail size={18} className="text-brand-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {t(language, 'newsletter.title')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t(language, 'newsletter.subtitle')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder={t(language, 'newsletter.placeholder')}
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="input-field text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="btn-primary w-full text-sm justify-center"
                >
                  {newsletterStatus === 'loading' ? t(language, 'common.subscribing') : t(language, 'newsletter.cta')}
                </button>
                {newsletterStatus === 'success' && (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {t(language, 'newsletter.success')}
                  </p>
                )}
                {newsletterStatus === 'error' && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {t(language, 'common.error_try_again')}
                  </p>
                )}
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                {t(language, 'newsletter.disclaimer')}
              </p>
            </div>

            {/* Top Affiliates */}
            {topAffiliates.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-600" />
                  {t(language, 'home.affiliate')}
                </h3>
                <div className="space-y-3">
                  {topAffiliates.map(product => (
                    <a
                      key={product.id}
                      href={product.affiliate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-950/40 rounded-lg transition-colors group"
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? '⭐' : '☆'}`}>
                                {i < Math.floor(product.rating) ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">{product.rating}</span>
                        </div>
                        {product.price && (
                          <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1">
                            {product.price}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Editors Picks */}
            {editorsPicks.length > 0 && (
              <div className="card p-6 border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star size={18} className="text-amber-500" />
                  {t(language, 'home.editors_picks')}
                </h3>
                <div className="space-y-2">
                  {editorsPicks.map(article => (
                    <button
                      key={article.id}
                      onClick={() => {
                        setCurrentArticleSlug(article.slug);
                        setCurrentPage('article');
                      }}
                      className="text-left"
                    >
                      <div className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {article.read_time}m read
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
