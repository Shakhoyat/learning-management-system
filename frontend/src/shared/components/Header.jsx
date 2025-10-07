import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUser, logout } from '../../store/slices/authSlice';
import { selectTheme, toggleTheme } from '../../store/slices/uiSlice';

const Header = ({ onToggleSidebar }) => {
    const user = useSelector(selectUser);
    const theme = useSelector(selectTheme);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleToggleTheme = () => {
        dispatch(toggleTheme());
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-button" onClick={onToggleSidebar}>
                    <span className="hamburger"></span>
                </button>

                <Link to="/" className="logo">
                    <h1>LMS</h1>
                </Link>
            </div>

            <div className="header-right">
                <button className="theme-toggle" onClick={handleToggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <div className="notifications">
                    <button className="notification-btn">
                        🔔
                        <span className="notification-badge">3</span>
                    </button>
                </div>

                {user ? (
                    <div className="user-menu">
                        <div className="user-info">
                            <img
                                src={user.avatar || '/default-avatar.png'}
                                alt={user.name}
                                className="user-avatar"
                            />
                            <span className="user-name">{user.name}</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="login-link">
                        Login
                    </Link>
                )}
            </div>

            <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
        }
        
        .menu-button:hover {
          background-color: #f3f4f6;
        }
        
        .hamburger {
          display: block;
          width: 20px;
          height: 2px;
          background: #374151;
          position: relative;
        }
        
        .hamburger:before,
        .hamburger:after {
          content: '';
          position: absolute;
          width: 20px;
          height: 2px;
          background: #374151;
          left: 0;
        }
        
        .hamburger:before {
          top: -6px;
        }
        
        .hamburger:after {
          top: 6px;
        }
        
        .logo h1 {
          color: #3b82f6;
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .theme-toggle,
        .notification-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          font-size: 1.2rem;
        }
        
        .theme-toggle:hover,
        .notification-btn:hover {
          background-color: #f3f4f6;
        }
        
        .notifications {
          position: relative;
        }
        
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-name {
          font-weight: 500;
          color: #374151;
        }
        
        .logout-btn,
        .login-link {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.875rem;
          cursor: pointer;
        }
        
        .logout-btn:hover,
        .login-link:hover {
          background: #2563eb;
        }
        
        @media (max-width: 768px) {
          .user-name {
            display: none;
          }
          
          .header {
            padding: 0 16px;
          }
        }
      `}</style>
        </header>
    );
};

export default Header;