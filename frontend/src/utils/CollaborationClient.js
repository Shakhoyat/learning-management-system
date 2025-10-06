import io from 'socket.io-client';

/**
 * WebSocket Client Manager for Real-time Collaboration
 * Handles connections to different collaboration namespaces
 */
class CollaborationClient {
  constructor(baseUrl = process.env.REACT_APP_WEBSOCKET_URL || 'http://localhost:3005') {
    this.baseUrl = baseUrl;
    this.sockets = {};
    this.currentUser = null;
    this.currentSession = null;
    this.eventHandlers = {};
  }

  /**
   * Initialize user session
   */
  init(user, sessionId) {
    this.currentUser = user;
    this.currentSession = sessionId;
  }

  /**
   * Video Conference Connection
   */
  connectVideo(onParticipantJoined, onParticipantLeft, onOffer, onAnswer, onIceCandidate) {
    if (this.sockets.video) {
      this.sockets.video.disconnect();
    }

    this.sockets.video = io(`${this.baseUrl}/video`, {
      transports: ['websocket', 'polling'],
      auth: {
        userId: this.currentUser?.id,
        sessionId: this.currentSession
      }
    });

    // Connection events
    this.sockets.video.on('connect', () => {
      console.log('Connected to video namespace');
      this.joinVideoRoom();
    });

    this.sockets.video.on('disconnect', () => {
      console.log('Disconnected from video namespace');
    });

    // Participant events
    this.sockets.video.on('user-joined', onParticipantJoined);
    this.sockets.video.on('user-left', onParticipantLeft);
    this.sockets.video.on('existing-participants', (participants) => {
      participants.forEach(onParticipantJoined);
    });

    // WebRTC signaling events
    this.sockets.video.on('offer', onOffer);
    this.sockets.video.on('answer', onAnswer);
    this.sockets.video.on('ice-candidate', onIceCandidate);

    // Media control events
    this.sockets.video.on('user-video-toggle', (data) => {
      this.emit('videoToggle', data);
    });

    this.sockets.video.on('user-audio-toggle', (data) => {
      this.emit('audioToggle', data);
    });

    this.sockets.video.on('user-screen-share', (data) => {
      this.emit('screenShare', data);
    });

    this.sockets.video.on('error', (error) => {
      console.error('Video socket error:', error);
      this.emit('error', error);
    });

    return this.sockets.video;
  }

  /**
   * Join video room
   */
  joinVideoRoom() {
    if (this.sockets.video && this.currentUser && this.currentSession) {
      this.sockets.video.emit('join-room', {
        sessionId: this.currentSession,
        userId: this.currentUser.id,
        userInfo: {
          name: this.currentUser.name,
          avatar: this.currentUser.avatar
        }
      });
    }
  }

  /**
   * WebRTC signaling methods
   */
  sendOffer(targetSocketId, offer) {
    if (this.sockets.video) {
      this.sockets.video.emit('offer', {
        target: targetSocketId,
        offer
      });
    }
  }

  sendAnswer(targetSocketId, answer) {
    if (this.sockets.video) {
      this.sockets.video.emit('answer', {
        target: targetSocketId,
        answer
      });
    }
  }

  sendIceCandidate(targetSocketId, candidate) {
    if (this.sockets.video) {
      this.sockets.video.emit('ice-candidate', {
        target: targetSocketId,
        candidate
      });
    }
  }

  /**
   * Media controls
   */
  toggleVideo(enabled) {
    if (this.sockets.video) {
      this.sockets.video.emit('toggle-video', { enabled });
    }
  }

  toggleAudio(enabled) {
    if (this.sockets.video) {
      this.sockets.video.emit('toggle-audio', { enabled });
    }
  }

  startScreenShare() {
    if (this.sockets.video) {
      this.sockets.video.emit('start-screen-share');
    }
  }

  stopScreenShare() {
    if (this.sockets.video) {
      this.sockets.video.emit('stop-screen-share');
    }
  }

  /**
   * Whiteboard Connection
   */
  connectWhiteboard(onDraw, onErase, onClear, onStateUpdate) {
    if (this.sockets.whiteboard) {
      this.sockets.whiteboard.disconnect();
    }

    this.sockets.whiteboard = io(`${this.baseUrl}/whiteboard`, {
      transports: ['websocket', 'polling']
    });

    this.sockets.whiteboard.on('connect', () => {
      console.log('Connected to whiteboard namespace');
      this.joinWhiteboard();
    });

    this.sockets.whiteboard.on('disconnect', () => {
      console.log('Disconnected from whiteboard namespace');
    });

    // Whiteboard events
    this.sockets.whiteboard.on('draw', onDraw);
    this.sockets.whiteboard.on('erase', onErase);
    this.sockets.whiteboard.on('board-cleared', onClear);
    this.sockets.whiteboard.on('whiteboard-state', onStateUpdate);

    this.sockets.whiteboard.on('user-joined-whiteboard', (data) => {
      this.emit('whiteboardUserJoined', data);
    });

    this.sockets.whiteboard.on('user-left-whiteboard', (data) => {
      this.emit('whiteboardUserLeft', data);
    });

    this.sockets.whiteboard.on('error', (error) => {
      console.error('Whiteboard socket error:', error);
      this.emit('error', error);
    });

    return this.sockets.whiteboard;
  }

