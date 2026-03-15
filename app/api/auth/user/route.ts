import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { z } from "zod";

export async function GET() {
  const { userId, error } = await requireUser();
  if (error) return error;

  const user = await storage.getUser(userId!);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const { userId, error } = await requireUser();
  if (error) return error;

  const updateSchema = z.object({
    firstName: z.string().trim().nullable().optional(),
    lastName: z.string().trim().nullable().optional(),
    profileImageUrl: z.string().url().nullable().optional().or(z.literal("")),
  });

  try {
    const body = await req.json();
    const validated = updateSchema.parse(body);
    const updatedUser = await storage.updateUser(userId!, {
      firstName: validated.firstName === "" ? null : validated.firstName,
      lastName: validated.lastName === "" ? null : validated.lastName,
      profileImageUrl: validated.profileImageUrl === "" ? null : validated.profileImageUrl,
    });
    return NextResponse.json(updatedUser);
  } catch (err: any) {
    if (err.message === "User not found") return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "Failed to update user profile" }, { status: 500 });
  }
}
