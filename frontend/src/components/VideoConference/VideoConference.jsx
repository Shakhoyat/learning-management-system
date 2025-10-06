import React, { useRef, useEffect, useState } from 'react';
import { useVideoConference } from '../../hooks/useCollaboration';
import './VideoConference.css';

const VideoConference = ({ user, sessionId, onError }) => {
    const localVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);

    const {
        participants,
        isConnected,
        mediaState,
        connectionError,
        toggleVideo,
        toggleAudio,
        startScreenShare,
        stopScreenShare,
        clearError
    } = useVideoConference(user, sessionId);

    // Get user media on component mount
    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing media devices:', error);
                onError?.(error);
            }
        };

        initializeMedia();

        return () => {
            // Cleanup media stream
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Handle connection errors
    useEffect(() => {
        if (connectionError) {
            onError?.(new Error(connectionError));
            clearError();
        }
    }, [connectionError, onError, clearError]);

    // Control local media
    const handleToggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !mediaState.video;
                toggleVideo(!mediaState.video);
            }
        }
    };

    const handleToggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !mediaState.audio;
                toggleAudio(!mediaState.audio);
            }
        }
    };

    const handleScreenShare = async () => {
        if (mediaState.screenShare) {
            stopScreenShare();
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                });

                // Replace video track with screen share
                const videoTrack = screenStream.getVideoTracks()[0];
                const sender = localStream.getVideoTracks()[0];

                // This would need peer connection access for actual implementation
                startScreenShare();

                videoTrack.onended = () => {
                    stopScreenShare();
                };
            } catch (error) {
                console.error('Error starting screen share:', error);
                onError?.(error);
            }
        }
    };

    return (
        <div className="video-conference">
            <div className="connection-status">
                <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? 'Connected' : 'Connecting...'}
                </span>
            </div>

            <div className="video-grid">
                {/* Local video */}
                <div className="video-participant local">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className={`video-element ${!mediaState.video ? 'video-disabled' : ''}`}
                    />
                    <div className="participant-info">
                        <span className="participant-name">{user?.name} (You)</span>
                        <div className="media-indicators">
                            {!mediaState.video && <span className="indicator video-off">📹</span>}
                            {!mediaState.audio && <span className="indicator audio-off">🎤</span>}
                            {mediaState.screenShare && <span className="indicator screen-share">🖥️</span>}
                        </div>
                    </div>
                </div>

                {/* Remote participants */}
                {participants.map((participant) => (
                    <ParticipantVideo
                        key={participant.userId}
                        participant={participant}
                    />
                ))}
            </div>

            <div className="video-controls">
                <button
                    className={`control-btn ${mediaState.video ? 'active' : 'inactive'}`}
                    onClick={handleToggleVideo}
                    title={mediaState.video ? 'Turn off camera' : 'Turn on camera'}
                >
                    📹
                </button>

                <button
                    className={`control-btn ${mediaState.audio ? 'active' : 'inactive'}`}
                    onClick={handleToggleAudio}
                    title={mediaState.audio ? 'Mute microphone' : 'Unmute microphone'}
                >
                    🎤
                </button>

                <button
                    className={`control-btn ${mediaState.screenShare ? 'active' : 'inactive'}`}
                    onClick={handleScreenShare}
                    title={mediaState.screenShare ? 'Stop screen share' : 'Start screen share'}
                >
                    🖥️
                </button>

                <div className="participant-count">
                    {participants.length + 1} participant{participants.length !== 0 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};

// Component for individual participant video
const ParticipantVideo = ({ participant }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (participant.stream && videoRef.current) {
            videoRef.current.srcObject = participant.stream;
        }
    }, [participant.stream]);

    return (
        <div className="video-participant remote">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`video-element ${!participant.videoEnabled ? 'video-disabled' : ''}`}
            />
            <div className="participant-info">
                <span className="participant-name">{participant.userInfo?.name}</span>
                <div className="media-indicators">
                    {!participant.videoEnabled && <span className="indicator video-off">📹</span>}
                    {!participant.audioEnabled && <span className="indicator audio-off">🎤</span>}
                    {participant.screenSharing && <span className="indicator screen-share">🖥️</span>}
                </div>
            </div>
        </div>
    );
};

export default VideoConference;