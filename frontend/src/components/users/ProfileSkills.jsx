import React from 'react';

const ProfileSkills = ({ user, stats }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Skills Management</h2>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          Skills management component is under development. This will allow you to:
        </p>
        <ul className="mt-2 text-yellow-700 list-disc list-inside space-y-1">
          <li>Add and remove teaching skills</li>
          <li>Add and remove learning skills</li>
          <li>Set skill levels and experience</li>
          <li>Manage skill categories</li>
        </ul>
      </div>

      {user?.role === 'tutor' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Teaching Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Placeholder for teaching skills */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-500">No teaching skills added yet</p>
              <button className="mt-2 text-indigo-600 hover:text-indigo-800">
                Add Teaching Skill
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Learning Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Placeholder for learning skills */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">No learning skills added yet</p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-800">
              Add Learning Skill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkills;