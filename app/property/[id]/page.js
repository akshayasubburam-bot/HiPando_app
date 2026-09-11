import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./details.module.css";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCard from "@/components/PropertyCard";
import EnquireButton from "@/components/EnquireButton";
import PropertyAiPanel from "@/components/property/PropertyAiPanel";
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
      <header className={styles.topbar}>
        <div className={`hp-container ${styles.topbarInner}`}>
          <Link href="/search" className={styles.backLink}>
            ← Back to Properties
          </Link>
          <div className={styles.breadcrumb}>
            <Link href="/search">Properties</Link>
            <span>/</span>
            <span>{property.community}</span>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{property.title}</span>
          </div>
          <div className={styles.topRight}>
            <span className={styles.statusPill}>
              <span className={styles.statusDot} /> DLD Mesh Online
            </span>
            <span className={styles.statusPill}>
              <span className={styles.statusDotRed} /> Pando Active
            </span>
          </div>
        </div>
      </header>

      <div className={`hp-container ${styles.body}`}>
        <div className={styles.titleBlock}>
          <span className={styles.verifiedTag}>✔ Verified Architectural Asset</span>
          <h1 className={styles.title}>{property.title}</h1>
          <div className={styles.subLocation}>
            📍 {property.community}, {property.city} · {property.type}
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.left}>
            <div className={styles.galleryWrap}>
              <span className={styles.galleryBadge}>✔ Verified Imagery</span>
              <PropertyGallery images={property.images} title={property.title} />
            </div>

            <div className={styles.priceCard}>
              <div>
                <span className={styles.priceEyebrow}>Verified Listing Valuation</span>
                <div className={styles.priceValue}>{formatPrice(property)}</div>
              </div>
              <div className={styles.priceActions}>
                <EnquireButton className={`hp-btn ${styles.whatsappBtn}`} />
                <button type="button" className={`hp-btn hp-btn-ghost ${styles.vipBtn}`}>
                  VIP Viewing
                </button>
              </div>
            </div>

            <div className={styles.metricsRow}>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>🛏</span>
                <span className={styles.metricValue}>{bedroomLabel(property.bedrooms)}</span>
                <span className={styles.metricLabel}>Bedrooms</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>📐</span>
                <span className={styles.metricValue}>{property.areaSqft.toLocaleString()}</span>
                <span className={styles.metricLabel}>Built-Up Sq. Ft.</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>🛁</span>
                <span className={styles.metricValue}>{property.bathrooms}</span>
                <span className={styles.metricLabel}>Bathrooms</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricIcon}>🛋️</span>
                <span className={styles.metricValue}>{property.furnishing}</span>
                <span className={styles.metricLabel}>Furnishing</span>
              </div>
            </div>

            <div className={styles.essenceCard}>
              <div className={styles.essenceHeader}>
                <div className={styles.blockTitle}>Property Essence</div>
                <span
                  className={`${styles.purposeBadge} ${
                    property.purpose === "sale" ? styles.purposeSale : styles.purposeRent
                  }`}
                >
                  {property.purpose === "sale" ? "For Sale" : "For Rent"}
                </span>
              </div>
              <p className={styles.description}>{property.description}</p>
              <div className={styles.tagRow}>
                {property.amenities.map((a) => (
                  <span key={a} className={styles.tag}>
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.agentCard}>
              <div className={styles.agentInfo}>
                <div className={styles.agentAvatar}>HP</div>
                <div>
                  <div className={styles.agentName}>
                    Hi Pando Team <span className={styles.agentVerified}>✔</span>
                  </div>
                  <div className={styles.agentRole}>
                    Verified Listing Partner · {property.community} Desk
                  </div>
                </div>
              </div>
              <EnquireButton className={`hp-btn ${styles.whatsappBtn}`} />
            </div>

            {similar.length > 0 && (
              <div className={styles.similarBlock}>
                <div className={styles.blockTitle}>Similar Properties</div>
                <div className={styles.similarGrid}>
                  {similar.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className={styles.right}>
            <PropertyAiPanel property={property} />
          </aside>
        </div>
      </div>

      <footer className={styles.bottomBar}>
        <div className={`hp-container ${styles.bottomBarInner}`}>
          <span>
            ← Back to Properties · Hi Pando — Private Luxury Advisory
          </span>
          <span>DLD Escrow Blockchain Verified</span>
        </div>
      </footer>
    </main>
  );
}
