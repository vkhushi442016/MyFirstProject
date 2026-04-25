const connection = require('../../Model/dbConnect');
const twilio = require('twilio');


const client = twilio(process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN)  //ACCOUNT_SID, AUTH_TOKEN

const sendWhatsAppToPrincipals = async (req, res) => {
    try {
        const principals = [process.env.PERSONAL_NUMBER]
        const { messageText } = req.body;

        for (let number of principals) {
            const message = await client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: "whatsapp:" + number,
                body: messageText
            });
            console.log("Message SID:", message.sid);
            console.log("Status:", message.status);
        }

        res.send("Messages sent successfully");

    } catch (error) {
        console.log(error);
        res.send("Error sending messages");
    }
}

const sendMessages = async (req, res) => {
    console.log("Controller reached", req.body);
    const sqlQuery = `
        SELECT s.phone, s.first_name, s.last_name
        FROM role_assignment ra
        JOIN staff s ON s.staff_id = ra.staff_id
        JOIN roles r ON r.role_id = ra.role_id
        WHERE ra.role_id = ? AND s.status = ?;
    `;


    connection.query(sqlQuery, [req.body.role_id, req.body.status], async (err, results) => {

         if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ success: false, error: err.message });
        }

        try {
            const { message } = req.body;

            // validate message
            if (!message) {
                return res.status(400).json({
                    success: false,
                    error: "Missing message"
                });
            }

            // check users
            if (!results || results.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "No users found"
                });
            }

            // send SMS to all users
            const smsResults = await Promise.all(
                results.map(user =>
                    client.messages.create({
                        body: message,
                        from: process.env.TWILIO_SMS_NUMBER,
                        to: `+91${user.phone}`
                    })
                )
            );

            return res.status(200).json({
                success: true,
                sentTo: results.length,
                sids: smsResults.map(s => s.sid)
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
};






module.exports = { sendWhatsAppToPrincipals, sendMessages };
