import { useCollection } from "../context/CollectionContext.jsx";

const icons = {
  discover: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  collection: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  ai: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  ),
};

export default function Sidebar({ page, setPage }) {
  const { albums } = useCollection();
  const count = Object.keys(albums).length;

  const tab = (id, label) => (
    <button
      className={`nav-tab ${page === id ? "active" : ""}`}
      onClick={() => setPage(id)}
    >
      {icons[id]}
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="sidebar">
      <h1 className="logo">
        Deadwax
      </h1>
      <nav>
        {tab("discover", "Discover")}
        {tab("collection", `Collection (${count})`)}
        {tab("ai", "Recommendations")}
      </nav>
    </aside>
  );
}
