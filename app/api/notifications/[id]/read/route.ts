import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    await storage.markNotificationAsRead(params.id);
    return NextResponse.json({ message: "Notification marked as read" });
  } catch {
    return NextResponse.json({ message: "Failed to mark notification as read" }, { status: 500 });
  }
}
