import { Router } from "express";

import {
  battleController,
  healthController,
} from "../controllers/battle.controller.js";

import asyncHandler from "../middleware/asyncHandler.js";

const router = Router();

router.get(
  "/health",
  asyncHandler(healthController)
);

router.post(
  "/battle",
  asyncHandler(battleController)
);

export default router;