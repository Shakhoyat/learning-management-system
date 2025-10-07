import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../services/authApi';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
    const [login] = useLoginMutation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Clear errors when component mounts
    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            dispatch(loginStart());
            const result = await login({
                email: formData.email,
                password: formData.password
            }).unwrap();

            dispatch(loginSuccess({
                user: result.user,
                token: result.token
            }));

            // Store refresh token if remember me is checked
            if (formData.rememberMe && result.refreshToken) {
                localStorage.setItem('refreshToken', result.refreshToken);
            }

        } catch (err) {
            const errorMessage = err.data?.error?.message || 'Login failed. Please try again.';
            dispatch(loginFailure(errorMessage));
        }
    };

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
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Sign in to your account
                    </h2>
                    <p style={{ color: '#666' }}>
                        Or{' '}
                        <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            create a new account
                        </Link>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            padding: '12px',
                            marginBottom: '20px',
                            color: '#dc2626'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: '16px' }}>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '14px'
                            }}
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
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
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    paddingRight: '40px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    fontSize: '14px'
                                }}
                                placeholder="Enter your password"
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
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                disabled={isLoading}
                                style={{ marginRight: '8px' }}
                            />
                            Remember me
                        </label>

                        <Link
                            to="/forgot-password"
                            style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}
                        >
                            Forgot password?
                        </Link>
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
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;