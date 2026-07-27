const { getPool } = require('../config/db');
const cache = require('../utils/cache');

const BLOG_CACHE_KEY = 'all_blog_posts';
const BLOG_CACHE_TTL = 3600; // 1 hour

async function getAllBlogPosts() {
    const cached = cache.get(BLOG_CACHE_KEY);
    if (cached) return cached;

    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, author,
                publish_date AS "publishDate",
                TO_CHAR(publish_date, 'Month DD, YYYY') AS "formattedDate"
         FROM blog_posts
         ORDER BY publish_date DESC`
    );

    cache.set(BLOG_CACHE_KEY, result.rows, BLOG_CACHE_TTL);
    return result.rows;
}

async function getBlogPostBySlug(slug) {
    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, content, author,
                publish_date AS "publishDate",
                TO_CHAR(publish_date, 'Month DD, YYYY') AS "formattedDate"
         FROM blog_posts WHERE slug = $1`,
        [slug]
    );
    return result.rows[0] || null;
}

// ── Admin CRUD ──────────────────────────────────────────────────────────────
async function getAllBlogPostsAdmin() {
    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, content, author,
                publish_date AS "publishDate",
                TO_CHAR(publish_date, 'Month DD, YYYY') AS "formattedDate"
         FROM blog_posts
         ORDER BY publish_date DESC`
    );
    return result.rows;
}

async function getBlogPostByIdAdmin(id) {
    const pool = getPool();
    const result = await pool.query(
        `SELECT post_id AS id, slug, title, excerpt, content, author, publish_date AS "publishDate"
         FROM blog_posts WHERE post_id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

async function slugExists(slug, excludeId = null) {
    const pool = getPool();
    const result = excludeId
        ? await pool.query('SELECT 1 FROM blog_posts WHERE slug = $1 AND post_id != $2', [slug, excludeId])
        : await pool.query('SELECT 1 FROM blog_posts WHERE slug = $1', [slug]);
    return result.rows.length > 0;
}

async function createBlogPost({ title, slug, excerpt, content, author, publishDate }) {
    const pool = getPool();
    const result = await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, author, publish_date)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING post_id AS id`,
        [title, slug, excerpt, content, author, publishDate || new Date()]
    );
    cache.delete(BLOG_CACHE_KEY);
    return result.rows[0];
}

async function updateBlogPost(id, { title, slug, excerpt, content, author, publishDate }) {
    const pool = getPool();
    await pool.query(
        `UPDATE blog_posts
         SET title = $1, slug = $2, excerpt = $3, content = $4, author = $5, publish_date = $6
         WHERE post_id = $7`,
        [title, slug, excerpt, content, author, publishDate, id]
    );
    cache.delete(BLOG_CACHE_KEY);
}

async function deleteBlogPost(id) {
    const pool = getPool();
    await pool.query('DELETE FROM blog_posts WHERE post_id = $1', [id]);
    cache.delete(BLOG_CACHE_KEY);
}

module.exports = {
    getAllBlogPosts, getBlogPostBySlug,
    getAllBlogPostsAdmin, getBlogPostByIdAdmin, slugExists,
    createBlogPost, updateBlogPost, deleteBlogPost,
};
