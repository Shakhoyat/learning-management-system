import React from 'react';
import { UsersIcon, StarIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Matching = () => {
    const recommendations = [
        {
            id: 1,
            name: 'Sarah Johnson',
            skills: ['React', 'JavaScript', 'Frontend'],
            rating: 4.9,
            sessions: 150,
            price: 75,
            location: 'Remote',
            availability: 'Available this week',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
            id: 2,
            name: 'Michael Chen',
            skills: ['Node.js', 'Python', 'Backend'],
            rating: 4.8,
            sessions: 120,
            price: 65,
            location: 'New York, NY',
            availability: 'Available tomorrow',
            image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Tutor</h1>
                <p className="text-gray-600">AI-powered matching based on your learning goals</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recommendations.map(tutor => (
                        <div key={tutor.id} className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start space-x-4">
                                <img
                                    className="h-16 w-16 rounded-full object-cover"
                                    src={tutor.image}
                                    alt={tutor.name}
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                        <span className="ml-1 text-sm text-gray-600">{tutor.rating} ({tutor.sessions} sessions)</span>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <MapPinIcon className="h-4 w-4 text-gray-400" />
                                        <span className="ml-1 text-sm text-gray-600">{tutor.location}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {tutor.skills.map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-green-600 mt-2">{tutor.availability}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-green-600">${tutor.price}/hr</p>
                                    <button className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                                        Book Session
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Matching;