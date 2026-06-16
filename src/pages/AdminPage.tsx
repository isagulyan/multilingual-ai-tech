import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  getArticles, getCategories, getAuthors, getArticleStats, getNewsletterStats,
  createArticle, updateArticle, deleteArticle,
  getVideoJobs, getVideoJobForArticle, triggerVideoGeneration, publishVideoJob,
} from '../lib/api';
import { supabase, type Article, type Category, type Author, type VideoJob } from '../lib/supabase';
import VideoPreview from '../components/VideoPreview';
import {
  BarChart2, FileText, Users, Mail, X, Plus, Edit2, Trash2, Save,
  ChevronLeft, Zap, CheckCircle, Film, RefreshCw, Loader,
  AlertCircle, Play, TrendingUp,
} from 'lucide-react';

type AdminView = 'dashboard' | 'articles' | 'drafts' | 'video-studio' | 'subscribers' | 'settings';

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    blue:   'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    green:  'bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400',
    orange: 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400',
    purple: 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
    brand:  'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400',
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className={`w-11 h-11 rounded-xl ${colorMap[color]} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

// ─── Draft card with inline video panel ───────────────────────────────────────
function DraftCard({
  article,
  onEdit,
  onPublish,
  onDelete,
}: {
  article: Article;
  onEdit: (a: Article) => void;
  onPublish: (a: Article) => void;
  onDelete: (id: string) => void;
}) {
  const [job, setJob] = useState<VideoJob | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [publishingVideo, setPublishingVideo] = useState(false);
  const [publishingArticle, setPublishingArticle] = useState(false);
  const [videoError, setVideoError] = useState('');

  const fetchJob = useCallback(async () => {
    try {
      const j = await getVideoJobForArticle(article.id);
      setJob(j);
    } catch { /* silent */ }
    setLoadingJob(false);
  }, [article.id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  // Poll while job is in-flight
  useEffect(() => {
    if (!job || job.status === 'completed' || job.status === 'failed') return;
    const id = setInterval(fetchJob, 3000);
    return () => clearInterval(id);
  }, [job, fetchJob]);

  const handleGenerateVideo = async () => {
    setGeneratingVideo(true);
    setVideoError('');
    try {
      await triggerVideoGeneration(article.id, true);
      await fetchJob();
    } catch (e: any) {
      setVideoError(e.message || 'Failed to start video generation');
    } finally {
      setGeneratingVideo(false);
    }
  };

  const handlePublishBoth = async () => {
    setPublishingArticle(true);
    setPublishingVideo(true);
    try {
      // Publish article
      await onPublish(article);
      // Publish video simultaneously if completed
      if (job?.status === 'completed' && !job.is_published) {
        await publishVideoJob(job.id);
        setJob(prev => prev ? { ...prev, is_published: true } : prev);
      }
    } finally {
      setPublishingArticle(false);
      setPublishingVideo(false);
    }
  };

  const handlePublishVideoOnly = async () => {
    if (!job) return;
    setPublishingVideo(true);
    try {
      const updated = await publishVideoJob(job.id);
      setJob(updated);
    } finally {
      setPublishingVideo(false);
    }
  };

  const videoReady = job?.status === 'completed';
  const videoInFlight = job && (job.status === 'queued' || job.status === 'processing');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Article info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
                Draft
              </span>
              {article.category?.name && (
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                  {article.category.name}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
              <span>{article.read_time} min read</span>
              {article.author?.name && <span>by {article.author.name}</span>}
            </div>
          </div>

          {/* Video panel */}
          <div className="flex-shrink-0 w-[220px]">
            {loadingJob ? (
              <div className="flex items-center justify-center h-32 rounded-xl bg-gray-50 dark:bg-gray-900">
                <Loader size={18} className="text-gray-400 animate-spin" />
              </div>
            ) : (
              <VideoPreview
                job={job}
                articleTitle={article.title}
                onRegenerate={generatingVideo ? undefined : handleGenerateVideo}
                onPublish={videoReady && !job?.is_published ? handlePublishVideoOnly : undefined}
                isPublishing={publishingVideo}
                compact={false}
              />
            )}
            {generatingVideo && (
              <p className="text-[10px] text-gray-400 mt-1.5 flex items-center gap-1">
                <Loader size={9} className="animate-spin" /> Starting render…
              </p>
            )}
            {videoError && (
              <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={9} /> {videoError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Video status indicator */}
          {videoInFlight && (
            <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Loader size={11} className="animate-spin" /> Video rendering…
            </span>
          )}
          {videoReady && (
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
              <CheckCircle size={11} /> Video ready
            </span>
          )}
          {!job && !loadingJob && (
            <button
              onClick={handleGenerateVideo}
              disabled={generatingVideo}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <Film size={11} /> Generate video
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(article)}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"
            title="Edit article"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(article.id)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={handlePublishBoth}
            disabled={publishingArticle}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/60 text-white text-sm font-semibold rounded-lg transition-all active:scale-95"
          >
            {publishingArticle
              ? <Loader size={14} className="animate-spin" />
              : <CheckCircle size={14} />}
            {publishingArticle ? 'Publishing…' : videoReady ? 'Publish Now (Article + Video)' : 'Publish Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Video Studio tab ─────────────────────────────────────────────────────────
function VideoStudio({ articles }: { articles: Article[] }) {
  const [allJobs, setAllJobs] = useState<VideoJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all');

  const fetchJobs = useCallback(async () => {
    try {
      const jobs = await getVideoJobs({ limit: 50 });
      setAllJobs(jobs);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Auto-refresh while any job is in flight
  useEffect(() => {
    const hasInFlight = allJobs.some(j => j.status === 'queued' || j.status === 'processing');
    if (!hasInFlight) return;
    const id = setInterval(fetchJobs, 4000);
    return () => clearInterval(id);
  }, [allJobs, fetchJobs]);

  const filtered = filter === 'all' ? allJobs : allJobs.filter(j => j.status === filter);

  const counts = {
    all:        allJobs.length,
    completed:  allJobs.filter(j => j.status === 'completed').length,
    processing: allJobs.filter(j => j.status === 'queued' || j.status === 'processing').length,
    failed:     allJobs.filter(j => j.status === 'failed').length,
    published:  allJobs.filter(j => j.is_published).length,
  };

  const getArticleTitle = (jobArticleId: string) =>
    articles.find(a => a.id === jobArticleId)?.title || 'Unknown Article';

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader size={24} className="text-gray-400 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Film size={20} className="text-brand-600" />
            Video Studio
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            All AI-generated short videos · {counts.published} live on TechPulse TV
          </p>
        </div>
        <button
          onClick={fetchJobs}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {([
          { key: 'all',        label: 'All Videos',   count: counts.all },
          { key: 'completed',  label: 'Ready',        count: counts.completed },
          { key: 'processing', label: 'Rendering',    count: counts.processing },
          { key: 'failed',     label: 'Failed',       count: counts.failed },
        ] as const).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-brand-400'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filter === key ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-16 text-center">
          <Film size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No videos in this category yet.</p>
          <p className="text-sm text-gray-400 mt-1">Generate an article draft to auto-create a video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map(job => (
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <VideoPreview
                job={job}
                articleTitle={getArticleTitle(job.article_id)}
                compact
              />
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                  {job.title || getArticleTitle(job.article_id)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {job.completed_at
                    ? new Date(job.completed_at).toLocaleDateString()
                    : 'In progress…'}
                </p>
              </div>
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  job.status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    : job.status === 'failed'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                }`}>
                  {job.status === 'processing' || job.status === 'queued' ? 'Rendering…' : job.status}
                </span>
                {job.is_published && (
                  <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-0.5">
                    <Zap size={9} fill="currentColor" /> Live
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Provider integration callout */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
            <Play size={18} className="text-brand-400" />
          </div>
          <div>
            <h4 className="font-bold text-white mb-1">Connect a Real Video Provider</h4>
            <p className="text-sm text-gray-400 mb-3">
              Currently using mock renderer. Swap in a real API key to generate production-quality videos.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Shotstack', 'Runway ML', 'D-ID', 'Synthesia'].map(p => (
                <span key={p} className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-700 text-gray-300 border border-gray-600 hover:border-brand-500 transition-colors cursor-pointer">
                  {p} →
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const { setCurrentPage, setIsAdminView, language } = useApp();
  const [view, setView] = useState<AdminView>('dashboard');
  const [articles, setArticles] = useState<Article[]>([]);
  const [draftArticles, setDraftArticles] = useState<Article[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [stats, setStats] = useState({ totalArticles: 0, totalViews: 0, subscribers: 0 });
  const [videoStats, setVideoStats] = useState({ total: 0, published: 0 });
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [generatingArticle, setGeneratingArticle] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [arts, drafts, cats, auths, artStats, newsletter, subs, jobs] = await Promise.all([
        getArticles({ language, limit: 50, status: 'published' }),
        getArticles({ language, limit: 20, status: 'draft' }),
        getCategories(language),
        getAuthors(),
        getArticleStats(),
        getNewsletterStats(),
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
        getVideoJobs({ limit: 1000 }).catch(() => []),
      ]);

      setArticles(arts);
      setDraftArticles(drafts);
      setCategories(cats);
      setAuthors(auths);
      setStats({ totalArticles: artStats.total, totalViews: artStats.totalViews, subscribers: newsletter });
      setSubscribers(subs.data || []);
      setVideoStats({
        total: jobs.length,
        published: jobs.filter((j: VideoJob) => j.is_published).length,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    try {
      if (editingArticle.id) {
        await updateArticle(editingArticle.id, editingArticle);
      } else {
        await createArticle({ ...editingArticle, status: 'draft', language });
      }
      setEditingArticle(null);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try { await deleteArticle(id); loadData(); }
    catch { alert('Error deleting article'); }
  };

  const handlePublishDraft = async (article: Article) => {
    await updateArticle(article.id, {
      status: 'published',
      published_at: new Date().toISOString(),
    });
    loadData();
  };

  const handleGenerateArticle = async () => {
    setGeneratingArticle(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-articles`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.ok) throw new Error('Failed to generate article');
      await res.json();
      setTimeout(() => { loadData(); setGeneratingArticle(false); }, 1200);
    } catch (error) {
      console.error('Error generating article:', error);
      alert('Error generating article. Ensure OpenAI API key is configured.');
      setGeneratingArticle(false);
    }
  };

  const navItems: { key: AdminView; label: string; badge?: number }[] = [
    { key: 'dashboard',     label: 'Dashboard' },
    { key: 'articles',      label: 'Articles' },
    { key: 'drafts',        label: 'Drafts', badge: draftArticles.length || undefined },
    { key: 'video-studio',  label: 'Video Studio', badge: videoStats.total || undefined },
    { key: 'subscribers',   label: 'Subscribers', badge: subscribers.length || undefined },
    { key: 'settings',      label: 'Settings' },
  ];

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12 flex items-center justify-center gap-3 text-gray-500">
        <Loader size={18} className="animate-spin" />
        Loading admin panel…
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Admin header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setIsAdminView(false); setCurrentPage('home'); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); setIsAdminView(false); setCurrentPage('home'); }}
            className="btn-secondary text-sm"
          >
            Exit Admin
          </button>
        </div>

        {/* Tab nav */}
        <div className="max-w-[1400px] mx-auto px-6 flex gap-1 overflow-x-auto">
          {navItems.map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${
                view === key
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {label}
              {badge ? (
                <span className="bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">

        {/* ── Dashboard ──────────────────────────────────────────────────── */}
        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard icon={FileText}   label="Published Articles" value={stats.totalArticles}              color="blue" />
              <StatCard icon={BarChart2}  label="Total Views"        value={stats.totalViews.toLocaleString()} color="green" />
              <StatCard icon={Mail}       label="Subscribers"        value={stats.subscribers.toLocaleString()} color="orange" />
              <StatCard icon={Users}      label="Authors"            value={authors.length}                    color="purple" />
              <StatCard icon={Film}       label="Videos Generated"   value={videoStats.total}                  color="brand" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent articles */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-brand-600" /> Recent Articles
                </h2>
                <div className="space-y-2">
                  {articles.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{a.title}</p>
                        <p className="text-xs text-gray-500">{new Date(a.published_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                        published
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-brand-600" /> Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setView('drafts'); handleGenerateArticle(); }} className="p-4 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-800 hover:border-brand-500 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all text-left group">
                    <Zap size={20} className="text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Generate Article</p>
                    <p className="text-xs text-gray-500 mt-0.5">AI writes a new draft + video</p>
                  </button>
                  <button onClick={() => setView('video-studio')} className="p-4 rounded-xl border-2 border-dashed border-green-300 dark:border-green-800 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all text-left group">
                    <Film size={20} className="text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Video Studio</p>
                    <p className="text-xs text-gray-500 mt-0.5">{videoStats.published} videos live</p>
                  </button>
                  <button onClick={() => { setEditingArticle({}); setShowForm(true); setView('articles'); }} className="p-4 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-left group">
                    <Plus size={20} className="text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">New Article</p>
                    <p className="text-xs text-gray-500 mt-0.5">Write manually</p>
                  </button>
                  <button onClick={() => setView('subscribers')} className="p-4 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-800 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all text-left group">
                    <TrendingUp size={20} className="text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Subscribers</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stats.subscribers.toLocaleString()} total</p>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Articles ────────────────────────────────────────────────────── */}
        {view === 'articles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Published Articles</h2>
              <button onClick={() => { setEditingArticle({}); setShowForm(true); }} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> New Article
              </button>
            </div>

            {showForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {editingArticle?.id ? 'Edit Article' : 'New Article'}
                  </h3>
                  <button onClick={() => { setShowForm(false); setEditingArticle(null); }}>
                    <X size={18} className="text-gray-500 hover:text-gray-900 dark:hover:text-white" />
                  </button>
                </div>
                <form onSubmit={handleSaveArticle} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <input type="text" placeholder="Title" value={editingArticle?.title || ''} onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })} className="input-field" required />
                    <select value={editingArticle?.category_id || ''} onChange={e => setEditingArticle({ ...editingArticle, category_id: e.target.value })} className="input-field">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <select value={editingArticle?.author_id || ''} onChange={e => setEditingArticle({ ...editingArticle, author_id: e.target.value })} className="input-field">
                      <option value="">Select Author</option>
                      {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <input type="text" placeholder="Slug" value={editingArticle?.slug || ''} onChange={e => setEditingArticle({ ...editingArticle, slug: e.target.value })} className="input-field" />
                  </div>
                  <textarea placeholder="Excerpt" value={editingArticle?.excerpt || ''} onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })} className="input-field h-20" />
                  <textarea placeholder="Content (HTML)" value={editingArticle?.content || ''} onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })} className="input-field h-32 font-mono text-sm" />
                  <div className="flex items-center gap-4">
                    {(['is_featured', 'is_breaking', 'is_trending', 'is_editors_pick'] as const).map(field => (
                      <label key={field} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!(editingArticle as any)?.[field]} onChange={e => setEditingArticle({ ...editingArticle, [field]: e.target.checked })} className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{field.replace('is_', '')}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary flex items-center gap-2"><Save size={15} /> Save</button>
                    <button type="button" onClick={() => { setShowForm(false); setEditingArticle(null); }} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      {['Title', 'Category', 'Status', 'Views', 'Actions'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">{article.title}</td>
                        <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{article.category?.name}</td>
                        <td className="px-5 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                            {article.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{article.view_count.toLocaleString()}</td>
                        <td className="px-5 py-3 flex items-center gap-1">
                          <button onClick={() => { setEditingArticle(article); setShowForm(true); }} className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteArticle(article.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Drafts ──────────────────────────────────────────────────────── */}
        {view === 'drafts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI-Generated Drafts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Each draft auto-generates a 10–20s short video. Click "Publish Now" to go live simultaneously.
                </p>
              </div>
              <button
                onClick={handleGenerateArticle}
                disabled={generatingArticle}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-600/60 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-md shadow-brand-600/20"
              >
                {generatingArticle
                  ? <><Loader size={16} className="animate-spin" /> Generating…</>
                  : <><Zap size={16} /> Generate Article + Video</>}
              </button>
            </div>

            {generatingArticle && (
              <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/40 rounded-xl p-4 flex items-center gap-3">
                <Loader size={16} className="text-brand-600 animate-spin flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-brand-800 dark:text-brand-300">AI is writing your article…</p>
                  <p className="text-xs text-brand-600 dark:text-brand-500 mt-0.5">Video generation will trigger automatically once the article is created.</p>
                </div>
              </div>
            )}

            {draftArticles.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-16 text-center">
                <Zap size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No drafts yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Click "Generate Article + Video" to create an AI-written draft with a short video.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {draftArticles.map(article => (
                  <DraftCard
                    key={article.id}
                    article={article}
                    onEdit={a => { setEditingArticle(a); setShowForm(true); setView('articles'); }}
                    onPublish={handlePublishDraft}
                    onDelete={handleDeleteArticle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Video Studio ─────────────────────────────────────────────────── */}
        {view === 'video-studio' && (
          <VideoStudio articles={[...articles, ...draftArticles]} />
        )}

        {/* ── Subscribers ──────────────────────────────────────────────────── */}
        {view === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h2>
                <p className="text-sm text-gray-500 mt-0.5">{subscribers.length} total</p>
              </div>
            </div>
            {subscribers.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Mail size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No subscribers yet.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        {['Email', 'Status', 'Source', 'Subscribed'].map(h => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {subscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-gray-900 dark:text-white">{sub.email}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              sub.status === 'active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}>{sub.status}</span>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{sub.source}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Settings ─────────────────────────────────────────────────────── */}
        {view === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Settings configuration coming soon.</p>
          </div>
        )}

      </div>
    </div>
  );
}
