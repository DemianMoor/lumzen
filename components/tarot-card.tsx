"use client";

import { useState } from "react";
import Image from "next/image";

export type TarotCardProps = {
  name: string;
  imageUrl?: string | null;
  reversed?: boolean;
  position?: string;
  faceDown?: boolean;
  onFlip?: () => void;
};

/**
 * Tarot card with a face-down → face-up flip animation.
 * Click to flip if `onFlip` is wired.
 */
export function TarotCard({
  name,
  imageUrl,
  reversed = false,
  position,
  faceDown = false,
  onFlip,
}: TarotCardProps) {
  const [flipping, setFlipping] = useState(false);

  function handleClick() {
    if (!faceDown || !onFlip) return;
    setFlipping(true);
    setTimeout(() => {
      onFlip();
    }, 400);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {position && (
        <p className="font-display text-[10px] tracking-[0.2em] uppercase text-[#c4a35a]">
          {position}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={!faceDown || !onFlip}
        className="relative w-[160px] h-[260px] rounded-lg overflow-hidden border transition-transform duration-500"
        style={{
          borderColor: "rgba(196, 163, 90, 0.3)",
          background: "rgba(26, 26, 53, 0.6)",
          transform: `${flipping ? "rotateY(180deg)" : "rotateY(0deg)"} ${reversed && !faceDown ? "rotate(180deg)" : ""}`,
          transformStyle: "preserve-3d",
          cursor: faceDown && onFlip ? "pointer" : "default",
        }}
      >
        {faceDown ? (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at center, rgba(196,163,90,0.15) 0%, transparent 70%), rgba(12,12,30,0.95)",
            }}
          >
            <div
              className="font-display text-2xl text-[#c4a35a]"
              style={{ letterSpacing: "0.2em" }}
            >
              ✦
            </div>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="160px"
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-3 text-center">
            <p className="font-serif italic text-sm text-[#f0eff8]">{name}</p>
          </div>
        )}
      </button>
      <p className="font-serif italic text-sm text-[#f0eff8] text-center max-w-[160px]">
        {name}
        {reversed && (
          <span className="block font-sans text-[10px] not-italic uppercase tracking-[0.2em] text-[#8f8daa] mt-1">
            Reversed
          </span>
        )}
      </p>
    </div>
  );
}
