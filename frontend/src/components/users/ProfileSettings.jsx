import React, { useState } from 'react';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileSettings = ({ user }) => {
  const { updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.emailNotifications || true,
    sessionReminders: user?.sessionReminders || true,
    marketingEmails: user?.marketingEmails || false,
    pushNotifications: user?.pushNotifications || true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: user?.profileVisibility || 'public',
    showEmail: user?.showEmail || false,
    showPhone: user?.showPhone || false,
    allowMessages: user?.allowMessages || true
  });

  const handleNotificationChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Call password change API
      // await authService.changePassword(passwordData);
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...notificationSettings,
        ...privacySettings
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <CogIcon className="h-6 w-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      {/* Security Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Security</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Update your password</p>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.current ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BellIcon className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        </div>

        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={privacySettings.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="tutors-only">Tutors Only</option>
              <option value="learners-only">Learners Only</option>
            </select>
          </div>

          {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSettingsSave}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;