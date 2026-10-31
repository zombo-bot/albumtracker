import { bigArt } from "../services/itunes.js";
import { albumHash } from "../hooks/useHashRoute.js";
import StarIcon from "./StarIcon.jsx";

const isPlainClick = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

// A real link, so it can be opened in a new tab or copied. A normal click is handled in-app.
// `badge` is { label, tone } and shows on the sleeve (used for listening status).
// `rating` (0-5) shows as gold stars under the artist.
export default function AlbumCard({ albumId, title, artist, art, meta, badge, rating = 0, onOpen }) {
  return (
    <a
      className="album-card"
      href={albumHash(albumId)}
      onClick={(e) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        onOpen();
      }}
    >
      <div className="sleeve">
        <img src={bigArt(art, 300)} alt={`${title} cover`} loading="lazy" />
        {badge && <span className={`badge ${badge.tone}`}>{badge.label}</span>}
        <span className="play-overlay" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </div>
      <strong className="card-title">{title}</strong>
      <span className="card-artist">{artist}</span>
      {rating > 0 && (
        <span className="card-stars" role="img" aria-label={`Rated ${rating} out of 5`}>
          {Array.from({ length: rating }, (_, i) => <StarIcon key={i} size={14} />)}
        </span>
      )}
      {meta && <span className="card-meta">{meta}</span>}
    </a>
  );
}

// Grey placeholders shaped like AlbumCard, shown while results load.
export function AlbumCardSkeletons({ count = 12 }) {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div className="album-card skeleton-card" key={i}>
          <div className="sleeve skeleton" />
          <span className="skeleton line" style={{ width: "80%" }} />
          <span className="skeleton line" style={{ width: "55%" }} />
        </div>
      ))}
    </div>
  );
}
