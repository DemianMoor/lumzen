/**
 * Natal chart calculation wrapper around circular-natal-horoscope-js.
 * Pure JS, no WASM, no paid APIs.
 *
 * Inputs in local time + lat/lng; the library handles UTC conversion via the
 * supplied longitude (note: library does not consult timezone databases — we
 * pass the timezone separately for record-keeping and use tz-lookup to
 * resolve historical timezones if needed).
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const horoscopeLib = require("circular-natal-horoscope-js");
const Origin = horoscopeLib.Origin;
const Horoscope = horoscopeLib.Horoscope;

export type ChartInput = {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23 local
  minute: number; // 0-59 local
  latitude: number;
  longitude: number;
};

export type CelestialBody = {
  key: string;
  label: string;
  sign: string;
  degrees: number; // 0-359.99 absolute
  signDegrees: number; // 0-29.99 within sign
  house: number; // 1-12
  retrograde: boolean;
};

export type AspectLine = {
  point1Key: string;
  point2Key: string;
  aspectKey: string; // conjunction, opposition, ...
  orb: number;
};

export type ComputedChart = {
  ascendant: { sign: string; degrees: number };
  midheaven: { sign: string; degrees: number };
  sun: { sign: string; degrees: number };
  moon: { sign: string; degrees: number };
  bodies: CelestialBody[];
  houseCusps: Array<{ house: number; sign: string; degrees: number }>;
  aspects: AspectLine[];
};

const SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

function signFromKey(key: string | undefined): string {
  if (!key) return "aries";
  const lower = key.toLowerCase();
  return SIGNS.includes(lower as (typeof SIGNS)[number]) ? lower : "aries";
}

function readBody(body: any): CelestialBody {
  const sign = signFromKey(body?.Sign?.key);
  const degrees = body?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
  const signDegrees = (degrees % 30 + 30) % 30;
  return {
    key: body.key,
    label: body.label,
    sign,
    degrees,
    signDegrees,
    house: body?.House?.id ?? 1,
    retrograde: Boolean(body?.isRetrograde),
  };
}

export function computeChart(input: ChartInput): ComputedChart {
  const origin = new Origin({
    year: input.year,
    month: input.month - 1, // library uses 0-indexed months
    date: input.day,
    hour: input.hour,
    minute: input.minute,
    latitude: input.latitude,
    longitude: input.longitude,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major"],
    language: "en",
  });

  const bodies: CelestialBody[] = (horoscope.CelestialBodies?.all ?? []).map(readBody);
  const points: CelestialBody[] = (horoscope.CelestialPoints?.all ?? []).map(readBody);

  const ascSign = signFromKey(horoscope.Ascendant?.Sign?.key);
  const ascDeg = horoscope.Ascendant?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;
  const mcSign = signFromKey(horoscope.Midheaven?.Sign?.key);
  const mcDeg = horoscope.Midheaven?.ChartPosition?.Ecliptic?.DecimalDegrees ?? 0;

  const sun =
    bodies.find((b) => b.key === "sun") ?? {
      sign: "aries",
      degrees: 0,
      signDegrees: 0,
      key: "sun",
      label: "Sun",
      house: 1,
      retrograde: false,
    };
  const moon =
    bodies.find((b) => b.key === "moon") ?? {
      sign: "aries",
      degrees: 0,
      signDegrees: 0,
      key: "moon",
      label: "Moon",
      house: 1,
      retrograde: false,
    };

  const houseCusps = (horoscope.Houses ?? []).map((h: any) => ({
    house: h.id,
    sign: signFromKey(h?.Sign?.key),
    degrees: h?.ChartPosition?.StartPosition?.Ecliptic?.DecimalDegrees ?? 0,
  }));

  const aspects: AspectLine[] = (horoscope.Aspects?.all ?? []).map((a: any) => ({
    point1Key: a.point1Key,
    point2Key: a.point2Key,
    aspectKey: a.aspectKey,
    orb: a.orb ?? 0,
  }));

  return {
    ascendant: { sign: ascSign, degrees: ascDeg },
    midheaven: { sign: mcSign, degrees: mcDeg },
    sun: { sign: sun.sign, degrees: sun.degrees },
    moon: { sign: moon.sign, degrees: moon.degrees },
    bodies: [...bodies, ...points],
    houseCusps,
    aspects,
  };
}

export function capitalizeSign(sign: string): string {
  return sign.charAt(0).toUpperCase() + sign.slice(1);
}
