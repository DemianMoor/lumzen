"use client";

import { useMemo } from "react";

/**
 * Star field — 150 stars, three tiers, randomized positions and timing.
 * From BRAND.md §9.1.
 */
export function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: i < 100 ? 1 : i < 130 ? 1.5 : Math.random() * 1 + 2,
        opacity: i < 100 ? 0.3 : i < 130 ? 0.5 : 0.7,
        duration: Math.random() * 5 + 2,
        delay: Math.random() * 5,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            boxShadow: s.size > 2 ? "0 0 4px rgba(255,255,255,0.5)" : "none",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Nebula gradients — two large radial blurs that drift slowly behind everything.
 * From BRAND.md §9.2.
 */
export function NebulaBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute"
        style={{
          top: "-10%",
          left: "-20%",
          width: "70vw",
          height: "70vw",
          background:
            "radial-gradient(circle, rgba(107,79,160,0.18) 0%, transparent 70%)",
          animation: "nebulaDrift 25s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "-10%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, rgba(77,184,168,0.10) 0%, transparent 70%)",
          animation: "nebulaDrift 25s ease-in-out infinite alternate-reverse",
        }}
      />
    </div>
  );
}

/**
 * Lum-glow orb — blurred golden orb that orbits slowly behind the hero area.
 * From BRAND.md §9.3.
 */
export function LumGlowOrb() {
  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        top: "25%",
        left: "50%",
        width: "400px",
        height: "400px",
        background:
          "radial-gradient(circle, rgba(196,163,90,0.08) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "lumOrbit 30s linear infinite",
      }}
    />
  );
}
