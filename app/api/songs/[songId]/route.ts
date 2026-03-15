import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { InsertSong } from "@shared/schema";

export async function GET(_req: Request, { params }: { params: { songId: string } }) {
  try {
    const song = await storage.getSong(params.songId);
    if (!song) return NextResponse.json({ message: "Song not found" }, { status: 404 });
    return NextResponse.json(song);
  } catch {
    return NextResponse.json({ message: "Failed to fetch song" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { songId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const song = await storage.getSong(params.songId);
    if (!song) return NextResponse.json({ message: "Song not found" }, { status: 404 });
    if (song.addedBy !== userId) return NextResponse.json({ message: "You can only edit songs you added" }, { status: 403 });

    const body = await req.json();

    if (body.album && typeof body.album === "string" && body.album.trim()) {
      const albumName = body.album.trim();
      const existingAlbum = await storage.getAlbumByName(albumName);
      if (!existingAlbum) await storage.createAlbum({ name: albumName });
    }

    if (body.language && typeof body.language === "string" && body.language.trim()) {
      const languageName = body.language.trim();
      const existingLanguage = await storage.getLanguageByName(languageName);
      if (!existingLanguage) await storage.createLanguage({ name: languageName });
    }

    const updates: Partial<InsertSong> = {};
    if (body.title) updates.title = body.title;
    if (body.artist) updates.artist = body.artist;
    if (body.album !== undefined) updates.album = body.album || null;
    if (body.language !== undefined) updates.language = body.language || null;
    if (body.thumbnail) updates.thumbnail = body.thumbnail;

    const updatedSong = await storage.updateSong(params.songId, updates);
    return NextResponse.json(updatedSong);
  } catch {
    return NextResponse.json({ message: "Failed to update song" }, { status: 500 });
  }
}
