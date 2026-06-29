import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { db } = await import("@/db");
    const { progress } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const userProgress = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, session.user.id));

    return NextResponse.json(userProgress);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { courseSlug, lessonSlug, completed } = await req.json();
    const { db } = await import("@/db");
    const { progress } = await import("@/db/schema");

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
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
