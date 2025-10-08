import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProfileInfo = ({ user, onProfileUpdate }) => {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = await updateProfile(formData);
      setIsEditing(false);
      onProfileUpdate?.(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      timezone: user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                <option value="Europe/Paris">Central European Time (CET)</option>
                <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                <option value="Asia/Shanghai">China Standard Time (CST)</option>
                <option value="Australia/Sydney">Australian Eastern Time (AET)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{user?.name || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user?.email || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <label className="block text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{user?.location || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {user?.bio && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Bio</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{user.bio}</p>
            </div>
          )}

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-900 mb-2">Account Details</h3>
            <div className="space-y-1 text-sm text-indigo-700">
              <p>Role: <span className="font-medium capitalize">{user?.role}</span></p>
              <p>Member since: <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span></p>
              <p>Timezone: <span className="font-medium">{user?.timezone || 'Not set'}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;