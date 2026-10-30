export default async function handler(req, res) {
  const q = String(req.query?.q ?? "").trim().slice(0, 200);
  if (!q) return res.status(400).json({ error: "Missing search text." });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "YOUTUBE_API_KEY is missing. Check .env.local and restart." });
  }

  try {
    const r = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=5&q=${encodeURIComponent(q)}&key=${key}`
    );
    if (!r.ok) {
      const detail = await r.text();
      console.error("YouTube error:", r.status, detail);
      return res.status(502).json({ error: "YouTube is unavailable." });
    }

    const data = await r.json();
    const videos = (data.items ?? [])
      .map((v) => ({
        id: v.id?.videoId,
        title: v.snippet?.title ?? "",
        channel: v.snippet?.channelTitle ?? "",
      }))
      .filter((v) => v.id);

    // Search results don't change minute to minute, so cache for a day
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    return res.status(200).json({ videos });
  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
