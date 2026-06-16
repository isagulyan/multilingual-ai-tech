
/*
  # TechPulse Media Platform - Core Schema

  ## Overview
  Full schema for a multilingual enterprise media platform covering AI, Tech, Finance, and Business.

  ## New Tables

  ### authors
  - id, name, slug, bio, avatar_url, email, twitter, linkedin, role, created_at

  ### categories
  - id, name, slug, description, icon, color, parent_id, language, sort_order

  ### articles
  - id, title, slug, excerpt, content, featured_image, author_id, category_id,
    tags, language, status, published_at, scheduled_at, view_count, read_time,
    is_featured, is_editors_pick, is_sponsored, seo_title, seo_description,
    og_image, schema_type, affiliate_links (jsonb), created_at, updated_at

  ### tags
  - id, name, slug, description, language

  ### newsletter_subscribers
  - id, email, name, language, status, subscribed_at, source

  ### ad_placements
  - id, name, position, type, code, is_active, start_date, end_date

  ### affiliate_products
  - id, name, slug, description, image_url, affiliate_url, category, rating,
    price, commission_rate, is_featured, language

  ### page_views
  - id, article_id, ip_hash, user_agent, referrer, created_at

  ## Security
  - RLS enabled on all tables
  - Public read access for published content
  - Authenticated write access for admin operations
*/

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  email text UNIQUE NOT NULL,
  twitter text DEFAULT '',
  linkedin text DEFAULT '',
  website text DEFAULT '',
  role text DEFAULT 'author',
  article_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  color text DEFAULT '#3B82F6',
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  language text DEFAULT 'en',
  sort_order integer DEFAULT 0,
  article_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_language_idx ON categories(slug, language);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text DEFAULT '',
  language text DEFAULT 'en',
  article_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_language_idx ON tags(slug, language);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image text DEFAULT '',
  featured_image_alt text DEFAULT '',
  author_id uuid REFERENCES authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  language text DEFAULT 'en',
  status text DEFAULT 'draft',
  published_at timestamptz,
  scheduled_at timestamptz,
  view_count integer DEFAULT 0,
  read_time integer DEFAULT 5,
  is_featured boolean DEFAULT false,
  is_editors_pick boolean DEFAULT false,
  is_trending boolean DEFAULT false,
  is_breaking boolean DEFAULT false,
  is_sponsored boolean DEFAULT false,
  sponsor_name text DEFAULT '',
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  og_image text DEFAULT '',
  canonical_url text DEFAULT '',
  schema_type text DEFAULT 'Article',
  affiliate_links jsonb DEFAULT '[]',
  related_article_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_language_idx ON articles(slug, language);
CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS articles_category_id_idx ON articles(category_id);
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON articles(author_id);
CREATE INDEX IF NOT EXISTS articles_language_idx ON articles(language);
CREATE INDEX IF NOT EXISTS articles_is_featured_idx ON articles(is_featured);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text DEFAULT '',
  language text DEFAULT 'en',
  status text DEFAULT 'active',
  source text DEFAULT 'website',
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- Ad placements
CREATE TABLE IF NOT EXISTS ad_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  ad_type text DEFAULT 'banner',
  ad_code text DEFAULT '',
  image_url text DEFAULT '',
  click_url text DEFAULT '',
  width integer DEFAULT 728,
  height integer DEFAULT 90,
  is_active boolean DEFAULT true,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Affiliate products
CREATE TABLE IF NOT EXISTS affiliate_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  affiliate_url text NOT NULL,
  category text NOT NULL,
  rating numeric(3,1) DEFAULT 0,
  price text DEFAULT '',
  commission_rate text DEFAULT '',
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  badge text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  language text DEFAULT 'en',
  sort_order integer DEFAULT 0,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Page views for analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  session_id text DEFAULT '',
  referrer text DEFAULT '',
  country text DEFAULT '',
  device_type text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_article_id_idx ON page_views(article_id);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Authors: public read, authenticated write
CREATE POLICY "Authors are publicly readable"
  ON authors FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage authors"
  ON authors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update authors"
  ON authors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories: public read, authenticated write
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tags: public read, authenticated write
CREATE POLICY "Tags are publicly readable"
  ON tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Articles: public read for published, authenticated for all
CREATE POLICY "Published articles are publicly readable"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated users can manage articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);

-- Newsletter: insert only for anon
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- Ad placements: public read active ads
CREATE POLICY "Active ads are publicly readable"
  ON ad_placements FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage ads"
  ON ad_placements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ads"
  ON ad_placements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Affiliate products: public read active
CREATE POLICY "Active affiliate products are publicly readable"
  ON affiliate_products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage affiliates"
  ON affiliate_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update affiliates"
  ON affiliate_products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Page views: insert for all, read for authenticated
CREATE POLICY "Anyone can record page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read analytics"
  ON page_views FOR SELECT
  TO authenticated
  USING (true);
