import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LINES_PATH = path.resolve(__dirname, "../../data/precomputed/lines.json");

let cache = null;
function getLines() {
  if (!cache) {
    const raw = fs.readFileSync(LINES_PATH, "utf8");
    cache = JSON.parse(raw);
  }
  return cache;
}

router.get("/", (req, res) => {
  try {
    res.json(getLines());
  } catch (e) {
    res.status(500).json({ error: "No pude leer lines.json" });
  }
});

export default router;
