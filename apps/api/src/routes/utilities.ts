import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get price tracker data for area
router.get('/prices', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, radius = 10000 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Location required' });
        }

        const result = await pool.query(
            `SELECT item_name, AVG(price) as avg_price, COUNT(*) as report_count
       FROM price_tracker
       WHERE ST_DWithin(
         location,
         ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         $3
       )
       AND created_at > NOW() - INTERVAL '7 days'
       GROUP BY item_name
       ORDER BY item_name`,
            [lng, lat, radius]
        );

        res.json({ prices: result.rows });
    } catch (error) {
        console.error('Get prices error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit price data
router.post('/prices', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { itemName, price, lat, lng } = req.body;

        if (!itemName || !price || !lat || !lng) {
            return res.status(400).json({ error: 'All fields required' });
        }

        await pool.query(
            `INSERT INTO price_tracker (user_id, item_name, price, location)
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography)`,
            [req.user!.id, itemName, price, lng, lat]
        );

        res.status(201).json({ message: 'Price submitted successfully' });
    } catch (error) {
        console.error('Submit price error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get today's poll
router.get('/poll', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng } = req.query;

        const pollResult = await pool.query(
            `SELECT * FROM polls WHERE poll_date = CURRENT_DATE ORDER BY created_at DESC LIMIT 1`
        );

        if (pollResult.rows.length === 0) {
            return res.json({ poll: null });
        }

        const poll = pollResult.rows[0];

        const optionsResult = await pool.query(
            `SELECT * FROM poll_options WHERE poll_id = $1`,
            [poll.id]
        );

        // Get vote counts for this zone
        const votesResult = await pool.query(
            `SELECT option_id, COUNT(*) as vote_count
       FROM poll_votes
       WHERE poll_id = $1
       ${lat && lng ? `AND ST_DWithin(
         location,
         ST_SetSRID(ST_MakePoint($2, $3), 4326)::geography,
         10000
       )` : ''}
       GROUP BY option_id`,
            lat && lng ? [poll.id, lng, lat] : [poll.id]
        );

        const voteCounts: { [key: number]: number } = {};
        votesResult.rows.forEach(row => {
            voteCounts[row.option_id] = parseInt(row.vote_count);
        });

        const options = optionsResult.rows.map(opt => ({
            ...opt,
            votes: voteCounts[opt.id] || 0,
        }));

        res.json({ poll: { ...poll, options } });
    } catch (error) {
        console.error('Get poll error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Vote on poll
router.post('/poll/:pollId/vote', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { pollId } = req.params;
        const { optionId, lat, lng } = req.body;

        if (!optionId || !lat || !lng) {
            return res.status(400).json({ error: 'Option and location required' });
        }

        await pool.query(
            `INSERT INTO poll_votes (poll_id, option_id, user_id, location)
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography)
       ON CONFLICT (poll_id, user_id) DO UPDATE SET option_id = $2`,
            [pollId, optionId, req.user!.id, lng, lat]
        );

        res.json({ message: 'Vote recorded' });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
