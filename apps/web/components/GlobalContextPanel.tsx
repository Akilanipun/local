'use client';

export function GlobalContextPanel() {
    const globalNews = [
        { title: 'National Budget 2025 Announced', source: 'Daily News' },
        { title: 'Cricket Team Wins Series', source: 'Sports Today' },
        { title: 'New Education Policy Released', source: 'Education Weekly' },
        { title: 'Tech Summit in Colombo', source: 'Tech Lanka' },
        { title: 'Weather Alert: Heavy Rains Expected', source: 'Met Department' },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🌍 National Headlines
            </h3>

            <div className="space-y-3">
                {globalNews.map((news, index) => (
                    <div
                        key={index}
                        className="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {news.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {news.source}
                        </p>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                Read-only: Focus on your local news
            </p>
        </div>
    );
}
