import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    // For production, use a real service like SendGrid, Mailgun, or Gmail
    // For development, you can use Mailtrap or Ethereal
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Define email options
    const mailOptions = {
        from: `Snitch Support <${process.env.GOOGLE_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Support HTML content
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
