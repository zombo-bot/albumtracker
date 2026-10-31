import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Player from "./components/Player.jsx";
import Discover from "./pages/Discover.jsx";
import AlbumDetail from "./pages/AlbumDetail.jsx";
import Collection from "./pages/Collection.jsx";
import AiPicks from "./pages/AiPicks.jsx";
import useHashRoute, { albumHash, go, PAGE_HASH } from "./hooks/useHashRoute.js";

const TITLES = { discover: "Search", collection: "Collection", ai: "Picks for you" };

// Where the back button on an album page should return to
const BACK_LABELS = {
  discover: "Back to search",
  collection: "Back to collection",
  ai: "Back to picks",
};

export default function App() {
  const { page, albumId } = useHashRoute();
  // The page an album was opened from. Empty when someone lands on an album link directly.
  const [from, setFrom] = useState(null);
  const mainRef = useRef(null);

  const routeKey = `${page}:${albumId ?? ""}`;
  const lastKey = useRef(routeKey);

  // Each page names the tab (the album page sets its own title once it loads)
  useEffect(() => {
    if (page !== "album") document.title = `${TITLES[page]} · Deadwax`;
  }, [page]);

  // After moving to another page, start at the top and move keyboard focus there too,
  // so screen-reader and keyboard users aren't left on a link that no longer exists.
  useEffect(() => {
    if (lastKey.current === routeKey) return;
    lastKey.current = routeKey;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [routeKey]);

  const openAlbum = (id) => {
    if (page !== "album") setFrom(page); // remember where we came from
    go(albumHash(id));
  };

  const origin = from ?? "discover";

  return (
    <div className="shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault(); // a plain #main link would change the route
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <Sidebar page={page === "album" ? origin : page} />
      <div className="shell-main">
        <main id="main" ref={mainRef} tabIndex={-1}>
          {/* Search stays mounted so results survive opening an album */}
          <div hidden={page !== "discover"}>
            <Discover openAlbum={openAlbum} />
          </div>
          {page === "album" && (
            <AlbumDetail
              albumId={albumId}
              back={() => go(PAGE_HASH[origin])}
              backLabel={BACK_LABELS[origin]}
            />
          )}
          {page === "collection" && (
            <Collection openAlbum={openAlbum} goDiscover={() => go(PAGE_HASH.discover)} />
          )}
          {page === "ai" && (
            <AiPicks openAlbum={openAlbum} goDiscover={() => go(PAGE_HASH.discover)} />
          )}
        </main>
        <Player openAlbum={openAlbum} />
      </div>
    </div>
  );
}
