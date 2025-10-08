import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sessionService } from '../services/sessions';
import Header from '../components/common/Header';
import toast from 'react-hot-toast';
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    XCircleIcon,
    PlayIcon,
} from '@heroicons/react/24/outline';

const Sessions = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        fetchSessions();
        fetchStats();
    }, [filter]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const params = {};

            if (filter === 'upcoming') {
                params.status = 'scheduled';
            } else if (filter === 'completed') {
                params.status = 'completed';
            } else if (filter === 'cancelled') {
                params.status = 'cancelled';
            }

            const response = await sessionService.getAllSessions(params);
            setSessions(response.data?.sessions || response.sessions || []);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const stats = await sessionService.getSessionStats();
            setStats(stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleStartSession = async (sessionId) => {
        try {
            await sessionService.startSession(sessionId);
            toast.success('Session started successfully');
            fetchSessions();
        } catch (error) {
            console.error('Failed to start session:', error);
            toast.error(error.response?.data?.message || 'Failed to start session');
        }
    };

    const handleCompleteSession = async (sessionId) => {
        try {
            await sessionService.completeSession(sessionId, {
                notes: 'Session completed successfully',
            });
            toast.success('Session completed successfully');
            fetchSessions();
        } catch (error) {
            console.error('Failed to complete session:', error);
            toast.error(error.response?.data?.message || 'Failed to complete session');
        }
    };

    const handleCancelSession = async (sessionId) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        try {
            await sessionService.cancelSession(sessionId, reason);
            toast.success('Session cancelled successfully');
            fetchSessions();
        } catch (error) {
            console.error('Failed to cancel session:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel session');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            scheduled: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-bold text-gray-900">My Sessions</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Manage your tutoring sessions and track your progress
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="px-4 sm:px-0 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.total || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                                        <ClockIcon className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.upcoming || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Completed</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.completed || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                        <ClockIcon className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Hours</p>
                                        <p className="text-2xl font-semibold text-gray-900">{stats.totalHours || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="px-4 sm:px-0 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === f
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sessions List */}
                <div className="px-4 sm:px-0">
                    {sessions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filter === 'all'
                                    ? 'You have no sessions yet. Start by finding a tutor or creating a session.'
                                    : `You have no ${filter} sessions.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <div key={session._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {session.skill?.name || 'Session'}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                            session.status
                                                        )}`}
                                                    >
                                                        {session.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <CalendarIcon className="h-5 w-5 mr-2" />
                                                        {formatDate(session.scheduledDate)}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <ClockIcon className="h-5 w-5 mr-2" />
                                                        {formatTime(session.scheduledDate)} ({session.duration} min)
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <UserIcon className="h-5 w-5 mr-2" />
                                                        {user?.role === 'tutor'
                                                            ? session.learner?.name || 'Student'
                                                            : session.tutor?.name || 'Tutor'}
                                                    </div>
                                                    {session.price && (
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <span className="font-semibold">${session.price}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {session.description && (
                                                    <p className="mt-3 text-sm text-gray-600">{session.description}</p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="ml-4 flex flex-col gap-2">
                                                {session.status === 'scheduled' && (
                                                    <>
                                                        {user?.role === 'tutor' && (
                                                            <button
                                                                onClick={() => handleStartSession(session._id)}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
                                                            >
                                                                <PlayIcon className="h-4 w-4 mr-1" />
                                                                Start
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleCancelSession(session._id)}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                )}
                                                {session.status === 'in_progress' && user?.role === 'tutor' && (
                                                    <button
                                                        onClick={() => handleCompleteSession(session._id)}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center"
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                        Complete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sessions;
