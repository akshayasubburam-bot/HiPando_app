"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";
import { localities } from "@/data/localities";
import { properties } from "@/data/properties";

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Plot", "Commercial"];
const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4+"];

const ALL_LOCATIONS = Array.from(
  new Set([...localities.map((l) => l.name), ...properties.map((p) => p.community)])
);

export default function SearchBar({
  variant = "hero",
  initialLocation = "",
  initialPurpose = "sale",
  initialType = "",
  initialBedroom = "",
  showChips = true,
  onSearch,
}) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [purpose, setPurpose] = useState(initialPurpose);
  const [type, setType] = useState(initialType);
  const [bedroom, setBedroom] = useState(initialBedroom);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeout = useRef(null);

  const suggestions = useMemo(() => {
    if (!location.trim()) return ALL_LOCATIONS.slice(0, 6);
    return ALL_LOCATIONS.filter((loc) =>
      loc.toLowerCase().includes(location.toLowerCase())
    ).slice(0, 6);
  }, [location]);

  function runSearch(overrides = {}) {
    const next = {
      location: overrides.location ?? location,
      purpose: overrides.purpose ?? purpose,
      type: overrides.type ?? type,
      bedroom: overrides.bedroom ?? bedroom,
    };

    if (onSearch) {
      onSearch(next);
      return;
    }

    const params = new URLSearchParams();
    if (next.location) params.set("location", next.location);
    if (next.purpose) params.set("purpose", next.purpose);
    if (next.type) params.set("type", next.type);
    if (next.bedroom) params.set("bedroom", next.bedroom);
    router.push(`/search?${params.toString()}`);
  }

  const isHero = variant === "hero";

  return (
    <div className={`${styles.bar} ${isHero ? styles.barHero : styles.barCompact}`}>
      <div className={styles.toggleRow}>
        {["sale", "rent"].map((p) => (
          <button
            key={p}
            type="button"
            className={`${styles.toggle} ${purpose === p ? styles.toggleActive : ""}`}
            onClick={() => {
              setPurpose(p);
              runSearch({ purpose: p });
            }}
          >
            {p === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      <div className={`${styles.fields} ${!isHero ? styles.fieldsCompact : ""}`}>
        <div className={styles.field}>
          <span className={styles.fieldIcon}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 15s5-4.4 5-8.5A5 5 0 0 0 3 6.5C3 10.6 8 15 8 15Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="8" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
          <input
            className={styles.input}
            placeholder="Search Dubai Marina, Downtown Dubai, Business Bay..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              blurTimeout.current = setTimeout(() => setShowSuggestions(false), 120);
            }}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((s) => (
                <div
                  key={s}
                  className={styles.suggestionItem}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLocation(s);
                    setShowSuggestions(false);
                    runSearch({ location: s });
                  }}
                >
                  📍 {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <select
            className={styles.select}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              runSearch({ type: e.target.value });
            }}
          >
            <option value="">All property types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className={styles.searchBtn} onClick={() => runSearch()}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5.2" stroke="white" strokeWidth="1.6" />
            <path d="M11 11L15 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Search
        </button>
      </div>

      {isHero && showChips && (
        <div className={styles.chips}>
          {BEDROOM_OPTIONS.map((b) => (
            <button
              key={b}
              type="button"
              className={`${styles.chip} ${bedroom === b ? styles.chipActive : ""}`}
              onClick={() => {
                const next = bedroom === b ? "" : b;
                setBedroom(next);
                runSearch({ bedroom: next });
              }}
            >
              {b}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
