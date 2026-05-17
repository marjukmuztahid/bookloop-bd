import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const BASE_URL = 'https://bookloopbd.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/favicon.png?v=6`;

const setMetaTag = (property: string, content: string, isOg = false) => {
  const attr = isOg ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const JSONLD_ID = 'seo-route-jsonld';
const setJsonLd = (data: SEOProps['jsonLd']) => {
  const existing = document.getElementById(JSONLD_ID);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSONLD_ID;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

const useSEO = ({ title, description, ogImage, ogUrl, ogType = 'website', canonicalPath, jsonLd }: SEOProps) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    if (description) {
      setMetaTag('description', description);
    }

    const path = canonicalPath || window.location.pathname;
    const fullUrl = ogUrl || `${BASE_URL}${path}`;
    const resolvedOgImage = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`)
      : DEFAULT_OG_IMAGE;

    // Canonical
    setCanonical(`${BASE_URL}${path}`);

    // Open Graph
    setMetaTag('og:title', title, true);
    if (description) setMetaTag('og:description', description, true);
    setMetaTag('og:image', resolvedOgImage, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:url', fullUrl, true);

    // Twitter
    setMetaTag('twitter:card', ogImage && ogImage !== DEFAULT_OG_IMAGE ? 'summary_large_image' : 'summary');
    setMetaTag('twitter:title', title);
    if (description) setMetaTag('twitter:description', description);

    // JSON-LD
    setJsonLd(jsonLd);

    return () => {
      document.title = prevTitle;
      const el = document.getElementById(JSONLD_ID);
      if (el) el.remove();
    };
  }, [title, description, ogImage, ogUrl, ogType, canonicalPath, JSON.stringify(jsonLd)]);
};

export default useSEO;
