import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { seedDatabase } from "@/server/seed";
import { seedPlaylistSongs } from "@/server/seed-playlists";

export async function POST() {
  const { userId, error } = await requireAdmin();
  if (error) return error;

  try {
    await seedDatabase(userId!);
    await seedPlaylistSongs(userId!);
    return NextResponse.json({ message: "Database seeded successfully" });
  } catch {
    return NextResponse.json({ message: "Failed to seed database" }, { status: 500 });
  }
}
