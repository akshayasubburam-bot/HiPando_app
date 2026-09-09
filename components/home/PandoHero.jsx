"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./PandoHero.module.css";
import PandoVideoAgent from "./PandoVideoAgent";

const TRY_ASKING = [
  { emoji: "🌊", label: "Palm Jumeirah waterfront", location: "Palm Jumeirah" },
  { emoji: "🏡", label: "Dubai Hills villas", location: "Dubai Hills Estate", type: "Villa" },
  { emoji: "📈", label: "High ROI off-plan", location: "" },
  { emoji: "🏙️", label: "Downtown penthouses", location: "Downtown Dubai" },
];

export default function PandoHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      goToSearch(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setVoiceSupported(true);

    return () => recognition.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goToSearch(text, extra = {}) {
    const params = new URLSearchParams();
    if (text) params.set("location", text);
    if (extra.type) params.set("type", extra.type);
    router.push(`/search?${params.toString()}`);
  }

  function toggleVoiceInput() {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <Image src="/images/logo-mascot.png" alt="Hi Pando" width={36} height={36} />
          </span>
          <span className={styles.brandName}>Hi Pando</span>
          <span className={styles.advisorPill}>AI ADVISOR</span>
        </div>
        <Link href="/sign-in" className={`hp-btn hp-btn-primary ${styles.signInBtn}`}>
          Sign In / Register
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>
            ✨ AI Real Estate Advisor · Dubai Luxury Concierge
          </span>
          <h1 className={styles.heading}>Tell Pando what you&rsquo;re looking for.</h1>
          <p className={styles.subheading}>
            Ask anything about Dubai properties, off-market villas, or high-yield investments.
          </p>

          <form
            className={styles.searchRow}
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch(query);
            }}
          >
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search Dubai properties, areas, or ask Pando…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {voiceSupported && (
              <button
                type="button"
                className={`${styles.micBtn} ${isListening ? styles.micActive : ""}`}
                onClick={toggleVoiceInput}
                aria-label={isListening ? "Stop voice search" : "Search by voice"}
                title={isListening ? "Listening…" : "Search by voice"}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="5.5" y="1" width="5" height="8" rx="2.5" fill="currentColor" />
                  <path d="M3 8a5 5 0 0 0 10 0M8 13v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button type="submit" className={styles.askBtn}>
              Ask <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className={styles.tryRow}>
            <span className={styles.tryLabel}>Try asking:</span>
            {TRY_ASKING.map((item) => (
              <button
                key={item.label}
                type="button"
                className={styles.tryChip}
                onClick={() => goToSearch(item.location, item)}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <PandoVideoAgent />
        </div>
      </main>

      <footer className={styles.footerBar}>
        <span>
          <span className={styles.footerDot} /> Hi Pando · AI Real Estate Agent for Buyers
        </span>
        <span>✅ Dubai Land Dept. MLS &amp; Escrow Verified · Dubai, United Arab Emirates</span>
      </footer>
    </div>
  );
}
