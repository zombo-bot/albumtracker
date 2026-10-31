import { useSyncExternalStore } from "react";

export const PAGE_HASH = {
  discover: "#/search",
  collection: "#/collection",
  ai: "#/picks",
};

export const albumHash = (id) => `#/album/${id}`;

export function parseRoute(hash) {
  const [page, id] = hash.replace(/^#\/?/, "").split("/");
  if (page === "album" && /^\d+$/.test(id ?? "")) return { page: "album", albumId: id };
  if (page === "collection") return { page: "collection" };
  if (page === "picks") return { page: "ai" };
  return { page: "discover" };
}

export function go(hash) {
  if (window.location.hash !== hash) window.location.hash = hash;
}

const subscribe = (onChange) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export default function useHashRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => "");
  return parseRoute(hash);
}
