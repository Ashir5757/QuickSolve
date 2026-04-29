"use server"

import  prisma  from "@/lib/prisma";

export async function getAllStudents() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true, // This brings in the name, email, and imageUrl from the User table
      },
    });
    return students;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}