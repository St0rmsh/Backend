import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";

/* ============================================================
   Global Error Middleware
============================================================ */

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {

  console.error("\n=================================");
  console.error("❌ ERROR");
  console.error("=================================\n");

  console.error(error);

  /* --------------------------------------------------------
      Zod Validation Error
  -------------------------------------------------------- */

  if (error instanceof ZodError) {

    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.flatten(),
    });

    return;
  }

  /* --------------------------------------------------------
      Generic Error
  -------------------------------------------------------- */

  if (error instanceof Error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }

  /* --------------------------------------------------------
      Unknown Error
  -------------------------------------------------------- */

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });

}

export default errorMiddleware;