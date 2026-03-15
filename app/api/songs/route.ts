import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertSongSchema } from "@shared/schema";

export async function GET() {
  try {
    const songs = await storage.getAllSongs();
    return NextResponse.json(songs);
  } catch {
    return NextResponse.json({ message: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
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

    const validatedData = insertSongSchema.parse({ ...body, addedBy: userId });

    const existing = await storage.getSongByYoutubeId(validatedData.youtubeId);
    if (existing) return NextResponse.json(existing);

    const song = await storage.createSong(validatedData);
    return NextResponse.json(song, { status: 201 });
  } catch (err: any) {
    console.error("Error creating song:", err);
    return NextResponse.json({ message: "Failed to create song" }, { status: 500 });
  }
}
