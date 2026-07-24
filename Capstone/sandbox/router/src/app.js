import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import {refreshTTL} from "./config/redis.js"
import cors from "cors"

const app = express()

app.use(morgan("dev"))
app.use(cors({
   origin: "*",
   credentials: true,
}))



app.get("/api/status/healthz", async (req, res) => {
   return res.status(200).json({
      message: "ok",
      timestamp: new Date().toISOString()
   })
})


app.get("/api/status/readyz", async (req, res) => {
   return res.status(200).json({
      message: "ok",
      timestamp: new Date().toISOString()
   })
})

export const previewProxy = createProxyMiddleware({
   target: "http://default-target",
   changeOrigin: true,
   ws: true,
   router: (req) => {
      const host = req.headers.host;
      if (!host) return undefined;
      const sandboxId = host.split(".")[0];
      return `http://sandbox-service-${sandboxId}.default.svc.cluster.local`;
   }
});

export const agentProxy = createProxyMiddleware({
   target: "http://default-target",
   changeOrigin: true,
   ws: true,
   router: (req) => {
      const host = req.headers.host;
      if (!host) return undefined;
      const sandboxId = host.split(".")[0];
      return `http://sandbox-service-${sandboxId}.default.svc.cluster.local:3000`;
   }
});

app.use(async(req, res, next) => {
   const host = req.headers.host;

   if (!host) {
      return res.status(400).json({ message: "Host header is required" });
   }


   const parts = host.split(".");
   const sandboxId = parts[0];
   const subdomain = parts[1];



   if (!sandboxId) {
      return res.status(400).json({ message: "Invalid host header" });
   }

   await refreshTTL(sandboxId);     
    

   if (subdomain === "agent") {
      return agentProxy(req, res, next);
   } else if (subdomain === "preview") {
      return previewProxy(req, res, next);
   } else {
      return res.status(404).json({ message: "Service not found" });
   }
});


export default app