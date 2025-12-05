'use client';

import { useState, useEffect } from 'react';

interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
}

export function CommentSection({ postId }: { postId: string }) {
    const [hasContributed, setHasContributed] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);

        // TODO: Send to API for AI moderation
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock: Add comment and reveal others
        const comment: Comment = {
            id: Date.now().toString(),
            author: 'You',
            content: newComment,
            timestamp: new Date().toISOString(),
        };

        setComments([
            comment,
            {
                id: '1',
                author: 'John Doe',
                content: 'This is great news for our community!',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
            {
                id: '2',
                author: 'Jane Smith',
                content: 'Finally! We have been waiting for this.',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
        ]);

        setHasContributed(true);
        setNewComment('');
        setSubmitting(false);
    };

    if (!hasContributed) {
        return (
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6">
                <div className="flex items-start space-x-3 mb-4">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            Share Your Thoughts First
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                            To view comments, you must contribute your own perspective first. This ensures authentic engagement.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="What do you think about this?"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
                        rows={3}
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="mt-3 w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {submitting ? 'Submitting...' : 'Submit & View Comments'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Comments ({comments.length})
            </h4>

            {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                            {comment.author}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(comment.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                        {comment.content}
                    </p>
                </div>
            ))}
        </div>
    );
}
