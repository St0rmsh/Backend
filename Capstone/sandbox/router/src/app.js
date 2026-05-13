import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";


const app = express()

app.use(morgan("dev"))
app.use(express.json())


app.get("/api/status/healthz", async (req,res) => {
   return res.status(200).json({
    message: "ok",
    timestamp: new Date().toISOString()
   })
})


app.get("/api/status/readyz", async (req,res) => {
   return res.status(200).json({
    message: "ok",
    timestamp: new Date().toISOString()
   })
})


app.use((req,res,next)=> { 
   
     const host = req.headers.host

     if(!host){
        return res.status(400).json({message: "Host header is required"})
     }

     const sandboxId = host.split(".")[0]

     if(!sandboxId){
        return res.status(400).json({message: "Invalid host header"})
     }

     const target = `http://sandbox-service-${sandboxId}.default.svc.cluster.local`


     createProxyMiddleware({
       target,
       changeOrigin: true,
       ws:true
     })(req,res,next)


 }) 


export default app