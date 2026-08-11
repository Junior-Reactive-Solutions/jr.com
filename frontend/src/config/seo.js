// Single source of truth for the site's canonical origin and shared SEO
// defaults. juniorreactive.com is the custom domain referenced in the
// backend's CORS allow-list; jrcom.vercel.app is kept as a fallback host
// only, never as the canonical URL search engines should index.
export const SITE_URL  = 'https://juniorreactive.com';
export const SITE_NAME = 'Junior Reactive';
export const DEFAULT_TITLE = 'Junior Reactive — AI & IT Solutions';
export const DEFAULT_DESCRIPTION =
    'Junior Reactive builds N8N automations, AI assistants, and custom software for businesses across East Africa. Based in Kampala, Uganda.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;
