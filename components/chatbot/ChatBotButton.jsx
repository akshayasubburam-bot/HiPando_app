"use client";

import Image from "next/image";
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
      <Image src="/images/logo-mascot.png" alt="" width={40} height={40} className={styles.avatarImg} />
    </button>
  );
}
