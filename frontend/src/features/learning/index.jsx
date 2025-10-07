import React from 'react';

const Learning = () => {
    const courses = [
        {
            id: 1,
            title: 'Complete React Development',
            instructor: 'Sarah Johnson',
            progress: 65,
            duration: '40 hours',
            level: 'Intermediate',
            thumbnail: '📱'
        },
        {
            id: 2,
            title: 'Node.js Backend Mastery',
            instructor: 'Mike Chen',
            progress: 30,
            duration: '35 hours',
            level: 'Advanced',
            thumbnail: '⚙️'
        },
        {
            id: 3,
            title: 'Python for Data Science',
            instructor: 'Emily Davis',
            progress: 80,
            duration: '50 hours',
            level: 'Beginner',
            thumbnail: '🐍'
        }
    ];

    const recentLessons = [
        { id: 1, title: 'React Hooks Deep Dive', course: 'Complete React Development', completed: true },
        { id: 2, title: 'Express.js Middleware', course: 'Node.js Backend Mastery', completed: false },
        { id: 3, title: 'Pandas Data Manipulation', course: 'Python for Data Science', completed: true },
    ];

    return (
        <div className="learning">
            <div className="learning-header">
                <h1>My Learning</h1>
                <p>Continue your learning journey</p>
            </div>

            <div className="learning-stats">
                <div className="stat-card">
                    <h3>📚 Active Courses</h3>
                    <span className="stat-value">3</span>
                </div>
                <div className="stat-card">
                    <h3>⏱️ Hours Learned</h3>
                    <span className="stat-value">127</span>
                </div>
                <div className="stat-card">
                    <h3>🏆 Certificates</h3>
                    <span className="stat-value">5</span>
                </div>
            </div>

            <div className="courses-section">
                <div className="section-header">
                    <h2>My Courses</h2>
                    <button className="browse-btn">Browse All Courses</button>
                </div>

                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-thumbnail">
                                <span className="course-icon">{course.thumbnail}</span>
                                <span className="course-level">{course.level}</span>
                            </div>

                            <div className="course-content">
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-instructor">by {course.instructor}</p>
                                <p className="course-duration">{course.duration}</p>

                                <div className="course-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{course.progress}% Complete</span>
                                </div>

                                <button className="continue-btn">Continue Learning</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Lessons</h2>
                <div className="lessons-list">
                    {recentLessons.map(lesson => (
                        <div key={lesson.id} className="lesson-item">
                            <div className="lesson-status">
                                {lesson.completed ? (
                                    <span className="status-completed">✓</span>
                                ) : (
                                    <span className="status-pending">⏳</span>
                                )}
                            </div>
                            <div className="lesson-details">
                                <h4 className="lesson-title">{lesson.title}</h4>
                                <p className="lesson-course">{lesson.course}</p>
                            </div>
                            <button className="lesson-action">
                                {lesson.completed ? 'Review' : 'Continue'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .learning {
          padding: 0;
        }
        
        .learning-header {
          margin-bottom: 2rem;
        }
        
        .learning-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .learning-header p {
          color: #6b7280;
        }
        
        .learning-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .stat-card h3 {
          font-size: 1rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #3b82f6;
        }
        
        .courses-section {
          margin-bottom: 3rem;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
        }
        
        .browse-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .browse-btn:hover {
          background: #2563eb;
        }
        
        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        
        .course-card {
          background: white;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        
        .course-thumbnail {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .course-icon {
          font-size: 3rem;
        }
        
        .course-level {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
        }
        
        .course-content {
          padding: 1.5rem;
        }
        
        .course-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .course-instructor {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .course-duration {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        
        .course-progress {
          margin-bottom: 1rem;
        }
        
        .progress-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s ease;
        }
        
        .progress-text {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .continue-btn {
          width: 100%;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .continue-btn:hover {
          background: #2563eb;
        }
        
        .recent-activity {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .recent-activity h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .lessons-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .lesson-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.375rem;
        }
        
        .lesson-status {
          flex-shrink: 0;
        }
        
        .status-completed {
          width: 24px;
          height: 24px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        
        .status-pending {
          width: 24px;
          height: 24px;
          background: #f59e0b;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
        }
        
        .lesson-details {
          flex: 1;
        }
        
        .lesson-title {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .lesson-course {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .lesson-action {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .lesson-action:hover {
          background: #2563eb;
        }
        
        @media (max-width: 768px) {
          .courses-grid {
            grid-template-columns: 1fr;
          }
          
          .learning-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default Learning;