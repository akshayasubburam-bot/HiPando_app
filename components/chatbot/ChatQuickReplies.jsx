"use client";

import Link from "next/link";
import styles from "./ChatQuickReplies.module.css";
import { useChatBot } from "./ChatBotProvider";

export default function ChatQuickReplies({ replies, searchUrl }) {
  const { sendMessage } = useChatBot();

  return (
    <div className={styles.row}>
      {replies.map((reply) => {
        if (reply === "See all results" && searchUrl) {
          return (
            <Link key={reply} href={searchUrl} className={styles.chip}>
              {reply}
            </Link>
          );
        }
        return (
          <button
            key={reply}
            type="button"
            className={styles.chip}
            onClick={() => sendMessage(reply)}
          >
            {reply}
          </button>
        );
      })}
    </div>
  );
}
