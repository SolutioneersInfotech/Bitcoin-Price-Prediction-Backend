import axios from "axios";
import regression from "regression";
import { Request, Response } from "express";

export const getBitcoinForecast = async (_req: Request, res: Response) => {
    try {
        // Fetch historical Bitcoin price data (last 30 days)
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart",
            // "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30",
            {
                params: {
                    vs_currency: "usd",
                    days: 30,
                },
            }
        );

        const data = response.data as { prices: [number, number][] };
        let prices = data.prices; // Format: [[timestamp, price], ...]

        // Convert timestamp to readable date and format for processing
        const formattedPrices = prices.map(([timestamp, price]) => ({
            date: new Date(timestamp).toISOString().split("T")[0], // YYYY-MM-DD
            price: price,
        }));

        // Prepare data for linear regression
        const regressionData: [number, number][] = formattedPrices.map(
            (point, index) => [index, point.price]
        );

        // Run linear regression
        const result = regression.linear(regressionData);

        // Predict next 7 days
        const forecast: { date: string; predictedPrice: number }[] = [];
        const lastDate = new Date(formattedPrices[formattedPrices.length - 1].date);

        for (let i = 1; i <= 7; i++) {
            const futureIndex = regressionData.length + (i - 1);
            const predictedPrice = result.predict(futureIndex)[1];

            // Create future date (lastDate + i days)
            const futureDate = new Date(lastDate);
            futureDate.setDate(futureDate.getDate() + i);

            forecast.push({
                date: futureDate.toISOString().split("T")[0], // format to YYYY-MM-DD
                predictedPrice: parseFloat(predictedPrice.toFixed(2)),
            });
        }

        // console.log("Forecast data:", forecast);

        res.json({ forecast });
    } catch (err) {
        console.error("Forecast error:", err);
        res.status(500).json({ message: "Error generating forecast" });
    }
}; 
