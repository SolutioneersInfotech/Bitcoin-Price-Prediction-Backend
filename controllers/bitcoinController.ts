// import { Request, Response } from "express";
// import BitcoinPrice from "../models/BitcoinPrice";

// export const getBitcoinPrices = async (_req: Request, res: Response) => {
//   try {
//     const prices = await BitcoinPrice.find().sort({ date: 1 });
//     res.json(prices);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };
// export const addBitcoinPrice = async (req: Request, res: Response) => {
//   try {
//     const { date, price } = req.body
//     const newEntry = new BitcoinPrice({ date, price })
//     await newEntry.save()
//     res.status(201).json({ message: "Bitcoin price added successfully", data: newEntry })
//   } catch (err) {
//     res.status(400).json({ message: "Invalid data", error: err })
//   }
// }
// controllers/bitcoinController.ts
// import { Request, Response } from "express"
// import fetch from "node-fetch"

// export const getLiveBitcoinPrice = async (req: Request, res: Response) => {
//   try {
//     const response = await fetch(
//       "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
//       // "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30"

//       // "https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/bitcoin_price_usd.csv"
//     )
//     const data = (await response.json()) as { bitcoin: { usd: number } }
//     res.json({ price: data.bitcoin.usd })
//   } catch (error) {
//     console.error("Error fetching price:", error)
//     res.status(500).json({ error: "Failed to fetch Bitcoin price" })
//   }
// }

// import fetch from "node-fetch"

// export const getLiveBitcoinPrice = async () => {
//   const response = await fetch(
//     "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30"
//   )

//   const data = await response.json() as { prices: [number, number][] }

//   return data.prices.map((entry: [number, number]) => ({
//     timestamp: new Date(entry[0]).toISOString().split("T")[0],
//     value: entry[1],
//     series: "bitcoin"
//   }))
// }



import { Request, Response } from "express";
import axios from "axios";

export const getLast7DaysBitcoinPrices = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30",

      {
        params: {
          vs_currency: "usd",
          days: 30,
        },
      }
    );

    const data = response.data as { prices: [number, number][] };
    const prices = data.prices.map((entry: [number, number]) => {
      return {
        date: new Date(entry[0]).toISOString().split("T")[0], // YYYY-MM-DD
        price: entry[1],
      };
    });

    res.json({ prices });
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    res.status(500).json({ error: "Failed to fetch historical Bitcoin prices" });
  }
};


