import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// @route   GET /api/market-cap
// @desc    Get top cryptocurrencies by market cap
// @access  Public
router.get('/market-cap', async (req: Request, res: Response) => {
  const page = req.query.page || '1';
  const per_page = req.query.per_page || '100';

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page,
        page,
        sparkline: false,
      },
    });
    console.log(`Fetched market cap data response:`, response.data);

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Error fetching market data:', error.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

export default router;
