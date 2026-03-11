import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.GOOGLE_USER,
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    },
    tls:{
        rejectUnauthorized:false
    }
})

transporter.verify()
.then(()=>{
    console.log("Email Transporter is ready to Send Email");
})
.catch((error)=>{
    console.error("Email Transporter Verification Failed "+ error);
})

export async function sendEmail({to,subject,html,text}) {
    try {
        const mailOption = {
            from:process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        }

        const details = await transporter.sendMail(mailOption)
        console.log("Email Sent", details);
        return details
    } catch (error) {
        console.error("Error sending email:", error);
        throw error
    }
}