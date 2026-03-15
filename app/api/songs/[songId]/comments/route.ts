import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { db } from "@/lib/db";
import { insertCommentSchema, comments, users, userMentions } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_req: Request, { params }: { params: { songId: string } }) {
  try {
    const commentsWithUsers = await db
      .select({ comment: comments, user: users })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.songId, params.songId))
      .orderBy(desc(comments.createdAt));

    const commentsWithMentions = await Promise.all(
      commentsWithUsers.map(async (item) => {
        const mentionedUsers = await db
          .select({ user: users })
          .from(userMentions)
          .innerJoin(users, eq(userMentions.mentionedUserId, users.id))
          .where(eq(userMentions.commentId, item.comment.id));
        return { ...item, mentionedUsers: mentionedUsers.map((m) => m.user) };
      })
    );

    return NextResponse.json(commentsWithMentions);
  } catch {
    return NextResponse.json({ message: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { songId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertCommentSchema.parse({ songId: params.songId, userId, content: body.content });
    const comment = await storage.createComment(validatedData);

    // Process @mentions
    const mentionRegex = /@([a-zA-Z0-9]+)/g;
    const mentions = Array.from(validatedData.content.matchAll(mentionRegex));
    const processedMentions = new Set<string>();

    for (const match of mentions) {
      const mentionText = match[1];
      const matchedUsers = await storage.searchUsers(mentionText);
      const matchedUser = matchedUsers.find((u) => {
        const fullName = `${u.firstName || ""}${u.lastName || ""}`.toLowerCase().replace(/\s+/g, "");
        return fullName === mentionText.toLowerCase();
      });

      if (matchedUser && !processedMentions.has(matchedUser.id)) {
        await storage.createUserMention({ commentId: comment.id, storyId: null, mentionedUserId: matchedUser.id });
        await storage.createNotification({ userId: matchedUser.id, type: "mention", commentId: comment.id, songId: params.songId, isRead: false });
        processedMentions.add(matchedUser.id);
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
  }
}
