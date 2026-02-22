const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (options) => {
    // If credentials are not set, mock the email service to avoid timeouts during development/testing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your-email@gmail.com') {
        console.log('\n--- 📧 EMAIL SYSTEM MOCKED ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message || options.html}`);
        console.log('------------------------------\n');
        return; // Return immediately
    }

    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            connectionTimeout: 5000 // Add a timeout limit
        });

        // Define email options
        const mailOptions = {
            from: `AI Nursing App <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${options.email}`);
    } catch (error) {
        console.error(`Email sending directly failed:`, error.message);
    }
};

module.exports = sendEmail;
