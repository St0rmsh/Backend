import type {
  Request,
  Response,
} from "express";

import { z } from "zod";

import runBattleArena from "../ai/graph.ai.js";

const BattleSchema = z.object({
  message: z
    .string()
    .min(3)
    .max(10000),
});

export async function battleController(
  req: Request,
  res: Response
): Promise<void> {

  const { message } =
    BattleSchema.parse(req.body);

  const result =
    await runBattleArena(message);

  res.status(200).json({
    success: true,
    data: result,
  });

}

export async function healthController(
  _req: Request,
  res: Response
): Promise<void> {

  res.json({
    success: true,
    status: "running",
    service: "Battle Arena",
    timestamp: new Date().toISOString(),
  });

}