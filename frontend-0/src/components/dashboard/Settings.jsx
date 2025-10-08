import React from 'react';
import { CogIcon, BellIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const Settings = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Menu */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow">
                        <nav className="space-y-1 p-4">
                            <a href="#" className="bg-primary-100 text-primary-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <CogIcon className="text-primary-500 mr-3 h-5 w-5" />
                                General
                            </a>
                            <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <BellIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                                Notifications
                            </a>
                            <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <ShieldCheckIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                                Privacy & Security
                            </a>
                            <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <CreditCardIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                                Billing
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Account Settings */}
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Account Preferences</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Email notifications</p>
                                            <p className="text-sm text-gray-600">Receive notifications about your sessions</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">SMS notifications</p>
                                            <p className="text-sm text-gray-600">Receive SMS reminders for sessions</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                            <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Auto-join sessions</p>
                                            <p className="text-sm text-gray-600">Automatically join video sessions</p>
                                        </div>
                                        <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Timezone */}
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Timezone</h4>
                                <select className="input-field max-w-xs">
                                    <option>Eastern Time (ET)</option>
                                    <option>Central Time (CT)</option>
                                    <option>Mountain Time (MT)</option>
                                    <option>Pacific Time (PT)</option>
                                </select>
                            </div>

                            {/* Language */}
                            <div>
                                <h4 className="text-md font-medium text-gray-900 mb-4">Language</h4>
                                <select className="input-field max-w-xs">
                                    <option>English</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                    <option>German</option>
                                </select>
                            </div>

                            {/* Save Button */}
                            <div className="pt-4 border-t border-gray-200">
                                <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;