import { useEffect } from 'react';
import {
    SITE_URL, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE,
} from '../config/seo';

/**
 * Per-page metadata: title, description, canonical URL, Open Graph /
 * Twitter Card tags, and optional JSON-LD structured data. No dependency —
 * plain DOM writes on mount, reverted to the site defaults on unmount so
 * client-side route changes never leak one page's tags into the next.
 *
 * `path` is the route path (e.g. "/services/ai-consulting") used to build
 * the canonical + og:url. `jsonLd` accepts one schema.org object or an
 * array of them.
 */
function setMeta(attr, key, content) {
    if (!content) return;
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

export default function Seo({ title, description, path = '', image, jsonLd, noindex = false }) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
        const desc  = description || DEFAULT_DESCRIPTION;
        const url   = `${SITE_URL}${path}`;
        const img   = image || DEFAULT_OG_IMAGE;

        document.title = fullTitle;

        setMeta('name', 'description', desc);
        setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:description', desc);
        setMeta('property', 'og:url', url);
        setMeta('property', 'og:image', img);

        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:description', desc);
        setMeta('name', 'twitter:image', img);

        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url);

        // Structured data — replaced wholesale per page, removed on unmount.
        let ldScript = null;
        if (jsonLd) {
            ldScript = document.createElement('script');
            ldScript.type = 'application/ld+json';
            ldScript.text = JSON.stringify(jsonLd);
            document.head.appendChild(ldScript);
        }

        return () => {
            // Reset to sitewide defaults so an unmounted page's tags never
            // persist into whatever renders next during client-side nav.
            document.title = DEFAULT_TITLE;
            setMeta('name', 'description', DEFAULT_DESCRIPTION);
            setMeta('name', 'robots', 'index, follow');
            setMeta('property', 'og:title', DEFAULT_TITLE);
            setMeta('property', 'og:description', DEFAULT_DESCRIPTION);
            setMeta('property', 'og:url', SITE_URL);
            setMeta('property', 'og:image', DEFAULT_OG_IMAGE);
            setMeta('name', 'twitter:title', DEFAULT_TITLE);
            setMeta('name', 'twitter:description', DEFAULT_DESCRIPTION);
            setMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);
            if (ldScript) ldScript.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, description, path, image, jsonLd, noindex]);

    return null;
}
