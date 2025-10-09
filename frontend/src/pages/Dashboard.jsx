import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import DashboardStats from '../components/dashboard/DashboardStats';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {user?.role === 'tutor'
                            ? "Here's what's happening with your tutoring sessions today."
                            : "Continue your learning journey with upcoming sessions and new opportunities."
                        }
                    </p>
                </div>

                {/* Dashboard Stats */}
                <div className="px-4 sm:px-0 mb-8">
                    <DashboardStats userRole={user?.role} />
                </div>

                {/* Main Content Grid */}
                <div className="px-4 sm:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Sessions */}
                        <div className="lg:col-span-2 space-y-8">
                            <UpcomingSessions userRole={user?.role} />

                            {/* Recent Activity */}
                            <RecentActivity />
                        </div>

                        {/* Right Column - Quick Actions */}
                        <div className="lg:col-span-1">
                            <QuickActions userRole={user?.role} />

                            {/* Progress Overview */}
                            <div className="bg-white shadow rounded-lg mt-8">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        {user?.role === 'tutor' ? 'Teaching Progress' : 'Learning Progress'}
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">This Month</span>
                                                <span className="font-medium">
                                                    {user?.role === 'tutor' ? '12 sessions' : '8 sessions'}
                                                </span>
                                            </div>
                                            <div className="mt-1 bg-gray-200 rounded-full h-2">
                                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {user?.role === 'tutor' ? 'Monthly Goal' : 'Learning Goals'}
                                                </span>
                                                <span className="font-medium">75%</span>
                                            </div>
                                            <div className="mt-1 bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button className="w-full bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                            View Detailed Analytics
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;