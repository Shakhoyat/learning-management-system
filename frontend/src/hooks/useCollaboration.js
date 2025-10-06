import { useState, useEffect, useRef, useCallback } from 'react';
import CollaborationClient from '../utils/CollaborationClient';

/**
 * Hook for Video Conference functionality
 */
export const useVideoConference = (user, sessionId) => {
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [mediaState, setMediaState] = useState({
    video: true,
    audio: true,
    screenShare: false
  });
  const [connectionError, setConnectionError] = useState(null);
  
  const collaborationClient = useRef(null);
  const peerConnections = useRef(new Map());

  useEffect(() => {
    if (!user || !sessionId) return;

    collaborationClient.current = new CollaborationClient();
    collaborationClient.current.init(user, sessionId);

    const handleParticipantJoined = (participantData) => {
      setParticipants(prev => {
        if (!prev.find(p => p.userId === participantData.userId)) {
          return [...prev, participantData];
        }
        return prev;
      });
    };

    const handleParticipantLeft = (participantData) => {
      setParticipants(prev => prev.filter(p => p.userId !== participantData.userId));
      
      // Clean up peer connection
      const peerConnection = peerConnections.current.get(participantData.socketId);
      if (peerConnection) {
        peerConnection.close();
        peerConnections.current.delete(participantData.socketId);
      }
    };

    const handleOffer = async (data) => {
      try {
        const peerConnection = createPeerConnection(data.sender);
        await peerConnection.setRemoteDescription(data.offer);
        
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        collaborationClient.current.sendAnswer(data.sender, answer);
      } catch (error) {
        console.error('Error handling offer:', error);
        setConnectionError(error.message);
      }
    };

    const handleAnswer = async (data) => {
      try {
        const peerConnection = peerConnections.current.get(data.sender);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(data.answer);
        }
      } catch (error) {
        console.error('Error handling answer:', error);
        setConnectionError(error.message);
      }
    };

    const handleIceCandidate = async (data) => {
      try {
        const peerConnection = peerConnections.current.get(data.sender);
        if (peerConnection) {
          await peerConnection.addIceCandidate(data.candidate);
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    // Connect to video namespace
    const socket = collaborationClient.current.connectVideo(
      handleParticipantJoined,
      handleParticipantLeft,
      handleOffer,
      handleAnswer,
      handleIceCandidate
    );

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Custom event handlers
    collaborationClient.current.on('videoToggle', (data) => {
      setParticipants(prev => 
        prev.map(p => 
          p.userId === data.userId 
            ? { ...p, videoEnabled: data.enabled }
            : p
        )
      );
    });

    collaborationClient.current.on('audioToggle', (data) => {
      setParticipants(prev => 
        prev.map(p => 
          p.userId === data.userId 
            ? { ...p, audioEnabled: data.enabled }
            : p
        )
      );
    });

    collaborationClient.current.on('screenShare', (data) => {
      setParticipants(prev => 
        prev.map(p => 
          p.userId === data.userId 
            ? { ...p, screenSharing: data.action === 'started' }
            : p
        )
      );
    });

    collaborationClient.current.on('error', (error) => {
      setConnectionError(error.message);
    });

    return () => {
      // Cleanup peer connections
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      
      // Disconnect
      collaborationClient.current?.disconnectAll();
    };
  }, [user, sessionId]);

  const createPeerConnection = (socketId) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers for production
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnections.current.set(socketId, peerConnection);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        collaborationClient.current.sendIceCandidate(socketId, event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      // Handle incoming media stream
      setParticipants(prev => 
        prev.map(p => 
          p.socketId === socketId 
            ? { ...p, stream: event.streams[0] }
            : p
        )
      );
    };

    return peerConnection;
  };

  const toggleVideo = useCallback((enabled) => {
    setMediaState(prev => ({ ...prev, video: enabled }));
    collaborationClient.current?.toggleVideo(enabled);
  }, []);

  const toggleAudio = useCallback((enabled) => {
    setMediaState(prev => ({ ...prev, audio: enabled }));
    collaborationClient.current?.toggleAudio(enabled);
  }, []);

  const startScreenShare = useCallback(() => {
    setMediaState(prev => ({ ...prev, screenShare: true }));
    collaborationClient.current?.startScreenShare();
  }, []);

  const stopScreenShare = useCallback(() => {
    setMediaState(prev => ({ ...prev, screenShare: false }));
    collaborationClient.current?.stopScreenShare();
  }, []);

  return {
    participants,
    isConnected,
    mediaState,
    connectionError,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    clearError: () => setConnectionError(null)
  };
};

/**
 * Hook for Whiteboard functionality
 */
export const useWhiteboard = (user, sessionId) => {
  const [drawingData, setDrawingData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  
  const collaborationClient = useRef(null);

  useEffect(() => {
    if (!user || !sessionId) return;

    collaborationClient.current = new CollaborationClient();
    collaborationClient.current.init(user, sessionId);

    const handleDraw = (drawData) => {
      setDrawingData(prev => [...prev, drawData]);
    };

    const handleErase = (eraseData) => {
      setDrawingData(prev => prev.filter(item => !eraseData.erasedIds?.includes(item.id)));
    };

    const handleClear = () => {
      setDrawingData([]);
    };

    const handleStateUpdate = (state) => {
      setDrawingData(state);
    };

    // Connect to whiteboard namespace
    const socket = collaborationClient.current.connectWhiteboard(
      handleDraw,
      handleErase,
      handleClear,
      handleStateUpdate
    );

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // User join/leave events
    collaborationClient.current.on('whiteboardUserJoined', (data) => {
      setActiveUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
    });

    collaborationClient.current.on('whiteboardUserLeft', (data) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
    });

    return () => {
      collaborationClient.current?.disconnectAll();
    };
  }, [user, sessionId]);

  const draw = useCallback((drawData) => {
    // Add to local state immediately for responsiveness
    const localDrawData = { ...drawData, id: Date.now(), userId: user.id };
    setDrawingData(prev => [...prev, localDrawData]);
    
    // Send to server
    collaborationClient.current?.draw(localDrawData);
  }, [user]);

  const erase = useCallback((eraseData) => {
    collaborationClient.current?.erase(eraseData);
  }, []);

  const clearBoard = useCallback(() => {
    setDrawingData([]);
    collaborationClient.current?.clearBoard();
  }, []);

  return {
    drawingData,
    isConnected,
    activeUsers,
    draw,
    erase,
    clearBoard
  };
};

/**
 * Hook for Code Collaboration functionality
 */
export const useCodeCollaboration = (user, sessionId, fileId) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [collaborators, setCollaborators] = useState([]);
  const [cursors, setCursors] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  
  const collaborationClient = useRef(null);

  useEffect(() => {
    if (!user || !sessionId || !fileId) return;

    collaborationClient.current = new CollaborationClient();
    collaborationClient.current.init(user, sessionId);

    const handleCodeChange = (changeData) => {
      // Apply operational transformation
      setCode(prev => applyChange(prev, changeData));
    };

    const handleCursorUpdate = (cursorData) => {
      setCursors(prev => {
        const filtered = prev.filter(c => c.userId !== cursorData.userId);
        return [...filtered, cursorData];
      });
    };

    const handleCollaboratorJoined = (data) => {
      setCollaborators(prev => [...prev.filter(c => c.userId !== data.userId), data]);
    };

    const handleCollaboratorLeft = (data) => {
      setCollaborators(prev => prev.filter(c => c.userId !== data.userId));
      setCursors(prev => prev.filter(c => c.userId !== data.userId));
    };

    const handleExecutionResult = (result) => {
      setExecutionResult(result);
      // Clear result after 10 seconds
      setTimeout(() => setExecutionResult(null), 10000);
    };

    // Connect to code namespace
    const socket = collaborationClient.current.connectCode(
      fileId,
      handleCodeChange,
      handleCursorUpdate,
      handleCollaboratorJoined,
      handleCollaboratorLeft,
      handleExecutionResult
    );

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Handle file content and cursors
    collaborationClient.current.on('fileContent', (content) => {
      setCode(content.content);
      setLanguage(content.language);
    });

    collaborationClient.current.on('activeCursors', (activeCursors) => {
      setCursors(activeCursors);
    });

    collaborationClient.current.on('executionError', (error) => {
      setExecutionResult({ error: error.message, timestamp: Date.now() });
    });

    return () => {
      collaborationClient.current?.disconnectAll();
    };
  }, [user, sessionId, fileId]);

  const sendCodeChange = useCallback((changeData) => {
    // Apply change locally immediately
    setCode(prev => applyChange(prev, changeData));
    
    // Send to server
    collaborationClient.current?.sendCodeChange(changeData);
  }, []);

  const sendCursorPosition = useCallback((position, selection) => {
    collaborationClient.current?.sendCursorPosition(position, selection);
  }, []);

  const executeCode = useCallback(() => {
    collaborationClient.current?.executeCode(code, language);
  }, [code, language]);

  // Simple change application (in production, use proper OT)
  const applyChange = (currentCode, change) => {
    if (change.type === 'insert') {
      return currentCode.slice(0, change.position) + change.text + currentCode.slice(change.position);
    } else if (change.type === 'delete') {
      return currentCode.slice(0, change.position) + currentCode.slice(change.position + change.length);
    }
    return currentCode;
  };

  return {
    code,
    language,
    collaborators,
    cursors,
    isConnected,
    executionResult,
    sendCodeChange,
    sendCursorPosition,
    executeCode,
    setLanguage
  };
};

/**
 * Hook for Chat functionality
 */
export const useChat = (user, sessionId) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState([]);
  
  const collaborationClient = useRef(null);

  useEffect(() => {
    if (!user || !sessionId) return;

    collaborationClient.current = new CollaborationClient();
    collaborationClient.current.init(user, sessionId);

    const handleMessage = (message) => {
      setMessages(prev => [message, ...prev]);
    };

    const handleHistoryLoaded = (history) => {
      setMessages(history);
    };

    // Connect to chat namespace
    const socket = collaborationClient.current.connectChat(
      handleMessage,
      handleHistoryLoaded
    );

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    return () => {
      collaborationClient.current?.disconnectAll();
    };
  }, [user, sessionId]);

  const sendMessage = useCallback((content, type = 'text') => {
    if (content.trim()) {
      collaborationClient.current?.sendMessage(content, type);
    }
  }, []);

  return {
    messages,
    isConnected,
    isTyping,
    sendMessage
  };
};