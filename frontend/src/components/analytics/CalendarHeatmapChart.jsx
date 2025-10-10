import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import toast from 'react-hot-toast';
import { Calendar, TrendingUp, CheckCircle, XCircle, Flame } from 'lucide-react';

const CalendarHeatmapChart = () => {
    const [loading, setLoading] = useState(true);
    const [calendarData, setCalendarData] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchCalendarData();
    }, [dateRange]);

    const fetchCalendarData = async () => {
        setLoading(true);
        try {
            const response = await analyticsService.getCalendarHeatmap(dateRange);
            setCalendarData(response.data);
        } catch (error) {
            console.error('Error fetching calendar heatmap:', error);
            toast.error('Failed to load calendar heatmap');
        } finally {
            setLoading(false);
        }
    };

    const getColorForScore = (score) => {
        if (score === 0) return 'bg-gray-100 border-gray-200';
        if (score < 30) return 'bg-red-200 border-red-300';
        if (score < 50) return 'bg-orange-200 border-orange-300';
        if (score < 70) return 'bg-yellow-200 border-yellow-300';
        if (score < 90) return 'bg-green-200 border-green-300';
        return 'bg-green-400 border-green-500';
    };

    const getTextColorForScore = (score) => {
        if (score === 0) return 'text-gray-400';
        if (score < 30) return 'text-red-700';
        if (score < 50) return 'text-orange-700';
        if (score < 70) return 'text-yellow-700';
        if (score < 90) return 'text-green-700';
        return 'text-green-800';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const groupByMonth = () => {
        if (!calendarData?.heatmap) return {};

        const grouped = {};
        calendarData.heatmap.forEach((day) => {
            const date = new Date(day.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    month: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                    days: [],
                };
            }
            grouped[monthKey].days.push(day);
        });
        return grouped;
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

    const monthlyData = groupByMonth();

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
                        Attendance & Assignment Calendar
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Daily consistency tracking
                    </p>
                </div>

                {/* Date Range Selector */}
                <div className="flex gap-2">
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
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Attendance Rate</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {calendarData?.statistics?.attendanceRate || 0}%
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Submission Rate</p>
                            <p className="text-3xl font-bold text-green-600">
                                {calendarData?.statistics?.submissionRate || 0}%
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Avg Consistency</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {calendarData?.statistics?.averageConsistency || 0}%
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Current Streak</p>
                            <p className="text-3xl font-bold text-orange-600">
                                {calendarData?.statistics?.currentStreak || 0}
                            </p>
                        </div>
                        <Flame className="w-8 h-8 text-orange-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Longest Streak</p>
                            <p className="text-3xl font-bold text-red-600">
                                {calendarData?.statistics?.longestStreak || 0}
                            </p>
                        </div>
                        <Flame className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
                {Object.entries(monthlyData).map(([monthKey, monthData]) => (
                    <div key={monthKey} className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">{monthData.month}</h4>
                        <div className="grid grid-cols-7 gap-2">
                            {monthData.days.map((day) => (
                                <div
                                    key={day.date}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${getColorForScore(
                                        day.consistencyScore
                                    )}`}
                                    title={`${formatDate(day.date)}\nConsistency: ${day.consistencyScore}%\nAttendance: ${day.attendance.present ? 'Present' : 'Absent'
                                        }\nAssignments: ${day.assignments.submitted}/${day.assignments.due}`}
                                >
                                    <div className="text-center">
                                        <p className={`text-xs font-semibold ${getTextColorForScore(day.consistencyScore)}`}>
                                            {new Date(day.date).getDate()}
                                        </p>
                                        <div className="flex items-center justify-center gap-1 mt-1">
                                            {day.attendance.present && (
                                                <CheckCircle className="w-3 h-3 text-green-600" />
                                            )}
                                            {day.assignments.submitted > 0 && (
                                                <div className="text-xs font-bold text-gray-700">
                                                    {day.assignments.submitted}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mb-6 flex items-center justify-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Low</span>
                    <div className="flex gap-1">
                        <div className="w-6 h-6 rounded border-2 bg-gray-100 border-gray-200"></div>
                        <div className="w-6 h-6 rounded border-2 bg-red-200 border-red-300"></div>
                        <div className="w-6 h-6 rounded border-2 bg-orange-200 border-orange-300"></div>
                        <div className="w-6 h-6 rounded border-2 bg-yellow-200 border-yellow-300"></div>
                        <div className="w-6 h-6 rounded border-2 bg-green-200 border-green-300"></div>
                        <div className="w-6 h-6 rounded border-2 bg-green-400 border-green-500"></div>
                    </div>
                    <span className="text-sm text-gray-600">High</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-600">Present</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="text-xs font-bold text-gray-700">2</div>
                        <span className="text-xs text-gray-600">Assignments</span>
                    </div>
                </div>
            </div>

            {/* Weekly Stats */}
            {calendarData?.weeklyStats && calendarData.weeklyStats.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Weekly Summary (Last 4 Weeks)</h4>
                    <div className="grid grid-cols-4 gap-4">
                        {calendarData.weeklyStats.slice(-4).map((week, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-xs text-gray-600 font-medium mb-2">
                                    Week {week.week}, {week.year}
                                </p>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Consistency:</span>
                                        <span className="font-bold text-gray-900">{week.avgConsistency}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Attendance:</span>
                                        <span className="font-bold text-gray-900">{week.attendanceRate}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Days:</span>
                                        <span className="font-bold text-gray-900">{week.daysTracked}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            {calendarData?.insights && calendarData.insights.length > 0 && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Key Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-indigo-800">
                        {calendarData.insights.map((insight, index) => (
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

export default CalendarHeatmapChart;
