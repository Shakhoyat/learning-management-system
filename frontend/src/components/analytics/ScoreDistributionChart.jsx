import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import toast from 'react-hot-toast';
import { BarChart3, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ScoreDistributionChart = () => {
    const [loading, setLoading] = useState(true);
    const [distributionData, setDistributionData] = useState(null);
    const [category, setCategory] = useState('overall');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    const categories = [
        { value: 'overall', label: 'Overall' },
        { value: 'quiz', label: 'Quizzes' },
        { value: 'test', label: 'Tests' },
        { value: 'assignment', label: 'Assignments' },
        { value: 'project', label: 'Projects' },
    ];

    useEffect(() => {
        fetchDistributionData();
    }, [category, dateRange]);

    const fetchDistributionData = async () => {
        setLoading(true);
        try {
            const response = await analyticsService.getScoreDistribution({
                ...dateRange,
                category,
            });
            setDistributionData(response.data);
        } catch (error) {
            console.error('Error fetching score distribution:', error);
            toast.error('Failed to load score distribution');
        } finally {
            setLoading(false);
        }
    };

    const getBarColor = (range) => {
        const start = parseInt(range.split('-')[0]);
        if (start >= 90) return '#10b981'; // green
        if (start >= 80) return '#3b82f6'; // blue
        if (start >= 70) return '#f59e0b'; // yellow
        if (start >= 60) return '#f97316'; // orange
        return '#ef4444'; // red
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload[0]) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-gray-900 mb-2">{data.range}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                            <strong>Students:</strong> {data.count}
                        </p>
                        <p className="text-gray-700">
                            <strong>Percentage:</strong> {data.percentage}%
                        </p>
                        <p className="text-gray-700">
                            <strong>Avg Score:</strong> {data.averageScore}
                        </p>
                        <p className="text-gray-700">
                            <strong>Unique Students:</strong> {data.uniqueStudents}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-96 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
                        Score Distribution Histogram
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Performance overview across score ranges
                    </p>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-6 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium">Mean</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {distributionData?.statistics?.mean?.toFixed(1) || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium">Median</p>
                    <p className="text-2xl font-bold text-green-600">
                        {distributionData?.statistics?.median?.toFixed(1) || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium">Mode</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {distributionData?.statistics?.mode || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium">Std Dev</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {distributionData?.statistics?.standardDeviation?.toFixed(1) || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium">Min</p>
                    <p className="text-2xl font-bold text-red-600">
                        {distributionData?.statistics?.min || 0}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-4">
                    <p className="text-xs text-gray-600 font-medium">Max</p>
                    <p className="text-2xl font-bold text-indigo-600">
                        {distributionData?.statistics?.max || 0}
                    </p>
                </div>
            </div>

            {/* Histogram Chart */}
            <div className="mb-6">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={distributionData?.histogram || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="range"
                            stroke="#6b7280"
                            label={{ value: 'Score Range', position: 'bottom', offset: -5 }}
                        />
                        <YAxis
                            stroke="#6b7280"
                            label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                            {distributionData?.histogram?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Grade Distribution */}
            {distributionData?.gradeDistribution && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-indigo-600" />
                        Grade Distribution
                    </h4>
                    <div className="grid grid-cols-11 gap-2">
                        {Object.entries(distributionData.gradeDistribution).map(([grade, count]) => (
                            <div key={grade} className="text-center">
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-600">{grade}</p>
                                    <p className="text-lg font-bold text-gray-900">{count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Outliers Section */}
            {distributionData?.outliers && distributionData.outliers.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                        Students Needing Attention (Outliers)
                    </h4>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="space-y-2">
                            {distributionData.outliers.slice(0, 5).map((outlier, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-900">{outlier.student.name}</p>
                                        <p className="text-xs text-gray-600">{outlier.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-orange-600">{outlier.score}</p>
                                        <p className="text-xs text-gray-600">
                                            {outlier.deviationFromMean > 0 ? '+' : ''}
                                            {outlier.deviationFromMean.toFixed(1)} from mean
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Insights */}
            {distributionData?.insights && distributionData.insights.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Key Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-indigo-800">
                        {distributionData.insights.map((insight, index) => (
                            <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{insight.message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ScoreDistributionChart;
