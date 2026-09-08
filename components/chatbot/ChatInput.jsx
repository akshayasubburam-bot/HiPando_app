"use client";

import { useState } from "react";
import styles from "./ChatInput.module.css";
import { useChatBot } from "./ChatBotProvider";

export default function ChatInput() {
  const { sendMessage } = useChatBot();
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    sendMessage(value);
    setValue("");
  }

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <button type="button" className={styles.iconBtn} aria-label="Voice input (coming soon)" tabIndex={-1}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="#5c6b64" strokeWidth="1.2" />
          <path d="M3 8a5 5 0 0 0 10 0M8 13v2" stroke="#5c6b64" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <input
        type="text"
        className={styles.input}
        placeholder="Ask about a property or locality…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className={styles.sendBtn} aria-label="Send message">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 8l14-6-6 14-2-6-6-2Z" fill="#ffffff" />
        </svg>
      </button>
    </form>
  );
}
