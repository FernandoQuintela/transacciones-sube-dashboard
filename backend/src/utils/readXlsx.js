import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lee un archivo xlsx y devuelve un array de filas.
 * @param {string} relativePath ruta relativa al proyecto (ej. "./data/subte_2025.xlsx")
 */
export function readXlsx(relativePath) {
  const absolutePath = path.resolve(__dirname, "..", "..", relativePath);
  const workbook = xlsx.readFile(absolutePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet);
  return json;
}

