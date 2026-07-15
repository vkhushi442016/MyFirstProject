const connection = require('../../Model/dbConnect');
const argon = require('argon2')
const jwt = require('jsonwebtoken')
const { sendMailOnSignUp } = require('../sendGridMailController/sendGridMailController')

let getLoginData = (req, res) => {
    let query = 'SELECT * FROM login'
    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
        } else {
            res.json(result);
        }
    })
}

let postLoginData = async (req, res) => {
    let { username, password } = req.body;
console.log(req.body);
    let query = `
            SELECT 
    l.username,
    l.password,
    l.staff_id,
    s.dise_code,
    r.rname,
    sd.sc_category
FROM login l
JOIN staff s 
    ON s.staff_id = l.staff_id
JOIN role_assignment ra 
    ON ra.staff_id = s.staff_id
JOIN roles r 
    ON r.role_id = ra.role_id
LEFT JOIN schools_detail sd
    ON sd.dise_code = s.dise_code
WHERE l.username = ?;
            `
    //let query = 'SELECT * FROM login WHERE username = ?'
    connection.query(query, [username], async (err, result) => {
        if (err) return res.status(500).json({ err: err.message })

        if (!result.length) {
            return res.status(401).send({ message: "Invalid Credentials" })
        }


        let isValid = await argon.verify(result[0].password, password)
        if (!isValid) {
            return res.status(401).send({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({
            username: result[0].username,
            staff_id: result[0].staff_id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1d" })
        res.json({
            username: username,
            staff_id: result[0].staff_id,
            role: result[0].rname,
            dise_code: result[0].dise_code,
            status: "Success",
            sc_category: result[0].sc_category,
            message: "Login Successful",
            token
        })
    })
}

let postSignUpData = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let hashedpassword = await argon.hash(password);

        const getStaffQuery = 'SELECT staff_id FROM staff WHERE email = ?';

        connection.query(getStaffQuery, [email], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }

            console.log("Fetched staff_id:", results);

            if (results.length === 0) {
                return res.status(400).json({ message: "Staff not found" });
            }

            const staff_id = results[0].staff_id;

            const insertQuery = `
                INSERT INTO login 
                (username, email, password, staff_id, welcome_email_sent)
                VALUES (?, ?, ?, ?, ?)
            `;

            connection.query(
                insertQuery,
                [username, email, hashedpassword, staff_id, false],
                async (err2) => {
                    if (err2) {
                        return res.status(500).json({ status: "Error", message: err2.message });
                    }

                    // Send welcome email (optional failure)
                    try {
                        console.log("Calling mail function...");
                        await sendMailOnSignUp(email, username);
                    } catch (emailErr) {
                        console.log("Email sending failed:", emailErr.message);
                    }

                    // Update email flag
                    const updateQuery = 'UPDATE login SET welcome_email_sent = ? WHERE email = ?';
                    connection.query(updateQuery, [true, email], (err3) => {
                        if (err3) console.log("Error updating email flag:", err3.message);
                    });

                    // Final response
                    res.json({
                        status: "Success",
                        message: "Sign Up Successful and welcome email sent!",
                        staff_id,
                    });
                }
            );
        });
    } catch (err) {
        console.log("Hashing Error:", err);
        res.status(500).json({ status: "Error", message: "Server error" });
    }
};


let getStaffId = (req, res) => {
    const staffId = req.params.staff_id;

    let query = `
        SELECT s.*
        FROM schools_detail s
        JOIN staff st 
        ON  st.dise_code = s.dise_code
        WHERE st.staff_id = ?
    `;

    connection.query(query, [staffId], (err, result) => {
        if (err) return res.status(500).json(err)
        if (!result.length) {
            return res.status(404).json({ message: "School not found for this staff" });
        }
        res.json(result[0])
    })
}

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({
                message: "Access Denied"
            })
        }
    }
}

const updatePassword = async (req, res) => {
    let query = `SELECT password FROM login WHERE username = ?`
    const username = req.params.username
    let { oldPassword, newPassword, confirmPassword } = req.body;

    //Confirming new password
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New password and confirm password do not match"
        });
    }

    connection.query(query, [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const storedHash = result[0].password

        //comparing oldpassword and received oldpassword value
        const matchPassword = await argon.verify(storedHash, oldPassword);

        if (!matchPassword) {
            return res.status(401).json({ message: "Invalid Credential" })
        }

        //new hashed password
        let newHashedPassword = await argon.hash(newPassword);
        connection.query("UPDATE login SET password = ? WHERE username = ?",
            [newHashedPassword, username],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    status: "Success",
                    message: "Password changed successfully",
                });
            })
    })
}

const createLogin = (req, res) => {

    const { username, password, email } = req.body;

    // get staff_id from staff table
    const getStaffQuery = 'SELECT staff_id FROM staff WHERE email = ?';

    connection.query(getStaffQuery, [email], (err, results) => {
        console.log("Fetched staff_id:", results);
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Staff not found" });
        }

        const staff_id = results[0].staff_id;

        // insert into login with staff_id
        const insertQuery = `
            INSERT INTO login (username, password, email, staff_id)
            VALUES (?, ?, ?, ?)
        `;

        connection.query(insertQuery, [username, password, email, staff_id], (err2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).send(err2);
            }

            res.json({
                message: "Login created successfully",
                staff_id
            });
        });
    });
};

    const protectRoute = (req, res) => {
        res.json("Welcome to my website")
    }




    module.exports = { getLoginData, postSignUpData, postLoginData, protectRoute, authorize, getStaffId, updatePassword, createLogin }