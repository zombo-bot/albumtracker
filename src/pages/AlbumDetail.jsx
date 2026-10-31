import { useEffect, useRef, useState } from "react";
import AlbumPlayback from "../components/AlbumPlayback.jsx";
import StatusSelect from "../components/StatusSelect.jsx";
import Stars from "../components/Stars.jsx";
import { useCollection } from "../context/CollectionContext.jsx";
import { usePlayer } from "../context/PlayerContext.jsx";
import { bigArt, getAlbumTracks, spotifySearchUrl, youtubeSearchUrl } from "../services/itunes.js";

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function DetailSkeleton({ back, backLabel }) {
  return (
    <section className="page" aria-busy="true" aria-label="Loading album">
      <button className="back-btn" onClick={back}><Chevron />{backLabel}</button>
      <div className="detail-head">
        <div className="sleeve-wrap"><div className="sleeve skeleton" /></div>
        <div className="detail-info">
          <span className="skeleton line tall" style={{ width: "70%" }} />
          <span className="skeleton line" style={{ width: "40%" }} />
          <span className="skeleton line" style={{ width: "30%" }} />
        </div>
      </div>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="skeleton line track-skel" />
      ))}
    </section>
  );
}

export default function AlbumDetail({ albumId, back, backLabel = "Back" }) {
  const { albums, save, update, remove } = useCollection();
  const { current, isPlaying, error: playError, playAlbum } = usePlayer();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false); // "press again to remove"
  const [note, setNote] = useState(""); // announced to screen readers
  const trackerRef = useRef(null);
  const saveRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    let cancelled = false; // ignore a slow response if another album was opened meanwhile
    setData(null);
    setError("");
    getAlbumTracks(albumId)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [albumId]);

  useEffect(() => {
    if (data) document.title = `${data.album.collectionName} · Deadwax`;
  }, [data]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (error)
    return (
      <section className="page">
        <button className="back-btn" onClick={back}><Chevron />{backLabel}</button>
        <p className="notice error" role="alert">{error} Go back and open the album again.</p>
      </section>
    );
  if (!data) return <DetailSkeleton back={back} backLabel={backLabel} />;

  const { album, tracks } = data;
  const saved = albums[album.collectionId];

  const hasPreviews = tracks.some((t) => t.previewUrl);
  const thisAlbumLoaded = !!current && tracks.some((t) => t.trackId === current.trackId);
  const spinning = thisAlbumLoaded && isPlaying;
  const playLabel = spinning
    ? "Pause"
    : thisAlbumLoaded
      ? playError ? "Try again" : "Resume"
      : "Play album";

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const announce = (msg) => {
    setNote(msg);
    later(() => setNote(""), 4000);
  };

  // The button that was pressed disappears, so hand keyboard focus to what replaces it.
  const onSave = () => {
    save(album);
    announce("Saved to your collection.");
    requestAnimationFrame(() => trackerRef.current?.querySelector("button")?.focus());
  };

  // Removing loses the album's notes and rating, so it takes two presses.
  const onRemove = () => {
    if (!confirming) {
      setConfirming(true);
      announce("Press again to remove this album and its notes.");
      later(() => setConfirming(false), 4000);
      return;
    }
    remove(album.collectionId);
    setConfirming(false);
    announce("Removed from your collection.");
    requestAnimationFrame(() => saveRef.current?.focus());
  };

  return (
    <section className="page" aria-labelledby="album-title">
      <button className="back-btn" onClick={back}><Chevron />{backLabel}</button>

      <div className="detail-head">
        {/* The record is behind the sleeve; it spins while this album plays */}
        <div className="sleeve-wrap">
          <div className={`disc ${spinning ? "spinning" : ""}`} aria-hidden="true">
            <img className="disc-label" src={bigArt(album.artworkUrl100, 120)} alt="" />
          </div>
          <img className="cover" src={bigArt(album.artworkUrl100, 500)} alt={`${album.collectionName} cover`} />
        </div>

        <div className="detail-info">
          <h2 className="detail-title" id="album-title">{album.collectionName}</h2>
          <p className="detail-artist">{album.artistName}</p>
          <p className="facts">
            <span>{album.releaseDate?.slice(0, 4)}</span>
            <span>{album.primaryGenreName}</span>
            <span>{album.trackCount} tracks</span>
          </p>

          <div className="detail-actions">
            <button className="primary big" onClick={() => playAlbum(tracks)} disabled={!hasPreviews}>
              {playLabel}
            </button>
            {!saved && (
              <button className="ghost" ref={saveRef} onClick={onSave}>Save to collection</button>
            )}
          </div>

          <div className="where">
            <span>Open in</span>
            <a href={spotifySearchUrl(album.collectionName, album.artistName)} target="_blank" rel="noreferrer">Spotify</a>
            <a href={youtubeSearchUrl(album.collectionName, album.artistName)} target="_blank" rel="noreferrer">YouTube</a>
            {album.collectionViewUrl && <a href={album.collectionViewUrl} target="_blank" rel="noreferrer">Apple Music</a>}
          </div>
        </div>
      </div>

      {saved && (
        <div className="tracker" ref={trackerRef}>
          <div className="tracker-row">
            <StatusSelect value={saved.status} onChange={(status) => update(album.collectionId, { status })} />
            <Stars value={saved.rating} onChange={(rating) => update(album.collectionId, { rating })} />
          </div>
          <label className="field">
            <span className="field-label">Notes</span>
            <textarea
              value={saved.notes}
              onChange={(e) => update(album.collectionId, { notes: e.target.value })}
              placeholder="What stood out?"
              rows={3}
            />
          </label>
          <button className={confirming ? "btn-danger confirm" : "btn-danger"} onClick={onRemove}>
            {confirming ? "Press again to remove" : "Remove from collection"}
          </button>
        </div>
      )}

      <AlbumPlayback title={album.collectionName} artist={album.artistName} tracks={tracks} />

      <p className="sr-only" role="status">{note}</p>
    </section>
  );
}
