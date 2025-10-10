import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import toast from 'react-hot-toast';
import { Activity, TrendingUp, Clock, Users } from 'lucide-react';

const ActivityHeatmap = () => {
    const [loading, setLoading] = useState(true);
    const [heatmapData, setHeatmapData] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    useEffect(() => {
        fetchHeatmapData();
    }, [dateRange]);

    const fetchHeatmapData = async () => {
        setLoading(true);
        try {
            const response = await analyticsService.getEngagementHeatmap(dateRange);
            setHeatmapData(response.data);
        } catch (error) {
            console.error('Error fetching heatmap:', error);
            toast.error('Failed to load activity heatmap');
        } finally {
            setLoading(false);
        }
    };

    const getColorIntensity = (engagement) => {
        if (engagement === 0) return 'bg-gray-100';
        if (engagement < 20) return 'bg-blue-100';
        if (engagement < 40) return 'bg-blue-200';
        if (engagement < 60) return 'bg-blue-400';
        if (engagement < 80) return 'bg-blue-500';
        return 'bg-blue-600';
    };

    const getCellData = (day, hour) => {
        return heatmapData?.heatmap?.find(
            (cell) => cell.day === day && cell.hour === hour
        );
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
                        <Activity className="w-6 h-6 mr-2 text-indigo-600" />
                        Student Engagement Activity Heatmap
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Day vs. Time engagement patterns
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

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Total Activities</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {heatmapData?.summary?.totalActivities || 0}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Avg Engagement</p>
                            <p className="text-2xl font-bold text-green-600">
                                {heatmapData?.summary?.averageEngagement?.toFixed(1) || 0}%
                            </p>
                        </div>
                        <Activity className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Peak Time</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {heatmapData?.summary?.peakTime?.day || 'N/A'}{' '}
                                {heatmapData?.summary?.peakTime?.hour || ''}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Active Slots</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {heatmapData?.summary?.activeDaysHours || 0}/168
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Hour Headers */}
                    <div className="flex mb-1">
                        <div className="w-16"></div>
                        {hours.map((hour) => (
                            <div
                                key={hour}
                                className="w-10 text-xs text-center text-gray-500 font-medium"
                            >
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Day Rows */}
                    {days.map((day, dayIndex) => (
                        <div key={day} className="flex mb-1">
                            <div className="w-16 text-sm font-semibold text-gray-700 flex items-center">
                                {day}
                            </div>
                            {hours.map((hour) => {
                                const cellData = getCellData(dayIndex, hour);
                                const engagement = cellData?.averageEngagement || 0;
                                const activities = cellData?.totalActivities || 0;

                                return (
                                    <div
                                        key={`${day}-${hour}`}
                                        className={`w-10 h-10 m-0.5 rounded-md cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-indigo-400 hover:scale-110 ${getColorIntensity(
                                            engagement
                                        )}`}
                                        title={`${day} ${hour}:00\nActivities: ${activities}\nEngagement: ${engagement.toFixed(
                                            1
                                        )}%\nStudents: ${cellData?.uniqueStudents || 0}`}
                                    >
                                        {activities > 0 && (
                                            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-white">
                                                {activities > 9 ? '9+' : activities}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Less Active</span>
                    <div className="flex gap-1">
                        <div className="w-6 h-6 rounded bg-gray-100 border border-gray-300"></div>
                        <div className="w-6 h-6 rounded bg-blue-100"></div>
                        <div className="w-6 h-6 rounded bg-blue-200"></div>
                        <div className="w-6 h-6 rounded bg-blue-400"></div>
                        <div className="w-6 h-6 rounded bg-blue-500"></div>
                        <div className="w-6 h-6 rounded bg-blue-600"></div>
                    </div>
                    <span className="text-sm text-gray-600">More Active</span>
                </div>
            </div>

            {/* Insights */}
            {heatmapData?.summary?.peakTime && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Key Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-indigo-800">
                        <li>
                            • Peak engagement occurs on <strong>{heatmapData.summary.peakTime.day}</strong> at{' '}
                            <strong>{heatmapData.summary.peakTime.hour}</strong> with{' '}
                            <strong>{heatmapData.summary.peakTime.activities}</strong> activities
                        </li>
                        <li>
                            • Overall average engagement score is{' '}
                            <strong>{heatmapData.summary.averageEngagement.toFixed(1)}%</strong>
                        </li>
                        <li>
                            • Students are active in <strong>{heatmapData.summary.activeDaysHours}</strong> out of 168
                            possible time slots (
                            {((heatmapData.summary.activeDaysHours / 168) * 100).toFixed(1)}%)
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ActivityHeatmap;
