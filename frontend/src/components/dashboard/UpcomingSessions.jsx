import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { sessionService } from '../../services/sessions';

const UpcomingSessions = ({ userRole }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUpcomingSessions();
    }, []);

    const fetchUpcomingSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await sessionService.getUpcomingSessions();
            console.log('Upcoming sessions response:', response);
            setSessions(response || []);
        } catch (err) {
            setError('Failed to load upcoming sessions');
            console.error('Error fetching upcoming sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
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
            scheduled: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const handleSessionAction = async (sessionId, action) => {
        try {
            if (action === 'confirm') {
                await sessionService.updateSession(sessionId, { status: 'confirmed' });
            } else if (action === 'cancel') {
                await sessionService.cancelSession(sessionId, 'Cancelled by user');
            }
            // Refresh the sessions list
            fetchUpcomingSessions();
        } catch (err) {
            console.error(`Error ${action}ing session:`, err);
            setError(`Failed to ${action} session`);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Upcoming Sessions
                    </h3>
                    <button
                        onClick={fetchUpcomingSessions}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading sessions...</p>
                    </div>
                ) : sessions.length === 0 ? (
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
                        {sessions.map((session) => (
                            <div key={session._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{session.skill?.name || 'N/A'}</p>

                                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <UserIcon className="h-4 w-4 mr-1" />
                                                {userRole === 'tutor' ? 'Student' : 'Tutor'}: {
                                                    userRole === 'tutor'
                                                        ? session.learner?.name
                                                        : session.tutor?.name
                                                }
                                            </div>
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-1" />
                                                {formatDate(session.scheduledDate)}
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
                                            <button
                                                onClick={() => handleSessionAction(session._id, 'confirm')}
                                                className="text-green-600 hover:text-green-900 text-sm font-medium"
                                            >
                                                Confirm
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                onClick={() => handleSessionAction(session._id, 'cancel')}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                                            >
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
                    {userRole === 'tutor' ? (
                        <Link
                            to="/sessions/create"
                            className="block w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                        >
                            Create New Session
                        </Link>
                    ) : (
                        <Link
                            to="/find-tutors"
                            className="block w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
                        >
                            Browse Tutors
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingSessions;