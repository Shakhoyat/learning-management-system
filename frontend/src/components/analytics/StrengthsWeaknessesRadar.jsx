import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StrengthsWeaknessesRadar = ({ analytics, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="flex justify-center">
                    <div className="w-64 h-64 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!analytics?.performance) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="font-medium">No performance data available</p>
                    <p className="text-sm mt-1">Complete sessions to see your strengths</p>
                </div>
            </div>
        );
    }

    const { performance } = analytics;

    // Prepare radar chart data - aggregate by category
    const categoryPerformance = {};

    if (performance.bySkillCategory && Array.isArray(performance.bySkillCategory)) {
        performance.bySkillCategory.forEach(cat => {
            categoryPerformance[cat.category] = {
                comprehension: (cat.comprehensionScore || 0) * 10,
                retention: (cat.retentionScore || 0) * 10,
                application: (cat.applicationScore || 0) * 10,
                problemSolving: (cat.problemSolvingScore || 0) * 10,
                creativity: (cat.creativityScore || 0) * 10,
            };
        });
    }

    // If no category data, use overall performance
    if (Object.keys(categoryPerformance).length === 0) {
        const overall = performance.overall || {};
        categoryPerformance['Overall'] = {
            comprehension: (overall.comprehensionScore || 0) * 10,
            retention: (overall.retentionScore || 0) * 10,
            application: (overall.applicationScore || 0) * 10,
            problemSolving: (overall.problemSolvingScore || 0) * 10,
            creativity: (overall.creativityScore || 0) * 10,
        };
    }

    // Convert to radar chart format - use first category or overall
    const firstCategory = Object.keys(categoryPerformance)[0];
    const scores = categoryPerformance[firstCategory] || {};

    const radarData = [
        { subject: 'Comprehension', value: scores.comprehension || 0, fullMark: 100 },
        { subject: 'Retention', value: scores.retention || 0, fullMark: 100 },
        { subject: 'Application', value: scores.application || 0, fullMark: 100 },
        { subject: 'Problem Solving', value: scores.problemSolving || 0, fullMark: 100 },
        { subject: 'Creativity', value: scores.creativity || 0, fullMark: 100 },
    ];

    // Calculate strengths and weaknesses
    const sortedScores = [...radarData].sort((a, b) => b.value - a.value);
    const strengths = sortedScores.slice(0, 2);
    const weaknesses = sortedScores.slice(-2).reverse();

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700">
                    <p className="font-semibold text-sm mb-1">{payload[0].payload.subject}</p>
                    <p className="text-sm text-indigo-300">
                        Score: {payload[0].value.toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Performance Analysis</h3>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-semibold">
                    {firstCategory}
                </span>
            </div>

            {/* Radar Chart */}
            <div className="flex justify-center mb-6" style={{ height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                        <PolarGrid stroke="#E5E7EB" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                        />
                        <Radar
                            name="Performance"
                            dataKey="value"
                            stroke="#4F46E5"
                            fill="#4F46E5"
                            fillOpacity={0.6}
                            animationDuration={1500}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center mb-3">
                        <div className="p-2 bg-green-100 rounded-lg mr-2">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Strengths</h4>
                    </div>
                    <div className="space-y-2">
                        {strengths.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-xs text-gray-700 font-medium">{item.subject}</span>
                                <div className="flex items-center">
                                    <div className="w-16 bg-green-200 rounded-full h-1.5 mr-2">
                                        <div
                                            className="bg-green-600 h-1.5 rounded-full"
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-green-700">{item.value.toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Areas to Improve */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg mr-2">
                            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Areas to Improve</h4>
                    </div>
                    <div className="space-y-2">
                        {weaknesses.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="text-xs text-gray-700 font-medium">{item.subject}</span>
                                <div className="flex items-center">
                                    <div className="w-16 bg-orange-200 rounded-full h-1.5 mr-2">
                                        <div
                                            className="bg-orange-600 h-1.5 rounded-full"
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-orange-700">{item.value.toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Tips */}
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-xs font-semibold text-gray-900 mb-1">Performance Tip</p>
                        <p className="text-xs text-gray-700">
                            {weaknesses[0]?.value < 50 ? (
                                <>Focus on improving your <span className="font-semibold text-indigo-700">{weaknesses[0]?.subject}</span> skills through targeted practice.</>
                            ) : (
                                <>Great balance across all areas! Continue practicing to maintain your strong performance.</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrengthsWeaknessesRadar;
