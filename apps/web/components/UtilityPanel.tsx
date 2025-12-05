'use client';

export function UtilityPanel() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Local Utilities
            </h3>

            <div className="space-y-4">
                {/* Price Tracker */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            📊 Price Tracker
                        </h4>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Eggs (10)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Rs. 450</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Rice (1kg)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Rs. 180</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-300">Coconut (1)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Rs. 120</span>
                        </div>
                    </div>
                </div>

                {/* Fuel Status */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            ⛽ Fuel Status
                        </h4>
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            Available
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Main Street Pump - No queue (Updated 10m ago)
                    </p>
                </div>

                {/* Power Status */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                            ⚡ Power Status
                        </h4>
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            Normal
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        No outages reported in your area
                    </p>
                </div>

                {/* Song of the Day */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        🎵 Song of the Day
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Vote for today's local anthem!
                    </p>
                    <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-900 dark:text-white">Song A</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">45%</span>
                            </div>
                        </button>
                        <button className="w-full text-left px-3 py-2 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-900 dark:text-white">Song B</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">55%</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
