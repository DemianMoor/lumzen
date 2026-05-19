import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdmin } from "@/lib/supabase";
import { computeChart } from "@/lib/astrology/ephemeris";
import { geocodeCity } from "@/lib/astrology/geocoding";
import tzLookup from "tz-lookup";

export const dynamic = "force-dynamic";

type NatalRequest = {
  name?: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string | null; // HH:mm (24h)
  birthCity?: string; // free text
  latitude?: number;
  longitude?: number;
  timezone?: string;
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as NatalRequest | null;
  if (!body?.birthDate) {
    return NextResponse.json({ error: "birthDate required" }, { status: 400 });
  }

  let lat = body.latitude;
  let lng = body.longitude;
  let resolvedCity = body.birthCity ?? null;

  if ((lat === undefined || lng === undefined) && body.birthCity) {
    const results = await geocodeCity(body.birthCity);
    if (results.length === 0) {
      return NextResponse.json(
        { error: "city not found" },
        { status: 404 },
      );
    }
    lat = results[0].lat;
    lng = results[0].lng;
    resolvedCity = results[0].name;
  }

  if (lat === undefined || lng === undefined) {
    return NextResponse.json(
      { error: "latitude and longitude (or birthCity) required" },
      { status: 400 },
    );
  }

  const [year, month, day] = body.birthDate.split("-").map((n) => parseInt(n, 10));
  const [hour, minute] = (body.birthTime ?? "12:00")
    .split(":")
    .map((n) => parseInt(n, 10));

  const timezone = body.timezone ?? safeTzLookup(lat, lng) ?? "UTC";

  const chart = computeChart({
    year,
    month,
    day,
    hour: Number.isFinite(hour) ? hour : 12,
    minute: Number.isFinite(minute) ? minute : 0,
    latitude: lat,
    longitude: lng,
  });

  const admin = createSupabaseAdmin();
  await admin.from("natal_charts").upsert(
    {
      user_id: user.id,
      name: body.name ?? null,
      birth_date: body.birthDate,
      birth_time: body.birthTime ?? null,
      birth_city: resolvedCity,
      birth_lat: lat,
      birth_lng: lng,
      birth_timezone: timezone,
      chart_data: chart,
      chart_svg: null,
      sun_sign: chart.sun.sign,
      moon_sign: chart.moon.sign,
      rising_sign: chart.ascendant.sign,
      ai_interpretation: null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  await admin
    .from("user_profiles")
    .update({
      sun_sign: chart.sun.sign,
      moon_sign: chart.moon.sign,
      rising_sign: chart.ascendant.sign,
    })
    .eq("id", user.id);

  return NextResponse.json({ chart, timezone, city: resolvedCity });
}

function safeTzLookup(lat: number, lng: number): string | null {
  try {
    return tzLookup(lat, lng);
  } catch {
    return null;
  }
}
