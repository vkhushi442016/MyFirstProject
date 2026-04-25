const connection = require('../../Model/dbConnect')

const getStaffData = (req, res) => {
    let query = `
        SELECT s.*, r.rname
        FROM staff s
        JOIN role_assignment ra ON s.staff_id = ra.staff_id
        JOIN roles r ON ra.role_id = r.role_id
    `;

    connection.query(query, (err, result) => {
        if (err) {
            console.log("Error: ", err.message);
            return res.status(500).send(err);
        } else {
            return res.send(result);
        }
    });
};

const sendNotificationByRole = (req, res) => {
    const { role, message } = req.body;

    if (!role || !message) {
        return res.status(400).json({ error: "Role and message are required" });
    }

    // Step 1: get staff by role name (NO hardcoding)
    let query = `
    SELECT l.staff_id
    FROM staff s
    JOIN role_assignment ra ON s.staff_id = ra.staff_id
    JOIN roles r ON ra.role_id = r.role_id
    JOIN login l ON s.staff_id = l.staff_id
    WHERE r.rname = ?
`;

    connection.query(query, [role], (err, users) => {
        if (err) {
            console.log("Error: ", err.message);
            return res.status(500).send(err);
        }

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found for this role" });
        }

        // Step 2: insert notification for each user
        users.forEach(user => {
            let insertQuery = `
                INSERT INTO notifications (user_id, type, message)
                VALUES (?, 'event', ?)
            `;

            connection.query(insertQuery, [user.staff_id, message], (err) => {
                if (err) console.log("Insert Error:", err.message);
            });
        });

        return res.json({ 
            success: true, 
            message: "Notification sent successfully" 
        });
    });
};



module.exports = { getStaffData, sendNotificationByRole }