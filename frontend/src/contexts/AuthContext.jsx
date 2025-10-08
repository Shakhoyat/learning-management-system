import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
        case 'REGISTER_START':
            return { ...state, loading: true, error: null };
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                tokens: action.payload.tokens,
                isAuthenticated: true,
                error: null
            };
        case 'LOGIN_FAILURE':
        case 'REGISTER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                isAuthenticated: false,
                user: null,
                tokens: null
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                tokens: null,
                isAuthenticated: false,
                error: null,
                loading: false
            };
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

const initialState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
                try {
                    const user = await authService.getCurrentUser();
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user,
                            tokens: { accessToken, refreshToken }
                        }
                    });
                } catch (error) {
                    // Try to refresh token
                    try {
                        const response = await authService.refreshToken();
                        localStorage.setItem('accessToken', response.data.accessToken);
                        const user = await authService.getCurrentUser();
                        dispatch({
                            type: 'LOGIN_SUCCESS',
                            payload: {
                                user,
                                tokens: {
                                    accessToken: response.data.accessToken,
                                    refreshToken
                                }
                            }
                        });
                    } catch (refreshError) {
                        // Refresh failed, clear tokens
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        dispatch({ type: 'LOGOUT' });
                    }
                }
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await authService.login(credentials);

            if (response.success) {
                const { user, tokens } = response.data;

                // Store tokens
                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                dispatch({ type: 'LOGIN_SUCCESS', payload: { user, tokens } });
                return response;
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Login failed';
            dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
            throw new Error(errorMessage);
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'REGISTER_START' });
        try {
            const response = await authService.register(userData);

            if (response.success) {
                const { user, tokens } = response.data;

                // Store tokens
                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                dispatch({ type: 'REGISTER_SUCCESS', payload: { user, tokens } });
                return response;
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
            dispatch({ type: 'REGISTER_FAILURE', payload: errorMessage });
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authService.logout({ refreshToken });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch({ type: 'LOGOUT' });
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

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        logout,
        register,
        updateProfile,
        clearError
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