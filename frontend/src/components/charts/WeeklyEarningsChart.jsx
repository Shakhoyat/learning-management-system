import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const WeeklyEarningsChart = ({ data }) => {
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
                Weekly Earnings (Last 4 Weeks)
            </h4>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="week"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
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
                        labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                                return payload[0].payload.fullWeek;
                            }
                            return label;
                        }}
                    />
                    <Legend />
                    <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="#6366f1"
                        fillOpacity={1}
                        fill="url(#colorEarnings)"
                        name="Earnings"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyEarningsChart;
