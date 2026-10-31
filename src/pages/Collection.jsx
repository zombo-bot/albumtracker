import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { STATUSES } from "../components/StatusSelect.jsx";
import { useCollection } from "../context/CollectionContext.jsx";
import { TONES } from "../statusTones.js";

export default function Collection({ openAlbum, goDiscover }) {
  const { albums } = useCollection();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const all = Object.values(albums);

  if (all.length === 0)
    return (
      <section className="page" aria-labelledby="collection-title">
        <h2 className="page-title" id="collection-title">My collection</h2>
        <div className="empty">
          <p>Nothing saved yet. Find an album and choose Save to collection to start your log.</p>
          <button className="primary" onClick={goDiscover}>Find an album</button>
        </div>
      </section>
    );

  const countFor = (id) => all.filter((a) => a.status === id).length;

  const list = all
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => `${a.name} ${a.artist}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sort === "recent" ? (b.addedAt ?? 0) - (a.addedAt ?? 0)
      : sort === "rating" ? b.rating - a.rating
      : sort === "artist" ? a.artist.localeCompare(b.artist)
      : a.name.localeCompare(b.name)
    );

  const filtered = filter !== "all" || query.trim() !== "";

  return (
    <section className="page" aria-labelledby="collection-title">
      <h2 className="page-title" id="collection-title">My collection</h2>
      <p className="page-sub" role="status">
        {filtered
          ? `Showing ${list.length} of ${all.length} ${all.length === 1 ? "album" : "albums"}.`
          : `${all.length} ${all.length === 1 ? "album" : "albums"} saved, ${countFor("listened")} listened to.`}
      </p>

      <div className="filters">
        <div className="chips" role="group" aria-label="Filter by status">
          {[{ id: "all", label: "All" }, ...STATUSES].map((s) => (
            <button
              key={s.id}
              className={`chip ${filter === s.id ? "on" : ""}`}
              onClick={() => setFilter(s.id)}
              aria-pressed={filter === s.id}
            >
              {s.label}
              <span className="chip-count">{s.id === "all" ? all.length : countFor(s.id)}</span>
            </button>
          ))}
        </div>
        <label className="field">
          <span className="field-label">Find in collection</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title or artist" />
        </label>
        <label className="field">
          <span className="field-label">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Recently added</option>
            <option value="name">Title</option>
            <option value="artist">Artist</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      {list.length === 0 && <p className="notice">No albums match those filters. Clear the filter or search to see everything.</p>}

      <div className="grid">
        {list.map((a) => (
          <AlbumCard
            key={a.collectionId}
            albumId={a.collectionId}
            title={a.name}
            artist={a.artist}
            art={a.artwork}
            rating={a.rating}
            badge={{ label: STATUSES.find((s) => s.id === a.status)?.label, tone: TONES[a.status] }}
            onOpen={() => openAlbum(a.collectionId)}
          />
        ))}
      </div>
    </section>
  );
}
