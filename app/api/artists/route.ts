import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertArtistSchema } from "@shared/schema";

export async function POST(req: Request) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertArtistSchema.parse({ name: body.name });
    const existing = await storage.getArtistByName(validatedData.name);
    if (existing) return NextResponse.json(existing);
    const artist = await storage.createArtist(validatedData);
    return NextResponse.json(artist, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create artist" }, { status: 500 });
  }
}
