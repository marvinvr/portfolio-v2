import type { ActionReturn } from "svelte/action";

interface FlowInOptions {
  delay?: number;
}

/* Shared scroll-velocity tracking -------------------------------------------
   One passive listener for all panels, attached on first use and kept for
   the page's lifetime. Velocity is an exponential moving average in px/ms
   that decays between events, so a flick from minutes ago doesn't count. */
let trackingStarted = false;
let scrollVel = 0;
let lastScrollY = 0;
let lastScrollT = 0;

/* When galaxy mode is switched on, the canvas plays its ~1.4s hyperspace
   intro. Panels whose entrance is dealt before the galaxy has formed wait
   out the remainder, so the spiral gets its moment before glass arrives. */
let galaxyFormsAt = 0;

function startTracking() {
  if (trackingStarted) return;
  trackingStarted = true;
  lastScrollY = window.scrollY;
  window.addEventListener("space:on", () => {
    galaxyFormsAt = performance.now() + 1250;
  });
  window.addEventListener(
    "scroll",
    () => {
      const now = performance.now();
      const dt = now - lastScrollT;
      if (lastScrollT && dt > 0 && dt < 300) {
        scrollVel =
          scrollVel * 0.7 + ((window.scrollY - lastScrollY) / dt) * 0.3;
      }
      lastScrollY = window.scrollY;
      lastScrollT = now;
    },
    { passive: true },
  );
}

