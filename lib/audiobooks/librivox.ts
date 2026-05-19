/**
 * LibriVox public JSON API wrapper. No auth, free.
 *
 * Docs: https://librivox.org/api/info
 * - audiobooks endpoint:  /api/feed/audiobooks/?id={id}&format=json&extended=1
 * - audiotracks endpoint: /api/feed/audiotracks/?project_id={id}&format=json
 */

export type LibrivoxChapter = {
  chapter_number: number;
  title: string;
  stream_url: string;
  duration_seconds: number;
};

export type LibrivoxBookExtra = {
  totalDurationSeconds: number;
};

const BASE = "https://librivox.org/api/feed";

/**
 * Fetch a book's chapter list. The /audiotracks endpoint returns each track
 * with `listen_url` and `playtime` (seconds as string).
 */
export async function fetchChapters(librivoxId: string): Promise<LibrivoxChapter[]> {
  const url = `${BASE}/audiotracks/?project_id=${encodeURIComponent(librivoxId)}&format=json`;
  const res = await fetch(url, {
    headers: { "User-Agent": "LumZen/1.0 (https://lumzen.co)" },
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`librivox chapters failed: ${res.status}`);
  }

  const raw = (await res.json()) as {
    sections?: Array<{
      section_number: string;
      title: string;
      listen_url: string;
      playtime: string;
    }>;
  };

  const sections = raw.sections ?? [];
  return sections.map((s) => ({
    chapter_number: parseInt(s.section_number, 10) || 0,
    title: s.title,
    stream_url: s.listen_url,
    duration_seconds: parseInt(s.playtime, 10) || 0,
  }));
}
