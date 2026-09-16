/* ==========================================================================
   ORBIT — shared geometry of the galaxy disc, plus the registry of panels
   currently in flight around it.

   Galaxy.svelte draws the spiral with these constants; flowIn.ts uses the
   same numbers to plan a panel's orbital entrance, so a panel's arc really
   follows the disc the visitor sees. Flights are registered here so the
   canvas can trail them with light (and pulse when they dock) without the
   two sides knowing about each other's DOM.
   ========================================================================== */

/** Disc squash — cos(inclination). The disc is viewed ~63° from face-on. */
export const TILT = 0.46;
/** Disc rotation on screen, radians. */
export const PLANE = -0.42;
/** CSS perspective distance shared by the flight transform and the trail. */
export const PERSPECTIVE = 1100;

export const cosPlane = Math.cos(PLANE);
export const sinPlane = Math.sin(PLANE);
/** sin(inclination): how much of a disc-plane offset becomes depth. */
export const SIN_INCL = Math.sqrt(1 - TILT * TILT);

/** Where the galaxy core sits in the viewport (pointer parallax excluded). */
export function galaxyCenter(width: number, height: number, scroll: number) {
  return {
    x: width * 0.5,
    y: height * 0.46 - Math.min(scroll * 0.03, height * 0.1),
  };
}

export interface Flight {
  /** Viewport x and document y of the point on the panel that rides the orbit. */
  anchorX: number;
  anchorDocY: number;
  /** [sx, sy, z] per sample: screen offset from the anchor plus depth, indexed by linear time. */
  pts: Float32Array;
  samples: number;
  /** performance.now() at which motion begins (after any delay). */
  start: number;
  duration: number;
  /** Exit flights replay the path backwards. */
  reverse: boolean;
  /** Set by the canvas once the arrival pulse has fired. */
  landed: boolean;
}

export const flights = new Set<Flight>();

/** Viewport position of a flight at linear progress q (0 = far, 1 = docked). */
export function flightPoint(f: Flight, q: number, scrollY: number) {
  const s = Math.min(Math.max(q, 0), 1) * (f.samples - 1);
  const i = Math.min(Math.floor(s), f.samples - 2);
  const t = s - i;
  const a = i * 3;
  const b = a + 3;
  const P = f.pts;
  return {
    x: f.anchorX + P[a] + (P[b] - P[a]) * t,
    y: f.anchorDocY - scrollY + P[a + 1] + (P[b + 1] - P[a + 1]) * t,
    z: P[a + 2] + (P[b + 2] - P[a + 2]) * t,
  };
}
