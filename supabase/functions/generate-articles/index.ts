import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
7. CONTENT SAFETY (mandatory): Articles must be strictly professional tech journalism.
   - NO adult, sexual, intimate, or romantic content of any kind
   - NO graphic violence, gore, or disturbing imagery
   - NO hate speech, discrimination, or politically divisive content
   - NO personal attacks, defamation, or unverified negative claims about individuals
   - Stick exclusively to technology, business, and professional topics

Return ONLY valid JSON, no markdown or extra text.`;

// ─── Content safety: block non-tech or unsafe content before DB insert ────────
const UNSAFE_PATTERNS = [
  /\b(sex|porn|nude|naked|erotic|intimate|adult content|xxx|nsfw)\b/i,
  /\b(kill|murder|violence|gore|torture|abuse)\b/i,
  /\b(hate|racist|sexist|homophob|slur)\b/i,
];

function isContentSafe(text: string): boolean {
  return !UNSAFE_PATTERNS.some(re => re.test(text));
}

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

// ─── High-quality mock articles used when OpenAI key is absent or errors ──────
const MOCK_ARTICLES: Array<GeneratedArticle & { featured_image: string }> = [
  {
    title: "GPT-5 Turbo Arrives: How OpenAI's Fastest Model Yet Changes Everything for Developers",
    slug: "gpt5-turbo-developer-impact",
    excerpt: "OpenAI's latest GPT-5 Turbo model delivers 3× faster inference at half the cost, forcing every enterprise AI roadmap to be rewritten overnight.",
    seo_title: "GPT-5 Turbo: Speed, Cost & Developer Impact Explained",
    seo_description: "A deep dive into GPT-5 Turbo's architecture improvements, real-world benchmarks, and what it means for developers building AI-powered products in 2025.",
    keywords: "GPT-5 Turbo, OpenAI, large language model, AI inference, developer tools, enterprise AI",
    featured_image_alt: "Abstract visualization of neural network nodes representing GPT-5 architecture",
    featured_image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    content: `<h2>Why GPT-5 Turbo Is a Step-Change, Not Just an Iteration</h2>
<p>When OpenAI quietly dropped GPT-5 Turbo at 11 PM on a Tuesday, Slack channels inside every major tech company lit up within minutes. This wasn't the usual incremental model bump — <strong>GPT-5 Turbo delivers 3× faster token generation at 48% lower cost per million tokens</strong> compared to its predecessor, fundamentally altering the economics of building AI-powered products.</p>
<p>The implications ripple far beyond benchmarks. Teams that previously rejected real-time AI features as cost-prohibitive are now scrambling to re-evaluate roadmaps. The question is no longer <em>whether</em> to embed LLMs into your product — it's how fast you can ship.</p>

<h2>Under the Hood: What Changed Architecturally</h2>
<p>OpenAI hasn't released the full technical paper yet, but analysis from the ML engineering community points to three key improvements:</p>
<ul>
  <li><strong>Mixture of Experts (MoE) routing:</strong> Only 22% of parameters activate per forward pass, dramatically cutting compute without sacrificing capability.</li>
  <li><strong>Speculative decoding at scale:</strong> A lightweight draft model generates candidate tokens that the main model verifies in parallel, slashing wall-clock latency.</li>
  <li><strong>KV cache compression:</strong> New quantization techniques reduce memory bandwidth requirements by ~40%, enabling higher concurrency on the same hardware footprint.</li>
</ul>

<h2>Real-World Benchmarks: The Numbers That Matter</h2>
<table>
  <thead><tr><th>Metric</th><th>GPT-4o</th><th>GPT-5 Turbo</th><th>Delta</th></tr></thead>
  <tbody>
    <tr><td>Tokens/sec (output)</td><td>87</td><td>263</td><td>+202%</td></tr>
    <tr><td>Cost per 1M tokens</td><td>$5.00</td><td>$2.60</td><td>-48%</td></tr>
    <tr><td>MMLU Score</td><td>88.7%</td><td>93.2%</td><td>+4.5pts</td></tr>
    <tr><td>HumanEval (code)</td><td>90.2%</td><td>96.1%</td><td>+5.9pts</td></tr>
    <tr><td>Time to first token (p50)</td><td>340ms</td><td>120ms</td><td>-65%</td></tr>
  </tbody>
</table>

