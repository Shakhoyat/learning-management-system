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
            scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
            confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200',
            completed: 'bg-slate-100 text-slate-700 border-slate-200'
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
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
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50">
            <div className="px-6 py-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900">
                        Upcoming Sessions
                    </h3>
                    <button
                        onClick={fetchUpcomingSessions}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-3 text-sm text-slate-500 font-medium">Loading sessions...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CalendarIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming sessions</h3>
                        <p className="text-slate-600">
                            {userRole === 'tutor'
                                ? 'Create a new session or wait for booking requests.'
                                : 'Book a session with a tutor to get started.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session._id} className="border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{session.title}</h4>
                                        <p className="text-slate-600 mt-1 font-medium">{session.skill?.name || 'N/A'}</p>

                                        <div className="flex items-center mt-3 space-x-6 text-sm text-slate-500">
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