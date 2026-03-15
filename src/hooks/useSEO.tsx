import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const BASE_URL = 'https://bookloopbd.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/favicon.png?v=4`;

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

const useSEO = ({ title, description, ogImage, ogUrl, ogType = 'website' }: SEOProps) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    if (description) {
      setMetaTag('description', description);
    }

    // Open Graph
    setMetaTag('og:title', title, true);
    if (description) setMetaTag('og:description', description, true);
    setMetaTag('og:image', ogImage || DEFAULT_OG_IMAGE, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:url', ogUrl || `${BASE_URL}${window.location.pathname}`, true);

    // Twitter
    setMetaTag('twitter:card', ogImage && ogImage !== DEFAULT_OG_IMAGE ? 'summary_large_image' : 'summary');
    setMetaTag('twitter:title', title);
    if (description) setMetaTag('twitter:description', description);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogImage, ogUrl, ogType]);
};

export default useSEO;