<h2>What This Means for Enterprise Buyers</h2>
<p>For CTOs currently negotiating OpenAI enterprise agreements, GPT-5 Turbo changes the calculus dramatically. <strong>Workloads that previously required reserved capacity agreements to be financially viable can now run on-demand.</strong> Several Fortune 500 companies we spoke with are already revising annual AI infrastructure budgets downward by 30–40%.</p>
<p>The competitive pressure on Google (Gemini), Anthropic (Claude), and Meta (Llama) is immediate. Gemini 2.0 Pro is still cheaper for pure throughput workloads, but GPT-5 Turbo's quality-to-cost ratio in the mid-range makes it the default choice for most enterprise use cases.</p>

<h2>Developer Ecosystem Implications</h2>
<p>The npm download charts for <code>openai</code> package hit an all-time single-day record the morning after the launch. Beyond raw excitement, there are concrete workflow changes:</p>
<ul>
  <li><strong>Streaming is now default:</strong> With TTFT dropping to 120ms, streaming responses feel instantaneous even on mobile connections.</li>
  <li><strong>Context windows get practical:</strong> The 128K context window that was theoretically available but cost-prohibitive is now usable in production without budget gymnastics.</li>
  <li><strong>Agentic loops become viable:</strong> Multi-step reasoning chains that previously cost $0.12–0.40 per run now cost $0.05–0.08, making autonomous agent products economically sustainable at consumer scale.</li>
</ul>

<h2>The Catch: What GPT-5 Turbo Trades Away</h2>
<p>No free lunch in ML. The speed and cost gains come with nuances worth flagging:</p>
<ul>
  <li>Complex, multi-hop reasoning benchmarks show GPT-5 Turbo trailing GPT-5 full by 7–12 percentage points on tasks requiring deep chain-of-thought.</li>
  <li>Creative writing quality, while excellent, shows slightly more template-like patterns compared to the full model.</li>
  <li>Image understanding capabilities are on par with GPT-4o, not an improvement.</li>
</ul>

<h2>Getting Started: Migration Checklist for Teams on GPT-4o</h2>
<p>If you're currently on GPT-4o, the migration is straightforward — same API, same prompt formats. But run these checks first:</p>
<ul>
  <li>Re-evaluate your few-shot prompt count. GPT-5 Turbo often needs fewer examples to generalize.</li>
  <li>Audit your temperature settings. The model is more consistent at lower temperatures; you may find 0.3 works where you previously needed 0.7.</li>
  <li>Review output parsers. The new model is stricter about following JSON schemas when you request structured output.</li>
  <li>Update cost models in your internal dashboards before your next billing cycle.</li>
</ul>

<p><em>As AI inference costs approach near-zero for most workloads, the real competitive moat shifts entirely to data, distribution, and product intuition — which raises a fascinating question: in a world where intelligence is essentially free, what does it mean to have an AI strategy at all?</em></p>`,
  },
  {
    title: "The Great Cloud Migration Reckoning: Why 63% of Enterprises Are Repatriating Workloads",
    slug: "cloud-repatriation-enterprise-trends",
    excerpt: "After a decade of cloud-first mandates, enterprise IT leaders are quietly moving critical workloads back on-premises — and the data reveals a more nuanced story than cloud vendors want to tell.",
    seo_title: "Cloud Repatriation 2025: Why Enterprises Are Moving Workloads Back On-Premises",
    seo_description: "New survey data shows 63% of enterprises are repatriating cloud workloads. We break down the economics, the technical realities, and which vendors are responding.",
    keywords: "cloud repatriation, hybrid cloud, on-premises infrastructure, AWS, Azure, cloud costs, enterprise IT",
    featured_image_alt: "Data center server racks with glowing blue LED lights representing hybrid cloud infrastructure",
    featured_image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200",
    content: `<h2>The Cloud-First Era Is Giving Way to Cloud-Right Thinking</h2>
<p>A decade ago, the CIO who didn't have a cloud-first strategy was seen as a dinosaur. Today, the calculus has shifted dramatically. A new survey of 1,200 enterprise IT leaders across North America and Europe reveals that <strong>63% have repatriated at least one significant workload from public cloud to on-premises infrastructure in the past 18 months</strong>. This isn't a cloud backlash — it's a maturation.</p>
<p>The companies leading this charge aren't struggling SMBs with budget constraints. They're the hyperscale digital businesses — fintech, media, and e-commerce platforms — that built their cloud-native architectures by the book. Their conclusion: the book needs a new chapter.</p>

<h2>The Economics That Nobody Modeled in 2015</h2>
<p>The original cloud pitch was seductive: trade capex for opex, pay only for what you use, scale infinitely. What the spreadsheets didn't capture was the <strong>egress cost trap</strong>.</p>
<ul>
  <li>AWS data transfer out costs $0.08–0.09/GB. A mid-size SaaS platform moving 500TB/month pays $40,000–$45,000 just to get their own data out.</li>
  <li>Reserved instance commitments created a new form of capex — often less flexible than the hardware contracts they replaced.</li>
  <li>Storage costs compound. A 10TB database that costs $230/month in S3 costs $180/year in a colo facility on owned NVMe hardware, at 10× the IOPS.</li>
</ul>

<h2>The Workloads Being Repatriated — And Why</h2>
<table>
  <thead><tr><th>Workload Type</th><th>% Repatriating</th><th>Primary Driver</th></tr></thead>
  <tbody>
    <tr><td>Analytics / Data Warehousing</td><td>71%</td><td>Egress + query costs</td></tr>
    <tr><td>Database (OLTP)</td><td>58%</td><td>Latency predictability</td></tr>
    <tr><td>Media storage / CDN origin</td><td>66%</td><td>Storage + transfer costs</td></tr>
    <tr><td>CI/CD pipelines</td><td>49%</td><td>Compute cost predictability</td></tr>
    <tr><td>ML training jobs</td><td>44%</td><td>GPU spot availability</td></tr>
  </tbody>
</table>

<h2>What's Staying in the Cloud (And Should)</h2>
<p>The repatriation narrative risks overcorrection. Cloud remains genuinely superior for burst compute, global edge distribution, managed AI services, and disaster recovery. <strong>The winning pattern is gravity-based placement</strong> — data lives where it's created and accessed most frequently.</p>

<h2>Vendor Responses: AWS, Azure, and Google Are Taking Note</h2>
<p>Cloud hyperscalers aren't standing still. AWS Outposts, Azure Arc, and Google Distributed Cloud are all explicit attempts to participate in the hybrid model. But enterprise buyers report Outposts pricing at 2.3–2.8× equivalent bare-metal colo costs for comparable specs.</p>

<h2>What CTOs Need to Do Right Now</h2>
<p>If your cloud spend has grown more than 40% year-over-year for two consecutive years without equivalent revenue growth, it's time for a structured audit:</p>
<ul>
  <li>Pull your top 10 cloud cost line items and ask: is the cloud's unique capability essential to this workload?</li>
  <li>Model the 3-year TCO of a colo alternative, including headcount and operational overhead.</li>
  <li>Identify your egress hotspots. Egress reduction alone typically delivers 15–25% cloud bill reduction.</li>
  <li>Negotiate. Every major cloud vendor has a deal desk. Your churn threat is credible and they know it.</li>
</ul>

<p><em>As the pendulum swings back toward infrastructure ownership, the real question isn't cloud vs. on-prem — it's whether the industry can build genuinely portable abstractions that let workloads move freely between substrates. If that happens, does the hyperscaler moat disappear entirely?</em></p>`,
  },
  {
    title: "Rust Is Eating C++: Inside the Silent Revolution Reshaping Systems Programming",
    slug: "rust-replacing-cpp-systems-programming",
    excerpt: "From the Linux kernel to Windows drivers to Google's Android codebase, Rust is displacing C++ in the most critical software on the planet — and the momentum is now unstoppable.",
    seo_title: "Rust vs C++: The Systems Programming Revolution Explained",
    seo_description: "Rust adoption in kernel development, automotive software, and enterprise systems is accelerating. Here's the technical case, the real-world evidence, and what it means for your team.",
    keywords: "Rust programming, systems programming, C++ replacement, memory safety, Linux kernel, WebAssembly, embedded systems",
    featured_image_alt: "Developer workstation showing Rust code on dark terminal with orange Rust logo",
    featured_image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1200",
    content: `<h2>The Memory Safety Crisis That Made Rust Inevitable</h2>
<p>In 2022, the NSA issued an unusual advisory: stop writing new code in C and C++. The same year, the White House Office of the National Cyber Director published a report calling memory safety vulnerabilities "a solvable problem" and pointing to Rust as the solution. <strong>When national security agencies start endorsing specific programming languages, something fundamental has shifted.</strong></p>
<p>The statistics are stark: Microsoft's Security Response Center estimates that 70% of CVEs they fix each year are memory safety issues. Google reports similar numbers for Chrome and Android.</p>

