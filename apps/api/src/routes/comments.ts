import { Router, Response } from 'express';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { aiService } from '../services/ai.service';

const router = Router();

// Get comments for a post (only if user has contributed)
router.get('/:postId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { postId } = req.params;

        // Check if user has contributed to this post
        const contribution = await pool.query(
            'SELECT * FROM user_post_contributions WHERE user_id = $1 AND post_id = $2',
            [req.user!.id, postId]
        );

        if (contribution.rows.length === 0) {
            return res.status(403).json({
                error: 'You must contribute a comment before viewing others',
                requiresContribution: true
            });
        }

        // Get approved comments
        const comments = await pool.query(
            `SELECT c.id, c.content, c.created_at, u.name as author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1 AND c.ai_moderation_status = 'approved'
       ORDER BY c.created_at DESC`,
            [postId]
        );

        res.json({ comments: comments.rows });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Post a comment (Key & Peele feature)
router.post('/:postId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { postId } = req.params;
        const { content, language = 'en' } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        // AI Moderation
        const moderation = await aiService.moderateContent(content, language);

        // Insert comment
        const commentResult = await pool.query(
            `INSERT INTO comments (post_id, user_id, content, ai_moderation_status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [postId, req.user!.id, content, moderation.approved ? 'approved' : 'rejected']
        );

        // Record contribution (allows user to see other comments)
        await pool.query(
            `INSERT INTO user_post_contributions (user_id, post_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, post_id) DO NOTHING`,
            [req.user!.id, postId]
        );

        // Now get all comments for this post
        const comments = await pool.query(
            `SELECT c.id, c.content, c.created_at, u.name as author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1 AND c.ai_moderation_status = 'approved'
       ORDER BY c.created_at DESC`,
            [postId]
        );

        res.status(201).json({
            comment: commentResult.rows[0],
            allComments: comments.rows,
            moderation: {
                status: moderation.approved ? 'approved' : 'rejected',
            }
        });
    } catch (error) {
        console.error('Post comment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
