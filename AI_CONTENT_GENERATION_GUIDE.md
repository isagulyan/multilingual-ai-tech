# AI Article Generation System - Configuration Guide

## Overview

TechPulse Media now has an automated AI-powered content generation system that:
- Generates high-quality tech articles using OpenAI's GPT-4o-mini
- Stores articles as drafts in Supabase for editorial review
- Makes them available in the Admin Dashboard for one-click publishing
- Can be scheduled to run automatically on a daily basis

---

## Architecture

### Components

1. **Edge Function**: `/supabase/functions/generate-articles/index.ts`
   - Deployed on Supabase
   - Triggered via HTTP POST request
   - Uses OpenAI API to generate articles
   - Inserts drafts into PostgreSQL database

2. **Admin Dashboard**: Enhanced with "Drafts" tab
   - View all AI-generated drafts
   - Manual "Generate Article" button for on-demand generation
   - One-click publish functionality
   - Edit, delete, or preview before publishing

3. **Database Integration**: Supabase PostgreSQL
   - Articles stored with `status: "draft"`
   - Full metadata (SEO titles, descriptions, keywords)
   - Automatic categorization and author assignment

---

## Setup Instructions

### Step 1: Configure OpenAI API Key

The Edge Function needs access to OpenAI's API. Set the secret in Supabase:

```bash
# Via Supabase Dashboard:
# 1. Go to Project Settings → Edge Functions → Secrets
# 2. Add new secret:
#    Name: OPENAI_API_KEY
#    Value: sk-proj-xxxxxxxxxxxxxxxxxxxx (from openai.com/api-keys)
```

### Step 2: Deploy the Edge Function

The function is already deployed at:
```
https://<project-id>.supabase.co/functions/v1/generate-articles
```

Test it manually:
```bash
curl -X POST https://<project-id>.supabase.co/functions/v1/generate-articles \
  -H "Authorization: Bearer <ANON_KEY>" \
  -H "Content-Type: application/json"
```

### Step 3: Set Up Daily Scheduling

**Option A: Vercel Cron Jobs** (if deploying on Vercel)

Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/generate-articles",
    "schedule": "0 9 * * *"
  }]
}
```

**Option B: Supabase Scheduled Functions** (Recommended)

Use pgcron (PostgreSQL cron extension):

```sql
-- Enable pgcron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily at 9 AM UTC
SELECT cron.schedule(
  'generate-articles-daily',
  '0 9 * * *',
  'SELECT net.http_post(
    url := ''https://<project-id>.supabase.co/functions/v1/generate-articles'',
    headers := jsonb_build_object(
      ''Authorization'', ''Bearer <SERVICE_ROLE_KEY>'',
      ''Content-Type'', ''application/json''
    )
  )'
);

-- View scheduled jobs
SELECT * FROM cron.job;

-- Delete if needed
SELECT cron.unschedule('generate-articles-daily');
```

**Option C: External Scheduler** (e.g., AWS EventBridge, Google Cloud Scheduler)

```bash
# Google Cloud Scheduler example
gcloud scheduler jobs create http generate-articles \
  --schedule="0 9 * * *" \
  --uri="https://<project-id>.supabase.co/functions/v1/generate-articles" \
  --http-method=POST \
  --headers="Authorization=Bearer <ANON_KEY>,Content-Type=application/json" \
  --location=us-central1
```

**Option D: GitHub Actions** (Simple alternative)

Create `.github/workflows/generate-articles.yml`:
```yaml
name: Generate Articles
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate Article
        run: |
          curl -X POST https://<project-id>.supabase.co/functions/v1/generate-articles \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json"
