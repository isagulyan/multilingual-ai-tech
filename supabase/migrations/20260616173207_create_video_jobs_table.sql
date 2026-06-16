
-- ============================================================
-- Video Jobs table — tracks AI short-video generation per article
-- ============================================================
CREATE TABLE IF NOT EXISTS video_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,

  -- Status lifecycle: queued → processing → completed | failed
  status text NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued', 'processing', 'completed', 'failed')),

  -- Video metadata
  title text DEFAULT '',
  headline text DEFAULT '',
  excerpt text DEFAULT '',
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',   -- final rendered video URL (mock CDN URL)
  duration_seconds numeric(5,1) DEFAULT 0,

  -- Provider info (swap in real provider when ready)
  provider text DEFAULT 'mock',   -- 'mock' | 'shotstack' | 'runway' | 'did'
  provider_job_id text DEFAULT '',
  provider_render_url text DEFAULT '',

  -- Publishing
  is_published boolean DEFAULT false,
  published_at timestamptz,

  -- Error info
  error_message text DEFAULT '',

  -- Timings
  queued_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS video_jobs_article_id_idx ON video_jobs(article_id);
CREATE INDEX IF NOT EXISTS video_jobs_status_idx ON video_jobs(status);

-- RLS
ALTER TABLE video_jobs ENABLE ROW LEVEL SECURITY;

-- Public can read completed published videos (for TechPulse TV section)
CREATE POLICY "Published videos are publicly readable"
  ON video_jobs FOR SELECT
  TO anon, authenticated
  USING (status = 'completed' AND is_published = true);

-- service_role manages all video jobs
CREATE POLICY "service_role can manage video_jobs"
  ON video_jobs FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Authenticated admin users can read all video jobs (for admin dashboard)
CREATE POLICY "Authenticated can read video_jobs"
  ON video_jobs FOR SELECT
  TO authenticated
  USING (true);
