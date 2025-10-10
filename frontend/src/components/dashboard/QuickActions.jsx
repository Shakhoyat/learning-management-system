import React from 'react';
import { Link } from 'react-router-dom';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    AcademicCapIcon,
    CurrencyDollarIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ userRole, userStats }) => {
    const tutorActions = [
        {
            title: 'Create Session',
            description: 'Schedule a new tutoring session',
            href: '/sessions/create',
            icon: PlusIcon,
            gradient: 'from-indigo-600 to-purple-600',
            hoverGradient: 'from-indigo-700 to-purple-700'
        },
        {
            title: 'Find Learners',
            description: 'Browse students looking for tutoring',
            href: '/find-learners',
            icon: MagnifyingGlassIcon,
            gradient: 'from-emerald-500 to-teal-600',
            hoverGradient: 'from-emerald-600 to-teal-700'
        },
        {
            title: 'Manage Skills',
            description: 'Update your teaching skills',
            href: '/profile?tab=skills',
            icon: AcademicCapIcon,
            gradient: 'from-purple-500 to-indigo-600',
            hoverGradient: 'from-purple-600 to-indigo-700'
        },
        {
            title: 'View Earnings',
            description: 'Check your payment history',
            href: '/payments',
            icon: CurrencyDollarIcon,
            gradient: 'from-amber-500 to-orange-600',
            hoverGradient: 'from-amber-600 to-orange-700'
        }
    ];

    const learnerActions = [
        {
            title: 'Find Tutors',
            description: 'Search for expert tutors',
            href: '/find-tutors',
            icon: MagnifyingGlassIcon,
            gradient: 'from-indigo-600 to-purple-600',
            hoverGradient: 'from-indigo-700 to-purple-700'
        },
        {
            title: 'My Sessions',
            description: 'View upcoming and past sessions',
            href: '/sessions',
            icon: CalendarIcon,
            gradient: 'from-blue-500 to-indigo-600',
            hoverGradient: 'from-blue-600 to-indigo-700'
        },
        {
            title: 'Learning Goals',
            description: 'Set and track your goals',
            href: '/profile?tab=goals',
            icon: AcademicCapIcon,
            gradient: 'from-emerald-500 to-teal-600',
            hoverGradient: 'from-emerald-600 to-teal-700'
        },
        {
            title: 'Browse Skills',
            description: 'Explore skills to learn',
            href: '/skills',
            icon: AcademicCapIcon,
            gradient: 'from-purple-500 to-indigo-600',
            hoverGradient: 'from-purple-600 to-indigo-700'
        }
    ];

    const actions = userRole === 'tutor' ? tutorActions : learnerActions;

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200/50">
            <div className="px-6 py-6 sm:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Quick Actions
                </h3>
                <div className="space-y-4">
                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.href}
                            className={`group bg-gradient-to-r ${action.gradient} hover:${action.hoverGradient} text-white p-5 rounded-xl block transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                        >
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-colors">
                                    <action.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="font-semibold text-lg">{action.title}</div>
                                    <div className="text-sm opacity-90 mt-1">{action.description}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Notifications Summary */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                    <Link
                        to="/notifications"
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200 group"
                    >
                        <div className="flex items-center">
                            <div className="p-2 bg-indigo-100 rounded-lg mr-3 group-hover:bg-indigo-200 transition-colors">
                                <BellIcon className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-slate-700">Notifications</span>
                        </div>
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {userStats?.unreadNotifications || 0}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;