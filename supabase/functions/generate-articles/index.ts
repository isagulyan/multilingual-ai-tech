import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Prompt engineering for AI content generation
const SYSTEM_PROMPT = `You are an expert tech journalist and SEO copywriter for TechPulse Media, targeting a tech-savvy US and European audience.

Your task is to generate highly engaging, original, and factual tech articles based on viral trends.

STRICT REQUIREMENTS:
1. Language: Flawless US English, professional yet engaging (tech-insider style)
2. Structure:
   - Hook: 2-sentence intro explaining WHY this matters today
   - Content: Use H2/H3 headings, bullet points, short paragraphs (max 3 sentences)
   - Bold key terms, use tables for comparisons
   - Conclusion: End with thought-provoking question
3. Length: 1,500-2,500 words (8-12 minute read)
4. Format: Return as structured JSON with fields:
   - title (catchy, click-worthy but not clickbait)
   - slug (URL-friendly)
   - excerpt (150-200 chars)
   - content (HTML formatted)
   - keywords (comma-separated)
   - featured_image_alt (descriptive alt text)
5. SEO: Naturally integrate 3-5 target keywords
6. Tone: Authoritative, future-focused, actionable insights

Return ONLY valid JSON, no markdown or extra text.`;

interface GeneratedArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string;
  featured_image_alt: string;
  seo_title: string;
  seo_description: string;
}

// Tech trends for article generation
const TECH_TRENDS = [
  "Latest AI model releases and capabilities",
  "Enterprise cloud migration trends",
  "Cybersecurity vulnerabilities and patches",
  "Open-source adoption in enterprises",
  "Developer tool innovations",
  "SaaS pricing wars and consolidation",
  "Web hosting performance benchmarks",
  "VPN security concerns and solutions",
  "Database technology comparisons",
  "DevOps and infrastructure automation",
];

async function generateArticleWithAI(): Promise<GeneratedArticle> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  // Select random tech trend
  const trend = TECH_TRENDS[Math.floor(Math.random() * TECH_TRENDS.length)];

  const userPrompt = `Generate a viral tech article about this trend: "${trend}"

Focus on:
- Real data and statistics (make realistic numbers)
- Impact on US and European tech markets
- Actionable insights for developers/CTOs
- Competitive landscape analysis
- Future implications

Return valid JSON only with fields: title, slug, excerpt, content, keywords, featured_image_alt, seo_title, seo_description`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response
    const article: GeneratedArticle = JSON.parse(content);

    // Validate required fields
    if (!article.title || !article.slug || !article.content) {
      throw new Error("Generated article missing required fields");
    }

    return article;
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
}

async function insertArticleIntoDB(
  article: GeneratedArticle,
  supabaseClient: ReturnType<typeof createClient>
) {
  // Get a default author (first author in system)
  const { data: authors, error: authorError } = await supabaseClient
    .from("authors")
    .select("id")
    .limit(1);

  if (authorError || !authors || authors.length === 0) {
    throw new Error("No authors found in database");
  }

  const authorId = authors[0].id;

  // Get technology category
  const { data: categories, error: categoryError } = await supabaseClient
    .from("categories")
    .select("id")
    .eq("slug", "technology-news")
    .limit(1);

  if (categoryError || !categories || categories.length === 0) {
    throw new Error("Technology category not found");
  }

  const categoryId = categories[0].id;

  // Insert article as draft
  const { data: inserted, error: insertError } = await supabaseClient
    .from("articles")
    .insert([
      {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author_id: authorId,
        category_id: categoryId,
        tags: article.keywords.split(",").map((k: string) => k.trim()),
        language: "en",
        status: "draft",
        read_time: Math.ceil(article.content.length / 200), // Rough estimate
        is_featured: false,
        is_editors_pick: false,
        is_breaking: false,
        is_trending: false,
        seo_title: article.seo_title,
        seo_description: article.seo_description,
        featured_image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg",
        featured_image_alt: article.featured_image_alt,
        published_at: new Date(),
      },
    ])
    .select();

  if (insertError) {
    throw new Error(`Database insert error: ${insertError.message}`);
  }

  return inserted?.[0];
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting article generation...");

    // Generate article with AI
    const article = await generateArticleWithAI();
    console.log(`Generated article: ${article.title}`);

    // Insert into database
    const inserted = await insertArticleIntoDB(article, supabase);
    console.log(`Inserted article with ID: ${inserted?.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Article generated and inserted successfully",
        article: {
          id: inserted?.id,
          title: article.title,
          slug: article.slug,
          status: "draft",
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
