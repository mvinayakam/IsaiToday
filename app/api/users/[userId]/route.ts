import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    const user = await storage.getUser(params.userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}
