import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function GET(_req: Request, { params }: { params: { songId: string } }) {
  try {
    const artists = await storage.getSongArtists(params.songId);
    return NextResponse.json(artists);
  } catch {
    return NextResponse.json({ message: "Failed to fetch artists" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { songId: string } }) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    if (!body.artistId || typeof body.artistId !== "string") {
      return NextResponse.json({ message: "Invalid artistId" }, { status: 400 });
    }
    const song = await storage.getSong(params.songId);
    if (!song) return NextResponse.json({ message: "Song not found" }, { status: 404 });

    await storage.addArtistToSong({ songId: params.songId, artistId: body.artistId });
    return NextResponse.json({ message: "Artist linked to song" }, { status: 201 });
  } catch (err: any) {
    if (err.message?.includes("duplicate") || err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "Artist already linked to song" });
    }
    return NextResponse.json({ message: "Failed to link artist to song" }, { status: 500 });
  }
}
