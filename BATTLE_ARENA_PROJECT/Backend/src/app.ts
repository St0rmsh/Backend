import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/error.middleware.js";

import battleRoutes from "./routes/battle.routes.js";

const app = express();

/* ============================================================
   Middlewares
============================================================ */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ============================================================
   Routes
============================================================ */

app.use("/api", battleRoutes);


/* ============================================================
   404
============================================================ */

app.use((_req, res) => {

  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });

});

/* ============================================================
   Error Middleware
============================================================ */

app.use(errorMiddleware);

/* ============================================================
   Global Error Handler
============================================================ */

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

export default app;