import { bigArt } from "../services/itunes.js";

export default function AlbumCard({ title, artist, art, meta, onOpen }) {
  return (
    <button className="album-card" onClick={onOpen}>
      <div className="sleeve">
        <img src={bigArt(art, 300)} alt={`${title} cover`} loading="lazy" />
        <span className="play-overlay" aria-hidden="true">▶</span>
      </div>
      <strong className="card-title">{title}</strong>
      <span className="card-artist">{artist}</span>
      {meta && <span className="card-meta">{meta}</span>}
    </button>
  );
}
