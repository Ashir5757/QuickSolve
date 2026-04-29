'use server'

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

// 1. Add studentId to the function parameters
export async function startMeeting(teacherId: string, studentId: string) {
  const roomId = uuidv4(); 

  await prisma.meeting.create({
    data: {
      roomId: roomId,
      teacherId: teacherId,
      studentId: studentId, 
      status: "ACTIVE",
    }
  });

  redirect(`/meeting/${roomId}`);
}