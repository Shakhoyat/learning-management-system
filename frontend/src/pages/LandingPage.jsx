import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, BookOpenIcon, UsersIcon, StarIcon, CheckIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    const features = [
        {
            icon: BookOpenIcon,
            title: 'Expert-Led Learning',
            description: 'Learn from industry professionals and subject matter experts who bring real-world experience to every session.',
        },
        {
            icon: UsersIcon,
            title: 'Personalized Matching',
            description: 'Our intelligent matching system connects you with the perfect mentor or tutor based on your learning goals and preferences.',
        },
        {
            icon: StarIcon,
            title: 'Flexible Scheduling',
            description: 'Book sessions that fit your schedule with 24/7 availability and instant booking confirmation.',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Developer',
            content: 'This platform transformed my coding skills. The mentors are incredibly knowledgeable and patient.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
            name: 'Michael Chen',
            role: 'Marketing Manager',
            content: 'The personalized approach helped me master digital marketing strategies faster than any course I\'ve taken.',
            avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Data Scientist',
            content: 'Amazing platform! The tutors are professionals who really understand the industry needs.',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    ];

    const pricingPlans = [
        {
            name: 'Starter',
            price: '$29',
            period: '/month',
            description: 'Perfect for beginners',
            features: [
                '5 hours of tutoring per month',
                'Basic skill assessments',
                'Email support',
                'Learning progress tracking',
            ],
            popular: false,
        },
        {
            name: 'Professional',
            price: '$79',
            period: '/month',
            description: 'Most popular choice',
            features: [
                '15 hours of tutoring per month',
                'Advanced skill assessments',
                'Priority support',
                'Personalized learning paths',
                'Group session access',
                'Career guidance sessions',
            ],
            popular: true,
        },
        {
            name: 'Enterprise',
            price: '$199',
            period: '/month',
            description: 'For teams and organizations',
            features: [
                'Unlimited tutoring hours',
                'Custom skill assessments',
                '24/7 dedicated support',
                'Team management dashboard',
                'Advanced analytics',
                'Custom integrations',
            ],
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <BookOpenIcon className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-900">EduMentor</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Learn from the Best,
                            <br />
                            <span className="text-primary-200">Achieve Your Goals</span>
                        </h1>
                        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            Connect with expert mentors and tutors who will guide you to success.
                            Personalized learning experiences tailored to your unique goals and learning style.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
                            >
                                Start Learning Today
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose EduMentor?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We connect passionate learners with expert mentors to create transformative educational experiences.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-6">
                                    <feature.icon className="h-6 w-6 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            What Our Students Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Don't just take our word for it. Here's what our community of learners has to say.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-8">
                                <div className="flex items-center mb-4">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover"
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Choose Your Learning Plan
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Flexible pricing options to fit your learning needs and budget.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-lg shadow-md overflow-hidden ${plan.popular ? 'ring-2 ring-primary-500 transform scale-105' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="bg-primary-500 text-white text-center py-2 px-4">
                                        <span className="text-sm font-semibold">Most Popular</span>
                                    </div>
                                )}
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    <p className="text-gray-600 mb-4">{plan.description}</p>
                                    <div className="flex items-baseline mb-6">
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        <span className="text-gray-600 ml-1">{plan.period}</span>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        to="/register"
                                        className={`w-full py-3 px-4 rounded-lg text-center font-semibold transition-colors inline-block ${plan.popular
                                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                            }`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Start Your Learning Journey?
                        </h2>
                        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of learners who have already transformed their careers with EduMentor.
                        </p>
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
                        >
                            Get Started Now
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <BookOpenIcon className="h-8 w-8 text-primary-400" />
                                <span className="ml-2 text-2xl font-bold text-white">EduMentor</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Empowering learners worldwide through personalized mentorship and expert guidance.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                        <p className="text-gray-400">© 2025 EduMentor. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;