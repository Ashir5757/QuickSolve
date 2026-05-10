'use server'

import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function completeStudentOnboarding(data: any) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  try {
    // We need to find the internal ID of the User first to link the Student profile
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) throw new Error("User not found in database");

    await prisma.$transaction([
      // 1. Update User Identity
      prisma.user.update({
        where: { clerkId: userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'STUDENT',
          onboardingCompleted: true,
        },
      }),
      
      // 2. Create Student Profile (Matching your schema fields)
      prisma.student.create({
        data: {
          userId: existingUser.id, // Linking via the 'id' from your User model
          grade: data.currentClass, // Map 'currentClass' to 'grade'
          // Note: academicGoals and studyRoutine were removed 
          // because they are not in your schema.prisma
        }
      })
    ]);

    // 3. Update Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'STUDENT',
        onboardingCompleted: true
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save profile. Check server logs." };
  }
}