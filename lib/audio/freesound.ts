/**
 * Freesound API wrapper. Used for sourcing/curating new CC-licensed tracks
 * at admin time. Per-track listening is served from the cached audio_tracks
 * row's stream_url; we do NOT call Freesound on every page view.
 *
 * Docs: https://freesound.org/docs/api/
 */

const BASE = "https://freesound.org/apiv2";

export type FreesoundSearchResult = {
  id: number;
  name: string;
  duration: number;
  previews: {
    "preview-hq-mp3": string;
    "preview-lq-mp3": string;
  };
  license: string;
  tags: string[];
  username: string;
};

export async function searchFreesound(
  query: string,
  pageSize = 20,
): Promise<FreesoundSearchResult[]> {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) {
    throw new Error("FREESOUND_API_KEY not configured");
  }

  const url = new URL(`${BASE}/search/text/`);
  url.searchParams.set("query", query);
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set(
    "fields",
    "id,name,duration,previews,license,tags,username",
  );
  url.searchParams.set("filter", "license:\"Creative Commons 0\" OR license:\"Attribution\"");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Token ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`freesound search failed: ${res.status}`);
  }

  const data = (await res.json()) as { results: FreesoundSearchResult[] };
  return data.results ?? [];
}
