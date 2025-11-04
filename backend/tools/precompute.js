import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

// Ubicación real del archivo actual (ESM no tiene __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// data/ está un nivel arriba de tools/
const dataDir = path.join(__dirname, "..", "data");
const xlsxPath = path.join(dataDir, "subte_2025.xlsx");

// Salidas
const outDir = path.join(dataDir, "precomputed");
const outStatsByLine = path.join(outDir, "stats_by_line");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(outStatsByLine, { recursive: true });

// ---------- helpers ----------
function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

// Convierte varios formatos a YYYY-MM-DD
function parseDateISO(v) {
  if (v == null) return null;

  // 1) Número Excel (serie): usar parse_date_code
  if (typeof v === "number") {
    const dec = XLSX.SSF.parse_date_code(v);
    if (!dec) return null;
    const y = dec.y;
    const m = dec.m;
    const d = dec.d;
    return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
  }

  // 2) Date object
  if (v instanceof Date && !isNaN(v)) {
    const y = v.getFullYear();
    const m = v.getMonth() + 1;
    const d = v.getDate();
    return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
  }

  // 3) String: soportar dd/mm/yyyy, d/m/yyyy, yyyy-mm-dd
  if (typeof v === "string") {
    const s = v.trim();

    // yyyy-mm-dd
    const mIso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
    if (mIso) {
      const y = Number(mIso[1]);
      const m = Number(mIso[2]);
      const d = Number(mIso[3]);
      return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
    }

    // dd/mm/yyyy o d/m/yyyy
    const mLat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
    if (mLat) {
      const d = Number(mLat[1]);
      const m = Number(mLat[2]);
      const y = Number(mLat[3]);
      return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
    }
  }

  return null; // si no reconoce, se descarta la fila
}

// ---------- lectura ----------
const wb = XLSX.readFile(xlsxPath);
const sheet = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

// Campos del dataset (ajustar si cambian los nombres de columna)
const COL = {
  DIA: "DIA_TRANSPORTE",
  LINEA: "LINEA",
  TIPO: "TIPO_TRANSPORTE",
  AMBA: "AMBA",
  CANT: "CANTIDAD",
};

let skippedDate = 0;
let totalRows = 0;

// Pre-agrupadores
const linesSet = new Set();
const byLine = {};           // { A: [ {date, passengers}, ... ] }
const ranking = {};          // { A: total }
const byMode = {};           // { SUBTE: total, COLECTIVO: total, ... }
let ambaTotal = 0;

for (const r of rows) {
  totalRows++;
  const tipo = r[COL.TIPO];
  const lineaRaw = r[COL.LINEA];
  const cant = Number(r[COL.CANT]) || 0;

  // Solo transporte SUBTE para las líneas
  const isSubte = String(tipo || "").toUpperCase().includes("SUBTE");
  // También puede venir como "LIN_VERDE_D", "LINEA SUBTE D", etc.
  // Normalizamos códigos A/B/C/D/E/H/PM si existen
  let code = null;
  if (isSubte && lineaRaw) {
    const s = String(lineaRaw).toUpperCase();
    if (/\bA\b/.test(s) || s.includes("LINEA A")) code = "A";
    else if (/\bB\b/.test(s) || s.includes("LINEA B")) code = "B";
    else if (/\bC\b/.test(s) || s.includes("LINEA C") || s.includes("AMARILLA_C")) code = "C";
    else if (/\bD\b/.test(s) || s.includes("LINEA D") || s.includes("VERDE_D")) code = "D";
    else if (/\bE\b/.test(s) || s.includes("LINEA E")) code = "E";
    else if (/\bH\b/.test(s) || s.includes("LINEA H")) code = "H";
    else if (s.includes("PREMETRO") || s.includes("PM")) code = "PM";
  }

  // Fecha
  const iso = parseDateISO(r[COL.DIA]);
  if (!iso) {
    skippedDate++;
    continue;
  }

  // AMBA (sumatoria general)
  const av = String(r[COL.AMBA] ?? "").trim().toUpperCase();
  const inAmba = av === "AMBA" || av === "SI" || av === "1" || av === "TRUE";
  if (inAmba) ambaTotal += cant;

  // Totales por modo
  const modoKey = String(tipo || "").trim() || "DESCONOCIDO";
  byMode[modoKey] = (byMode[modoKey] || 0) + cant;

  // Datos por línea de subte
  if (code) {
    linesSet.add(code);
    if (!byLine[code]) byLine[code] = [];
    byLine[code].push({ date: iso, passengers: cant });
    ranking[code] = (ranking[code] || 0) + cant;
  }
}

