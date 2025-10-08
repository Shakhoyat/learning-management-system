import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    HomeIcon,
    UserIcon,
    BookOpenIcon,
    CalendarIcon,
    ChartBarIcon,
    CogIcon,
    BellIcon,
    MagnifyingGlassIcon,
    Bars3Icon,
    XMarkIcon,
    ChatBubbleLeftRightIcon,
    CreditCardIcon,
    AcademicCapIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';
import DashboardHome from '../components/dashboard/DashboardHome';
import Profile from '../components/dashboard/Profile';
import Skills from '../components/dashboard/Skills';
import Sessions from '../components/dashboard/Sessions';
import Analytics from '../components/dashboard/Analytics';
import Settings from '../components/dashboard/Settings';
import Notifications from '../components/dashboard/Notifications';
import Messages from '../components/dashboard/Messages';
import Payments from '../components/dashboard/Payments';
import Matching from '../components/dashboard/Matching';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location.pathname === '/dashboard' },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon, current: location.pathname === '/dashboard/profile' },
        { name: 'Skills', href: '/dashboard/skills', icon: AcademicCapIcon, current: location.pathname === '/dashboard/skills' },
        { name: 'Sessions', href: '/dashboard/sessions', icon: CalendarIcon, current: location.pathname === '/dashboard/sessions' },
        { name: 'Matching', href: '/dashboard/matching', icon: UsersIcon, current: location.pathname === '/dashboard/matching' },
        { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon, current: location.pathname === '/dashboard/messages' },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon, current: location.pathname === '/dashboard/payments' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, current: location.pathname === '/dashboard/analytics' },
        { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, current: location.pathname === '/dashboard/notifications' },
        { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, current: location.pathname === '/dashboard/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />

                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XMarkIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>

                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <BookOpenIcon className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">EduMentor</span>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`${item.current
                                            ? 'bg-primary-100 text-primary-900'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon
                                        className={`${item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                            } mr-4 flex-shrink-0 h-6 w-6`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
                        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                            <div className="flex items-center flex-shrink-0 px-4">
                                <BookOpenIcon className="h-8 w-8 text-primary-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">EduMentor</span>
                            </div>
                            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${item.current
                                                ? 'bg-primary-100 text-primary-900'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                                    >
                                        <item.icon
                                            className={`${item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                                                } mr-3 flex-shrink-0 h-6 w-6`}
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* User section */}
                        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                            <div className="flex items-center">
                                <div>
                                    <img
                                        className="inline-block h-9 w-9 rounded-full"
                                        src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff`}
                                        alt=""
                                    />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {user?.firstName} {user?.lastName}
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Top bar */}
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex">
                            <div className="w-full flex md:ml-0">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="search-field"
                                        className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                                        placeholder="Search..."
                                        type="search"
                                        name="search"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ml-4 flex items-center md:ml-6">
                            {/* Notifications */}
                            <Link
                                to="/dashboard/notifications"
                                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                <BellIcon className="h-6 w-6" />
                            </Link>

                            {/* Profile dropdown */}
                            <div className="ml-3 relative">
                                <img
                                    className="h-8 w-8 rounded-full cursor-pointer"
                                    src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff`}
                                    alt=""
                                    onClick={() => navigate('/dashboard/profile')}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <Routes>
                                <Route path="/" element={<DashboardHome />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/skills" element={<Skills />} />
                                <Route path="/sessions" element={<Sessions />} />
                                <Route path="/matching" element={<Matching />} />
                                <Route path="/messages" element={<Messages />} />
                                <Route path="/payments" element={<Payments />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;