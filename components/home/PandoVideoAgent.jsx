"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PandoVideoAgent.module.css";

const CONCIERGE_LINES = [
  "Delighted to help! Handpicking a few serene waterfront homes in Dubai Marina for you right now…",
  "I can also compare rent versus buy, or check what documents you'll need as a foreign buyer.",
  "Just tell me a community, budget or number of bedrooms — I'll shortlist the best matches instantly.",
];

export default function PandoVideoAgent() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => (i + 1) % CONCIERGE_LINES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    const next = !muted;
    video.muted = next;
    setMuted(next);
    if (!next) {
      video.play().catch(() => {});
    }
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.liveBadge}>
        <span className={styles.liveDot} /> LIVE 3D AGENT
      </span>

      <button
        type="button"
        className={styles.speakerBtn}
        onClick={toggleMute}
        aria-label={muted ? "Unmute Pando" : "Mute Pando"}
        title={muted ? "Unmute Pando" : "Mute Pando"}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6h2.5L8 3v10L4.5 10H2V6Z" fill="currentColor" />
            <path d="M10.5 5.5l4 5M14.5 5.5l-4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 6h2.5L8 3v10L4.5 10H2V6Z" fill="currentColor" />
            <path d="M10.8 5.3a3.6 3.6 0 0 1 0 5.4M12.7 3.6a6.3 6.3 0 0 1 0 8.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div className={styles.speechBubble}>
        <div className={styles.speechHeader}>
          <span className={styles.sparkle}>✨</span> PANDO CONCIERGE
          <span className={styles.liveTag}>Live</span>
        </div>
        <p className={styles.speechText}>&ldquo;{CONCIERGE_LINES[lineIndex]}&rdquo;</p>
      </div>

      <video
        ref={videoRef}
        className={styles.video}
        src="/videos/pando-speaking.mp4"
        autoPlay
        loop
        playsInline
      />
    </div>
  );
}
