import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertSongStorySchema } from "@shared/schema";

export async function GET(_req: Request, { params }: { params: { songId: string } }) {
  try {
    const stories = await storage.getSongStoriesBySongId(params.songId);
    return NextResponse.json(stories);
  } catch {
    return NextResponse.json({ message: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { songId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertSongStorySchema.parse({ songId: params.songId, userId, story: body.story });
    const story = await storage.createSongStory(validatedData);
    return NextResponse.json(story, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create story" }, { status: 500 });
  }
}
