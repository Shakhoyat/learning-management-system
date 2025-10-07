import React from 'react';

const Collaboration = () => {
    const activeSessions = [
        {
            id: 1,
            title: 'React Study Group',
            participants: 5,
            type: 'Study Group',
            status: 'active',
            startTime: '2:00 PM'
        },
        {
            id: 2,
            title: 'JavaScript Code Review',
            participants: 3,
            type: 'Code Review',
            status: 'waiting',
            startTime: '3:30 PM'
        }
    ];

    const tools = [
        { name: 'Video Conference', icon: '📹', description: 'Face-to-face learning sessions' },
        { name: 'Code Collaboration', icon: '💻', description: 'Real-time code editing together' },
        { name: 'Whiteboard', icon: '🏷️', description: 'Visual brainstorming and explanations' },
        { name: 'Chat', icon: '💬', description: 'Text-based discussions and Q&A' }
    ];

    return (
        <div className="collaboration">
            <div className="collaboration-header">
                <h1>Collaboration Hub</h1>
                <p>Connect, learn, and work together with peers and mentors</p>
            </div>

            <div className="quick-actions">
                <button className="action-btn primary">
                    <span className="btn-icon">🚀</span>
                    Start New Session
                </button>
                <button className="action-btn secondary">
                    <span className="btn-icon">🔍</span>
                    Find Study Partner
                </button>
                <button className="action-btn secondary">
                    <span className="btn-icon">📅</span>
                    Schedule Session
                </button>
            </div>

            <div className="content-grid">
                <div className="active-sessions">
                    <h2>Active Sessions</h2>

                    {activeSessions.length > 0 ? (
                        <div className="sessions-list">
                            {activeSessions.map(session => (
                                <div key={session.id} className="session-card">
                                    <div className="session-header">
                                        <h3>{session.title}</h3>
                                        <span className={`session-status ${session.status}`}>
                                            {session.status === 'active' ? '🔴 Live' : '⏳ Starting Soon'}
                                        </span>
                                    </div>

                                    <div className="session-details">
                                        <p className="session-type">{session.type}</p>
                                        <p className="session-participants">
                                            👥 {session.participants} participants
                                        </p>
                                        <p className="session-time">⏰ Started at {session.startTime}</p>
                                    </div>

                                    <button className="join-btn">
                                        {session.status === 'active' ? 'Join Now' : 'Join When Ready'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No active sessions right now</p>
                            <button className="start-session-btn">Start Your First Session</button>
                        </div>
                    )}
                </div>

                <div className="collaboration-tools">
                    <h2>Collaboration Tools</h2>
                    <div className="tools-grid">
                        {tools.map(tool => (
                            <div key={tool.name} className="tool-card">
                                <div className="tool-icon">{tool.icon}</div>
                                <h3 className="tool-name">{tool.name}</h3>
                                <p className="tool-description">{tool.description}</p>
                                <button className="tool-launch">Launch</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="recent-collaborations">
                <h2>Recent Collaborations</h2>
                <div className="recent-list">
                    <div className="recent-item">
                        <div className="recent-info">
                            <h4>Python Study Session</h4>
                            <p>with Sarah, Mike, and 3 others</p>
                            <span className="recent-time">2 hours ago</span>
                        </div>
                        <button className="review-btn">View Recording</button>
                    </div>

                    <div className="recent-item">
                        <div className="recent-info">
                            <h4>React Component Review</h4>
                            <p>with Emily and David</p>
                            <span className="recent-time">Yesterday</span>
                        </div>
                        <button className="review-btn">View Notes</button>
                    </div>

                    <div className="recent-item">
                        <div className="recent-info">
                            <h4>Algorithm Problem Solving</h4>
                            <p>with Alex, Chris, and 2 others</p>
                            <span className="recent-time">3 days ago</span>
                        </div>
                        <button className="review-btn">View Solutions</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .collaboration {
          padding: 0;
        }
        
        .collaboration-header {
          margin-bottom: 2rem;
        }
        
        .collaboration-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .collaboration-header p {
          color: #6b7280;
        }
        
        .quick-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .action-btn.primary {
          background: #3b82f6;
          color: white;
        }
        
        .action-btn.primary:hover {
          background: #2563eb;
        }
        
        .action-btn.secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .action-btn.secondary:hover {
          background: #f9fafb;
        }
        
        .btn-icon {
          font-size: 1.2rem;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .active-sessions,
        .collaboration-tools {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .active-sessions h2,
        .collaboration-tools h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .session-card {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }
        
        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .session-header h3 {
          font-weight: 600;
          color: #374151;
        }
        
        .session-status {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .session-status.active {
          color: #dc2626;
        }
        
        .session-status.waiting {
          color: #f59e0b;
        }
        
        .session-details {
          margin-bottom: 1rem;
        }
        
        .session-details p {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        
        .session-type {
          font-weight: 500;
          color: #374151 !important;
        }
        
        .join-btn {
          width: 100%;
          background: #10b981;
          color: white;
          border: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
        }
        
        .join-btn:hover {
          background: #059669;
        }
        
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }
        
        .start-session-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 1rem;
        }
        
        .start-session-btn:hover {
          background: #2563eb;
        }
        
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .tool-card {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .tool-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .tool-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .tool-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }
        
        .tool-launch {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          cursor: pointer;
        }
        
        .tool-launch:hover {
          background: #2563eb;
        }
        
        .recent-collaborations {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .recent-collaborations h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }
        
        .recent-info h4 {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .recent-info p {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        
        .recent-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .review-btn {
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .review-btn:hover {
          background: #4b5563;
        }
        
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .tools-grid {
            grid-template-columns: 1fr;
          }
          
          .quick-actions {
            flex-direction: column;
          }
          
          .recent-item {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Collaboration;