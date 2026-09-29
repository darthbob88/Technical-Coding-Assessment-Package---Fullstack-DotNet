import { useEffect, useState } from "react";
import {
  Bookmark,
  ChevronDown,
  Heart,
  Home,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { ListingCard } from "./ListingCard";


type ListingStatus = "active" | "pending" | "sold";
export type Listing = {
  id: string;
  source: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  listedDate: string;
  status: ListingStatus;
  description: string;
};
type StatusFilter = "all" | ListingStatus;
type BedroomFilter = "any" | "1" | "2" | "3" | "4+";
type SortOption = "newest" | "price-low" | "price-high" | "target-budget";

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All areas");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [bedrooms, setBedrooms] = useState<BedroomFilter>("any");
  const [maxPrice, setMaxPrice] = useState(700000);
  const [minPrice, setMinPrice] = useState(300_000);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");

  //TODO: Target budget scoring is just abs(listing price - target budget).
  // There are better options, but that's what I thought of.
  const [targetBudget, setTargetBudget] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/listings")
      .then((response) => {
        if (!response.ok) throw new Error("Listing service unavailable");
        return response.json() as Promise<Listing[]>;
      })
      .then((data) => {
        if (!cancelled) setListings(data);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Could not connect to the listing service. Start the ASP.NET app and retry.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Cheap solution, to reuse the error-handling, but it works.
  useEffect(() => {
    if (minPrice > maxPrice)
      setError("Minimum price cannot be greater than maximum price");
    else setError("");
  }, [minPrice, maxPrice]);

  const cities = [...new Set(listings.map((listing) => listing.city))].sort();
  const activeCount = listings.filter(
    (listing) => listing.status === "active",
  ).length;

  const results = listings
    .filter((listing) => {
      const text =
        `${listing.address} ${listing.city} ${listing.state} ${listing.zip} ${listing.description}`.toLowerCase();
      return (
        (!query || text.includes(query.toLowerCase())) &&
        (city === "All areas" || listing.city === city) &&
        (status === "all" || listing.status === status) &&
        (bedrooms === "any" ||
          (bedrooms === "4+"
            ? listing.bedrooms >= 4
            : listing.bedrooms === Number(bedrooms))) &&
        listing.price <= maxPrice &&
        (!savedOnly || saved.includes(listing.id))
      );
    })
    .sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime()
        );
      } else if (sort === "price-low") {
        return a.price - b.price;
      } else if (sort === "price-high") {
        return b.price - a.price;
      } else if (sort === "target-budget") {
        return (
          Math.abs(a.price - targetBudget) - Math.abs(b.price - targetBudget)
        );
      }
      return 0;
    });

  function resetFilters() {
    setQuery("");
    setCity("All areas");
    setStatus("all");
    setBedrooms("any");
    setMaxPrice(700000);
    setMinPrice(300000);
    setSavedOnly(false);
  }

  function toggleSaved(id: string) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <Home size={17} />
          </span>
          <span>
            fieldnote<span className="period">.</span>
          </span>
        </a>
        <p className="side-label">WORKSPACE</p>
        <nav className="side-nav" aria-label="Workspace">
          <button
            className={!savedOnly ? "nav-link active" : "nav-link"}
            onClick={() => setSavedOnly(false)}
          >
            <span className="nav-glyph">▦</span>Listings
            <span className="nav-count">{listings.length}</span>
          </button>
          <button
            className={savedOnly ? "nav-link active" : "nav-link"}
            onClick={() => setSavedOnly(true)}
          >
            <Bookmark size={16} />
            Saved<span className="nav-count">{saved.length}</span>
          </button>
        </nav>
        <div className="sidebar-rule" />
        <p className="side-label">YOUR MARKET</p>
        <div className="market-pill">
          <span className="market-dot" />
          Northern Virginia
          <ChevronDown size={15} />
        </div>
        <div className="side-bottom">
          <div className="market-note">
            <Sparkles size={15} />
            <div>
              <strong>Market note</strong>
              <p>New homes have been added to your feed.</p>
            </div>
          </div>
          <div className="profile">
            <span className="avatar">JD</span>
            <span>
              <strong>Jordan Davis</strong>
              <small>Personal workspace</small>
            </span>
          </div>
        </div>
      </aside>

      <main id="top" className="main-content">
        <header className="topbar">
          <div className="crumb">
            Workspace <span>/</span> <strong>Listings</strong>
          </div>
          <div className="live">
            <i /> Live data <span className="avatar mini">JD</span>
          </div>
        </header>
        <section className="heading">
          <div>
            <p className="eyebrow">
              NORTHERN VIRGINIA <span>·</span> MARKET OVERVIEW
            </p>
            <h1>Listing desk</h1>
            <p className="subheading">
              A clear view of what's available, where it is, and what it costs.
            </p>
          </div>
          <button className="refresh" onClick={() => window.location.reload()}>
            ↻ <span>Refresh data</span>
          </button>
        </section>

        <section className="stats" aria-label="Listing summary">
          <div>
            <span>Source listings</span>
            <strong>{listings.length || "—"}</strong>
            <small>Across {cities.length || "—"} areas</small>
          </div>
          <div>
            <span>Active now</span>
            <strong>{activeCount || "—"}</strong>
            <small>
              <i className="green-dot" /> Ready to view
            </small>
          </div>
          <div>
            <span>Average asking</span>
            <strong>
              {listings.length
                ? money(
                    Math.round(
                      listings.reduce((sum, item) => sum + item.price, 0) /
                        listings.length,
                    ),
                  )
                : "—"}
            </strong>
            <small>Current feed</small>
          </div>
          <div>
            <span>Latest update</span>
            <strong>
              {listings.length
                ? new Date(
                    Math.max(
                      ...listings.map((item) =>
                        new Date(item.listedDate).getTime(),
                      ),
                    ),
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </strong>
            <small>From connected sources</small>
          </div>
        </section>

        <section id="listings" className="results-section">
          <div className="section-heading">
            <div>
              <div className="title-line">
                <h2>Available listings</h2>
                <span className="count">{results.length}</span>
              </div>
              <p>Browse homes from your connected sources</p>
            </div>
            <label className="sort">
              Sort by{" "}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
              >
                <option value="newest">Newest first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="target-budget">Target budget</option>
              </select>
            </label>
          </div>
          <label className="search">
            <Search size={17} />
            <input
              aria-label="Search listings"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by address, city, or keyword"
            />
          </label>
          <div className="results-layout">
            <aside className="filters">
              <div className="filter-heading">
                <span>
                  <SlidersHorizontal size={16} /> Filters
                </span>
                <button onClick={resetFilters}>Reset</button>
              </div>
              <label className="filter-label" htmlFor="area">
                Area
              </label>
              <div className="select-box">
                <MapPin size={14} />
                <select
                  id="area"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                >
                  <option>All areas</option>
                  {cities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown size={14} />
              </div>
              <div className="divider" />
              <span className="filter-label">Listing status</span>
              <div className="radio-list">
                {[
                  ["all", "Any status"],
                  ["active", "Active"],
                  ["pending", "Pending"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={status === value ? "radio selected" : "radio"}
                    onClick={() => setStatus(value as StatusFilter)}
                  >
                    <i />
                    {label}
                    {value === "active" && <small>{activeCount}</small>}
                  </button>
                ))}
              </div>
              <div className="divider" />
              <span className="filter-label">Bedrooms</span>
              <div className="bedrooms">
                {["any", "1", "2", "3", "4+"].map((value) => (
                  <button
                    key={value}
                    className={bedrooms === value ? "bed selected" : "bed"}
                    onClick={() => setBedrooms(value as BedroomFilter)}
                  >
                    {value === "any" ? "Any" : value}
                  </button>
                ))}
              </div>
              <div className="divider" />
              <div className="price-head">
                <span className="filter-label">Min price</span>
                <strong>{money(minPrice)}</strong>
              </div>
              <input
                className="range"
                aria-label="Min price"
                type="range"
                min="300000"
                max="700000"
                step="25000"
                value={minPrice}
                onChange={(event) => setMinPrice(Number(event.target.value))}
              />
              <div className="range-labels">
                <span>$300k</span>
                <span>$700k+</span>
              </div>
              <div className="divider" />
              <div className="price-head">
                {/* Thanks to not using a mono font, if we call it "Maximum Price", the width can jump upsettingly
                between values, causing it to wrap to two lines. Test it by going from 375 to 400 */}
                <span className="filter-label">Max price</span>
                <strong>{money(maxPrice)}</strong>
              </div>
              <input
                className="range"
                aria-label="Max price"
                type="range"
                min="300000"
                max="700000"
                step="25000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
              <div className="range-labels">
                <span>$300k</span>
                <span>$700k+</span>
              </div>
              <div className="divider" />
              <div className="price-head">
                <span className="filter-label">Target Budget</span>
                <strong>{money(targetBudget)}</strong>
              </div>
              <input
                className="range"
                aria-label="Target Budget"
                type="range"
                min="300000"
                max="700000"
                step="25000"
                value={targetBudget}
                onChange={(event) => {
                  setSort("target-budget");
                  setTargetBudget(Number(event.target.value));
                }}
              />
              <div className="range-labels">
                <span>$300k</span>
                <span>$700k+</span>
              </div>
              <div className="filter-foot">
                {results.length} matching properties
              </div>
            </aside>

            <div className="listing-area">
              {loading && <div className="message">Loading listings…</div>}
              {!loading && error && (
                <div className="message error">{error}</div>
              )}
              {!loading && !error && results.length === 0 && (
                <div className="empty">
                  <span>
                    <Search size={21} />
                  </span>
                  <h3>No listings match</h3>
                  <p>Try changing your search or filters.</p>
                  <button onClick={resetFilters}>Clear all filters</button>
                </div>
              )}
              {!loading && !error && results.length > 0 && (
                <div className="listing-grid">
                  {results.map((listing, index) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      index={index}
                      saveListing={toggleSaved}
                      isSaved={saved.includes(listing.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        <footer className="page-footer">
          <strong>
            FIELDNOTE <span>·</span> LISTING DESK
          </strong>
          <span>Listing data from connected MLS sources</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
