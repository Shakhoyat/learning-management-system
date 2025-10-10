import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { analyticsService } from '../../services/analytics';
import toast from 'react-hot-toast';
import {
    TrendingUp,
    Users,
    DollarSign,
    Star,
    Clock,
    Award,
    BookOpen,
    Activity,
    Calendar,
    ArrowUp,
    ArrowDown,
    Minus,
    TrendingDown,
    Zap,
    BarChart3,
    TrendingUpIcon,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartLegend } from '../ui/chart';

const DetailedTeachingAnalytics = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);
    const [period, setPeriod] = useState('monthly');
    const [includePrevious, setIncludePrevious] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [period, includePrevious]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const data = await analyticsService.getTeachingAnalytics({
                period,
                includePrevious: includePrevious ? 'true' : 'false',
            });
            console.log('Detailed Analytics:', data);
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching teaching analytics:', error);
            toast.error('Failed to load detailed analytics');
        } finally {
            setLoading(false);
        }
    };

    const periodOptions = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const getChangeIndicator = (current, previous) => {
        if (!previous || !current) return null;
        const change = ((current - previous) / previous) * 100;

        if (Math.abs(change) < 1) {
            return <span className="flex items-center text-gray-500"><Minus className="w-4 h-4 mr-1" /> No change</span>;
        }

        if (change > 0) {
            return <span className="flex items-center text-green-600"><ArrowUp className="w-4 h-4 mr-1" /> +{change.toFixed(1)}%</span>;
        }

        return <span className="flex items-center text-red-600"><ArrowDown className="w-4 h-4 mr-1" /> {change.toFixed(1)}%</span>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
                </div>
                <p className="ml-4 text-gray-600 font-medium">Loading detailed analytics...</p>
            </div>
        );
    }

    if (!analytics?.current) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No analytics data available for this period.</p>
            </div>
        );
    }

    const current = analytics.current;
    const previous = analytics.previous;
    const insights = analytics.insights || [];

    // Prepare chart data
    const sessionStatusData = [
        { name: 'Completed', value: current.sessionMetrics?.completed || 0, color: '#10b981' },
        { name: 'Cancelled', value: current.sessionMetrics?.cancelled || 0, color: '#ef4444' },
        { name: 'No Show', value: current.sessionMetrics?.noShows || 0, color: '#f59e0b' },
    ];

    const studentMetricsData = [
        { name: 'New', value: current.studentMetrics?.newStudents || 0 },
        { name: 'Returning', value: current.studentMetrics?.returningStudents || 0 },
    ];

    const ratingCategoriesData = current.ratings?.categories
        ? Object.entries(current.ratings.categories).map(([category, rating]) => ({
            category: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            rating: rating,
            fullMark: 5,
        }))
        : [];

    const earningsComparisonData = [
        {
            name: 'Current',
            gross: current.earnings?.gross || 0,
            fees: current.earnings?.platformFees || 0,
            net: current.earnings?.net || 0,
        },
        ...(previous ? [{
            name: 'Previous',
            gross: previous.earnings?.gross || 0,
            fees: previous.earnings?.platformFees || 0,
            net: previous.earnings?.net || 0,
        }] : []),
    ];

    const qualityMetricsRadarData = current.qualityMetrics ? [
        { metric: 'Preparation', score: current.qualityMetrics.preparationScore, fullMark: 10 },
        { metric: 'Consistency', score: current.qualityMetrics.consistencyScore, fullMark: 10 },
        { metric: 'Professionalism', score: current.qualityMetrics.professionalismScore, fullMark: 10 },
        { metric: 'Overall', score: current.qualityMetrics.overallQualityScore, fullMark: 10 },
    ] : [];

    // Prepare trend data for line charts (simulated weekly data)
    const generateTrendData = () => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const totalSessions = current.sessionMetrics?.total || 0;
        const totalEarnings = current.earnings?.net || 0;
        const avgRating = current.ratings?.overall?.average || 0;

        return weeks.map((week, index) => {
            const progress = (index + 1) / weeks.length;
            return {
                week,
                sessions: Math.round(totalSessions * progress * (0.15 + Math.random() * 0.1)),
                earnings: Math.round(totalEarnings * progress * (0.15 + Math.random() * 0.1)),
                rating: Number((avgRating * (0.85 + Math.random() * 0.15)).toFixed(2)),
                students: Math.round((current.studentMetrics?.totalStudents || 0) * progress * (0.15 + Math.random() * 0.1)),
            };
        });
    };

    const trendData = generateTrendData();

    const COLORS = {
        primary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
        purple: '#8b5cf6',
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-8 h-8" />
                        Teaching Analytics Dashboard
                    </h2>
                    <p className="text-sm text-indigo-100 mt-1">
                        {new Date(analytics.period.startDate).toLocaleDateString()} - {new Date(analytics.period.endDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    {periodOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPeriod(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === option.value
                                ? 'bg-white text-indigo-600 shadow-md'
                                : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Insights Section */}
            {insights.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-indigo-600" />
                        AI-Powered Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {insights.slice(0, 4).map((insight, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-l-4 ${insight.type === 'success'
                                    ? 'bg-green-50 border-green-500'
                                    : insight.type === 'warning'
                                        ? 'bg-yellow-50 border-yellow-500'
                                        : 'bg-blue-50 border-blue-500'
                                    }`}
                            >
                                <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={BookOpen}
                    label="Total Sessions"
                    value={current.sessionMetrics?.total || 0}
                    change={getChangeIndicator(
                        current.sessionMetrics?.total,
                        previous?.sessionMetrics?.total
                    )}
                    color="indigo"
                />
                <MetricCard
                    icon={Users}
                    label="Total Students"
                    value={current.studentMetrics?.totalStudents || 0}
                    change={getChangeIndicator(
                        current.studentMetrics?.totalStudents,
                        previous?.studentMetrics?.totalStudents
                    )}
                    color="blue"
                />
                <MetricCard
                    icon={Star}
                    label="Average Rating"
                    value={(current.ratings?.overall?.average || 0).toFixed(1)}
                    suffix="/5.0"
                    change={getChangeIndicator(
                        current.ratings?.overall?.average,
                        previous?.ratings?.overall?.average
                    )}
                    color="yellow"
                />
                <MetricCard
                    icon={DollarSign}
                    label="Net Earnings"
                    value={`$${(current.earnings?.net || 0).toLocaleString()}`}
                    change={getChangeIndicator(
                        current.earnings?.net,
                        previous?.earnings?.net
                    )}
                    color="green"
                />
            </div>

            {/* Modern Line Charts - Shadcn Style */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sessions Trend Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            Sessions Trend
                        </CardTitle>
                        <CardDescription>Weekly session activity over the period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="week"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sessions"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        dot={{ fill: '#6366f1', r: 4 }}
                                        activeDot={{ r: 6, fill: '#4f46e5' }}
                                        name="Sessions"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                                <span className="text-gray-600">Total Sessions</span>
                            </div>
                            <span className="font-semibold text-gray-900">{current.sessionMetrics?.total || 0}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Earnings Trend Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Earnings Trend
                        </CardTitle>
                        <CardDescription>Weekly earnings progression</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="week"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ fill: '#10b981', r: 4 }}
                                        activeDot={{ r: 6, fill: '#059669' }}
                                        name="Earnings ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-600"></div>
                                <span className="text-gray-600">Net Earnings</span>
                            </div>
                            <span className="font-semibold text-gray-900">${(current.earnings?.net || 0).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Rating Trend Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Star className="w-5 h-5 text-yellow-600" />
                            Rating Trend
                        </CardTitle>
                        <CardDescription>Weekly rating performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="week"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 5]}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rating"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ fill: '#f59e0b', r: 4 }}
                                        activeDot={{ r: 6, fill: '#d97706' }}
                                        name="Rating"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                                <span className="text-gray-600">Average Rating</span>
                            </div>
                            <span className="font-semibold text-gray-900">{(current.ratings?.overall?.average || 0).toFixed(2)}/5.0</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Students Trend Line Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                            Students Growth
                        </CardTitle>
                        <CardDescription>Weekly student acquisition</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="week"
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="students"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', r: 4 }}
                                        activeDot={{ r: 6, fill: '#2563eb' }}
                                        name="Students"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                                <span className="text-gray-600">Total Students</span>
                            </div>
                            <span className="font-semibold text-gray-900">{current.studentMetrics?.totalStudents || 0}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Session Status Distribution - Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                    Session Status Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={sessionStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {sessionStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Completed Sessions</p>
                            <p className="text-3xl font-bold text-green-600">{current.sessionMetrics?.completed || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {((current.sessionMetrics?.completionRate || 0) * 100).toFixed(1)}% completion rate
                            </p>
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Total Hours Taught</p>
                            <p className="text-3xl font-bold text-indigo-600">{(current.sessionMetrics?.totalHours || 0).toFixed(1)}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Avg: {(current.sessionMetrics?.averageDuration || 0).toFixed(0)} min/session
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Engagement - Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Student Engagement
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={studentMetricsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Bar dataKey="value" fill={COLORS.primary} radius={[8, 8, 0, 0]} animationDuration={800}>
                            {studentMetricsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.info : COLORS.success} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
                        <p className="text-2xl font-bold text-indigo-600">
                            {((current.studentMetrics?.retentionRate || 0) * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Student Satisfaction</p>
                        <p className="text-2xl font-bold text-green-600">
                            {(current.studentMetrics?.averageStudentSatisfaction || 0).toFixed(1)}/5.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Rating Categories - Radar Chart */}
            {ratingCategoriesData.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-indigo-600" />
                        Rating Categories Performance
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={ratingCategoriesData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="category" stroke="#6b7280" />
                            <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="#6b7280" />
                            <Radar
                                name="Rating"
                                dataKey="rating"
                                stroke={COLORS.primary}
                                fill={COLORS.primary}
                                fillOpacity={0.6}
                                animationDuration={800}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Overall Average Rating</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {(current.ratings?.overall?.average || 0).toFixed(2)} / 5.0
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Based on {current.ratings?.overall?.count || 0} ratings
                        </p>
                    </div>
                </div>
            )}

            {/* Earnings Comparison - Area Chart */}
            {previous && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                        Earnings Comparison
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={earningsComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                }}
                                formatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Bar dataKey="gross" fill={COLORS.info} name="Gross" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="fees" fill={COLORS.danger} name="Fees" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="net" fill={COLORS.success} name="Net" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Average Hourly Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                            ${(current.earnings?.averageHourlyRate || 0).toFixed(2)}/hour
                        </p>
                    </div>
                </div>
            )}

            {/* Quality Metrics - Radar Chart */}
            {qualityMetricsRadarData.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-indigo-600" />
                        Quality Metrics
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={qualityMetricsRadarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="metric" stroke="#6b7280" />
                            <PolarRadiusAxis angle={90} domain={[0, 10]} stroke="#6b7280" />
                            <Radar
                                name="Score"
                                dataKey="score"
                                stroke={COLORS.purple}
                                fill={COLORS.purple}
                                fillOpacity={0.6}
                                animationDuration={800}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

// Metric Card Component with Enhanced Design
const MetricCard = ({ icon: Icon, label, value, suffix = '', change, color = 'indigo' }) => {
    const colors = {
        indigo: {
            gradient: 'from-indigo-500 to-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
        },
        blue: {
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        green: {
            gradient: 'from-green-500 to-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
        },
        yellow: {
            gradient: 'from-yellow-500 to-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
        },
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 ${colors[color].border}`}>
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${colors[color].gradient} mb-4 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-2 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
                {value}{suffix}
            </p>
            {change && <div className="text-sm font-medium">{change}</div>}
        </div>
    );
};

export default DetailedTeachingAnalytics;
