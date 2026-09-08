import Link from "next/link";
import styles from "./ChatPropertyMiniCard.module.css";
import { bedroomLabel, formatPrice } from "@/lib/format";

export default function ChatPropertyMiniCard({ property }) {
  return (
    <Link href={`/property/${property.id}`} className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={property.images[0]} alt={property.title} className={styles.image} />
      <div className={styles.body}>
        <div className={styles.price}>{formatPrice(property)}</div>
        <div className={styles.title}>
          {bedroomLabel(property.bedrooms)} {property.type}
        </div>
        <div className={styles.location}>
          {property.community}, {property.city}
        </div>
      </div>
    </Link>
  );
}
