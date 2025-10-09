import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const DailyEarningsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
                <p>No data available</p>
            </div>
        );
    }

    return (
        <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">
                Daily Earnings (Last 14 Days)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize: '11px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                        formatter={(value, name) => {
                            if (name === 'earnings') return [`$${value.toFixed(2)}`, 'Earnings'];
                            return [value, 'Sessions'];
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="earnings"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]}
                        name="Earnings"
                    />
                    <Bar
                        dataKey="sessions"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        name="Sessions"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyEarningsChart;
