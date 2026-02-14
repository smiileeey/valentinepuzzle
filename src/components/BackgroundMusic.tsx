"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/bgm.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    let retryInterval: NodeJS.Timeout | null = null;

    const tryPlay = async () => {
      try {
        await audio.play();
        // success — clear retries
        if (retryInterval) {
          clearInterval(retryInterval as any);
          retryInterval = null;
        }
      } catch (e) {
        // autoplay blocked — keep retrying periodically
        if (!retryInterval) {
          retryInterval = setInterval(() => {
            audio.play().catch(() => {
              // ignore until successful
            });
          }, 2000);
        }
      }
    };

    // Try immediately
    tryPlay();

    // Also try again when page becomes visible or gains focus
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tryPlay();
      }
    };
    const onFocus = () => tryPlay();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      if (retryInterval) clearInterval(retryInterval as any);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch (e) {}
        audioRef.current = null;
      }
    };
  }, []);

  // no UI — always attempts to autoplay and will keep retrying
  return null;
}
