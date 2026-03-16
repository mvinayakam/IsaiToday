import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { db } from "@/lib/db";
import { notifications } from "@shared/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    // Ownership check — only the notification's owner can mark it as read
    const [notification] = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.id, params.id), eq(notifications.userId, userId!)))
      .limit(1);

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    await storage.markNotificationAsRead(params.id);
    return NextResponse.json({ message: "Notification marked as read" });
  } catch {
    return NextResponse.json({ message: "Failed to mark notification as read" }, { status: 500 });
  }
}
