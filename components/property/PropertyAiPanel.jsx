"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./PropertyAiPanel.module.css";
import { formatPrice } from "@/lib/format";
import { answerPropertyQuestion, explainProperty } from "@/lib/propertyAssistant";

const QUICK_ACTIONS = [
  { label: "View Property Photos", question: "Show me the property photos" },
  { label: "Show Amenities", question: "What amenities are available?" },
  { label: "Explain Pricing", question: "What is the price?" },
  { label: "Show Location", question: "Tell me about the location" },
  { label: "Show Specifications", question: "Show me the property specifications" },
  { label: "Contact Agent", question: "How can I contact the agent?" },
];

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `pchat-${idCounter}`;
}

export default function PropertyAiPanel({ property }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);
  const mutedRef = useRef(false);
  const logRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    setVoiceSupported(true);

    return () => recognition.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSpeechSupported(true);

    function pickVoice() {
      const voices = window.speechSynthesis.getVoices();
      return (
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang?.startsWith("en")) ||
        voices[0] ||
        null
      );
    }

    function speakIntro() {
      if (mutedRef.current) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(explainProperty(property));
      utterance.lang = "en-US";
      utterance.rate = 0.98;
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakIntro;
    }
    const timeout = setTimeout(speakIntro, 300);

    return () => {
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  function speak(text) {
    if (mutedRef.current || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.98;
    window.speechSynthesis.speak(utterance);
  }

  function toggleSpeaker() {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (next) window.speechSynthesis?.cancel();
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const answer = answerPropertyQuestion(property, trimmed);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), sender: "user", text: trimmed },
      { id: nextId(), sender: "pando", text: answer },
    ]);
    speak(answer);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
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

  const amenityCount = property.amenities.length;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} /> LIVE AI AGENT
        </span>
        <span className={styles.brandTag}>Pando Concierge</span>
        {speechSupported && (
          <button
            type="button"
            className={styles.speakerBtn}
            onClick={toggleSpeaker}
            aria-label={muted ? "Unmute Pando" : "Mute Pando"}
            title={muted ? "Unmute Pando" : "Mute Pando"}
          >
            {muted ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 6h2.5L8 3v10L4.5 10H2V6Z" fill="currentColor" />
                <path d="M10.5 5.5l4 5M14.5 5.5l-4 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 6h2.5L8 3v10L4.5 10H2V6Z" fill="currentColor" />
                <path d="M10.8 5.3a3.6 3.6 0 0 1 0 5.4M12.7 3.6a6.3 6.3 0 0 1 0 8.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className={styles.introRow}>
        <div className={styles.avatarWrap}>
          <Image
            src="/images/pando-agent.png"
            alt="Pando, the Hi Pando AI concierge"
            width={120}
            height={135}
            className={styles.avatar}
            priority
          />
        </div>
        <div className={styles.introBubble}>
          <p className={styles.introLead}>
            Here are the complete details of your selected property.
          </p>
          <p className={styles.introBody}>{explainProperty(property)}</p>
        </div>
      </div>

      <div className={styles.verifiedCard}>
        <div className={styles.verifiedTitle}>
          <span className={styles.verifiedDot} /> Pando Verified Specification
        </div>
        <p className={styles.verifiedText}>
          Based on the selected property, this residence is a {property.furnishing.toLowerCase()}{" "}
          {property.type.toLowerCase()} in {property.community}, priced at {formatPrice(property)},
          with {amenityCount} verified amenit{amenityCount === 1 ? "y" : "ies"}.
        </p>
        <div className={styles.chipRow}>
          <span className={styles.chip}>{property.type}</span>
          <span className={styles.chip}>{property.community}, {property.city}</span>
          <span className={styles.chip}>{property.bedrooms || "Studio"} BR</span>
          <span className={styles.chip}>{property.areaSqft.toLocaleString()} sqft</span>
          <span className={styles.chip}>{formatPrice(property)}</span>
          <span className={styles.chip}>{amenityCount} amenities</span>
          <span className={styles.chip}>
            {property.purpose === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </div>

      <div className={styles.quickActions}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className={styles.actionPill}
            onClick={() => sendMessage(action.question)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className={styles.chatSection}>
        <div className={styles.chatTitle}>Ask Pando about this property</div>
        <div className={styles.chatSubtitle}>
          Get instant answers about {property.title}.
        </div>

        <div className={styles.chatLog} ref={logRef}>
          {messages.length === 0 && (
            <div className={styles.chatEmpty}>
              Try “What are the main features of this property?” or use a quick action above.
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.chatBubble} ${
                message.sender === "user" ? styles.chatBubbleUser : styles.chatBubblePando
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <form className={styles.chatInputBar} onSubmit={handleSubmit}>
          <input
            className={styles.chatInput}
            placeholder="Ask Pando anything about this property…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {voiceSupported && (
            <button
              type="button"
              className={`${styles.micBtn} ${isListening ? styles.micActive : ""}`}
              onClick={toggleVoiceInput}
              aria-label={isListening ? "Stop voice input" : "Ask by voice"}
              title={isListening ? "Listening…" : "Ask by voice"}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="5.5" y="1" width="5" height="8" rx="2.5" fill="currentColor" />
                <path d="M3 8a5 5 0 0 0 10 0M8 13v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button type="submit" className={styles.sendBtn} aria-label="Send">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 8l14-6-6 14-2-6-6-2Z" fill="#ffffff" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
