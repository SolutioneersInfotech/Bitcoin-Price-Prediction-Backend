import { getForecast } from "./technicalIndicators";

export const forecast = async (req, res) => {
    // console.log("🔍 Forecast request received:", req.query);
    try {
        const symbol = (req.query.symbol as string)?.toUpperCase() || "BTCUSDT";
        const timeframe = req.query.timeframe as string | undefined;

        // Optional: Validate timeframe here if you only support limited options
        const allowedTimeframes = ["4h", "1d", "1w", "1m", "1M"];
        if (timeframe && !allowedTimeframes.includes(timeframe)) {
            return res.status(400).json({ error: `Invalid timeframe "${timeframe}". Allowed: ${allowedTimeframes.join(", ")}` });
        }

        const data = await getForecast(symbol, timeframe);
        res.status(200).json(data);
    } catch (err: any) {
        console.error("❌ Error in /forecast:", err.message || err);
        res.status(500).json({ error: "Server error: " + (err.message || "Unknown error") });
    }
}

