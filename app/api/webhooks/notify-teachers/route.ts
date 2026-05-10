// app/api/webhooks/notify-teachers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // 1. Verify a secret header to ensure it's actually from Supabase
  const authHeader = req.headers.get("x-supabase-webhook-secret");
  if (authHeader !== process.env.SUPABASE_WEBHOOK_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  const { record } = payload; // The new 'Problem' row

  try {
    // 2. Fetch relevant teachers (e.g., those teaching the specific subject/grade)
    const teachers = await prisma.teacherProfile.findMany({
      where: {
        subjects: { has: record.subject },
        grades: { has: record.grade }
      },
      include: { user: true }
    });

    // 3. Logic to notify (Example: Send email or create internal Notification record)
    await Promise.all(teachers.map(teacher => 
      prisma.notification.create({
        data: {
          userId: teacher.user.id,
          message: `New ${record.subject} problem posted for ${record.grade}!`,
          link: `/dashboard/teacher/problems/${record.id}`
        }
      })
    ));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}