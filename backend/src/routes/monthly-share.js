import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const filePath = path.join(__dirname, "..", "data", "precomputed", "monthlyShare.json");

router.get("/", (_req, res) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "milanesa no disponible" });
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Esperado por el frontend: [{ line, value, percent, monthLabel }]
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Error leyendo monthlyShare.json" });
  }
});

router.get("/debug", (_req, res) => {
  return res.json({
    from: "monthly-share.js ACTUAL",
    filePath,
    exists: fs.existsSync(filePath),
    __dirname,
    cwd: process.cwd(),
  });
});

export default router;
