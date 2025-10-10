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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Modern Professional Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group">
                            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                                <AcademicCapIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                EduVerse
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 hover:scale-105">
                                Key features
                            </a>
                            <a href="#solutions" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 hover:scale-105">
                                Solutions
                            </a>
                            <a href="#testimonials" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 hover:scale-105">
                                Success stories
                            </a>
                            <a href="#about" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 hover:scale-105">
                                About us
                            </a>
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-slate-50"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Get EduVerse
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
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
                        <div className="md:hidden py-4 border-t border-slate-200/60 bg-white/95 backdrop-blur-sm rounded-b-2xl">
                            <nav className="flex flex-col space-y-3">
                                <a href="#features" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    Key features
                                </a>
                                <a href="#solutions" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    Solutions
                                </a>
                                <a href="#testimonials" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    Success stories
                                </a>
                                <a href="#about" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    About us
                                </a>
                                <div className="pt-3 flex flex-col space-y-3 px-4">
                                    <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-6 py-3 text-sm font-semibold text-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
                                        Get EduVerse
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* Hero Section - Modern Design */}
            <section className="relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-purple-100 to-transparent rounded-full blur-3xl opacity-50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideInLeft}
                            className="z-10"
                        >
                            <motion.h1
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
                                variants={fadeInUp}
                            >
                                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                                    Data-driven insights.
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                                    Human-centered learning.
                                </span>
                            </motion.h1>
                            <motion.p
                                className="text-2xl md:text-3xl font-semibold text-slate-700 mb-8 leading-relaxed"
                                variants={fadeInUp}
                            >
                                Empower your educators. <span className="text-indigo-600">Engage your learners.</span>
                            </motion.p>
                            <motion.blockquote
                                className="relative pl-8 mb-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-indigo-600 before:to-purple-600 before:rounded-full"
                                variants={fadeInUp}
                            >
                                <p className="text-lg md:text-xl text-slate-600 italic mb-4 leading-relaxed">
                                    "Technology will not replace great teachers, but technology in the hands of great teachers can be transformational."
                                </p>
                                <cite className="text-base text-slate-500 font-semibold not-italic">
                                    — George Couros
                                </cite>
                            </motion.blockquote>
                            <motion.p
                                className="text-xl md:text-2xl font-semibold mb-10 leading-relaxed"
                                variants={fadeInUp}
                            >
                                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    Shape the future of education with
                                </span>
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold"> EduVerse LMS.</span>
                            </motion.p>
                            <motion.div
                                className="flex flex-col sm:flex-row gap-6"
                                variants={fadeInUp}
                            >
                                <Link
                                    to="/register"
                                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Get started free
                                    <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white/80 backdrop-blur-sm border-2 border-indigo-200 rounded-2xl hover:bg-white hover:border-indigo-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                                    <PlayCircleIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                                    Watch demo
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            className="relative z-10"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideInRight}
                        >
                            <motion.div
                                className="relative rounded-3xl overflow-hidden shadow-2xl group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                                    alt="Students learning together"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            {/* Decorative Elements */}
                            <motion.div
                                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-20 blur-2xl"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                                transition={{ duration: 8, repeat: Infinity }}
                            ></motion.div>
                            <motion.div
                                className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl"
                                animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                                transition={{ duration: 6, repeat: Infinity }}
                            ></motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* What is EduVerse LMS Section */}
            <section id="about" className="relative py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="max-w-4xl"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.div
                            className="mb-12"
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                What is EduVerse LMS?
                            </h2>
                        </motion.div>

                        {/* Why Choose EduVerse */}
                        <motion.div
                            className="grid md:grid-cols-2 gap-6 mb-12"
                            variants={staggerContainer}
                        >
                            {whyChoose.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:bg-white/80 hover:border-indigo-200 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                                    variants={fadeInUp}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                        <CheckCircleIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Link
                                to="/register"
                                className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Get started free
                                <ArrowRightIcon className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Key Features Section */}
            <section id="features" className="py-24 bg-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-30"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
                            <CogIcon className="h-5 w-5 text-indigo-600 mr-2" />
                            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wide">
                                Key Features
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Features that set us apart
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Everything you need to create engaging learning experiences with cutting-edge technology
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
                                className="group text-center relative"
                                variants={scaleIn}
                                whileHover={{ y: -12 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative p-8 bg-white rounded-3xl shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-indigo-200 transition-all duration-300 h-full">
                                    <motion.div
                                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <feature.icon className="h-10 w-10 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity delay-100"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Solutions Section */}
            <section id="solutions" className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
                            <UserGroupIcon className="h-5 w-5 text-indigo-600 mr-2" />
                            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wide">
                                Solutions
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Perfect for every learning environment
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Trusted by institutions and organizations worldwide to deliver exceptional educational experiences
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        {useCases.map((useCase, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                variants={fadeInUp}
                                whileHover={{ y: -8 }}
                            >
                                <div className="relative h-full p-8 bg-white rounded-3xl border border-slate-200/50 hover:border-indigo-200 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden">
                                    {/* Background Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <div className="w-6 h-6 bg-white rounded-md"></div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                            {useCase.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {useCase.description}
                                        </p>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section - Modern Design */}
            <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl opacity-40"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
                            <ChartBarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                            <span className="text-sm font-bold text-indigo-700 uppercase tracking-wide">
                                Success Stories
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Transforming education worldwide
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            See how institutions are revolutionizing learning experiences with EduVerse
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
                                className="group relative"
                                variants={fadeInUp}
                                whileHover={{ y: -12 }}
                            >
                                <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-indigo-200">
                                    {/* Professional Image */}
                                    <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                        <motion.img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                                            whileHover={{ filter: "grayscale(0%)" }}
                                            style={{ filter: "grayscale(30%)" }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Floating Quote Icon */}
                                        <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                            <span className="text-indigo-600 text-2xl font-serif">"</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8">
                                        <div className="mb-6">
                                            <p className="text-slate-700 italic leading-relaxed text-lg">
                                                "{testimonial.content}"
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <div className="absolute -top-4 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
                                            <div className="pt-4">
                                                <p className="font-bold text-slate-900 text-lg mb-1">{testimonial.name}</p>
                                                <p className="text-slate-600 font-medium mb-1">{testimonial.role}</p>
                                                <p className="text-indigo-600 font-semibold">{testimonial.organization}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-xl"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse delay-1000"></div>

                <motion.div
                    className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    <motion.h2
                        className="text-4xl md:text-6xl font-bold mb-8"
                        variants={fadeInUp}
                    >
                        <span className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                            Ready to transform your
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            learning environment?
                        </span>
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-indigo-100 mb-12 leading-relaxed max-w-3xl mx-auto"
                        variants={fadeInUp}
                    >
                        Join thousands of institutions worldwide using EduVerse LMS to create exceptional educational experiences
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                        variants={fadeInUp}
                    >
                        <Link
                            to="/register"
                            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-indigo-600 bg-white rounded-2xl hover:bg-indigo-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                        >
                            Get started free
                            <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/contact"
                            className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 transform hover:scale-105"
                        >
                            Contact sales
                            <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="mt-16 pt-8 border-t border-white/20"
                        variants={fadeInUp}
                    >
                        <p className="text-indigo-200 text-sm mb-4 uppercase tracking-wide font-semibold">
                            Trusted by 50,000+ institutions worldwide
                        </p>
                        <div className="flex justify-center items-center space-x-8 opacity-60">
                            <div className="text-white/80 text-sm font-medium">Universities</div>
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <div className="text-white/80 text-sm font-medium">Corporations</div>
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <div className="text-white/80 text-sm font-medium">K-12 Schools</div>
                            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                            <div className="text-white/80 text-sm font-medium">Government</div>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                                    <AcademicCapIcon className="h-6 w-6 text-white" />
                                </div>
                                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                    EduVerse
                                </span>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                Empowering education through innovative technology and human-centered design
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <span className="text-sm font-bold">f</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <span className="text-sm font-bold">t</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <span className="text-sm font-bold">in</span>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">Product</h4>
                            <ul className="space-y-4">
                                <li><a href="#features" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Features</a></li>
                                <li><a href="#solutions" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Solutions</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Pricing</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Documentation</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">API Reference</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">Company</h4>
                            <ul className="space-y-4">
                                <li><a href="#about" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">About</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Blog</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Careers</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Contact</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Press Kit</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">Support</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Help Center</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Community</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Privacy Policy</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Terms of Service</a></li>
                                <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 hover:translate-x-1 inline-block">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-slate-400 text-sm mb-4 md:mb-0">
                                &copy; {new Date().getFullYear()} EduVerse. All rights reserved. Built with ❤️ for educators worldwide.
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-slate-400">
                                <span>🌟 4.9/5 from 50,000+ users</span>
                                <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                <span>🚀 99.9% uptime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;