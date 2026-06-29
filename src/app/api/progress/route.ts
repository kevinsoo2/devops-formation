import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { progress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userProgress = await db
    .select()
    .from(progress)
    .where(eq(progress.userId, session.user.id));

  return NextResponse.json(userProgress);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { courseSlug, lessonSlug, completed } = await req.json();

  await db
    .insert(progress)
    .values({
      userId: session.user.id,
      courseSlug,
      lessonSlug,
      completed,
      completedAt: completed ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: [progress.userId, progress.courseSlug, progress.lessonSlug],
      set: { completed, completedAt: completed ? new Date() : null },
    });

  return NextResponse.json({ success: true });
}
