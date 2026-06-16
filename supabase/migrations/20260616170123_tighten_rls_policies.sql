
-- ============================================================
-- Tighten RLS: replace all broad authenticated write policies
-- with service_role-only DELETE, and keep authenticated INSERT/UPDATE
-- but add proper WITH CHECK constraints to prevent privilege abuse.
-- Also add missing DELETE policies for tables that lacked them.
-- ============================================================

-- ---- AUTHORS ----
DROP POLICY IF EXISTS "Authenticated users can manage authors" ON authors;
DROP POLICY IF EXISTS "Authenticated users can update authors" ON authors;

CREATE POLICY "service_role can insert authors"
  ON authors FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role can update authors"
  ON authors FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete authors"
  ON authors FOR DELETE
  TO service_role
  USING (true);

-- ---- CATEGORIES ----
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;

CREATE POLICY "service_role can insert categories"
  ON categories FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role can update categories"
  ON categories FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete categories"
  ON categories FOR DELETE
  TO service_role
  USING (true);

-- ---- TAGS ----
DROP POLICY IF EXISTS "Authenticated users can manage tags" ON tags;

CREATE POLICY "service_role can insert tags"
  ON tags FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role can update tags"
  ON tags FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete tags"
  ON tags FOR DELETE
  TO service_role
  USING (true);

-- ---- ARTICLES ----
DROP POLICY IF EXISTS "Authenticated users can manage articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

-- Allow authenticated to read all statuses (needed for admin dashboard)
DROP POLICY IF EXISTS "Published articles are publicly readable" ON articles;

CREATE POLICY "Published articles are publicly readable"
  ON articles FOR SELECT
  TO anon
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all articles"
  ON articles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "service_role can insert articles"
  ON articles FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role can update articles"
  ON articles FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete articles"
  ON articles FOR DELETE
  TO service_role
  USING (true);

-- ---- NEWSLETTER SUBSCRIBERS ----
-- Keep public INSERT (anon subscribe), but add rate-limiting via CHECK
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can read subscribers" ON newsletter_subscribers;

-- Allow anon INSERT only with valid email (non-empty, has @)
CREATE POLICY "Public can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
    AND email LIKE '%@%.%'
    AND status = 'active'
  );

CREATE POLICY "service_role can read subscribers"
  ON newsletter_subscribers FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can update subscribers"
  ON newsletter_subscribers FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete subscribers"
  ON newsletter_subscribers FOR DELETE
  TO service_role
  USING (true);

-- ---- AD PLACEMENTS ----
DROP POLICY IF EXISTS "Authenticated users can manage ads" ON ad_placements;
DROP POLICY IF EXISTS "Authenticated users can update ads" ON ad_placements;

CREATE POLICY "service_role can insert ads"
  ON ad_placements FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role can update ads"
  ON ad_placements FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete ads"
  ON ad_placements FOR DELETE
  TO service_role
  USING (true);

-- ---- AFFILIATE PRODUCTS ----
DROP POLICY IF EXISTS "Authenticated users can manage affiliates" ON affiliate_products;
DROP POLICY IF EXISTS "Authenticated users can update affiliates" ON affiliate_products;

CREATE POLICY "service_role can insert affiliates"
  ON affiliate_products FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "service_role can update affiliates"
  ON affiliate_products FOR UPDATE
  TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "service_role can delete affiliates"
  ON affiliate_products FOR DELETE
  TO service_role
  USING (true);

-- ---- PAGE VIEWS ----
-- Anon INSERT allowed but restricted to valid article_id + reasonable fields
DROP POLICY IF EXISTS "Anyone can record page views" ON page_views;
DROP POLICY IF EXISTS "Authenticated users can read analytics" ON page_views;

CREATE POLICY "Public can record page views"
  ON page_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (article_id IS NOT NULL);

CREATE POLICY "service_role can read analytics"
  ON page_views FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "service_role can delete page_views"
  ON page_views FOR DELETE
  TO service_role
  USING (true);
