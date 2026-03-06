const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token);
        const verify = jwt.verify(token, secretKey)
        req.user = verify;
        next();        
    } catch (error) {
        return res.status(404).json({
            error: error.message
        })
    }
}

module.exports = {authenticate}