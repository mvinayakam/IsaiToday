import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertTagSchema } from "@shared/schema";

export async function GET() {
  try {
    const tags = await storage.getAllTags();
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ message: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertTagSchema.parse({ name: body.name });
    const existing = await storage.getTagByName(validatedData.name);
    if (existing) return NextResponse.json(existing);
    const tag = await storage.createTag(validatedData);
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create tag" }, { status: 500 });
  }
}
