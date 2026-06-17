import { useEffect, useState } from 'react';
import { getArticles, getCategories } from '../lib/api';
import { ArticleCard, SectionHeader } from '../components/ArticleCard';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import { t } from '../lib/i18n';
import { ChevronLeft, Sparkles, Brain, Zap, Star, Shield, Server, Lock, Cloud, DollarSign, BarChart2, MessageSquare, TrendingUp, Wallet } from 'lucide-react';
import type { Article, Category } from '../lib/supabase';

function CategoryIcon({ icon }: { icon: string }) {
  const size = 24;
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

export default function CategoryPage({ slug }: { slug: string }) {
  const { language, setCurrentPage, setCurrentArticleSlug, setCurrentCategorySlug } = useApp();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: category?.seo_title || category?.name,
    description: category?.description
      ? `${category.description} — Browse expert articles on TechPulse Media.`
      : category?.name
        ? `Expert ${category.name} articles, analysis, and news on TechPulse Media.`
        : undefined,
    canonical: category ? `/${category.slug}` : undefined,
    schema: category
      ? {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description,
          url: `https://techpulse.media/${category.slug}`,
          isPartOf: { '@id': 'https://techpulse.media/#website' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://techpulse.media' },
              { '@type': 'ListItem', position: 2, name: category.name, item: `https://techpulse.media/${category.slug}` },
            ],
          },
        }
      : undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [arts, allCats] = await Promise.all([
          getArticles({ language, categorySlug: slug, limit: 20 }),
          getCategories(language),
        ]);

        setArticles(arts);
        const currentCat = allCats.find(c => c.slug === slug);
        setCategory(currentCat || null);
        setCategories(allCats);
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 dark:from-brand-900 dark:to-brand-800 py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <button
            onClick={() => { setCurrentPage('home'); setCurrentCategorySlug(null); }}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 text-sm"
          >
            <ChevronLeft size={16} /> {t(language, 'common.back')}
          </button>
          <div className="flex items-center gap-4 mb-4">
            {category && (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: category.color }}
              >
                <CategoryIcon icon={category.icon} />
              </div>
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                {category?.name || 'Articles'}
              </h1>
              {category?.description && (
                <p className="text-white/80 text-sm max-w-xl">{category.description}</p>
              )}
            </div>
          </div>
          {articles.length > 0 && (
            <p className="text-white/70 text-sm">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {t(language, 'common.error')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {articles.slice(0, 6).map(article => (
                  <button
                    key={article.id}
                    onClick={() => { setCurrentArticleSlug(article.slug); setCurrentPage('article'); }}
                    className="text-left"
                  >
                    <ArticleCard article={article} variant="featured" />
                  </button>
                ))}
              </div>

              {articles.length > 6 && (
                <div className="space-y-4">
                  <SectionHeader
                    title={t(language, 'home.latest')}
                    accent="bg-brand-500"
                  />
                  {articles.slice(6).map(article => (
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

            {/* Sidebar */}
            <div className="space-y-6">
              {categories.length > 1 && (
                <div className="card p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                    {t(language, 'categories.title')}
                  </h3>
                  <div className="space-y-1">
                    {categories
                      .filter(c => c.id !== category?.id)
                      .slice(0, 8)
                      .map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setCurrentCategorySlug(cat.slug); setCurrentPage('category'); }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <div className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-white" style={{ backgroundColor: cat.color }}>
                            <CategoryIcon icon={cat.icon} />
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {category && (
                <div className="card p-6 bg-gray-50 dark:bg-gray-900">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                    {category.name}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Articles</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{category.article_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">Active</span>
                    </div>
                    {category.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
