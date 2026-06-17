import { useEffect, useState } from 'react';
import { getArticleBySlug, getArticles } from '../lib/api';
import { ArticleCard, TagList } from '../components/ArticleCard';
import { NewsletterSubscription } from '../components/NewsletterSubscription';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';
import { t } from '../lib/i18n';
import { Eye, Calendar, Clock, Share2, ChevronLeft } from 'lucide-react';
import type { Article } from '../lib/supabase';

const BASE_URL = 'https://techpulse.media';

function formatDate(dateStr: string, lang: string) {
  return new Date(dateStr).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}

function formatISO(dateStr: string) {
  return new Date(dateStr).toISOString();
}

function buildArticleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${BASE_URL}/articles/${article.slug}#article`,
        headline: article.title,
        description: article.excerpt,
        image: {
          '@type': 'ImageObject',
          url: article.og_image || article.featured_image,
          width: 1200,
          height: 630,
        },
        datePublished: formatISO(article.published_at),
        dateModified: formatISO(article.updated_at),
        author: {
          '@type': 'Person',
          name: article.author?.name || 'TechPulse Media',
          url: `${BASE_URL}/about`,
          ...(article.author?.avatar_url && { image: article.author.avatar_url }),
        },
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/articles/${article.slug}`,
        },
        articleSection: article.category?.name,
        keywords: article.tags?.join(', '),
        inLanguage: article.language || 'en',
        isAccessibleForFree: true,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${BASE_URL}/articles/${article.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: article.category?.name || 'Articles',
            item: `${BASE_URL}/${article.category?.slug || 'articles'}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: `${BASE_URL}/articles/${article.slug}`,
          },
        ],
      },
    ],
  };
}

export default function ArticlePage({ slug }: { slug: string }) {
  const { language, setCurrentPage, setCurrentArticleSlug, setCurrentCategorySlug } = useApp();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: article?.seo_title || article?.title,
    description: article?.seo_description || article?.excerpt,
    ogImage: article?.og_image || article?.featured_image,
    canonical: article ? `/articles/${article.slug}` : undefined,
    type: 'article',
    schema: article ? buildArticleSchema(article) : undefined,
  });

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await getArticleBySlug(slug);
        if (data) {
          setArticle(data);
          if (data.category_id) {
            getArticles({ language: data.language, categorySlug: data.category?.slug, limit: 4 })
              .then(related => setRelatedArticles(related.filter(a => a.id !== data.id).slice(0, 2)))
              .catch(() => {});
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <button
          onClick={() => {
            setCurrentPage('home');
            setCurrentArticleSlug(null);
          }}
          className="btn-primary"
        >
          <ChevronLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  const breadcrumbs = [
    { label: t(language, 'nav.home'), onClick: () => { setCurrentPage('home'); setCurrentArticleSlug(null); } },
    { label: article.category?.name || 'Uncategorized', onClick: () => { setCurrentCategorySlug(article.category?.slug || ''); setCurrentPage('category'); } },
    { label: article.title },
  ];

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-4 text-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 flex-wrap">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && <span>/</span>}
              {crumb.onClick ? (
                <button
                  onClick={crumb.onClick}
                  className="text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <article className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main article content */}
          <div className="lg:col-span-2">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.is_breaking && (
            <span className="breaking-badge">{t(language, 'article.breaking')}</span>
          )}
          {article.category && (
            <span className="badge-brand">{article.category.name}</span>
          )}
          {article.is_editors_pick && (
            <span className="badge-orange">{t(language, 'article.editors_pick')}</span>
          )}
          {article.is_sponsored && (
            <span className="sponsored-badge">{t(language, 'article.sponsored')}</span>
          )}
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight text-balance">
          {article.title}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
          {article.author && (
            <div className="flex items-center gap-3">
              {article.author.avatar_url && (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {article.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {article.author.role}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ml-auto flex-wrap justify-end">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(article.published_at, language)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              {article.read_time} {t(language, 'article.read_time')}
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={14} />
              {article.view_count.toLocaleString()} {t(language, 'article.views')}
            </div>
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={t(language, 'article.share')}
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>

        {article.featured_image && (
          <figure className="my-8">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.title}
              className="w-full rounded-xl shadow-lg"
              loading="lazy"
            />
            {article.featured_image_alt && (
              <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                {article.featured_image_alt}
              </figcaption>
            )}
          </figure>
        )}

        <div
          className="article-content prose-custom max-w-none my-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.tags && article.tags.length > 0 && (
          <div className="py-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t(language, 'article.tags')}</h3>
            <TagList tags={article.tags} />
          </div>
        )}

        {article.affiliate_links && article.affiliate_links.length > 0 && (
          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Affiliate Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.affiliate_links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-amber-200/40 dark:border-amber-900/20"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {link.name}
                    </p>
                    {link.price && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.price}
                      </p>
                    )}
                  </div>
                  <span className="text-brand-600 dark:text-brand-400 font-medium">
                    →
                  </span>
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Affiliate Disclosure: Some links may be affiliate links, and we may earn a commission.
            </p>
          </div>
        )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Newsletter subscription */}
              <NewsletterSubscription variant="sidebar" />

              {/* Related topics */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {t(language, 'article.tags')}
                </h3>
                <div className="space-y-2">
                  {article.tags?.slice(0, 5).map((tag, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      → {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Share article */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {t(language, 'article.share')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Share on X
                  </button>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-blue-700 text-white hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    Share on LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </article>

      <section className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t(language, 'article.related')}</h2>
          {relatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map(related => (
                <button
                  key={related.id}
                  onClick={() => { setCurrentArticleSlug(related.slug); setCurrentPage('article'); }}
                  className="text-left"
                >
                  <ArticleCard article={related} variant="featured" />
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 h-48 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
