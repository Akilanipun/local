import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import { aiService } from '../services/ai.service';

const router = Router();

// Create post (Verified users and Admins only)
router.post('/', authenticate, requireRole(['verified', 'admin']), async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, lat, lng, postType = 'news', language = 'en' } = req.body;

        if (!title || !content || !lat || !lng) {
            return res.status(400).json({ error: 'Title, content, and location are required' });
        }

        // AI Moderation
        const moderation = await aiService.moderateContent(content, language);

        const result = await pool.query(
            `INSERT INTO posts (user_id, title, content, location, post_type, verified, ai_moderation_status, ai_moderation_notes)
       VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography, $6, $7, $8, $9)
       RETURNING *`,
            [
                req.user!.id,
                title,
                content,
                lng,
                lat,
                postType,
                req.user!.role === 'verified' || req.user!.role === 'admin',
                moderation.approved ? 'approved' : moderation.flagged ? 'flagged' : 'rejected',
                moderation.reason || null,
            ]
        );

        res.status(201).json({
            post: result.rows[0],
            moderation: {
                status: moderation.approved ? 'approved' : moderation.flagged ? 'flagged' : 'rejected',
                message: moderation.approved ? 'Post published successfully' : 'Post flagged for review',
            }
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
