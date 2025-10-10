import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StudyBehaviorDonut = ({ analytics, loading }) => {
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

    if (!analytics?.sessionMetrics) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">No study behavior data available</p>
                    <p className="text-sm mt-1">Start learning to track your study patterns</p>
                </div>
            </div>
        );
    }

    const { sessionMetrics } = analytics;

    // Prepare donut chart data
    const totalHours = sessionMetrics.totalHours || 0;
    const activeHours = sessionMetrics.activeHours || 0;
    const idleHours = Math.max(0, totalHours - activeHours);

    // Time distribution
    const timeByActivity = sessionMetrics.timeByActivity || {};
    const sessionTime = timeByActivity.sessions || 0;
    const selfStudyTime = timeByActivity.selfStudy || 0;
    const assessmentTime = timeByActivity.assessments || 0;
    const materialsTime = timeByActivity.materials || 0;
    const practiceTime = timeByActivity.practice || 0;

    const chartData = {
        labels: ['Live Sessions', 'Self Study', 'Assessments', 'Materials', 'Practice'],
        datasets: [
            {
                label: 'Hours',
                data: [sessionTime, selfStudyTime, assessmentTime, materialsTime, practiceTime],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',    // Indigo
                    'rgba(16, 185, 129, 0.8)',   // Green
                    'rgba(245, 158, 11, 0.8)',   // Orange
                    'rgba(236, 72, 153, 0.8)',   // Pink
                    'rgba(139, 92, 246, 0.8)',   // Purple
                ],
                borderColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(139, 92, 246, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                titleFont: {
                    size: 13,
                    weight: 'bold',
                },
                bodyFont: {
                    size: 12,
                },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = totalHours > 0 ? ((value / totalHours) * 100).toFixed(1) : 0;
                        return `${label}: ${value.toFixed(1)}h (${percentage}%)`;
                    },
                },
            },
        },
        cutout: '65%',
    };

    // Calculate statistics
    const avgSessionDuration = sessionMetrics.averageSessionDuration || 0;
    const totalSessions = sessionMetrics.totalSessions || 0;
    const completionRate = sessionMetrics.completionRate || 0;
    const focusScore = sessionMetrics.focusScore || 0;

    const activities = [
        { name: 'Live Sessions', hours: sessionTime, color: 'bg-indigo-500' },
        { name: 'Self Study', hours: selfStudyTime, color: 'bg-green-500' },
        { name: 'Assessments', hours: assessmentTime, color: 'bg-orange-500' },
        { name: 'Materials', hours: materialsTime, color: 'bg-pink-500' },
        { name: 'Practice', hours: practiceTime, color: 'bg-purple-500' },
    ].filter(activity => activity.hours > 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Study Behavior</h3>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full text-xs font-semibold">
                    {totalHours.toFixed(1)}h Total
                </span>
            </div>

            {/* Donut Chart */}
            <div className="relative mb-6" style={{ height: '280px' }}>
                <Doughnut data={chartData} options={chartOptions} />
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-3xl font-bold text-gray-900">{totalHours.toFixed(1)}</p>
                    <p className="text-sm text-gray-500 font-medium">Total Hours</p>
                </div>
            </div>

            {/* Activity Breakdown */}
            <div className="space-y-2 mb-4">
                {activities.map((activity, index) => {
                    const percentage = totalHours > 0 ? ((activity.hours / totalHours) * 100) : 0;
                    return (
                        <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center flex-1">
                                <div className={`w-2 h-2 rounded-full ${activity.color} mr-2`}></div>
                                <span className="text-gray-700 font-medium">{activity.name}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-1.5 mr-2">
                                    <div
                                        className={`${activity.color} h-1.5 rounded-full transition-all duration-1000`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-gray-900 font-bold w-12 text-right">
                                    {activity.hours.toFixed(1)}h
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Study Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                {/* Average Session Duration */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-gray-600 font-medium">Avg Duration</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{avgSessionDuration.toFixed(1)}h</p>
                </div>

                {/* Total Sessions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-gray-600 font-medium">Sessions</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{totalSessions}</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-gray-600 font-medium">Completion</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{(completionRate * 100).toFixed(0)}%</p>
                </div>

                {/* Focus Score */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3">
                    <div className="flex items-center mb-1">
                        <svg className="w-4 h-4 text-orange-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="text-xs text-gray-600 font-medium">Focus</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{(focusScore * 10).toFixed(1)}/10</p>
                </div>
            </div>

            {/* Study Insight */}
            <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="w-4 h-4 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2">
                        <p className="text-xs text-gray-700">
                            {sessionTime > selfStudyTime ? (
                                <>You're learning effectively through live sessions! Consider balancing with self-study for better retention.</>
                            ) : (
                                <>Great balance between live sessions and self-study! Keep up the good work.</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyBehaviorDonut;
