import { Users, Target, Globe, Zap, Award, TrendingUp, Mail, Linkedin, Twitter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const team = [
  {
    name: 'Sarah Chen',
    role: 'Editor-in-Chief',
    bio: 'Former tech editor at Wired and The Verge. 12 years covering enterprise software, AI, and the future of work.',
    avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Marcus Weber',
    role: 'Senior Technology Analyst',
    bio: 'Ex-Gartner analyst specializing in cloud infrastructure and cybersecurity. Based in Berlin.',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Priya Sharma',
    role: 'AI & ML Correspondent',
    bio: 'PhD in Machine Learning from MIT. Covers foundation models, AI safety, and enterprise AI adoption.',
    avatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'James O\'Brien',
    role: 'Finance & SaaS Editor',
    bio: 'CFA charterholder turned journalist. Covers SaaS valuations, fintech, and enterprise spending trends.',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Léa Dubois',
    role: 'European Correspondent',
    bio: 'Paris-based journalist covering EU tech regulation, GDPR developments, and the European startup ecosystem.',
    avatar: 'https://images.pexels.com/photos/3756678/pexels-photo-3756678.jpeg?auto=compress&cs=tinysrgb&w=300',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Alex Kim',
    role: 'Cybersecurity Reporter',
    bio: 'Former penetration tester turned writer. Covers threat intelligence, zero-trust architecture, and breach investigations.',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
    linkedin: '#',
    twitter: '#',
  },
];

const stats = [
  { label: 'Monthly Readers', value: '4.2M+' },
  { label: 'Newsletter Subscribers', value: '250K+' },
  { label: 'Countries Reached', value: '15+' },
  { label: 'Articles Published', value: '12K+' },
];

const values = [
  {
    icon: Target,
    title: 'Editorial Independence',
    desc: 'Our journalism is not for sale. Advertising and affiliate relationships never influence our editorial coverage. Every recommendation is independently researched.',
  },
  {
    icon: Award,
    title: 'Accuracy First',
    desc: 'We fact-check every claim, cite primary sources, and issue corrections promptly when we get things wrong. Our credibility is our most valuable asset.',
  },
  {
    icon: Globe,
    title: 'Global Perspective',
    desc: 'Technology is reshaping every continent. Our editorial team spans North America, Europe, and Asia-Pacific to ensure our coverage reflects global realities.',
  },
  {
    icon: TrendingUp,
    title: 'Actionable Insights',
    desc: 'We write for practitioners — CTOs, developers, analysts, and founders who need intelligence they can act on, not just information to consume.',
  },
];

export default function AboutPage() {
  const { setCurrentPage } = useApp();

  useSEO({
    title: 'About Us',
    description: 'TechPulse Media is the world\'s leading technology and business media platform, delivering expert insights to 4.2 million monthly readers across 15 countries.',
    canonical: '/about',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About TechPulse Media',
      url: 'https://techpulse.media/about',
      description: 'Learn about TechPulse Media\'s mission, editorial team, and values.',
    },
  });

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 dark:bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap size={13} className="text-brand-400" fill="currentColor" />
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Powering the decisions of{' '}
              <span className="text-brand-400">4.2 million</span>{' '}
              technology leaders
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
              TechPulse Media was founded in 2019 with a single mission: deliver the intelligence that technology and business leaders need to make better decisions, faster. We cover AI, software, cybersecurity, cloud infrastructure, and the financial forces reshaping the industry.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Journalism built for practitioners, not spectators
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Most technology media is written for curious readers. We write for the people who have to make the decisions — the engineers evaluating architectures, the CTOs managing budgets, the analysts building models, and the founders choosing their stack.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              That means our coverage goes deeper. We don't stop at the press release. We interview the engineers, examine the benchmarks, and surface the nuances that matter when real money and real systems are at stake.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We are editorially independent. Our newsroom does not take direction from vendors, advertisers, or investors. The affiliate links and sponsored placements that fund our operations are clearly disclosed and never influence our editorial judgement.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="TechPulse Media editorial team"
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -left-4 bg-brand-600 text-white rounded-xl px-4 py-3 text-sm font-semibold shadow-lg">
              Founded 2019 · San Francisco & Berlin
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What we stand for</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Four principles that guide every story we publish.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Meet the team</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Our editorial team combines deep technical expertise with rigorous journalism standards.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map(({ name, role, bio, avatar, linkedin, twitter }) => (
            <div key={name} className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={avatar}
                  alt={name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{role}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{bio}</p>
              <div className="flex items-center gap-2">
                <a href={linkedin} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <Linkedin size={14} />
                </a>
                <a href={twitter} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <Twitter size={14} />
                </a>
                <a href="mailto:editorial@techpulse.media" className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                  <Mail size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-[1400px] mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Advertising & partnerships</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                We work with leading technology companies to reach our audience of senior practitioners. Advertising opportunities include display, sponsored content, newsletter placements, and event partnerships.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                All sponsored and affiliate content is clearly labelled. Our editorial team maintains full independence from commercial relationships at all times.
              </p>
              <button
                onClick={() => setCurrentPage('contact')}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Users size={16} />
                Get in touch
              </button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">Our audience</h3>
              <div className="space-y-3">
                {[
                  { label: 'C-Suite & VP-level executives', pct: 34 },
                  { label: 'Software engineers & architects', pct: 28 },
                  { label: 'Product managers & analysts', pct: 22 },
                  { label: 'Investors & founders', pct: 16 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Questions or feedback?</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">We'd love to hear from you — whether it's a story tip, a correction, or a partnership inquiry.</p>
        <button
          onClick={() => setCurrentPage('contact')}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-500/20"
        >
          <Mail size={16} />
          Contact Us
        </button>
      </section>
    </div>
  );
}
