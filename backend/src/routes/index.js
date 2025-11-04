import { Router } from "express";
import linesRouter from "./lines.js";
import statsRouter from "./stats.js";
import metricsRouter from "./metrics.js";
import rankingRouter from "./ranking.js";
import monthlyShareRouter from "./monthly-share.js";

const router = Router();

router.get("/hello", (_req, res) => {
  res.json({ message: "Hola Fer, backend vivo." });
});

router.use("/lines", linesRouter);
router.use("/stats", statsRouter);
router.use("/metrics", metricsRouter);
router.use("/ranking", rankingRouter);
router.use("/monthly-share", monthlyShareRouter);

export default router;
