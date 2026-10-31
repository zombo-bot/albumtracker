import { usePlayer } from "../context/PlayerContext.jsx";
import { bigArt } from "../services/itunes.js";

const fmt = (s = 0) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{children}</svg>
);

export default function Player({ openAlbum }) {
  const {
    current, isPlaying, loading, error, progress, currentTime, duration, volume, muted,
    toggle, next, prev, seek, hasNext, hasPrev, changeVolume, toggleMute,
  } = usePlayer();

  if (!current) return null;

  const shownVolume = muted ? 0 : volume;

  return (
    <footer className="player" aria-label="Now playing">
      <div className="player-track">
        <button
          className="player-art"
          onClick={() => openAlbum(current.collectionId)}
          aria-label={`Open album ${current.collectionName}`}
        >
          <img src={bigArt(current.artworkUrl100, 120)} alt="" />
        </button>
        <div className="now">
          <strong>{current.trackName}</strong>
          <span className={error ? "now-error" : ""}>
            {error || (loading && !isPlaying ? "Loading…" : current.artistName)}
          </span>
        </div>
      </div>

      {/* Read out failures, but not every track change */}
      <p className="sr-only" role="status">{error}</p>

      <div className="controls">
        <button onClick={prev} disabled={!hasPrev} aria-label="Previous track">
          <Icon><path d="M6 5h2v14H6zM20 5v14L9.5 12z" /></Icon>
        </button>
        <button className="main" onClick={toggle} aria-label={error ? "Try again" : isPlaying ? "Pause" : "Play"}>
          {isPlaying && !error ? (
            <Icon><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></Icon>
          ) : (
            <Icon><path d="M8 5v14l11-7z" /></Icon>
          )}
        </button>
        <button onClick={next} disabled={!hasNext} aria-label="Next track">
          <Icon><path d="M16 5h2v14h-2zM4 5v14l10.5-7z" /></Icon>
        </button>
      </div>

      <div className="seek-row">
        <span className="time">{fmt(currentTime)}</span>
        <input
          className="range seek"
          type="range"
          min="0"
          max="1000"
          value={Math.round(progress * 1000)}
          style={{ "--fill": `${progress * 100}%` }}
          onChange={(e) => seek(e.target.value / 1000)}
          aria-label="Seek"
          aria-valuetext={`${fmt(currentTime)} of ${fmt(duration)}`}
        />
        <span className="time">{fmt(duration)}</span>
      </div>

      <div className="volume">
        <button className="vol-btn" onClick={toggleMute} aria-label={shownVolume === 0 ? "Unmute" : "Mute"}>
          {shownVolume === 0 ? (
            <Icon><path d="M3 9v6h4l5 4V5L7 9H3zm13.6 3 2.4-2.4-1.4-1.4-2.4 2.4-2.4-2.4-1.4 1.4 2.4 2.4-2.4 2.4 1.4 1.4 2.4-2.4 2.4 2.4 1.4-1.4z" /></Icon>
          ) : (
            <Icon><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z" /></Icon>
          )}
        </button>
        <input
          className="range"
          type="range"
          min="0"
          max="100"
          value={Math.round(shownVolume * 100)}
          style={{ "--fill": `${shownVolume * 100}%` }}
          onChange={(e) => changeVolume(e.target.value / 100)}
          aria-label="Volume"
        />
      </div>
    </footer>
  );
}
