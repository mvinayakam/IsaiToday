import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { db } from "@/lib/db";
import { comments } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function DELETE(_req: Request, { params }: { params: { commentId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const [comment] = await db.select().from(comments).where(eq(comments.id, params.commentId));
    if (!comment) return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    if (comment.userId !== userId) return NextResponse.json({ message: "Not authorized to delete this comment" }, { status: 403 });

    await storage.deleteComment(params.commentId);
    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to delete comment" }, { status: 500 });
  }
}
