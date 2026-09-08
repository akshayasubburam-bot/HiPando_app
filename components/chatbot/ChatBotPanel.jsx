"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./ChatBotPanel.module.css";
import { useChatBot } from "./ChatBotProvider";
import ChatMessage from "./ChatMessage";
import ChatTypingIndicator from "./ChatTypingIndicator";
import ChatInput from "./ChatInput";

export default function ChatBotPanel() {
  const { isOpen, close, messages, isTyping } = useChatBot();
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.panel} role="dialog" aria-label="Hi Pando Assistant">
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.avatar}>
            <Image src="/images/logo-mascot.png" alt="" width={34} height={34} />
          </div>
          <div>
            <div className={styles.name}>Hi Pando Assistant</div>
            <div className={styles.status}>
              <span className={styles.statusDot} /> Online
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={close}
            aria-label="Minimize chat"
          >
            –
          </button>
          <button type="button" className={styles.iconBtn} onClick={close} aria-label="Close chat">
            ×
          </button>
        </div>
      </div>

      <div className={styles.messageList} ref={listRef}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <ChatTypingIndicator />}
      </div>

      <ChatInput />
    </div>
  );
}
