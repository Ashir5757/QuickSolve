"use server"

import prisma from "@/lib/prisma"; // Adjust this path to your prisma client

export async function getAvailableTeachers() {
  try {
    const teachers = await prisma.teacher.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        user: true, // This gets the name and email from the User table
      },
    });
    const formattedTeachers = teachers.map(teacher => ({
      ...teacher,
      hourlyRate: teacher.hourlyRate.toNumber()
    }));
    return formattedTeachers;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}