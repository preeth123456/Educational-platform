import React, { useEffect, useRef } from 'react';

interface VideoConferenceRoomProps {
  meetingId: string;
  userName: string;
  isHost: boolean;
  onClose: () => void;
}

const VideoConferenceRoom: React.FC<VideoConferenceRoomProps> = ({ 
  meetingId, 
  userName, 
  isHost, 
  onClose 
}) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApi = useRef<any>(null);

  useEffect(() => {
    if (jitsiContainerRef.current) {
      // Load Jitsi Meet API
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initializeJitsi;
      document.head.appendChild(script);

      return () => {
        if (jitsiApi.current) {
          jitsiApi.current.dispose();
        }
        document.head.removeChild(script);
      };
    }
  }, [meetingId]);

  const initializeJitsi = () => {
    if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
      const options = {
        roomName: meetingId,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: userName
        },
        configOverwrite: {
          startWithAudioMuted: !isHost,
          startWithVideoMuted: !isHost,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ],
          SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          SHOW_CHROME_EXTENSION_BANNER: false
        }
      };

      jitsiApi.current = new window.JitsiMeetExternalAPI('meet.jit.si', options);

      // Event listeners
      jitsiApi.current.addEventListener('videoConferenceLeft', () => {
        onClose();
      });

      jitsiApi.current.addEventListener('participantLeft', (participant: any) => {
        console.log('Participant left:', participant);
      });

      jitsiApi.current.addEventListener('participantJoined', (participant: any) => {
        console.log('Participant joined:', participant);
      });
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: 99999,
      backgroundColor: '#000'
    }}>
      <div 
        ref={jitsiContainerRef} 
        style={{ width: '100%', height: '100%' }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 100000
        }}
      >
        Leave Meeting
      </button>
    </div>
  );
};

export default VideoConferenceRoom;