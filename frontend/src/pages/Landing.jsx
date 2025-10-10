import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRightIcon,
    AcademicCapIcon,
    UserGroupIcon,
    CheckCircleIcon,
    SparklesIcon,
    ChartBarIcon,
    CogIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    Bars3Icon,
    XMarkIcon,
    PlayCircleIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.8 }
        }
    };

    const slideInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const slideInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const keyFeatures = [
        {
            icon: CogIcon,
            title: 'Fully Customisable',
            description: 'Tailor every aspect of your learning environment to match your organization\'s unique needs and brand identity.'
        },
        {
            icon: GlobeAltIcon,
            title: 'Accessible Anywhere',
            description: 'Learn from any device, anywhere in the world. Our responsive platform works seamlessly across all devices.'
        },
        {
            icon: ChartBarIcon,
            title: 'Powerful Analytics',
            description: 'Gain deep insights into learner progress, engagement, and outcomes with comprehensive reporting tools.'
        },
        {
            icon: DevicePhoneMobileIcon,
            title: 'Mobile-First Design',
            description: 'Built for the modern learner with a mobile-first approach that ensures excellent experience on any screen size.'
        }
    ];

    const whyChoose = [
        'Trusted by thousands of institutions worldwide',
        'Open source with enterprise-grade security',
        'Seamlessly integrate with your existing tools',
        'Scale from small classrooms to global universities',
        'Continuous updates and improvements',
        'Dedicated support and extensive documentation'
    ];

    const testimonials = [
        {
            name: 'Dr. Sarah Mitchell',
            role: 'Dean of Online Learning',
            organization: 'Metropolitan University',
            content: 'EduVerse was our technology of choice because it had the features, functionality, and customisability we wanted, which allowed us to create bespoke plugins specific to the University\'s needs.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
        },
        {
            name: 'Prof. James Chen',
            role: 'Director of Educational Technology',
            organization: 'Global Tech Institute',
            content: 'The flexibility to grow and adapt our eLearning platform to all our learners\' needs, now and in the future, has been transformative for our institution.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
        },
        {
            name: 'Maria Rodriguez',
            role: 'Head of Digital Learning',
            organization: 'International Academy',
            content: 'From K-12 classrooms to executive education, EduVerse offers the flexibility and power we need to deliver exceptional learning experiences at scale.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
        }
    ];

    const useCases = [
        {
            title: 'Higher Education',
            description: 'Empower universities with comprehensive course management and collaborative learning tools.'
        },
        {
            title: 'Corporate Training',
            description: 'Deliver engaging professional development programs that drive business results.'
        },
        {
            title: 'K-12 Schools',
            description: 'Create interactive, age-appropriate learning experiences that engage young learners.'
        },
        {
            title: 'Government & Healthcare',
            description: 'Meet compliance requirements while delivering effective training programs.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Clean Professional Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">
                                EduVerse
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Key features
                            </a>
                            <a href="#solutions" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Solutions
                            </a>
                            <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                Success stories
                            </a>
                            <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                About us
                            </a>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                            >
                                Get EduVerse
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <nav className="flex flex-col space-y-3">
                                <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                                    Key features
                                </a>
                                <a href="#solutions" className="text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                                    Solutions
                                </a>
                                <a href="#testimonials" className="text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                                    Success stories
                                </a>
                                <a href="#about" className="text-sm font-medium text-gray-700 hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                                    About us
                                </a>
                                <div className="pt-3 flex flex-col space-y-2">
                                    <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-5 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded hover:bg-blue-700">
                                        Get EduVerse
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section - Moodle-inspired */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideInLeft}
                        >
                            <motion.h1
                                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                                variants={fadeInUp}
                            >
                                Data-driven insights. Human-centered learning.
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 leading-relaxed"
                                variants={fadeInUp}
                            >
                                Empower your educators. Engage your learners.
                            </motion.p>
                            <motion.blockquote
                                className="border-l-4 border-blue-600 pl-6 mb-6"
                                variants={fadeInUp}
                            >
                                <p className="text-lg md:text-xl text-gray-700 italic mb-3 leading-relaxed">
                                    "Technology will not replace great teachers, but technology in the hands of great teachers can be transformational."
                                </p>
                                <cite className="text-base text-gray-600 font-medium not-italic">
                                    — George Couros
                                </cite>
                            </motion.blockquote>
                            <motion.p
                                className="text-xl md:text-2xl font-medium text-gray-900 mb-8 leading-relaxed"
                                variants={fadeInUp}
                            >
                                Shape the future of education with EduVerse LMS.
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-4"
                                variants={fadeInUp}
                            >
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-all hover:scale-105"
                                >
                                    Get started free
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                                <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-600 bg-white border-2 border-blue-600 rounded hover:bg-blue-50 transition-all hover:scale-105">
                                    <PlayCircleIcon className="mr-2 h-5 w-5" />
                                    Watch demo
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            className="relative"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideInRight}
                        >
                            <motion.div
                                className="aspect-w-16 aspect-h-10 rounded-lg overflow-hidden shadow-2xl"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                                    alt="Students learning together"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            {/* Decorative accent */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-400 rounded-full opacity-20 blur-2xl"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            ></motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What is EduVerse LMS Section */}
            <section id="about" className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="max-w-3xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.p
                            className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3"
                            variants={fadeInUp}
                        >
                            What is EduVerse LMS?
                        </motion.p>
                        <motion.h2
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight"
                            variants={fadeInUp}
                        >
                            Data-driven insights. Human-centered learning.
                        </motion.h2>
                        <motion.p
                            className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 leading-relaxed"
                            variants={fadeInUp}
                        >
                            Empower your educators. Engage your learners.
                        </motion.p>
                        <motion.blockquote
                            className="border-l-4 border-blue-600 pl-6 mb-6"
                            variants={fadeInUp}
                        >
                            <p className="text-lg md:text-xl text-gray-700 italic mb-3 leading-relaxed">
                                "Technology will not replace great teachers, but technology in the hands of great teachers can be transformational."
                            </p>
                            <cite className="text-base text-gray-600 font-medium not-italic">
                                — George Couros
                            </cite>
                        </motion.blockquote>
                        <motion.p
                            className="text-xl md:text-2xl font-medium text-gray-900 mb-8 leading-relaxed"
                            variants={fadeInUp}
                        >
                            Shape the future of education with EduVerse LMS.
                        </motion.p>

                        {/* Why Choose EduVerse */}
                        <motion.div
                            className="grid md:grid-cols-2 gap-4 mb-8"
                            variants={staggerContainer}
                        >
                            {whyChoose.map((item, index) => (
                                <motion.div key={index} className="flex items-start" variants={fadeInUp}>
                                    <CheckCircleIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-all hover:scale-105"
                            >
                                Get started free
                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Key Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Key features that set us apart
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to create engaging learning experiences
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {keyFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="text-center group"
                                variants={scaleIn}
                                whileHover={{ y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-600 transition-colors duration-300"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <feature.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                                </motion.div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Solutions Section */}
            <section id="solutions" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Solutions for every learning environment
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Trusted by institutions and organizations worldwide
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {useCases.map((useCase, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-lg p-6 hover:shadow-lg transition-all border border-gray-200"
                                variants={fadeInUp}
                                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            >
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {useCase.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {useCase.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section - Moodle-inspired */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Success stories from around the world
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            See how institutions are transforming education with EduVerse
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-2xl transition-shadow group"
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                            >
                                {/* Professional Image */}
                                <div className="h-64 bg-gray-200 overflow-hidden relative">
                                    <motion.img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover grayscale"
                                        whileHover={{ scale: 1.1, filter: "grayscale(0%)" }}
                                        transition={{ duration: 0.4 }}
                                    />
                                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <p className="text-gray-700 italic mb-4 leading-relaxed">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                        <p className="text-sm text-blue-600 font-medium">{testimonial.organization}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <motion.div
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-white mb-6"
                        variants={fadeInUp}
                    >
                        Ready to transform your learning environment?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-blue-100 mb-8"
                        variants={fadeInUp}
                    >
                        Join thousands of institutions worldwide using EduVerse LMS
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        variants={fadeInUp}
                    >
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-blue-600 bg-white rounded hover:bg-gray-50 transition-all hover:scale-105"
                        >
                            Get started free
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-700 rounded hover:bg-blue-800 transition-all hover:scale-105 border-2 border-white"
                        >
                            Contact sales
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <AcademicCapIcon className="h-8 w-8 text-blue-400" />
                                <span className="ml-2 text-xl font-bold text-white">EduVerse</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Empowering education through technology
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#solutions" className="hover:text-white transition-colors">Solutions</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} EduVerse. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;