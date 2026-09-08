import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./details.module.css";
import PropertyGallery from "@/components/PropertyGallery";
import AmenityBadge from "@/components/AmenityBadge";
import PropertyCard from "@/components/PropertyCard";
import EnquireButton from "@/components/EnquireButton";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";
import { bedroomLabel, formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return properties.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const property = properties.find((p) => p.id === params.id);
  if (!property) return { title: "Property not found — Hi Pando" };
  return { title: `${property.title} — Hi Pando` };
}

export default function PropertyDetailsPage({ params }) {
  const property = properties.find((p) => p.id === params.id);
  if (!property) notFound();

  const similar = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.community === property.community || p.type === property.type)
    )
    .slice(0, 4);

  return (
    <main className={styles.wrap}>
      <div className="hp-container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / <Link href="/search">Search</Link> / {property.title}
        </div>

        <PropertyGallery images={property.images} title={property.title} />

        <div className={styles.layout}>
          <div>
            <div className={styles.header}>
              <div>
                <span
                  className={`${styles.badge} ${
                    property.purpose === "sale" ? styles.badgeSale : styles.badgeRent
                  }`}
                >
                  {property.purpose === "sale" ? "For Sale" : "For Rent"}
                </span>
                <h1 className={styles.title}>{property.title}</h1>
                <div className={styles.location}>
                  📍 {property.community}, {property.city}
                </div>
              </div>
              <div className={styles.price}>{formatPrice(property)}</div>
            </div>

            <div className={styles.factsRow}>
              <div className={styles.fact}>
                <span className={styles.factIcon}>🛏</span>
                <span className={styles.factValue}>{bedroomLabel(property.bedrooms)}</span>
                <span className={styles.factLabel}>Bedrooms</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factIcon}>🛁</span>
                <span className={styles.factValue}>{property.bathrooms}</span>
                <span className={styles.factLabel}>Bathrooms</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factIcon}>📐</span>
                <span className={styles.factValue}>{property.areaSqft.toLocaleString()}</span>
                <span className={styles.factLabel}>Sq. Ft.</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factIcon}>🏢</span>
                <span className={styles.factValue}>{property.type}</span>
                <span className={styles.factLabel}>Property Type</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factIcon}>🛋️</span>
                <span className={styles.factValue}>{property.furnishing}</span>
                <span className={styles.factLabel}>Furnishing</span>
              </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Description</div>
              <p className={styles.description}>{property.description}</p>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Amenities</div>
              <div className={styles.amenityGrid}>
                {property.amenities.map((a) => (
                  <AmenityBadge key={a} label={a} />
                ))}
              </div>
            </div>

            <div className={styles.block}>
              <div className={styles.blockTitle}>Location</div>
              <div className={styles.mapPlaceholder}>
                Map preview — {property.community}, {property.city}
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.agentRow}>
              <div className={styles.agentAvatar}>HP</div>
              <div>
                <div className={styles.agentName}>Hi Pando Team</div>
                <div className={styles.agentRole}>Verified Listing Partner</div>
              </div>
            </div>
            <EnquireButton className={`hp-btn hp-btn-primary ${styles.sidebarBtn}`} />
            <button type="button" className={`hp-btn hp-btn-ghost ${styles.sidebarBtn}`}>
              📞 Request a Call Back
            </button>
          </aside>
        </div>

        {similar.length > 0 && (
          <div className={styles.block} style={{ marginTop: "var(--hp-space-8)" }}>
            <div className={styles.blockTitle}>Similar Properties</div>
            <div className={styles.similarGrid}>
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