// Ranking como array ordenado
const rankingArr = Object.entries(ranking)
  .map(([line, total]) => ({ line, total }))
  .sort((a, b) => b.total - a.total);

// Último mes disponible global (entre todas las líneas)
const lastMonth = (() => {
  let max = null;
  Object.values(byLine).forEach(arr => {
    arr.forEach(({ date }) => {
      const m = date.slice(0, 7); // YYYY-MM
      if (!max || m > max) max = m;
    });
  });
  return max;
})();

// Participación por línea en el último mes
const monthlyShare = (() => {
  if (!lastMonth) return [];
  const totales = {};
  let totalMes = 0;

  for (const [line, arr] of Object.entries(byLine)) {
    const suma = arr.reduce((acc, { date, passengers }) => {
      if (date.startsWith(lastMonth)) acc += passengers;
      return acc;
    }, 0);
    totales[line] = suma;
    totalMes += suma;
  }

  return Object.entries(totales)
    .map(([line, total]) => ({
      line,
      total,
      share: totalMes ? total / totalMes : 0,
    }))
    .sort((a, b) => b.total - a.total);
})();

// Top línea de colectivo (nacional)
let topColectivo = null;
{
  // Filtrar solo COLECTIVO y agrupar por código de línea (columna LINEA)
  const colect = rows.filter(r => String(r[COL.TIPO]).toUpperCase() === "COLECTIVO");
  const map = {};
  for (const r of colect) {
    const line = String(r[COL.LINEA] ?? "").trim() || "DESCONOCIDO";
    map[line] = (map[line] || 0) + (Number(r[COL.CANT]) || 0);
  }
  topColectivo = Object.entries(map)
    .map(([line, passengers]) => ({ line, passengers }))
    .sort((a, b) => b.passengers - a.passengers)[0] || null;
}

// Escribir archivos agregados
fs.writeFileSync(path.join(outDir, "lines.json"),
  JSON.stringify(
    Array.from(linesSet)
      .sort()
      .map(code => ({ id: code, code, name: `Línea ${code}`, mode: "subte" }))
  )
);

fs.writeFileSync(path.join(outDir, "ranking.json"),
  JSON.stringify(rankingArr)
);

fs.writeFileSync(path.join(outDir, "monthlyShare.json"),
  JSON.stringify({ month: lastMonth, data: monthlyShare })
);

fs.writeFileSync(path.join(outDir, "metrics.json"),
  JSON.stringify({
    totalPassengers: rows.reduce((a, r) => a + (Number(r[COL.CANT]) || 0), 0),
    ambaTotal,
    byMode,
    topColectivo,
  })
);

// Por línea: escribir stats crudos por día (date, passengers)
for (const [line, arr] of Object.entries(byLine)) {
  // Orden por fecha por prolijidad
  arr.sort((a, b) => a.date.localeCompare(b.date));
  fs.writeFileSync(
    path.join(outStatsByLine, `${line}.json`),
    JSON.stringify(arr)
  );
}

console.log("✔ Precompute listo");
console.log(`  Filas procesadas: ${totalRows} (sin fecha: ${skippedDate})`);
console.log(`  Líneas SUBTE: ${Array.from(linesSet).sort().join(", ")}`);
console.log(`  Último mes detectado: ${lastMonth}`);
console.log(`  Archivos escritos en: ${outDir}`);
