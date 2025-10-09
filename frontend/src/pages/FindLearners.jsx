import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    MagnifyingGlassIcon,
    AcademicCapIcon,
    MapPinIcon,
    StarIcon,
    ClockIcon,
    BookOpenIcon,
    UserCircleIcon,
    FunnelIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { matchingService } from '../services/matching';
import { skillService } from '../services/skills';
import Header from '../components/common/Header';

const FindLearners = () => {
    const [learners, setLearners] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        skillId: '',
        location: '',
        minLevel: 0,
        maxLevel: 10,
        learningStyle: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalLearners: 0
    });

    useEffect(() => {
        loadSkills();
        loadLearners();
    }, [filters]);

    const loadSkills = async () => {
        try {
            const response = await skillService.getAllSkills();
            const skillsList = response?.data?.skills || response?.skills || [];
            setSkills(skillsList);
        } catch (error) {
            console.error('Error loading skills:', error);
        }
    };

    const loadLearners = async () => {
        try {
            setLoading(true);

            // Build query params
            const params = {
                page: pagination.currentPage,
                limit: 12,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder
            };

            if (filters.skillId) params.skillId = filters.skillId;
            if (filters.location) params.location = filters.location;
            if (filters.minLevel > 0) params.minLevel = filters.minLevel;
            if (filters.maxLevel < 10) params.maxLevel = filters.maxLevel;
            if (filters.learningStyle) params.learningStyle = filters.learningStyle;

            const response = await matchingService.findLearners(params);
            const learnersData = response?.data?.learners || response?.learners || [];
            const paginationData = response?.data?.pagination || response?.pagination || {};

            setLearners(learnersData);
            setPagination({
                currentPage: paginationData.currentPage || 1,
                totalPages: paginationData.totalPages || 1,
                totalLearners: paginationData.totalLearners || 0
            });
        } catch (error) {
            console.error('Error loading learners:', error);
            toast.error('Failed to load learners');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            skillId: '',
            location: '',
            minLevel: 0,
            maxLevel: 10,
            learningStyle: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const getLevelLabel = (level) => {
        if (level <= 2) return 'Beginner';
        if (level <= 5) return 'Intermediate';
        if (level <= 8) return 'Advanced';
        return 'Expert';
    };

    const getSkillName = (learningSkill) => {
        return learningSkill?.skillId?.name || 'Unknown Skill';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Find Learners</h1>
                    <p className="mt-2 text-gray-600">
                        Connect with students looking for tutoring in your teaching skills
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div>
                                <span className="text-2xl font-bold text-indigo-600">
                                    {pagination.totalLearners}
                                </span>
                                <span className="text-gray-600 ml-2">Learners Found</span>
                            </div>
                            {filters.skillId && (
                                <div className="text-sm text-gray-600">
                                    Filtered by: <span className="font-semibold">
                                        {skills.find(s => s._id === filters.skillId)?.name}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <FunnelIcon className="h-5 w-5" />
                            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Skill Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skill
                                </label>
                                <select
                                    value={filters.skillId}
                                    onChange={(e) => handleFilterChange('skillId', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Skills</option>
                                    {skills.map(skill => (
                                        <option key={skill._id} value={skill._id}>
                                            {skill.name} ({skill.category})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Location Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    placeholder="City or Country"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            {/* Learning Style */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Learning Style
                                </label>
                                <select
                                    value={filters.learningStyle}
                                    onChange={(e) => handleFilterChange('learningStyle', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="">All Styles</option>
                                    <option value="visual">Visual</option>
                                    <option value="auditory">Auditory</option>
                                    <option value="kinesthetic">Kinesthetic</option>
                                    <option value="reading">Reading/Writing</option>
                                </select>
                            </div>

                            {/* Level Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Level
                                </label>
                                <select
                                    value={filters.minLevel}
                                    onChange={(e) => handleFilterChange('minLevel', parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => (
                                        <option key={level} value={level}>
                                            Level {level} - {getLevelLabel(level)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Level
                                </label>
                                <select
                                    value={filters.maxLevel}
                                    onChange={(e) => handleFilterChange('maxLevel', parseInt(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                                        <option key={level} value={level}>
                                            Level {level} - {getLevelLabel(level)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="createdAt">Recently Joined</option>
                                    <option value="name">Name</option>
                                    <option value="reputation.rating">Rating</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                <XMarkIcon className="h-5 w-5" />
                                <span>Clear Filters</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Learners Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading learners...</p>
                    </div>
                ) : learners.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No learners found</h3>
                        <p className="mt-2 text-gray-600">
                            Try adjusting your filters to see more results
                        </p>
                        {(filters.skillId || filters.location) && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 text-indigo-600 hover:text-indigo-800"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {learners.map((learner) => (
                                <div
                                    key={learner._id}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                                >
                                    {/* Learner Header */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                {learner.avatar ? (
                                                    <img
                                                        src={learner.avatar}
                                                        alt={learner.name}
                                                        className="h-12 w-12 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">
                                                            {learner.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {learner.name}
                                                    </h3>
                                                    {learner.location && (
                                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                                            <MapPinIcon className="h-4 w-4 mr-1" />
                                                            {learner.location.city}, {learner.location.country}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {learner.matchScore > 0 && (
                                                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    <StarIcon className="h-4 w-4" />
                                                    <span>{learner.matchScore}%</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bio */}
                                        {learner.bio && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {learner.bio}
                                            </p>
                                        )}

                                        {/* Learning Skills */}
                                        <div className="mb-4">
                                            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                <BookOpenIcon className="h-4 w-4 mr-2" />
                                                Learning Skills
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {learner.learningSkills?.slice(0, 3).map((ls, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800"
                                                    >
                                                        <AcademicCapIcon className="h-3 w-3 mr-1" />
                                                        {getSkillName(ls)}
                                                        <span className="ml-1 text-indigo-600">
                                                            (Lvl {ls.currentLevel || 0})
                                                        </span>
                                                    </div>
                                                ))}
                                                {learner.learningSkills?.length > 3 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{learner.learningSkills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                                            <div>
                                                <div className="text-xs text-gray-500">Sessions</div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {learner.stats?.totalSessions || 0}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500">Rating</div>
                                                <div className="flex items-center">
                                                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="text-lg font-semibold text-gray-900 ml-1">
                                                        {learner.reputation?.rating?.toFixed(1) || 'N/A'}
                                                    </span>
                                                    {learner.reputation?.totalReviews > 0 && (
                                                        <span className="text-xs text-gray-500 ml-1">
                                                            ({learner.reputation.totalReviews})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/learners/${learner._id}`}
                                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center text-sm font-medium"
                                            >
                                                View Profile
                                            </Link>
                                            <Link
                                                to={`/sessions/create?learnerId=${learner._id}`}
                                                className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 text-center text-sm font-medium"
                                            >
                                                Offer Session
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setPagination(prev => ({
                                            ...prev,
                                            currentPage: Math.max(1, prev.currentPage - 1)
                                        }))}
                                        disabled={pagination.currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPagination(prev => ({
                                            ...prev,
                                            currentPage: Math.min(prev.totalPages, prev.currentPage + 1)
                                        }))}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FindLearners;
