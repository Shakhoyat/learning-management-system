import React from 'react';
import {
    CodeBracketIcon,
    PaintBrushIcon,
    LanguageIcon,
    CalculatorIcon,
    BeakerIcon,
    MusicalNoteIcon,
    CameraIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

const categoryIcons = {
    'Programming': CodeBracketIcon,
    'Design': PaintBrushIcon,
    'Languages': LanguageIcon,
    'Mathematics': CalculatorIcon,
    'Science': BeakerIcon,
    'Music': MusicalNoteIcon,
    'Photography': CameraIcon,
    'Business': ChartBarIcon,
};

const SkillCategories = ({ categories, selectedCategory, onSelectCategory }) => {
    const getCategoryIcon = (category) => {
        const Icon = categoryIcons[category] || CodeBracketIcon;
        return Icon;
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <button
                    onClick={() => onSelectCategory('all')}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${selectedCategory === 'all'
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                >
                    <div
                        className={`p-2 rounded-lg mb-2 ${selectedCategory === 'all' ? 'bg-indigo-100' : 'bg-gray-100'
                            }`}
                    >
                        <ChartBarIcon
                            className={`h-6 w-6 ${selectedCategory === 'all' ? 'text-indigo-600' : 'text-gray-600'
                                }`}
                        />
                    </div>
                    <span
                        className={`text-sm font-medium ${selectedCategory === 'all' ? 'text-indigo-600' : 'text-gray-700'
                            }`}
                    >
                        All
                    </span>
                </button>

                {categories.map((category) => {
                    const Icon = getCategoryIcon(category);
                    return (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${selectedCategory === category
                                ? 'border-indigo-600 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                        >
                            <div
                                className={`p-2 rounded-lg mb-2 ${selectedCategory === category ? 'bg-indigo-100' : 'bg-gray-100'
                                    }`}
                            >
                                <Icon
                                    className={`h-6 w-6 ${selectedCategory === category ? 'text-indigo-600' : 'text-gray-600'
                                        }`}
                                />
                            </div>
                            <span
                                className={`text-sm font-medium ${selectedCategory === category ? 'text-indigo-600' : 'text-gray-700'
                                    }`}
                            >
                                {category}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillCategories;
