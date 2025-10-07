import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, currentPath }) => {
    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/skill-map', label: 'Skill Map', icon: '🗺️' },
        { path: '/learning', label: 'Learning', icon: '📚' },
        { path: '/teaching', label: 'Teaching', icon: '👨‍🏫' },
        { path: '/collaboration', label: 'Collaboration', icon: '🤝' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
    ];

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {menuItems.map((item) => (
                            <li key={item.path} className="nav-item">
                                <Link
                                    to={item.path}
                                    className={`nav-link ${currentPath.startsWith(item.path) ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {isOpen && <div className="sidebar-overlay" />}

            <style jsx>{`
        .sidebar {
          position: fixed;
          top: 60px;
          left: 0;
          width: 250px;
          height: calc(100vh - 60px);
          background: white;
          border-right: 1px solid #e5e7eb;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 50;
          overflow-y: auto;
        }
        
        .sidebar.open {
          transform: translateX(0);
        }
        
        .sidebar-nav {
          padding: 20px 0;
        }
        
        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          margin-bottom: 4px;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
          border-right: 3px solid transparent;
        }
        
        .nav-link:hover {
          background-color: #f9fafb;
          color: #374151;
        }
        
        .nav-link.active {
          background-color: #eff6ff;
          color: #3b82f6;
          border-right-color: #3b82f6;
        }
        
        .nav-icon {
          font-size: 1.2rem;
          width: 20px;
          text-align: center;
        }
        
        .nav-label {
          font-weight: 500;
          font-size: 0.875rem;
        }
        
        .sidebar-overlay {
          position: fixed;
          top: 60px;
          left: 0;
          width: 100vw;
          height: calc(100vh - 60px);
          background: rgba(0, 0, 0, 0.5);
          z-index: 40;
          display: none;
        }
        
        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block;
          }
          
          .sidebar {
            z-index: 60;
          }
        }
        
        @media (min-width: 769px) {
          .sidebar {
            position: relative;
            top: 0;
            transform: translateX(0);
            height: auto;
          }
          
          .sidebar.closed {
            transform: translateX(-100%);
          }
        }
      `}</style>
        </>
    );
};

export default Sidebar;