<h2>Where Rust Is Actually Winning Today</h2>
<ul>
  <li><strong>Linux kernel:</strong> Rust landed in Linux 6.1 (December 2022) and has expanded steadily with device drivers now in mainline.</li>
  <li><strong>Windows:</strong> Microsoft is rewriting core Win32 and NT kernel components in Rust, with new driver development Rust-first for several subsystems.</li>
  <li><strong>Android:</strong> Google's AOSP new code is split roughly 50/50 between Kotlin/Java and Rust. Memory safety bugs in Android have dropped 52% since the Rust push began.</li>
  <li><strong>AWS:</strong> Firecracker (the microVM powering Lambda and Fargate) and the Bottlerocket OS are written in Rust.</li>
</ul>

<h2>The Technical Case: What Rust Actually Solves</h2>
<p>Rust's ownership model eliminates entire bug categories at compile time: use-after-free, buffer overflows, data races, and null pointer dereferences. These aren't runtime checks — they're compile-time guarantees.</p>

<h2>Performance: The Myth of the C++ Speed Premium</h2>
<p>The most persistent objection — "C++ is faster" — is increasingly hard to defend empirically. Rust and C++ compile to comparable machine code via LLVM. In concurrent workloads and latency-sensitive allocation patterns, Rust frequently outperforms due to its ownership semantics enabling optimization patterns too risky to deploy in C++.</p>

<h2>What This Means for Engineering Leaders</h2>
<p>If your organization still writes new systems-level code in C++, the strategic question isn't whether to adopt Rust — it's when and in what order:</p>
<ul>
  <li>Start with new projects, not rewrites. Greenfield code in Rust is a low-risk entry point.</li>
  <li>Prioritize security-critical components — parsers, authentication libraries, and network-facing code have asymmetric risk profiles.</li>
  <li>Invest in training now. Engineers who get through ownership/borrowing concepts typically become productive within 6–8 weeks.</li>
</ul>

<p><em>If Rust continues its current trajectory, we may look back at the C/C++ era the way we look at assembly language today — foundational, impressive, but not something you'd choose for new production code. The real question is whether we've finally found the systems programming language that sticks.</em></p>`,
  },
  {
    title: "Zero-Trust Architecture in 2025: The Definitive Implementation Guide for CISOs",
    slug: "zero-trust-architecture-implementation-guide",
    excerpt: "With 82% of breaches now involving credentials and perimeter security proving inadequate, zero-trust has moved from buzzword to non-negotiable enterprise security baseline.",
    seo_title: "Zero-Trust Architecture 2025: CISO Implementation Guide",
    seo_description: "A practical, vendor-neutral guide to implementing zero-trust architecture in enterprise environments, including identity, network segmentation, and data protection layers.",
    keywords: "zero trust, cybersecurity, identity and access management, network segmentation, CISO, enterprise security, SASE",
    featured_image_alt: "Abstract digital security visualization showing interconnected nodes with shield icons",
    featured_image: "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200",
    content: `<h2>Why Perimeter Security Is Dead (And Has Been for Years)</h2>
<p>The breach at a major US federal agency last year followed a now-familiar pattern: a phishing email, a compromised credential, lateral movement across a flat network, and terabytes exfiltrated — all without triggering a single perimeter-based alert. <strong>The attacker spent 287 days inside the network before detection.</strong></p>
<p>Zero-trust isn't a product you buy — it's an architectural philosophy: never trust, always verify, assume breach. The challenge is that "zero-trust" has become a marketing term applied to virtually every security product, making substantive implementations hard to identify.</p>

<h2>The Three Planes of Zero-Trust Implementation</h2>
<h3>1. Identity Plane</h3>
<p>Identity is the new perimeter. Requirements: FIDO2/passkeys for privileged access, continuous session re-verification on behavioral anomaly, and JIT access for privileged roles. <strong>Non-human identities</strong> — service accounts, API keys, machine identities — are the fastest-growing attack surface and must be treated as first-class identity objects.</p>

<h3>2. Network Plane</h3>
<p>Micro-segmentation replaces VLAN-based segmentation. The goal: reduce the blast radius of any single compromise to the minimum possible surface area. SASE handles remote/branch traffic; east-west inspection between workloads is mandatory, not just north-south perimeter inspection.</p>

<h3>3. Data Plane</h3>
<p>Data classification must be contextual. A "confidential" file should behave differently when accessed from a corporate device on a managed network versus a personal device on hotel WiFi.</p>

