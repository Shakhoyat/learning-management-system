# Frontend Implementation Components Guide

## 🎯 React Component Examples for LMS

This guide provides production-ready React components aligned with the API documentation.

---

## 🔐 Authentication Components

### LoginForm Component
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.details) {
          const fieldErrors = {};
          data.error.details.forEach(({ field, message }) => {
            fieldErrors[field] = message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error?.message || 'Login failed' });
        }
        return;
      }

      localStorage.setItem('token', data.token);
      dispatch(login({ user: data.user, token: data.token }));
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 text-center">Sign In</h2>
      
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        error={errors.password}
        required
      />

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        variant="primary"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
```

---

## 📊 Dashboard Components

### DashboardStats Component
```jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/users/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [api]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Earnings"
        value={`$${stats?.totalEarnings?.toLocaleString() || '0'}`}
        icon="💰"
        trend={{ value: 12.5, direction: 'up' }}
        color="green"
      />
      
      <StatCard
        title="Upcoming Sessions"
        value={stats?.upcomingSessions || 0}
        icon="📅"
        color="blue"
      />
      
      <StatCard
        title="Skills Teaching"
        value={stats?.skillsTeaching || 0}
        icon="🎓"
        color="purple"
      />
      
      <StatCard
        title="Students"
        value={stats?.studentsCount || 0}
        icon="👥"
        trend={{ value: 8.2, direction: 'up' }}
        color="indigo"
      />
    </div>
  );
};

export default DashboardStats;
```

---

## 🎓 Skills Management Components

### SkillsList Component
```jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import SkillCard from './SkillCard';
import SkillFilters from './SkillFilters';
import Pagination from '../components/common/Pagination';
import LoadingGrid from '../components/common/LoadingGrid';

