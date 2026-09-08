import styles from "./ChatTypingIndicator.module.css";

export default function ChatTypingIndicator() {
  return (
    <div className={styles.bubble}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}
