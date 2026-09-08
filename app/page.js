import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import SearchBar from "@/components/SearchBar";
import LocalityCard from "@/components/LocalityCard";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { localities } from "@/data/localities";
import { properties } from "@/data/properties";

export default function HomePage() {
  const featured = properties.slice(0, 8);

  return (
    <main>
      <section className={styles.hero}>
        <Image
          src="/images/logo-mascot.png"
          alt="Hi Pando mascot"
          width={220}
          height={295}
          className={styles.heroMascot}
          priority
        />
        <div className={`hp-container ${styles.heroInner}`}>
          <span className={styles.eyebrow}>🇦🇪 Dubai&rsquo;s most elegant property search</span>
          <h1 className={styles.heading}>
            Find your <span className={styles.headingAccent}>place</span> in Dubai
          </h1>
          <p className={styles.subheading}>
            Browse verified apartments, villas and commercial spaces across Dubai&rsquo;s
            most sought-after communities — built for buyers and tenants, not brokers.
          </p>

          <div className={styles.searchWrap}>
            <SearchBar variant="hero" />
          </div>

          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{properties.length}+</span>
              <span className={styles.statLabel}>Live Listings</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{localities.length}</span>
              <span className={styles.statLabel}>Communities</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>100%</span>
              <span className={styles.statLabel}>Verified Listings</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="hp-container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="hp-eyebrow">Explore</span>
              <h2 className="hp-section-title">Popular localities in Dubai</h2>
            </div>
            <Link href="/search" className={styles.sectionLink}>
              View all communities →
            </Link>
          </div>
          <div className={styles.localityRow}>
            {localities.map((loc) => (
              <LocalityCard key={loc.name} locality={loc} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="hp-container">
          <div className={styles.sectionHeader}>
            <div>
              <span className="hp-eyebrow">Handpicked</span>
              <h2 className="hp-section-title">Featured Properties</h2>
            </div>
            <Link href="/search" className={styles.sectionLink}>
              View all listings →
            </Link>
          </div>
          <div className={styles.propertyGrid}>
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className="hp-container">
          <div className={styles.ctaBand}>
            <div>
              <div className={styles.ctaTitle}>Ready to find your next home?</div>
              <div className={styles.ctaSub}>
                Create a free Hi Pando account to save listings and get instant alerts.
              </div>
            </div>
            <Link href="/sign-up" className="hp-btn" style={{ background: "#fff", color: "var(--hp-primary-dark)" }}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
