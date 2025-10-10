import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import toast from 'react-hot-toast';
import ProgressGauge from './ProgressGauge';
import StrengthsWeaknessesRadar from './StrengthsWeaknessesRadar';
import StudyBehaviorDonut from './StudyBehaviorDonut';
import LeaderboardTable from './LeaderboardTable';

const StudentLearningAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [timeframe, setTimeframe] = useState('30d');

    useEffect(() => {
        fetchAnalytics();
    }, [timeframe]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await analyticsService.getLearningAnalytics({
                timeframe,
                includePerformance: true,
                includeGamification: true,
                includeSessionMetrics: true,
            });
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching learning analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        toast.success('Export functionality coming soon!');
    };

    const timeframeOptions = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
        { value: '1y', label: 'Last Year' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                            📊 Learning Analytics Dashboard
                        </span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Track your progress, performance, and learning behavior
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    {/* Timeframe Filters */}
                    {timeframeOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setTimeframe(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${timeframe === option.value
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Quick Stats Overview */}
            {!loading && analytics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Total Hours */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{analytics.sessionMetrics?.totalHours?.toFixed(1) || 0}h</p>
                        <p className="text-sm text-blue-100 mt-1">Total Learning Time</p>
                    </div>

                    {/* Skills Mastered */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{analytics.learningProgress?.skillsCompleted || 0}</p>
                        <p className="text-sm text-green-100 mt-1">Skills Mastered</p>
                    </div>

                    {/* Current Level */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-bold">Level {analytics.gamification?.currentLevel || 1}</p>
                        <p className="text-sm text-purple-100 mt-1">Current Level</p>
                    </div>

                    {/* Total Points */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{analytics.gamification?.totalPoints?.toLocaleString() || 0}</p>
                        <p className="text-sm text-orange-100 mt-1">Total Points</p>
                    </div>
                </div>
            )}

            {/* Main Visualization Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Gauge */}
                <div className="lg:col-span-1">
                    <ProgressGauge analytics={analytics} loading={loading} />
                </div>

                {/* Strengths & Weaknesses Radar */}
                <div className="lg:col-span-1">
                    <StrengthsWeaknessesRadar analytics={analytics} loading={loading} />
                </div>

                {/* Study Behavior Donut */}
                <div className="lg:col-span-1">
                    <StudyBehaviorDonut analytics={analytics} loading={loading} />
                </div>

                {/* Leaderboard */}
                <div className="lg:col-span-1">
                    <LeaderboardTable loading={loading} />
                </div>
            </div>

            {/* Additional Insights Section */}
            {!loading && analytics && (
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Personalized Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Learning Pace */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Learning Pace</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {analytics.sessionMetrics?.averageSessionDuration > 2 ? 'Consistent' : 'Variable'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                {analytics.sessionMetrics?.averageSessionDuration > 2
                                    ? 'You maintain consistent study sessions. Great habit!'
                                    : 'Try extending your study sessions for better retention.'}
                            </p>
                        </div>

                        {/* Focus Level */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Focus Level</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {analytics.sessionMetrics?.focusScore >= 7 ? 'Excellent' : 'Good'}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                Your focus score is {(analytics.sessionMetrics?.focusScore * 10 || 0).toFixed(1)}/10.
                                {analytics.sessionMetrics?.focusScore >= 7 ? ' Keep it up!' : ' Try reducing distractions.'}
                            </p>
                        </div>

                        {/* Completion Rate */}
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center mb-2">
                                <div className="p-2 bg-green-100 rounded-lg mr-3">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-medium">Completion Rate</p>
                                    <p className="text-sm font-bold text-gray-900">
                                        {((analytics.sessionMetrics?.completionRate || 0) * 100).toFixed(0)}%
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                                {analytics.sessionMetrics?.completionRate >= 0.8
                                    ? 'Excellent commitment to finishing what you start!'
                                    : 'Try to complete more of your started sessions.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentLearningAnalytics;
