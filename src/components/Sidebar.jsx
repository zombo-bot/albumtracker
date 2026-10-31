import { useCollection } from "../context/CollectionContext.jsx";
import { PAGE_HASH } from "../hooks/useHashRoute.js";

const svg = (children) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const icons = {
  discover: svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  collection: svg(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  ai: svg(
    <>
      <path d="M10 4l1.9 5.1L17 11l-5.1 1.9L10 18l-1.9-5.1L3 11l5.1-1.9z" />
      <path d="M19 3v4M17 5h4" />
    </>
  ),
};

// A record seen from above: outer edge, a few grooves, label, spindle hole.
function Mark() {
  return (
    <svg className="logo-mark" width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="var(--ink)" stroke="var(--groove)" />
      <circle cx="16" cy="16" r="11.5" fill="none" stroke="var(--groove)" />
      <circle cx="16" cy="16" r="8.5" fill="none" stroke="var(--groove)" />
      <circle cx="16" cy="16" r="5" fill="var(--press)" />
      <circle cx="16" cy="16" r="1.2" fill="var(--ink)" />
    </svg>
  );
}

export default function Sidebar({ page }) {
  const { albums } = useCollection();
  const count = Object.keys(albums).length;

  // Real links, so the browser's back button, middle-click and bookmarks all work.
  const tab = (id, label, badge) => (
    <a
      className={`nav-tab ${page === id ? "active" : ""}`}
      href={PAGE_HASH[id]}
      aria-current={page === id ? "page" : undefined}
    >
      {icons[id]}
      <span className="nav-label">{label}</span>
      {badge > 0 && (
        <span className="nav-count" aria-label={`${badge} saved`}>{badge}</span>
      )}
    </a>
  );

  return (
    <aside className="sidebar">
      <h1 className="logo">
        <Mark />
        <span>Deadwax</span>
      </h1>
      <nav aria-label="Main">
        {tab("discover", "Search")}
        {tab("collection", "Collection", count)}
        {tab("ai", "Picks for you")}
      </nav>
    </aside>
  );
}
