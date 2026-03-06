const connection = require('../../Model/dbConnect');
const argron = require('argon2')
const jwt = require('jsonwebtoken')

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

    let query = 'SELECT * FROM login WHERE username = ?'
    connection.query(query, [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ err: err.message })
        }
        if (!result.length) {
            return res.status(401).send({ message: "Invalid Credentials" })
        }
        let isValid = await argron.verify(result[0].password, password)
        if (!isValid) {
            return res.status(401).send({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({
            username: result[0].username
        },
            process.env.SECRET_KEY,
            { expiresIn: "1d" })
        res.json({
            username: username,
            status: "Success",
            message: "Login Successful",
            token
        })
    })
}

let postSignUpData = async (req, res) => {
    let { username, email, password } = req.body;
    let hashedpassword = await argron.hash(password);
    let query = 'INSERT INTO login (username, email, password) VALUES (?, ?, ?)'

    connection.query(query, [username, email, hashedpassword], (err, result) => {
        if (err) {
            console.log("Error :", err.message);
        } else {
            res.json({
                status: "Success",
                message: "Login Successful",
            });
        }
    })
}

const protectRoute = (req, res) => {
    res.json("Welcome to my website")
}



module.exports = { getLoginData, postSignUpData, postLoginData, protectRoute }