  /**
   * Join whiteboard
   */
  joinWhiteboard() {
    if (this.sockets.whiteboard && this.currentUser && this.currentSession) {
      this.sockets.whiteboard.emit('join-whiteboard', {
        sessionId: this.currentSession,
        userId: this.currentUser.id
      });
    }
  }

  /**
   * Whiteboard drawing methods
   */
  draw(drawData) {
    if (this.sockets.whiteboard) {
      this.sockets.whiteboard.emit('draw', drawData);
    }
  }

  erase(eraseData) {
    if (this.sockets.whiteboard) {
      this.sockets.whiteboard.emit('erase', eraseData);
    }
  }

  clearBoard() {
    if (this.sockets.whiteboard) {
      this.sockets.whiteboard.emit('clear-board');
    }
  }

  /**
   * Code Collaboration Connection
   */
  connectCode(fileId, onCodeChange, onCursorUpdate, onCollaboratorJoined, onCollaboratorLeft, onExecutionResult) {
    if (this.sockets.code) {
      this.sockets.code.disconnect();
    }

    this.sockets.code = io(`${this.baseUrl}/code`, {
      transports: ['websocket', 'polling']
    });

    this.sockets.code.on('connect', () => {
      console.log('Connected to code namespace');
      this.joinCodeSession(fileId);
    });

    this.sockets.code.on('disconnect', () => {
      console.log('Disconnected from code namespace');
    });

    // Code collaboration events
    this.sockets.code.on('code-change', onCodeChange);
    this.sockets.code.on('cursor-update', onCursorUpdate);
    this.sockets.code.on('collaborator-joined', onCollaboratorJoined);
    this.sockets.code.on('collaborator-left', onCollaboratorLeft);
    this.sockets.code.on('code-execution-result', onExecutionResult);

    this.sockets.code.on('file-content', (content) => {
      this.emit('fileContent', content);
    });

    this.sockets.code.on('active-cursors', (cursors) => {
      this.emit('activeCursors', cursors);
    });

    this.sockets.code.on('code-execution-error', (error) => {
      this.emit('executionError', error);
    });

    this.sockets.code.on('error', (error) => {
      console.error('Code socket error:', error);
      this.emit('error', error);
    });

    return this.sockets.code;
  }

  /**
   * Join code session
   */
  joinCodeSession(fileId) {
    if (this.sockets.code && this.currentUser && this.currentSession) {
      this.sockets.code.emit('join-code-session', {
        sessionId: this.currentSession,
        userId: this.currentUser.id,
        fileId
      });
    }
  }

  /**
   * Code collaboration methods
   */
  sendCodeChange(changeData) {
    if (this.sockets.code) {
      this.sockets.code.emit('code-change', changeData);
    }
  }

  sendCursorPosition(position, selection) {
    if (this.sockets.code) {
      this.sockets.code.emit('cursor-position', {
        position,
        selection
      });
    }
  }

  executeCode(code, language) {
    if (this.sockets.code) {
      this.sockets.code.emit('execute-code', {
        code,
        language
      });
    }
  }

  /**
   * Chat Connection
   */
  connectChat(onMessage, onHistoryLoaded) {
    if (this.sockets.chat) {
      this.sockets.chat.disconnect();
    }

    this.sockets.chat = io(`${this.baseUrl}/chat`, {
      transports: ['websocket', 'polling']
    });

    this.sockets.chat.on('connect', () => {
      console.log('Connected to chat namespace');
      this.joinChat();
    });

    this.sockets.chat.on('disconnect', () => {
      console.log('Disconnected from chat namespace');
    });

    // Chat events
    this.sockets.chat.on('new-message', onMessage);
    this.sockets.chat.on('chat-history', onHistoryLoaded);

    this.sockets.chat.on('error', (error) => {
      console.error('Chat socket error:', error);
      this.emit('error', error);
    });

    return this.sockets.chat;
  }

  /**
   * Join chat
   */
  joinChat() {
    if (this.sockets.chat && this.currentUser && this.currentSession) {
      this.sockets.chat.emit('join-chat', {
        sessionId: this.currentSession,
        userId: this.currentUser.id
      });
    }
  }

  /**
   * Send chat message
   */
  sendMessage(content, type = 'text') {
    if (this.sockets.chat) {
      this.sockets.chat.emit('send-message', {
        content,
        type
      });
    }
  }

  /**
   * Event system for custom handlers
   */
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  off(event, handler) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    }
  }

  emit(event, data) {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(data));
    }
  }

  /**
   * Disconnect all sockets
   */
  disconnectAll() {
    Object.values(this.sockets).forEach(socket => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    });
    this.sockets = {};
    this.eventHandlers = {};
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      video: this.sockets.video?.connected || false,
      whiteboard: this.sockets.whiteboard?.connected || false,
      code: this.sockets.code?.connected || false,
      chat: this.sockets.chat?.connected || false
    };
  }
}

export default CollaborationClient;