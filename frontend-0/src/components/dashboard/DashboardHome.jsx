import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    CalendarIcon,
    ClockIcon,
    ChartBarIcon,
    BookOpenIcon,
    UsersIcon,
    BellIcon,
    ArrowRightIcon,
    StarIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../LoadingSpinner';

const DashboardHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSessions: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        totalHours: 0,
        averageRating: 0,
        skillsLearned: 0,
    });
    const [recentSessions, setRecentSessions] = useState([]);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulated data - replace with actual API calls
        setTimeout(() => {
            setStats({
                totalSessions: 24,
                completedSessions: 18,
                upcomingSessions: 3,
                totalHours: 42.5,
                averageRating: 4.8,
                skillsLearned: 8,
            });

            setRecentSessions([
                {
                    id: 1,
                    title: 'React Advanced Patterns',
                    tutor: 'Sarah Johnson',
                    date: '2025-01-08',
                    time: '2:00 PM',
                    duration: 60,
                    status: 'completed',
                    rating: 5,
                },
                {
                    id: 2,
                    title: 'Node.js API Development',
                    tutor: 'Michael Chen',
                    date: '2025-01-07',
                    time: '10:00 AM',
                    duration: 90,
                    status: 'completed',
                    rating: 4,
                },
                {
                    id: 3,
                    title: 'Database Design Principles',
                    tutor: 'Emily Rodriguez',
                    date: '2025-01-06',
                    time: '3:30 PM',
                    duration: 75,
                    status: 'completed',
                    rating: 5,
                },
            ]);

            setUpcomingSessions([
                {
                    id: 4,
                    title: 'TypeScript Fundamentals',
                    tutor: 'David Wilson',
                    date: '2025-01-10',
                    time: '11:00 AM',
                    duration: 60,
                    status: 'scheduled',
                },
                {
                    id: 5,
                    title: 'GraphQL Implementation',
                    tutor: 'Lisa Anderson',
                    date: '2025-01-12',
                    time: '2:30 PM',
                    duration: 90,
                    status: 'scheduled',
                },
                {
                    id: 6,
                    title: 'System Design Interview Prep',
                    tutor: 'James Taylor',
                    date: '2025-01-15',
                    time: '4:00 PM',
                    duration: 120,
                    status: 'scheduled',
                },
            ]);

            setNotifications([
                {
                    id: 1,
                    type: 'session',
                    title: 'Session Reminder',
                    message: 'TypeScript Fundamentals starts in 2 hours',
                    time: '2 hours ago',
                    read: false,
                },
                {
                    id: 2,
                    type: 'achievement',
                    title: 'New Achievement!',
                    message: 'You\'ve completed 20 learning sessions',
                    time: '1 day ago',
                    read: false,
                },
                {
                    id: 3,
                    type: 'message',
                    title: 'New Message',
                    message: 'Sarah Johnson sent you a message',
                    time: '2 days ago',
                    read: true,
                },
            ]);

            setIsLoading(false);
        }, 1000);
    }, []);

    const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                                {trend && (
                                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {trend > 0 ? '+' : ''}{trend}%
                                    </div>
                                )}
                            </dd>
                            {subtitle && <dd className="text-sm text-gray-500">{subtitle}</dd>}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );

    const SessionCard = ({ session, showActions = false }) => (
        <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{session.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">with {session.tutor}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {session.date} at {session.time}
                        <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                        {session.duration} min
                    </div>
                    {session.status === 'completed' && session.rating && (
                        <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : session.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {session.status}
                    </span>
                    {showActions && (
                        <div className="mt-2 flex space-x-2">
                            <button className="text-xs text-primary-600 hover:text-primary-500">
                                Join
                            </button>
                            <button className="text-xs text-gray-600 hover:text-gray-500">
                                Reschedule
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold">
                    Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="mt-2 text-primary-100">
                    Ready to continue your learning journey? You have {stats.upcomingSessions} upcoming sessions.
                </p>
                <div className="mt-4 flex space-x-3">
                    <Link
                        to="/dashboard/sessions"
                        className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        View Schedule
                    </Link>
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-400 transition-colors flex items-center">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Book Session
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Sessions"
                    value={stats.totalSessions}
                    subtitle="All time"
                    icon={BookOpenIcon}
                    color="text-blue-600"
                    trend={12}
                />
                <StatCard
                    title="Learning Hours"
                    value={`${stats.totalHours}h`}
                    subtitle="This month"
                    icon={ClockIcon}
                    color="text-green-600"
                    trend={8}
                />
                <StatCard
                    title="Average Rating"
                    value={stats.averageRating}
                    subtitle="From tutors"
                    icon={StarIcon}
                    color="text-yellow-600"
                />
                <StatCard
                    title="Skills Learned"
                    value={stats.skillsLearned}
                    subtitle="Completed"
                    icon={AcademicCapIcon}
                    color="text-purple-600"
                    trend={15}
                />
                <StatCard
                    title="Upcoming Sessions"
                    value={stats.upcomingSessions}
                    subtitle="This week"
                    icon={CalendarIcon}
                    color="text-indigo-600"
                />
                <StatCard
                    title="Study Streak"
                    value="7 days"
                    subtitle="Current streak"
                    icon={ChartBarIcon}
                    color="text-red-600"
                    trend={5}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Sessions */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Recent Sessions</h3>
                                <Link
                                    to="/dashboard/sessions"
                                    className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                                >
                                    View all
                                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {recentSessions.map((session) => (
                                <SessionCard key={session.id} session={session} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Sessions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {upcomingSessions.slice(0, 3).map((session) => (
                                <SessionCard key={session.id} session={session} showActions />
                            ))}
                            <Link
                                to="/dashboard/sessions"
                                className="block w-full text-center py-2 text-sm text-primary-600 hover:text-primary-500"
                            >
                                View all upcoming sessions
                            </Link>
                        </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                                <Link
                                    to="/dashboard/notifications"
                                    className="text-sm text-primary-600 hover:text-primary-500"
                                >
                                    View all
                                </Link>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {notifications.slice(0, 3).map((notification) => (
                                <div key={notification.id} className="flex items-start space-x-3">
                                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-primary-600'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <Link
                                to="/dashboard/sessions"
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <CalendarIcon className="h-5 w-5 text-gray-600 mr-3" />
                                <span className="text-sm font-medium text-gray-900">Book a Session</span>
                            </Link>
                            <Link
                                to="/dashboard/matching"
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <UsersIcon className="h-5 w-5 text-gray-600 mr-3" />
                                <span className="text-sm font-medium text-gray-900">Find a Tutor</span>
                            </Link>
                            <Link
                                to="/dashboard/skills"
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <AcademicCapIcon className="h-5 w-5 text-gray-600 mr-3" />
                                <span className="text-sm font-medium text-gray-900">Browse Skills</span>
                            </Link>
                            <Link
                                to="/dashboard/analytics"
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ChartBarIcon className="h-5 w-5 text-gray-600 mr-3" />
                                <span className="text-sm font-medium text-gray-900">View Progress</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;