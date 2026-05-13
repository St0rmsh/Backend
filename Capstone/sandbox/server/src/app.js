import express from "express";
import morgan from "morgan";
import {createPod} from "./kubernetes/pod.js"
import {createService} from "./kubernetes/service.js"
import { k8sCoreV1Api } from "./kubernetes/config.js"
import {v7 as uuid} from "uuid"


const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/api/sandbox/health", async (req,res) =>{
   res.status(200).json({
    status: "ok",
    message: "Sandbox is healthy",
    timestamp: new Date().toISOString()
   });
});


async function waitForPodReady(sandboxId, timeoutMs = 60000) {
    const podName = `sandbox-pod-${sandboxId}`;
    const start = Date.now();
    
    while (Date.now() - start < timeoutMs) {
        try {
            const pod = await k8sCoreV1Api.readNamespacedPod({
                name: podName,
                namespace: "default"
            });
            
            const containerStatuses = pod.status?.containerStatuses || [];
            const allReady = containerStatuses.length > 0 && 
                             containerStatuses.every(c => c.ready === true);
            
            if (allReady && pod.status?.phase === "Running") {
                console.log(`Pod ${podName} is ready`);
                return true;
            }
        } catch (err) {
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Pod ${podName} did not become ready within ${timeoutMs}ms`);
}


app.post("/api/sandbox/start", async (req,res)=>{

   const sandboxId = uuid()
 
   await createPod(sandboxId);

   await createService(sandboxId);

   await waitForPodReady(sandboxId);

   return res.status(201).json({
    message: "Sandbox started successfully",
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`
   })
    
})


export default app