"use client";

import styles from "./ChatBotButton.module.css";
import { useChatBot } from "./ChatBotProvider";

export default function ChatBotButton() {
  const { isOpen, toggle } = useChatBot();

  if (isOpen) return null;

  return (
    <button
      type="button"
      className={styles.fab}
      onClick={toggle}
      aria-label="Open Hi Pando Assistant"
    >
      <span className={styles.badge}>1</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H10l-4.2 3.4a.6.6 0 0 1-.98-.47V16h-.3A2.5 2.5 0 0 1 2 13.5v-6"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="9.5" r="1" fill="#ffffff" />
        <circle cx="12" cy="9.5" r="1" fill="#ffffff" />
        <circle cx="15.5" cy="9.5" r="1" fill="#ffffff" />
      </svg>
    </button>
  );
}
