import MeetingRoomClient from './room-client';

export default async function MeetingPage({ params }: { params: Promise<{ roomId: string }> }) {
  const resolvedParams = await params;
  
  // Create a random user for testing (e.g., "Student_482")
  const randomId = Math.floor(Math.random() * 1000);
  const user = { name: `Student_${randomId}` }; 

  return (
    <main className="h-screen w-full bg-background">
      <MeetingRoomClient 
        roomId={resolvedParams.roomId} 
        userName={user.name} 
      />
    </main>
  );
}