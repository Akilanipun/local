'use client';

import { useState, useEffect } from 'react';
import { useLocation } from './LocationProvider';
import { NewsPost } from './NewsPost';

interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    timestamp: string;
    location: { lat: number; lng: number };
    verified: boolean;
    commentCount: number;
}

export function NewsFeed() {
    const { location } = useLocation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch posts from API based on location
        // For now, mock data
        setTimeout(() => {
            setPosts([
                {
                    id: '1',
                    title: 'New Community Center Opening',
                    content: 'The new community center on Main Street will open next week with free activities for all ages.',
                    author: 'City Council',
                    timestamp: new Date().toISOString(),
                    location: location!,
                    verified: true,
                    commentCount: 12,
                },
                {
                    id: '2',
                    title: 'Local Market Price Update',
                    content: 'Fresh vegetables at the morning market are 15% cheaper this week due to good harvest.',
                    author: 'Market Association',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    location: location!,
                    verified: true,
                    commentCount: 8,
                },
            ]);
            setLoading(false);
        }, 1000);
    }, [location]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    News Feed
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Within 10km
                </span>
            </div>

            {posts.map((post) => (
                <NewsPost key={post.id} post={post} />
            ))}
        </div>
    );
}
