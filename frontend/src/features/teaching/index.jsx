import React from 'react';

const Teaching = () => {
    return (
        <div className="teaching">
            <div className="teaching-header">
                <h1>Teaching Dashboard</h1>
                <p>Manage your courses and track student progress</p>
            </div>

            <div className="teaching-stats">
                <div className="stat-card">
                    <h3>👥 Students</h3>
                    <span className="stat-value">234</span>
                </div>
                <div className="stat-card">
                    <h3>📚 Courses</h3>
                    <span className="stat-value">8</span>
                </div>
                <div className="stat-card">
                    <h3>⭐ Rating</h3>
                    <span className="stat-value">4.8</span>
                </div>
                <div className="stat-card">
                    <h3>💰 Earnings</h3>
                    <span className="stat-value">$2,340</span>
                </div>
            </div>

            <div className="content-grid">
                <div className="my-courses">
                    <div className="section-header">
                        <h2>My Courses</h2>
                        <button className="create-btn">Create New Course</button>
                    </div>

                    <div className="course-list">
                        <div className="course-item">
                            <div className="course-info">
                                <h3>Complete React Development</h3>
                                <p>45 students • 4.9 ⭐ • $299</p>
                            </div>
                            <div className="course-status">
                                <span className="status published">Published</span>
                                <button className="edit-btn">Edit</button>
                            </div>
                        </div>

                        <div className="course-item">
                            <div className="course-info">
                                <h3>Node.js Backend Mastery</h3>
                                <p>32 students • 4.8 ⭐ • $199</p>
                            </div>
                            <div className="course-status">
                                <span className="status published">Published</span>
                                <button className="edit-btn">Edit</button>
                            </div>
                        </div>

                        <div className="course-item">
                            <div className="course-info">
                                <h3>Advanced JavaScript Concepts</h3>
                                <p>0 students • No rating • $149</p>
                            </div>
                            <div className="course-status">
                                <span className="status draft">Draft</span>
                                <button className="edit-btn">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">💬</div>
                            <div className="activity-content">
                                <p><strong>Sarah M.</strong> asked a question in React course</p>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">⭐</div>
                            <div className="activity-content">
                                <p><strong>John D.</strong> left a 5-star review</p>
                                <span className="activity-time">5 hours ago</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">🎓</div>
                            <div className="activity-content">
                                <p><strong>Emma W.</strong> completed Node.js course</p>
                                <span className="activity-time">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .teaching {
          padding: 0;
        }
        
        .teaching-header {
          margin-bottom: 2rem;
        }
        
        .teaching-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .teaching-header p {
          color: #6b7280;
        }
        
        .teaching-stats {
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
        
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        
        .my-courses,
        .recent-activity {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .section-header h2,
        .recent-activity h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }
        
        .create-btn {
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .create-btn:hover {
          background: #059669;
        }
        
        .course-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .course-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
        }
        
        .course-info h3 {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .course-info p {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .course-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .status.published {
          background: #dcfce7;
          color: #166534;
        }
        
        .status.draft {
          background: #fef3c7;
          color: #92400e;
        }
        
        .edit-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .edit-btn:hover {
          background: #2563eb;
        }
        
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.375rem;
        }
        
        .activity-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-content p {
          margin-bottom: 0.25rem;
          color: #374151;
        }
        
        .activity-time {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .teaching-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .course-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .course-status {
            justify-content: space-between;
          }
        }
      `}</style>
        </div>
    );
};

export default Teaching;