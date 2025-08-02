

import express from "express";
import { getLast7DaysBitcoinPrices } from "../controllers/bitcoinController";

const router = express.Router();

router.get("/history7", getLast7DaysBitcoinPrices);

export default router;