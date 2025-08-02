



import axios from "axios";
import { calculateIndicators } from "../utils/indicators";

// Type definition for forecast entry
interface ForecastEntry {
    time: number;
    forecastedPrice: number;
}

// Timeframes mapping (use lowercase intervals where possible)
const timeframes: Record<string, string> = {
    "4h": "4h",
    "1d": "1d",
    "1w": "1w",
    "1m": "1M" // '1M' is monthly on Binance — correct capitalization
};

// Forecast generator based on last price
function generateForecastData(
    analysis: any,
    candles: any[],
    interval: string
): ForecastEntry[] {
    const futureSteps = 10;
    const stepMap = {
        "4h": 4 * 60 * 60 * 1000,
        "1d": 24 * 60 * 60 * 1000,
        "1w": 7 * 24 * 60 * 60 * 1000,
        "1m": 30 * 24 * 60 * 60 * 1000
    };

    const step = stepMap[interval as keyof typeof stepMap] || stepMap["1d"];
    const lastTimestamp = candles[candles.length - 1].time;
    const forecastedPrices: ForecastEntry[] = [];

    let price = analysis.currentPrice || candles[candles.length - 1].close;

    for (let i = 1; i <= futureSteps; i++) {
        const time = lastTimestamp + i * step;
        const noise = Math.random() * 0.02 - 0.01; // ±1%
        price = price * (1 + 0.005 + noise); // upward drift with noise
        forecastedPrices.push({
            time,
            forecastedPrice: +price.toFixed(2)
        });
    }

    return forecastedPrices;
}

export async function getForecast(symbol: string, selectedTimeframe?: string) {
    const result: any = {};

    if (selectedTimeframe) {
        const interval = timeframes[selectedTimeframe];
        if (!interval) throw new Error("Invalid timeframe");

        const candles = await getCandlestickData(symbol, interval);
        const analysis = calculateIndicators(candles);
        const forecast = generateForecastData(analysis, candles, selectedTimeframe);

        result[selectedTimeframe] = {
            analysis,
            forecast
        };
    } else {
        for (const [label, interval] of Object.entries(timeframes)) {
            try {
                const candles = await getCandlestickData(symbol, interval);
                const analysis = calculateIndicators(candles);
                const forecast = generateForecastData(analysis, candles, label);

                result[label] = {
                    analysis,
                    forecast
                };
            } catch (err) {
                console.error(`❌ Error for ${label}:`, err);
                result[label] = { error: "Failed to fetch data" };
            }
        }
    }

    return result;
}

async function getCandlestickData(symbol: string, interval: string) {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=200`;

    try {
        const { data } = await axios.get(url);
        return data.map((candle: any) => ({
            time: candle[0],
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5])
        }));
    } catch (error) {
        console.error("🔥 Binance API error:", error);
        throw new Error("Failed to fetch candlestick data");
    }
}
