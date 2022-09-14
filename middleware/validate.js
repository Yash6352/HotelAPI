const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "Authentication Token is Required" })
    }
    jwt.verify(token, 'ThisisTopSecret', (err, _tokens) => {
        if (err) {
            res.status(401).json({
                message: err.message
            });
        } else {
            req.user = token
            next();
        }
    })
}

module.exports = verifyToken 