import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useRegisterMutation } from '../../services/authApi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(state => state.auth);
    const [register, { isLoading }] = useRegisterMutation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Password confirmation is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Terms validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await register({
                name: formData.name.trim(),
                email: formData.email.toLowerCase(),
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                timezone: formData.timezone
            }).unwrap();

            setIsSuccess(true);

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please log in with your credentials.'
                    }
                });
            }, 3000);

        } catch (err) {
            const apiErrors = {};
            if (err.data?.error?.details) {
                // Handle validation errors from API
                err.data.error.details.forEach(detail => {
                    apiErrors[detail.field] = detail.message;
                });
            } else {
                // Handle general errors
                apiErrors.general = err.data?.error?.message || 'Registration failed. Please try again.';
            }
            setErrors(apiErrors);
        }
    };

    if (isSuccess) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                padding: '20px'
            }}>
                <div style={{
                    maxWidth: '400px',
                    width: '100%',
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto'
                    }}>
                        <span style={{ fontSize: '32px', color: '#16a34a' }}>✓</span>
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>
                        Registration Successful!
                    </h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        Your account has been created successfully. You will be redirected to the login page shortly.
                    </p>
                    <Link
                        to="/login"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        Go to Login Page
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Create your account
                    </h2>
                    <p style={{ color: '#666' }}>
                        Or{' '}
                        <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {errors.general && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            padding: '12px',
                            marginBottom: '20px',
                            color: '#dc2626'
                        }}>
                            {errors.general}
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="name" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.name ? '1px solid #f87171' : '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.name && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.email ? '1px solid #f87171' : '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    paddingRight: '40px',
                                    border: errors.password ? '1px solid #f87171' : '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
                        <p style={{ color: '#666', fontSize: '11px', marginTop: '4px' }}>
                            Must contain at least 8 characters with uppercase, lowercase, number, and special character
                        </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    paddingRight: '40px',
                                    border: errors.confirmPassword ? '1px solid #f87171' : '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="timezone" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                            Timezone
                        </label>
                        <select
                            id="timezone"
                            name="timezone"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px',
                                backgroundColor: 'white'
                            }}
                            value={formData.timezone}
                            onChange={handleChange}
                            disabled={isLoading}
                        >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Asia/Shanghai">Shanghai</option>
                            <option value="Asia/Kolkata">India</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px' }}>
                            <input
                                id="agreeToTerms"
                                name="agreeToTerms"
                                type="checkbox"
                                style={{ marginRight: '8px', marginTop: '2px' }}
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <span>
                                I agree to the{' '}
                                <Link to="/terms" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                    Terms and Conditions
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        {errors.agreeToTerms && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{errors.agreeToTerms}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;