import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardTrafficDirector() {
 
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const role = user.publicMetadata?.role as string | undefined;

  if (!role) {
   
    redirect('/onboarding');
  } else if (role === 'student') {
    redirect('/dashboard/student');
  } else if (role === 'tutor') {
    redirect('/dashboard/tutor');
  } else {
    
    redirect('/onboarding');
  }
}