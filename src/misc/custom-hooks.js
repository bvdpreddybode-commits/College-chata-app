import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

export function useModalState(defaultValue = false) {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const queryList = window.matchMedia(query);
    setMatches(queryList.matches);

    const listener = (evt) => setMatches(evt.matches);

    queryList.addListener(listener);
    return () => queryList.removeListener(listener);
  }, [query]);

  return matches;
};

export function usePresence(uid) {
  const [presence, setPresence] = useState({ state: "online" });

  useEffect(() => {
    if (!uid) return;

    // Check profile status
    supabase
      .from("profiles")
      .select("status, last_seen, hide_presence")
      .eq("id", uid)
      .single()
      .then(({ data }) => {
        if (data) {
          if (data.hide_presence) {
            setPresence({ state: "offline" });
          } else {
            setPresence({ state: data.status || "online", last_changed: data.last_seen });
          }
        }
      })
      .catch(() => {
        setPresence({ state: "online" });
      });
  }, [uid]);

  return presence;
}

export function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef(null);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  useEffect(() => {
    const node = elementRef.current;
    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);
    }
    return () => {
      if (node) {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, [elementRef]);

  return [elementRef, isHovered];
}
