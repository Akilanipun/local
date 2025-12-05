import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get geo-fenced feed
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, radius = 10000 } = req.query; // radius in meters (default 10km)

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        // Query posts within radius using PostGIS
        const result = await pool.query(
            `SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.post_type,
        p.verified,
        p.created_at,
        u.name as author,
        u.role as author_role,
        ST_Y(p.location::geometry) as lat,
        ST_X(p.location::geometry) as lng,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id AND c.ai_moderation_status = 'approved') as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE 
        p.ai_moderation_status = 'approved'
        AND ST_DWithin(
          p.location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY p.created_at DESC
      LIMIT 50`,
            [lng, lat, radius]
        );

        res.json({ posts: result.rows });
    } catch (error) {
        console.error('Feed error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
