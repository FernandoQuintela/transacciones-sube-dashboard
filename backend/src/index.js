import express from "express";
import cors from "cors";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRECOMPUTED_DIR = path.join(__dirname, "..", "data", "precomputed");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// util para leer JSON seguro
function readJsonSafe(p) {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

// ---------- RUTAS API ----------

// Líneas normalizadas (id, code, name, mode)
app.get("/api/lines", (_req, res) => {
  const p = path.join(PRECOMPUTED_DIR, "lines.json");
  const data = readJsonSafe(p);
  if (!data) return res.status(500).json({ error: "lines.json no disponible" });
  res.json(data);
});

// Serie temporal por línea (daily o monthly según)
// Espera archivos: precomputed/stats_by_line/D.json, etc.
app.get("/api/stats", (req, res) => {
  const { line } = req.query;
  if (!line) return res.status(400).json({ error: "Falta query ?line=" });

  const code = String(line).toUpperCase();
  const p = path.join(PRECOMPUTED_DIR, "stats_by_line", `${code}.json`);
  const data = readJsonSafe(p);
  if (!data) return res.status(404).json({ error: `No hay datos para línea ${code}` });

  res.json(data);
});

// Métricas agregadas (totales dataset, AMBA, por modo, top colectivo, etc.)
app.get("/api/metrics", (_req, res) => {
  const p = path.join(PRECOMPUTED_DIR, "metrics.json");
  const data = readJsonSafe(p);
  if (!data) return res.status(500).json({ error: "metrics.json no disponible" });
  res.json(data);
});

// Ranking total por línea (espera [{ line, total }])
app.get("/api/ranking", (_req, res) => {
  const p = path.join(PRECOMPUTED_DIR, "ranking.json");
  const data = readJsonSafe(p);
  if (!data) return res.status(404).json({ error: "ranking.json no disponible" });
  res.json(data);
});

// Participación por línea del último mes (espera [{ line, value, percent, monthLabel }])
app.get("/api/monthly-share", (_req, res) => {
  const p = path.join(PRECOMPUTED_DIR, "monthlyShare.json");
  const raw = readJsonSafe(p);
  if (!raw) return res.status(500).json({ error: "monthlyShare.json no disponible" });

  const month = raw.month || null;
  const monthLabel = (() => {
    if (!month) return "";
    const [y, m] = month.split("-");
    const nombres = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const idx = Math.max(0, Math.min(11, (parseInt(m, 10) || 1) - 1));
    return `${nombres[idx]} ${y}`;
  })();

  const out = (raw.data || []).map(d => ({
    line: d.line,
    value: d.total,                         // 🔁 total → value
    percent: +(Number(d.share || 0) * 100).toFixed(1),
    monthLabel
  }));

  return res.json(out);
});

// Healthcheck para Render
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Raíz
app.get("/", (_req, res) => {
  res.json({
    message: "API Dashboard SUBE (precomputed). Probá /api/lines, /api/stats?line=D, /api/metrics",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);
});

// Ranking total por línea (array de { line, total })
app.get("/api/ranking", (_req, res) => {
  const p = path.join(PRECOMPUTED_DIR, "ranking.json");
  const data = readJsonSafe(p);
  if (!data) return res.status(500).json({ error: "ranking.json no disponible" });
  res.json(data);
});

