import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, MessageSquare, Briefcase, FileText, Zap } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const TOPICS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'press', label: 'Press & Media' },
  { value: 'advertise', label: 'Advertising & Sponsorship' },
  { value: 'tip', label: 'Story Tip or Lead' },
  { value: 'correction', label: 'Correction Request' },
  { value: 'tech', label: 'Technical Issue' },
  { value: 'partnership', label: 'Partnership Proposal' },
  { value: 'other', label: 'Other' },
];

const offices = [
  {
    city: 'San Francisco',
    role: 'HQ & Editorial',
    address: '535 Mission Street, 14th Floor\nSan Francisco, CA 94105',
    email: 'editorial@techpulse.media',
  },
  {
    city: 'Berlin',
    role: 'European Bureau',
    address: 'Unter den Linden 10\nBerlin, Germany 10117',
    email: 'europe@techpulse.media',
  },
];

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', topic: 'general', subject: '', message: '' });

  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with the TechPulse Media editorial team. We welcome story tips, corrections, advertising inquiries, and partnership proposals.',
    canonical: '/contact',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact TechPulse Media',
      url: 'https://techpulse.media/contact',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate network delay — wire to a real endpoint or Supabase edge function when ready
    await new Promise(r => setTimeout(r, 1200));
    setFormState('success');
  };

  const field = (id: keyof typeof form) => ({
    id,
    value: form[id],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [id]: e.target.value })),
  });

  const inputCls = 'w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all';

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gray-950 dark:bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-transparent to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
              <MessageSquare size={13} className="text-brand-400" />
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Get in Touch</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">How can we help?</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Whether you have a story tip, a correction to report, an advertising inquiry, or a technical issue — our team is here.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick links */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Quick Contacts</h2>
              <div className="space-y-3">
                {[
                  { icon: FileText, label: 'Editorial', email: 'editorial@techpulse.media' },
                  { icon: Briefcase, label: 'Advertising', email: 'advertising@techpulse.media' },
                  { icon: Zap, label: 'Press & PR', email: 'press@techpulse.media' },
                  { icon: Mail, label: 'Support', email: 'support@techpulse.media' },
                ].map(({ icon: Icon, label, email }) => (
                  <a
                    key={label}
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 group p-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{label}</p>
                      <p className="text-xs text-gray-500 truncate group-hover:text-brand-500 transition-colors">{email}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Offices */}
            {offices.map(({ city, role, address, email }) => (
              <div key={city} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-brand-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{city}</h3>
                  <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">{role}</span>
                </div>
                <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed mb-2">{address}</p>
                <a href={`mailto:${email}`} className="text-xs text-brand-500 hover:text-brand-400 transition-colors">{email}</a>
              </div>
            ))}

            {/* Response time */}
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-100 dark:border-green-900/30">
              <Clock size={14} className="text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-green-800 dark:text-green-400">Typical response time</p>
                <p className="text-xs text-green-700 dark:text-green-500 mt-0.5">Editorial & press: within 4 hours on business days. General inquiries: 1–2 business days.</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {formState === 'success' ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message sent!</h2>
                <p className="text-gray-500 max-w-md">
                  Thanks for reaching out, <strong>{form.name}</strong>. We'll get back to you at <strong>{form.email}</strong> as soon as possible.
                </p>
                <button
                  onClick={() => { setFormState('idle'); setForm({ name: '', email: '', topic: 'general', subject: '', message: '' }); }}
                  className="mt-6 text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Send us a message</h2>
                  <p className="text-sm text-gray-500">All fields marked with * are required.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full name *</label>
                    <input {...field('name')} type="text" placeholder="Jane Smith" required className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address *</label>
                    <input {...field('email')} type="email" placeholder="jane@company.com" required className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="topic" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Topic *</label>
                  <select {...field('topic')} required className={inputCls}>
                    {TOPICS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
                  <input {...field('subject')} type="text" placeholder="Brief subject line" required className={inputCls} />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                  <textarea
                    {...field('message')}
                    rows={6}
                    placeholder="Describe your inquiry in detail..."
                    required
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {formState === 'error' && (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    <AlertCircle size={14} />
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-500/20"
                >
                  {formState === 'sending' ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                  ) : (
                    <><Send size={15} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
