import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") ?? "";
    if (!query.trim()) return NextResponse.json([]);
    const albums = await storage.searchAlbums(query);
    return NextResponse.json(albums);
  } catch {
    return NextResponse.json({ message: "Failed to search albums" }, { status: 500 });
  }
}
