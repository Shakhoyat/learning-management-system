import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notifications';
import NotificationPanel from '../notifications/NotificationPanel';
import {
    AcademicCapIcon,
    BellIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadUnreadCount();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadUnreadCount = async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count || 0);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
    };

    const handleNotificationToggle = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setIsProfileOpen(false);
    };

    const handleProfileToggle = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsNotificationOpen(false);
    };

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Sessions', href: '/sessions' },
        { name: 'Skills', href: '/skills' },
        { name: user?.role === 'tutor' ? 'Find Learners' : 'Find Tutors', href: user?.role === 'tutor' ? '/find-learners' : '/find-tutors' },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">LearnConnect</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={handleNotificationToggle}
                                className="text-gray-400 hover:text-gray-500 relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
                            >
                                <BellIcon className="h-6 w-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <NotificationPanel
                                isOpen={isNotificationOpen}
                                onClose={() => setIsNotificationOpen(false)}
                            />
                        </div>

                        {/* Profile dropdown */}
                        <div className="relative">
                            <button
                                onClick={handleProfileToggle}
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <span className="text-white font-medium">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="ml-2 text-gray-700 font-medium">{user?.name}</span>
                                <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                                        {user?.email}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        Profile Settings
                                    </Link>
                                    <Link
                                        to="/profile?tab=settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        Account Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;