/** How hard the user is scrolling right now, 0..1 (~1 at a brisk flick). */
function currentRush(): number {
  if (!lastScrollT) return 0;
  const decayed = scrollVel * Math.exp((lastScrollT - performance.now()) / 160);
  return Math.min(Math.abs(decayed) / 1.8, 1);
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/* Deals a fresh entrance pose: jitter around the bottom-right home
   trajectory, pushed deeper, blurrier and snappier the harder the user is
   scrolling when the panel shows up. Written as --fly-* custom properties
   consumed by space.scss (the hidden base state and the entrance keyframes
   both read them, so the reverse exit uses the same pose). */
function dealEntrancePose(node: HTMLElement, baseDelay: number) {
  const rush = currentRush();
  // Phones get a gentler, 2D-only entrance (space.scss reads a subset of these
  // props under its mobile media query): a near-straight rise with a whisper of
  // tilt instead of the desktop door-swing. A big 3D rotation reads as flapping
  // against a narrow screen edge, and iOS drops backdrop-filter on
  // 3D-transformed elements — so mobile stays flat and the glass keeps blurring.
  const compact = window.innerWidth <= 640;
  const drift = Math.max(window.innerWidth * 0.07, 40);

  const x = compact ? drift * rand(0.1, 0.45) : drift * rand(0.55, 1.4);
  const y = compact ? rand(56, 96) + 46 * rush : rand(115, 190) + 90 * rush;
  const z = compact ? -(rand(80, 140) + 70 * rush) : -(rand(190, 300) + 150 * rush);
  const rx = compact ? rand(3, 7) : rand(10, 19);
  const ry = compact ? rand(3, 7) : rand(12, 26);
  const rot =
    (compact ? rand(0.3, 1.0) : rand(0.8, 2.6)) *
    (Math.random() < 0.25 ? -1 : 1);

  const set = (prop: string, value: string) =>
    node.style.setProperty(prop, value);
  set("--fly-x", `${x.toFixed(1)}px`);
  set("--fly-y", `${y.toFixed(1)}px`);
  set("--fly-z", `${z.toFixed(1)}px`);
  set("--fly-rx", `${rx.toFixed(2)}deg`);
  set("--fly-ry", `${ry.toFixed(2)}deg`);
  set("--fly-rot", `${rot.toFixed(2)}deg`);
  set("--fly-scale", (compact ? rand(0.95, 0.975) : rand(0.925, 0.965)).toFixed(3));
  set(
    "--fly-origin",
    compact ? `${rand(42, 58).toFixed(1)}% 100%` : `${rand(70, 92).toFixed(1)}% 100%`,
  );
  set(
    "--fly-blur",
    `${((compact ? rand(3, 5) : rand(6, 9)) + (compact ? 3 : 6) * rush).toFixed(1)}px`,
  );
  set(
    "--fly-dur",
    `${((compact ? rand(0.85, 1.1) : rand(1.0, 1.35)) - 0.3 * rush).toFixed(2)}s`,
  );
  const warpWait = Math.max(0, galaxyFormsAt - performance.now());
  set("--flow-delay", `${Math.round(warpWait + baseDelay + rand(0, 90))}ms`);
  // Overshoot mirrors the entrance direction, scaled to its size.
  set("--fly-ox", `${(-x * rand(0.07, 0.11)).toFixed(1)}px`);
  set("--fly-oy", `${(-(rand(6, 12) + 5 * rush)).toFixed(1)}px`);
  set("--fly-orx", `${(-rx * rand(0.12, 0.18)).toFixed(2)}deg`);
  set("--fly-ory", `${(-ry * rand(0.1, 0.16)).toFixed(2)}deg`);
  set("--fly-orot", `${(-rot * rand(0.14, 0.24)).toFixed(2)}deg`);
}

/**
 * Marks an element as a galaxy-mode "flow" panel: in galaxy mode it starts
 * deep in the bottom right and swings into place once it enters the viewport,
 * and the entrance reverses when it exits through the bottom again (so
 * scrolling back down replays it). Panels that exit through the top stay
 * settled. Each entrance gets a freshly dealt pose (scroll rush + jitter),
 * and settled panels tilt subtly under the cursor. All visuals live in
 * space.scss under `html.space`, so the action has no effect in the default
 * theme. When galaxy mode is switched on, every panel re-arms so the sections
 * currently on screen fly in again.
 */
export function flowIn(
  node: HTMLElement,
  options: FlowInOptions = {},
): ActionReturn<FlowInOptions> {
  node.classList.add("space-flow");
  startTracking();

  const baseDelay = options.delay ?? 0;
  let observer: IntersectionObserver | null = null;

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Deal the pose only on a real entrance — re-dealing while the
            // panel is settled would yank a running/finished animation.
            if (!node.classList.contains("flow-in")) {
              dealEntrancePose(node, baseDelay);
              node.classList.add("flow-in");
            }
          } else if (
            entry.boundingClientRect.top >
            (entry.rootBounds?.height ?? window.innerHeight) / 2
          ) {
            // Left through the bottom (scrolled back up): play the entrance
            // in reverse via the base-state transition.
            node.classList.remove("flow-in");
          }
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -4% 0px" },
    );
    observer.observe(node);
  };

  // A fresh observation fires the callback immediately with the current
  // state, so panels on screen fly in right away.
  const arm = () => {
    // Snap to the hidden state without playing the out-transition.
    node.style.transition = "none";
    node.classList.remove("flow-in");
    void node.offsetWidth;
    node.style.transition = "";
    observe();
  };

  // Hover tilt: the settled glass angles away under the pointer, as if the
  // cursor presses on the pane. Consumed by the .flow-in settled transform.
  const MAX_TILT = 2.2;
  const tilt = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !node.classList.contains("flow-in"))
      return;
    const r = node.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const dy = ((e.clientY - r.top) / r.height) * 2 - 1;
    node.style.setProperty("--tilt-ry", `${(dx * MAX_TILT).toFixed(2)}deg`);
    node.style.setProperty("--tilt-rx", `${(-dy * MAX_TILT).toFixed(2)}deg`);
  };
  const untilt = () => {
    node.style.setProperty("--tilt-rx", "0deg");
    node.style.setProperty("--tilt-ry", "0deg");
  };

  observe();
  window.addEventListener("space:on", arm);
  node.addEventListener("pointermove", tilt, { passive: true });
  node.addEventListener("pointerleave", untilt);

  return {
    destroy() {
      observer?.disconnect();
      window.removeEventListener("space:on", arm);
      node.removeEventListener("pointermove", tilt);
      node.removeEventListener("pointerleave", untilt);
    },
  };
}
