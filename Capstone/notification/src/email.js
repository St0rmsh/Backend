import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_APP_PASSWORD
       
    },
    tls: {
        rejectUnauthorized: false 
    }
})

transporter.verify(function (error, success) {
    if (error) {
        console.error("Email transporter error:", error.message) 
    } else {
        console.log("Server is ready to take our messages")
    }
})



export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