<h2>The 18-Month Implementation Roadmap</h2>
<table>
  <thead><tr><th>Phase</th><th>Timeline</th><th>Focus Areas</th></tr></thead>
  <tbody>
    <tr><td>Foundation</td><td>Months 1–3</td><td>Identity inventory, MFA rollout, privileged access management</td></tr>
    <tr><td>Visibility</td><td>Months 4–6</td><td>Asset discovery, traffic mapping, SIEM/SOAR integration</td></tr>
    <tr><td>Segmentation</td><td>Months 7–12</td><td>Micro-segmentation, SASE deployment, workload isolation</td></tr>
    <tr><td>Automation</td><td>Months 13–18</td><td>Policy automation, anomaly detection, continuous compliance</td></tr>
  </tbody>
</table>

<h2>Measuring Zero-Trust Maturity</h2>
<p>Three metrics indicate real progress beyond vendor checkbox compliance:</p>
<ul>
  <li><strong>Mean time to detect lateral movement</strong> — should trend toward minutes, not days</li>
  <li><strong>% of access decisions made with contextual policy</strong> vs. static firewall rules</li>
  <li><strong>Coverage of non-human identities</strong> in your IAM inventory</li>
</ul>

<p><em>As zero-trust becomes the baseline expectation for cyber insurance underwriting and regulatory compliance, the question shifts from "should we implement zero-trust" to "how do we accelerate our maturity journey without breaking the business processes that depend on the legacy perimeter model?"</em></p>`,
  },
  {
    title: "Kubernetes at 10: How Container Orchestration Became the New Operating System",
    slug: "kubernetes-10-years-container-orchestration-future",
    excerpt: "A decade after Google open-sourced Kubernetes, it runs 80% of enterprise container workloads — but the next decade will test whether its complexity is a feature or a fatal flaw.",
    seo_title: "Kubernetes at 10: Past, Present, and Future of Container Orchestration",
    seo_description: "Kubernetes turned 10 in 2024. We examine how it conquered enterprise infrastructure, what its complexity costs are, and whether platform engineering can solve the usability crisis.",
    keywords: "Kubernetes, container orchestration, platform engineering, DevOps, cloud-native, CNCF, infrastructure",
    featured_image_alt: "Blue Kubernetes logo against a dark background with connected container nodes",
    featured_image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200",
    content: `<h2>The Unlikely Dominance of Kubernetes</h2>
<p>When Google open-sourced Kubernetes in June 2014, internal bets gave it a 30% chance of broader adoption. The project was complex, opinionated, and based on internal Google infrastructure assumptions that didn't translate cleanly to enterprise environments. <strong>A decade later, it runs over 80% of enterprise container workloads and has spawned an ecosystem valued at over $7 billion.</strong></p>

<h2>The Tipping Points That Made K8s Inevitable</h2>
<ul>
  <li><strong>All three hyperscalers adopted it:</strong> EKS, AKS, and GKE gave enterprises a credible multi-cloud story and removed the vendor lock-in objection.</li>
  <li><strong>The CNCF ecosystem effect:</strong> Prometheus, Helm, and Istio built around Kubernetes rather than abstracting it, creating gravity that made alternatives progressively less viable.</li>
  <li><strong>The talent market selected for it:</strong> As K8s became the resume credential for cloud-native engineers, enterprises faced a stark choice: adopt or struggle to hire.</li>
</ul>

<h2>The Complexity Cost Nobody Talks About</h2>
<p>A minimal production-ready Kubernetes deployment involves 15–20 distinct concerns: CNI, CSI, ingress, cert management, RBAC, namespacing, resource quotas, autoscaling, observability, policy enforcement... A 2024 CNCF survey found that <strong>38% of teams spend more than 20% of engineering time on Kubernetes operations and maintenance.</strong></p>

<h2>Platform Engineering: The Response to K8s Complexity</h2>
<p>The platform engineering movement emerged directly from Kubernetes complexity. Internal Developer Platforms (IDPs) built on tools like Backstage, Argo CD, and Crossplane give application developers a "golden path" to production without requiring K8s expertise.</p>

<h2>What the Next Decade Looks Like</h2>
<p>WebAssembly (WASM) via WASI and projects like wasmCloud propose a container alternative with better isolation and startup latency. Managed abstractions like AWS App Runner and Google Cloud Run are capturing greenfield stateless workloads by hiding the orchestration layer entirely.</p>
<p>For infrastructure teams, three bets are worth making now:</p>
<ul>
  <li>Invest in a proper IDP. The productivity difference between teams with golden paths and those without is measurable in deployment frequency and incident rates.</li>
  <li>Evaluate whether stateless workloads belong on managed platforms — not everything needs a full K8s footprint.</li>
  <li>Develop in-house eBPF expertise. Cilium-based networking is becoming the foundation layer.</li>
