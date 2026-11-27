"use client";

import { useCallback, useEffect, useState } from "react";
import { nearestArea } from "@/lib/geo";

export type LocateStatus = "idle" | "locating" | "found" | "denied" | "outside" | "unavailable";

/** The area this device last used, so the whole web app starts there next time. Only the name is stored. */
const STORAGE_KEY = "gearloop:area";
type Saved = { name: string; fromLocation: boolean };

function readSaved(areas: string[]): Saved | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Saved> | null;
    return saved && typeof saved.name === "string" && areas.includes(saved.name)
      ? { name: saved.name, fromLocation: saved.fromLocation === true }
      : null;
  } catch {
    return null;
  }
}

function writeSaved(saved: Saved | null) {
  try {
    if (saved) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or storage full: the choice just isn't remembered.
  }
}

/**
 * Picks the renter's area. On load it restores the area this device used last; if there is none
 * and the person has already allowed location for GearLoop, it finds the nearest area silently.
 * It never asks for location on its own: `locate()` runs only when the person taps "Use my location".
 */
export function useLocationArea(
  areas: string[],
  /**
   * The area the page already shows (e.g. /search?area=…). When given, even as null for "anywhere",
   * it wins: nothing is restored or detected, so the field always matches the results on screen.
   */
  fixed?: string | null,
) {
  const [area, setArea] = useState<string | null>(fixed ?? null);
  const [nearYou, setNearYou] = useState<string | null>(null);
  const [status, setStatus] = useState<LocateStatus>("idle");
  const areasKey = areas.join("|");

  /** Asks the browser for a coarse position and picks the nearest area. `onFound` runs after a match. */
  const locate = useCallback((onFound?: (area: string) => void) => {
    if (!("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const near = nearestArea({ lat: coords.latitude, lng: coords.longitude }, areasKey.split("|"));
        if (!near) {
          setStatus("outside");
          return;
        }
        setArea(near.area);
        setNearYou(near.area);
        setStatus("found");
        writeSaved({ name: near.area, fromLocation: true });
        onFound?.(near.area);
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? "denied" : "unavailable"),
      // Neighbourhood-level is all we need: coarse, quick, and a recent fix is fine.
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 },
    );
  }, [areasKey]);

  // Restore or auto-detect once, after mount (localStorage and location exist only in the browser).
  const restore = fixed === undefined;
  useEffect(() => {
    if (!restore) return;
    const saved = readSaved(areasKey.split("|"));
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage after hydration
      setArea(saved.name);
      if (saved.fromLocation) setNearYou(saved.name);
      return;
    }
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((permission) => {
        if (permission.state === "granted") locate();
      })
      .catch(() => {});
  }, [areasKey, locate, restore]);

  /** A manual pick from the list (null = anywhere). Remembered for next time. */
  const choose = useCallback((name: string | null) => {
    setArea(name);
    writeSaved(name ? { name, fromLocation: false } : null);
  }, []);

  return { area, nearYou, status, locate, choose };
}
