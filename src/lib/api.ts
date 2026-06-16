import { supabase, type Article, type Category, type Author, type AffiliateProduct } from './supabase';

export async function getArticles(options: {
  language?: string;
  categorySlug?: string;
  status?: string;
  featured?: boolean;
  editorsPick?: boolean;
  trending?: boolean;
  breaking?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
} = {}) {
  let query = supabase
    .from('articles')
    .select(`*, author:authors(*), category:categories(*)`)
    .order('published_at', { ascending: false });

  if (options.language) query = query.eq('language', options.language);
  if (options.status) query = query.eq('status', options.status);
  else query = query.eq('status', 'published');
  if (options.featured !== undefined) query = query.eq('is_featured', options.featured);
  if (options.editorsPick !== undefined) query = query.eq('is_editors_pick', options.editorsPick);
  if (options.trending !== undefined) query = query.eq('is_trending', options.trending);
  if (options.breaking !== undefined) query = query.eq('is_breaking', options.breaking);
  if (options.search) query = query.ilike('title', `%${options.search}%`);
  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

  if (options.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.categorySlug)
      .maybeSingle();
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as (Article & { author: Author; category: Category })[];
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`*, author:authors(*), category:categories(*)`)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as (Article & { author: Author; category: Category }) | null;
}

export async function getCategories(language = 'en') {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('language', language)
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return (data || []) as Category[];
}

export async function getAffiliateProducts(options: { category?: string; featured?: boolean; language?: string; limit?: number } = {}) {
  let query = supabase
    .from('affiliate_products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (options.category) query = query.eq('category', options.category);
  if (options.featured) query = query.eq('is_featured', true);
  if (options.language) query = query.eq('language', options.language);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as AffiliateProduct[];
}

export async function subscribeNewsletter(email: string, name: string, language: string) {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, name, language, source: 'website' });
  if (error && error.code !== '23505') throw error;
  return true;
}

export async function incrementViewCount(articleId: string) {
  try {
    const { error } = await supabase.rpc('increment_article_view', { article_id: articleId });
    if (error) console.error('Error incrementing view count:', error);
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

export async function createArticle(article: Partial<Article>) {
  const { data, error } = await supabase.from('articles').insert(article).select().maybeSingle();
  if (error) throw error;
  return data as Article;
}

export async function updateArticle(id: string, article: Partial<Article>) {
  const { data, error } = await supabase.from('articles').update(article).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data as Article;
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

export async function getAuthors() {
  const { data, error } = await supabase.from('authors').select('*').eq('is_active', true).order('name');
  if (error) throw error;
  return (data || []) as Author[];
}

export async function getNewsletterStats() {
  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');
  if (error) throw error;
  return count || 0;
}

export async function getArticleStats() {
  const { data, error } = await supabase
    .from('articles')
    .select('view_count, status')
    .eq('status', 'published');
  if (error) throw error;
  const articles = data || [];
  return {
    total: articles.length,
    totalViews: articles.reduce((sum, a) => sum + (a.view_count || 0), 0),
  };
}
