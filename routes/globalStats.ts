// routes/globalStats.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

router.get('/global', async (_req: Request, res: Response) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/global');
        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching global stats:', error.message);
        res.status(500).json({ error: 'Failed to fetch global stats' });
    }
});

export default router;
