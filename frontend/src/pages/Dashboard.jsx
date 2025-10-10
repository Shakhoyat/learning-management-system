import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import DashboardStats from '../components/dashboard/DashboardStats';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="mt-2 text-lg text-slate-600">
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
                            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50 mt-8">
                                <div className="px-6 py-6 sm:p-8">
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">
                                        {user?.role === 'tutor' ? 'Teaching Progress' : 'Learning Progress'}
                                    </h3>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600 font-medium">This Month</span>
                                                <span className="font-bold text-slate-900">
                                                    {user?.role === 'tutor' ? '12 sessions' : '8 sessions'}
                                                </span>
                                            </div>
                                            <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-600 font-medium">
                                                    {user?.role === 'tutor' ? 'Monthly Goal' : 'Learning Goals'}
                                                </span>
                                                <span className="font-bold text-slate-900">75%</span>
                                            </div>
                                            <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <button
                                            onClick={() => navigate('/analytics')}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
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