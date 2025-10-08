import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    CameraIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    StarIcon,
    MapPinIcon,
    CalendarIcon,
    EnvelopeIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        location: user?.location || '',
        skills: user?.skills || [],
        experience: user?.experience || '',
        hourlyRate: user?.hourlyRate || '',
        languages: user?.languages || [],
    });

    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleAddLanguage = () => {
        if (newLanguage.trim()) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, newLanguage.trim()]
            }));
            setNewLanguage('');
        }
    };

    const handleRemoveLanguage = (index) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.success) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
            location: user?.location || '',
            skills: user?.skills || [],
            experience: user?.experience || '',
            hourlyRate: user?.hourlyRate || '',
            languages: user?.languages || [],
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <LoadingSpinner size="sm" className="mr-2" />
                                    ) : (
                                        <CheckIcon className="h-4 w-4 mr-2" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center space-x-6">
                        {/* Profile Photo */}
                        <div className="relative">
                            <img
                                className="h-24 w-24 rounded-full object-cover"
                                src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=3b82f6&color=fff&size=200`}
                                alt=""
                            />
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-50">
                                    <CameraIcon className="h-4 w-4 text-gray-600" />
                                </button>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {formData.firstName} {formData.lastName}
                                    </h2>
                                    <p className="text-gray-600 capitalize">{user?.role}</p>
                                    <div className="flex items-center mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className={`h-4 w-4 ${i < (user?.averageRating || 4.8) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-sm text-gray-600">
                                            {user?.averageRating || 4.8} ({user?.totalReviews || 24} reviews)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {isEditing ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-900">{formData.email}</span>
                                    </div>
                                    {formData.phone && (
                                        <div className="flex items-center">
                                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900">{formData.phone}</span>
                                        </div>
                                    )}
                                    {formData.location && (
                                        <div className="flex items-center">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                                            <span className="text-gray-900">{formData.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                        <span className="text-gray-900">Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">About</h3>
                        </div>
                        <div className="p-6">
                            {isEditing ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-700">
                                    {formData.bio || 'No bio available.'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                        </div>
                        <div className="p-6">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                            className="flex-1 input-field"
                                            placeholder="Add a skill"
                                        />
                                        <button
                                            onClick={handleAddSkill}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                            >
                                                {skill}
                                                <button
                                                    onClick={() => handleRemoveSkill(index)}
                                                    className="ml-2 text-primary-600 hover:text-primary-800"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.length > 0 ? (
                                        formData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills listed.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Professional Info */}
                    {user?.role === 'tutor' && (
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Professional Info</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {isEditing ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Hourly Rate ($)
                                            </label>
                                            <input
                                                type="number"
                                                name="hourlyRate"
                                                value={formData.hourlyRate}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Experience
                                            </label>
                                            <select
                                                name="experience"
                                                value={formData.experience}
                                                onChange={handleInputChange}
                                                className="input-field"
                                            >
                                                <option value="">Select experience level</option>
                                                <option value="1-2 years">1-2 years</option>
                                                <option value="3-5 years">3-5 years</option>
                                                <option value="5-10 years">5-10 years</option>
                                                <option value="10+ years">10+ years</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {formData.hourlyRate && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Hourly Rate</p>
                                                <p className="text-lg font-semibold text-green-600">${formData.hourlyRate}/hour</p>
                                            </div>
                                        )}
                                        {formData.experience && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Experience</p>
                                                <p className="text-gray-900">{formData.experience}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Languages</h3>
                        </div>
                        <div className="p-6">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={newLanguage}
                                            onChange={(e) => setNewLanguage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
                                            className="flex-1 input-field"
                                            placeholder="Add a language"
                                        />
                                        <button
                                            onClick={handleAddLanguage}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.languages.map((language, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                                            >
                                                <span className="text-gray-900">{language}</span>
                                                <button
                                                    onClick={() => handleRemoveLanguage(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {formData.languages.length > 0 ? (
                                        formData.languages.map((language, index) => (
                                            <div key={index} className="text-gray-900">
                                                {language}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No languages listed.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Sessions</span>
                                <span className="font-semibold text-gray-900">{user?.totalSessions || 24}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hours Taught</span>
                                <span className="font-semibold text-gray-900">{user?.totalHours || 42.5}h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Students Helped</span>
                                <span className="font-semibold text-gray-900">{user?.studentsHelped || 18}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Response Rate</span>
                                <span className="font-semibold text-green-600">{user?.responseRate || 95}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;