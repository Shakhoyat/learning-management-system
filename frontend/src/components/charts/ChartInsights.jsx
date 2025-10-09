import React from 'react';

const ChartInsights = ({ weeklyData, dailyData }) => {
    if (!weeklyData || !dailyData) {
        return null;
    }

    const bestWeek = weeklyData.length > 0
        ? Math.max(...weeklyData.map(w => w.earnings))
        : 0;

    const averageDaily = dailyData.length > 0
        ? dailyData.reduce((sum, d) => sum + d.earnings, 0) / dailyData.length
        : 0;

    const totalSessions = weeklyData.reduce((sum, w) => sum + w.sessions, 0);

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-600 font-medium">Best Week</p>
                <p className="text-2xl font-bold text-indigo-900 mt-1">
                    ${bestWeek.toFixed(2)}
                </p>
                <p className="text-xs text-indigo-600 mt-1">Highest weekly earning</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Average Daily</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                    ${averageDaily.toFixed(2)}
                </p>
                <p className="text-xs text-green-600 mt-1">Last 14 days average</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium">Total Sessions</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                    {totalSessions}
                </p>
                <p className="text-xs text-purple-600 mt-1">Last 4 weeks</p>
            </div>
        </div>
    );
};

export default ChartInsights;
