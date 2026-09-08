import { localities } from "@/data/localities";

// Extremely lightweight keyword parsing — replace with real NLU (Claude / GPT-4o-mini + RAG) later.
export function parseSearchIntent(message) {
  const text = message.toLowerCase();
  const bedroomMatch = text.match(/(\d+)\s*(bhk|bedroom|br)/);
  const purpose = text.includes("rent")
    ? "rent"
    : text.includes("buy") || text.includes("sale")
    ? "sale"
    : null;
  const priceMatch = text.match(/(under|below|less than)\s*([\d.]+)\s*(million|m|k)?/);

  const parsed = {
    bedrooms: bedroomMatch ? parseInt(bedroomMatch[1], 10) : null,
    purpose,
    maxPrice: priceMatch ? normalizePrice(priceMatch[2], priceMatch[3]) : null,
    community: matchKnownCommunity(text),
  };

  const looksLikeSearch =
    parsed.bedrooms !== null ||
    parsed.purpose !== null ||
    parsed.maxPrice !== null ||
    parsed.community !== null;

  return looksLikeSearch ? parsed : null;
}

function normalizePrice(value, unit) {
  const num = parseFloat(value);
  if (Number.isNaN(num)) return null;
  if (unit === "million" || unit === "m") return num * 1_000_000;
  if (unit === "k") return num * 1_000;
  return num;
}

function matchKnownCommunity(text) {
  const found = localities.find((locality) =>
    text.includes(locality.name.toLowerCase())
  );
  return found ? found.name : null;
}
