import React, { useRef, useEffect, useState } from 'react';
import { useWhiteboard } from '../../hooks/useCollaboration';
import './Whiteboard.css';

const Whiteboard = ({ user, sessionId, onError }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [lastPoint, setLastPoint] = useState(null);

  const {
    drawingData,
    isConnected,
    activeUsers,
    draw,
    erase,
    clearBoard
  } = useWhiteboard(user, sessionId);

  // Redraw canvas when drawing data changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all operations
    drawingData.forEach(operation => {
      drawOperation(ctx, operation);
    });
  }, [drawingData]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Set default styles
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const drawOperation = (ctx, operation) => {
    ctx.save();
    
    switch (operation.type) {
      case 'path':
        ctx.strokeStyle = operation.color || '#000000';
        ctx.lineWidth = operation.strokeWidth || 2;
        ctx.globalCompositeOperation = operation.tool === 'eraser' ? 'destination-out' : 'source-over';
        
        ctx.beginPath();
        operation.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        break;
        
      case 'text':
        ctx.fillStyle = operation.color || '#000000';
        ctx.font = `${operation.fontSize || 16}px Arial`;
        ctx.fillText(operation.text, operation.x, operation.y);
        break;
        
      case 'rectangle':
        ctx.strokeStyle = operation.color || '#000000';
        ctx.lineWidth = operation.strokeWidth || 2;
        ctx.strokeRect(operation.x, operation.y, operation.width, operation.height);
        if (operation.filled) {
          ctx.fillStyle = operation.fillColor || operation.color;
          ctx.fillRect(operation.x, operation.y, operation.width, operation.height);
        }
        break;
        
      case 'circle':
        ctx.strokeStyle = operation.color || '#000000';
        ctx.lineWidth = operation.strokeWidth || 2;
        ctx.beginPath();
        ctx.arc(operation.x, operation.y, operation.radius, 0, 2 * Math.PI);
        ctx.stroke();
        if (operation.filled) {
          ctx.fillStyle = operation.fillColor || operation.color;
          ctx.fill();
        }
        break;
    }
    
    ctx.restore();
  };

  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e) => {
    if (tool === 'text') return;
    
    setIsDrawing(true);
    const point = getCanvasPoint(e);
    setLastPoint(point);
    
    if (tool === 'pen' || tool === 'eraser') {
      // Start a new path
      setLastPoint(point);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !lastPoint) return;
    
    const currentPoint = getCanvasPoint(e);
    
    if (tool === 'pen' || tool === 'eraser') {
      const drawData = {
        type: 'path',
        tool,
        color: tool === 'eraser' ? null : color,
        strokeWidth,
        points: [lastPoint, currentPoint],
        timestamp: Date.now()
      };
      
      draw(drawData);
      setLastPoint(currentPoint);
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setLastPoint(null);
    
    if (tool === 'rectangle' || tool === 'circle') {
      const currentPoint = getCanvasPoint(e);
      
      if (tool === 'rectangle') {
        const drawData = {
          type: 'rectangle',
          x: Math.min(lastPoint.x, currentPoint.x),
          y: Math.min(lastPoint.y, currentPoint.y),
          width: Math.abs(currentPoint.x - lastPoint.x),
          height: Math.abs(currentPoint.y - lastPoint.y),
          color,
          strokeWidth,
          filled: false,
          timestamp: Date.now()
        };
        draw(drawData);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(currentPoint.x - lastPoint.x, 2) + 
          Math.pow(currentPoint.y - lastPoint.y, 2)
        );
        
        const drawData = {
          type: 'circle',
          x: lastPoint.x,
          y: lastPoint.y,
          radius,
          color,
          strokeWidth,
          filled: false,
          timestamp: Date.now()
        };
        draw(drawData);
      }
    }
  };

  const handleTextClick = (e) => {
    if (tool !== 'text') return;
    
    const point = getCanvasPoint(e);
    const text = prompt('Enter text:');
    
    if (text) {
      const drawData = {
        type: 'text',
        text,
        x: point.x,
        y: point.y,
        color,
        fontSize: 16,
        timestamp: Date.now()
      };
      draw(drawData);
    }
  };

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' },
    { id: 'text', name: 'Text', icon: 'T' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'
  ];

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-toolbar">
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
        </div>

        <div className="tool-group">
          <label>Tool:</label>
          <div className="tools">
            {tools.map(t => (
              <button
                key={t.id}
                className={`tool-btn ${tool === t.id ? 'active' : ''}`}
                onClick={() => setTool(t.id)}
                title={t.name}
              >
                {t.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-group">
          <label>Color:</label>
          <div className="colors">
            {colors.map(c => (
              <button
                key={c}
                className={`color-btn ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <div className="tool-group">
          <label>Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="stroke-width-slider"
          />
          <span>{strokeWidth}px</span>
        </div>

        <div className="tool-group">
          <button 
            className="action-btn clear-btn"
            onClick={clearBoard}
            title="Clear board"
          >
            🗑️ Clear
          </button>
        </div>

        <div className="active-users">
          <span>👥 {activeUsers.length + 1}</span>
          <div className="user-list">
            <span className="user-indicator self">You</span>
            {activeUsers.map(user => (
              <span key={user.userId} className="user-indicator">
                {user.name || 'User'}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="whiteboard-canvas-container">
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleTextClick}
          style={{ cursor: getCursor(tool) }}
        />
      </div>
    </div>
  );
};

const getCursor = (tool) => {
  switch (tool) {
    case 'pen': return 'crosshair';
    case 'eraser': return 'grab';
    case 'text': return 'text';
    case 'rectangle':
    case 'circle': return 'crosshair';
    default: return 'default';
  }
};

export default Whiteboard;