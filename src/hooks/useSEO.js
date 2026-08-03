import { useEffect } from 'react';

/**
 * useSEO — Dynamic per-page SEO hook for DivinIQ
 * Usage: useSEO({ title, description, keywords, canonical, ogImage, schema })
 */
const DEFAULT = {
  siteName: 'DivinIQ',
  baseUrl: 'https://vaidikguru.com',
  defaultImage: 'https://vaidikguru.com/assets/img/og-image.jpg',
  twitterHandle: '@diviniq',
};

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  schema,
  noIndex = false,
}) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────────
    const fullTitle = title
      ? `${title} | ${DEFAULT.siteName}`
      : `${DEFAULT.siteName} | Online Puja Booking, Chadhava & Expert Astrology`;
    document.title = fullTitle;

    // ── Helper to set/create meta tags ─────────────────────────────────────
    const setMeta = (selector, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.startsWith('meta[property')
          ? 'property'
          : 'name';
        const val = selector.match(/["']([^"']+)["']/)?.[1];
        if (attr && val) el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const removeLink = (rel) => {
      const el = document.querySelector(`link[rel="${rel}"]`);
      if (el) el.remove();
    };

    // ── Standard Meta ──────────────────────────────────────────────────────
    if (description) setMeta('meta[name="description"]', description);
    if (keywords) setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[name="robots"]', noIndex ? 'NOINDEX,NOFOLLOW' : 'INDEX,FOLLOW');

    // ── Canonical ──────────────────────────────────────────────────────────
    const canonicalUrl = canonical
      ? `${DEFAULT.baseUrl}${canonical}`
      : `${DEFAULT.baseUrl}${window.location.pathname}`;
    setLink('canonical', canonicalUrl);

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', fullTitle);
    if (description) setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[property="og:image"]', ogImage || DEFAULT.defaultImage);
    setMeta('meta[property="og:site_name"]', DEFAULT.siteName);

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', fullTitle);
    if (description) setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage || DEFAULT.defaultImage);
    setMeta('meta[name="twitter:site"]', DEFAULT.twitterHandle);

    // ── JSON-LD Schema ─────────────────────────────────────────────────────
    const schemaId = 'dynamic-schema-ld';
    let schemaEl = document.getElementById(schemaId);
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.type = 'application/ld+json';
        schemaEl.id = schemaId;
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    } else {
      if (schemaEl) schemaEl.remove();
    }

    // Cleanup on unmount
    return () => {
      removeLink('canonical');
    };
  }, [title, description, keywords, canonical, ogImage, ogType, schema, noIndex]);
}