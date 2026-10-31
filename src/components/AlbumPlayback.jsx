import { useEffect, useState } from "react";
import TrackList from "./TrackList.jsx";
import { findDeezerAlbumId } from "../services/deezer.js";
import { findYoutubeVideoId } from "../services/youtube.js";
import { usePlayer } from "../context/PlayerContext.jsx";
import useLocalStorage from "../hooks/useLocalStorage.js";

export default function AlbumPlayback({ title, artist, tracks }) {
  const { isPlaying, toggle } = usePlayer();
  const [deezerId, setDeezerId] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [source, setSource] = useLocalStorage("album-tracker:playback-source", "preview");

  useEffect(() => {
    let cancelled = false;
    setDeezerId(null);
    setYoutubeId(null);
    findDeezerAlbumId(title, artist).then((id) => !cancelled && setDeezerId(id)).catch(() => {});
    findYoutubeVideoId(title, artist).then((id) => !cancelled && setYoutubeId(id)).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [title, artist]);

  const switchTo = (next) => {
    if (isPlaying) toggle(); // stop the preview so two things never play at once
    setSource(next);
  };

  if (source === "deezer" && deezerId) {
    return (
      <div>
        <iframe
          title="Deezer player"
          src={`https://widget.deezer.com/widget/dark/album/${deezerId}`}
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 12 }}
          allow="encrypted-media; clipboard-write"
          loading="lazy"
        />
        <p className="card-meta source-note">
          Only hearing previews? Log in to Deezer in this browser, then reload.
        </p>
        <button className="chip" onClick={() => switchTo("preview")}>Switch back to previews</button>
      </div>
    );
  }

  if (source === "youtube" && youtubeId) {
    return (
      <div>
        <iframe
          title="YouTube player"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          width="100%"
          height="360"
          style={{ border: 0, borderRadius: 12 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <p className="card-meta source-note">
          Playing from YouTube.
        </p>
        <button className="chip" onClick={() => switchTo("preview")}>Switch back to previews</button>
      </div>
    );
  }

  return (
    <>
      {(deezerId || youtubeId) && (
        <div className="more-callout">
          <p>These are 30-second previews. Want the full album?</p>
          <div className="callout-actions">
            {deezerId && (
              <>
                <a className="btn-link" href="https://www.deezer.com/login" target="_blank" rel="noreferrer">
                  Log in to Deezer
                </a>
                <button className="primary" onClick={() => switchTo("deezer")}>Play on Deezer</button>
              </>
            )}
            {youtubeId && (
              <button className="primary" onClick={() => switchTo("youtube")}>Play on YouTube</button>
            )}
          </div>
        </div>
      )}
      <TrackList tracks={tracks} />
    </>
  );
}
