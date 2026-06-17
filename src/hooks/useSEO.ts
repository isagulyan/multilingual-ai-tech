import { useEffect } from 'react';

const BASE_TITLE = 'TechPulse Media';
const BASE_URL = 'https://techpulse.media';
const DEFAULT_TITLE = `${BASE_TITLE} - AI, Technology, SaaS & Business Intelligence`;
const DEFAULT_DESC = "The world's leading technology and business media platform. Expert insights on AI, software, cybersecurity, cloud computing, digital marketing, investing, and finance.";
const DEFAULT_IMAGE = 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200';

export interface SEOOptions {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  type?: 'website' | 'article';
  schema?: Record<string, unknown>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO({
  title,
  description,
  ogImage,
  canonical,
  type = 'website',
  schema,
}: SEOOptions = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESC;
    const image = ogImage || DEFAULT_IMAGE;

    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:type', type);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', image);

    if (canonical) upsertLink('canonical', `${BASE_URL}${canonical}`);

    const schemaId = 'dynamic-schema-ld';
    let schemaEl = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.type = 'application/ld+json';
        schemaEl.id = schemaId;
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    } else {
      schemaEl?.remove();
    }

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta('name', 'description', DEFAULT_DESC);
      upsertMeta('property', 'og:title', DEFAULT_TITLE);
      upsertMeta('property', 'og:description', DEFAULT_DESC);
      upsertMeta('property', 'og:image', DEFAULT_IMAGE);
      upsertMeta('property', 'og:type', 'website');
      upsertMeta('name', 'twitter:title', DEFAULT_TITLE);
      upsertMeta('name', 'twitter:description', DEFAULT_DESC);
      upsertMeta('name', 'twitter:image', DEFAULT_IMAGE);
      document.getElementById(schemaId)?.remove();
    };
  }, [title, description, ogImage, canonical, type, schema]);
}
