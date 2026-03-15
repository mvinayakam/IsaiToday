import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";
    if (query.length < 2) return NextResponse.json([]);
    const users = await storage.searchUsers(query);
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Failed to search users" }, { status: 500 });
  }
}
