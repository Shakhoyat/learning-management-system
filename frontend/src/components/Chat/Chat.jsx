import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useCollaboration';
import './Chat.css';

const Chat = ({ user, sessionId, onError }) => {
    const [messageInput, setMessageInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const {
        messages,
        isConnected,
        sendMessage
    } = useChat(user, sessionId);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (!isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMinimized]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (messageInput.trim()) {
            sendMessage(messageInput.trim());
            setMessageInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isSystemMessage = (message) => {
        return message.type === 'system' || message.userId === 'system';
    };

    const isAIMessage = (message) => {
        return message.userId === 'ai-assistant';
    };

    const getMessageClass = (message) => {
        if (isSystemMessage(message)) return 'system-message';
        if (isAIMessage(message)) return 'ai-message';
        if (message.userId === user?.id) return 'own-message';
        return 'other-message';
    };

    const renderMessageContent = (message) => {
        if (message.type === 'code') {
            return (
                <div className="code-message">
                    <pre><code>{message.content}</code></pre>
                </div>
            );
        }

        if (message.type === 'file') {
            return (
                <div className="file-message">
                    <span className="file-icon">📎</span>
                    <span className="file-name">{message.content}</span>
                </div>
            );
        }

        // Handle @mentions and basic formatting
        let content = message.content;

        // Replace @ai mentions
        content = content.replace(/@ai\b/g, '<span class="mention">@AI Assistant</span>');

        // Replace user mentions (simplified)
        content = content.replace(/@(\w+)/g, '<span class="mention">@$1</span>');

        // Handle URLs
        content = content.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    const sendCodeSnippet = () => {
        const code = prompt('Enter code snippet:');
        if (code) {
            sendMessage(code, 'code');
        }
    };

    const sendFileReference = () => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            sendMessage(fileName, 'file');
        }
    };

    const askAI = () => {
        const question = prompt('Ask AI Assistant:');
        if (question) {
            sendMessage(`@ai ${question}`);
        }
    };

    return (
        <div className={`chat-container ${isMinimized ? 'minimized' : ''}`}>
            <div className="chat-header">
                <div className="header-left">
                    <span className="chat-title">💬 Session Chat</span>
                    <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                        {isConnected ? '🟢' : '🔴'}
                    </span>
                </div>

                <div className="header-actions">
                    <button
                        className="minimize-btn"
                        onClick={() => setIsMinimized(!isMinimized)}
                        title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                    >
                        {isMinimized ? '⬆️' : '⬇️'}
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    <div className="messages-container">
                        <div className="messages-list">
                            {messages.length === 0 ? (
                                <div className="empty-chat">
                                    <span>💬</span>
                                    <p>Start the conversation!</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`message ${getMessageClass(message)}`}
                                    >
                                        <div className="message-header">
                                            {!isSystemMessage(message) && !isAIMessage(message) && (
                                                <span className="message-sender">
                                                    {message.userId === user?.id ? 'You' : message.senderName || 'User'}
                                                </span>
                                            )}
                                            {isAIMessage(message) && (
                                                <span className="message-sender ai-sender">
                                                    🤖 AI Assistant
                                                </span>
                                            )}
                                            <span className="message-time">
                                                {formatTimestamp(message.timestamp)}
                                            </span>
                                        </div>

                                        <div className="message-content">
                                            {renderMessageContent(message)}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="chat-input-container">
                        <div className="input-actions">
                            <button
                                className="action-btn"
                                onClick={sendCodeSnippet}
                                title="Send code snippet"
                            >
                                💻
                            </button>
                            <button
                                className="action-btn"
                                onClick={sendFileReference}
                                title="Reference file"
                            >
                                📎
                            </button>
                            <button
                                className="action-btn ai-btn"
                                onClick={askAI}
                                title="Ask AI Assistant"
                            >
                                🤖
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="message-form">
                            <div className="input-wrapper">
                                <textarea
                                    ref={inputRef}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                                    className="message-input"
                                    rows="1"
                                    disabled={!isConnected}
                                />
                                <button
                                    type="submit"
                                    className="send-btn"
                                    disabled={!messageInput.trim() || !isConnected}
                                    title="Send message"
                                >
                                    📤
                                </button>
                            </div>
                        </form>

                        <div className="chat-hints">
                            <span className="hint">Tips: Use @ai to ask AI Assistant, @username to mention someone</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Chat;