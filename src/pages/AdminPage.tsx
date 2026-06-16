import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getArticles, getCategories, getAuthors, getArticleStats, getNewsletterStats, createArticle, updateArticle, deleteArticle } from '../lib/api';
import { supabase, type Article, type Category, type Author } from '../lib/supabase';
import { BarChart2, FileText, Users, Mail, X, Plus, Edit2, Trash2, Save, ChevronLeft, Zap, CheckCircle } from 'lucide-react';

export default function AdminPage() {
  const { setCurrentPage, setIsAdminView, language } = useApp();
  const [view, setView] = useState<'dashboard' | 'articles' | 'drafts' | 'subscribers' | 'settings'>('dashboard');
  const [articles, setArticles] = useState<Article[]>([]);
  const [draftArticles, setDraftArticles] = useState<Article[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [stats, setStats] = useState({ totalArticles: 0, totalViews: 0, subscribers: 0 });
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [generatingArticle, setGeneratingArticle] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [arts, drafts, cats, auths, stats, newsletter, subs] = await Promise.all([
        getArticles({ language, limit: 50, status: 'published' }),
        getArticles({ language, limit: 20, status: 'draft' }),
        getCategories(language),
        getAuthors(),
        getArticleStats(),
        getNewsletterStats(),
        supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }),
      ]);

      setArticles(arts);
      setDraftArticles(drafts);
      setCategories(cats);
      setAuthors(auths);
      setStats({
        totalArticles: stats.total,
        totalViews: stats.totalViews,
        subscribers: newsletter,
      });
      setSubscribers(subs.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    try {
      if (editingArticle.id) {
        await updateArticle(editingArticle.id, editingArticle);
      } else {
        await createArticle({
          ...editingArticle,
          status: 'draft',
          language,
        });
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
    if (!confirm('Are you sure?')) return;
    try {
      await deleteArticle(id);
      loadData();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminView(false);
    setCurrentPage('home');
  };

  const handleGenerateArticle = async () => {
    setGeneratingArticle(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-articles`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${anonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate article');
      }

      const result = await response.json();
      console.log('Article generated:', result);

      // Reload drafts
      setTimeout(() => {
        loadData();
        setGeneratingArticle(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating article:', error);
      alert('Error generating article. Make sure OpenAI API key is configured.');
      setGeneratingArticle(false);
    }
  };

  const handlePublishDraft = async (article: Article) => {
    try {
      await updateArticle(article.id, { status: 'published', published_at: new Date() });
      loadData();
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Error publishing article');
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-12 text-center">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setIsAdminView(false); setCurrentPage('home'); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Admin Nav */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-[1400px] mx-auto px-6 flex gap-4">
          {['dashboard', 'articles', 'drafts', 'subscribers', 'settings'].map(v => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                view === v
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {v === 'drafts' && draftArticles.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                  <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {draftArticles.length}
                  </span>
                </span>
              )}
              {v === 'subscribers' && (
                <span className="inline-flex items-center gap-2">
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                  <span className="bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {subscribers.length}
                  </span>
                </span>
              )}
              {v !== 'drafts' && v !== 'subscribers' && v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {view === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: FileText, label: 'Total Articles', value: stats.totalArticles, color: 'blue' },
                { icon: BarChart2, label: 'Total Views', value: stats.totalViews.toLocaleString(), color: 'green' },
                { icon: Mail, label: 'Subscribers', value: stats.subscribers.toLocaleString(), color: 'orange' },
                { icon: Users, label: 'Authors', value: authors.length, color: 'purple' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const colorMap: Record<string, string> = {
                  blue: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
                  green: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
                  orange: 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
                  purple: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
                };
                return (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className={`w-12 h-12 rounded-lg ${colorMap[stat.color]} flex items-center justify-center mb-3`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recent Articles */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Articles
              </h2>
              <div className="space-y-2">
                {articles.slice(0, 5).map(article => (
                  <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(article.published_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'articles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Manage Articles
              </h2>
              <button
                onClick={() => { setEditingArticle({}); setShowForm(true); }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} /> New Article
              </button>
            </div>

            {/* Article Form */}
            {showForm && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editingArticle?.id ? 'Edit Article' : 'New Article'}
                  </h3>
                  <button
                    onClick={() => { setShowForm(false); setEditingArticle(null); }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleSaveArticle} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editingArticle?.title || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="input-field"
                      required
                    />
                    <select
                      value={editingArticle?.category_id || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, category_id: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <select
                      value={editingArticle?.author_id || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, author_id: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select Author</option>
                      {authors.map(author => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Slug (auto-generated if empty)"
                      value={editingArticle?.slug || ''}
                      onChange={e => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <textarea
                    placeholder="Excerpt"
                    value={editingArticle?.excerpt || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    className="input-field h-20"
                  />

                  <textarea
                    placeholder="Content (HTML)"
                    value={editingArticle?.content || ''}
                    onChange={e => setEditingArticle({ ...editingArticle, content: e.target.value })}
                    className="input-field h-32 font-mono text-sm"
                  />

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingArticle?.is_featured || false}
                        onChange={e => setEditingArticle({ ...editingArticle, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Featured
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingArticle?.is_breaking || false}
                        onChange={e => setEditingArticle({ ...editingArticle, is_breaking: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Breaking
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="btn-primary flex items-center gap-2"
                    >
                      <Save size={16} /> Save Article
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); setEditingArticle(null); }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Articles Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.map(article => (
                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white truncate">
                        {article.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {article.category?.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {article.view_count}
                      </td>
                      <td className="px-6 py-4 text-sm flex items-center gap-2">
                        <button
                          onClick={() => { setEditingArticle(article); setShowForm(true); }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Settings configuration coming soon...
            </p>
          </div>
        )}

        {view === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Newsletter Subscribers
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your email list ({subscribers.length} total)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white">
                  <option>All Subscribers</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {subscribers.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Mail size={32} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-3">No subscribers yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Subscribers will appear here as people sign up
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">
                          Source
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-white uppercase">
                          Subscribed
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-900 dark:text-white uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {subscribers.map(sub => (
                        <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {sub.email}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              sub.status === 'active'
                                ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {sub.source}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(sub.subscribed_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Integration section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-8 border border-blue-200 dark:border-blue-900/40">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Email Service Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Connect your newsletter to email service providers for automated campaigns
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-900/40">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Resend</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Simple email API for transactional and marketing emails
                  </p>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Configure Resend →
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-900/40">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Mailchimp</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Email marketing platform with automation and analytics
                  </p>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Configure Mailchimp →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'drafts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI-Generated Drafts
              </h2>
              <button
                onClick={handleGenerateArticle}
                disabled={generatingArticle}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Zap size={16} />
                {generatingArticle ? 'Generating...' : 'Generate New Article'}
              </button>
            </div>

            {draftArticles.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">No draft articles yet. Click "Generate New Article" to create one.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {draftArticles.map(article => (
                  <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap size={16} className="text-brand-600" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {article.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full whitespace-nowrap ml-4">
                        Draft
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{article.read_time} min read</span>
                        <span className="text-brand-600 dark:text-brand-400 font-medium">{article.category?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingArticle(article); setShowForm(true); }}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handlePublishDraft(article)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all text-sm"
                        >
                          <CheckCircle size={16} />
                          Publish
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
