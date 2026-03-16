import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ message: "Query required" }, { status: 400 });

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    // Graceful degradation — no API key, return empty results
    return NextResponse.json([]);
  }

  try {
    const youtube = google.youtube({ version: "v3", auth: apiKey });
    const res = await youtube.search.list({
      part: ["snippet"],
      q,
      type: ["video"],
      videoCategoryId: "10", // Music
      maxResults: 8,
      fields: "items(id/videoId,snippet/title,snippet/channelTitle,snippet/thumbnails/medium/url)",
    });

    const items = (res.data.items ?? [])
      .filter((i) => i.id?.videoId)
      .map((i) => ({
        youtubeId: i.id!.videoId!,
        title: i.snippet?.title ?? "",
        channelTitle: i.snippet?.channelTitle ?? "",
        thumbnail: i.snippet?.thumbnails?.medium?.url ?? `https://img.youtube.com/vi/${i.id!.videoId}/hqdefault.jpg`,
      }));

    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}
