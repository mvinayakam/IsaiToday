import { NextResponse } from "next/server";
import { extractYouTubeId, fetchYouTubeMetadata } from "@/server/youtube";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url) return NextResponse.json({ message: "URL parameter is required" }, { status: 400 });

    const youtubeId = extractYouTubeId(url);
    if (!youtubeId) return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 });

    const metadata = await fetchYouTubeMetadata(youtubeId);
    if (!metadata) return NextResponse.json({ message: "Video not found or metadata unavailable" }, { status: 404 });

    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json({ message: "Failed to fetch YouTube metadata" }, { status: 500 });
  }
}
