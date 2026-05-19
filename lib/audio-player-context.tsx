"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type AudioSource =
  | { kind: "url"; url: string }
  | { kind: "frequency"; hz: number };

export type AudioTrack = {
  id: string;
  title: string;
  subtitle?: string;
  durationSeconds: number;
  source: AudioSource;
  /** Optional callback fired the first time this track actually starts playing. */
  onFirstPlay?: () => void;
};

type State = {
  track: AudioTrack | null;
  playing: boolean;
  position: number;
  volume: number;
  loading: boolean;
};

type Actions = {
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
};

type Ctx = State & Actions;

const AudioPlayerContext = createContext<Ctx | null>(null);

const FADE_SECONDS = 0.05;
const FREQUENCY_VOLUME_MULTIPLIER = 0.3;

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [loading, setLoading] = useState(false);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const firstPlayFiredRef = useRef<Set<string>>(new Set());

  function stopFrequency() {
    const ctx = audioCtxRef.current;
    const osc = oscillatorRef.current;
    const gain = gainRef.current;
    if (ctx && osc && gain) {
      const now = ctx.currentTime;
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
        osc.stop(now + FADE_SECONDS + 0.01);
      } catch {
        // already stopped
      }
    }
    oscillatorRef.current = null;
    gainRef.current = null;
  }

  function stopAudioEl() {
    const el = audioElRef.current;
    if (el) {
      el.pause();
      el.src = "";
      el.load();
    }
  }

  function clearTicker() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const stop = useCallback(() => {
    stopFrequency();
    stopAudioEl();
    clearTicker();
    setPlaying(false);
    setPosition(0);
    setTrack(null);
    setLoading(false);
  }, []);

  const pause = useCallback(() => {
    if (!track) return;
    if (track.source.kind === "frequency") {
      const gain = gainRef.current;
      const ctx = audioCtxRef.current;
      if (gain && ctx) {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
      }
    } else {
      audioElRef.current?.pause();
    }
    clearTicker();
    setPlaying(false);
  }, [track]);

  const resume = useCallback(() => {
    if (!track) return;
    if (track.source.kind === "frequency") {
      const gain = gainRef.current;
      const ctx = audioCtxRef.current;
      if (gain && ctx) {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(
          volume * FREQUENCY_VOLUME_MULTIPLIER,
          now + FADE_SECONDS,
        );
      }
      setPlaying(true);
      startTicker();
    } else {
      const el = audioElRef.current;
      if (el) {
        void el.play().catch(() => undefined);
        setPlaying(true);
      }
    }
  }, [track, volume]);

  const toggle = useCallback(() => {
    if (!track) return;
    if (playing) pause();
    else resume();
  }, [track, playing, pause, resume]);

  const seek = useCallback((seconds: number) => {
    if (!track) return;
    if (track.source.kind === "url") {
      const el = audioElRef.current;
      if (el && Number.isFinite(seconds)) {
        el.currentTime = Math.max(0, Math.min(track.durationSeconds, seconds));
        setPosition(el.currentTime);
      }
    } else {
      const clamped = Math.max(0, Math.min(track.durationSeconds, seconds));
      setPosition(clamped);
    }
  }, [track]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolumeState(clamped);
    const el = audioElRef.current;
    if (el) el.volume = clamped;
    const gain = gainRef.current;
    const ctx = audioCtxRef.current;
    if (gain && ctx && playing) {
      gain.gain.setValueAtTime(
        clamped * FREQUENCY_VOLUME_MULTIPLIER,
        ctx.currentTime,
      );
    }
  }, [playing]);

  function startTicker() {
    clearTicker();
    intervalRef.current = setInterval(() => {
      const el = audioElRef.current;
      if (el && !el.paused) {
        setPosition(el.currentTime);
      } else {
        setPosition((p) => p + 1);
      }
    }, 1000);
  }

  const play = useCallback(
    (next: AudioTrack) => {
      stopFrequency();
      stopAudioEl();
      clearTicker();
      setPosition(0);
      setTrack(next);

      const fireFirstPlay = () => {
        if (next.onFirstPlay && !firstPlayFiredRef.current.has(next.id)) {
          firstPlayFiredRef.current.add(next.id);
          next.onFirstPlay();
        }
      };

      if (next.source.kind === "frequency") {
        if (typeof window === "undefined") return;
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
          audioCtxRef.current = new Ctor();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") void ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(next.source.hz, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(
          volume * FREQUENCY_VOLUME_MULTIPLIER,
          ctx.currentTime + FADE_SECONDS,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        if (next.durationSeconds > 0) {
          const stopAt = ctx.currentTime + next.durationSeconds;
          gain.gain.setValueAtTime(
            volume * FREQUENCY_VOLUME_MULTIPLIER,
            Math.max(ctx.currentTime, stopAt - FADE_SECONDS),
          );
          gain.gain.linearRampToValueAtTime(0, stopAt);
          osc.stop(stopAt + 0.01);
          osc.onended = () => {
            if (oscillatorRef.current === osc) {
              setPlaying(false);
              clearTicker();
            }
          };
        }

        oscillatorRef.current = osc;
        gainRef.current = gain;
        setPlaying(true);
        startTicker();
        fireFirstPlay();
        return;
      }

      // URL source
      if (typeof window === "undefined") return;
      if (!audioElRef.current) {
        audioElRef.current = new Audio();
        audioElRef.current.preload = "metadata";
      }
      const el = audioElRef.current;
      el.crossOrigin = "anonymous";
      el.src = next.source.url;
      el.volume = volume;
      setLoading(true);

      const onLoaded = () => {
        setLoading(false);
        if (el.duration && Number.isFinite(el.duration)) {
          setTrack((curr) =>
            curr && curr.id === next.id
              ? { ...curr, durationSeconds: el.duration }
              : curr,
          );
        }
      };
      const onPlay = () => {
        setPlaying(true);
        startTicker();
        fireFirstPlay();
      };
      const onPause = () => {
        setPlaying(false);
        clearTicker();
      };
      const onEnded = () => {
        setPlaying(false);
        clearTicker();
        setPosition(next.durationSeconds);
      };
      const onError = () => {
        setLoading(false);
        setPlaying(false);
        clearTicker();
      };

      el.onloadedmetadata = onLoaded;
      el.onplay = onPlay;
      el.onpause = onPause;
      el.onended = onEnded;
      el.onerror = onError;

      void el.play().catch(() => {
        onError();
      });
    },
    [volume],
  );

  useEffect(() => {
    return () => {
      stopFrequency();
      stopAudioEl();
      clearTicker();
    };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      track,
      playing,
      position,
      volume,
      loading,
      play,
      pause,
      resume,
      stop,
      toggle,
      seek,
      setVolume,
    }),
    [track, playing, position, volume, loading, play, pause, resume, stop, toggle, seek, setVolume],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer(): Ctx {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioPlayer must be used inside <AudioPlayerProvider>");
  }
  return ctx;
}
