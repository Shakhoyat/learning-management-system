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
    Target,
    BookOpen,
    Activity,
    Calendar,
    ArrowUp,
    ArrowDown,
    Minus,
} from 'lucide-react';

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

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Detailed Teaching Analytics</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(analytics.period.startDate).toLocaleDateString()} - {new Date(analytics.period.endDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-2">
                    {periodOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setPeriod(option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === option.value
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Insights Section */}
            {insights.length > 0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                        Insights & Recommendations
                    </h3>
                    <div className="space-y-3">
                        {insights.map((insight, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg ${insight.type === 'success'
                                        ? 'bg-green-50 border-l-4 border-green-500'
                                        : insight.type === 'warning'
                                            ? 'bg-yellow-50 border-l-4 border-yellow-500'
                                            : 'bg-blue-50 border-l-4 border-blue-500'
                                    }`}
                            >
                                <p className="text-sm font-medium text-gray-900">{insight.message}</p>
                                {insight.category && (
                                    <p className="text-xs text-gray-500 mt-1">Category: {insight.category}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sessions */}
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

                {/* Total Students */}
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

                {/* Average Rating */}
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

                {/* Net Earnings */}
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

            {/* Session Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                    Session Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{current.sessionMetrics?.completed || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {((current.sessionMetrics?.completionRate || 0) * 100).toFixed(1)}% completion rate
                        </p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Cancelled</p>
                        <p className="text-3xl font-bold text-red-600">{current.sessionMetrics?.cancelled || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(((current.sessionMetrics?.cancelled || 0) / (current.sessionMetrics?.total || 1)) * 100).toFixed(1)}% of total
                        </p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                        <p className="text-3xl font-bold text-indigo-600">{(current.sessionMetrics?.totalHours || 0).toFixed(1)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Avg: {(current.sessionMetrics?.averageDuration || 0).toFixed(0)} min/session
                        </p>
                    </div>
                </div>
            </div>

            {/* Student Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-indigo-600" />
                    Student Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">New Students</p>
                        <p className="text-2xl font-bold text-gray-900">{current.studentMetrics?.newStudents || 0}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Returning</p>
                        <p className="text-2xl font-bold text-gray-900">{current.studentMetrics?.returningStudents || 0}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Retention Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {((current.studentMetrics?.retentionRate || 0) * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {(current.studentMetrics?.averageStudentSatisfaction || 0).toFixed(1)}/5.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-indigo-600" />
                    Rating Breakdown
                </h3>
                <div className="space-y-3">
                    {current.ratings?.categories && Object.entries(current.ratings.categories).map(([category, rating]) => (
                        <div key={category} className="flex items-center">
                            <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                                {category.replace('_', ' ')}
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all"
                                        style={{ width: `${(rating / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="w-16 text-right text-sm font-semibold text-gray-900">
                                {rating?.toFixed(1)}/5.0
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
                    Earnings Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Gross Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">
                            ${(current.earnings?.gross || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Platform Fees</p>
                        <p className="text-2xl font-bold text-red-600">
                            -${(current.earnings?.platformFees || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Net Earnings</p>
                        <p className="text-2xl font-bold text-green-600">
                            ${(current.earnings?.net || 0).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="mt-4 p-4 border-t">
                    <p className="text-sm text-gray-600">Average Hourly Rate</p>
                    <p className="text-xl font-bold text-gray-900">
                        ${(current.earnings?.averageHourlyRate || 0).toFixed(2)}/hour
                    </p>
                </div>
            </div>

            {/* Quality Metrics */}
            {current.qualityMetrics && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-indigo-600" />
                        Quality Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <QualityScore label="Preparation" score={current.qualityMetrics.preparationScore} />
                        <QualityScore label="Consistency" score={current.qualityMetrics.consistencyScore} />
                        <QualityScore label="Professionalism" score={current.qualityMetrics.professionalismScore} />
                        <QualityScore label="Overall Quality" score={current.qualityMetrics.overallQualityScore} />
                    </div>
                </div>
            )}

            {/* Skill Performance */}
            {current.skillPerformance && current.skillPerformance.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Target className="w-5 h-5 mr-2 text-indigo-600" />
                        Skill Performance
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Skill</th>
                                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-700">Sessions</th>
                                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-700">Hours</th>
                                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-700">Rating</th>
                                    <th className="text-center py-2 px-4 text-sm font-medium text-gray-700">Students</th>
                                    <th className="text-right py-2 px-4 text-sm font-medium text-gray-700">Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {current.skillPerformance.map((skill, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                            {skill.skill?.name || 'Unknown Skill'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {skill.sessionsCount}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {skill.hoursTeaching?.toFixed(1)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                ⭐ {skill.averageRating?.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center text-gray-600">
                                            {skill.studentsCount}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                            ${skill.earnings?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, suffix = '', change, color = 'indigo' }) => {
    const colors = {
        indigo: 'from-indigo-500 to-indigo-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${colors[color]} mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">
                {value}{suffix}
            </p>
            {change && <div className="mt-2 text-sm font-medium">{change}</div>}
        </div>
    );
};

// Quality Score Component
const QualityScore = ({ label, score }) => {
    const percentage = (score / 10) * 100;
    const color = score >= 8 ? 'green' : score >= 6 ? 'yellow' : 'red';
    const colorClasses = {
        green: 'from-green-400 to-green-600',
        yellow: 'from-yellow-400 to-yellow-600',
        red: 'from-red-400 to-red-600',
    };

    return (
        <div className="text-center p-4 border rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{label}</p>
            <div className="relative w-24 h-24 mx-auto mb-2">
                <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${percentage * 2.51} 251`}
                        className="transition-all duration-500"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className={`stop-color-${color}-400`} />
                            <stop offset="100%" className={`stop-color-${color}-600`} />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{score?.toFixed(1)}</span>
                </div>
            </div>
            <p className="text-xs text-gray-500">out of 10</p>
        </div>
    );
};

export default DetailedTeachingAnalytics;
