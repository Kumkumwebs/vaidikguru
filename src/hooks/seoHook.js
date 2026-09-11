
import { useEffect } from "react";

/**
 * useSEO - Dynamic per-page SEO hook for VaidikGuru
 *
 * Usage:
 * useSEO({
 *   title,
 *   description,
 *   keywords,
 *   canonical: "/puja",
 *   ogImage,
 *   schema
 * });
 */

const DEFAULT = {
  siteName: "VaidikGuru",
  baseUrl: "https://vaidikguru.com",
  defaultImage: "https://vaidikguru.com/assets/img/og-image.jpg",
  twitterHandle: "@vaidikguru",
};

export function useSEO(options = {}) {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = "website",
    schema,
    noIndex = false,
  } = options;

  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${DEFAULT.siteName}`
      : `${DEFAULT.siteName} | Online Puja Booking, Chadhava & Expert Astrology`;

    document.title = fullTitle;

    const setMeta = (selector, content) => {
      if (!content) return;

      let el = document.head.querySelector(selector);

      if (!el) {
        el = document.createElement("meta");

        if (selector.includes('property="')) {
          const match = selector.match(/property="([^"]+)"/);
          if (match) {
            el.setAttribute("property", match[1]);
          }
        } else {
          const match = selector.match(/name="([^"]+)"/);
          if (match) {
            el.setAttribute("name", match[1]);
          }
        }

        document.head.appendChild(el);
      }

      el.setAttribute("content", content);
    };

    /*
     * IMPORTANT:
     * Only ONE canonical tag is maintained.
     */
    const setCanonical = (url) => {
      let canonicalEl = document.head.querySelector(
        'link[rel="canonical"]'
      );

      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
      }

      canonicalEl.setAttribute("href", url);
    };

    // --------------------------------
    // Canonical URL
    // --------------------------------

    let canonicalPath;

    if (canonical) {
      canonicalPath = canonical.startsWith("/")
        ? canonical
        : `/${canonical}`;
    } else {
      canonicalPath = window.location.pathname;
    }

    // Remove trailing slash except homepage
    canonicalPath =
      canonicalPath === "/"
        ? "/"
        : canonicalPath.replace(/\/+$/, "");

    const canonicalUrl = `${DEFAULT.baseUrl}${canonicalPath}`;

    setCanonical(canonicalUrl);

    // --------------------------------
    // Standard Meta
    // --------------------------------

    setMeta(
      'meta[name="description"]',
      description
    );

    setMeta(
      'meta[name="keywords"]',
      keywords
    );

    setMeta(
      'meta[name="robots"]',
      noIndex
        ? "NOINDEX,NOFOLLOW"
        : "INDEX,FOLLOW"
    );

    // --------------------------------
    // Open Graph
    // --------------------------------

    setMeta(
      'meta[property="og:title"]',
      fullTitle
    );

    setMeta(
      'meta[property="og:description"]',
      description
    );

    setMeta(
      'meta[property="og:url"]',
      canonicalUrl
    );

    setMeta(
      'meta[property="og:type"]',
      ogType
    );

    setMeta(
      'meta[property="og:image"]',
      ogImage || DEFAULT.defaultImage
    );

    setMeta(
      'meta[property="og:site_name"]',
      DEFAULT.siteName
    );

    // --------------------------------
    // Twitter
    // --------------------------------

    setMeta(
      'meta[name="twitter:card"]',
      "summary_large_image"
    );

    setMeta(
      'meta[name="twitter:title"]',
      fullTitle
    );

    setMeta(
      'meta[name="twitter:description"]',
      description
    );

    setMeta(
      'meta[name="twitter:image"]',
      ogImage || DEFAULT.defaultImage
    );

    setMeta(
      'meta[name="twitter:site"]',
      DEFAULT.twitterHandle
    );

    // --------------------------------
    // JSON-LD
    // --------------------------------

    const schemaId = "dynamic-schema-ld";

    let schemaEl = document.getElementById(schemaId);

    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement("script");
        schemaEl.type = "application/ld+json";
        schemaEl.id = schemaId;
        document.head.appendChild(schemaEl);
      }

      schemaEl.textContent = JSON.stringify(schema);
    } else if (schemaEl) {
      schemaEl.remove();
    }

    /*
     * DO NOT remove canonical on cleanup.
     *
     * The next route's useSEO() will update it.
     */
    return undefined;
  }, [
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType,
    schema,
    noIndex,
  ]);
}

export default useSEO;

