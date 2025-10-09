import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Tab } from '@headlessui/react';
import { userService } from '../services/users';
import { skillService } from '../services/skills';
import Header from '../components/common/Header';
import ProfileInfo from '../components/users/ProfileInfo';
import ProfileSkills from '../components/users/ProfileSkills';
import ProfileStats from '../components/users/ProfileStats';
import ProfileSettings from '../components/users/ProfileSettings';

const Profile = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileData, setProfileData] = useState({
    stats: null,
    teachingSkills: [],
    learningSkills: [],
    loading: true
  });

  const activeTab = searchParams.get('tab') || 'profile';

  const tabs = [
    { id: 'profile', name: 'Profile Info', component: ProfileInfo },
    { id: 'skills', name: 'Skills', component: ProfileSkills },
    { id: 'stats', name: 'Statistics', component: ProfileStats },
    { id: 'settings', name: 'Settings', component: ProfileSettings }
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = user?._id || user?.id;
        if (!userId) {
          setProfileData(prev => ({ ...prev, loading: false }));
          return;
        }

        const [stats, skills] = await Promise.all([
          userService.getUserStats(userId),
          skillService.getUserSkills(userId)
        ]);

        setProfileData({
          stats,
          teachingSkills: skills.teachingSkills || [],
          learningSkills: skills.learningSkills || [],
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        setProfileData(prev => ({ ...prev, loading: false }));
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const handleSkillsUpdate = async (updatedUser) => {
    if (updatedUser?.teachingSkills || updatedUser?.learningSkills) {
      setProfileData(prev => ({
        ...prev,
        teachingSkills: updatedUser.teachingSkills || prev.teachingSkills,
        learningSkills: updatedUser.learningSkills || prev.learningSkills
      }));
    }
  };

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const ActiveComponent = tabs[activeTabIndex]?.component || ProfileInfo;

  if (profileData.loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Profile Management
          </h1>

          <Tab.Group selectedIndex={activeTabIndex} onChange={(index) => handleTabChange(tabs[index].id)}>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                    }`
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className="rounded-xl bg-white p-6 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  <ActiveComponent
                    user={user}
                    stats={profileData.stats}
                    teachingSkills={profileData.teachingSkills}
                    learningSkills={profileData.learningSkills}
                    onSkillsUpdate={handleSkillsUpdate}
                    onProfileUpdate={(updatedUser) => {
                      // Handle profile updates if needed
                      console.log('Profile updated:', updatedUser);
                    }}
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default Profile;