import React, { useState, useEffect } from 'react';
import { skillService } from '../../services/skills';
import { PlusIcon, XMarkIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const ProfileSkills = ({ user, teachingSkills = [], learningSkills = [], onSkillsUpdate }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [showAddTeachingModal, setShowAddTeachingModal] = useState(false);
  const [showAddLearningModal, setShowAddLearningModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for adding skills
  const [teachingFormData, setTeachingFormData] = useState({
    skillId: '',
    level: 'intermediate',
    hourlyRate: '',
    availability: 'flexible'
  });

  const [learningFormData, setLearningFormData] = useState({
    skillId: '',
    currentLevel: 'beginner',
    targetLevel: 'advanced',
    preferredLearningStyle: 'interactive'
  });

  useEffect(() => {
    fetchAllSkills();
  }, []);

  const fetchAllSkills = async () => {
    try {
      const response = await skillService.getAllSkills({ limit: 100 });
      setAllSkills(response.skills || []);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
      setError('Failed to load skills. Please try again.');
    }
  };

  const handleAddTeachingSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = user?._id || user?.id;
      const updatedUser = await skillService.addTeachingSkill(userId, {
        skillId: teachingFormData.skillId,
        level: teachingFormData.level,
        hourlyRate: parseFloat(teachingFormData.hourlyRate),
        availability: teachingFormData.availability
      });

      onSkillsUpdate(updatedUser);
      setShowAddTeachingModal(false);
      setTeachingFormData({
        skillId: '',
        level: 'intermediate',
        hourlyRate: '',
        availability: 'flexible'
      });
    } catch (error) {
      console.error('Failed to add teaching skill:', error);
      setError(error.response?.data?.error || 'Failed to add teaching skill');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeachingSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this teaching skill?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = user?._id || user?.id;
      const updatedUser = await skillService.removeTeachingSkill(userId, skillId);
      onSkillsUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to remove teaching skill:', error);
      setError('Failed to remove teaching skill');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLearningSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = user?._id || user?.id;
      const updatedUser = await skillService.addLearningSkill(userId, {
        skillId: learningFormData.skillId,
        currentLevel: learningFormData.currentLevel,
        targetLevel: learningFormData.targetLevel,
        preferredLearningStyle: learningFormData.preferredLearningStyle
      });

      onSkillsUpdate(updatedUser);
      setShowAddLearningModal(false);
      setLearningFormData({
        skillId: '',
        currentLevel: 'beginner',
        targetLevel: 'advanced',
        preferredLearningStyle: 'interactive'
      });
    } catch (error) {
      console.error('Failed to add learning skill:', error);
      setError(error.response?.data?.error || 'Failed to add learning skill');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLearningSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to remove this learning skill?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = user?._id || user?.id;
      const updatedUser = await skillService.removeLearningSkill(userId, skillId);
      onSkillsUpdate(updatedUser);
    } catch (error) {
      console.error('Failed to remove learning skill:', error);
      setError('Failed to remove learning skill');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = allSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Skills Management</h2>
        <p className="text-gray-600">
          {user?.role === 'tutor' ? 'Manage your teaching skills' : 'Manage your teaching and learning skills'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Teaching Skills Section */}
      {(user?.role === 'tutor' || user?.role === 'admin') && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">Teaching Skills</h3>
            </div>
            <button
              onClick={() => setShowAddTeachingModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Teaching Skill
            </button>
          </div>

          {teachingSkills.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No teaching skills added yet</p>
              <button
                onClick={() => setShowAddTeachingModal(true)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Add your first teaching skill
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachingSkills.map((skill) => (
                <div
                  key={skill._id || skill.skillId?._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {skill.skillId?.name || 'Unknown Skill'}
                      </h4>
                      <p className="text-sm text-gray-500">{skill.skillId?.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveTeachingSkill(skill.skillId?._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium capitalize">{skill.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-medium">${skill.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability:</span>
                      <span className="font-medium capitalize">{skill.availability}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Learning Skills Section - Only show for learners and admins */}
      {user?.role !== 'tutor' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Learning Skills</h3>
            </div>
            <button
              onClick={() => setShowAddLearningModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Learning Skill
            </button>
          </div>

          {learningSkills.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No learning skills added yet</p>
              <button
                onClick={() => setShowAddLearningModal(true)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Add your first learning skill
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningSkills.map((skill) => (
                <div
                  key={skill._id || skill.skillId?._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {skill.skillId?.name || 'Unknown Skill'}
                      </h4>
                      <p className="text-sm text-gray-500">{skill.skillId?.category}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveLearningSkill(skill.skillId?._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Level:</span>
                      <span className="font-medium capitalize">{skill.currentLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Level:</span>
                      <span className="font-medium capitalize">{skill.targetLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Learning Style:</span>
                      <span className="font-medium capitalize">{skill.preferredLearningStyle}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Teaching Skill Modal */}
      {showAddTeachingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add Teaching Skill</h3>
            <form onSubmit={handleAddTeachingSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Skill
                </label>
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Skill *
                </label>
                <select
                  value={teachingFormData.skillId}
                  onChange={(e) => setTeachingFormData({ ...teachingFormData, skillId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a skill</option>
                  {filteredSkills.map((skill) => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level *
                </label>
                <select
                  value={teachingFormData.level}
                  onChange={(e) => setTeachingFormData({ ...teachingFormData, level: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={teachingFormData.hourlyRate}
                  onChange={(e) => setTeachingFormData({ ...teachingFormData, hourlyRate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="25.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability *
                </label>
                <select
                  value={teachingFormData.availability}
                  onChange={(e) => setTeachingFormData({ ...teachingFormData, availability: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="flexible">Flexible</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="limited">Limited</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Skill'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTeachingModal(false);
                    setSearchQuery('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Learning Skill Modal */}
      {showAddLearningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Add Learning Skill</h3>
            <form onSubmit={handleAddLearningSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Skill
                </label>
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Skill *
                </label>
                <select
                  value={learningFormData.skillId}
                  onChange={(e) => setLearningFormData({ ...learningFormData, skillId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a skill</option>
                  {filteredSkills.map((skill) => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name} ({skill.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Level *
                </label>
                <select
                  value={learningFormData.currentLevel}
                  onChange={(e) => setLearningFormData({ ...learningFormData, currentLevel: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Level *
                </label>
                <select
                  value={learningFormData.targetLevel}
                  onChange={(e) => setLearningFormData({ ...learningFormData, targetLevel: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Learning Style *
                </label>
                <select
                  value={learningFormData.preferredLearningStyle}
                  onChange={(e) => setLearningFormData({ ...learningFormData, preferredLearningStyle: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="interactive">Interactive</option>
                  <option value="visual">Visual</option>
                  <option value="reading">Reading</option>
                  <option value="hands-on">Hands-on</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Adding...' : 'Add Skill'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddLearningModal(false);
                    setSearchQuery('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSkills;