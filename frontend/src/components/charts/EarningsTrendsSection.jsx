import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import WeeklyEarningsChart from './WeeklyEarningsChart';
import DailyEarningsChart from './DailyEarningsChart';
import PaymentStatusChart from './PaymentStatusChart';
import ChartInsights from './ChartInsights';

const EarningsTrendsSection = ({ chartData }) => {
    if (!chartData) {
        return null;
    }

    return (
        <div className="px-4 sm:px-0 mb-8">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                    <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                    Earnings Trends
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Weekly Earnings Chart */}
                    <WeeklyEarningsChart data={chartData.weeklyData} />

                    {/* Payment Status Distribution */}
                    <PaymentStatusChart data={chartData.statusData} />
                </div>

                {/* Daily Earnings Bar Chart */}
                <DailyEarningsChart data={chartData.dailyData} />

                {/* Chart Insights */}
                <ChartInsights
                    weeklyData={chartData.weeklyData}
                    dailyData={chartData.dailyData}
                />
            </div>
        </div>
    );
};

export default EarningsTrendsSection;
