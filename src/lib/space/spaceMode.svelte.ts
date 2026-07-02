import { browser } from "$app/environment";
import { flushSync } from "svelte";

const STORAGE_KEY = "space-mode";
const SEEN_KEY = "space-mode-seen";
const LIGHT_THEME_COLOR = "#FAF8F4";
const SPACE_THEME_COLOR = "#05070f";

export const space = $state({ on: false });

if (browser) {
  // The inline script in app.html applies the class before hydration.
  space.on = document.documentElement.classList.contains("space");
}

export function hasSeenSpace(): boolean {
  if (!browser) return true;
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

function apply(on: boolean) {
  space.on = on;
  document.documentElement.classList.toggle("space", on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable (private mode) — mode still works for the session.
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", on ? SPACE_THEME_COLOR : LIGHT_THEME_COLOR);
  if (on) window.dispatchEvent(new CustomEvent("space:on"));
}

export function toggleSpace() {
  if (!browser) return;
  const next = !space.on;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const startViewTransition = (
    document as Document & {
      startViewTransition?: (callback: () => void) => void;
    }
  ).startViewTransition?.bind(document);

  if (startViewTransition && !reducedMotion) {
    startViewTransition(() => {
      // The view transition snapshots the DOM synchronously, so Svelte's
      // pending updates must be flushed inside the callback.
      flushSync(() => apply(next));
    });
  } else {
    apply(next);
  }
}
