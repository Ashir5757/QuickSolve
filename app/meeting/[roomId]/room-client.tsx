'use client';

import { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from '@livekit/components-react';
import '@livekit/components-styles';

export default function MeetingRoomClient({ roomId, userName }: { roomId: string, userName: string }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    // Fetch the token from our API route
    (async () => {
      try {
        const res = await fetch(`/api/livekit?room=${roomId}&username=${userName}`);
        const data = await res.json();
        setToken(data.token);
      } catch (e) {
        console.error("Failed to fetch token:", e);
      }
    })();
  }, [roomId, userName]);

  if (!token) return <div className="flex h-screen items-center justify-center">Authenticating...</div>;
  return (
    <div className="h-screen w-full bg-background">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        data-lk-theme="default"
      >
        {/* Full-screen video conference UI */}
        <VideoConference />
        
        {/* Required for audio playback */}
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}