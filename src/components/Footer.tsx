import { Zap, Mail, Globe, Shield, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../lib/i18n';
import { NewsletterSubscription } from './NewsletterSubscription';
import { SocialIcons } from './SocialIcons';

// Re-export SOCIAL_MEDIA for backwards compatibility with config guide
export { SOCIAL_MEDIA } from './SocialIcons';

const footerCategories = [
  { slug: 'artificial-intelligence', label: 'Artificial Intelligence' },
  { slug: 'chatgpt-ai-tools', label: 'ChatGPT & AI Tools' },
  { slug: 'saas-reviews', label: 'SaaS Reviews' },
  { slug: 'web-hosting-reviews', label: 'Web Hosting Reviews' },
  { slug: 'vpn-reviews', label: 'VPN Reviews' },
  { slug: 'cybersecurity', label: 'Cybersecurity' },
  { slug: 'digital-marketing', label: 'Digital Marketing' },
  { slug: 'cloud-computing', label: 'Cloud Computing' },
  { slug: 'investing', label: 'Investing' },
  { slug: 'personal-finance', label: 'Personal Finance' },
];

const targetCountries = [
  'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Switzerland', 'Netherlands',
  'Sweden', 'Singapore', 'Norway', 'Ireland',
];

export default function Footer() {
  const { language, setCurrentPage, setCurrentCategorySlug } = useApp();

  const handleCategoryClick = (slug: string) => {
    setCurrentCategorySlug(slug);
    setCurrentPage('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-400 mt-16">
      {/* Main footer content */}
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-white" fill="currentColor" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">
                  Tech<span className="text-brand-400">Pulse</span>
                </div>
                <div className="text-[9px] font-semibold text-gray-600 uppercase tracking-widest">Media</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-gray-400 max-w-sm">
              {t(language, 'footer.description')}
            </p>
            <SocialIcons variant="footer" className="mb-6" />
            {/* Trust signals */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-gray-800/60 rounded-lg px-3 py-1.5 text-xs">
                <Shield size={12} className="text-green-400" />
                <span className="text-gray-300">SSL Secured</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-800/60 rounded-lg px-3 py-1.5 text-xs">
                <Globe size={12} className="text-brand-400" />
                <span className="text-gray-300">15 Countries</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-800/60 rounded-lg px-3 py-1.5 text-xs">
                <Mail size={12} className="text-orange-400" />
                <span className="text-gray-300">250K+ Subscribers</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              {t(language, 'footer.categories')}
            </h3>
            <ul className="space-y-2.5">
              {footerCategories.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              More Topics
            </h3>
            <ul className="space-y-2.5">
              {footerCategories.slice(6).map(cat => (
                <li key={cat.slug}>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors text-left"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
              <li className="pt-3 border-t border-gray-800">
                <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Company</h4>
              </li>
              <li>
                <button className="text-sm text-gray-400 hover:text-brand-400 transition-colors text-left">
                  {t(language, 'footer.about')}
                </button>
              </li>
              <li>
                <button className="text-sm text-gray-400 hover:text-brand-400 transition-colors text-left">
                  {t(language, 'footer.contact')}
                </button>
              </li>
              <li>
                <button className="text-sm text-gray-400 hover:text-brand-400 transition-colors text-left">
                  {t(language, 'footer.advertise')}
                </button>
              </li>
            </ul>
          </div>

          {/* Target countries & Newsletter mini */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Global Coverage
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {targetCountries.map(country => (
                <span key={country} className="text-xs bg-gray-800/60 text-gray-400 px-2 py-1 rounded-md">
                  {country}
                </span>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-4">
              <NewsletterSubscription variant="footer" />
            </div>
          </div>
        </div>

        {/* Affiliate disclosure & Legal */}
        <div className="border-t border-gray-800/80 pt-8">
          <div className="bg-gray-900/40 rounded-lg p-4 mb-6 text-xs text-gray-500 leading-relaxed">
            <strong className="text-gray-400">Affiliate Disclosure:</strong> TechPulse Media participates in affiliate marketing programs. When you click on links to products or services on this site and make a purchase, we may earn a commission at no additional cost to you. Our editorial recommendations are independent and not influenced by affiliate relationships.
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              {t(language, 'footer.copyright')}
            </p>
            <div className="flex items-center gap-6 text-xs">
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                {t(language, 'footer.privacy')}
              </button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                {t(language, 'footer.terms')}
              </button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors">
                Cookie Policy
              </button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                <ExternalLink size={11} /> Sitemap
              </button>
            </div>
          </div>

          {/* Hreflang SEO note for structured data */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-700">
            <span>EN: United States • United Kingdom • Canada • Australia • Singapore • Ireland • New Zealand</span>
            <span>FR: France • Belgium • Switzerland</span>
            <span>DE: Germany • Switzerland • Austria</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
