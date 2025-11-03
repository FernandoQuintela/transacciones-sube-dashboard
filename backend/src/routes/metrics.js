import { Router } from "express";
import { getAllTransportData } from "../services/data-store.js";

const router = Router();

router.get("/", (req, res) => {
  const data = getAllTransportData();

  // total país
  const totalPassengers = data.reduce((acc, item) => acc + (item.passengers || 0), 0);

  // por modo
  const byMode = data.reduce((acc, item) => {
    const mode = item.mode || "OTRO";
    acc[mode] = (acc[mode] || 0) + (item.passengers || 0);
    return acc;
  }, {});

  // AMBA solamente (si AMBA == "SI" o 1 o "1")
  const ambaTotal = data
    .filter((item) => {
      const v = (item.amba || "").toString().toUpperCase();
      return v === "SI" || v === "1" || v === "TRUE";
    })
    .reduce((acc, item) => acc + (item.passengers || 0), 0);

  // colectivo más usado (línea de colectivo)
  const colectivos = data.filter((item) => item.mode === "COLECTIVO");
  const colectivoByLine = colectivos.reduce((acc, item) => {
    const key = item.rawLine || "DESCONOCIDA";
    acc[key] = (acc[key] || 0) + (item.passengers || 0);
    return acc;
  }, {});
  const topColectivo = Object.entries(colectivoByLine)
    .sort((a, b) => b[1] - a[1])[0] || null;

  res.json({
    totalPassengers,
    byMode,
    ambaTotal,
    topColectivo: topColectivo
      ? { line: topColectivo[0], passengers: topColectivo[1] }
      : null,
  });
});

export default router;
