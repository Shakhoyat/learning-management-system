import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: { ...state.user, ...action.payload },
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check for existing auth token on app load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await authAPI.getCurrentUser();
                    dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
                } catch (error) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
                }
            } else {
                dispatch({ type: 'AUTH_FAILURE', payload: null });
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const response = await authAPI.login(credentials);
            const { user, token } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            dispatch({ type: 'AUTH_FAILURE', payload: message });
            return { success: false, error: message };
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const response = await authAPI.register(userData);
            const { user, token } = response.data;

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({ type: 'AUTH_SUCCESS', payload: user });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            dispatch({ type: 'AUTH_FAILURE', payload: message });
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            // Logout anyway even if API call fails
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            dispatch({ type: 'LOGOUT' });
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            dispatch({ type: 'UPDATE_USER', payload: response.data.user });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            return { success: false, error: message };
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
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