import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, AcademicCapIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const Landing = () => {
    const features = [
        {
            icon: AcademicCapIcon,
            title: 'Learn Any Skill',
            description: 'Connect with expert tutors in programming, design, languages, and more.'
        },
        {
            icon: UserGroupIcon,
            title: 'Teach & Earn',
            description: 'Share your knowledge and earn money by teaching others.'
        },
        {
            icon: ClockIcon,
            title: 'Flexible Scheduling',
            description: 'Book sessions that fit your schedule with our smart matching system.'
        }
    ];

    const stats = [
        { label: 'Active Tutors', value: '500+' },
        { label: 'Skills Available', value: '100+' },
        { label: 'Sessions Completed', value: '10,000+' },
        { label: 'Student Satisfaction', value: '98%' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">LearnConnect</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
                            <a href="#how-it-works" className="text-gray-500 hover:text-gray-900">How It Works</a>
                            <a href="#pricing" className="text-gray-500 hover:text-gray-900">Pricing</a>
                        </nav>
                        <div className="flex space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Learn Skills.<br />
                            Teach Others.<br />
                            <span className="text-yellow-300">Grow Together.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
                            Connect with expert tutors and passionate learners in our community-driven learning platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register?role=learner"
                                className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center"
                            >
                                Start Learning
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/register?role=tutor"
                                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold"
                            >
                                Become a Tutor
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose LearnConnect?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform makes learning and teaching easier, more effective, and more enjoyable.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-4">
                                    <feature.icon className="h-8 w-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-indigo-600 py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Start Your Learning Journey?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of learners and tutors in our community today.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-semibold inline-flex items-center"
                    >
                        Get Started Now
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <AcademicCapIcon className="h-8 w-8 text-indigo-400" />
                                <span className="ml-2 text-xl font-bold">LearnConnect</span>
                            </div>
                            <p className="text-gray-400">
                                Connecting learners and tutors worldwide for better education.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Platform</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">For Learners</a></li>
                                <li><a href="#" className="hover:text-white">For Tutors</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">FAQ</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 LearnConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;