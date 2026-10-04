import { NextResponse } from "next/server";

const API = "https://www.googleapis.com/youtube/v3";

interface PlaylistItem {
  snippet: {
    title: string;
    publishedAt: string;
    resourceId: { videoId: string };
    thumbnails: Record<string, { url: string } | undefined>;
  };
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json({ error: "Missing API config" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${API}/channels?part=statistics,contentDetails&id=${channelId}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "YouTube API error" }, { status: 502 });
    }

    const data = await res.json();
    const channel = data.items?.[0];

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const { subscriberCount, viewCount, videoCount } = channel.statistics;

    return NextResponse.json({
      subscriberCount: Number(subscriberCount),
      viewCount: Number(viewCount),
      videoCount: Number(videoCount),
      videos: await latestVideos(channel.contentDetails?.relatedPlaylists?.uploads, apiKey),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// The newest uploads. The stats still go out if this part fails.
async function latestVideos(uploads: string | undefined, apiKey: string) {
  if (!uploads) return [];
  try {
    const res = await fetch(
      `${API}/playlistItems?part=snippet&maxResults=3&playlistId=${uploads}&key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return ((data.items ?? []) as PlaylistItem[]).map(({ snippet: s }) => ({
      id: s.resourceId.videoId,
      title: s.title,
      publishedAt: s.publishedAt,
      thumbnail: (s.thumbnails.maxres ?? s.thumbnails.high ?? s.thumbnails.medium ?? s.thumbnails.default)?.url ?? null,
    }));
  } catch {
    return [];
  }
}
