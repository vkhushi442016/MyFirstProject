const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY

const authenticate = (req, res, next) => {
    try {
         const authHeader = req.headers.authorization;

        // Check if header exists
        if (!authHeader) {
            return res.status(401).json({
                error: "Authorization header missing"
            });
        }
        const token = authHeader.split(' ')[1]
        //console.log(token);

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                error: "Token missing"
            });
        }

        const verify = jwt.verify(token, secretKey)
        req.user = verify;
        next();

    } catch (error) {
        return res.status(401).json({
            error: "Invalid or expired token"
        })
    }
}

// const authenticate = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         // ✅ Check if header exists
//         if (!authHeader) {
//             return res.status(401).json({
//                 error: "Authorization header missing"
//             });
//         }

//         const token = authHeader.split(' ')[1];

//         // ✅ Check if token exists
//         if (!token) {
//             return res.status(401).json({
//                 error: "Token missing"
//             });
//         }

//         const verify = jwt.verify(token, secretKey);
//         req.user = verify;

//         next(); // ✅ continue to controller

//     } catch (error) {
//         return res.status(401).json({
//             error: "Invalid or expired token"
//         });
//     }
// };

module.exports = { authenticate }