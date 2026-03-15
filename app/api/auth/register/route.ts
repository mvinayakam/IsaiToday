import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

const registerSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().default(""),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = registerSchema.parse(body);

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await storage.createUser({
      id: randomUUID(),
      email,
      firstName,
      lastName,
      profileImageUrl: null,
      passwordHash,
      role: "user",
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ message: err.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("Register error:", err);
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
