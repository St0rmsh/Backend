import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { waitForPodReady } from "../middleware/podReady.middleware.js";
import { createSandboxKey } from "../config/redis.js";
import { v7 as uuid } from "uuid";
import Project from "../models/project.model.js";

const router = Router();


router.post("/project", async (req, res) => {
    try {
        const { title } = req.body;

        const project = new Project({
            user: req.userId,
            title
        });

        await project.save();

        return res.status(201).json({ message: "Project created successfully", project });

    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ message: error.message });
    }
});

router.post("/start", async (req, res) => {
    try {
        const sandboxId = uuid();

        await createPod(sandboxId);
        await createService(sandboxId);
        await waitForPodReady(sandboxId, 180000);
        await createSandboxKey(sandboxId);

        return res.status(201).json({
            message: "Sandbox started successfully",
            sandboxId,
            previewUrl: `http://${sandboxId}.preview.localhost`
        });

    } catch (error) {
        console.error("Error starting sandbox:", error);
        return res.status(500).json({ message: error.message });
    }
});

router.get("/projects", async (req, res) => {
    try {
        const projects = await Project.find({ user: req.userId });
        return res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: error.message });
    }
});

export default router;