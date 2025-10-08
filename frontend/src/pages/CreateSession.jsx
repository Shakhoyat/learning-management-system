import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    CalendarIcon,
    ClockIcon,
    AcademicCapIcon,
    UserIcon,
    DocumentTextIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { sessionService } from '../services/sessions';
import { skillService } from '../services/skills';
import { matchingService } from '../services/matching';
import Header from '../components/common/Header';

const CreateSession = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [loadingTutors, setLoadingTutors] = useState(false);

    const [formData, setFormData] = useState({
        skillId: '',
        tutorId: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        title: '',
        description: '',
        objectives: [''],
        hourlyRate: ''
    });

    const [errors, setErrors] = useState({});

    // Load skills on mount
    useEffect(() => {
        loadSkills();
    }, []);

    // Load tutors when skill is selected
    useEffect(() => {
        if (formData.skillId) {
            loadTutors(formData.skillId);
        } else {
            setTutors([]);
            setFormData(prev => ({ ...prev, tutorId: '', hourlyRate: '' }));
        }
    }, [formData.skillId]);

    const loadSkills = async () => {
        try {
            const response = await skillService.getAllSkills();
            const skillsList = response?.data?.skills || response?.skills || [];
            setSkills(skillsList);
        } catch (error) {
            console.error('Error loading skills:', error);
            toast.error('Failed to load skills');
        }
    };

    const loadTutors = async (skillId) => {
        try {
            setLoadingTutors(true);
            const response = await matchingService.findTutors({ skillId });
            const tutorsList = response?.data?.tutors || response?.tutors || [];
            setTutors(tutorsList);
        } catch (error) {
            console.error('Error loading tutors:', error);
            toast.error('Failed to load tutors for this skill');
            setTutors([]);
        } finally {
            setLoadingTutors(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Auto-fill title based on skill
        if (name === 'skillId' && value) {
            const selectedSkill = skills.find(s => s._id === value);
            if (selectedSkill && !formData.title) {
                setFormData(prev => ({
                    ...prev,
                    title: `Learning ${selectedSkill.name}`
                }));
            }
        }

        // Auto-fill hourly rate when tutor is selected
        if (name === 'tutorId' && value) {
            const selectedTutor = tutors.find(t => t._id === value);
            if (selectedTutor) {
                const teachingSkill = selectedTutor.teachingSkills?.find(
                    ts => ts.skillId._id === formData.skillId
                );
                if (teachingSkill) {
                    setFormData(prev => ({
                        ...prev,
                        hourlyRate: teachingSkill.hourlyRate || ''
                    }));
                }
            }
        }
    };

    const handleObjectiveChange = (index, value) => {
        const newObjectives = [...formData.objectives];
        newObjectives[index] = value;
        setFormData(prev => ({ ...prev, objectives: newObjectives }));
    };

    const addObjective = () => {
        setFormData(prev => ({
            ...prev,
            objectives: [...prev.objectives, '']
        }));
    };

    const removeObjective = (index) => {
        if (formData.objectives.length > 1) {
            const newObjectives = formData.objectives.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, objectives: newObjectives }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.skillId) newErrors.skillId = 'Please select a skill';
        if (!formData.tutorId) newErrors.tutorId = 'Please select a tutor';
        if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
        if (!formData.scheduledTime) newErrors.scheduledTime = 'Please select a time';
        if (!formData.duration || formData.duration < 15) {
            newErrors.duration = 'Duration must be at least 15 minutes';
        }
        if (!formData.title?.trim()) newErrors.title = 'Please enter a title';

        // Validate date is in the future
        if (formData.scheduledDate && formData.scheduledTime) {
            const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
            if (scheduledDateTime <= new Date()) {
                newErrors.scheduledDate = 'Session must be scheduled in the future';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            setLoading(true);

            // Combine date and time
            const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

            // Prepare session data
            const sessionData = {
                tutorId: formData.tutorId,
                skillId: formData.skillId,
                scheduledDate: scheduledDateTime.toISOString(),
                duration: parseInt(formData.duration),
                title: formData.title.trim(),
                description: formData.description.trim(),
                objectives: formData.objectives
                    .filter(obj => obj.trim())
                    .map(desc => ({
                        description: desc.trim(),
                        completed: false
                    })),
                hourlyRate: parseFloat(formData.hourlyRate)
            };

            const response = await sessionService.createSession(sessionData);

            toast.success('Session created successfully!');
            navigate('/sessions');
        } catch (error) {
            console.error('Error creating session:', error);
            const errorMessage = error.response?.data?.error || 'Failed to create session';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalAmount = () => {
        if (formData.hourlyRate && formData.duration) {
            return ((parseFloat(formData.hourlyRate) * parseInt(formData.duration)) / 60).toFixed(2);
        }
        return '0.00';
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Session</h1>
                    <p className="mt-2 text-gray-600">
                        Schedule a tutoring session with an expert tutor
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
                    <div className="px-6 py-8 space-y-6">
                        {/* Skill Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AcademicCapIcon className="h-5 w-5 inline mr-2" />
                                Select Skill *
                            </label>
                            <select
                                name="skillId"
                                value={formData.skillId}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.skillId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Choose a skill...</option>
                                {skills.map(skill => (
                                    <option key={skill._id} value={skill._id}>
                                        {skill.name} ({skill.category})
                                    </option>
                                ))}
                            </select>
                            {errors.skillId && (
                                <p className="mt-1 text-sm text-red-600">{errors.skillId}</p>
                            )}
                        </div>

                        {/* Tutor Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <UserIcon className="h-5 w-5 inline mr-2" />
                                Select Tutor *
                            </label>
                            {loadingTutors ? (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                    <p className="mt-2 text-sm text-gray-500">Loading tutors...</p>
                                </div>
                            ) : !formData.skillId ? (
                                <p className="text-sm text-gray-500 italic">Please select a skill first</p>
                            ) : tutors.length === 0 ? (
                                <p className="text-sm text-amber-600 italic">No tutors found for this skill</p>
                            ) : (
                                <>
                                    <select
                                        name="tutorId"
                                        value={formData.tutorId}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.tutorId ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Choose a tutor...</option>
                                        {tutors.map(tutor => {
                                            const teachingSkill = tutor.teachingSkills?.find(
                                                ts => ts.skillId._id === formData.skillId
                                            );
                                            return (
                                                <option key={tutor._id} value={tutor._id}>
                                                    {tutor.name} - ${teachingSkill?.hourlyRate || 0}/hr
                                                    {tutor.reputation?.rating ? ` (⭐ ${tutor.reputation.rating.toFixed(1)})` : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {errors.tutorId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tutorId}</p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <CalendarIcon className="h-5 w-5 inline mr-2" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleInputChange}
                                    min={getMinDate()}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.scheduledDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.scheduledDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <ClockIcon className="h-5 w-5 inline mr-2" />
                                    Time *
                                </label>
                                <input
                                    type="time"
                                    name="scheduledTime"
                                    value={formData.scheduledTime}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.scheduledTime ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.scheduledTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>
                                )}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <ClockIcon className="h-5 w-5 inline mr-2" />
                                Duration (minutes) *
                            </label>
                            <select
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.duration ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={90}>1.5 hours</option>
                                <option value={120}>2 hours</option>
                                <option value={180}>3 hours</option>
                            </select>
                            {errors.duration && (
                                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                                Session Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Learning JavaScript Fundamentals"
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="What would you like to learn in this session?"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {/* Learning Objectives */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Learning Objectives (Optional)
                            </label>
                            <div className="space-y-2">
                                {formData.objectives.map((objective, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={objective}
                                            onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                            placeholder={`Objective ${index + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                        {formData.objectives.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeObjective(index)}
                                                className="px-3 py-2 text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addObjective}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                + Add Objective
                            </button>
                        </div>

                        {/* Pricing */}
                        {formData.hourlyRate && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between text-sm">
                                    <div>
                                        <CurrencyDollarIcon className="h-5 w-5 inline mr-2 text-gray-500" />
                                        <span className="font-medium text-gray-700">Hourly Rate:</span>
                                        <span className="ml-2 text-gray-900">${formData.hourlyRate}/hr</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Duration:</span>
                                        <span className="ml-2 text-gray-900">{formData.duration} min</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                                        <span className="text-2xl font-bold text-indigo-600">
                                            ${calculateTotalAmount()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/sessions')}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Session'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSession;
