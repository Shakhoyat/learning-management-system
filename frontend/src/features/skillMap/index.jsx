import React from 'react';

const SkillMap = () => {
  const skills = [
    { id: 1, name: 'HTML', level: 90, category: 'Frontend' },
    { id: 2, name: 'CSS', level: 85, category: 'Frontend' },
    { id: 3, name: 'JavaScript', level: 80, category: 'Frontend' },
    { id: 4, name: 'React', level: 75, category: 'Frontend' },
    { id: 5, name: 'Node.js', level: 60, category: 'Backend' },
    { id: 6, name: 'Python', level: 70, category: 'Backend' },
  ];

  const getSkillColor = (level) => {
    if (level >= 80) return '#10b981';
    if (level >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="skill-map">
      <div className="skill-map-header">
        <h1>Skill Map</h1>
        <p>Track your progress and discover learning paths</p>
      </div>

      <div className="skill-categories">
        <div className="category-section">
          <h2>Frontend Development</h2>
          <div className="skills-grid">
            {skills.filter(skill => skill.category === 'Frontend').map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-progress">
                  <div
                    className="skill-progress-bar"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: getSkillColor(skill.level)
                    }}
                  ></div>
                </div>
                <div className="skill-actions">
                  <button className="btn-practice">Practice</button>
                  <button className="btn-learn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h2>Backend Development</h2>
          <div className="skills-grid">
            {skills.filter(skill => skill.category === 'Backend').map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-header">
                  <h3>{skill.name}</h3>
                  <span className="skill-level">{skill.level}%</span>
                </div>
                <div className="skill-progress">
                  <div
                    className="skill-progress-bar"
                    style={{
                      width: `${skill.level}%`,
                      backgroundColor: getSkillColor(skill.level)
                    }}
                  ></div>
                </div>
                <div className="skill-actions">
                  <button className="btn-practice">Practice</button>
                  <button className="btn-learn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="learning-path">
        <h2>Recommended Learning Path</h2>
        <div className="path-visualization">
          <div className="path-step completed">
            <div className="step-circle">✓</div>
            <div className="step-content">
              <h4>HTML Basics</h4>
              <p>Completed</p>
            </div>
          </div>
          <div className="path-connector"></div>
          <div className="path-step completed">
            <div className="step-circle">✓</div>
            <div className="step-content">
              <h4>CSS Fundamentals</h4>
              <p>Completed</p>
            </div>
          </div>
          <div className="path-connector"></div>
          <div className="path-step current">
            <div className="step-circle">📚</div>
            <div className="step-content">
              <h4>JavaScript ES6+</h4>
              <p>In Progress</p>
            </div>
          </div>
          <div className="path-connector"></div>
          <div className="path-step upcoming">
            <div className="step-circle">⏳</div>
            <div className="step-content">
              <h4>React Framework</h4>
              <p>Up Next</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .skill-map {
          padding: 0;
        }
        
        .skill-map-header {
          margin-bottom: 2rem;
        }
        
        .skill-map-header h1 {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        
        .skill-map-header p {
          color: #6b7280;
        }
        
        .skill-categories {
          margin-bottom: 3rem;
        }
        
        .category-section {
          margin-bottom: 2rem;
        }
        
        .category-section h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .skill-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .skill-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .skill-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
        }
        
        .skill-level {
          font-weight: bold;
          color: #3b82f6;
        }
        
        .skill-progress {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        
        .skill-progress-bar {
          height: 100%;
          transition: width 0.3s ease;
        }
        
        .skill-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .btn-practice,
        .btn-learn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-practice {
          background: #3b82f6;
          color: white;
        }
        
        .btn-practice:hover {
          background: #2563eb;
        }
        
        .btn-learn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }
        
        .btn-learn:hover {
          background: #e5e7eb;
        }
        
        .learning-path {
          background: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .learning-path h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2rem;
        }
        
        .path-visualization {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .path-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .step-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        
        .path-step.completed .step-circle {
          background: #10b981;
          color: white;
        }
        
        .path-step.current .step-circle {
          background: #3b82f6;
          color: white;
        }
        
        .path-step.upcoming .step-circle {
          background: #e5e7eb;
          color: #6b7280;
        }
        
        .step-content h4 {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .step-content p {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .path-connector {
          width: 40px;
          height: 2px;
          background: #d1d5db;
          margin: 0 1rem;
        }
        
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
          
          .path-visualization {
            flex-direction: column;
          }
          
          .path-connector {
            width: 2px;
            height: 40px;
            margin: 1rem 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillMap;