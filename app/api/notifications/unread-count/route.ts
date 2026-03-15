import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function GET() {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const count = await storage.getUnreadNotificationCount(userId!);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ message: "Failed to fetch unread count" }, { status: 500 });
  }
}
