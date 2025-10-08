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

const QuickActions = ({ userRole }) => {
    const tutorActions = [
        {
            title: 'Create Session',
            description: 'Schedule a new tutoring session',
            href: '#',
            icon: PlusIcon,
            color: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            title: 'Find Learners',
            description: 'Browse students looking for tutoring',
            href: '#',
            icon: MagnifyingGlassIcon,
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Manage Skills',
            description: 'Update your teaching skills',
            href: '#',
            icon: AcademicCapIcon,
            color: 'bg-purple-600 hover:bg-purple-700'
        },
        {
            title: 'View Earnings',
            description: 'Check your payment history',
            href: '#',
            icon: CurrencyDollarIcon,
            color: 'bg-yellow-600 hover:bg-yellow-700'
        }
    ];

    const learnerActions = [
        {
            title: 'Find Tutors',
            description: 'Search for expert tutors',
            href: '#',
            icon: MagnifyingGlassIcon,
            color: 'bg-indigo-600 hover:bg-indigo-700'
        },
        {
            title: 'My Sessions',
            description: 'View upcoming and past sessions',
            href: '#',
            icon: CalendarIcon,
            color: 'bg-blue-600 hover:bg-blue-700'
        },
        {
            title: 'Learning Goals',
            description: 'Set and track your goals',
            href: '#',
            icon: AcademicCapIcon,
            color: 'bg-green-600 hover:bg-green-700'
        },
        {
            title: 'Browse Skills',
            description: 'Explore skills to learn',
            href: '#',
            icon: AcademicCapIcon,
            color: 'bg-purple-600 hover:bg-purple-700'
        }
    ];

    const actions = userRole === 'tutor' ? tutorActions : learnerActions;

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                </h3>
                <div className="space-y-3">
                    {actions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.href}
                            className={`${action.color} text-white p-4 rounded-lg block transition-colors`}
                        >
                            <div className="flex items-center">
                                <action.icon className="h-6 w-6 mr-3" />
                                <div>
                                    <div className="font-medium">{action.title}</div>
                                    <div className="text-sm opacity-90">{action.description}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Notifications Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link
                        to="#"
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900"
                    >
                        <div className="flex items-center">
                            <BellIcon className="h-5 w-5 mr-2" />
                            <span>Notifications</span>
                        </div>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            3
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;