"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { properties } from "@/data/properties";
import { botFaq, matchFaq } from "@/data/botFaq";
import { parseSearchIntent } from "@/data/botIntents";
import ChatBotButton from "./ChatBotButton";
import ChatBotPanel from "./ChatBotPanel";

const ChatBotContext = createContext(null);

const GREETING_TEXT =
  "Hi 👋 I'm the Hi Pando Assistant. I can help you find properties in Dubai, answer questions about buying or renting, or connect you with an agent. What are you looking for?";

const GREETING_REPLIES = ["Buy a property", "Rent a property", "FAQs", "Talk to an agent"];

const FAQ_TOPIC_REPLIES = botFaq.map((faq) => faq.question);

const HANDOFF_TEXT =
  "I couldn't find an exact answer for that. Would you like to talk to one of our agents?";

const HANDOFF_REPLIES = ["Talk to an agent", "Try again"];

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

function matchProperties(intent) {
  return properties
    .filter((p) => {
      if (intent.bedrooms !== null && p.bedrooms !== intent.bedrooms) return false;
      if (intent.purpose && p.purpose !== intent.purpose) return false;
      if (intent.maxPrice && p.price > intent.maxPrice) return false;
      if (intent.community && p.community !== intent.community) return false;
      return true;
    })
    .slice(0, 3);
}

function buildSearchUrl(intent) {
  const params = new URLSearchParams();
  if (intent.community) params.set("location", intent.community);
  if (intent.purpose) params.set("purpose", intent.purpose);
  if (intent.bedrooms !== null) params.set("bedroom", String(intent.bedrooms));
  if (intent.maxPrice) params.set("maxPrice", String(intent.maxPrice));
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function ChatBotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasGreetedRef = useRef(false);

  const pushMessage = useCallback((message) => {
    setMessages((prev) => [...prev, { id: nextId(), ...message }]);
  }, []);

  const respondAsBot = useCallback((responder) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      responder();
    }, 700);
  }, []);

  const respondTo = useCallback(
    (userText) => {
      const normalized = userText.trim().toLowerCase();

      if (normalized === "talk to an agent") {
        respondAsBot(() =>
          pushMessage({
            sender: "bot",
            text: "Great — you can reach our team directly and an agent will get back to you shortly.",
            agentHandoff: true,
          })
        );
        return;
      }

      if (normalized === "try again") {
        respondAsBot(() =>
          pushMessage({
            sender: "bot",
            text: "Sure, what would you like to know?",
            quickReplies: GREETING_REPLIES,
          })
        );
        return;
      }

      if (normalized === "faqs") {
        respondAsBot(() =>
          pushMessage({
            sender: "bot",
            text: "Here are a few things I can help with:",
            quickReplies: FAQ_TOPIC_REPLIES,
          })
        );
        return;
      }

      if (normalized === "buy a property" || normalized === "rent a property") {
        const purpose = normalized.startsWith("buy") ? "sale" : "rent";
        const results = matchProperties({
          bedrooms: null,
          purpose,
          maxPrice: null,
          community: null,
        });
        respondAsBot(() =>
          pushMessage({
            sender: "bot",
            text: `Here are a few properties ${purpose === "sale" ? "for sale" : "for rent"}:`,
            properties: results,
            searchUrl: buildSearchUrl({ bedrooms: null, purpose, maxPrice: null, community: null }),
            quickReplies: ["See all results"],
          })
        );
        return;
      }

      const faq = matchFaq(userText);
      const intent = parseSearchIntent(userText);

      if (intent) {
        const results = matchProperties(intent);
        respondAsBot(() => {
          if (results.length === 0) {
            pushMessage({
              sender: "bot",
              text: "I couldn't find any properties matching that. Want to see all listings instead?",
              searchUrl: buildSearchUrl(intent),
              quickReplies: ["See all results", "Talk to an agent"],
            });
            return;
          }
          pushMessage({
            sender: "bot",
            text: `Here's what I found (${results.length} match${results.length > 1 ? "es" : ""}):`,
            properties: results,
            searchUrl: buildSearchUrl(intent),
            quickReplies: ["See all results"],
          });
        });
        return;
      }

      if (faq) {
        respondAsBot(() => pushMessage({ sender: "bot", text: faq.answer }));
        return;
      }

      respondAsBot(() =>
        pushMessage({
          sender: "bot",
          text: HANDOFF_TEXT,
          quickReplies: HANDOFF_REPLIES,
        })
      );
    },
    [pushMessage, respondAsBot]
  );

  const sendMessage = useCallback(
    (text) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      pushMessage({ sender: "user", text: trimmed });
      respondTo(trimmed);
    },
    [pushMessage, respondTo]
  );

  const open = useCallback(() => {
    setIsOpen(true);
    if (!hasGreetedRef.current) {
      hasGreetedRef.current = true;
      pushMessage({
        sender: "bot",
        text: GREETING_TEXT,
        quickReplies: GREETING_REPLIES,
      });
    }
  }, [pushMessage]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen, open, close]);

  const value = {
    isOpen,
    messages,
    isTyping,
    open,
    close,
    toggle,
    sendMessage,
  };

  return (
    <ChatBotContext.Provider value={value}>
      {children}
      <ChatBotPanel />
      <ChatBotButton />
    </ChatBotContext.Provider>
  );
}

export function useChatBot() {
  const ctx = useContext(ChatBotContext);
  if (!ctx) throw new Error("useChatBot must be used within a ChatBotProvider");
  return ctx;
}
