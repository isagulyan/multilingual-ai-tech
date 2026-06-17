import { useState, useEffect } from 'react';
import { Cookie, X, Shield, BarChart2, Target } from 'lucide-react';

type ConsentState = 'accepted' | 'rejected' | null;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookieConsent');
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  const save = (state: ConsentState) => {
    if (state) localStorage.setItem('cookieConsent', state);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="bg-gray-950 border-t border-gray-800 shadow-2xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon + text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie size={16} className="text-brand-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold mb-0.5">We use cookies</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  We use cookies to personalise content, analyse site performance, and serve relevant advertising.
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <button
                    onClick={() => setShowDetails(v => !v)}
                    className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors"
                  >
                    {showDetails ? 'Hide details' : 'Learn more'}
                  </button>
                </p>

                {showDetails && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { icon: Shield, label: 'Essential', desc: 'Required for the site to function. Cannot be disabled.', always: true },
                      { icon: BarChart2, label: 'Analytics', desc: 'Help us understand how visitors interact with the site.' },
                      { icon: Target, label: 'Marketing', desc: 'Used to serve relevant ads and measure campaign effectiveness.' },
                    ].map(({ icon: Icon, label, desc, always }) => (
                      <div key={label} className="flex items-start gap-2 bg-gray-900/60 rounded-lg p-2.5">
                        <Icon size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white text-xs font-medium">{label} {always && <span className="text-green-400 text-[10px]">(Always on)</span>}</p>
                          <p className="text-gray-500 text-[10px] leading-relaxed mt-0.5">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => save('rejected')}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                onClick={() => save('accepted')}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => save(null)}
                className="p-2 text-gray-600 hover:text-gray-400 transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
