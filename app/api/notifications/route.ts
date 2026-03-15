import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function GET() {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const notifications = await storage.getNotificationsByUserId(userId!);
    return NextResponse.json(notifications);
  } catch {
    return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
  }
}

// GET unread count via query param: /api/notifications?unread=true
// But we'll keep a separate route for compatibility — this handles the list