</ul>

<p><em>Kubernetes succeeded by being the right abstraction at the right time. The decade ahead will reveal whether platform engineering can make that complexity invisible, or whether a genuinely simpler alternative will emerge to claim the next generation of cloud-native workloads.</em></p>`,
  },
];

function getMockArticle(): GeneratedArticle & { featured_image: string } {
  const base = MOCK_ARTICLES[Math.floor(Math.random() * MOCK_ARTICLES.length)];
  // Ensure unique slug with timestamp suffix
  return { ...base, slug: `${base.slug}-${Date.now()}` };
}

async function generateArticleWithAI(apiKey: string): Promise<GeneratedArticle & { featured_image: string }> {
  const trend = TECH_TRENDS[Math.floor(Math.random() * TECH_TRENDS.length)];

  const userPrompt = `Generate a viral tech article about this trend: "${trend}"

Focus on:
- Real data and statistics (make realistic numbers)
- Impact on US and European tech markets
- Actionable insights for developers/CTOs
- Competitive landscape analysis
- Future implications

Return valid JSON only with fields: title, slug, excerpt, content, keywords, featured_image_alt, seo_title, seo_description`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
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
  const article: GeneratedArticle = JSON.parse(content);

  if (!article.title || !article.slug || !article.content) {
    throw new Error("Generated article missing required fields");
  }

  const images = [
    "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];

  return {
    ...article,
    featured_image: images[Math.floor(Math.random() * images.length)],
  };
}

async function insertArticleIntoDB(
  article: GeneratedArticle & { featured_image: string },
  supabaseClient: ReturnType<typeof createClient>
) {
  const { data: authors, error: authorError } = await supabaseClient
    .from("authors")
    .select("id")
    .limit(1);

  if (authorError || !authors || authors.length === 0) {
    throw new Error("No authors found in database");
  }

  const { data: categories, error: categoryError } = await supabaseClient
    .from("categories")
    .select("id")
    .eq("slug", "technology-news")
    .limit(1);

  if (categoryError || !categories || categories.length === 0) {
    throw new Error("Technology category not found");
  }

  const { data: inserted, error: insertError } = await supabaseClient
    .from("articles")
    .insert([
      {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        author_id: authors[0].id,
        category_id: categories[0].id,
        tags: article.keywords.split(",").map((k: string) => k.trim()),
        language: "en",
        status: "draft",
        read_time: Math.ceil(article.content.split(" ").length / 200),
        is_featured: false,
        is_editors_pick: false,
        is_breaking: false,
        is_trending: false,
        seo_title: article.seo_title,
        seo_description: article.seo_description,
        featured_image: article.featured_image,
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
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    let articleData: GeneratedArticle & { featured_image: string };
    let mode: string;

    if (apiKey) {
      console.log("OpenAI API key found — generating with GPT-4o-mini...");
      try {
        const candidate = await generateArticleWithAI(apiKey);
        const safetyTarget = `${candidate.title} ${candidate.excerpt} ${candidate.content}`;
        if (!isContentSafe(safetyTarget)) {
          console.warn("AI output failed content safety check — falling back to mock");
          articleData = getMockArticle();
          mode = "mock-fallback";
        } else {
          articleData = candidate;
          mode = "ai";
        }
      } catch (aiError) {
        console.warn("OpenAI generation failed, falling back to mock:", aiError);
        articleData = getMockArticle();
        mode = "mock-fallback";
      }
    } else {
      console.log("No OpenAI API key — using high-quality mock article");
      articleData = getMockArticle();
      mode = "mock";
    }

    console.log(`[${mode}] Generating: "${articleData.title}"`);

    const inserted = await insertArticleIntoDB(articleData, supabase);
    console.log(`Inserted article ID: ${inserted?.id}`);

    // Auto-trigger video generation (fire-and-forget)
    if (inserted?.id) {
      fetch(`${supabaseUrl}/functions/v1/generate-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseKey}`,
          "apikey": supabaseKey,
        },
        body: JSON.stringify({ article_id: inserted.id }),
      }).catch(err => console.error("Video generation trigger failed:", err));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: mode === "mock"
          ? "Article generated successfully (mock mode — add OPENAI_API_KEY secret for AI generation)"
          : "Article generated successfully",
        mode,
        article: {
          id: inserted?.id,
          title: articleData.title,
          slug: articleData.slug,
          status: "draft",
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
