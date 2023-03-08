const jwt = require('jsonwebtoken');

exports.isLoggedIn = ( req, res, next ) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).json({Error: 'Access Denied'});

    try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verifyToken.user;
        next();
    } catch (error) {
        let message;
        if(!req.user) message = 'Session Timeout! User not found';
        else message = error;
        res.status(500).json({error:message});
    }

}