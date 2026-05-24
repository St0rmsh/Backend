import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { waitForPodReady } from "../middleware/podReady.middleware.js";
import { createSandboxKey } from "../config/redis.js";
import { v7 as uuid } from "uuid";
import Project from "../models/project.model.js";

const router = Router();


router.post("/project", authenticate, async (req,res)=>{
    const {title} = req.body;
    
    const project = new Project({
        user: req.user.id,
        title
    })

    await project.save();
    
    return res.status(201).json({message: "Project created successfully"});
    
})

router.post("/start", authenticate, async (req,res)=>{

    const projectId = req.body.projectId;

    const project = await Project.findOne({_id: projectId,owner: req.user.id});

    if(!project){
        return res.status(404).json({message: "Project not found"});
    }



   const sandboxId = uuid()
 
   await createPod(sandboxId);

   await createService(sandboxId);

   await waitForPodReady(sandboxId, 180000);

   await createSandboxKey(sandboxId);

   return res.status(201).json({
    message: "Sandbox started successfully",
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`
   })
    
})


router.get("/projects", authenticate, async (req,res)=>{

    const projects = await Project.find({user: req.user.id});

    return res.status(200).json(projects);
    
})

export default router