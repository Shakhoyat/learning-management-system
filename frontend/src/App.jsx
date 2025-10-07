import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import ErrorBoundary from './shared/components/ErrorBoundary';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Import components directly instead of lazy loading
import Dashboard from './features/dashboard';
import SkillMap from './features/skillMap';
import Learning from './features/learning';
import Teaching from './features/teaching';
import Collaboration from './features/collaboration';
import Analytics from './features/analytics';

function App() {
    return (
        <ErrorBoundary>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/skill-map/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <SkillMap />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/learning/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Learning />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/teaching/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Teaching />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/collaboration/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Collaboration />
                        </Layout>
                    </ProtectedRoute>
                } />
                <Route path="/analytics/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Analytics />
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </ErrorBoundary>
    );
}

export default App;