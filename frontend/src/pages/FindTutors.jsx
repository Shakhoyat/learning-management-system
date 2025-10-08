import React, { useState, useEffect } from 'react';
import { matchingService } from '../services/matching';
import { skillService } from '../services/skills';
import Header from '../components/common/Header';
import toast from 'react-hot-toast';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    StarIcon,
    AcademicCapIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const FindTutors = () => {
    const [tutors, setTutors] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [minRating, setMinRating] = useState(0);
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('rating'); // rating, price, experience
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        // Only fetch tutors if we have skills loaded
        if (skills.length > 0) {
            fetchTutors();
        }
    }, [selectedSkill, minRating, maxPrice, sortBy, searchQuery, skills.length]);

    const fetchSkills = async () => {
        try {
            const response = await skillService.getAllSkills();
            const skillsList = response?.data?.skills || response?.skills || [];
            setSkills(skillsList);
            // Set first skill as default if none selected
            if (skillsList.length > 0 && !selectedSkill) {
                setSelectedSkill(skillsList[0]._id);
            }
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        }
    };

    const fetchTutors = async () => {
        try {
            setLoading(true);

            // If no skill selected, don't fetch (backend requires skillId)
            if (!selectedSkill && skills.length > 0) {
                setSelectedSkill(skills[0]._id);
                return;
            }

            if (!selectedSkill) {
                setLoading(false);
                return;
            }

            const params = { skillId: selectedSkill };

            if (minRating) params.minRating = minRating;
            if (maxPrice) params.maxHourlyRate = maxPrice;
            if (sortBy) params.sortBy = sortBy;
            if (searchQuery) params.search = searchQuery;

            const response = await matchingService.findTutors(params);
            setTutors(response?.data?.tutors || []);
        } catch (error) {
            console.error('Failed to fetch tutors:', error);
            toast.error(error.response?.data?.error || 'Failed to load tutors');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTutors();
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedSkill('');
        setMinRating(0);
        setMaxPrice('');
        setSortBy('rating');
    };

    const renderRating = (rating) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>
                        {star <= Math.round(rating) ? (
                            <StarIconSolid className="h-5 w-5 text-yellow-400" />
                        ) : (
                            <StarIcon className="h-5 w-5 text-gray-300" />
                        )}
                    </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
            </div>
        );
    };

    if (loading && tutors.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-2xl font-bold text-gray-900">Find Expert Tutors</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Connect with experienced tutors and start learning today
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="px-4 sm:px-0 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tutors by name or expertise..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                >
                                    <FunnelIcon className="h-5 w-5 mr-2" />
                                    Filters
                                </button>
                            </div>

                            {/* Filters Panel */}
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Skill
                                        </label>
                                        <select
                                            value={selectedSkill}
                                            onChange={(e) => setSelectedSkill(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">All Skills</option>
                                            {skills.map((skill) => (
                                                <option key={skill._id} value={skill._id}>
                                                    {skill.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Rating
                                        </label>
                                        <select
                                            value={minRating}
                                            onChange={(e) => setMinRating(Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="0">Any Rating</option>
                                            <option value="3">3+ Stars</option>
                                            <option value="4">4+ Stars</option>
                                            <option value="4.5">4.5+ Stars</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Price/Hour
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Any price"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Sort By
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="rating">Highest Rating</option>
                                            <option value="price">Lowest Price</option>
                                            <option value="experience">Most Experience</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Filter Actions */}
                            {showFilters && (
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Results Count */}
                <div className="px-4 sm:px-0 mb-4">
                    <p className="text-sm text-gray-600">
                        Found <span className="font-semibold">{tutors.length}</span> tutors
                    </p>
                </div>

                {/* Tutors Grid */}
                <div className="px-4 sm:px-0">
                    {tutors.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tutors found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Try adjusting your filters or search criteria
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tutors.map((tutor) => (
                                <div
                                    key={tutor._id}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    {/* Tutor Header */}
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
                                                    <UserIcon className="h-10 w-10 text-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="ml-4 text-white">
                                                <h3 className="text-lg font-semibold">{tutor.name}</h3>
                                                <p className="text-sm opacity-90">{tutor.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tutor Details */}
                                    <div className="p-6">
                                        {/* Rating */}
                                        {tutor.rating && (
                                            <div className="mb-4">{renderRating(tutor.rating)}</div>
                                        )}

                                        {/* Bio */}
                                        {tutor.bio && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{tutor.bio}</p>
                                        )}

                                        {/* Skills */}
                                        {tutor.skills && tutor.skills.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex items-center mb-2">
                                                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-700">Skills</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {tutor.skills.slice(0, 3).map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                                                        >
                                                            {skill.name || skill}
                                                        </span>
                                                    ))}
                                                    {tutor.skills.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                            +{tutor.skills.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {tutor.sessionCount !== undefined && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <ClockIcon className="h-4 w-4 mr-2" />
                                                    {tutor.sessionCount} sessions
                                                </div>
                                            )}
                                            {tutor.hourlyRate && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                                                    ${tutor.hourlyRate}/hr
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium">
                                            Book Session
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindTutors;
