import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";


const app = express()

app.use(morgan("dev"))


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

const proxies = {}
const agentProxy = {}


async function createProxy(sandboxId) {
   const target = `http://sandbox-service-${sandboxId}.default.svc.cluster.local`

   if (!proxies[sandboxId]) {
      proxies[sandboxId] = createProxyMiddleware({
         target,
         changeOrigin: true,
         ws: true
      })
   }

   return proxies[sandboxId]
}


async function getAgentProxy(sandboxId) {

   const target = `http://sandbox-service-${sandboxId}.default.svc.cluster.local:3000`

   if (!agentProxy[sandboxId]) {
      agentProxy[sandboxId] = createProxyMiddleware({
         target,
         changeOrigin: true,
         ws: true
      })
   }

   return agentProxy[sandboxId]

}

app.use(async (req, res, next) => {

   const host = req.headers.host

   if (!host) {
      return res.status(400).json({ message: "Host header is required" })
   }

   const sandboxId = host.split(".")[0]

   if (!sandboxId) {
      return res.status(400).json({ message: "Invalid host header" })
   }

   if (host.split(".")[1] === "agent") {
      const proxy = await getAgentProxy(sandboxId)
      return proxy(req, res, next)
   }
   else if (host.split(".")[1] === "preview") {
      const proxy = await createProxy(sandboxId)
      return proxy(req, res, next)
   } else {
      return res.status(404).json({ message: "Service not found" })
   }

})


export default app