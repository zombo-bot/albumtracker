// Lowercase and drop tags like (Deluxe) and punctuation so titles compare fairly
const norm = (s = "") =>
  s.toLowerCase().replace(/\(.*?\)|\[.*?\]/g, "").replace(/[^a-z0-9]/g, "");

export async function findYoutubeVideoId(title, artist) {
  const res = await fetch(`/api/youtube?q=${encodeURIComponent(`${artist} ${title} full album`)}`);
  if (!res.ok) return null;

  const { videos = [] } = await res.json();
  const t = norm(title);
  const a = norm(artist);

  // Only accept a confident match: the video title should contain both the artist and album name
  const match = videos.find((v) => {
    const vt = norm(v.title);
    return vt.includes(a) && vt.includes(t);
  });

  return match?.id ?? null;
}
