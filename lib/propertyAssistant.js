import { bedroomLabel, formatPrice } from "@/lib/format";

export function propertySummaryLine(property) {
  return `${property.title} in ${property.community}, ${property.city} — ${formatPrice(
    property
  )}, offering ${bedroomLabel(property.bedrooms)} across ${property.areaSqft.toLocaleString()} sq. ft.`;
}

export function explainProperty(property) {
  const purpose = property.purpose === "sale" ? "available for sale" : "available for rent";
  const amenityList = property.amenities.join(", ");

  return `This ${property.type.toLowerCase()} is ${purpose} in ${property.community}, ${property.city}, priced at ${formatPrice(
    property
  )}. It offers ${bedroomLabel(property.bedrooms)} and ${property.bathrooms} bathroom${
    property.bathrooms === 1 ? "" : "s"
  } across ${property.areaSqft.toLocaleString()} sq. ft., finished to a ${property.furnishing.toLowerCase()} standard. ${
    property.description
  } Amenities include ${amenityList}.`;
}

export function answerPropertyQuestion(property, question) {
  const q = question.toLowerCase();

  if (/price|cost|how much|aed|budget/.test(q)) {
    return `${property.title} is priced at ${formatPrice(property)}${
      property.purpose === "rent" ? " per year" : ""
    }.`;
  }
  if (/bedroom|bhk|how many room/.test(q)) {
    return `This property has ${bedroomLabel(property.bedrooms)} and ${property.bathrooms} bathroom${
      property.bathrooms === 1 ? "" : "s"
    }.`;
  }
  if (/bathroom/.test(q)) {
    return `It has ${property.bathrooms} bathroom${property.bathrooms === 1 ? "" : "s"}.`;
  }
  if (/amenit|feature|facility|facilities/.test(q)) {
    return `Amenities include: ${property.amenities.join(", ")}.`;
  }
  if (/sq ?ft|square feet|built.?up|floor area/.test(q)) {
    return `The built-up area is ${property.areaSqft.toLocaleString()} sq. ft.`;
  }
  if (/location|where|address|community/.test(q)) {
    return `It's located in ${property.community}, ${property.city}.`;
  }
  if (/furnish/.test(q)) {
    return `This property is ${property.furnishing.toLowerCase()}.`;
  }
  if (/type|villa|apartment|townhouse|what kind/.test(q)) {
    return `It's a ${property.type} listed ${property.purpose === "sale" ? "for sale" : "for rent"}.`;
  }
  if (/special|unique|why|highlight/.test(q)) {
    return property.description;
  }
  if (/agent|contact|call|whatsapp|reach/.test(q)) {
    return "You can reach our Verified Listing Partner directly using the Contact Agent button on the left, and they'll get back to you shortly.";
  }
  if (/spec|detail|summary|overview/.test(q)) {
    return propertySummaryLine(property);
  }
  if (/photo|image|picture|gallery/.test(q)) {
    return `This listing has ${property.images.length} photo${
      property.images.length === 1 ? "" : "s"
    } — browse them in the gallery at the top of the page.`;
  }
  if (/available|status|posted|when/.test(q)) {
    const posted = new Date(property.postedOn).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `This property was listed on ${posted} and is currently ${
      property.purpose === "sale" ? "available for sale" : "available for rent"
    }.`;
  }

  return `I couldn't find an exact answer for that. You can ask me about the price, bedrooms, amenities, location, size, or how to contact the agent for ${property.title}.`;
}
