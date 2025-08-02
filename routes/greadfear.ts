import { Request, Response, Router } from 'express';
import { calculateGreedFear } from '../controllers/greadFear';

const router = Router();

router.get('/api/greed-fear', async (req: Request, res: Response) => {
    try {
        const data = await calculateGreedFear();
        res.json(data);
    } catch (error: any) {
        console.error('Greed & Fear error:', error.message);
        res.status(500).json({ error: 'Failed to fetch market data' });
    }
});

export default router;
