import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { db } = await import("@/db");
    const { favorites } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, session.user.id));

    return NextResponse.json(userFavorites);
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

    const { courseSlug, lessonSlug, lessonTitle, action } = await req.json();
    const { db } = await import("@/db");
    const { favorites } = await import("@/db/schema");
    const { eq, and } = await import("drizzle-orm");

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
        .values({ userId: session.user.id, courseSlug, lessonSlug, lessonTitle })
        .onConflictDoNothing();
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
