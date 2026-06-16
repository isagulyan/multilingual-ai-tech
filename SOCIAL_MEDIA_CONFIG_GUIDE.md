# Social Media Icons Configuration Guide

## Overview
The Footer component now features a modern social media icon row with Facebook, Instagram, TikTok, and YouTube. Icons only display when URLs are configured.

## Configuration Block
Located at the top of `/src/components/Footer.tsx`:

```typescript
export const SOCIAL_MEDIA = {
  FACEBOOK_URL: '',
  INSTAGRAM_URL: '',
  TIKTOK_URL: '',
  YOUTUBE_URL: '',
};
```

## How to Add Your Social Media Links

### Step 1: Open Footer.tsx
```bash
cd src/components
# Edit Footer.tsx
```

### Step 2: Update SOCIAL_MEDIA Configuration
Replace the empty strings with your actual social media URLs:

**Example:**
```typescript
export const SOCIAL_MEDIA = {
  FACEBOOK_URL: 'https://facebook.com/techpulsemedia',
  INSTAGRAM_URL: 'https://instagram.com/techpulsemedia',
  TIKTOK_URL: 'https://tiktok.com/@techpulsemedia',
  YOUTUBE_URL: 'https://youtube.com/@techpulsemedia',
};
```

## Icon Details

### Facebook
- **Icon**: Custom minimalist Facebook "f" logo
- **Style**: SVG with fill-based design
- **URL Pattern**: `https://facebook.com/[page_name]` or `https://www.facebook.com/[page_name]`

### Instagram
- **Icon**: Custom minimalist Instagram icon
- **Style**: Stroke-based camera design
- **URL Pattern**: `https://instagram.com/[handle]` or `https://www.instagram.com/[handle]`

### TikTok
- **Icon**: Custom minimalist TikTok icon
- **Style**: Fill-based design
- **URL Pattern**: `https://tiktok.com/@[handle]` or `https://www.tiktok.com/@[handle]`

### YouTube
- **Icon**: YouTube play icon from lucide-react
- **Style**: Fill-based play button
- **URL Pattern**: `https://youtube.com/@[channel_name]` or `https://youtube.com/c/[channel_name]`

## Design Features

### Styling
- **Background**: Gray-800 (dark minimalist)
- **Hover State**: Background darkens to gray-700
- **Effect**: Subtle shadow glow on hover (`shadow-lg shadow-gray-600/50`)
- **Transition**: Smooth 200ms animation
- **Order**: Facebook → Instagram → TikTok → YouTube (left to right)

### Accessibility
- All links include `target="_blank"` for opening in new tab
- `rel="noopener noreferrer"` for security
- `aria-label` attributes for screen readers
- Icons scale proportionally with `size={16}` parameter

### Responsive Behavior
- Icons display horizontally in flex row
- 8px gap between icons (consistent 8px spacing system)
- Adapts seamlessly on mobile and desktop

## Conditional Display
Icons only appear when their URLs are configured:
```typescript
{SOCIAL_MEDIA.FACEBOOK_URL && (
  <a href={SOCIAL_MEDIA.FACEBOOK_URL} ...>
    <FacebookIcon size={16} />
  </a>
)}
```

This means:
- Leave empty string (`''`) for platforms you don't use
- No empty buttons will be displayed
- Only configured platforms show in the footer
- Display order is always: Facebook, Instagram, TikTok, YouTube

## Custom Icon Components

### FacebookIcon
- Uses custom SVG for authentic Facebook branding
- Renders with `fill="currentColor"` for color inheritance
- Scalable via `size` prop

### InstagramIcon
- Uses custom SVG with stroke-based design
- Matches minimalist aesthetic
- Scalable via `size` prop

### TikTokIcon
- Uses custom SVG for authentic TikTok branding
- Renders with `fill="currentColor"` for color inheritance
- Scalable via `size` prop

All custom icons inherit text color from parent, ensuring consistent styling with other icons.

## Live Update
After updating the SOCIAL_MEDIA configuration:

1. Save the file
2. The dev server auto-refreshes
3. Icons appear in the footer immediately

## Build Verification
```bash
npm run build
```

Build time: ~7-9 seconds
Bundle impact: Minimal (custom icons are inline SVGs)

## Example Complete Configuration
```typescript
export const SOCIAL_MEDIA = {
  FACEBOOK_URL: 'https://facebook.com/techpulsemedia',
  INSTAGRAM_URL: 'https://instagram.com/techpulsemedia',
  TIKTOK_URL: 'https://tiktok.com/@techpulsemedia',
  YOUTUBE_URL: 'https://youtube.com/@techpulsemedia',
};
```

## Troubleshooting

**Icons not showing?**
- Verify URLs are not empty strings
- Check browser console for errors
- Ensure `target="_blank"` links open correctly

**Styling issues?**
- Icons inherit text color (white/gray-400)
- Hover effects require full className
- Custom icons need explicit `fill` or `stroke` properties

**Performance?**
- All icons are lightweight SVGs
- No external dependencies required
- Inline rendering with no HTTP requests

## Recent Updates

**June 2026:**
- Added Facebook icon with minimalist design
- Removed X (formerly Twitter) from social media lineup
- Reorganized icon order to: Facebook, Instagram, TikTok, YouTube
- Enhanced hover effects with subtle shadow glow
- Maintained consistent 8px spacing system
