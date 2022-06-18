const jwt = require('jsonwebtoken');

module.exports = {

    gentToken: (payload) => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });
    },

    checkToken: async (req, res, next) => {

        var token = req.headers['authorization'];
        token = token.split(' ')[1];
        if (token) {
            try {
                const a = await jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = a;
                next();
            } catch (err) {
                res.status(403).json({
                    msg: 'Invalid Token'
                });
            }

        } else {
            res.status(403).json({
                msg: 'Invalid Token'
            });
        }
    }

}