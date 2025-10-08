import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
            // For demo purposes, we'll simulate a logged-in user
            const demoUser = {
                id: '1',
                name: 'Demo User',
                email: 'demo@example.com',
                role: 'learner',
                avatar: null
            };
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user: demoUser, token } });
        }
    }, []);

    const login = async (credentials) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = {
                user: {
                    id: '1',
                    name: 'Demo User',
                    email: credentials.email,
                    role: credentials.role || 'learner',
                    avatar: null
                },
                token: 'demo_token_' + Date.now()
            };

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
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('token');
            dispatch({ type: 'LOGOUT' });
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = {
                user: {
                    id: '1',
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    avatar: null
                },
                token: 'demo_token_' + Date.now()
            };

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
            dispatch({ type: 'UPDATE_USER', payload: updates });
            return { ...state.user, ...updates };
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