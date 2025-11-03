import { Router } from "express";
import { getLines } from "../services/data-store.js";

const router = Router();

router.get("/", (req, res) => {
  const lines = getLines();
  res.json(lines);
});

export default router;
