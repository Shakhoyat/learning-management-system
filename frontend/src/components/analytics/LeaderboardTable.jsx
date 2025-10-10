import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analytics';
import toast from 'react-hot-toast';

const LeaderboardTable = ({ loading: parentLoading }) => {
    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState(null);
    const [scope, setScope] = useState('global');
    const [timeframe, setTimeframe] = useState('monthly');
    const [category, setCategory] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, [scope, timeframe, category]);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const params = { scope, timeframe };
            if (scope === 'category' && category) {
                params.category = category;
            }

            const data = await analyticsService.getLeaderboard(params);
            setLeaderboard(data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            toast.error('Failed to load leaderboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading || parentLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!leaderboard || !leaderboard.rankings || leaderboard.rankings.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <p className="font-medium">No leaderboard data available</p>
                    <p className="text-sm mt-1">Be the first to appear on the leaderboard!</p>
                </div>
            </div>
        );
    }

    const { rankings, currentUser, totalParticipants } = leaderboard;
    const currentUserRank = currentUser?.rank || null;

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500';
        return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Leaderboard</h3>
                    <p className="text-sm text-gray-500 mt-1">{totalParticipants} participants</p>
                </div>
                <div className="flex items-center space-x-2">
                    {currentUserRank && (
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-semibold">
                            Your Rank: #{currentUserRank}
                        </span>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {/* Scope Filter */}
                <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="global">🌍 Global</option>
                    <option value="category">📚 By Category</option>
                </select>

                {/* Timeframe Filter */}
                <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="weekly">📅 This Week</option>
                    <option value="monthly">📊 This Month</option>
                    <option value="yearly">🎯 This Year</option>
                    <option value="all-time">⏰ All Time</option>
                </select>

                {/* Category Filter (shown when scope is category) */}
                {scope === 'category' && (
                    <input
                        type="text"
                        placeholder="Enter category..."
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                )}
            </div>

            {/* Current User Card (if ranked) */}
            {currentUser && currentUser.rank > 3 && (
                <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                #{currentUser.rank}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">You</p>
                                <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                    <span>⭐ {currentUser.totalPoints} pts</span>
                                    <span>🏆 Lvl {currentUser.level}</span>
                                    <span>⏱️ {currentUser.totalHours.toFixed(1)}h</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                style={{ width: `${Math.min(100, (currentUser.score / rankings[0]?.score) * 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Rankings */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {rankings.map((user, index) => {
                    const isCurrentUser = currentUser && user.rank === currentUser.rank;
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl transition-all duration-200 hover:shadow-md ${isCurrentUser
                                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300'
                                    : user.rank <= 3
                                        ? 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
                                        : 'bg-white border border-gray-100 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                {/* Rank and User Info */}
                                <div className="flex items-center flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 ${getRankColor(
                                            user.rank
                                        )}`}
                                    >
                                        <span className="text-lg">{getRankIcon(user.rank)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">
                                            {isCurrentUser ? 'You' : user.displayName}
                                            {user.rank <= 3 && (
                                                <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                                                    Top {user.rank}
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                            <span className="flex items-center">
                                                <svg className="w-3 h-3 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {user.totalPoints.toLocaleString()} pts
                                            </span>
                                            <span>🏆 Lvl {user.level}</span>
                                            <span>⏱️ {user.totalHours.toFixed(1)}h</span>
                                            <span>📚 {user.skillsLearned} skills</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar and Score */}
                                <div className="ml-4 flex items-center space-x-3">
                                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${user.rank === 1
                                                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                                    : user.rank === 2
                                                        ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                                                        : user.rank === 3
                                                            ? 'bg-gradient-to-r from-orange-400 to-orange-600'
                                                            : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                                                }`}
                                            style={{
                                                width: `${Math.min(100, (user.score / rankings[0]?.score) * 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 w-16 text-right">
                                        {user.score.toFixed(0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Info */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-2">
                        <p className="text-xs text-gray-700">
                            Rankings are updated in real-time. Keep learning to climb higher! 🚀
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardTable;
