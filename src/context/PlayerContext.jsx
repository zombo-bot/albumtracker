import { createContext, useContext, useEffect, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

// Space should play/pause, except when the person is typing or pressing a control.
const isInteractive = (el) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(el.tagName));

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  if (!audioRef.current) audioRef.current = new Audio();

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useLocalStorage("deadwax:volume", 1);
  const [muted, setMuted] = useState(false);

  const current = queue[index] ?? null;

  // Load and play whenever the current track changes
  useEffect(() => {
    if (!current) return;
    const audio = audioRef.current;
    audio.src = current.previewUrl;
    audio.play().catch(() => {});
  }, [current]);

  // Keep the audio element in step with the volume controls
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onBusy = () => setLoading(true);
    const onReady = () => setLoading(false);
    const onFail = () => {
      setLoading(false);
      setIsPlaying(false);
      setError("This preview won't play. Try another track.");
    };
    const onEnd = () => {
      if (index < queue.length - 1) {
        setError("");
        setIndex(index + 1);
      } else setIsPlaying(false);
    };

    const events = {
      timeupdate: onTime, loadedmetadata: onMeta, durationchange: onMeta,
      play: onPlay, pause: onPause, loadstart: onBusy, waiting: onBusy,
      playing: onReady, canplay: onReady, error: onFail, ended: onEnd,
    };
    for (const [name, fn] of Object.entries(events)) audio.addEventListener(name, fn);
    return () => {
      for (const [name, fn] of Object.entries(events)) audio.removeEventListener(name, fn);
    };
  }, [index, queue]);

  const toggle = () => {
    const audio = audioRef.current;
    if (error) {
      // The last attempt failed: pressing play tries the same track again
      setError("");
      audio.load();
      audio.play().catch(() => {});
      return;
    }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  // Spacebar play/pause. A ref keeps the listener pointing at the latest toggle.
  const toggleRef = useRef(toggle);
  useEffect(() => {
    toggleRef.current = toggle;
  });
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isInteractive(e.target) || !audioRef.current.src) return;
      e.preventDefault();
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const playTrack = (track, tracks) => {
    if (current?.trackId === track.trackId) return toggle();
    const playable = tracks.filter((t) => t.previewUrl);
    setError("");
    setQueue(playable);
    setIndex(playable.findIndex((t) => t.trackId === track.trackId));
  };

  // Start an album from its first playable track (or pause it if it's already playing)
  const playAlbum = (tracks) => {
    const first = tracks.find((t) => t.previewUrl);
    if (!first) return;
    if (current && tracks.some((t) => t.trackId === current.trackId)) return toggle();
    playTrack(first, tracks);
  };

  const next = () => {
    if (index >= queue.length - 1) return;
    setError("");
    setIndex(index + 1);
  };
  const prev = () => {
    if (index <= 0) return;
    setError("");
    setIndex(index - 1);
  };

  const seek = (ratio) => {
    const audio = audioRef.current;
    if (audio.duration) audio.currentTime = ratio * audio.duration;
  };

  const changeVolume = (v) => {
    setVolume(v);
    setMuted(v === 0);
  };

  return (
    <PlayerContext.Provider
      value={{
        current, isPlaying, loading, error, currentTime, duration, volume, muted,
        progress: duration ? currentTime / duration : 0,
        playTrack, playAlbum, toggle, next, prev, seek,
        changeVolume, toggleMute: () => setMuted((m) => !m),
        hasNext: index < queue.length - 1,
        hasPrev: index > 0,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
