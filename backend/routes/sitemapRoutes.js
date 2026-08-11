const express = require('express');
const router  = express.Router();
const { getAllServices } = require('../models/serviceModel');
const { getAllBlogPosts } = require('../models/blogModel');
const logger  = require('../utils/logger');

const SITE_URL = 'https://juniorreactive.com';

// Static routes worth indexing. /admin, /styleguide, and error/auth states
// are intentionally excluded (see robots.txt for the same exclusions).
const STATIC_ROUTES = [
    { path: '/',           priority: '1.0', changefreq: 'weekly'  },
    { path: '/services',   priority: '0.9', changefreq: 'weekly'  },
    { path: '/about',      priority: '0.7', changefreq: 'monthly' },
    { path: '/portfolio',  priority: '0.7', changefreq: 'monthly' },
    { path: '/team',       priority: '0.6', changefreq: 'monthly' },
    { path: '/blog',       priority: '0.8', changefreq: 'weekly'  },
    { path: '/faq',        priority: '0.6', changefreq: 'monthly' },
    { path: '/ai-tools',   priority: '0.7', changefreq: 'monthly' },
    { path: '/contact',    priority: '0.6', changefreq: 'yearly'  },
    { path: '/apply',      priority: '0.6', changefreq: 'yearly'  },
    { path: '/privacy',    priority: '0.3', changefreq: 'yearly'  },
    { path: '/terms',      priority: '0.3', changefreq: 'yearly'  },
];

function urlEntry(loc, { priority = '0.5', changefreq = 'monthly', lastmod } = {}) {
    return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>\n    ` : ''}<changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * GET /sitemap.xml — built live from the DB on every request (cheap: two
 * cached model calls) so new services/posts appear without a redeploy.
 * The frontend proxies its own /sitemap.xml here via a Vercel rewrite so
 * it's served from the canonical domain, not the API's.
 */
router.get('/sitemap.xml', async (req, res) => {
    try {
        const [services, posts] = await Promise.all([
            getAllServices().catch(() => []),
            getAllBlogPosts().catch(() => []),
        ]);

        const urls = [
            ...STATIC_ROUTES.map((r) => urlEntry(`${SITE_URL}${r.path}`, r)),
            ...services.map((s) => urlEntry(`${SITE_URL}/services/${s.key || s.id}`, { priority: '0.7', changefreq: 'monthly' })),
            ...posts.map((p) => urlEntry(`${SITE_URL}/blog/${p.slug}`, {
                priority: '0.6',
                changefreq: 'monthly',
                lastmod: p.publishDate ? new Date(p.publishDate).toISOString().slice(0, 10) : undefined,
            })),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600');
        res.send(xml);
    } catch (err) {
        logger.error({ err }, 'Failed to generate sitemap.xml');
        res.status(500).type('text/plain').send('Sitemap generation failed.');
    }
});

module.exports = router;
