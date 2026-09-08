"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./TopNav.module.css";

const NAV_LINKS = [
  { label: "Buy", href: "/search?purpose=sale" },
  { label: "Rent", href: "/search?purpose=rent" },
  { label: "Commercial", href: "/search?type=Commercial" },
  { label: "New Projects", href: "/search" },
];

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={styles.wrap}>
      <div className={`hp-container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.mark}>HP</span>
          Hi <span className={styles.logoAccent}>Pando</span>
        </Link>

        <nav className={styles.links}>
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.link} ${
                pathname === item.href.split("?")[0] ? styles.linkActive : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/sign-in" className="hp-btn hp-btn-primary">
            Sign In / Sign Up
          </Link>
          <button
            className={styles.hamburger}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path
                d="M1 1H17M1 7H17M1 13H17"
                stroke="#10231d"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${open ? styles.open : ""}`}>
        {NAV_LINKS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={styles.mobileLink}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
