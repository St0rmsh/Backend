import express from "express"
import morgan from "morgan"
import {sendEmail} from "./email.js"
import channel from "./mq.js"


const app = express()


app.use(morgan("dev"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

if(channel){
  
  channel.consume("auth_notification_queue", async (msg) => {

    if(msg !== null){

        const message = JSON.parse(msg.content.toString());

        console.log(message);

      try {
        const {userId,emails,action,timestamp} = message;

        const subject = `New Login Notification`;
        const text = `Hello ${userId}, 
          your account was just used to log in. 
          If this wasn't you, please secure your account immediately.
        `;
        const html = `<h1>Your account has been ${action}ed at ${timestamp}</h1>`;

        await sendEmail(emails,subject,text,html);

        channel.ack(msg);


      } catch (error) {
        console.error("Error processing message:", error);
        channel.nack(msg); 
      }
    }
    else{
      console.log("No message received");
    }
})
}else {
      console.error('[MQ] Channel not available, skipping consumer setup');

}




app.get("/_status/healthz",(req,res)=>{
  res.status(200).json({
    message: "The notification server is working as expected"
  })
})

app.get("/_status/readyz",(req,res)=>{
  res.status(200).json({
    message: "The notification server is ready to take messages"
  })
})

export default app
