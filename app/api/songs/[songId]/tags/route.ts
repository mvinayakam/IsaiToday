import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: { songId: string } }) {
  try {
    const songTagRows = await storage.getSongTags(params.songId);
    const tags = await Promise.all(songTagRows.map((st) => storage.getTag(st.tagId)));
    return NextResponse.json(tags.filter(Boolean));
  } catch {
    return NextResponse.json({ message: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { songId: string } }) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.tagId || typeof body.tagId !== "string") {
      return NextResponse.json({ message: "Invalid tagId" }, { status: 400 });
    }
    const song = await storage.getSong(params.songId);
    if (!song) return NextResponse.json({ message: "Song not found" }, { status: 404 });

    await storage.addTagToSong({ songId: params.songId, tagId: body.tagId });
    return NextResponse.json({ message: "Tag linked to song" }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes("duplicate") || err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "Tag already linked to song" });
    }
    return NextResponse.json({ message: "Failed to link tag to song" }, { status: 500 });
  }
}
