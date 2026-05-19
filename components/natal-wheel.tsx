import type { ComputedChart } from "@/lib/astrology/ephemeris";

const SIGN_GLYPHS: Record<string, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

const BODY_GLYPHS: Record<string, string> = {
  sun: "☉",
  moon: "☾",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  northnode: "☊",
  southnode: "☋",
  lilith: "⚸",
  chiron: "⚷",
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#c4a35a",
  opposition: "#d4758a",
  trine: "#6bcc9e",
  square: "#8b6fc9",
  sextile: "#4db8a8",
};

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS_OUTER = 220;
const RADIUS_ZODIAC = 200;
const RADIUS_HOUSE = 160;
const RADIUS_INNER = 90;
const RADIUS_BODIES = 130;

// Convert ecliptic longitude (0 = 0° Aries) to SVG angle (0° = 9 o'clock,
// counterclockwise). Astrological convention puts 0° Aries at the left
// horizon (Ascendant) on a chart that's rotated to the natal Ascendant.
function polar(deg: number, radius: number, ascDeg: number) {
  // Rotate so the Ascendant sits at the 9-o'clock position (180°).
  const rotated = deg - ascDeg + 180;
  const rad = (rotated * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER - radius * Math.sin(rad),
  };
}

export function NatalWheel({ chart }: { chart: ComputedChart }) {
  const ascDeg = chart.ascendant.degrees;

  // Spread overlapping bodies so glyphs do not collide.
  const adjustedBodies = spreadBodies(
    chart.bodies.map((b) => ({ ...b })),
  );

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Natal chart wheel"
      style={{ maxWidth: 560 }}
    >
      <defs>
        <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#12122a" />
          <stop offset="100%" stopColor="#06060f" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r={RADIUS_OUTER} fill="url(#wheel-bg)" />

      {/* Outer ring */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS_OUTER}
        fill="none"
        stroke="rgba(196,163,90,0.35)"
        strokeWidth={1}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS_ZODIAC}
        fill="none"
        stroke="rgba(196,163,90,0.2)"
        strokeWidth={1}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS_HOUSE}
        fill="none"
        stroke="rgba(139,111,201,0.25)"
        strokeWidth={1}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS_INNER}
        fill="none"
        stroke="rgba(139,111,201,0.2)"
        strokeWidth={1}
      />

      {/* Sign segments — 12 spokes every 30° */}
      {Array.from({ length: 12 }).map((_, i) => {
        const deg = i * 30;
        const p1 = polar(deg, RADIUS_OUTER, ascDeg);
        const p2 = polar(deg, RADIUS_HOUSE, ascDeg);
        return (
          <line
            key={`sign-line-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="rgba(196,163,90,0.18)"
            strokeWidth={1}
          />
        );
      })}

      {/* Sign glyphs */}
      {Array.from({ length: 12 }).map((_, i) => {
        const sign = [
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
        ][i];
        const center = polar(i * 30 + 15, (RADIUS_OUTER + RADIUS_ZODIAC) / 2, ascDeg);
        return (
          <text
            key={`sign-${i}`}
            x={center.x}
            y={center.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#c4a35a"
            fontSize={16}
            fontFamily="Cinzel, serif"
          >
            {SIGN_GLYPHS[sign]}
          </text>
        );
      })}

      {/* House cusps */}
      {chart.houseCusps.map((cusp) => {
        const p1 = polar(cusp.degrees, RADIUS_HOUSE, ascDeg);
        const p2 = polar(cusp.degrees, RADIUS_INNER, ascDeg);
        const isAngle = cusp.house === 1 || cusp.house === 4 || cusp.house === 7 || cusp.house === 10;
        return (
          <line
            key={`cusp-${cusp.house}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={isAngle ? "rgba(196,163,90,0.65)" : "rgba(139,111,201,0.35)"}
            strokeWidth={isAngle ? 1.5 : 1}
          />
        );
      })}

      {/* House numbers */}
      {chart.houseCusps.map((cusp) => {
        const next = chart.houseCusps.find((h) => h.house === (cusp.house % 12) + 1);
        const start = cusp.degrees;
        const end = next ? next.degrees : start + 30;
        const span = ((end - start + 360) % 360) || 30;
        const mid = (start + span / 2) % 360;
        const pos = polar(mid, (RADIUS_HOUSE + RADIUS_INNER) / 2, ascDeg);
        return (
          <text
            key={`house-num-${cusp.house}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(143, 141, 170, 0.6)"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
          >
            {cusp.house}
          </text>
        );
      })}

      {/* Aspect lines (drawn before bodies so glyphs sit on top) */}
      {chart.aspects.map((aspect, i) => {
        const b1 = chart.bodies.find((b) => b.key === aspect.point1Key);
        const b2 = chart.bodies.find((b) => b.key === aspect.point2Key);
        if (!b1 || !b2) return null;
        const p1 = polar(b1.degrees, RADIUS_INNER, ascDeg);
        const p2 = polar(b2.degrees, RADIUS_INNER, ascDeg);
        const color = ASPECT_COLORS[aspect.aspectKey] ?? "rgba(255,255,255,0.15)";
        return (
          <line
            key={`aspect-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={color}
            strokeOpacity={0.45}
            strokeWidth={1}
          />
        );
      })}

      {/* Bodies */}
      {adjustedBodies.map((body) => {
        const pos = polar(body.adjustedDegrees ?? body.degrees, RADIUS_BODIES, ascDeg);
        const glyph = BODY_GLYPHS[body.key] ?? "*";
        return (
          <g key={`body-${body.key}`}>
            <circle cx={pos.x} cy={pos.y} r={10} fill="rgba(6,6,15,0.85)" />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#f0eff8"
              fontSize={14}
              fontFamily="Cinzel, serif"
            >
              {glyph}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

type AdjustedBody = ComputedChart["bodies"][number] & { adjustedDegrees?: number };

/**
 * Push overlapping bodies apart by ~5° so glyphs don't collide visually.
 * Simple greedy pass — good enough for most charts.
 */
function spreadBodies(bodies: ComputedChart["bodies"]): AdjustedBody[] {
  const sorted = [...bodies].sort((a, b) => a.degrees - b.degrees) as AdjustedBody[];
  const MIN = 6; // degrees
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].adjustedDegrees ?? sorted[i - 1].degrees;
    const cur = sorted[i].degrees;
    const delta = (cur - prev + 360) % 360;
    if (delta < MIN) {
      sorted[i].adjustedDegrees = (prev + MIN) % 360;
    } else {
      sorted[i].adjustedDegrees = cur;
    }
  }
  return sorted;
}
