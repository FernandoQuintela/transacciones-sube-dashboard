import { loadTransportData } from "./import.service.js";

const { allData, subteData } = loadTransportData();

export function getAllStats() {
  return subteData;
}

export function getLines() {
  const set = new Set();
  subteData.forEach((item) => {
    if (item.line) set.add(item.line);
  });
  return Array.from(set).map((code, index) => ({
    id: index + 1,
    code,
    name: mapLineName(code),
    mode: code === "PM" ? "premetro" : "subte",
  }));
}

export function getAllTransportData() {
  return allData;
}

function mapLineName(code) {
  const names = {
    A: "Línea A",
    B: "Línea B",
    C: "Línea C",
    D: "Línea D",
    E: "Línea E",
    H: "Línea H",
    PM: "Premetro",
  };
  return names[code] || code;
}
