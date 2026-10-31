import { usePlayer } from "../context/PlayerContext.jsx";

const fmt = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function TrackList({ tracks }) {
  const { current, isPlaying, playTrack } = usePlayer();

  return (
    <ol className="tracks">
      {tracks.map((t, i) => {
        const active = current?.trackId === t.trackId;
        const playingNow = active && isPlaying;
        return (
          <li key={t.trackId} className={active ? "track active" : "track"}>
            <button
              className="play-btn"
              disabled={!t.previewUrl}
              onClick={() => playTrack(t, tracks)}
              aria-label={playingNow ? `Pause ${t.trackName}` : `Play ${t.trackName}`}
            >
              {playingNow ? (
                <span className="bars" aria-hidden="true"><i /><i /><i /></span>
              ) : (
                <>
                  <span className="num">{t.trackNumber ?? i + 1}</span>
                  <svg className="ico" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </>
              )}
            </button>
            <span className="track-name">{t.trackName}</span>
            <span className="track-time">{fmt(t.trackTimeMillis)}</span>
          </li>
        );
      })}
    </ol>
  );
}
