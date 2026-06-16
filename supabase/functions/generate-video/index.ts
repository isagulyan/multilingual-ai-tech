import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ─── Mock video CDN assets (royalty-free MP4 from public sources) ─────────────
// These are real, publicly accessible short demo videos used as placeholders.
const MOCK_VIDEO_POOL = [
  {
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: 9.7,
  },
  {
    url: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: 13.2,
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: 15.0,
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnail: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: 17.4,
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800",
    duration: 12.1,
  },
];

// ─── Provider stub (swap real API calls in here when ready) ──────────────────
// To integrate Shotstack: replace this function body with their render API call.
// To integrate Runway ML: swap to their /v1/generation endpoint.
// To integrate D-ID: swap to their /talks endpoint.
async function callVideoProvider(
  _title: string,
  _headline: string,
  _imageUrl: string,
  _duration: number
): Promise<{ providerJobId: string; renderUrl: string }> {
  // MOCK: simulate async provider job submission
  const providerJobId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    providerJobId,
    renderUrl: `https://mock-video-cdn.techpulse.media/renders/${providerJobId}`,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json().catch(() => ({}));
    const { article_id, force = false } = body as { article_id?: string; force?: boolean };

    if (!article_id) {
      return new Response(
        JSON.stringify({ success: false, error: "article_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 1. Fetch article ──────────────────────────────────────────────────────
    const { data: article, error: artErr } = await supabase
      .from("articles")
      .select("id, title, excerpt, featured_image, slug")
      .eq("id", article_id)
      .maybeSingle();

    if (artErr || !article) {
      return new Response(
        JSON.stringify({ success: false, error: "Article not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── 2. Check for existing non-failed job ─────────────────────────────────
    if (!force) {
      const { data: existing } = await supabase
        .from("video_jobs")
        .select("id, status")
        .eq("article_id", article_id)
        .neq("status", "failed")
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Video job already exists",
            job_id: existing.id,
            status: existing.status,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // ── 3. Create job record in QUEUED state ─────────────────────────────────
    const { data: job, error: jobErr } = await supabase
      .from("video_jobs")
      .insert({
        article_id,
        title: article.title,
        headline: article.title.length > 60
          ? article.title.slice(0, 57) + "..."
          : article.title,
        excerpt: article.excerpt?.slice(0, 120) || "",
        thumbnail_url: article.featured_image || MOCK_VIDEO_POOL[0].thumbnail,
        status: "queued",
        provider: "mock",
        queued_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (jobErr || !job) {
      throw new Error(`Failed to create video job: ${jobErr?.message}`);
    }

    // ── 4. Mark as PROCESSING ────────────────────────────────────────────────
    await supabase
      .from("video_jobs")
      .update({ status: "processing", started_at: new Date().toISOString() })
      .eq("id", job.id);

    // ── 5. Call provider (mock) ──────────────────────────────────────────────
    const { providerJobId, renderUrl } = await callVideoProvider(
      article.title,
      article.title,
      article.featured_image || "",
      15
    );

    // ── 6. Simulate render time (2-4 seconds) — real providers take 30–120s ─
    const renderDelay = 2000 + Math.random() * 2000;
    await new Promise(r => setTimeout(r, renderDelay));

    // ── 7. Pick mock video result ─────────────────────────────────────────────
    const mock = MOCK_VIDEO_POOL[Math.floor(Math.random() * MOCK_VIDEO_POOL.length)];

    // ── 8. Mark COMPLETED ────────────────────────────────────────────────────
    const { data: completed, error: updateErr } = await supabase
      .from("video_jobs")
      .update({
        status: "completed",
        video_url: mock.url,
        thumbnail_url: article.featured_image || mock.thumbnail,
        duration_seconds: mock.duration,
        provider_job_id: providerJobId,
        provider_render_url: renderUrl,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id)
      .select()
      .maybeSingle();

    if (updateErr) throw new Error(`Failed to update job: ${updateErr.message}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Video generated successfully",
        job: completed,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("generate-video error:", error);

    // Attempt to mark any in-progress job as failed
    try {
      const body = await req.text().catch(() => "{}");
      const { article_id } = JSON.parse(body) as { article_id?: string };
      if (article_id) {
        await supabase
          .from("video_jobs")
          .update({
            status: "failed",
            error_message: error instanceof Error ? error.message : "Unknown error",
          })
          .eq("article_id", article_id)
          .eq("status", "processing");
      }
    } catch (_) { /* swallow */ }

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
