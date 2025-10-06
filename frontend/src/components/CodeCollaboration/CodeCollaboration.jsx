import React, { useRef, useEffect, useState } from 'react';
import { useCodeCollaboration } from '../../hooks/useCollaboration';
import './CodeCollaboration.css';

const CodeCollaboration = ({ user, sessionId, fileId, onError }) => {
    const editorRef = useRef(null);
    const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
    const [selection, setSelection] = useState(null);

    const {
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
    } = useCodeCollaboration(user, sessionId, fileId);

    // Initialize Monaco Editor
    useEffect(() => {
        if (!window.monaco) {
            // Load Monaco Editor
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs/loader.js';
            script.onload = () => {
                window.require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs' } });
                window.require(['vs/editor/editor.main'], initializeEditor);
            };
            document.head.appendChild(script);
        } else {
            initializeEditor();
        }
    }, []);

    const initializeEditor = () => {
        if (editorRef.current && window.monaco) {
            const editor = window.monaco.editor.create(editorRef.current, {
                value: code,
                language: language,
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                cursorBlinking: 'smooth',
                renderWhitespace: 'boundary'
            });

            // Handle content changes
            editor.onDidChangeModelContent((e) => {
                const changes = e.changes[0];
                if (changes) {
                    const changeData = {
                        type: changes.text ? 'insert' : 'delete',
                        position: editor.getModel().getOffsetAt({
                            lineNumber: changes.range.startLineNumber,
                            column: changes.range.startColumn
                        }),
                        text: changes.text,
                        length: changes.rangeLength,
                        timestamp: Date.now()
                    };

                    sendCodeChange(changeData);
                }
            });

            // Handle cursor position changes
            editor.onDidChangeCursorPosition((e) => {
                const position = e.position;
                setCursorPosition({ line: position.lineNumber, column: position.column });

                sendCursorPosition(
                    { line: position.lineNumber, column: position.column },
                    editor.getSelection()
                );
            });

            // Handle selection changes
            editor.onDidChangeCursorSelection((e) => {
                setSelection(e.selection);
            });

            // Store editor reference
            window.collaborativeEditor = editor;
        }
    };

    // Update editor content when code changes
    useEffect(() => {
        if (window.collaborativeEditor && window.collaborativeEditor.getValue() !== code) {
            window.collaborativeEditor.setValue(code);
        }
    }, [code]);

    // Update language
    useEffect(() => {
        if (window.collaborativeEditor && window.monaco) {
            window.monaco.editor.setModelLanguage(window.collaborativeEditor.getModel(), language);
        }
    }, [language]);

    // Render collaborator cursors
    useEffect(() => {
        if (window.collaborativeEditor && cursors.length > 0) {
            // Clear existing decorations
            window.collaborativeEditor.deltaDecorations(
                window.collaborativeEditor._collaboratorDecorations || [],
                []
            );

            // Add new cursor decorations
            const decorations = cursors.map(cursor => ({
                range: new window.monaco.Range(
                    cursor.position.line,
                    cursor.position.column,
                    cursor.position.line,
                    cursor.position.column + 1
                ),
                options: {
                    className: `collaborator-cursor cursor-${cursor.userId}`,
                    hoverMessage: { value: `${cursor.userName || 'User'}'s cursor` }
                }
            }));

            window.collaborativeEditor._collaboratorDecorations =
                window.collaborativeEditor.deltaDecorations([], decorations);
        }
    }, [cursors]);

    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'python', name: 'Python' },
        { id: 'java', name: 'Java' },
        { id: 'cpp', name: 'C++' },
        { id: 'html', name: 'HTML' },
        { id: 'css', name: 'CSS' },
        { id: 'json', name: 'JSON' }
    ];

    const formatCode = () => {
        if (window.collaborativeEditor) {
            window.collaborativeEditor.getAction('editor.action.formatDocument').run();
        }
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${getFileExtension(language)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getFileExtension = (lang) => {
        const extensions = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            html: 'html',
            css: 'css',
            json: 'json'
        };
        return extensions[lang] || 'txt';
    };

    return (
        <div className="code-collaboration">
            <div className="code-toolbar">
                <div className="connection-status">
                    <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                </div>

                <div className="language-selector">
                    <label>Language:</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="language-select"
                    >
                        {languages.map(lang => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="editor-actions">
                    <button onClick={formatCode} className="action-btn" title="Format Code">
                        🎨 Format
                    </button>
                    <button onClick={executeCode} className="action-btn execute-btn" title="Run Code">
                        ▶️ Run
                    </button>
                    <button onClick={downloadCode} className="action-btn" title="Download">
                        💾 Download
                    </button>
                </div>

                <div className="collaborators">
                    <span className="collaborator-count">
                        👥 {collaborators.length + 1}
                    </span>
                    <div className="collaborator-list">
                        <div className="collaborator self">
                            <span className="collaborator-name">{user?.name} (You)</span>
                            <span className="collaborator-cursor-indicator your-cursor"></span>
                        </div>
                        {collaborators.map(collaborator => (
                            <div key={collaborator.userId} className="collaborator">
                                <span className="collaborator-name">{collaborator.name || 'User'}</span>
                                <span className={`collaborator-cursor-indicator cursor-${collaborator.userId}`}></span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="cursor-position">
                    Line {cursorPosition.line}, Column {cursorPosition.column}
                </div>
            </div>

            <div className="editor-container">
                <div ref={editorRef} className="monaco-editor" />
            </div>

            {executionResult && (
                <div className="execution-result">
                    <div className="result-header">
                        <span>Execution Result</span>
                        <button
                            onClick={() => window.location.reload()}
                            className="close-result"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="result-content">
                        {executionResult.error ? (
                            <div className="error-output">
                                <strong>Error:</strong>
                                <pre>{executionResult.error}</pre>
                            </div>
                        ) : (
                            <div className="success-output">
                                <strong>Output:</strong>
                                <pre>{executionResult.output}</pre>
                                {executionResult.executionTime && (
                                    <div className="execution-time">
                                        Execution time: {executionResult.executionTime.toFixed(2)}ms
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="code-info">
                <div className="file-info">
                    <span>File: {fileId}</span>
                    <span>Language: {language}</span>
                    <span>Lines: {code.split('\n').length}</span>
                </div>
            </div>
        </div>
    );
};

export default CodeCollaboration;