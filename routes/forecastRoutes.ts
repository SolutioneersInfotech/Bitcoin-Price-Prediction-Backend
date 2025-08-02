


import express from "express";
import { getBitcoinForecast } from "../controllers/forecastController";


const router = express.Router();

router.get("/forecast", getBitcoinForecast);


export default router