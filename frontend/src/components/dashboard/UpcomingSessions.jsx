import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const UpcomingSessions = ({ userRole }) => {
    // Mock sessions data
    const mockSessions = [
        {
            id: 1,
            title: 'React Hooks Deep Dive',
            skill: 'React.js',
            participant: userRole === 'tutor' ? 'Sarah Chen' : 'John Smith',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            duration: 60,
            status: 'confirmed'
        },
        {
            id: 2,
            title: 'Database Design Fundamentals',
            skill: 'SQL',
            participant: userRole === 'tutor' ? 'Mike Johnson' : 'Alice Brown',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            duration: 90,
            status: 'confirmed'
        },
        {
            id: 3,
            title: 'Advanced Python Concepts',
            skill: 'Python',
            participant: userRole === 'tutor' ? 'Emma Wilson' : 'David Lee',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
            duration: 120,
            status: 'pending'
        }
    ];

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            confirmed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Upcoming Sessions
                </h3>

                {mockSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {userRole === 'tutor'
                                ? 'Create a new session or wait for booking requests.'
                                : 'Book a session with a tutor to get started.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mockSessions.map((session) => (
                            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{session.skill}</p>

                                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <UserIcon className="h-4 w-4 mr-1" />
                                                {userRole === 'tutor' ? 'Student' : 'Tutor'}: {session.participant}
                                            </div>
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1" />
                                                {formatDate(session.date)}
                                            </div>
                                            <div className="flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {session.duration} min
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        {getStatusBadge(session.status)}
                                    </div>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                        View Details
                                    </button>
                                    {session.status === 'pending' && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                                                Confirm
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    <button className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        {userRole === 'tutor' ? 'Create New Session' : 'Browse Tutors'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingSessions;