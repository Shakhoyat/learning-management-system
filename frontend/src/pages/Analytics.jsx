import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import { analyticsService } from '../services/analytics';
import toast from 'react-hot-toast';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    RadialBarChart,
    RadialBar,
} from 'recharts';

const Analytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('30d');
    const [analytics, setAnalytics] = useState(null);
    const [progress, setProgress] = useState(null);
    const [sessionStats, setSessionStats] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeframe]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const [analyticsData, progressData, sessionStatsData] = await Promise.all([
                analyticsService.getUserAnalytics({
                    timeframe,
                    metrics: user?.role === 'tutor' ? 'teaching,engagement,earnings' : 'learning,engagement',
                }),
                analyticsService.getLearningProgress(),
                analyticsService.getSessionStats(),
            ]);

            console.log('Analytics data loaded:', { analyticsData, progressData, sessionStatsData });

            setAnalytics(analyticsData);
            setProgress(progressData);
            setSessionStats(sessionStatsData);
        } catch (error) {
            console.error('Error fetching analytics:', error);

            // More detailed error message
            let errorMessage = 'Failed to load analytics data';
            if (error.response) {
                errorMessage = `Server error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`;
            } else if (error.request) {
                errorMessage = 'Cannot connect to server. Please ensure backend is running on port 3000.';
            } else {
                errorMessage = error.message || 'Failed to load analytics data';
            }

            toast.error(errorMessage, { duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    const timeframeOptions = [
        { value: '7d', label: 'Last 7 Days' },
        { value: '30d', label: 'Last 30 Days' },
        { value: '90d', label: 'Last 90 Days' },
        { value: '1y', label: 'Last Year' },
    ];

    // Prepare chart data
    const progressTrendData = analytics?.learningProgress?.progressTrend?.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        progress: parseFloat((item.progress * 100).toFixed(1)),
        goal: 100,
    })) || [];

    const categoryTimeData = Object.entries(analytics?.learningProgress?.timeSpentByCategory || {}).map(([name, hours]) => ({
        name,
        hours: parseFloat(hours.toFixed(1)),
        percentage: 0, // Will calculate below
    }));

    // Calculate percentages for category data
    const totalHours = categoryTimeData.reduce((sum, item) => sum + item.hours, 0);
    categoryTimeData.forEach(item => {
        item.percentage = totalHours > 0 ? ((item.hours / totalHours) * 100).toFixed(1) : 0;
    });

    // Session distribution data for pie chart
    const sessionDistributionData = [
        { name: 'Completed', value: sessionStats?.completed || 0, color: '#10B981' },
        { name: 'Upcoming', value: sessionStats?.upcoming || 0, color: '#3B82F6' },
        { name: 'Cancelled', value: sessionStats?.cancelled || 0, color: '#EF4444' },
    ].filter(item => item.value > 0);

    // Radial progress data
    const overallProgressData = [
        {
            name: 'Progress',
            value: ((analytics?.learningProgress?.averageProgress || 0) * 100),
            fill: '#4F46E5',
        },
    ];

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

    // Custom tooltip components
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700">
                    <p className="font-semibold text-sm mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}{entry.name.includes('Progress') || entry.name.includes('Goal') ? '%' : ' hours'}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center h-96">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
                            <div className="w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">Loading your analytics...</p>
                        <p className="mt-2 text-sm text-gray-400">Please wait while we gather your data</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="px-4 py-8 sm:px-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                                    {user?.role === 'tutor' ? 'Teaching Analytics' : 'Learning Analytics'}
                                </span>
                            </h1>
                            <p className="text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Track your progress and performance over time
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {timeframeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setTimeframe(option.value)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${timeframe === option.value
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="px-4 sm:px-0 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Sessions Card */}
                        <div className="group relative bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-opacity-80 text-xs font-medium px-2 py-1 bg-white bg-opacity-20 rounded-full">
                                        {timeframe === '7d' ? 'Week' : timeframe === '30d' ? 'Month' : timeframe === '90d' ? 'Quarter' : 'Year'}
                                    </span>
                                </div>
                                <p className="text-white text-opacity-80 text-sm font-medium">Total Sessions</p>
                                <p className="mt-2 text-4xl font-bold text-white">
                                    {analytics?.overview?.totalSessions || 0}
                                </p>
                                <div className="mt-4 flex items-center text-white text-opacity-70 text-xs">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Updated just now
                                </div>
                            </div>
                        </div>

                        {/* Hours Learned Card */}
                        <div className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-opacity-80 text-xs font-medium px-2 py-1 bg-white bg-opacity-20 rounded-full">
                                        {sessionStats?.completed || 0} completed
                                    </span>
                                </div>
                                <p className="text-white text-opacity-80 text-sm font-medium">
                                    {user?.role === 'tutor' ? 'Hours Taught' : 'Hours Learned'}
                                </p>
                                <p className="mt-2 text-4xl font-bold text-white">
                                    {user?.role === 'tutor'
                                        ? (analytics?.overview?.hoursTaught || 0).toFixed(1)
                                        : (analytics?.overview?.hoursLearned || 0).toFixed(1)
                                    }
                                </p>
                                <div className="mt-4 flex items-center text-white text-opacity-70 text-xs">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    In selected period
                                </div>
                            </div>
                        </div>

                        {/* Average Rating Card */}
                        <div className="group relative bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-opacity-80 text-xs font-medium px-2 py-1 bg-white bg-opacity-20 rounded-full">
                                        {(analytics?.overview?.averageRating || 0) >= 4.5 ? 'Excellent' :
                                            (analytics?.overview?.averageRating || 0) >= 3.5 ? 'Good' :
                                                (analytics?.overview?.averageRating || 0) >= 2.5 ? 'Fair' : 'Needs Improvement'}
                                    </span>
                                </div>
                                <p className="text-white text-opacity-80 text-sm font-medium">Average Rating</p>
                                <div className="flex items-baseline mt-2">
                                    <p className="text-4xl font-bold text-white">
                                        {(analytics?.overview?.averageRating || 0).toFixed(1)}
                                    </p>
                                    <span className="ml-2 text-white text-opacity-80 text-lg">/5.0</span>
                                </div>
                                <div className="mt-3 flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className={`w-4 h-4 ${star <= Math.round(analytics?.overview?.averageRating || 0) ? 'text-white' : 'text-white text-opacity-30'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Skills in Progress / Students Card */}
                        <div className="group relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-white text-opacity-80 text-xs font-medium px-2 py-1 bg-white bg-opacity-20 rounded-full">
                                        {user?.role === 'tutor' ? 'Students' :
                                            analytics?.learningProgress?.skillsCompleted > 0 ? `${analytics.learningProgress.skillsCompleted} done` : 'Active'}
                                    </span>
                                </div>
                                <p className="text-white text-opacity-80 text-sm font-medium">
                                    {user?.role === 'tutor' ? 'Students Acquired' : 'Skills in Progress'}
                                </p>
                                <p className="mt-2 text-4xl font-bold text-white">
                                    {user?.role === 'tutor'
                                        ? analytics?.teachingPerformance?.studentsAcquired || 0
                                        : analytics?.learningProgress?.skillsInProgress || 0
                                    }
                                </p>
                                <div className="mt-4 flex items-center text-white text-opacity-70 text-xs">
                                    {user?.role === 'learner' && analytics?.learningProgress ? (
                                        <>
                                            <div className="flex-1 bg-white bg-opacity-20 rounded-full h-1.5">
                                                <div
                                                    className="bg-white h-1.5 rounded-full transition-all duration-1000"
                                                    style={{ width: `${((analytics.learningProgress.averageProgress || 0) * 100).toFixed(0)}%` }}
                                                ></div>
                                            </div>
                                            <span className="ml-2">{((analytics.learningProgress.averageProgress || 0) * 100).toFixed(0)}%</span>
                                        </>
                                    ) : (
                                        <span>In selected period</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Progress Section (Only for Learners) */}
                {user?.role === 'learner' && (
                    <div className="px-4 sm:px-0 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                                    Learning Progress
                                </span>
                                <svg className="w-6 h-6 ml-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Progress Trend Chart - Takes 2 columns */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Progress Over Time</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                            Trending Up
                                        </span>
                                    </div>
                                </div>
                                <div style={{ height: '320px' }}>
                                    {progressTrendData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={progressTrendData}>
                                                <defs>
                                                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#6B7280"
                                                    style={{ fontSize: '12px' }}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickFormatter={(value) => `${value}%`}
                                                    stroke="#6B7280"
                                                    style={{ fontSize: '12px' }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="progress"
                                                    stroke="#4F46E5"
                                                    strokeWidth={3}
                                                    fill="url(#colorProgress)"
                                                    animationDuration={2000}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="goal"
                                                    stroke="#10B981"
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={false}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <p className="font-medium">No progress data available</p>
                                            <p className="text-sm mt-1">Start learning to see your progress</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Circular Progress Indicator */}
                            <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="text-lg font-semibold mb-6">Overall Progress</h3>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="relative w-48 h-48">
                                        <svg className="transform -rotate-90 w-48 h-48">
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                stroke="rgba(255,255,255,0.2)"
                                                strokeWidth="12"
                                                fill="none"
                                            />
                                            <circle
                                                cx="96"
                                                cy="96"
                                                r="88"
                                                stroke="white"
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 88}`}
                                                strokeDashoffset={`${2 * Math.PI * 88 * (1 - (analytics?.learningProgress?.averageProgress || 0))}`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                            <p className="text-4xl font-bold">
                                                {((analytics?.learningProgress?.averageProgress || 0) * 100).toFixed(0)}%
                                            </p>
                                            <p className="text-sm text-white text-opacity-80 mt-1">Complete</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 w-full space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white text-opacity-80">In Progress</span>
                                            <span className="font-semibold">{analytics?.learningProgress?.skillsInProgress || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-white text-opacity-80">Completed</span>
                                            <span className="font-semibold">{analytics?.learningProgress?.skillsCompleted || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Time Spent by Category */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Time by Category</h3>
                                <div style={{ height: '320px' }}>
                                    {categoryTimeData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={categoryTimeData}>
                                                <defs>
                                                    {categoryTimeData.map((entry, index) => (
                                                        <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
                                                            <stop offset="95%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6} />
                                                        </linearGradient>
                                                    ))}
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#6B7280"
                                                    style={{ fontSize: '12px' }}
                                                />
                                                <YAxis
                                                    tickFormatter={(value) => `${value}h`}
                                                    stroke="#6B7280"
                                                    style={{ fontSize: '12px' }}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar
                                                    dataKey="hours"
                                                    radius={[8, 8, 0, 0]}
                                                    animationDuration={1500}
                                                >
                                                    {categoryTimeData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={`url(#barGradient${index})`}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <p className="font-medium">No category data available</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Session Distribution Pie Chart */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Session Distribution</h3>
                                <div style={{ height: '320px' }}>
                                    {sessionDistributionData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={sessionDistributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    animationDuration={1500}
                                                >
                                                    {sessionDistributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => `${value} sessions`}
                                                    contentStyle={{
                                                        backgroundColor: '#1F2937',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: 'white'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                            </svg>
                                            <p className="font-medium">No session data available</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    {sessionDistributionData.map((item, index) => (
                                        <div key={index} className="text-center">
                                            <div className="flex items-center justify-center mb-1">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                                                <span className="text-sm text-gray-600">{item.name}</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Skills Progress Section */}
                        {progress?.learningSkills && progress.learningSkills.length > 0 && (
                            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Skill-by-Skill Progress</h3>
                                <div className="space-y-4">
                                    {progress.learningSkills.map((skill, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors duration-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex-1">
                                                    <h4 className="text-base font-semibold text-gray-900">{skill.skill?.name || 'Unknown Skill'}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {skill.skill?.category || 'General'} •
                                                        <span className="ml-1">Level {skill.currentLevel} / {skill.targetLevel}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-2xl font-bold text-indigo-600">
                                                        {(skill.progress * 100).toFixed(0)}%
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {skill.hoursLearned?.toFixed(1) || 0}h learned
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                                    style={{ width: `${(skill.progress * 100).toFixed(0)}%` }}
                                                >
                                                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                                <span>Started</span>
                                                <span className={`font-medium ${skill.progress >= 1 ? 'text-green-600' : 'text-indigo-600'}`}>
                                                    {skill.progress >= 1 ? '✓ Completed' : `${skill.targetLevel - skill.currentLevel} levels to go`}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Stats */}
                                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Skills</p>
                                        <p className="text-2xl font-bold text-gray-900">{progress.learningSkills.length}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                                        <p className="text-2xl font-bold text-gray-900">{progress.totalSessions || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                                        <p className="text-2xl font-bold text-gray-900">{progress.totalHours?.toFixed(1) || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Engagement Metrics */}
                <div className="px-4 sm:px-0">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <span className="bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text">
                                Engagement Metrics
                            </span>
                            <svg className="w-6 h-6 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Login Frequency Card */}
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                        Active
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-2">Login Frequency</p>
                                <p className="text-3xl font-bold text-gray-900 capitalize mb-4">
                                    {analytics?.engagement?.loginFrequency || 'N/A'}
                                </p>
                                <div className="flex items-center text-xs text-green-600">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    </svg>
                                    <span>Consistent activity</span>
                                </div>
                            </div>
                        </div>

                        {/* Average Session Duration Card */}
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-purple-100 rounded-xl">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        Optimal
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-2">Avg. Session Duration</p>
                                <p className="text-3xl font-bold text-gray-900 mb-4">
                                    {analytics?.engagement?.averageSessionDuration || 'N/A'}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Exchanged Card */}
                        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-50 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        High
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium mb-2">Messages Exchanged</p>
                                <p className="text-3xl font-bold text-gray-900 mb-4">
                                    {analytics?.engagement?.messagesExchanged || 0}
                                </p>
                                <div className="flex items-center text-xs text-green-600">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    </svg>
                                    <span>+18% this week</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
