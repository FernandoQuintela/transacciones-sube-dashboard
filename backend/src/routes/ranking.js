import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// backend/data/precomputed/ranking.json
const filePath = path.join(__dirname, "..", "data", "precomputed", "ranking.json");

router.get("/", (_req, res) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "ranking.json no disponible" });
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Esperado por el frontend: [{ line, total }]
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Error leyendo ranking.json" });
  }
});

export default router;
