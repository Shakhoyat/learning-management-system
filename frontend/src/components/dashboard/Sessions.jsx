import React, { useState, useEffect } from 'react';
import {
    CalendarIcon,
    ClockIcon,
    MapPinIcon,
    StarIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    VideoCameraIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../LoadingSpinner';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showNewSessionModal, setShowNewSessionModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        // Simulated data - replace with actual API call
        setTimeout(() => {
            const mockSessions = [
                {
                    id: 1,
                    title: 'React Advanced Patterns',
                    tutor: 'Sarah Johnson',
                    student: 'Current User',
                    date: '2025-01-10',
                    time: '2:00 PM',
                    duration: 60,
                    type: 'video',
                    status: 'scheduled',
                    rating: null,
                    price: 75,
                    description: 'Learn advanced React patterns including render props, higher-order components, and compound components.',
                    meetingLink: 'https://zoom.us/j/123456789',
                    skills: ['React', 'JavaScript', 'Frontend Development'],
                },
                {
                    id: 2,
                    title: 'Node.js API Development',
                    tutor: 'Michael Chen',
                    student: 'Current User',
                    date: '2025-01-08',
                    time: '10:00 AM',
                    duration: 90,
                    type: 'video',
                    status: 'completed',
                    rating: 5,
                    price: 120,
                    description: 'Build robust APIs with Node.js, Express, and MongoDB.',
                    skills: ['Node.js', 'Express', 'MongoDB', 'Backend Development'],
                },
                {
                    id: 3,
                    title: 'Database Design Principles',
                    tutor: 'Emily Rodriguez',
                    student: 'Current User',
                    date: '2025-01-06',
                    time: '3:30 PM',
                    duration: 75,
                    type: 'in-person',
                    status: 'completed',
                    rating: 4,
                    price: 90,
                    description: 'Learn how to design efficient and scalable database schemas.',
                    location: 'Central Library, Room 204',
                    skills: ['Database Design', 'SQL', 'Data Modeling'],
                },
                {
                    id: 4,
                    title: 'TypeScript Fundamentals',
                    tutor: 'David Wilson',
                    student: 'Current User',
                    date: '2025-01-12',
                    time: '11:00 AM',
                    duration: 60,
                    type: 'video',
                    status: 'scheduled',
                    rating: null,
                    price: 65,
                    description: 'Introduction to TypeScript and its benefits over JavaScript.',
                    meetingLink: 'https://meet.google.com/abc-defg-hij',
                    skills: ['TypeScript', 'JavaScript'],
                },
                {
                    id: 5,
                    title: 'GraphQL Implementation',
                    tutor: 'Lisa Anderson',
                    student: 'Current User',
                    date: '2025-01-05',
                    time: '2:30 PM',
                    duration: 90,
                    type: 'video',
                    status: 'cancelled',
                    rating: null,
                    price: 110,
                    description: 'Implement GraphQL in your applications.',
                    skills: ['GraphQL', 'API Development'],
                },
            ];
            setSessions(mockSessions);
            setFilteredSessions(mockSessions);
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        let filtered = sessions;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(session =>
                session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                session.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by status
        if (filterStatus !== 'all') {
            filtered = filtered.filter(session => session.status === filterStatus);
        }

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(session => session.type === filterType);
        }

        setFilteredSessions(filtered);
    }, [sessions, searchTerm, filterStatus, filterType]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const SessionCard = ({ session }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>
                    <p className="text-gray-600 mb-2">with {session.tutor}</p>
                    <p className="text-sm text-gray-500 mb-3">{session.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {formatDate(session.date)}
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {session.time} ({session.duration} min)
                        </div>
                        {session.type === 'video' ? (
                            <div className="flex items-center">
                                <VideoCameraIcon className="h-4 w-4 mr-1" />
                                Video Call
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                In Person
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {session.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    {session.status === 'completed' && session.rating && (
                        <div className="flex items-center mb-2">
                            <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`h-4 w-4 ${i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                    </span>
                    <span className="text-lg font-semibold text-green-600">${session.price}</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                    <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                    </button>
                    {session.status === 'scheduled' && (
                        <>
                            <button className="flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-md hover:bg-blue-50">
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Reschedule
                            </button>
                            {session.meetingLink && (
                                <a
                                    href={session.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                                >
                                    <VideoCameraIcon className="h-4 w-4 mr-1" />
                                    Join Meeting
                                </a>
                            )}
                        </>
                    )}
                    {session.status === 'completed' && !session.rating && (
                        <button className="flex items-center px-3 py-1.5 text-sm text-yellow-600 hover:text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50">
                            <StarIcon className="h-4 w-4 mr-1" />
                            Rate Session
                        </button>
                    )}
                </div>

                {session.status === 'scheduled' && (
                    <button className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50">
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Cancel
                    </button>
                )}
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Learning Sessions</h1>
                    <p className="text-gray-600">Manage your tutoring sessions and bookings</p>
                </div>
                <button
                    onClick={() => setShowNewSessionModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Book New Session
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 input-field"
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Statuses</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="in-progress">In Progress</option>
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Types</option>
                        <option value="video">Video Call</option>
                        <option value="in-person">In Person</option>
                    </select>

                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        More Filters
                    </button>
                </div>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CalendarIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                            <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {sessions.filter(s => s.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {sessions.filter(s => s.status === 'scheduled').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <StarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(sessions.filter(s => s.rating).reduce((acc, s) => acc + s.rating, 0) /
                                    sessions.filter(s => s.rating).length || 0).toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                                ? 'Try adjusting your search criteria'
                                : 'You haven\'t booked any sessions yet'}
                        </p>
                        <button
                            onClick={() => setShowNewSessionModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Book Your First Session
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredSessions.length > 10 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                <span className="font-medium">{filteredSessions.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    Previous
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    1
                                </button>
                                <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sessions;