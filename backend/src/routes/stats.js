import { Router } from "express";
import { getAllStats } from "../services/data-store.js";

const router = Router();

router.get("/", (req, res) => {
  const { line, from, to } = req.query;

  let result = getAllStats();

  if (line) {
    result = result.filter((item) => item.line === line);
  }

  if (from) {
    result = result.filter((item) => item.date >= from);
  }

  if (to) {
    result = result.filter((item) => item.date <= to);
  }

  res.json(result);
});

export default router;
