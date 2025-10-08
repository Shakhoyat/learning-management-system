import React from 'react';
import {
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const ProfileStats = ({ user, stats }) => {
  if (!stats) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const tutorStatsData = [
    {
      title: 'Total Sessions',
      value: stats.totalSessions || 0,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings || 0}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating || 0}/5`,
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Hours Taught',
      value: `${stats.hoursTaught || 0}h`,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const learnerStatsData = [
    {
      title: 'Sessions Attended',
      value: stats.sessionsAttended || 0,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent || 0}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Skills Learning',
      value: stats.skillsLearning || 0,
      icon: AcademicCapIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Hours Learned',
      value: `${stats.hoursLearned || 0}h`,
      icon: ClockIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const displayStats = user?.role === 'tutor' ? tutorStatsData : learnerStatsData;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ChartBarIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              No recent activity data available
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-3">
            {user?.role === 'tutor' ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Session Completion Rate</span>
                  <span className="text-sm font-medium">
                    {stats.completionRate ? `${stats.completionRate}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium">
                    {stats.responseTime ? `${stats.responseTime} hrs` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Repeat Students</span>
                  <span className="text-sm font-medium">
                    {stats.repeatStudents ? `${stats.repeatStudents}%` : 'N/A'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Learning Streak</span>
                  <span className="text-sm font-medium">
                    {stats.learningStreak ? `${stats.learningStreak} days` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Favorite Category</span>
                  <span className="text-sm font-medium">
                    {stats.favoriteCategory || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Goals Completed</span>
                  <span className="text-sm font-medium">
                    {stats.goalsCompleted || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;