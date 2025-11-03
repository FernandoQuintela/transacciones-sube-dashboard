import { readXlsx } from "../utils/readXlsx.js";

export function loadTransportData() {
  const rows = readXlsx("./data/subte_2025.xlsx");
  console.log("Filas leídas del Excel:", rows.length);

  const allData = rows.map((row) => {
    const tipo =
      (row.TIPO_TRANSPORTE ||
        row["TIPO TRANSPORTE"] ||
        "").toString().toUpperCase();

    const lineaRaw =
      row.LINEA ||
      row["LINEA "] ||
      row.linea ||
      "";

    const dateRaw =
      row.DIA_TRANSPORTE ||
      row["DIA TRANSPORTE"] ||
      row.DIA ||
      row["DIA "] ||
      null;

    return {
      date: formatDate(dateRaw),
      line: normalizeLineName(lineaRaw),
      rawLine: lineaRaw,              
      mode: tipo,                     
      passengers: Number(row.CANTIDAD || 0),
      source: "subte_2025.xlsx",
      amba: row.AMBA || row.amba || null,
    };
  }).filter((item) => item.date && item.passengers >= 0);

  // derivamos SUBTE desde allData
  const subteData = allData.filter((item) => item.mode === "SUBTE");

  console.log("Filas SUBTE:", subteData.length);

  return {
    allData,
    subteData,
  };
}

function normalizeLineName(value) {
  if (!value) return null;
  const v = value.toString().toUpperCase().trim();

  if (v === "LINEA_A" || v === "LINEA A") return "A";
  if (v === "LINEA_B" || v === "LINEA B") return "B";

  if (v.includes("LINEA SUBTE A")) return "A";
  if (v.includes("LINEA SUBTE B")) return "B";
  if (v.includes("LINEA SUBTE C") || v.includes("AMARILLA")) return "C";
  if (v.includes("LINEA SUBTE D") || v.includes("VERDE")) return "D";
  if (v.includes("LINEA SUBTE E")) return "E";
  if (v.includes("LINEA SUBTE H")) return "H";
  if (v.includes("PREMETRO")) return "PM";

  return null;
}

function formatDate(value) {
  if (!value) return null;
  if (typeof value === "string" && value.includes("/")) {
    const [d, m, y] = value.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  if (typeof value === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + value * 86400000);
    return jsDate.toISOString().slice(0, 10);
  }
  return null;
}
