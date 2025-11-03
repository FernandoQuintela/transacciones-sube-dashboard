import { Router } from "express";
import linesRouter from "./lines.js";
import statsRouter from "./stats.js";
import metricsRouter from "./metrics.js";

const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Hola Fer, backend vivo." });
});

router.use("/lines", linesRouter);
router.use("/stats", statsRouter);
router.use("/metrics", metricsRouter);

export default router;
