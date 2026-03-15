import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertAlbumSchema } from "@shared/schema";

export async function POST(req: Request) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertAlbumSchema.parse({ name: body.name });
    const existing = await storage.getAlbumByName(validatedData.name);
    if (existing) return NextResponse.json(existing);
    const album = await storage.createAlbum(validatedData);
    return NextResponse.json(album, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create album" }, { status: 500 });
  }
}
