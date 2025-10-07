import React from 'react';

const Analytics = () => {
    const stats = [
        { label: 'Total Study Time', value: '127h 45m', change: '+12%' },
        { label: 'Courses Completed', value: '18', change: '+3' },
        { label: 'Average Score', value: '87%', change: '+5%' },
        { label: 'Learning Streak', value: '23 days', change: 'New Record!' }
    ];

    const weeklyData = [
        { day: 'Mon', hours: 3.5 },
        { day: 'Tue', hours: 2.8 },
        { day: 'Wed', hours: 4.2 },
        { day: 'Thu', hours: 3.1 },
        { day: 'Fri', hours: 2.9 },
        { day: 'Sat', hours: 1.5 },
        { day: 'Sun', hours: 2.3 }
    ];

    const maxHours = Math.max(...weeklyData.map(d => d.hours));

    return (
        <div className="analytics">
            <div className="analytics-header">
                <h1>Learning Analytics</h1>
                <p>Track your progress and learning patterns</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <h3 className="stat-label">{stat.label}</h3>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-change positive">{stat.change}</div>
                    </div>
                ))}
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h2>Weekly Study Time</h2>
                    <div className="bar-chart">
                        {weeklyData.map(data => (
                            <div key={data.day} className="bar-group">
                                <div
                                    className="bar"
                                    style={{ height: `${(data.hours / maxHours) * 120}px` }}
                                ></div>
                                <span className="bar-label">{data.day}</span>
                                <span className="bar-value">{data.hours}h</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Subject Progress</h2>
                    <div className="progress-chart">
                        <div className="progress-item">
                            <div className="progress-header">
                                <span>JavaScript</span>
                                <span>85%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '85%' }}></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-header">
                                <span>React</span>
                                <span>72%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '72%' }}></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-header">
                                <span>Node.js</span>
                                <span>58%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '58%' }}></div>
                            </div>
                        </div>

                        <div className="progress-item">
                            <div className="progress-header">
                                <span>Python</span>
                                <span>91%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '91%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="insights-grid">
                <div className="insights-card">
                    <h2>Learning Insights</h2>
                    <div className="insights-list">
                        <div className="insight-item">
                            <span className="insight-icon">🔥</span>
                            <div className="insight-content">
                                <h4>Great Momentum!</h4>
                                <p>You've maintained a 23-day learning streak. Keep it up!</p>
                            </div>
                        </div>

                        <div className="insight-item">
                            <span className="insight-icon">📈</span>
                            <div className="insight-content">
                                <h4>Improving Performance</h4>
                                <p>Your average score increased by 5% this month.</p>
                            </div>
                        </div>

                        <div className="insight-item">
                            <span className="insight-icon">⏰</span>
                            <div className="insight-content">
                                <h4>Peak Learning Time</h4>
                                <p>You're most productive on Wednesdays around 3 PM.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="goals-card">
                    <h2>Learning Goals</h2>
                    <div className="goals-list">
                        <div className="goal-item">
                            <div className="goal-header">
                                <span>Complete React Course</span>
                                <span>75%</span>
                            </div>
                            <div className="goal-progress">
                                <div className="goal-fill" style={{ width: '75%' }}></div>
                            </div>
                            <span className="goal-deadline">Due: Dec 31, 2024</span>
                        </div>

                        <div className="goal-item">
                            <div className="goal-header">
                                <span>Study 100 Hours</span>
                                <span>67%</span>
                            </div>
                            <div className="goal-progress">
                                <div className="goal-fill" style={{ width: '67%' }}></div>
                            </div>
                            <span className="goal-deadline">67/100 hours completed</span>
                        </div>

                        <div className="goal-item">
                            <div className="goal-header">
                                <span>Learn 5 New Skills</span>
                                <span>60%</span>
                            </div>
                            <div className="goal-progress">
                                <div className="goal-fill" style={{ width: '60%' }}></div>
                            </div>
                            <span className="goal-deadline">3/5 skills acquired</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .analytics {
          padding: 0;
        }
        
        .analytics-header {
          margin-bottom: 2rem;
        }
        
        .analytics-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .analytics-header p {
          color: #6b7280;
        }
        
        .stats-grid {
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
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .stat-change {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .stat-change.positive {
          color: #10b981;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .chart-container {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .chart-container h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1.5rem;
        }
        
        .bar-chart {
          display: flex;
          align-items: end;
          justify-content: space-between;
          height: 150px;
          gap: 0.5rem;
        }
        
        .bar-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .bar {
          background: linear-gradient(to top, #3b82f6, #60a5fa);
          width: 100%;
          max-width: 30px;
          border-radius: 4px 4px 0 0;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .bar:hover {
          background: linear-gradient(to top, #2563eb, #3b82f6);
        }
        
        .bar-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        
        .bar-value {
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
        }
        
        .progress-chart {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .progress-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        
        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #34d399);
          transition: width 0.3s ease;
        }
        
        .insights-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .insights-card,
        .goals-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .insights-card h2,
        .goals-card h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .insight-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }
        
        .insight-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .insight-content h4 {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .insight-content p {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .goals-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .goal-item {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }
        
        .goal-header {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .goal-progress {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .goal-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          transition: width 0.3s ease;
        }
        
        .goal-deadline {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        @media (max-width: 768px) {
          .charts-grid,
          .insights-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .bar-chart {
            height: 120px;
          }
        }
      `}</style>
        </div>
    );
};

export default Analytics;