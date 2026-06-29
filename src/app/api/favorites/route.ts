import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const userFavorites = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, session.user.id));

  return NextResponse.json(userFavorites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { courseSlug, lessonSlug, lessonTitle, action } = await req.json();

  if (action === "remove") {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, session.user.id),
          eq(favorites.courseSlug, courseSlug),
          eq(favorites.lessonSlug, lessonSlug)
        )
      );
  } else {
    await db
      .insert(favorites)
      .values({
        userId: session.user.id,
        courseSlug,
        lessonSlug,
        lessonTitle,
      })
      .onConflictDoNothing();
  }

  return NextResponse.json({ success: true });
}
