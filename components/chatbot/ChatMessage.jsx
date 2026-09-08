import Image from "next/image";
import styles from "./ChatMessage.module.css";
import ChatQuickReplies from "./ChatQuickReplies";
import ChatPropertyMiniCard from "./ChatPropertyMiniCard";

export default function ChatMessage({ message }) {
  const isBot = message.sender === "bot";

  return (
    <div className={`${styles.row} ${isBot ? styles.rowBot : styles.rowUser}`}>
      {isBot && (
        <div className={styles.avatar}>
          <Image src="/images/logo-mascot.png" alt="" width={28} height={28} />
        </div>
      )}
      <div className={styles.column}>
        <div className={`${styles.bubble} ${isBot ? styles.bubbleBot : styles.bubbleUser}`}>
          {message.text}
        </div>

        {message.properties && message.properties.length > 0 && (
          <div className={styles.properties}>
            {message.properties.map((property) => (
              <ChatPropertyMiniCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {message.agentHandoff && (
          <a href="mailto:agent@hipando.com" className={styles.agentLink}>
            Contact an Agent
          </a>
        )}

        {message.quickReplies && message.quickReplies.length > 0 && (
          <ChatQuickReplies replies={message.quickReplies} searchUrl={message.searchUrl} />
        )}
      </div>
    </div>
  );
}
