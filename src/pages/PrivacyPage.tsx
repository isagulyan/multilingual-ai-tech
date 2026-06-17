import { Shield, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const LAST_UPDATED = 'June 1, 2025';

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, information we collect automatically when you use our services, and information from third parties.

**Information you provide directly:**
- Account registration details (name, email address, password)
- Newsletter subscription information
- Contact form submissions
- Comments and feedback you submit

**Information collected automatically:**
- Log data (IP address, browser type, pages visited, time spent, referring URLs)
- Device information (hardware model, operating system, unique device identifiers)
- Cookie data and similar tracking technologies
- Aggregated analytics data via privacy-focused analytics tools

**Information from third parties:**
- Social media platforms if you connect your accounts
- Advertising partners (aggregated and pseudonymised)
- Payment processors (we do not store payment card data)`,
  },
  {
    id: 'how-we-use-information',
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

- Provide, maintain, and improve our services
- Send newsletters and editorial communications you have opted into
- Personalise your reading experience and content recommendations
- Analyse site performance and user behaviour to improve our journalism
- Comply with legal obligations and enforce our terms of service
- Detect, investigate, and prevent fraudulent or harmful activity
- Serve relevant advertising (we do not sell your personal data to third parties)`,
  },
  {
    id: 'cookies',
    title: '3. Cookies & Tracking Technologies',
    content: `We use cookies and similar tracking technologies to provide and improve our services.

**Types of cookies we use:**

*Essential cookies* — Required for the website to function. These cannot be disabled. They include session management, security tokens, and preference storage.

*Analytics cookies* — Help us understand how visitors interact with our content. We use privacy-focused analytics that anonymise IP addresses and do not build cross-site profiles.

*Advertising cookies* — Used by our advertising partners to serve relevant advertisements and measure campaign performance. These are only set with your consent.

You can manage cookie preferences at any time via the cookie banner or your browser settings. Note that disabling certain cookies may affect site functionality.`,
  },
  {
    id: 'data-sharing',
    title: '4. How We Share Your Information',
    content: `We do not sell your personal information. We share information in the following limited circumstances:

**Service providers:** We share data with trusted vendors who assist us in operating our website and services (e.g., email delivery, analytics, cloud hosting). These vendors are contractually obligated to use data only as directed by us.

**Advertising partners:** We share pseudonymised and aggregated audience data with advertising partners. We do not share personally identifiable information with advertisers without your explicit consent.

**Legal requirements:** We may disclose information if required by law, regulation, legal process, or governmental request.

**Business transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.`,
  },
  {
    id: 'your-rights',
    title: '5. Your Rights (GDPR & CCPA)',
    content: `Depending on your location, you may have the following rights regarding your personal data:

**For EU/EEA residents (GDPR):**
- Right to access your personal data
- Right to rectification of inaccurate data
- Right to erasure ("right to be forgotten")
- Right to restriction of processing
- Right to data portability
- Right to object to processing
- Right to withdraw consent at any time

**For California residents (CCPA):**
- Right to know what personal information is collected, used, shared, or sold
- Right to delete personal information
- Right to opt out of the sale of personal information
- Right to non-discrimination for exercising your privacy rights

To exercise any of these rights, contact us at privacy@techpulse.media. We will respond within 30 days.`,
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: `We retain personal data only as long as necessary for the purposes described in this policy or as required by law.

- **Account data:** Retained while your account is active. Deleted within 30 days of account closure upon request.
- **Newsletter data:** Retained while you remain subscribed. Deleted within 7 days of unsubscription.
- **Analytics data:** Retained in aggregated, anonymised form for up to 24 months.
- **Log data:** Retained for up to 90 days for security and debugging purposes.`,
  },
  {
    id: 'data-security',
    title: '7. Data Security',
    content: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include:

- TLS/SSL encryption for all data in transit
- Encryption of sensitive data at rest
- Access controls and authentication requirements for internal systems
- Regular security audits and penetration testing
- Incident response procedures compliant with GDPR breach notification requirements

No method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to using industry-standard practices.`,
  },
  {
    id: 'third-party-links',
    title: '8. Third-Party Links & Affiliate Content',
    content: `Our website contains links to third-party websites and affiliate product links. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any website you visit.

Affiliate links are clearly disclosed throughout our content. When you click an affiliate link and make a purchase, we may earn a commission. This does not affect the price you pay or our editorial independence.`,
  },
  {
    id: 'children',
    title: '9. Children\'s Privacy',
    content: `Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you believe we have collected information from a child under 16, please contact us at privacy@techpulse.media and we will delete the information promptly.`,
  },
  {
    id: 'changes',
    title: '10. Changes to This Policy',
    content: `We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:

- Update the "Last Updated" date at the top of this page
- Notify newsletter subscribers via email for significant changes
- Display a prominent notice on our website

Your continued use of our services after the effective date of any changes constitutes your acceptance of the updated policy.`,
  },
  {
    id: 'contact',
    title: '11. Contact & Data Controller',
    content: `TechPulse Media is the data controller for personal data collected through our website.

**Data Controller:**
TechPulse Media, Inc.
535 Mission Street, 14th Floor
San Francisco, CA 94105

**Data Protection Officer (EU):**
dpo@techpulse.media

**Privacy inquiries:**
privacy@techpulse.media

For EU/EEA residents, you also have the right to lodge a complaint with your local supervisory authority.`,
  },
];

export default function PrivacyPage() {
  const { setCurrentPage } = useApp();

  useSEO({
    title: 'Privacy Policy',
    description: 'TechPulse Media Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and CCPA.',
    canonical: '/privacy',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'TechPulse Media Privacy Policy',
      url: 'https://techpulse.media/privacy',
      dateModified: '2025-06-01',
    },
  });

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Shield size={18} className="text-brand-600 dark:text-brand-400" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Legal</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: {LAST_UPDATED}</p>
          <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl px-5 py-4 text-sm text-blue-800 dark:text-blue-300 max-w-2xl">
            <strong>Summary:</strong> We don't sell your data. We use cookies to improve your experience. You have rights under GDPR and CCPA. Contact privacy@techpulse.media with any questions.
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sticky ToC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">On this page</p>
              <nav className="space-y-1">
                {sections.map(({ id, title }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="block text-xs text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 py-1 transition-colors leading-relaxed"
                  >
                    {title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 max-w-3xl">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-base">
                TechPulse Media, Inc. ("TechPulse Media", "we", "us", or "our") operates the website at techpulse.media. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our services.
              </p>

              {sections.map(({ id, title, content }) => (
                <section key={id} id={id} className="mb-10 scroll-mt-24">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">{title}</h2>
                  <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm whitespace-pre-line space-y-3">
                    {content.split('\n\n').map((para, i) => {
                      if (para.startsWith('**') && para.endsWith('**')) {
                        const text = para.slice(2, -2);
                        return <p key={i} className="font-semibold text-gray-800 dark:text-gray-200 mt-4">{text}</p>;
                      }
                      if (para.startsWith('- ')) {
                        const items = para.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
                        return (
                          <ul key={i} className="list-disc list-inside space-y-1.5 ml-2">
                            {items.map((item, j) => <li key={j}>{item}</li>)}
                          </ul>
                        );
                      }
                      // Handle inline bold (**text**)
                      const parts = para.split(/\*\*([^*]+)\*\*/g);
                      return (
                        <p key={i}>
                          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-gray-800 dark:text-gray-200">{part}</strong> : part)}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Have questions about this policy?</p>
              <button
                onClick={() => setCurrentPage('contact')}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Contact our Privacy Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
