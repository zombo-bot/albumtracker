import { useState } from "react";
import AlbumCard, { AlbumCardSkeletons } from "../components/AlbumCard.jsx";
import { searchAlbums } from "../services/itunes.js";

export default function Discover({ openAlbum }) {
  const [term, setTerm] = useState("");
  const [searched, setSearched] = useState(""); // the term the shown results are for
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    try {
      setResults(await searchAlbums(q));
      setSearched(q);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // One sentence that is both shown and announced to screen readers
  const status = loading
    ? "Searching…"
    : results?.length > 0
      ? `${results.length} ${results.length === 1 ? "album" : "albums"} for “${searched}”`
      : results?.length === 0
        ? `No albums found for “${searched}”. Check the spelling or try the artist's name.`
        : "";

  return (
    <section className="page" aria-labelledby="discover-title">
      <h2 className="page-title" id="discover-title">Find an album</h2>

      <form className="search" onSubmit={onSubmit} role="search">
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search by album or artist"
          aria-label="Search albums"
        />
        <button type="submit" disabled={loading || !term.trim()}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p className="notice error" role="alert">{error} Check your connection and search again.</p>}

      {results === null && !error && !loading && (
        <p className="notice">Search for an album to hear 30-second previews of its tracks and save it to your collection.</p>
      )}

      <p className="results-note" role="status">{status}</p>

      {loading ? (
        <AlbumCardSkeletons />
      ) : (
        <div className="grid">
          {results?.map((a) => (
            <AlbumCard
              key={a.collectionId}
              albumId={a.collectionId}
              title={a.collectionName}
              artist={a.artistName}
              art={a.artworkUrl100}
              meta={a.releaseDate?.slice(0, 4)}
              onOpen={() => openAlbum(a.collectionId)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