```

---

## Usage

### Manual Article Generation

1. Go to Admin Dashboard → **Drafts** tab
2. Click **"Generate New Article"** button
3. Wait 10-15 seconds for AI to generate
4. Review the generated draft
5. Click **"Publish"** to make live, or **"Edit"** to modify

### Automatic Scheduling

Once configured, articles will be generated automatically at 9 AM UTC daily and appear in the **Drafts** tab for review.

---

## Generated Article Structure

Each AI-generated article includes:

- **Title**: Catchy, SEO-optimized, click-worthy
- **Slug**: URL-friendly identifier
- **Excerpt**: 150-200 character summary
- **Content**: Full HTML with H2/H3 headings, bold emphasis, bullet points
- **Keywords**: 3-5 target SEO keywords
- **SEO Metadata**: Title, description for meta tags
- **Featured Image**: Pexels stock photo (auto-assigned)
- **Category**: Auto-categorized as "Technology News"
- **Status**: Draft (requires manual review before publishing)

---

## System Prompt

The AI uses a strict system prompt targeting US/EU tech audiences:

```
Professional yet engaging tech-insider tone
Flawless US English
Highly scannable structure (H2/H3 headings, bullet points)
Short paragraphs (max 3 sentences each)
Bold key terms for emphasis
Data-driven insights (realistic statistics)
8-12 minute read length (1,500-2,500 words)
Actionable conclusions
```

---

## Customization

### Change Generation Schedule

Modify the cron expression:
- `0 9 * * *` = Daily at 9 AM UTC
- `0 9 * * 1-5` = Weekdays at 9 AM UTC
- `0 */6 * * *` = Every 6 hours
- `0 0 * * 0` = Weekly on Sunday at midnight UTC

### Modify AI Parameters

Edit `/supabase/functions/generate-articles/index.ts`:

```typescript
// Line ~60: Adjust temperature (0-1, lower = more deterministic)
temperature: 0.7,  // Change to 0.5 for stricter adherence

// Line ~61: Adjust max tokens (words * ~4)
max_tokens: 4000,  // Change to 3000 for shorter articles

// Line ~85: Modify tech trends
const TECH_TRENDS = [
  "Your custom trend 1",
  "Your custom trend 2",
  // ...
];
```

### Change Article Category/Author

Modify the database insertion logic:

```typescript
// Line ~120: Change category slug
.eq("slug", "your-category-slug")

// Line ~130: Use specific author
author_id: "hardcoded-uuid"
```

---

## Monitoring

### Check Generation Status

View Edge Function logs in Supabase:
```
Supabase Dashboard → Functions → generate-articles → Logs
```

### Database Queries

```sql
-- View all draft articles
SELECT id, title, created_at, status 
FROM articles 
WHERE status = 'draft' 
ORDER BY created_at DESC;

-- Count generated articles this week
SELECT COUNT(*) as generated_count
FROM articles
WHERE status = 'draft'
AND created_at > NOW() - INTERVAL '7 days'
AND title LIKE '%AI Generated%';  -- or your identifier
```

---

## Error Handling

### Common Issues

**Error: "OpenAI API key not configured"**
- Solution: Add `OPENAI_API_KEY` secret to Supabase Edge Functions

**Error: "No authors found in database"**
- Solution: Ensure at least one author exists in `authors` table

**Error: "Technology category not found"**
- Solution: Create a category with slug `technology-news`

**Error: "Failed to generate article"**
- Solution: Check OpenAI API quota and rate limits

---

## Best Practices

1. **Review Before Publishing**
   - Always review AI-generated content for accuracy
   - Check statistics and claims are realistic
   - Edit for brand voice consistency

2. **Batch Publishing**
   - Generate 5-7 articles per week
   - Publish 1-2 per day for consistent schedule

3. **SEO Optimization**
   - Verify keywords are relevant
   - Test with Google Search Console
   - Monitor rankings over time

4. **Monitor Performance**
   - Track CTR (click-through rate)
   - Monitor average session duration
   - Adjust generation parameters based on performance

5. **Cost Management**
   - Monitor OpenAI API usage (currently ~$0.20 per article)
   - Set spending limits in OpenAI console
   - Consider batch generation during off-peak hours

---

## API Response Example

```json
{
  "success": true,
  "message": "Article generated and inserted successfully",
  "article": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AWS Lost $2B in Revenue: How Smaller Cloud Providers Are Winning 2025",
    "slug": "aws-revenue-loss-smaller-cloud-providers-2025",
    "status": "draft"
  }
}
```

---

## Support & Troubleshooting

For issues or questions:
1. Check Supabase Edge Function logs
2. Review OpenAI API documentation
3. Verify database connection and RLS policies
4. Test Edge Function manually with curl

---

## Next Steps

1. ✅ Configure OpenAI API key
2. ✅ Set up scheduling (choose one option)
3. ✅ Generate first test article
4. ✅ Review in Admin Dashboard
5. ✅ Publish when satisfied
6. ✅ Monitor performance

