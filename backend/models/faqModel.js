const { getPool } = require('../config/db');
const cache = require('../utils/cache');

const FAQ_CACHE_KEY = 'all_faqs';
const FAQ_CACHE_TTL = 3600; // 1 hour

async function getAllFAQs() {
    const cached = cache.get(FAQ_CACHE_KEY);
    if (cached) return cached;

    const pool = getPool();
    const result = await pool.query(
        `SELECT faq_id AS id, question, answer
         FROM faqs
         ORDER BY display_order`
    );

    cache.set(FAQ_CACHE_KEY, result.rows, FAQ_CACHE_TTL);
    return result.rows;
}

async function createFAQ({ question, answer }) {
    const pool = getPool();
    const nextOrder = await pool.query('SELECT COALESCE(MAX(display_order), 0) + 1 AS next FROM faqs');
    const result = await pool.query(
        `INSERT INTO faqs (question, answer, display_order)
         VALUES ($1, $2, $3) RETURNING faq_id AS id`,
        [question, answer, nextOrder.rows[0].next]
    );
    cache.delete(FAQ_CACHE_KEY);
    return result.rows[0];
}

async function updateFAQ(id, { question, answer }) {
    const pool = getPool();
    await pool.query(
        'UPDATE faqs SET question = $1, answer = $2 WHERE faq_id = $3',
        [question, answer, id]
    );
    cache.delete(FAQ_CACHE_KEY);
}

async function deleteFAQ(id) {
    const pool = getPool();
    await pool.query('DELETE FROM faqs WHERE faq_id = $1', [id]);
    cache.delete(FAQ_CACHE_KEY);
}

async function reorderFAQs(orderedIds) {
    const pool = getPool();
    await Promise.all(
        orderedIds.map((id, i) =>
            pool.query('UPDATE faqs SET display_order = $1 WHERE faq_id = $2', [i + 1, id])
        )
    );
    cache.delete(FAQ_CACHE_KEY);
}

module.exports = { getAllFAQs, createFAQ, updateFAQ, deleteFAQ, reorderFAQs };
