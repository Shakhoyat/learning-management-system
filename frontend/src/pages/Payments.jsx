import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import { paymentService } from '../services/payments';
import { toast } from 'react-hot-toast';
import {
    CurrencyDollarIcon,
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    BanknotesIcon,
    ChartBarIcon,
    DocumentTextIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import { EarningsTrendsSection } from '../components/charts';
import { useChartData } from '../hooks/useChartData';

const Payments = () => {
    const { user } = useAuth();
    const [payments, setPayments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPayments: 0
    });
    const [filters, setFilters] = useState({
        status: '',
        dateFrom: '',
        dateTo: '',
        page: 1,
        limit: 10
    });
    const [allPayments, setAllPayments] = useState([]); // Store all payments for charts

    // Process chart data using custom hook
    const chartData = useChartData(allPayments, user?.role);

    useEffect(() => {
        fetchAllPayments(); // Fetch all payments for charts
        fetchPayments();
        fetchStats();
    }, [filters]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await paymentService.getAllPayments(filters);

            if (data.success) {
                setPayments(data.data.payments);
                setPagination(data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllPayments = async () => {
        try {
            // Fetch all payments without pagination for chart data
            const data = await paymentService.getAllPayments({ limit: 1000 });
            if (data.success) {
                setAllPayments(data.data.payments);
            }
        } catch (error) {
            console.error('Error fetching all payments:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const stats = await paymentService.getPaymentStats();
            setStats(stats);
        } catch (error) {
            console.error('Error fetching payment stats:', error);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                icon: CheckCircleIcon,
                bgColor: 'bg-green-100',
                textColor: 'text-green-800',
                label: 'Completed'
            },
            pending: {
                icon: ClockIcon,
                bgColor: 'bg-yellow-100',
                textColor: 'text-yellow-800',
                label: 'Pending'
            },
            failed: {
                icon: XCircleIcon,
                bgColor: 'bg-red-100',
                textColor: 'text-red-800',
                label: 'Failed'
            },
            refunded: {
                icon: ArrowTrendingUpIcon,
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                label: 'Refunded'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                <Icon className="w-4 h-4 mr-1" />
                {config.label}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: key !== 'page' ? 1 : value // Reset to page 1 when changing filters
        }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            dateFrom: '',
            dateTo: '',
            page: 1,
            limit: 10
        });
    };

    const isTutor = user?.role === 'tutor';

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="px-4 sm:px-0 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <CurrencyDollarIcon className="w-8 h-8 mr-3 text-indigo-600" />
                        {isTutor ? 'Earnings & Payments' : 'Payment History'}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        {isTutor
                            ? 'Track your earnings and view payment history from your tutoring sessions.'
                            : 'View your payment history for all sessions.'}
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="px-4 sm:px-0 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {isTutor ? (
                                <>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Earned</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {formatCurrency(stats.userStats?.totalReceived || 0)}
                                                </p>
                                            </div>
                                            <BanknotesIcon className="w-12 h-12 text-green-600" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {stats.userStats?.transactionCount || 0}
                                                </p>
                                            </div>
                                            <ChartBarIcon className="w-12 h-12 text-blue-600" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Average per Session</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {formatCurrency(
                                                        stats.userStats?.transactionCount
                                                            ? stats.userStats.totalReceived / stats.userStats.transactionCount
                                                            : 0
                                                    )}
                                                </p>
                                            </div>
                                            <ArrowTrendingUpIcon className="w-12 h-12 text-purple-600" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">This Month</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {formatCurrency(stats.userStats?.thisMonth || 0)}
                                                </p>
                                            </div>
                                            <CalendarIcon className="w-12 h-12 text-indigo-600" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {formatCurrency(stats.userStats?.totalPaid || 0)}
                                                </p>
                                            </div>
                                            <BanknotesIcon className="w-12 h-12 text-red-600" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {stats.userStats?.transactionCount || 0}
                                                </p>
                                            </div>
                                            <ChartBarIcon className="w-12 h-12 text-blue-600" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Charts Section - Only for tutors */}
                {isTutor && <EarningsTrendsSection chartData={chartData} />}

                {/* Filters */}
                <div className="px-4 sm:px-0 mb-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <FunnelIcon className="w-5 h-5 mr-2" />
                                Filters
                            </h3>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payments List */}
                <div className="px-4 sm:px-0">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <DocumentTextIcon className="w-5 h-5 mr-2" />
                                Transaction History
                            </h3>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : payments.length === 0 ? (
                            <div className="text-center py-12">
                                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {isTutor
                                        ? "You haven't received any payments yet."
                                        : "You haven't made any payments yet."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Session
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {isTutor ? 'Student' : 'Tutor'}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                {isTutor && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Net Amount
                                                    </th>
                                                )}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Transaction ID
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.map((payment) => (
                                                <tr key={payment._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(payment.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        <div className="max-w-xs truncate">
                                                            {payment.session?.title || 'N/A'}
                                                        </div>
                                                        {payment.session?.scheduledDate && (
                                                            <div className="text-xs text-gray-500">
                                                                {formatDate(payment.session.scheduledDate)}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {isTutor
                                                            ? payment.payer?.name || 'Unknown'
                                                            : payment.recipient?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {formatCurrency(payment.amount, payment.currency)}
                                                    </td>
                                                    {isTutor && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                                            {formatCurrency(payment.fees?.netAmount || payment.amount, payment.currency)}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(payment.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                        {payment.transactionId || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            <button
                                                onClick={() => handleFilterChange('page', filters.page - 1)}
                                                disabled={!pagination.hasPrev}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => handleFilterChange('page', filters.page + 1)}
                                                disabled={!pagination.hasNext}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                                                    <span className="font-medium">{pagination.totalPages}</span>
                                                    {' '}({pagination.totalPayments} total payments)
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    <button
                                                        onClick={() => handleFilterChange('page', filters.page - 1)}
                                                        disabled={!pagination.hasPrev}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={() => handleFilterChange('page', filters.page + 1)}
                                                        disabled={!pagination.hasNext}
                                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
