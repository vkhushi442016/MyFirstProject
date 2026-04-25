const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMailOnSignUp = async (toEmail, username) => {
    console.log("Sending email to:", toEmail);
    const msg = {
        from: "khushiverma442016@gmail.com",
        to: toEmail,
        subject: "Welcome to MP Education Portal – Account Successfully Created",
        text: `Dear ${username},

            Greetings from MP Education Portal.

            We are pleased to inform you that your account has been successfully created on the MP Education Portal. You can now access the platform and begin managing academic content efficiently.

            With your account, you can:
            • Organize and manage class-wise and subject-wise syllabus
            • Add and track topics with structured descriptions
            • Monitor academic planning and curriculum progress
            • Maintain a streamlined and well-organized educational workflow

            This platform is designed to support Principals and Teachers in simplifying academic management and enhancing overall efficiency.

            If you did not initiate this registration or require any assistance, please contact the support team immediately.

            We look forward to your valuable contribution in making the learning system more structured and effective.

            Warm Regards,
            MP Education Portal Team`,
    };
    try {
        await sgMail.send(msg);
        console.log("Email sent successfully to", toEmail);
    } catch (err) {
        console.log("Failed to send email:", err);
    }
}

const sendMailOnProfileCreated = async (toEmail, first_name, last_name, link, role) => {
    const msg = {
        from: "khushiverma442016@gmail.com",
        to: toEmail,
        subject: "Profile Created on MP Education Portal",
        text: `Dear ${first_name} ${last_name},
        
        Your profile is created successfully on MP Education Portal for designation ${role}.
        You can create your login information by signing up the below link provided. 
        
        Sign up LINK = ${link}
        
        Warm Regards,
        MP Education Portal Team`
    }
    try {
        await sgMail.send(msg);
        console.log("Email sent successfully to", toEmail);
    } catch (err) {
        console.log("Failed to send email:", err);
    }
}

    module.exports = { sendMailOnSignUp, sendMailOnProfileCreated }