import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";

export async function PUT(req: Request, { params }: { params: { songId: string; storyId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const existingStory = await storage.getSongStory(params.songId, userId!);
    if (!existingStory || existingStory.id !== params.storyId) {
      return NextResponse.json({ message: "Story not found or you don't have permission to edit it" }, { status: 404 });
    }

    const updatedStory = await storage.updateSongStory(params.storyId, body.story);
    return NextResponse.json(updatedStory);
  } catch {
    return NextResponse.json({ message: "Failed to update story" }, { status: 500 });
  }
}
