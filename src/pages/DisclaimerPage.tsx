import { AlertTriangle, ChevronRight, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const LAST_UPDATED = 'June 1, 2025';

export default function DisclaimerPage() {
  const { setCurrentPage } = useApp();

  useSEO({
    title: 'Disclaimer',
    description: 'TechPulse Media editorial independence statement, affiliate disclosure, and financial content disclaimer.',
    canonical: '/disclaimer',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'TechPulse Media Disclaimer',
      url: 'https://techpulse.media/disclaimer',
      dateModified: '2025-06-01',
    },
  });

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 py-14 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm text-gray-500 font-medium">Legal</span>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Disclaimer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">Disclaimer</h1>
          <p className="text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        {/* Affiliate Disclosure — FTC required */}
        <section id="affiliate-disclosure" className="scroll-mt-24">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ExternalLink size={14} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Affiliate Disclosure</h2>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl p-5 mb-5 text-sm text-orange-800 dark:text-orange-300">
            <strong>FTC Disclosure:</strong> TechPulse Media participates in affiliate marketing programmes and earns commissions from qualifying purchases.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed">
            <p>
              TechPulse Media participates in affiliate marketing programmes with various technology companies and retailers, including but not limited to Amazon Associates, ShareASale, CJ Affiliate, Impact Radius, and direct vendor programmes.
            </p>
            <p>
              When you click on certain links on our website and subsequently make a purchase, we may receive a commission at no additional cost to you. These commissions help fund our editorial operations and allow us to continue producing independent journalism.
            </p>
            <p>
              <strong className="text-gray-800 dark:text-gray-200">Our affiliate relationships do not influence our editorial recommendations.</strong> Our editorial team independently evaluates all products and services. A product's inclusion in our affiliate programme does not affect whether we recommend it, and products we review negatively may still carry affiliate links.
            </p>
            <p>
              Affiliate links on our site are typically identified by the destination URL domain (e.g., links pointing to product pages on retailer sites). Articles that contain a significant number of affiliate links may be labelled with a disclosure notice at the top or bottom of the content.
            </p>
          </div>
        </section>

        {/* Editorial Independence */}
        <section id="editorial-independence" className="scroll-mt-24">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={14} className="text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editorial Independence</h2>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed">
            <p>
              TechPulse Media maintains strict editorial independence from its commercial partners. Our newsroom operates under a separation policy:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Advertisers and affiliate partners have no input into or review of editorial content before publication</li>
              <li>Editorial rankings and recommendations are determined solely by our editorial team based on merit</li>
              <li>We do not accept payment for editorial coverage or favourable reviews</li>
              <li>Sponsored content is always clearly labelled as "Sponsored", "Partner Content", or "Advertisement"</li>
              <li>Editorial staff and commercial staff operate independently with no overlap in decision-making</li>
            </ul>
            <p>
              If you believe an article has failed to meet our editorial standards, please contact our editor at editorial@techpulse.media.
            </p>
          </div>
        </section>

        {/* Financial Disclaimer */}
        <section id="financial-disclaimer" className="scroll-mt-24">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={14} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Financial Content Disclaimer</h2>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-5 mb-5 text-sm text-amber-800 dark:text-amber-300">
            <strong>Not financial advice:</strong> Nothing on this website constitutes financial, investment, or trading advice.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed">
            <p>
              The financial content on TechPulse Media — including articles about stocks, cryptocurrencies, SaaS valuations, venture capital, and market trends — is provided for <strong className="text-gray-800 dark:text-gray-200">informational and educational purposes only</strong>.
            </p>
            <p>
              Nothing on this website should be construed as financial advice, investment advice, trading advice, or any other type of advice. We are technology journalists, not licensed financial advisers, investment managers, or brokers.
            </p>
            <p>
              You should always conduct your own independent research and consult a qualified financial professional before making any investment decisions. Past performance mentioned in any article is not indicative of future results.
            </p>
          </div>
        </section>

        {/* Accuracy Disclaimer */}
        <section id="accuracy-disclaimer" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Accuracy & Corrections</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed">
            <p>
              We strive to ensure the accuracy of all information published on TechPulse Media. However, technology information changes rapidly, and we cannot guarantee that all content remains current or accurate at all times.
            </p>
            <p>
              We publish corrections when errors are identified. If you believe an article contains an error, please contact us at corrections@techpulse.media with:
            </p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>The URL of the article in question</li>
              <li>The specific claim you believe is inaccurate</li>
              <li>The correct information with a source reference</li>
            </ul>
            <p>
              We aim to review and respond to correction requests within 2 business days.
            </p>
          </div>
        </section>

        {/* AI-Generated Content */}
        <section id="ai-content" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AI-Assisted Content</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 leading-relaxed">
            <p>
              TechPulse Media uses AI-assisted tools in parts of our content workflow, including initial research, draft generation, and headline testing. All published content is reviewed and edited by our human editorial team before publication.
            </p>
            <p>
              Articles that are primarily AI-generated are labelled with an "AI-assisted" disclosure. Our editorial standards apply to all content regardless of how it was drafted.
            </p>
          </div>
        </section>

        {/* Contact */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Questions about our disclosures?</p>
          <p className="text-sm text-gray-500 mb-4">Our editorial team is happy to clarify any aspect of our commercial relationships or editorial policies.</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentPage('contact')}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => setCurrentPage('privacy')}
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setCurrentPage('terms')}
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
