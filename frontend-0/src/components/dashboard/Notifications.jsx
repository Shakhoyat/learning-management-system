import React from 'react';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
    const notifications = [
        {
            id: 1,
            type: 'session',
            title: 'Session Reminder',
            message: 'TypeScript Fundamentals starts in 2 hours with David Wilson',
            time: '2 hours ago',
            read: false,
        },
        {
            id: 2,
            type: 'achievement',
            title: 'New Achievement!',
            message: 'You\'ve completed 20 learning sessions. Keep up the great work!',
            time: '1 day ago',
            read: false,
        },
        {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'Sarah Johnson sent you a message about your upcoming React session',
            time: '2 days ago',
            read: true,
        },
        {
            id: 4,
            type: 'payment',
            title: 'Payment Confirmed',
            message: 'Your payment of $75 for the React session has been processed',
            time: '3 days ago',
            read: true,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600">Stay updated with your learning activities</p>
                </div>
                <button className="text-sm text-primary-600 hover:text-primary-500">
                    Mark all as read
                </button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="divide-y divide-gray-200">
                    {notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`p-6 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-primary-600'
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            {!notification.read && (
                                                <button className="text-primary-600 hover:text-primary-500">
                                                    <CheckIcon className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button className="text-gray-400 hover:text-gray-500">
                                                <XMarkIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-12">
                    <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">You're all caught up!</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;