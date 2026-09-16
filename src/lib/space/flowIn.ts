import type { ActionReturn } from "svelte/action";
import {
  TILT,
  PERSPECTIVE,
  SIN_INCL,
  cosPlane,
  sinPlane,
  galaxyCenter,
  flights,
  type Flight,
} from "./orbit";

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
   out the remainder, so the spiral gets its moment before glass arrives.
   A page that loads straight into galaxy mode gets a shorter beat. */
let galaxyFormsAt = 0;

function startTracking() {
  if (trackingStarted) return;
  trackingStarted = true;
  lastScrollY = window.scrollY;
  if (document.documentElement.classList.contains("space")) {
    galaxyFormsAt = performance.now() + 700;
  }
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
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

/* Ease-out with a soft overshoot: c1 sets how far past the target the
   panel swings before settling (0.8 ≈ 3.5%). */
function easeOutBack(t: number, c1: number) {
  const c3 = c1 + 1;
  const x = t - 1;
  return 1 + c3 * x * x * x + c1 * x * x;
}

/* Path parameter over linear time: a plain ease-out-back front-loads the
   far side of the orbit into the first frames; pre-warping time keeps more
   of the arc on screen while still braking hard into dock. */
function pathEase(t: number, c1: number) {
  return easeOutBack(Math.pow(t, 1.18), c1);
}

/* Orbit planning ----------------------------------------------------------
   The panel's resting anchor is projected into the galaxy's disc
   coordinates (angle + radius on the tilted, rotated ellipse). The flight
   then spirals in along the disc: it starts a sweep of 120–250° back along
   the direction the galaxy rotates and out past its rest radius, deep
   behind the disc plane, and rides the orbit in — fading up from the far
   side, decelerating, overshooting a touch and docking. Both possible
   depth signs of the inclined disc are tried and the one that stays
   furthest behind wins; depth is then clamped so the panel never comes
   in front of its rest plane.

   The path is sampled at SAMPLES points in linear time (easing baked into
   the samples) and emitted twice: as Web Animations keyframes for the DOM
   panel and as a Flight for the canvas, which draws the trail from the very
   same numbers. */
const SAMPLES = 64;

interface Plan {
  keyframes: Keyframe[];
  duration: number;
  delay: number;
  flight: Flight;
}

function planOrbit(node: HTMLElement, baseDelay: number): Plan {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const scroll = window.scrollY;
  const compact = W <= 640;
  const rush = currentRush();

  // Tall panels orbit by a point near their top, so the visible part of
  // the panel is what rides the arc — not a center a screen below.
  const rect = node.getBoundingClientRect();
  const anchorX = rect.left + rect.width / 2;
  const anchorY = rect.top + Math.min(rect.height / 2, H * 0.3);
  const g = galaxyCenter(W, H, scroll);

  // Rest anchor in disc coordinates.
  const dx = anchorX - g.x;
  const dy = anchorY - g.y;
  const u = dx * cosPlane + dy * sinPlane;
  const v = -dx * sinPlane + dy * cosPlane;
  const rRest = Math.hypot(u, v / TILT);
  const aRest = Math.atan2(v / TILT, u);

  const maxDim = Math.max(W, H);
  const minDim = Math.min(W, H);
  // Start beyond the rest orbit — at least half a viewport out, so panels
  // resting near the core still get a real spiral instead of a wobble.
  const rFar = Math.min(
    Math.max(rRest * rand(1.35, 1.7), minDim * rand(0.45, 0.62)),
    maxDim * 1.1,
  );
  // Panels far from the core get a shorter sweep: their arc is already
  // huge, and most of a long one would happen off screen.
  const farness = clamp01(rRest / (0.8 * maxDim));
  const sweep = lerp(rad(250), rad(120), farness) * rand(0.85, 1.15);
  const depthPush =
    (compact ? rand(520, 780) : rand(820, 1250)) + 320 * rush;
  const duration =
    ((compact ? rand(1.05, 1.3) : rand(1.35, 1.75)) - 0.3 * rush) * 1000;
  const overshoot = compact ? 0.55 : 0.8;

  const build = (sign: number) => {
    const pts = new Float32Array(SAMPLES * 3);
    const zRest = sign * Math.sin(aRest) * rRest * SIN_INCL;
    let maxZ = -Infinity;
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1);
      const e = pathEase(t, overshoot);
      const k = 1 - e;
      // Positive sweep = arrive travelling in the galaxy's spin direction.
      const a = aRest + sweep * k;
      const r = rRest + (rFar - rRest) * k;
      const U = Math.cos(a) * r;
      const V = Math.sin(a) * r * TILT;
      const sx = g.x + U * cosPlane - V * sinPlane - anchorX;
      const sy = g.y + U * sinPlane + V * cosPlane - anchorY;
      // Never in front of the rest plane: a panel that came towards the
      // viewer would scale past 1 and pop, so depth is clamped to "behind".
      let z = sign * Math.sin(a) * r * SIN_INCL - zRest - depthPush * k;
      z = Math.min(z, 0);
      if (z > maxZ) maxZ = z;
      pts[i * 3] = sx;
      pts[i * 3 + 1] = sy;
      pts[i * 3 + 2] = z;
    }
    return { pts, maxZ };
  };
  let path = build(1);
  const alt = build(-1);
  if (alt.maxZ < path.maxZ) path = alt;
  const pts = path.pts;
  const at = (i: number) => ({
    x: pts[i * 3],
    y: pts[i * 3 + 1],
    z: pts[i * 3 + 2],
  });

  // Attitude: the panel banks into the turn and leads with the edge that
  // arrives first, like a craft swinging in on final approach. All angles
  // scale with (1 - e), so they unwind to zero exactly at dock and flip
  // briefly the other way through the overshoot.
  const last = SAMPLES - 1;
  const p25 = at(Math.round(last * 0.25));
  const p45 = at(Math.round(last * 0.45));
  const vx = -p45.x;
  const vy = -p45.y;
  const turn =
    (p45.x - p25.x) * (0 - p45.y) - (p45.y - p25.y) * (0 - p45.x);
  const yaw0 = compact ? 0 : -Math.sign(vx) * rand(28, 52);
  const pitch0 = compact ? 0 : Math.sign(vy) * rand(5, 12);
  const roll0 = Math.sign(turn) * (compact ? rand(1.5, 4) : rand(3, 9));
  const maxBlur = compact ? 6 : 12;
  const msPerSample = duration / last;

  const keyframes: Keyframe[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const t = i / last;
    const e = pathEase(t, overshoot);
    const k = 1 - e;
    const p = at(i);
    const persp = PERSPECTIVE / (PERSPECTIVE - p.z);

    let blur = 0;
    if (i > 0 && i < last) {
      const q = at(i - 1);
      const speed = Math.hypot(p.x - q.x, p.y - q.y) / msPerSample;
      blur =
        Math.min(maxBlur, speed * 1.6) * Math.sqrt(clamp01(k)) +
        5 * clamp01(-p.z / 1400) * clamp01(k);
    }
    const opacity = Math.pow(clamp01(t / 0.2), 0.7);

    // Desktop: true 3D — translate3d under perspective (x/y pre-divided so
    // the projected point lands on the sampled screen offset) plus yaw,
    // pitch and roll. Phones: flat translate + scale + roll, because iOS
    // drops backdrop-filter on 3D-transformed elements.
    const transform = compact
      ? `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) ` +
        `rotate(${(roll0 * k).toFixed(2)}deg) scale(${persp.toFixed(4)})`
      : `perspective(${PERSPECTIVE}px) ` +
        `translate3d(${(p.x / persp).toFixed(1)}px, ${(p.y / persp).toFixed(1)}px, ${p.z.toFixed(1)}px) ` +
        `rotateX(${(pitch0 * k).toFixed(2)}deg) rotateY(${(yaw0 * k).toFixed(2)}deg) ` +
        `rotateZ(${(roll0 * k).toFixed(2)}deg)`;

    keyframes.push({
      offset: t,
      opacity,
      filter: `blur(${blur < 0.15 ? 0 : blur.toFixed(1)}px)`,
      transform,
    });
  }
  // Dock exactly on identity so the hand-off to the CSS settled state is invisible.
  keyframes[last].transform = compact
    ? "translate(0px, 0px) rotate(0deg) scale(1)"
    : `perspective(${PERSPECTIVE}px) translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
  keyframes[last].opacity = 1;
  keyframes[last].filter = "blur(0px)";

  const warpWait = Math.max(0, galaxyFormsAt - performance.now());
  const delay = Math.round(warpWait + baseDelay + rand(0, 140));

  return {
    keyframes,
    duration,
    delay,
    flight: {
      anchorX,
      anchorDocY: anchorY + scroll,
      pts,
      samples: SAMPLES,
      start: 0,
      duration,
      reverse: false,
      landed: false,
    },
  };
}

type FlowState = "hidden" | "entering" | "settled" | "exiting";

/**
 * Marks an element as a galaxy-mode "flow" panel: in galaxy mode it rides an
 * orbit around the galaxy core into place once it enters the viewport
 * (see planOrbit), and flies back out along the same orbit when it exits
 * through the bottom again (so scrolling back down replays it). Panels that
 * exit through the top stay settled. Each entrance gets a freshly planned
 * orbit (scroll rush + jitter), and settled panels tilt subtly under the
 * cursor. Resting states live in space.scss under `html.space`, so the
 * action has no visible effect in the default theme. When galaxy mode is
 * switched on, every panel re-arms so the sections on screen fly in again.
 */
export function flowIn(
  node: HTMLElement,
  options: FlowInOptions = {},
): ActionReturn<FlowInOptions> {
  node.classList.add("space-flow");
  startTracking();

  const baseDelay = options.delay ?? 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let observer: IntersectionObserver | null = null;
  let state: FlowState = "hidden";
  let anim: Animation | null = null;
  let flight: Flight | null = null;
  let lastPlan: Plan | null = null;

  const clear = () => {
    if (anim) {
      anim.onfinish = null;
      anim.cancel();
      anim = null;
    }
    if (flight) {
      flights.delete(flight);
      flight = null;
    }
  };

  /** Forward progress (0 = far, 1 = docked) of the pose currently shown. */
  const progress = (): number => {
    if (!anim) return state === "settled" ? 1 : 0;
    const timing = anim.effect?.getComputedTiming();
    const D = Number(timing?.duration ?? 0);
    const delay = timing?.delay ?? 0;
    const t = Number(anim.currentTime ?? 0);
    const frac = D > 0 ? clamp01((t - delay) / D) : 0;
    return state === "exiting" ? 1 - frac : frac;
  };

  /* Plays the planned orbit forwards (entrance) or backwards (exit) from a
     given forward progress, so an exit interrupts an entrance mid-arc and a
     re-entrance picks up exactly where the exit left off. */
  const play = (plan: Plan, forward: boolean, fromP: number, delay: number) => {
    clear();
    const D = forward ? plan.duration : plan.duration * 0.55;
    const done = forward ? fromP : 1 - fromP;
    const a = node.animate(plan.keyframes, {
      duration: D,
      delay,
      easing: "linear",
      fill: "both",
      direction: forward ? "normal" : "reverse",
    });
    if (done > 0) a.currentTime = delay + done * D;
    flight = {
      ...plan.flight,
      start: performance.now() + delay - done * D,
      duration: D,
      reverse: !forward,
      landed: !forward,
    };
    flights.add(flight);
    anim = a;
    state = forward ? "entering" : "exiting";
    a.onfinish = () => {
      if (anim !== a) return;
      // Reverse: hide via CSS first, then drop the animation — no flash.
      if (!forward) node.classList.remove("flow-in");
      a.cancel();
      anim = null;
      state = forward ? "settled" : "hidden";
      // The Flight stays registered so the canvas can finish its trail.
    };
  };

  const enter = () => {
    if (state === "entering" || state === "settled") return;
    // Outside galaxy mode the panel just shows (all visuals are scoped to
    // html.space); the orbit is only flown when there is a galaxy to orbit.
    if (reduced || !document.documentElement.classList.contains("space")) {
      node.classList.add("flow-in");
      state = "settled";
      return;
    }
    if (state === "exiting" && lastPlan) {
      play(lastPlan, true, progress(), 0);
      return;
    }
    clear();
    node.classList.add("flow-in");
    lastPlan = planOrbit(node, baseDelay);
    play(lastPlan, true, 0, lastPlan.delay);
  };

  const exit = () => {
    if (state === "hidden" || state === "exiting") return;
    if (
      reduced ||
      !lastPlan ||
      !document.documentElement.classList.contains("space")
    ) {
      clear();
      node.classList.remove("flow-in");
      state = "hidden";
      return;
    }
    play(lastPlan, false, progress(), 0);
  };

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            enter();
          } else if (
            entry.boundingClientRect.top >
            (entry.rootBounds?.height ?? window.innerHeight) / 2
          ) {
            // Left through the bottom (scrolled back up): fly back out.
            exit();
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
    clear();
    node.classList.remove("flow-in");
    state = "hidden";
    observe();
  };

  // Galaxy mode switched off mid-flight: drop the animation and rest.
  const settle = () => {
    clear();
    node.classList.add("flow-in");
    state = "settled";
  };

  // Hover tilt: the settled glass angles away under the pointer, as if the
  // cursor presses on the pane. Consumed by the .flow-in settled transform.
  // The same event feeds the liquid-glass specular in space.scss: --glass-mx/
  // --glass-my place the highlight under the cursor, --glass-on fades it.
  const MAX_TILT = 2.2;
  const tilt = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    node.style.setProperty("--glass-mx", `${(px * 100).toFixed(1)}%`);
    node.style.setProperty("--glass-my", `${(py * 100).toFixed(1)}%`);
    node.style.setProperty("--glass-on", "1");
    if (state !== "settled") return;
    const dx = px * 2 - 1;
    const dy = py * 2 - 1;
    node.style.setProperty("--tilt-ry", `${(dx * MAX_TILT).toFixed(2)}deg`);
    node.style.setProperty("--tilt-rx", `${(-dy * MAX_TILT).toFixed(2)}deg`);
  };
  const untilt = () => {
    node.style.setProperty("--tilt-rx", "0deg");
    node.style.setProperty("--tilt-ry", "0deg");
    node.style.setProperty("--glass-on", "0");
  };

  observe();
  window.addEventListener("space:on", arm);
  window.addEventListener("space:off", settle);
  node.addEventListener("pointermove", tilt, { passive: true });
  node.addEventListener("pointerleave", untilt);

  return {
    destroy() {
      clear();
      observer?.disconnect();
      window.removeEventListener("space:on", arm);
      window.removeEventListener("space:off", settle);
      node.removeEventListener("pointermove", tilt);
      node.removeEventListener("pointerleave", untilt);
    },
  };
}
