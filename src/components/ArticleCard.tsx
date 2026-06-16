import { Clock, Eye, User, Tag, TrendingUp } from 'lucide-react';
import type { Article } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { t } from '../lib/i18n';

function formatDate(dateStr: string, lang = 'en') {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return lang === 'fr' ? 'À l\'instant' : lang === 'de' ? 'Gerade eben' : 'Just now';
  if (diff < 3600) {
    const m = Math.floor(diff / 60);
    return lang === 'fr' ? `il y a ${m}m` : lang === 'de' ? `vor ${m}m` : `${m}m ago`;
  }
  if (diff < 86400) {
    const h = Math.floor(diff / 3600);
    return lang === 'fr' ? `il y a ${h}h` : lang === 'de' ? `vor ${h}h` : `${h}h ago`;
  }
  if (diff < 604800) {
    const day = Math.floor(diff / 86400);
    return lang === 'fr' ? `il y a ${day}j` : lang === 'de' ? `vor ${day}T` : `${day}d ago`;
  }
  return d.toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );
}

function formatViews(n: number, lang = 'en') {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString(lang === 'fr' ? 'fr-FR' : lang === 'de' ? 'de-DE' : 'en-US');
}

interface ArticleCardProps {
  article: Article & { author?: any; category?: any };
  variant?: 'default' | 'horizontal' | 'compact' | 'hero' | 'featured';
  onClick?: () => void;
}

export function ArticleCard({ article, variant = 'default', onClick }: ArticleCardProps) {
  const { language } = useApp();

  const handleClick = () => {
    if (onClick) onClick();
  };

  if (variant === 'hero') {
    return (
      <article
        className="relative rounded-2xl overflow-hidden cursor-pointer group h-[480px] lg:h-[560px]"
        onClick={handleClick}
      >
        <img
          src={article.featured_image || 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={article.featured_image_alt || article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.is_breaking && (
              <span className="breaking-badge">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-slow"></span>
                {t(language, 'article.breaking')}
              </span>
            )}
            {article.category && (
              <span className="badge bg-brand-600 text-white">
                {article.category.name}
              </span>
            )}
            {article.is_editors_pick && (
              <span className="badge bg-amber-500 text-white">
                {t(language, 'article.editors_pick')}
              </span>
            )}
          </div>

          <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight mb-3 text-balance group-hover:text-brand-200 transition-colors">
            {article.title}
          </h1>
          <p className="text-gray-300 text-sm lg:text-base line-clamp-2 mb-4 max-w-3xl">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
            {article.author && (
              <div className="flex items-center gap-1.5">
                {article.author.avatar_url ? (
                  <img src={article.author.avatar_url} alt={article.author.name} className="w-6 h-6 rounded-full object-cover border border-gray-600" />
                ) : (
                  <User size={14} />
                )}
                <span className="text-gray-300 font-medium">{article.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {formatDate(article.published_at, language)}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {article.read_time} {t(language, 'article.read_time')}
            </div>
            {article.view_count > 0 && (
              <div className="flex items-center gap-1">
                <Eye size={12} />
                {formatViews(article.view_count, language)}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        className="flex gap-4 group cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex-shrink-0 w-28 h-20 md:w-36 md:h-24 rounded-xl overflow-hidden">
          <img
            src={article.featured_image || 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {article.is_breaking && (
              <span className="breaking-badge text-[10px] py-0.5 px-2">
                {t(language, 'article.breaking')}
              </span>
            )}
            {article.is_trending && (
              <span className="flex items-center gap-0.5 text-[10px] text-orange-500 font-semibold">
                <TrendingUp size={10} />
                {t(language, 'article.trending')}
              </span>
            )}
            {article.category && (
              <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                {article.category.name}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
            {article.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatDate(article.published_at)}</span>
            <span>{article.read_time}m</span>
            {article.view_count > 0 && <span>{formatViews(article.view_count, language)} {t(language, 'article.views')}</span>}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article
        className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 group cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={article.featured_image || 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=200'}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mb-0.5">
            {article.category?.name}
          </p>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
            {article.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{formatDate(article.published_at)}</p>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article
        className="card group cursor-pointer overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={article.featured_image || 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={article.title}
            className="article-card-image"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {article.is_breaking && (
              <span className="breaking-badge text-[10px]">
                {t(language, 'article.breaking')}
              </span>
            )}
            {article.is_editors_pick && (
              <span className="badge bg-amber-500/90 text-white text-[10px]">
                {t(language, 'article.editors_pick')}
              </span>
            )}
            {article.is_sponsored && (
              <span className="sponsored-badge">{t(language, 'article.sponsored')}</span>
            )}
          </div>
          {article.category && (
            <div className="absolute bottom-3 left-3">
              <span className="badge bg-brand-600 text-white text-[10px]">
                {article.category.name}
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight mb-2 line-clamp-2">
            {article.title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {article.author?.avatar_url && (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{article.author?.name}</p>
                <p className="text-xs text-gray-500">{formatDate(article.published_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock size={12} />
              {article.read_time}m
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article
      className="card group cursor-pointer overflow-hidden flex flex-col"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={article.featured_image || 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={article.title}
          className="article-card-image"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {article.is_breaking && (
          <div className="absolute top-3 left-3">
            <span className="breaking-badge text-[10px]">{t(language, 'article.breaking')}</span>
          </div>
        )}
        {article.is_sponsored && (
          <div className="absolute top-3 right-3">
            <span className="sponsored-badge">{t(language, 'article.sponsored')}</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              {article.category.name}
            </span>
          )}
          {article.is_trending && (
            <span className="flex items-center gap-0.5 text-[10px] text-orange-500 font-semibold ml-auto">
              <TrendingUp size={10} /> Hot
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight mb-2 line-clamp-2 flex-1">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            {article.author?.avatar_url && (
              <img src={article.author.avatar_url} alt={article.author.name} className="w-5 h-5 rounded-full object-cover" />
            )}
            <span className="text-gray-600 dark:text-gray-400">{article.author?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{formatDate(article.published_at)}</span>
            <span>·</span>
            <span>{article.read_time}m</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// Section header component
export function SectionHeader({
  title,
  subtitle,
  showViewAll,
  onViewAll,
  accent,
  viewAllLabel,
}: {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  accent?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-3">
          {accent && (
            <div className={`w-1 h-7 rounded-full ${accent}`} />
          )}
          <h2 className="section-title">{title}</h2>
        </div>
        {subtitle && <p className="section-subtitle ml-4">{subtitle}</p>}
      </div>
      {showViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 flex-shrink-0"
        >
          {viewAllLabel || 'View All'} →
        </button>
      )}
    </div>
  );
}

// Tag display
export function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
        >
          <Tag size={10} />
          {tag}
        </span>
      ))}
    </div>
  );
}
