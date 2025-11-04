import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE = path.resolve(__dirname, "../../data/precomputed/stats_by_line");

const caches = new Map();
function getStatsFor(line) {
  const code = String(line || "").toUpperCase();
  if (!code) return null;
  if (!caches.has(code)) {
    const file = path.join(BASE, `${code}.json`);
    const raw = fs.readFileSync(file, "utf8");
    caches.set(code, JSON.parse(raw));
  }
  return caches.get(code);
}

router.get("/", (req, res) => {
  try {
    const { line } = req.query;
    const rows = getStatsFor(line);
    if (!rows) return res.status(400).json({ error: "Falta ?line=" });
    res.json(rows);
  } catch (e) {
    res.status(404).json({ error: "Línea no encontrada o archivo faltante" });
  }
});

export default router;
