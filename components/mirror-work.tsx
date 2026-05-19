"use client";

import { useEffect, useRef, useState } from "react";

type Affirmation = {
  id: string;
  text: string;
};

const SECONDS_PER = 30;

export function MirrorWork({
  affirmations,
  onComplete,
}: {
  affirmations: Affirmation[];
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(SECONDS_PER);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopStream();
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setStarted(true);
      setIndex(0);
      setRemaining(SECONDS_PER);
      intervalRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIndex((i) => {
              const next = i + 1;
              if (next >= Math.min(affirmations.length, 5)) {
                finish();
                return i;
              }
              return next;
            });
            return SECONDS_PER;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError(
        "Camera permission was not granted. The mirror practice works without the camera too — read each affirmation aloud.",
      );
      setStarted(true);
      setIndex(0);
      setRemaining(SECONDS_PER);
      intervalRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            setIndex((i) => {
              const next = i + 1;
              if (next >= Math.min(affirmations.length, 5)) {
                finish();
                return i;
              }
              return next;
            });
            return SECONDS_PER;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }

  function finish() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    stopStream();
    setStarted(false);
    onComplete();
  }

  if (!started) {
    return (
      <div className="text-center space-y-6">
        <p className="font-serif italic text-[#8f8daa] max-w-xl mx-auto">
          Five affirmations, thirty seconds each, eyes on your own eyes. The camera
          stays on your device — nothing is recorded or sent.
        </p>
        {error && (
          <p className="font-sans text-sm text-[#ef4444]" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={start}
          className="px-6 py-3 rounded-full bg-[#c4a35a] text-[#06060f] font-sans text-sm font-medium hover:brightness-110 transition-all"
        >
          Begin mirror practice ✦
        </button>
      </div>
    );
  }

  const current = affirmations[index];

  return (
    <div className="space-y-6">
      <div className="relative mx-auto rounded-2xl overflow-hidden" style={{ maxWidth: 640 }}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-auto bg-[#06060f]"
          style={{ transform: "scaleX(-1)", aspectRatio: "4 / 3" }}
        />
        <div
          className="absolute inset-0 flex items-end justify-center p-6"
          style={{
            background:
              "linear-gradient(to top, rgba(6,6,15,0.85), transparent 60%)",
          }}
        >
          <div className="text-center">
            <p className="font-serif italic text-xl md:text-2xl text-[#f0eff8] leading-relaxed max-w-xl">
              {current?.text}
            </p>
            <p className="mt-3 font-mono text-xs text-[#c4a35a]">
              {remaining}s · {index + 1} of {Math.min(affirmations.length, 5)}
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={finish}
        className="block mx-auto font-sans text-xs text-[#8f8daa] hover:text-[#c4a35a]"
      >
        End early
      </button>
    </div>
  );
}
