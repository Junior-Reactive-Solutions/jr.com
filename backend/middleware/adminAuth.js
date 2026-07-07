const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Fail closed: a missing or weak secret would make admin tokens forgeable,
// so the server must refuse to start rather than fall back to a known value.
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error(
        'JWT_SECRET is not set or is shorter than 32 characters. ' +
        'Set a strong JWT_SECRET in the environment before starting the server.'
    );
}

/**
 * Middleware: verify admin JWT from httpOnly cookie.
 * Attaches decoded payload to req.admin on success.
 */
function adminAuth(req, res, next) {
    const token = req.cookies?.adminToken;

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authenticated.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
    }
}

module.exports = { adminAuth, JWT_SECRET };
