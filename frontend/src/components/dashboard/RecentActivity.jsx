import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notifications';
import {
    CheckCircleIcon,
    CalendarIcon,
    StarIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentActivity();
    }, []);

    const loadRecentActivity = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications({
                limit: 5,
                page: 1
            });

            // Extract notifications from response
            const notifications = response?.data?.notifications || response?.notifications || [];
            setActivities(notifications);
        } catch (error) {
            console.error('Failed to load recent activity:', error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type, category) => {
        switch (type) {
            case 'session_completed':
                return <CheckCircleIcon className="h-5 w-5 text-emerald-600" />;
            case 'session_booked':
            case 'session_scheduled':
                return <CalendarIcon className="h-5 w-5 text-blue-600" />;
            case 'session_feedback':
            case 'rating_received':
                return <StarIcon className="h-5 w-5 text-amber-600" />;
            case 'match_found':
                return <UserGroupIcon className="h-5 w-5 text-purple-600" />;
            case 'skill_updated':
                return <AcademicCapIcon className="h-5 w-5 text-indigo-600" />;
            default:
                return <BellIcon className="h-5 w-5 text-slate-600" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'session_completed':
                return 'bg-emerald-100 border-emerald-200';
            case 'session_booked':
            case 'session_scheduled':
                return 'bg-blue-100 border-blue-200';
            case 'session_feedback':
            case 'rating_received':
                return 'bg-amber-100 border-amber-200';
            case 'match_found':
                return 'bg-purple-100 border-purple-200';
            case 'skill_updated':
                return 'bg-indigo-100 border-indigo-200';
            default:
                return 'bg-slate-100 border-slate-200';
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const activityDate = new Date(date);
        const diffInSeconds = Math.floor((now - activityDate) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
            return activityDate.toLocaleDateString();
        }
    };

    if (loading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50">
                <div className="px-6 py-6 sm:p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-4 animate-pulse">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-xl bg-slate-200"></div>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded-lg w-3/4"></div>
                                    <div className="h-3 bg-slate-200 rounded-lg w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50">
            <div className="px-6 py-6 sm:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Recent Activity
                </h3>

                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <BellIcon className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-lg font-semibold text-slate-900 mb-2">No recent activity</p>
                        <p className="text-slate-600">Your recent activities will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity._id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 group">
                                <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-xl border ${getActivityColor(activity.type)} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                        {getActivityIcon(activity.type, activity.category)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                                        {activity.message || activity.content}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        {formatTimeAgo(activity.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
