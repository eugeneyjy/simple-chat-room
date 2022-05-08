const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

exports.generateAuthToken = function(userId) {
    const payload = { sub: userId };
    return jwt.sign(payload, secretKey, { expiresIn: '12h' });
}

exports.setAuthCookie = function(res, token) {
    res.cookie('authToken', token,
        {
            expires: new Date(Date.now() + 12 * 3600000), // Cookie will expire in 12 hours
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        }
    );
}

exports.requireAuthentication = function(req, res, next) {
    const cookies = req.cookies;
    const authToken = cookies['authToken'] || '';

    try {
        const payload = jwt.verify(authToken, secretKey);
        req.userId = payload.sub;
        next();
    } catch(err) {
        res.status(401).json({
            error: "Invalid authentication token provided."
        });
    }
}