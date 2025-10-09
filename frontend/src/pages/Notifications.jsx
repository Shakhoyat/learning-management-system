import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notifications';
import Header from '../components/common/Header';
import {
    CheckCircleIcon,
    CalendarIcon,
    StarIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BellIcon,
    FunnelIcon,
    XMarkIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalNotifications: 0
    });

    useEffect(() => {
        loadNotifications();
    }, [filter, categoryFilter, pagination.currentPage]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.currentPage,
                limit: 20
            };

            if (filter === 'unread') {
                params.unreadOnly = true;
            }

            if (categoryFilter) {
                params.category = categoryFilter;
            }

            const response = await notificationService.getNotifications(params);
            const notificationsList = response?.data?.notifications || response?.notifications || [];
            const paginationData = response?.data?.pagination || {};

            setNotifications(notificationsList);
            setPagination({
                currentPage: paginationData.currentPage || 1,
                totalPages: paginationData.totalPages || 1,
                totalNotifications: paginationData.totalNotifications || 0
            });
        } catch (error) {
            console.error('Failed to load notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(notifications.map(notif =>
                notif._id === notificationId
                    ? { ...notif, channels: { ...notif.channels, inApp: { ...notif.channels.inApp, read: true } } }
                    : notif
            ));
            toast.success('Marked as read');
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            toast.error('Failed to update notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(notif => ({
                ...notif,
                channels: { ...notif.channels, inApp: { ...notif.channels.inApp, read: true } }
            })));
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            toast.error('Failed to update notifications');
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await notificationService.deleteNotification(notificationId);
            setNotifications(notifications.filter(notif => notif._id !== notificationId));
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Failed to delete notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'session_completed':
                return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
            case 'session_booked':
            case 'session_scheduled':
            case 'session_reminder':
                return <CalendarIcon className="h-6 w-6 text-blue-600" />;
            case 'session_feedback':
            case 'rating_received':
                return <StarIcon className="h-6 w-6 text-yellow-600" />;
            case 'match_found':
                return <UserGroupIcon className="h-6 w-6 text-purple-600" />;
            case 'skill_updated':
                return <AcademicCapIcon className="h-6 w-6 text-indigo-600" />;
            default:
                return <BellIcon className="h-6 w-6 text-gray-600" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'session_completed':
                return 'bg-green-100';
            case 'session_booked':
            case 'session_scheduled':
            case 'session_reminder':
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

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.filter(n => !n.channels?.inApp?.read).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                Filters
                            </button>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    <CheckIcon className="h-4 w-4 mr-2" />
                                    Mark All Read
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="px-4 sm:px-0 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            All
                                        </button>
                                        <button
                                            onClick={() => setFilter('unread')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'unread'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Unread
                                        </button>
                                        <button
                                            onClick={() => setFilter('read')}
                                            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'read'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            Read
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="session">Sessions</option>
                                        <option value="matching">Matching</option>
                                        <option value="skill">Skills</option>
                                        <option value="payment">Payments</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notifications List */}
                <div className="px-4 sm:px-0">
                    {loading ? (
                        <div className="bg-white shadow rounded-lg p-8">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="bg-white shadow rounded-lg p-12 text-center">
                            <BellIcon className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {filter === 'unread'
                                    ? "You don't have any unread notifications"
                                    : "You're all caught up!"}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {notifications.map((notification) => {
                                    const isUnread = !notification.channels?.inApp?.read;
                                    return (
                                        <li
                                            key={notification._id}
                                            className={`px-6 py-4 hover:bg-gray-50 transition-colors ${isUnread ? 'bg-indigo-50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`flex-shrink-0 h-12 w-12 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center`}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                                {notification.message || notification.content}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatDateTime(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                        {isUnread && (
                                                            <div className="flex-shrink-0 ml-4">
                                                                <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-3 flex items-center space-x-4">
                                                        {isUnread && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification._id)}
                                                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(notification._id)}
                                                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-white px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing page {pagination.currentPage} of {pagination.totalPages}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                                                disabled={pagination.currentPage === 1}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                                                disabled={pagination.currentPage >= pagination.totalPages}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
