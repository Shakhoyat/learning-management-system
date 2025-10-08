# Ultimate Frontend Implementation Guide
## Learning Management System - Complete Frontend Development Guide

### Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Authentication System](#authentication-system)
6. [Landing Page](#landing-page)
7. [User Registration & Login](#user-registration--login)
8. [Dashboard Implementation](#dashboard-implementation)
9. [User Profile Management](#user-profile-management)
10. [Skills Management](#skills-management)
11. [Session Management](#session-management)
12. [Matching System](#matching-system)
13. [Payment Integration](#payment-integration)
14. [Notification System](#notification-system)
15. [Admin Panel](#admin-panel)
16. [Responsive Design](#responsive-design)
17. [State Management](#state-management)
18. [API Integration](#api-integration)
19. [Testing Strategy](#testing-strategy)
20. [Deployment](#deployment)

---

## Project Overview

This Learning Management System frontend connects users (tutors and learners) for skill exchange. The system supports:
- **User Authentication** (registration, login, password reset)
- **Role-based Access** (admin, tutor, learner)
- **Skill Management** (teaching/learning skills)
- **Session Scheduling** (booking, management, feedback)
- **Matching System** (tutor-learner matching)
- **Payment Processing** (session payments, refunds)
- **Notification System** (real-time updates)
- **Profile Management** (user profiles, statistics)

---

## Technology Stack

### Core Technologies
- **React 18** with Hooks and Context API
- **Vite** for build tooling and development
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Query/TanStack Query** for data fetching and caching

### UI Components & Libraries
- **Headless UI** for accessible components
- **Hero Icons** for iconography
- **React Hook Form** for form management
- **Zod** for form validation
- **React Hot Toast** for notifications
- **React Date Picker** for date/time selection
- **Chart.js/Recharts** for data visualization

### Authentication & Security
- **JWT** for authentication tokens
- **React Context** for auth state management
- **Protected Routes** for role-based access

---

## Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── Modal.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── ForgotPasswordForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── RecentSessions.jsx
│   │   │   ├── UpcomingSessions.jsx
│   │   │   └── QuickActions.jsx
│   │   ├── sessions/
│   │   │   ├── SessionCard.jsx
│   │   │   ├── SessionForm.jsx
│   │   │   ├── SessionDetails.jsx
│   │   │   ├── SessionCalendar.jsx
│   │   │   └── FeedbackForm.jsx
│   │   ├── skills/
│   │   │   ├── SkillCard.jsx
│   │   │   ├── SkillSelector.jsx
│   │   │   ├── SkillLevel.jsx
│   │   │   └── SkillCategories.jsx
│   │   ├── users/
│   │   │   ├── UserCard.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── UserStats.jsx
│   │   │   └── UserSearch.jsx
│   │   ├── payments/
│   │   │   ├── PaymentForm.jsx
│   │   │   ├── PaymentHistory.jsx
│   │   │   └── RefundRequest.jsx
│   │   ├── notifications/
│   │   │   ├── NotificationItem.jsx
│   │   │   ├── NotificationList.jsx
│   │   │   └── NotificationPreferences.jsx
│   │   └── matching/
│   │       ├── TutorCard.jsx
│   │       ├── LearnerCard.jsx
│   │       └── MatchingFilters.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Sessions.jsx
│   │   ├── Skills.jsx
│   │   ├── FindTutors.jsx
│   │   ├── FindLearners.jsx
│   │   ├── Payments.jsx
│   │   ├── Notifications.jsx
│   │   └── AdminPanel.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useLocalStorage.js
│   │   └── useWebSocket.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── sessions.js
│   │   ├── skills.js
│   │   ├── payments.js
│   │   ├── notifications.js
│   │   └── matching.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

---

## Environment Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control
- VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Auto Rename Tag
  - Prettier - Code formatter
  - ESLint

### Installation Steps

1. **Clone and Setup Project**
```bash
cd frontend
npm install
```

2. **Environment Variables**
Create `.env` file in frontend root:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_APP_NAME=Learning Management System
VITE_APP_VERSION=1.0.0
```

3. **Install Additional Dependencies**
```bash
npm install axios react-router-dom @tanstack/react-query
npm install @heroicons/react @headlessui/react
npm install react-hook-form @hookform/resolvers zod
npm install react-hot-toast react-datepicker
npm install chart.js react-chartjs-2
npm install socket.io-client
npm install date-fns clsx
```

4. **Development Server**
```bash
npm run dev
```

---

## Authentication System

### Auth Context Implementation

**src/contexts/AuthContext.jsx**
```jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true 
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getCurrentUser()
        .then(user => {
          dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authService.updateProfile(updates);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Protected Route Component

**src/components/auth/ProtectedRoute.jsx**
```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## Landing Page

### Landing Page Component

**src/pages/Landing.jsx**
```jsx
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
```

---

## User Registration & Login

### Login Form Component

**src/components/auth/LoginForm.jsx**
```jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
```

### Registration Form Component

**src/components/auth/RegisterForm.jsx**
```jsx
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['tutor', 'learner']),
  timezone: z.string(),
  bio: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const defaultRole = searchParams.get('role') || 'learner';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      toast.success('Account created successfully! Welcome to LearnConnect!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${
                selectedRole === 'learner' 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  {...register('role')}
                  type="radio"
                  value="learner"
                  className="sr-only"
                />
                <div className="font-medium">Learn Skills</div>
                <div className="text-sm text-gray-500 mt-1">Find tutors and learn new skills</div>
              </label>
              <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${
                selectedRole === 'tutor' 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  {...register('role')}
                  type="radio"
                  value="tutor"
                  className="sr-only"
                />
                <div className="font-medium">Teach & Earn</div>
                <div className="text-sm text-gray-500 mt-1">Share knowledge and earn money</div>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                autoComplete="name"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {selectedRole === 'tutor' && (
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio (Optional)
                </label>
                <textarea
                  {...register('bio')}
                  rows={3}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tell us about yourself and your teaching experience..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
```

---

## Dashboard Implementation

### Main Dashboard Component

**src/pages/Dashboard.jsx**
```jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentSessions from '../components/dashboard/RecentSessions';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import QuickActions from '../components/dashboard/QuickActions';
import { sessionService } from '../services/sessions';
import { userService } from '../services/users';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentSessions: [],
    upcomingSessions: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [stats, upcomingSessions] = await Promise.all([
          userService.getUserStats(user.id),
          sessionService.getUpcomingSessions()
        ]);

        setDashboardData({
          stats,
          upcomingSessions: upcomingSessions.slice(0, 5),
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'tutor' 
              ? "Here's what's happening with your tutoring sessions today."
              : "Continue your learning journey with upcoming sessions and new opportunities."
            }
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="px-4 sm:px-0 mb-8">
          <DashboardStats 
            stats={dashboardData.stats} 
            userRole={user?.role} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="px-4 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Sessions */}
            <div className="lg:col-span-2 space-y-8">
              <UpcomingSessions 
                sessions={dashboardData.upcomingSessions}
                userRole={user?.role}
              />
              <RecentSessions 
                userRole={user?.role}
              />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions 
                userRole={user?.role}
                userStats={dashboardData.stats}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### Dashboard Stats Component

**src/components/dashboard/DashboardStats.jsx**
```jsx
import React from 'react';
import { 
  AcademicCapIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats, userRole }) => {
  if (!stats) return null;

  const tutorStats = [
    {
      title: 'Total Sessions',
      value: stats.totalSessions || 0,
      icon: CalendarIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings || 0}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Average Rating',
      value: `${stats.averageRating || 0}/5`,
      icon: StarIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Hours Taught',
      value: `${stats.hoursTaught || 0}h`,
      icon: ClockIcon,
      color: 'bg-purple-500'
    }
  ];

  const learnerStats = [
    {
      title: 'Sessions Attended',
      value: stats.sessionsAttended || 0,
      icon: CalendarIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent || 0}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Skills Learning',
      value: stats.skillsLearning || 0,
      icon: AcademicCapIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Hours Learned',
      value: `${stats.hoursLearned || 0}h`,
      icon: ClockIcon,
      color: 'bg-purple-500'
    }
  ];

  const displayStats = userRole === 'tutor' ? tutorStats : learnerStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
```

### Quick Actions Component

**src/components/dashboard/QuickActions.jsx**
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  CalendarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const QuickActions = ({ userRole, userStats }) => {
  const tutorActions = [
    {
      title: 'Create Session',
      description: 'Schedule a new tutoring session',
      href: '/sessions/create',
      icon: PlusIcon,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'Find Learners',
      description: 'Browse students looking for tutoring',
      href: '/find-learners',
      icon: MagnifyingGlassIcon,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Manage Skills',
      description: 'Update your teaching skills',
      href: '/profile?tab=skills',
      icon: AcademicCapIcon,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'View Earnings',
      description: 'Check your payment history',
      href: '/payments',
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    }
  ];

  const learnerActions = [
    {
      title: 'Find Tutors',
      description: 'Search for expert tutors',
      href: '/find-tutors',
      icon: MagnifyingGlassIcon,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'My Sessions',
      description: 'View upcoming and past sessions',
      href: '/sessions',
      icon: CalendarIcon,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Learning Goals',
      description: 'Set and track your goals',
      href: '/profile?tab=goals',
      icon: AcademicCapIcon,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Browse Skills',
      description: 'Explore skills to learn',
      href: '/skills',
      icon: AcademicCapIcon,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const actions = userRole === 'tutor' ? tutorActions : learnerActions;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className={`${action.color} text-white p-4 rounded-lg block transition-colors`}
            >
              <div className="flex items-center">
                <action.icon className="h-6 w-6 mr-3" />
                <div>
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Notifications Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/notifications"
            className="flex items-center justify-between text-sm text-gray-600 hover:text-gray-900"
          >
            <div className="flex items-center">
              <BellIcon className="h-5 w-5 mr-2" />
              <span>Notifications</span>
            </div>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {userStats?.unreadNotifications || 0}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
```

---

## API Integration

### Base API Service

**src/services/api.js**
```jsx
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          toast.error('Your session has expired. Please log in again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('The requested resource was not found.');
          break;
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(error => toast.error(error.message));
          } else {
            toast.error(data.message || 'Validation failed.');
          }
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data.message || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Authentication Service

**src/services/auth.js**
```jsx
import api from './api';

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.user;
  },

  // Update user profile
  updateProfile: async (updates) => {
    const response = await api.put('/auth/profile', updates);
    return response.user;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response;
  }
};
```

### User Service

**src/services/users.js**
```jsx
import api from './api';

export const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.user;
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.stats;
  },

  // Update user
  updateUser: async (userId, updates) => {
    const response = await api.put(`/users/${userId}`, updates);
    return response.user;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response;
  },

  // Teaching skills management
  addTeachingSkill: async (userId, skillData) => {
    const response = await api.post(`/users/${userId}/teaching-skills`, skillData);
    return response;
  },

  removeTeachingSkill: async (userId, skillId) => {
    const response = await api.delete(`/users/${userId}/teaching-skills/${skillId}`);
    return response;
  },

  // Learning skills management
  addLearningSkill: async (userId, skillData) => {
    const response = await api.post(`/users/${userId}/learning-skills`, skillData);
    return response;
  },

  removeLearningSkill: async (userId, skillId) => {
    const response = await api.delete(`/users/${userId}/learning-skills/${skillId}`);
    return response;
  }
};
```

### Session Service

**src/services/sessions.js**
```jsx
import api from './api';

export const sessionService = {
  // Get all sessions with filters
  getAllSessions: async (params = {}) => {
    const response = await api.get('/sessions', { params });
    return response;
  },

  // Get upcoming sessions
  getUpcomingSessions: async () => {
    const response = await api.get('/sessions/upcoming');
    return response.sessions;
  },

  // Get session statistics
  getSessionStats: async () => {
    const response = await api.get('/sessions/stats');
    return response.stats;
  },

  // Get session by ID
  getSessionById: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.session;
  },

  // Create new session
  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.session;
  },

  // Update session
  updateSession: async (sessionId, updates) => {
    const response = await api.put(`/sessions/${sessionId}`, updates);
    return response.session;
  },

  // Cancel session
  cancelSession: async (sessionId, reason) => {
    const response = await api.delete(`/sessions/${sessionId}`, { 
      data: { reason } 
    });
    return response;
  },

  // Start session
  startSession: async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/start`);
    return response;
  },

  // Complete session
  completeSession: async (sessionId, completionData) => {
    const response = await api.post(`/sessions/${sessionId}/complete`, completionData);
    return response;
  },

  // Add session feedback
  addFeedback: async (sessionId, feedback) => {
    const response = await api.post(`/sessions/${sessionId}/feedback`, feedback);
    return response;
  }
};
```

### Skills Service

**src/services/skills.js**
```jsx
import api from './api';

export const skillService = {
  // Get all skills with pagination
  getAllSkills: async (params = {}) => {
    const response = await api.get('/skills', { params });
    return response;
  },

  // Search skills
  searchSkills: async (query, filters = {}) => {
    const response = await api.get('/skills/search', { 
      params: { q: query, ...filters } 
    });
    return response;
  },

  // Get skill categories
  getCategories: async () => {
    const response = await api.get('/skills/categories');
    return response.categories;
  },

  // Get skills by category
  getSkillsByCategory: async (category) => {
    const response = await api.get(`/skills/categories/${category}`);
    return response.skills;
  },

  // Get popular skills
  getPopularSkills: async () => {
    const response = await api.get('/skills/popular');
    return response.skills;
  },

  // Get trending skills
  getTrendingSkills: async () => {
    const response = await api.get('/skills/trending');
    return response.skills;
  },

  // Get skill statistics
  getSkillStatistics: async () => {
    const response = await api.get('/skills/statistics');
    return response.statistics;
  },

  // Get skill by ID
  getSkillById: async (skillId) => {
    const response = await api.get(`/skills/${skillId}`);
    return response.skill;
  },

  // Get skill prerequisites
  getSkillPrerequisites: async (skillId) => {
    const response = await api.get(`/skills/${skillId}/prerequisites`);
    return response.prerequisites;
  },

  // Get skill learning path
  getSkillPath: async (skillId) => {
    const response = await api.get(`/skills/${skillId}/path`);
    return response.path;
  },

  // Admin only - Create skill
  createSkill: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.skill;
  },

  // Admin only - Update skill
  updateSkill: async (skillId, updates) => {
    const response = await api.put(`/skills/${skillId}`, updates);
    return response.skill;
  },

  // Admin only - Delete skill
  deleteSkill: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response;
  }
};
```

### Matching Service

**src/services/matching.js**
```jsx
import api from './api';

export const matchingService = {
  // Find tutors with filters
  findTutors: async (params = {}) => {
    const response = await api.get('/matching/tutors', { params });
    return response;
  },

  // Find learners looking for tutoring
  findLearners: async (params = {}) => {
    const response = await api.get('/matching/learners', { params });
    return response;
  },

  // Get skill-based matches
  getSkillMatches: async (skillId, params = {}) => {
    const response = await api.get('/matching/skills', { 
      params: { skillId, ...params } 
    });
    return response;
  },

  // Get recommended skills
  getRecommendedSkills: async () => {
    const response = await api.get('/matching/recommendations');
    return response.recommendations;
  },

  // Get matching statistics
  getMatchingStats: async () => {
    const response = await api.get('/matching/stats');
    return response.stats;
  }
};
```

### Payment Service

**src/services/payments.js**
```jsx
import api from './api';

export const paymentService = {
  // Get all payments for current user
  getAllPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response;
  },

  // Get payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.methods;
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.stats;
  },

  // Get payment by ID
  getPaymentById: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.payment;
  },

  // Create payment
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.payment;
  },

  // Request refund
  requestRefund: async (paymentId, reason) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return response;
  }
};
```

### Notification Service

**src/services/notifications.js**
```jsx
import api from './api';

export const notificationService = {
  // Get notifications for current user
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response;
  },

  // Get unread notification count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.count;
  },

  // Get notification preferences
  getNotificationPreferences: async () => {
    const response = await api.get('/notifications/preferences');
    return response.preferences;
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    const response = await api.put('/notifications/preferences', preferences);
    return response.preferences;
  },

  // Get notification by ID
  getNotificationById: async (notificationId) => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.notification;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response;
  },

  // Mark notification as dismissed
  markAsDismissed: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/dismiss`);
    return response;
  },

  // Mark multiple notifications as read
  markMultipleAsRead: async (notificationIds) => {
    const response = await api.put('/notifications/read/multiple', { notificationIds });
    return response;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read/all');
    return response;
  },

  // Record notification action
  recordAction: async (notificationId, action) => {
    const response = await api.post(`/notifications/${notificationId}/action`, { action });
    return response;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response;
  }
};
```

---

## User Profile Management

### Profile Page Component

**src/pages/Profile.jsx**
```jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tab } from '@headlessui/react';
import { userService } from '../services/users';
import { skillService } from '../services/skills';
import ProfileInfo from '../components/users/ProfileInfo';
import ProfileSkills from '../components/users/ProfileSkills';
import ProfileStats from '../components/users/ProfileStats';
import ProfileSettings from '../components/users/ProfileSettings';

const Profile = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileData, setProfileData] = useState({
    stats: null,
    skills: [],
    loading: true
  });

  const activeTab = searchParams.get('tab') || 'profile';
  
  const tabs = [
    { id: 'profile', name: 'Profile Info', component: ProfileInfo },
    { id: 'skills', name: 'Skills', component: ProfileSkills },
    { id: 'stats', name: 'Statistics', component: ProfileStats },
    { id: 'settings', name: 'Settings', component: ProfileSettings }
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [stats] = await Promise.all([
          userService.getUserStats(user.id)
        ]);

        setProfileData({
          stats,
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setProfileData(prev => ({ ...prev, loading: false }));
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  if (profileData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Profile Management
          </h1>

          <Tab.Group selectedIndex={activeTabIndex} onChange={(index) => handleTabChange(tabs[index].id)}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                      selected
                        ? 'bg-white shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    }`
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <Tab.Panel key={tab.id}>
                    <Component 
                      user={user}
                      stats={profileData.stats}
                      onUpdate={() => window.location.reload()} // Simple refresh for demo
                    />
                  </Tab.Panel>
                );
              })}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default Profile;
```

---

## Skills Management

### Skills Browser Page

**src/pages/Skills.jsx**
```jsx
import React, { useState, useEffect } from 'react';
import { skillService } from '../services/skills';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import SkillCard from '../components/skills/SkillCard';
import SkillCategories from '../components/skills/SkillCategories';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [skillsData, categoriesData] = await Promise.all([
          skillService.getAllSkills({ 
            sort: sortBy,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: searchQuery || undefined
          }),
          skillService.getCategories()
        ]);

        setSkills(skillsData.skills || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Failed to fetch skills data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await skillService.searchSkills(query, {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sortBy
        });
        setSkills(searchResults.skills || []);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Skills
            </h1>
            <p className="text-gray-600">
              Discover skills you can learn or teach in our community
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="popularity">Most Popular</option>
                <option value="trending">Trending</option>
                <option value="alphabetical">A-Z</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>

          {/* Empty State */}
          {skills.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No skills found
              </div>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;
```

---

## Session Management

### Session Booking Component

**src/components/sessions/SessionForm.jsx**
```jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sessionService } from '../../services/sessions';
import { skillService } from '../../services/skills';
import { useAuth } from '../../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';

const sessionSchema = z.object({
  skill: z.string().min(1, 'Please select a skill'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  duration: z.number().min(15, 'Minimum duration is 15 minutes').max(300, 'Maximum duration is 5 hours'),
  scheduledDate: z.date(),
  learner: z.string().optional() // For tutors creating sessions
});

const SessionForm = ({ onSuccess, existingSession = null, tutorId = null }) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: existingSession || {
      duration: 60,
      scheduledDate: new Date()
    }
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await skillService.getAllSkills();
        setSkills(skillsData.skills || []);
      } catch (error) {
        console.error('Failed to fetch skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const sessionData = {
        ...data,
        scheduledDate: selectedDate,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      if (tutorId) {
        sessionData.tutor = tutorId;
        sessionData.learner = user.id;
      } else {
        sessionData.tutor = user.id;
      }

      let result;
      if (existingSession) {
        result = await sessionService.updateSession(existingSession._id, sessionData);
      } else {
        result = await sessionService.createSession(sessionData);
      }

      toast.success(existingSession ? 'Session updated successfully!' : 'Session booked successfully!');
      onSuccess?.(result);
    } catch (error) {
      toast.error(error.message || 'Failed to process session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Skill Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill
        </label>
        <select
          {...register('skill')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a skill</option>
          {skills.map((skill) => (
            <option key={skill._id} value={skill._id}>
              {skill.name}
            </option>
          ))}
        </select>
        {errors.skill && (
          <p className="mt-1 text-sm text-red-600">{errors.skill.message}</p>
        )}
      </div>

      {/* Session Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Title
        </label>
        <input
          {...register('title')}
          type="text"
          placeholder="e.g., Introduction to React Hooks"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Describe what will be covered in this session..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date & Time
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setValue('scheduledDate', date);
            }}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <select
            {...register('duration', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
            <option value={180}>3 hours</option>
          </select>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSuccess?.(null)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : (existingSession ? 'Update Session' : 'Book Session')}
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
```

---

## Payment Integration

### Payment Processing Component

**src/components/payments/PaymentForm.jsx**
```jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { paymentService } from '../../services/payments';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().default('USD'),
  sessionId: z.string().min(1, 'Session ID is required'),
  paymentMethod: z.enum(['card', 'paypal']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional()
});

const PaymentForm = ({ session, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: session?.price || 0,
      currency: 'USD',
      sessionId: session?._id,
      paymentMethod: 'card'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const paymentData = {
        ...data,
        session: session._id,
        description: `Payment for session: ${session.title}`
      };

      const result = await paymentService.createPayment(paymentData);
      
      toast.success('Payment processed successfully!');
      onSuccess?.(result);
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Complete Payment
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Session:</span>
            <span className="font-medium">{session?.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-lg font-bold text-green-600">
              ${session?.price || 0}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-colors ${
              paymentMethod === 'card' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <CreditCardIcon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">Credit Card</div>
            </label>
            <label className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-colors ${
              paymentMethod === 'paypal' 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className="h-6 w-6 mx-auto mb-2 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                PP
              </div>
              <div className="text-sm font-medium">PayPal</div>
            </label>
          </div>
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                {...register('cardholderName')}
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                {...register('cardNumber')}
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  {...register('expiryDate')}
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  {...register('cvv')}
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </>
        )}

        {/* Security Notice */}
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <LockClosedIcon className="h-5 w-5 mr-2" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${session?.price || 0}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
```

---

## Responsive Design & State Management

### Responsive Design Guidelines

The application uses Tailwind CSS for responsive design with mobile-first approach:

#### Breakpoints
- **sm**: 640px and up (small tablets)
- **md**: 768px and up (tablets)
- **lg**: 1024px and up (laptops)
- **xl**: 1280px and up (desktops)
- **2xl**: 1536px and up (large desktops)

#### Mobile Navigation
```jsx
// Example mobile navigation with Tailwind
<nav className="md:hidden">
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="p-2 rounded-md text-gray-400 hover:text-gray-500"
  >
    <Bars3Icon className="h-6 w-6" />
  </button>
</nav>
```

### Context-Based State Management

The application uses React Context for global state management:

**src/contexts/AppContext.jsx**
```jsx
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    loading: false,
    error: null,
    notifications: []
  });

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

---

## Testing Strategy

### Testing Setup

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

**vite.config.js** (Testing Configuration)
```javascript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

### Component Testing Example

**src/components/auth/__tests__/LoginForm.test.jsx**
```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../contexts/AuthContext';
import LoginForm from '../LoginForm';

const MockWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginForm', () => {
  test('renders login form', () => {
    render(
      <MockWrapper>
        <LoginForm />
      </MockWrapper>
    );
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <MockWrapper>
        <LoginForm />
      </MockWrapper>
    );
    
    const submitButton = screen.getByText('Sign in');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });
});
```

---

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Configuration

**Production Environment Variables**
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_WEBSOCKET_URL=wss://your-api-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_APP_NAME=Learning Management System
VITE_APP_VERSION=1.0.0
```

### Deployment Options

#### 1. Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### 3. Docker Deployment
**Dockerfile**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization

1. **Code Splitting**: Use React.lazy() for route-based code splitting
2. **Image Optimization**: Implement lazy loading for images
3. **Bundle Analysis**: Use `npm run build -- --analyze`
4. **Caching**: Configure proper caching headers
5. **CDN**: Use CDN for static assets

---

## Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/user-profile
git add .
git commit -m "feat: add user profile management"
git push origin feature/user-profile

# Create pull request and merge
```

### Code Quality
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for commit message standards

### Development Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,ts,tsx,json,css,md}"
  }
}
```

This comprehensive guide covers all aspects of frontend development for the Learning Management System, from basic setup to production deployment. Each section provides practical, working code examples that integrate with your existing backend APIs.
