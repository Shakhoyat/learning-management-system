import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressGauge = ({ analytics, loading }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="flex justify-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    if (!analytics?.gamification) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p className="font-medium">No progress data available</p>
                    <p className="text-sm mt-1">Start learning to see your progress</p>
                </div>
            </div>
        );
    }

    const { gamification, learningProgress } = analytics;
    const overallProgress = learningProgress?.overallProgress || 0;
    const totalPoints = gamification.totalPoints || 0;
    const currentLevel = gamification.currentLevel || 1;
    const badges = gamification.badges?.length || 0;
    const streak = gamification.currentStreak || 0;

    // Determine color based on progress
    const getProgressColor = (progress) => {
        if (progress >= 80) return '#10B981'; // Green
        if (progress >= 60) return '#F59E0B'; // Yellow
        if (progress >= 40) return '#3B82F6'; // Blue
        return '#EF4444'; // Red
    };

    const progressColor = getProgressColor(overallProgress);

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Learning Progress</h3>
                <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-semibold">
                        Level {currentLevel}
                    </span>
                </div>
            </div>

            {/* Main Progress Circle */}
            <div className="flex justify-center mb-6">
                <div className="relative w-56 h-56">
                    <CircularProgressbar
                        value={overallProgress}
                        text={`${Math.round(overallProgress)}%`}
                        styles={buildStyles({
                            rotation: 0,
                            strokeLinecap: 'round',
                            textSize: '18px',
                            pathTransitionDuration: 1.5,
                            pathColor: progressColor,
                            textColor: '#1F2937',
                            trailColor: '#E5E7EB',
                            backgroundColor: '#F3F4F6',
                        })}
                    />
                    {/* Center overlay with additional info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="mt-16 text-center">
                            <p className="text-sm font-semibold text-gray-600">Overall Progress</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Total Points */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Total Points</p>
                        </div>
                    </div>
                </div>

                {/* Current Level */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">Level {currentLevel}</p>
                            <p className="text-xs text-gray-500">Current Level</p>
                        </div>
                    </div>
                </div>

                {/* Badges Earned */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{badges}</p>
                            <p className="text-xs text-gray-500">Badges Earned</p>
                        </div>
                    </div>
                </div>

                {/* Current Streak */}
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{streak}</p>
                            <p className="text-xs text-gray-500">Day Streak</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Description */}
            <div className="mt-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-gray-700">
                            {overallProgress >= 80 ? (
                                <span>🎉 Excellent progress! Keep up the great work!</span>
                            ) : overallProgress >= 60 ? (
                                <span>👍 Good progress! You're on the right track.</span>
                            ) : overallProgress >= 40 ? (
                                <span>💪 Making progress! Stay consistent.</span>
                            ) : (
                                <span>🚀 Just getting started! Keep learning.</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressGauge;
