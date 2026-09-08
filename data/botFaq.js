export const botFaq = [
  {
    id: "faq-1",
    keywords: ["brokerage", "commission", "fee"],
    question: "How does brokerage work?",
    answer:
      "Brokerage in Dubai is typically 2% of the sale price for buy transactions, and one month's rent for rental transactions. Exact terms can vary by listing.",
  },
  {
    id: "faq-2",
    keywords: ["documents", "papers", "buy property", "requirements"],
    question: "What documents do I need to buy property in Dubai?",
    answer:
      "You'll generally need a valid passport, Emirates ID (if a resident), proof of funds, and a signed Memorandum of Understanding (MOU / Form F) for the transaction.",
  },
  {
    id: "faq-3",
    keywords: ["foreigner", "expat", "can i buy", "non-resident"],
    question: "Can foreigners buy property in Dubai?",
    answer:
      "Yes — foreigners can buy freehold property in designated freehold areas of Dubai, such as Dubai Marina, Downtown Dubai, Palm Jumeirah, and Business Bay.",
  },
  {
    id: "faq-4",
    keywords: ["freehold", "leasehold", "difference"],
    question: "What's the difference between freehold and leasehold?",
    answer:
      "Freehold means full ownership of the property and land indefinitely. Leasehold means you have rights to use the property for a fixed term (often up to 99 years) without owning the land.",
  },
  {
    id: "faq-5",
    keywords: ["site visit", "schedule", "viewing", "tour"],
    question: "How do I schedule a site visit?",
    answer:
      "Open any property's details page and tap 'Contact Agent / Enquire' — the agent will help you schedule a convenient viewing time.",
  },
  {
    id: "faq-6",
    keywords: ["negotiable", "negotiate", "lower price", "discount"],
    question: "Is the price negotiable?",
    answer:
      "Many listings do allow some negotiation. The best way to find out is to enquire directly on the property page and ask the agent.",
  },
];

export function matchFaq(message) {
  const text = message.toLowerCase();
  return botFaq.find((faq) => faq.keywords.some((kw) => text.includes(kw)));
}
