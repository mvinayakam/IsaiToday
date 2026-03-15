import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { insertLanguageSchema } from "@shared/schema";

export async function POST(req: Request) {
  const { error } = await requireUser();
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = insertLanguageSchema.parse({ name: body.name });
    const existing = await storage.getLanguageByName(validatedData.name);
    if (existing) return NextResponse.json(existing);
    const language = await storage.createLanguage(validatedData);
    return NextResponse.json(language, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create language" }, { status: 500 });
  }
}
