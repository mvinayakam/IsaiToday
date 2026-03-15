import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function PATCH() {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    await storage.markAllNotificationsAsRead(userId!);
    return NextResponse.json({ message: "All notifications marked as read" });
  } catch {
    return NextResponse.json({ message: "Failed to mark all notifications as read" }, { status: 500 });
  }
}
