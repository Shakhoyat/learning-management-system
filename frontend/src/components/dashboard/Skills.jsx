import React, { useState, useEffect } from 'react';
import {
    AcademicCapIcon,
    StarIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    BookOpenIcon,
    UsersIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';

const Skills = () => {
    const [skills, setSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        'Programming',
        'Web Development',
        'Data Science',
        'Design',
        'Business',
        'Languages',
        'Mathematics',
        'Science',
    ];

    useEffect(() => {
        // Simulated data
        setTimeout(() => {
            setSkills([
                {
                    id: 1,
                    name: 'React.js',
                    category: 'Web Development',
                    level: 'Advanced',
                    tutors: 45,
                    avgRating: 4.8,
                    sessions: 120,
                    description: 'Build modern web applications with React',
                    price: '$50-80/hr'
                },
                {
                    id: 2,
                    name: 'Python',
                    category: 'Programming',
                    level: 'Intermediate',
                    tutors: 67,
                    avgRating: 4.9,
                    sessions: 200,
                    description: 'Learn Python programming from basics to advanced',
                    price: '$40-70/hr'
                },
                {
                    id: 3,
                    name: 'Data Analysis',
                    category: 'Data Science',
                    level: 'Beginner',
                    tutors: 23,
                    avgRating: 4.7,
                    sessions: 85,
                    description: 'Analyze data using Python and statistical methods',
                    price: '$60-90/hr'
                },
                {
                    id: 4,
                    name: 'UI/UX Design',
                    category: 'Design',
                    level: 'Intermediate',
                    tutors: 34,
                    avgRating: 4.6,
                    sessions: 95,
                    description: 'Design beautiful and user-friendly interfaces',
                    price: '$45-75/hr'
                },
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            skill.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const SkillCard = ({ skill }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{skill.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${skill.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                                skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {skill.level}
                        </span>
                        <span className="text-gray-600">{skill.category}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {skill.tutors} tutors
                        </div>
                        <div className="flex items-center">
                            <BookOpenIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {skill.sessions} sessions
                        </div>
                        <div className="flex items-center">
                            <StarIcon className="h-4 w-4 mr-1 text-yellow-400" />
                            {skill.avgRating}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{skill.price}</p>
                </div>
            </div>

            <div className="flex space-x-2">
                <button className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                    Find Tutors
                </button>
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                    Learn More
                </button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Skills & Subjects</h1>
                    <p className="text-gray-600">Explore skills and find expert tutors</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Request New Skill
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 input-field"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
                ))}
            </div>

            {filteredSkills.length === 0 && (
                <div className="text-center py-12">
                    <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default Skills;