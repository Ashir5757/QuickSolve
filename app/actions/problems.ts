'use server'

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function uploadProblem(formData: {
  subject: string;
  description: string;
  images: string[];
  grade: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    // Find the student profile linked to this Clerk User
    const student = await prisma.student.findUnique({
      where: { userId: (await prisma.user.findUnique({ where: { clerkId: userId } }))?.id }
    });

    if (!student) throw new Error("Student profile not found");

    const problem = await prisma.problem.create({
      data: {
        subject: formData.subject,
        description: formData.description,
        images: formData.images,
        grade: formData.grade,
        studentId: student.id,
      },
    });

    return { success: true, problemId: problem.id };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false };
  }
}