/**
 * OpenStreetMap Nominatim wrapper. Free, no API key. Requires a polite
 * User-Agent and respects 1 req/sec.
 *
 * Docs: https://nominatim.org/release-docs/develop/api/Search/
 */

export type GeocodeResult = {
  name: string;
  lat: number;
  lng: number;
  display_name: string;
};

const NOMINATIM = "https://nominatim.openstreetmap.org/search";

export async function geocodeCity(query: string): Promise<GeocodeResult[]> {
  const url = new URL(NOMINATIM);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "LumZen/1.0 (https://lumzen.co)",
      "Accept-Language": "en",
    },
    // Tell Next.js it's fine to cache geocode lookups for an hour.
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`geocode failed: ${res.status}`);
  }

  const raw = (await res.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      municipality?: string;
      country?: string;
    };
  }>;

  return raw.map((r) => {
    const a = r.address ?? {};
    const city = a.city || a.town || a.village || a.municipality || r.display_name.split(",")[0];
    return {
      name: a.country ? `${city}, ${a.country}` : city,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      display_name: r.display_name,
    };
  });
}
