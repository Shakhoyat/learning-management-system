import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectSidebarOpen, toggleSidebar } from '../../store/slices/uiSlice';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const sidebarOpen = useSelector(selectSidebarOpen);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="layout">
      <Header onToggleSidebar={handleToggleSidebar} />

      <div className="layout-content">
        <Sidebar isOpen={sidebarOpen} currentPath={location.pathname} />

        <main className={`main-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .layout-content {
          display: flex;
          flex: 1;
        }
        
        .main-content {
          flex: 1;
          padding: 20px;
          transition: margin-left 0.3s ease;
          overflow-x: auto;
        }
        
        .main-content.with-sidebar {
          margin-left: 250px;
        }
        
        .main-content.full-width {
          margin-left: 0;
        }
        
        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .main-content.with-sidebar {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;