import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notifications';
import {
    CheckCircleIcon,
    CalendarIcon,
    StarIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BellIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const NotificationPanel = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            loadNotifications();
        }
    }, [isOpen]);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationService.getNotifications({
                limit: 10,
                page: 1
            });

            const notificationsList = response?.data?.notifications || response?.notifications || [];
            setNotifications(notificationsList);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId, event) => {
        event.stopPropagation();
        try {
            await notificationService.markAsRead(notificationId);
            // Update local state
            setNotifications(notifications.map(notif =>
                notif._id === notificationId
                    ? { ...notif, channels: { ...notif.channels, inApp: { ...notif.channels.inApp, read: true } } }
                    : notif
            ));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            // Update local state
            setNotifications(notifications.map(notif => ({
                ...notif,
                channels: { ...notif.channels, inApp: { ...notif.channels.inApp, read: true } }
            })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'session_completed':
                return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
            case 'session_booked':
            case 'session_scheduled':
            case 'session_reminder':
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

    const formatTimeAgo = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInSeconds = Math.floor((now - notificationDate) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        } else {
            return notificationDate.toLocaleDateString();
        }
    };

    const unreadCount = notifications.filter(n => !n.channels?.inApp?.read).length;

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-30"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-40 max-h-[32rem] flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <p className="text-xs text-gray-500">{unreadCount} unread</p>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">No notifications</p>
                            <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => {
                                const isUnread = !notification.channels?.inApp?.read;
                                return (
                                    <div
                                        key={notification._id}
                                        className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? 'bg-indigo-50' : ''
                                            }`}
                                        onClick={(e) => {
                                            if (isUnread) {
                                                handleMarkAsRead(notification._id, e);
                                            }
                                        }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                    {notification.message || notification.content}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                            {isUnread && (
                                                <div className="flex-shrink-0">
                                                    <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                        <Link
                            to="/notifications"
                            className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            onClick={onClose}
                        >
                            View all notifications
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default NotificationPanel;
