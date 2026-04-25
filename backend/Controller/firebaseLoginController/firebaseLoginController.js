const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const connection = require('../../Model/dbConnect');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const firebaseLogin = async (req, res) => {
    const { token } = req.body;
    
    if (!token) return res.status(400).json({ message: 'No token provided' });

    try {
        const decoded = await admin.auth().verifyIdToken(token);

        const email = decoded.email;
        const username = decoded.name;

        console.log('Decoded Firebase token:', decoded);
        
        //Connect DB
        const getStaffQuery = `SELECT staff_id FROM staff WHERE email = ?`;

        connection.query(getStaffQuery, [email], (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (results.length === 0) {
                return res.status(400).json({ message: "Staff not found" });
            }
            const staff_id = results[0].staff_id;

            //Fetch roles
            const roleQuery = `
                    SELECT 
                        l.username,
                        s.staff_id,
                        s.dise_code,
                        r.rname
                    FROM login l
                    JOIN staff s ON s.staff_id = l.staff_id
                    LEFT JOIN role_assignment ra ON ra.staff_id = s.staff_id
                    LEFT JOIN roles r ON r.role_id = ra.role_id
                    WHERE l.email = ?
                `;

            connection.query(roleQuery, [email], (err2, rolesRes) => {
                if (err2) return res.status(500).send(err2);

                res.json({
                    message: "Login successful (Firebase)",
                    user: {
                        username: rolesRes[0]?.username,
                        dise_code: rolesRes[0]?.dise_code,
                        email,
                        staff_id,
                        roles: rolesRes.map(r => r.rname)
                    }
                })
            })

        })
    } catch (error) {
        res.status(401).json({ message: "Invalid Firebase token" })
    }
}

module.exports = { firebaseLogin }