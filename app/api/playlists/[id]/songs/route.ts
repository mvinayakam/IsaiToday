import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertPlaylistSongSchema } from "@shared/schema";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const songs = await storage.getPlaylistSongs(params.id);
    return NextResponse.json(songs);
  } catch {
    return NextResponse.json({ message: "Failed to fetch playlist songs" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertPlaylistSongSchema.parse({ playlistId: params.id, songId: body.songId, order: body.order });
    const playlistSong = await storage.addSongToPlaylist(validatedData);
    return NextResponse.json(playlistSong, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to add song to playlist" }, { status: 500 });
  }
}
