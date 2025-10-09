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
                return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            case 'session_booked':
            case 'session_scheduled':
                return <CalendarIcon className="h-5 w-5 text-blue-600" />;
            case 'session_feedback':
            case 'rating_received':
                return <StarIcon className="h-5 w-5 text-yellow-600" />;
            case 'match_found':
                return <UserGroupIcon className="h-5 w-5 text-purple-600" />;
            case 'skill_updated':
                return <AcademicCapIcon className="h-5 w-5 text-indigo-600" />;
            default:
                return <BellIcon className="h-5 w-5 text-gray-600" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'session_completed':
                return 'bg-green-100';
            case 'session_booked':
            case 'session_scheduled':
                return 'bg-blue-100';
            case 'session_feedback':
            case 'rating_received':
                return 'bg-yellow-100';
            case 'match_found':
                return 'bg-purple-100';
            case 'skill_updated':
                return 'bg-indigo-100';
            default:
                return 'bg-gray-100';
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
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start space-x-3 animate-pulse">
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Activity
                </h3>
                
                {activities.length === 0 ? (
                    <div className="text-center py-6">
                        <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No recent activity</p>
                        <p className="text-xs text-gray-400">Your recent activities will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div key={activity._id} className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className={`h-8 w-8 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center`}>
                                        {getActivityIcon(activity.type, activity.category)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">
                                        {activity.message || activity.content}
                                    </p>
                                    <p className="text-sm text-gray-500">
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
