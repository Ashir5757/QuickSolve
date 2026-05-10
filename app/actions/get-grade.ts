"use server"

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getStudentGradeAction() {
  const { userId } = await auth();
  if (!userId) return "";

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { studentProfile: true }
    });
    return user?.studentProfile?.grade || "";
  } catch (error) {
    console.error("Failed to fetch grade:", error);
    return "";
  }
}