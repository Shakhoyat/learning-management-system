import React from 'react';
import {
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const SkillCard = ({ skill }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIconSolid key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {skill.name || 'Skill Name'}
            </h3>
            <p className="text-sm text-gray-500">
              {skill.category || 'Category'}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {skill.difficulty || 'Beginner'}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {skill.description || 'No description available for this skill.'}
      </p>

      <div className="space-y-3">
        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {renderStars(skill.averageRating)}
          </div>
          <span className="text-sm text-gray-600">
            {skill.averageRating ? skill.averageRating.toFixed(1) : '0.0'}
          </span>
          <span className="text-sm text-gray-400">
            ({skill.reviewCount || 0} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <UserGroupIcon className="h-4 w-4" />
            <span>{skill.tutorCount || 0} tutors</span>
          </div>
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>${skill.averagePrice || 0}/hr</span>
          </div>
        </div>

        {/* Tags */}
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {skill.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{skill.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">
            Find Tutors
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;