const SkillsList = () => {
  const [skills, setSkills] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
    sortBy: 'popularity'
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const api = useApi();

  const fetchSkills = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const response = await api.get('/api/skills', { params });
      
      setSkills(response.data.skills);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Skills Catalog</h1>
        <div className="text-sm text-gray-600">
          {pagination.totalItems} skills available
        </div>
      </div>

      <SkillFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {loading ? (
        <LoadingGrid itemCount={12} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No skills found</div>
              <button
                onClick={() => setFilters({ category: '', difficulty: '', search: '', sortBy: 'popularity' })}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={fetchSkills}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SkillsList;
```

### SkillCard Component
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import StarRating from '../components/common/StarRating';

const SkillCard = ({ skill }) => {
  const difficultyColor = {
    1: 'green', 2: 'green', 3: 'green',
    4: 'yellow', 5: 'yellow', 6: 'yellow',
    7: 'orange', 8: 'orange',
    9: 'red', 10: 'red'
  };

  const difficultyLabel = {
    1: 'Beginner', 2: 'Beginner', 3: 'Beginner',
    4: 'Intermediate', 5: 'Intermediate', 6: 'Intermediate',
    7: 'Advanced', 8: 'Advanced',
    9: 'Expert', 10: 'Expert'
  };

  return (
    <Link to={`/skills/${skill._id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
          <Badge
            color={difficultyColor[skill.difficulty]}
            size="sm"
          >
            {difficultyLabel[skill.difficulty]}
          </Badge>
          <div className="text-xs text-gray-500">
            {skill.category}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {skill.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {skill.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <StarRating rating={skill.stats.avgRating} size="sm" />
            <span className="text-xs text-gray-500">
              {skill.stats.avgRating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{skill.stats.totalTeachers} teachers</span>
            <span>{skill.stats.totalLearners} learners</span>
          </div>

          {skill.metadata?.estimatedLearningTime && (
            <div className="text-xs text-gray-500">
              Est. {skill.metadata.estimatedLearningTime} hours
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SkillCard;
```

---

## 📅 Session Management Components

### SessionCard Component
```jsx
import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';

const SessionCard = ({ session, onJoin, onCancel, onReschedule }) => {
  const statusColors = {
    scheduled: 'blue',
    ongoing: 'green',
    completed: 'gray',
    cancelled: 'red'
  };

  const canJoin = session.status === 'scheduled' && 
    new Date(session.schedule.startTime) <= new Date(Date.now() + 15 * 60 * 1000); // 15 min before

  const isUpcoming = session.status === 'scheduled' && 
    new Date(session.schedule.startTime) > new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Avatar
            src={session.participants.teacher.avatar}
            name={`${session.participants.teacher.firstName} ${session.participants.teacher.lastName}`}
            size="md"
          />
          <div>
            <h3 className="font-semibold text-gray-900">
              {session.skill.name}
            </h3>
            <p className="text-sm text-gray-600">
              with {session.participants.teacher.firstName} {session.participants.teacher.lastName}
            </p>
          </div>
        </div>
        <Badge color={statusColors[session.status]}>
          {session.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Date:</span>
          <div className="font-medium">
            {format(new Date(session.schedule.startTime), 'MMM dd, yyyy')}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Time:</span>
          <div className="font-medium">
            {format(new Date(session.schedule.startTime), 'hh:mm a')} - 
            {format(new Date(session.schedule.endTime), 'hh:mm a')}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Duration:</span>
          <div className="font-medium">
            {Math.round((new Date(session.schedule.endTime) - new Date(session.schedule.startTime)) / (1000 * 60))} min
          </div>
        </div>
        <div>
          <span className="text-gray-500">Price:</span>
          <div className="font-medium">
            ${session.pricing.amount}
          </div>
        </div>
      </div>

      {session.status === 'scheduled' && (
        <div className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(session.schedule.startTime), { addSuffix: true })}
        </div>
      )}

      <div className="flex space-x-2">
        {canJoin && (
          <Button
            onClick={() => onJoin(session._id)}
            variant="primary"
            size="sm"
          >
            Join Session
          </Button>
        )}

        {isUpcoming && (
          <>
            <Button
              onClick={() => onReschedule(session._id)}
              variant="outline"
              size="sm"
            >
              Reschedule
            </Button>
            <Button
              onClick={() => onCancel(session._id)}
              variant="danger"
              size="sm"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
```

---

## 💳 Payment Components

### PaymentForm Component
```jsx
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const stripePromise = loadStripe('pk_test_your_stripe_public_key');

const PaymentFormInner = ({ sessionId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      country: 'US',
      postal_code: ''
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const intentResponse = await fetch('/api/payments/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          sessionId,
          amount,
          currency: 'USD'
        })
      });

      const { paymentIntentId, clientSecret } = await intentResponse.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails
        }
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm with backend
        await fetch(`/api/payments/${paymentIntentId}/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            paymentMethodId: paymentIntent.payment_method,
            billingDetails
          })
        });

        onSuccess(paymentIntent);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount:</span>
          <span className="text-lg font-semibold">${amount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={billingDetails.name}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            name: e.target.value
          })}
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={billingDetails.email}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            email: e.target.value
          })}
          required
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Address"
          value={billingDetails.address.line1}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            address: { ...billingDetails.address, line1: e.target.value }
          })}
          required
        />
        
        <Input
          label="City"
          value={billingDetails.address.city}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            address: { ...billingDetails.address, city: e.target.value }
          })}
          required
        />
        
        <Input
          label="Postal Code"
          value={billingDetails.address.postal_code}
          onChange={(e) => setBillingDetails({
            ...billingDetails,
            address: { ...billingDetails.address, postal_code: e.target.value }
          })}
          required
        />
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={!stripe || loading}
        className="w-full"
        variant="primary"
      >
        Pay ${amount}
      </Button>
    </form>
  );
};

const PaymentForm = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentFormInner {...props} />
  </Elements>
);

export default PaymentForm;
```

---

## 🔔 Notification Components

### NotificationCenter Component
```jsx
import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import NotificationItem from './NotificationItem';
import Button from '../components/common/Button';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [notificationsRes, countRes] = await Promise.all([
        api.get('/api/notifications?limit=20'),
        api.get('/api/notifications/unread-count')
      ]);
      
      setNotifications(notificationsRes.data.notifications);
      setUnreadCount(countRes.data.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      
      setNotifications(notifications.map(notif => 
        notif._id === notificationId 
          ? { ...notif, delivery: { ...notif.delivery, inApp: { ...notif.delivery.inApp, read: true } } }
          : notif
      ));
      
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all');
      
      setNotifications(notifications.map(notif => ({
        ...notif,
        delivery: { ...notif.delivery, inApp: { ...notif.delivery.inApp, read: true } }
      })));
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
              >
                Mark all read
              </Button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <div className="text-sm text-blue-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={() => markAsRead(notification._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
```

---

## 🎨 Common UI Components

### Button Component
```jsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
```

### Input Component
```jsx
import React from 'react';

const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <input
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${error 
            ? 'border-red-300 text-red-900 placeholder-red-300' 
            : 'border-gray-300'
          }
        `}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
```

This comprehensive component guide provides production-ready React components that seamlessly integrate with your updated API endpoints, ensuring smooth frontend implementation with professional UI/UX patterns.