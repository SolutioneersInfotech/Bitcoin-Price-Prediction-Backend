
import express from "express";
import { getForecast } from "../controllers/technicalIndicators";
import { forecast } from "../controllers/forecast";

const router = express.Router();

router.get("/forecast", forecast);
export default router;
