import { FileText, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const LAST_UPDATED = 'June 1, 2025';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing or using techpulse.media (the "Site") and any related services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.

These Terms constitute a legally binding agreement between you and TechPulse Media, Inc. ("TechPulse Media", "we", "us", or "our"). We reserve the right to update these Terms at any time, with changes taking effect upon posting to the Site.`,
  },
  {
    id: 'use-of-services',
    title: '2. Use of Our Services',
    content: `You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:

- Use our services in any manner that violates applicable laws or regulations
- Scrape, crawl, or systematically collect our content without prior written consent
- Reverse engineer, decompile, or attempt to extract source code from our software
- Upload viruses or malicious code
- Impersonate any person or entity or misrepresent your affiliation with a person or entity
- Interfere with or disrupt the security, integrity, or performance of our services
- Use automated means to create accounts or access our services without permission
- Circumvent any access controls or security features`,
  },
  {
    id: 'intellectual-property',
    title: '3. Intellectual Property',
    content: `All content on the Site — including but not limited to articles, analyses, graphics, logos, icons, images, audio clips, and software — is the property of TechPulse Media, Inc. or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.

**What you may do:**
- Read, share links to, and cite our content for personal, non-commercial use with proper attribution
- Share individual articles via social media using the share buttons we provide

**What you may not do:**
- Reproduce, republish, or redistribute our articles in full without express written permission
- Use our brand name, logo, or trademarks without prior written consent
- Commercially exploit our content without a licence agreement

To request a content licence or syndication agreement, contact editorial@techpulse.media.`,
  },
  {
    id: 'user-content',
    title: '4. User-Submitted Content',
    content: `If you submit comments, tips, or other content to our Site, you grant TechPulse Media a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, and display such content.

You represent that you own or control all rights to the content you submit, that it is accurate, and that it does not violate these Terms or any applicable law.

We reserve the right to remove any user-submitted content at our sole discretion, including content that is defamatory, offensive, infringes intellectual property rights, or violates these Terms.`,
  },
  {
    id: 'newsletter',
    title: '5. Newsletter & Email Communications',
    content: `By subscribing to our newsletter, you consent to receiving periodic email communications from TechPulse Media. Each email we send includes an unsubscribe link. You may also unsubscribe at any time by emailing support@techpulse.media.

We do not sell or share your email address with third parties for marketing purposes without your consent. See our Privacy Policy for full details on how we handle subscriber data.`,
  },
  {
    id: 'affiliate',
    title: '6. Affiliate & Sponsored Content',
    content: `TechPulse Media participates in affiliate marketing programmes. Some links on our Site are affiliate links, meaning we may earn a commission if you click through and make a purchase, at no additional cost to you.

Sponsored content and advertisements are clearly labelled as such. Our editorial team maintains full independence from commercial relationships; sponsored content does not influence our editorial coverage.

For a full disclosure, please see our Affiliate Disclaimer.`,
  },
  {
    id: 'disclaimers',
    title: '7. Disclaimers & Limitation of Liability',
    content: `Our content is provided for informational purposes only. Nothing on this Site constitutes financial, investment, legal, or professional advice. You should consult a qualified professional before making any financial or business decisions.

TO THE FULLEST EXTENT PERMITTED BY LAW, TECHPULSE MEDIA DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

IN NO EVENT SHALL TECHPULSE MEDIA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OUR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
  },
  {
    id: 'third-party',
    title: '8. Third-Party Websites',
    content: `Our Site may contain links to third-party websites. These links are provided for your convenience. TechPulse Media has no control over the content of those sites and accepts no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    id: 'privacy',
    title: '9. Privacy',
    content: `Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to our data practices as described in the Privacy Policy.`,
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: `We reserve the right to suspend or terminate your access to our services at any time, without notice, for any reason, including if we believe you have violated these Terms.

Upon termination, the provisions of these Terms that by their nature should survive (including intellectual property rights, disclaimers, indemnification, and limitations of liability) shall survive.`,
  },
  {
    id: 'governing-law',
    title: '11. Governing Law',
    content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to conflict of law principles. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in San Francisco County, California.

For EU/EEA residents: Nothing in these Terms affects your rights under applicable European consumer protection law.`,
  },
  {
    id: 'contact',
    title: '12. Contact',
    content: `For questions about these Terms, contact us at:

legal@techpulse.media

TechPulse Media, Inc.
535 Mission Street, 14th Floor
San Francisco, CA 94105`,
  },
];

export default function TermsPage() {
  const { setCurrentPage } = useApp();

  useSEO({
    title: 'Terms of Service',
    description: 'TechPulse Media Terms of Service. Read the terms and conditions governing use of our website, content, and services.',
    canonical: '/terms',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'TechPulse Media Terms of Service',
      url: 'https://techpulse.media/terms',
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
              <FileText size={18} className="text-brand-600 dark:text-brand-400" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Legal</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Terms of Service</h1>
          <p className="text-gray-500">Last updated: {LAST_UPDATED}</p>
          <div className="mt-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl px-5 py-4 text-sm text-amber-800 dark:text-amber-300 max-w-2xl">
            <strong>Summary:</strong> Use our content responsibly and lawfully. Don't scrape or reproduce articles without permission. Affiliate and sponsored content is always disclosed. Our content is for informational purposes only.
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
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-base">
              Please read these Terms of Service carefully before using techpulse.media. These terms govern your access to and use of our website, newsletters, and related services.
            </p>

            {sections.map(({ id, title, content }) => (
              <section key={id} id={id} className="mb-10 scroll-mt-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">{title}</h2>
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm space-y-3">
                  {content.split('\n\n').map((para, i) => {
                    if (para.startsWith('- ')) {
                      const items = para.split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2));
                      return (
                        <ul key={i} className="list-disc list-inside space-y-1.5 ml-2">
                          {items.map((item, j) => <li key={j}>{item}</li>)}
                        </ul>
                      );
                    }
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

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Questions about these Terms?</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Contact Legal Team
                </button>
                <button
                  onClick={() => setCurrentPage('privacy')}
                  className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
