import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterProps {
  variant?: 'footer' | 'sidebar' | 'full';
  onSuccess?: () => void;
}

export function NewsletterSubscription({ variant = 'footer', onSuccess }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe-newsletter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Welcome! Check your email for updates.');
      setEmail('');
      onSuccess?.();

      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An error occurred');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'footer') {
    return (
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get the latest tech insights delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-2">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
            />
            <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {status === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-lg">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950/20 dark:to-brand-900/20 rounded-xl p-6 border border-brand-200 dark:border-brand-900/40">
        <div className="flex items-center gap-2 mb-3">
          <Mail size={18} className="text-brand-600 dark:text-brand-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            Subscribe
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get weekly tech insights and industry analysis.
        </p>

        <form onSubmit={handleSubscribe} className="space-y-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-brand-200 dark:border-brand-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded-lg flex items-center gap-2">
            <CheckCircle size={14} className="text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-600 dark:text-green-400">Subscribed!</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="text-red-600 dark:text-red-400" />
            <p className="text-xs text-red-600 dark:text-red-400">{message}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
