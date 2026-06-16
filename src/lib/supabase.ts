import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar_url: string;
  email: string;
  twitter: string;
  linkedin: string;
  website: string;
  role: string;
  article_count: number;
  is_active: boolean;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  parent_id: string | null;
  language: string;
  sort_order: number;
  article_count: number;
  is_active: boolean;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  author_id: string;
  category_id: string;
  tags: string[];
  language: string;
  status: string;
  published_at: string;
  view_count: number;
  read_time: number;
  is_featured: boolean;
  is_editors_pick: boolean;
  is_trending: boolean;
  is_breaking: boolean;
  is_sponsored: boolean;
  sponsor_name: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  affiliate_links: AffiliateLink[];
  created_at: string;
  updated_at: string;
  author?: Author;
  category?: Category;
};

export type AffiliateLink = {
  name: string;
  url: string;
  price?: string;
  badge?: string;
};

export type AffiliateProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  affiliate_url: string;
  category: string;
  rating: number;
  price: string;
  commission_rate: string;
  pros: string[];
  cons: string[];
  badge: string;
  is_featured: boolean;
  is_active: boolean;
  language: string;
  sort_order: number;
  click_count: number;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name: string;
  language: string;
  status: string;
  subscribed_at: string;
};

export type VideoJob = {
  id: string;
  article_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  title: string;
  headline: string;
  excerpt: string;
  thumbnail_url: string;
  video_url: string;
  duration_seconds: number;
  provider: string;
  provider_job_id: string;
  provider_render_url: string;
  is_published: boolean;
  published_at: string | null;
  error_message: string;
  queued_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};
