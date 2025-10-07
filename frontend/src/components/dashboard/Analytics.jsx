import React from 'react';
import { ChartBarIcon, TrendingUpIcon, ClockIcon, DollarSignIcon } from '@heroicons/react/24/outline';

const Analytics = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Learning Analytics</h1>
                <p className="text-gray-600">Track your progress and performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ChartBarIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Learning Hours</p>
                            <p className="text-2xl font-bold text-gray-900">42.5h</p>
                            <p className="text-sm text-green-600">+12% this month</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUpIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Skills Mastered</p>
                            <p className="text-2xl font-bold text-gray-900">8</p>
                            <p className="text-sm text-green-600">+2 this month</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Study Streak</p>
                            <p className="text-2xl font-bold text-gray-900">7 days</p>
                            <p className="text-sm text-green-600">Keep it up!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <DollarSignIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Money Invested</p>
                            <p className="text-2xl font-bold text-gray-900">$1,240</p>
                            <p className="text-sm text-gray-600">Total spent</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress Chart</h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart visualization would go here</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;