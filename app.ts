import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bitcoinRoutes from "./routes/bitcoinRoutes";
import forecastRoutes from "./routes/forecastRoutes";
import forecastRouter from "./routes/forecast";
import greedFearRoute from "./routes/greadfear";
import marketCapRoute from "./routes/marketcap";
import globalStatsRoutes from "./routes/globalStats";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/bitcoin", bitcoinRoutes);
app.use("/api", forecastRoutes);
app.use("/api/forcast", forecastRouter);
app.use(greedFearRoute);
app.use('/api', marketCapRoute)
app.use('/api', globalStatsRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
