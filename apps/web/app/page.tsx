'use client';

import { useEffect, useState } from 'react';
import { NewsFeed } from '@/components/NewsFeed';
import { UtilityPanel } from '@/components/UtilityPanel';
import { GlobalContextPanel } from '@/components/GlobalContextPanel';

export default function Home() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                        Local
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Your trusted source for verified local news
                    </p>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - News Feed */}
                    <div className="lg:col-span-2">
                        <NewsFeed />
                    </div>

                    {/* Right Column - Utilities & Global News */}
                    <div className="space-y-6">
                        <UtilityPanel />
                        <GlobalContextPanel />
                    </div>
                </div>
            </div>
        </main>
    );
}
