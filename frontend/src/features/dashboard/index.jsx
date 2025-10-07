import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const Dashboard = () => {
    const user = useSelector(selectUser);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back{user ? `, ${user.name}` : ''}!</h1>
                <p className="dashboard-subtitle">Here's what's happening in your learning journey</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>📚 Active Courses</h3>
                    <div className="metric">
                        <span className="metric-value">5</span>
                        <span className="metric-label">In Progress</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>🎯 Completed</h3>
                    <div className="metric">
                        <span className="metric-value">12</span>
                        <span className="metric-label">This Month</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>⏰ Study Time</h3>
                    <div className="metric">
                        <span className="metric-value">24h</span>
                        <span className="metric-label">This Week</span>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>🏆 Achievements</h3>
                    <div className="metric">
                        <span className="metric-value">8</span>
                        <span className="metric-label">Unlocked</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <span className="activity-icon">📖</span>
                            <div className="activity-details">
                                <p className="activity-title">Completed lesson: React Hooks</p>
                                <p className="activity-time">2 hours ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-icon">🎯</span>
                            <div className="activity-details">
                                <p className="activity-title">Achievement unlocked: Fast Learner</p>
                                <p className="activity-time">1 day ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-icon">👥</span>
                            <div className="activity-details">
                                <p className="activity-title">Joined collaboration session</p>
                                <p className="activity-time">2 days ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="upcoming-sessions">
                    <h2>Upcoming Sessions</h2>
                    <div className="session-list">
                        <div className="session-item">
                            <div className="session-time">
                                <span className="session-date">Today</span>
                                <span className="session-hour">3:00 PM</span>
                            </div>
                            <div className="session-details">
                                <p className="session-title">JavaScript Advanced Concepts</p>
                                <p className="session-instructor">with Sarah Johnson</p>
                            </div>
                        </div>
                        <div className="session-item">
                            <div className="session-time">
                                <span className="session-date">Tomorrow</span>
                                <span className="session-hour">10:00 AM</span>
                            </div>
                            <div className="session-details">
                                <p className="session-title">React State Management</p>
                                <p className="session-instructor">with Mike Chen</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .dashboard {
          padding: 0;
        }
        
        .dashboard-header {
          margin-bottom: 2rem;
        }
        
        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .dashboard-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .dashboard-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .dashboard-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .metric {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #3b82f6;
        }
        
        .metric-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .recent-activity,
        .upcoming-sessions {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .recent-activity h2,
        .upcoming-sessions h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }
        
        .activity-list,
        .session-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .activity-item,
        .session-item {
          display: flex;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 0.375rem;
          background: #f9fafb;
        }
        
        .activity-icon {
          font-size: 1.5rem;
        }
        
        .activity-details {
          flex: 1;
        }
        
        .activity-title,
        .session-title {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .activity-time,
        .session-instructor {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .session-time {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }
        
        .session-date {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 500;
        }
        
        .session-hour {
          font-weight: 600;
          color: #3b82f6;
        }
        
        @media (max-width: 768px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
          
          .dashboard-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;