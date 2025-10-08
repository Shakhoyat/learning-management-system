import React from 'react';
import {
    AcademicCapIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    StarIcon,
    ClockIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ userRole }) => {
    // Mock stats data
    const tutorStats = [
        {
            title: 'Total Sessions',
            value: 42,
            icon: CalendarIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Total Earnings',
            value: '$2,340',
            icon: CurrencyDollarIcon,
            color: 'bg-green-500'
        },
        {
            title: 'Average Rating',
            value: '4.8/5',
            icon: StarIcon,
            color: 'bg-yellow-500'
        },
        {
            title: 'Hours Taught',
            value: '68h',
            icon: ClockIcon,
            color: 'bg-purple-500'
        }
    ];

    const learnerStats = [
        {
            title: 'Sessions Attended',
            value: 15,
            icon: CalendarIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Total Spent',
            value: '$890',
            icon: CurrencyDollarIcon,
            color: 'bg-green-500'
        },
        {
            title: 'Skills Learning',
            value: 4,
            icon: AcademicCapIcon,
            color: 'bg-indigo-500'
        },
        {
            title: 'Hours Learned',
            value: '32h',
            icon: ClockIcon,
            color: 'bg-purple-500'
        }
    ];

    const displayStats = userRole === 'tutor' ? tutorStats : learnerStats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayStats.map((stat, index) => (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                        {stat.title}
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {stat.value}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;