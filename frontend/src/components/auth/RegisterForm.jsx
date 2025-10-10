import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
    role: z.enum(['tutor', 'learner']),
    bio: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
        let score = 0;
        if (!password) return score;

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        return score;
    };

    const strength = getStrength();
    const width = (strength / 5) * 100;
    const color =
        strength <= 2
            ? 'bg-red-500'
            : strength <= 4
                ? 'bg-yellow-500'
                : 'bg-green-500';

    return (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
                className={`h-2 rounded-full transition-all duration-300 ${color}`}
                style={{ width: `${width}%` }}
            ></div>
        </div>
    );
};

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
            role: defaultRole
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
                    <div className="flex justify-center">
                        <AcademicCapIcon className="h-12 w-12 text-indigo-600" />
                    </div>
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
                            <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${selectedRole === 'learner'
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
                            <label className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-colors ${selectedRole === 'tutor'
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
                            <PasswordStrengthIndicator password={watch('password')} />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                            <PasswordStrengthIndicator password={watch('password')} />
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

                    <div className="text-center">
                        <Link
                            to="/"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to homepage
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;