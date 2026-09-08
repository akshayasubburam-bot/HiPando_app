"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./search.module.css";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import { properties } from "@/data/properties";

const PAGE_SIZE = 9;

const EMPTY_FILTERS = {
  location: "",
  purpose: "",
  types: [],
  minPrice: "",
  maxPrice: "",
  bedrooms: [],
  minArea: "",
  maxArea: "",
  amenities: [],
};

function bedroomMatches(selected, bedrooms) {
  if (!selected.length) return true;
  return selected.some((b) => {
    if (b === "Studio") return bedrooms === 0;
    if (b === "4+") return bedrooms >= 4;
    return bedrooms === Number(b);
  });
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const location = searchParams.get("location") || "";
    const purpose = searchParams.get("purpose") || "";
    const type = searchParams.get("type");
    const bedroom = searchParams.get("bedroom");

    setFilters({
      ...EMPTY_FILTERS,
      location,
      purpose,
      types: type ? [type] : [],
      bedrooms: bedroom ? [bedroom] : [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateFilters(patch) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setVisibleCount(PAGE_SIZE);
  }

  function handleSearchBarSearch(next) {
    updateFilters({
      location: next.location,
      purpose: next.purpose,
      types: next.type ? [next.type] : [],
      bedrooms: next.bedroom ? [next.bedroom] : [],
    });
  }

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (filters.location) {
        const q = filters.location.toLowerCase();
        if (!p.community.toLowerCase().includes(q) && !p.title.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filters.purpose && p.purpose !== filters.purpose) return false;
      if (filters.types.length && !filters.types.includes(p.type)) return false;
      if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
      if (!bedroomMatches(filters.bedrooms, p.bedrooms)) return false;
      if (filters.minArea && p.areaSqft < Number(filters.minArea)) return false;
      if (filters.maxArea && p.areaSqft > Number(filters.maxArea)) return false;
      if (filters.amenities.length) {
        const hasAll = filters.amenities.every((a) => p.amenities.includes(a));
        if (!hasAll) return false;
      }
      return true;
    });
  }, [filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => new Date(b.postedOn) - new Date(a.postedOn));
    return list;
  }, [filtered, sort]);

  const visible = sorted.slice(0, visibleCount);
  const locationLabel = filters.location || "Dubai";

  return (
    <main>
      <div className={styles.topBar}>
        <div className="hp-container">
          <SearchBar
            variant="compact"
            initialLocation={filters.location}
            initialPurpose={filters.purpose || "sale"}
            initialType={filters.types[0] || ""}
            initialBedroom={filters.bedrooms[0] || ""}
            showChips={false}
            onSearch={handleSearchBarSearch}
          />
        </div>
      </div>

      <div className="hp-container">
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <FilterPanel
              filters={filters}
              onChange={updateFilters}
              onReset={() => updateFilters(EMPTY_FILTERS)}
            />
          </aside>

          <div>
            <div className={styles.resultsHeader}>
              <div>
                <div className={styles.resultsCount}>
                  {sorted.length} properties found in {locationLabel}
                </div>
                <div className={styles.resultsSub}>
                  Showing {Math.min(visibleCount, sorted.length)} of {sorted.length} results
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className={`hp-btn hp-btn-ghost ${styles.mobileFilterBtn}`}
                  onClick={() => setDrawerOpen(true)}
                >
                  Filters
                </button>
                <select
                  className={styles.sortSelect}
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price (low to high)</option>
                  <option value="price-desc">Price (high to low)</option>
                </select>
              </div>
            </div>

            {visible.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🏠</span>
                <div className={styles.emptyTitle}>No properties found</div>
                <p className={styles.emptyText}>
                  Try adjusting your filters or search a different community to see more results.
                </p>
                <button
                  type="button"
                  className="hp-btn hp-btn-primary"
                  onClick={() => updateFilters(EMPTY_FILTERS)}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className={styles.grid}>
                  {visible.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>

                {visibleCount < sorted.length && (
                  <div className={styles.loadMoreWrap}>
                    <button
                      type="button"
                      className="hp-btn hp-btn-ghost"
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    >
                      Load more properties
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`${styles.drawerOverlay} ${drawerOpen ? styles.open : ""}`} onClick={() => setDrawerOpen(false)}>
        {drawerOpen && (
          <div className={styles.drawerPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerClose}>
              <button type="button" className="hp-btn hp-btn-ghost" onClick={() => setDrawerOpen(false)}>
                Close ✕
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={updateFilters}
              onReset={() => updateFilters(EMPTY_FILTERS)}
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
