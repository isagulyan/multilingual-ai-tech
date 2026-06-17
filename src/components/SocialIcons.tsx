import { Youtube } from 'lucide-react';

// ─── Social Media Configuration ───────────────────────────────────────────────
// Update these URLs with your actual social media profiles.
export const SOCIAL_MEDIA = {
  FACEBOOK_URL:  'https://facebook.com/your-page-url',
 INSTAGRAM_URL: 'https://www.instagram.com/isagulyan87',
  TIKTOK_URL:    'https://tiktok.com/@your-username',
  YOUTUBE_URL:   'https://youtube.com/your-channel-url',
};

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────

export const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.19a8.16 8.16 0 0 0 4.76 1.52V7.27a4.85 4.85 0 0 1-.99-.58z" />
  </svg>
);

// ─── Platform definitions ─────────────────────────────────────────────────────

interface Platform {
  key: keyof typeof SOCIAL_MEDIA;
  label: string;
  ariaLabel: string;
  Icon: ({ size }: { size?: number }) => JSX.Element;
  hoverColor: string;
}

const platforms: Platform[] = [
  {
    key: 'FACEBOOK_URL',
    label: 'Facebook',
    ariaLabel: 'Follow TechPulse Media on Facebook',
    Icon: FacebookIcon,
    hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white',
  },
  {
    key: 'INSTAGRAM_URL',
    label: 'Instagram',
    ariaLabel: 'Follow TechPulse Media on Instagram',
    Icon: InstagramIcon,
    hoverColor: 'hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:border-transparent hover:text-white',
  },
  {
    key: 'TIKTOK_URL',
    label: 'TikTok',
    ariaLabel: 'Follow TechPulse Media on TikTok',
    Icon: TikTokIcon,
    hoverColor: 'hover:bg-black hover:border-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:hover:border-white',
  },
  {
    key: 'YOUTUBE_URL',
    label: 'YouTube',
    ariaLabel: 'Subscribe to TechPulse Media on YouTube',
    Icon: ({ size }) => <Youtube size={size} />,
    hoverColor: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white',
  },
];

// ─── Reusable component ───────────────────────────────────────────────────────

interface SocialIconsProps {
  /** 'header' = compact transparent pills; 'footer' = dark square tiles */
  variant?: 'header' | 'footer';
  className?: string;
}

export function SocialIcons({ variant = 'footer', className = '' }: SocialIconsProps) {
  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {platforms.map(({ key, ariaLabel, Icon, hoverColor }) => (
          <a
            key={key}
            href={SOCIAL_MEDIA[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className={`
              w-7 h-7 rounded-md flex items-center justify-center
              text-gray-500 dark:text-gray-400
              border border-transparent
              transition-all duration-200
              hover:scale-110 active:scale-95
              ${hoverColor}
            `}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    );
  }

  // Footer variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {platforms.map(({ key, ariaLabel, Icon, hoverColor }) => (
        <a
          key={key}
          href={SOCIAL_MEDIA[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            bg-gray-800 text-gray-400
            border border-gray-700/50
            transition-all duration-200
            hover:scale-110 active:scale-95
            hover:shadow-lg hover:shadow-black/40
            ${hoverColor}
          `}
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
