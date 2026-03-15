import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertReactionSchema } from "@shared/schema";

export async function GET(_req: Request, { params }: { params: { songId: string } }) {
  try {
    const reactions = await storage.getReactionsBySongId(params.songId);
    return NextResponse.json(reactions);
  } catch {
    return NextResponse.json({ message: "Failed to fetch reactions" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { songId: string } }) {
  const { userId, error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const type = body.type || "like";

    const existing = await storage.getReaction(params.songId, userId!, type);
    if (existing) {
      await storage.deleteReaction(existing.id);
      return NextResponse.json({ action: "removed" });
    }

    const validatedData = insertReactionSchema.parse({ songId: params.songId, userId, type });
    const reaction = await storage.createReaction(validatedData);
    return NextResponse.json(reaction, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to toggle reaction" }, { status: 500 });
  }
}
