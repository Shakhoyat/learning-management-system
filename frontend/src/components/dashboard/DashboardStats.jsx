import React from 'react';
import {
    AcademicCapIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    StarIcon,
    ClockIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats, userRole }) => {
    if (!stats) return null;

    const tutorStats = [
        {
            title: 'Total Sessions',
            value: stats.totalSessions || 0,
            icon: CalendarIcon,
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Total Earnings',
            value: `$${stats.totalEarnings || 0}`,
            icon: CurrencyDollarIcon,
            gradient: 'from-emerald-500 to-teal-600'
        },
        {
            title: 'Average Rating',
            value: `${stats.averageRating || 0}/5`,
            icon: StarIcon,
            gradient: 'from-amber-500 to-orange-600'
        },
        {
            title: 'Hours Taught',
            value: `${stats.hoursTaught || 0}h`,
            icon: ClockIcon,
            gradient: 'from-purple-500 to-indigo-600'
        }
    ];

    const learnerStats = [
        {
            title: 'Sessions Attended',
            value: stats.sessionsAttended || 0,
            icon: CalendarIcon,
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Total Spent',
            value: `$${stats.totalSpent || 0}`,
            icon: CurrencyDollarIcon,
            gradient: 'from-emerald-500 to-teal-600'
        },
        {
            title: 'Skills Learning',
            value: stats.skillsLearning || 0,
            icon: AcademicCapIcon,
            gradient: 'from-indigo-500 to-purple-600'
        },
        {
            title: 'Hours Learned',
            value: `${stats.hoursLearned || 0}h`,
            icon: ClockIcon,
            gradient: 'from-purple-500 to-indigo-600'
        }
    ];

    const displayStats = userRole === 'tutor' ? tutorStats : learnerStats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => (
                <div key={index} className="group bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-2xl border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-semibold text-slate-600 truncate">
                                        {stat.title}
                                    </dt>
                                    <dd className="text-2xl font-bold text-slate-900 mt-1">
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