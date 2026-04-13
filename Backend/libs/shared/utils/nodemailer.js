const nodemailer = require("nodemailer");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

let transporter; // Declare transporter globally

/**
 * Initializes SMTP credentials from AWS Secrets Manager
 */
const initializeTransporter = async () => {
    try {
        const secretName = process.env.SECRET_NAME; // The secret name
        const secrets = "TEST";

        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587, // Default to 587 for TLS
            secure: false, // Set to true for port 465 (SSL)
            auth: {
                user: process.env.SMTP_USERNAME, 
                pass: process.env.SMTP_PASSWORD, 
            },
        });

        console.log("SMTP transporter initialized successfully.");
    } catch (error) {
        console.error("Error initializing transporter:", error);
        throw error;
    }
};

/**
 * Sends an email with an OTP
 * @param {string} to - Recipient's email address
 * @param {string} OTP - OTP code
 */
const sendEmailOTP = async (userName, to, OTP) => {
    if (!transporter) {
        console.error("SMTP transporter not initialized. Reinitializing...");
        await initializeTransporter(); // Ensure transporter is initialized
    }

    const templatePath = path.join(__dirname, "templates", "email_template.html");
    let emailTemplate = fs.readFileSync(templatePath, "utf-8");

    emailTemplate = emailTemplate.replace("{{userName}}", userName);
    emailTemplate = emailTemplate.replace("{{OTP}}", OTP);

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: to,
        subject: "Complete Your Process: Verify Your Email Address",
        html: emailTemplate,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

// Initialize transporter when the module is loaded
initializeTransporter();

module.exports = {
    sendEmailOTP,
};
