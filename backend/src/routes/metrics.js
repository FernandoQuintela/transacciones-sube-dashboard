import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo generado por tools/precompute.js
const METRICS_PATH = path.resolve(__dirname, "../../data/precomputed/metrics.json");

let cache = null;
function getMetrics() {
  if (!cache) {
    const raw = fs.readFileSync(METRICS_PATH, "utf8");
    cache = JSON.parse(raw);
  }
  return cache;
}

router.get("/", (req, res) => {
  try {
    res.json(getMetrics());
  } catch {
    res.status(500).json({ error: "No pude leer metrics.json" });
  }
});

export default router;
