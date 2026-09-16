<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import {
    TILT,
    PLANE,
    PERSPECTIVE,
    galaxyCenter,
    flights,
    flightPoint,
  } from "$lib/space/orbit";

  let canvas = $state<HTMLCanvasElement>();

  onMount(() => {
    const element = canvas;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface AmbientStar {
      x: number;
      y: number;
      size: number;
      sprite: HTMLCanvasElement;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
    }
    interface AmbientLayer {
      parallax: number;
      drift: number;
      stars: AmbientStar[];
    }
    interface GalaxyStar {
      r: number;
      angle: number;
      size: number;
      sprite: HTMLCanvasElement;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
    }
    interface Meteor {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
    }
    /* Expanding ring of light where a glass panel has just docked. */
    interface Pulse {
      x: number;
      y: number;
      age: number;
      life: number;
    }
    /* Cursor comet: a shooting star that chases the pointer. */
    interface TrailPoint {
      x: number;
      y: number;
      t: number;
    }
    /* Mini shooting stars shed by the comet head on fast pointer moves. */
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
    }

    let width = 0;
    let height = 0;
    let fieldHeight = 0;
    let builtWidth = 0;
    let builtHeight = 0;
    let ambientLayers: AmbientLayer[] = [];
    let galaxyStars: GalaxyStar[] = [];
    let galaxyRadius = 0;
    let meteors: Meteor[] = [];
    let nextMeteorIn = 3;
    let pulses: Pulse[] = [];

    // Cursor comet state (mouse/pen only — touch has no hover).
    const hoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    let cursorX = 0;
    let cursorY = 0;
    let headX = 0;
    let headY = 0;
    let cursorSeen = false;
    let lastCursorMove = -1e9;
    let cursorSpeed = 0; // px/s, smoothed
    let cursorDirX = 0;
    let cursorDirY = 0;
    let presence = 0;
    let trail: TrailPoint[] = [];
    let sparks: Spark[] = [];
    let sparkBudget = 0;

    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let rafId = 0;
    let running = false;
    let lastTime = 0;
    let elapsed = 0;

    // Hyperspace intro: ambient stars streak and the galaxy spins up while
    // warp decays 1 -> 0.
    const warpDuration = 1.4;
    let warpElapsed = reducedMotion ? warpDuration : 0;

    // Spiral disc orientation: squashed (viewed at an inclination) and tipped
    // on screen (constants shared with the orbital flight planner in
    // orbit.ts). Rotation combines a slow idle spin with scroll, so scrolling
    // down turns the galaxy right-to-left across its top edge.
    const cosPlane = Math.cos(PLANE);
    const sinPlane = Math.sin(PLANE);
    const IDLE_SPIN = 0.02; // rad/s
    const SCROLL_SPIN = 0.0004; // rad per scrolled px

    // Pre-rendered radial-gradient sprites are much cheaper than shadowBlur.
    const makeSprite = (r: number, g: number, b: number) => {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 32;
      const spriteCtx = sprite.getContext("2d")!;
      const gradient = spriteCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.25, `rgba(${r},${g},${b},0.9)`);
      gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
      spriteCtx.fillStyle = gradient;
      spriteCtx.fillRect(0, 0, 32, 32);
      return sprite;
    };
    const whiteSprite = makeSprite(255, 255, 255);
    const warmSprite = makeSprite(255, 214, 170);
    const coolSprite = makeSprite(205, 220, 245);
    const pinkSprite = makeSprite(235, 200, 220);

    const makeCoreGlow = () => {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 256;
      const glowCtx = sprite.getContext("2d")!;
      const gradient = glowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, "rgba(255,234,204,0.9)");
      gradient.addColorStop(0.14, "rgba(255,215,170,0.42)");
      gradient.addColorStop(0.34, "rgba(210,196,186,0.14)");
      gradient.addColorStop(0.62, "rgba(148,148,162,0.05)");
      gradient.addColorStop(1, "rgba(148,148,162,0)");
      glowCtx.fillStyle = gradient;
      glowCtx.fillRect(0, 0, 256, 256);
      return sprite;
    };
    const coreGlow = makeCoreGlow();

    const gauss = () =>
      (Math.random() + Math.random() + Math.random() - 1.5) * 0.9;

    const pickAmbientSprite = () => {
      const roll = Math.random();
      if (roll < 0.8) return whiteSprite;
      if (roll < 0.92) return coolSprite;
      return warmSprite;
    };

    const buildScene = () => {
      builtWidth = width;
      builtHeight = height;
      // Taller than the viewport so scroll parallax can wrap seamlessly, with
      // enough buffer that mobile URL-bar resizes don't force a rebuild.
      fieldHeight = height + 360;

      const ambientSpecs = [
        { parallax: 0.12, drift: 1.6, density: 30000, min: 0.4, max: 0.95 },
        { parallax: 0.3, drift: 3.2, density: 58000, min: 0.7, max: 1.5 },
      ];
      ambientLayers = ambientSpecs.map((spec) => ({
        parallax: spec.parallax,
        drift: spec.drift,
        stars: Array.from(
          { length: Math.round((width * fieldHeight) / spec.density) },
          () => ({
            x: Math.random() * width,
            y: Math.random() * fieldHeight,
            size: spec.min + Math.random() * (spec.max - spec.min),
            sprite: pickAmbientSprite(),
            alpha: 0.2 + Math.random() * 0.5,
            twinkleSpeed: 0.8 + Math.random() * 2.4,
            phase: Math.random() * Math.PI * 2,
          }),
        ),
      }));

      // Two-armed logarithmic-ish spiral, denser and warmer towards the core,
      // cooler and sparser towards the rim.
      galaxyRadius = Math.max(width, height) * 0.44;
      const count = Math.round(
        Math.min(2200, Math.max(500, (width * height) / 700)),
      );
      const swirl = 3.1;
      galaxyStars = Array.from({ length: count }, () => {
        const t = Math.pow(Math.random(), 0.6);
        const scatter = (0.16 + t * 0.36) * gauss();
        const angle =
          Math.floor(Math.random() * 2) * Math.PI +
          swirl * Math.pow(t, 0.72) +
          scatter;
        const roll = Math.random();
        let sprite: HTMLCanvasElement;
        if (t < 0.3) {
          sprite = roll < 0.75 ? warmSprite : whiteSprite;
        } else if (t < 0.62) {
          sprite =
            roll < 0.5 ? whiteSprite : roll < 0.8 ? warmSprite : coolSprite;
        } else {
          sprite =
            roll < 0.55 ? coolSprite : roll < 0.92 ? whiteSprite : pinkSprite;
        }
        return {
          r: t * galaxyRadius * (0.94 + Math.random() * 0.12),
          angle,
          size: (0.5 + Math.random() * 1.5) * (t < 0.25 ? 1.3 : 1),
          sprite,
          alpha: Math.min(1, 0.2 + (1 - t) * 0.45 + Math.random() * 0.3),
          twinkleSpeed: 0.6 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const spawnMeteor = () => {
      const fromLeft = Math.random() < 0.5;
      const speed = 700 + Math.random() * 500;
      const angle = ((20 + Math.random() * 18) * Math.PI) / 180;
      meteors.push({
        x: width * (0.08 + Math.random() * 0.84),
        y: height * (0.04 + Math.random() * 0.35),
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 0.8 + Math.random() * 0.5,
      });
    };

    const TRAIL_MS = 280;
    const TRAIL_STEPS = 16;
    const drawFlights = (now: number, scroll: number) => {
      for (const flight of flights) {
        const age = now - flight.start;
        if (age > flight.duration + 400) {
          flights.delete(flight);
          continue;
        }
        if (age < 0) continue;
        const p = Math.min(1, age / flight.duration);
        const q = flight.reverse ? 1 - p : p;
        const head = flightPoint(flight, q, scroll);

        if (!flight.reverse && !flight.landed && p >= 1) {
          flight.landed = true;
          pulses.push({ x: head.x, y: head.y, age: 0, life: 0.7 });
        }
        if (p >= 1) continue;

        // Trail thins out as the pane decelerates into dock.
        const fade = 1 - Math.pow(p, 3);
        ctx.lineCap = "round";
        let prev = head;
        for (let k = 1; k <= TRAIL_STEPS; k++) {
          const tk = age - k * (TRAIL_MS / TRAIL_STEPS);
          if (tk < 0) break;
          const pk = tk / flight.duration;
          const point = flightPoint(
            flight,
            flight.reverse ? 1 - pk : pk,
            scroll,
          );
          const persp = PERSPECTIVE / (PERSPECTIVE - point.z);
          const along = 1 - k / TRAIL_STEPS;
          const alpha = along * along * 0.7 * fade * Math.min(1, persp * 1.5);
          ctx.strokeStyle = `rgba(255,228,196,${alpha.toFixed(3)})`;
          ctx.lineWidth = (0.8 + 3.2 * persp) * (0.35 + 0.65 * along);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          prev = point;
        }

        const persp = PERSPECTIVE / (PERSPECTIVE - head.z);
        const glow = (28 + 70 * (1 - p)) * persp;
        ctx.globalAlpha = 0.3 * fade;
        ctx.drawImage(warmSprite, head.x - glow / 2, head.y - glow / 2, glow, glow);
        ctx.globalAlpha = 1;
      }
    };

    const TRAIL_LIFE = 520; // ms
    const drawCursor = (dt: number, now: number) => {
      if (!cursorSeen) return;

      // Presence ramps up quickly on movement and fades after ~2s idle; the
      // speed estimate decays between pointer events so a stopped mouse
      // stops shedding sparks.
      const idle = (now - lastCursorMove) / 1000;
      const target = idle < 2.2 ? 1 : 0;
      presence += (target - presence) * Math.min(1, dt * (target ? 6 : 1.6));
      cursorSpeed *= Math.max(0, 1 - dt * 5);
      if (presence < 0.01 && !sparks.length && !trail.length) return;

      const rush = Math.min(1, cursorSpeed / 1400);

      // Comet head chases the pointer.
      const k = Math.min(1, dt * 14);
      headX += (cursorX - headX) * k;
      headY += (cursorY - headY) * k;

      // Tail: history of head positions, drawn as a tapering streak.
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(headX - last.x, headY - last.y) > 1.5) {
        trail.push({ x: headX, y: headY, t: now });
      }
      while (trail.length && now - trail[0].t > TRAIL_LIFE) trail.shift();
      if (trail.length > 70) trail.splice(0, trail.length - 70);

      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        const life = 1 - (now - b.t) / TRAIL_LIFE;
        if (life <= 0) continue;
        const alpha = life * life * (0.3 + 0.5 * rush) * presence;
        ctx.strokeStyle = `rgba(255,240,222,${alpha.toFixed(3)})`;
        ctx.lineWidth = 0.6 + 2.8 * life;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Head: warm halo swelling with speed, hot white core.
      const halo = 36 + 44 * rush;
      ctx.globalAlpha = 0.5 * presence;
      ctx.drawImage(warmSprite, headX - halo / 2, headY - halo / 2, halo, halo);
      ctx.globalAlpha = 0.95 * presence;
      ctx.drawImage(whiteSprite, headX - 6, headY - 6, 12, 12);
      ctx.globalAlpha = 1;

      // Sparks: shed backwards off the head once the pointer moves briskly,
      // each a tiny meteor with its own tail.
      sparkBudget += dt * Math.max(0, cursorSpeed - 350) * 0.022 * presence;
      while (sparkBudget >= 1 && sparks.length < 90) {
        sparkBudget -= 1;
        const back = 90 + Math.random() * 240;
        const side = (Math.random() - 0.5) * 260;
        sparks.push({
          x: headX + (Math.random() - 0.5) * 10,
          y: headY + (Math.random() - 0.5) * 10,
          vx: -cursorDirX * back - cursorDirY * side,
          vy: -cursorDirY * back + cursorDirX * side,
          age: 0,
          life: 0.45 + Math.random() * 0.5,
        });
      }
      sparkBudget = Math.min(sparkBudget, 3);

      ctx.lineWidth = 1.3;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        const drag = Math.max(0, 1 - dt * 1.4);
        s.vx *= drag;
        s.vy *= drag;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const t = s.age / s.life;
        const alpha = Math.sin(Math.PI * t) * 0.85;
        const tailX = s.x - s.vx * 0.09;
        const tailY = s.y - s.vy * 0.09;
        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255,248,236,${alpha.toFixed(3)})`);
        gradient.addColorStop(1, "rgba(255,228,196,0)");
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }
    };

    const drawFrame = (dt: number, now: number) => {
      elapsed += dt;
      ctx.clearRect(0, 0, width, height);

      const lerp = Math.min(1, dt * 3.5);
      pointerX += (targetPointerX - pointerX) * lerp;
      pointerY += (targetPointerY - pointerY) * lerp;

      const scroll = window.scrollY;
      const warpT = Math.min(1, warpElapsed / warpDuration);
      const warp = (1 - warpT) * (1 - warpT);
      const cx = width / 2;
      const cy = height / 2;

      ctx.globalCompositeOperation = "lighter";

      // Ambient background stars (streaked during warp).
      for (const layer of ambientLayers) {
        const offY =
          scroll * layer.parallax +
          elapsed * layer.drift +
          pointerY * 20 * layer.parallax;
        const offX = pointerX * 26 * layer.parallax;

        for (const star of layer.stars) {
          let sy = (star.y - offY) % fieldHeight;
          if (sy < 0) sy += fieldHeight;
          sy -= 180;
          let sx = star.x + offX;
          if (sx < -30) sx += width + 60;
          else if (sx > width + 30) sx -= width + 60;
          if (sy < -30 || sy > height + 30) continue;

          const twinkle =
            star.alpha *
            (0.7 + 0.3 * Math.sin(elapsed * star.twinkleSpeed + star.phase));

          // Streaks cross-fade into dots over the tail of the warp — a hard
          // cutoff makes every star pop from line to sprite on one frame.
          const streak = Math.min(1, warp / 0.12);
          if (streak > 0.02) {
            const dx = sx - cx;
            const dy = sy - cy;
            const near = 1 + warp * 0.06;
            const far = 1 + warp * (0.5 + layer.parallax * 0.4);
            ctx.strokeStyle = `rgba(240,244,252,${Math.min(1, (twinkle + warp * 0.5) * streak)})`;
            ctx.lineWidth = star.size;
            ctx.beginPath();
            ctx.moveTo(cx + dx * near, cy + dy * near);
            ctx.lineTo(cx + dx * far, cy + dy * far);
            ctx.stroke();
          }
          if (streak < 1) {
            const drawSize = star.size * 4;
            ctx.globalAlpha = twinkle * (1 - streak);
            ctx.drawImage(
              star.sprite,
              sx - drawSize / 2,
              sy - drawSize / 2,
              drawSize,
              drawSize,
            );
            ctx.globalAlpha = 1;
          }
        }
      }

      // The spiral galaxy: fades in as the warp settles, then keeps turning.
      const galaxyAlpha = Math.pow(warpT, 1.5);
      if (galaxyAlpha > 0.01) {
        const rotation =
          -(elapsed * IDLE_SPIN + scroll * SCROLL_SPIN) + warp * 0.7;
        const center = galaxyCenter(width, height, scroll);
        const gx = center.x + pointerX * 16;
        const gy = center.y + pointerY * 12;

        ctx.save();
        ctx.translate(gx, gy);
        ctx.rotate(PLANE);
        ctx.scale(1, TILT);
        ctx.globalAlpha = 0.85 * galaxyAlpha;
        const glowSize = galaxyRadius * 1.7;
        ctx.drawImage(coreGlow, -glowSize / 2, -glowSize / 2, glowSize, glowSize);
        ctx.globalAlpha = galaxyAlpha;
        const coreSize = galaxyRadius * 0.5;
        ctx.drawImage(coreGlow, -coreSize / 2, -coreSize / 2, coreSize, coreSize);
        ctx.restore();

        for (const star of galaxyStars) {
          const a = star.angle + rotation;
          const u = Math.cos(a) * star.r;
          const v = Math.sin(a) * star.r * TILT;
          const x = gx + u * cosPlane - v * sinPlane;
          const y = gy + u * sinPlane + v * cosPlane;
          if (x < -40 || x > width + 40 || y < -40 || y > height + 40) {
            continue;
          }
          const twinkle =
            star.alpha *
            (0.75 + 0.25 * Math.sin(elapsed * star.twinkleSpeed + star.phase)) *
            galaxyAlpha;
          const drawSize = star.size * 3.4;
          ctx.globalAlpha = twinkle;
          ctx.drawImage(
            star.sprite,
            x - drawSize / 2,
            y - drawSize / 2,
            drawSize,
            drawSize,
          );
        }
        ctx.globalAlpha = 1;
      }

      // Panels in orbit: a comet trail of light runs behind each glass pane
      // riding in (flowIn.ts registers the very path the DOM animation
      // follows). The head sits under the pane, so its glow bleeds through
      // the frosted glass; the tail streaks across open sky behind it.
      if (!reducedMotion) drawFlights(now, scroll);

      // Docking pulses.
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.age += dt;
        if (pulse.age >= pulse.life) {
          pulses.splice(i, 1);
          continue;
        }
        const t = pulse.age / pulse.life;
        const ease = 1 - Math.pow(1 - t, 3);
        const radius = 18 + 170 * ease;
        ctx.save();
        ctx.translate(pulse.x, pulse.y);
        ctx.rotate(PLANE);
        ctx.scale(1, TILT);
        ctx.strokeStyle = `rgba(255,236,212,${(0.22 * (1 - t)).toFixed(3)})`;
        ctx.lineWidth = 0.5 + 1.5 * (1 - t);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Shooting stars (only once the warp has settled).
      if (!reducedMotion && warpT >= 1) {
        nextMeteorIn -= dt;
        if (nextMeteorIn <= 0) {
          spawnMeteor();
          nextMeteorIn = 4.5 + Math.random() * 7;
        }
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        meteor.age += dt;
        if (meteor.age >= meteor.life) {
          meteors.splice(i, 1);
          continue;
        }
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        const t = meteor.age / meteor.life;
        const alpha = Math.sin(Math.PI * t) * 0.9;
        const tailX = meteor.x - meteor.vx * 0.11;
        const tailY = meteor.y - meteor.vy * 0.11;
        const gradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          tailX,
          tailY,
        );
        gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
        gradient.addColorStop(0.3, `rgba(226,232,244,${alpha * 0.55})`);
        gradient.addColorStop(1, "rgba(226,232,244,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // Cursor comet rides on top of everything else on the canvas (still
      // behind the glass panels, where it blooms through the frost).
      if (!reducedMotion && warpT >= 1) drawCursor(dt, now);

      ctx.globalCompositeOperation = "source-over";

      if (warpT < 1) warpElapsed += dt;
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      drawFrame(dt, now);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Ignore small height changes (mobile URL bar) to avoid star flicker.
      if (
        !ambientLayers.length ||
        Math.abs(width - builtWidth) > 2 ||
        Math.abs(height - builtHeight) > 260
      ) {
        buildScene();
      }
      if (reducedMotion) drawFrame(0, performance.now());
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onPointerMove = (event: PointerEvent) => {
      targetPointerX = event.clientX / width - 0.5;
      targetPointerY = event.clientY / height - 0.5;

      if (!hoverCapable || event.pointerType === "touch") return;
      const now = performance.now();
      const x = event.clientX;
      const y = event.clientY;
      if (cursorSeen) {
        const dx = x - cursorX;
        const dy = y - cursorY;
        const dist = Math.hypot(dx, dy);
        const dtMs = Math.max(8, now - lastCursorMove);
        const inst = Math.min(4000, (dist / dtMs) * 1000);
        cursorSpeed += (inst - cursorSpeed) * 0.4;
        if (dist > 0.5) {
          cursorDirX = dx / dist;
          cursorDirY = dy / dist;
        }
      } else {
        // First contact: materialise at the pointer instead of flying in
        // from the origin.
        cursorSeen = true;
        headX = x;
        headY = y;
      }
      cursorX = x;
      cursorY = y;
      lastCursorMove = now;
    };
    const onPointerLeave = () => {
      // Let presence fade out when the pointer leaves the window.
      lastCursorMove = -1e9;
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onPointerLeave);
      window.addEventListener("blur", onPointerLeave);
      start();
    }

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
    };
  });
</script>

<div class="galaxy" role="presentation" transition:fade|global={{ duration: 600 }}>
  <div class="nebula"></div>
  <canvas bind:this={canvas}></canvas>
  <div class="vignette"></div>
</div>

<style>
  .galaxy {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
    background: #010102;
  }

  /* Near-black space with the faintest warm haze where the galaxy core sits
     and neutral dust towards the edges — no blue wash. */
  .nebula {
    position: absolute;
    inset: -12%;
    background:
      radial-gradient(
        46% 38% at 50% 44%,
        rgba(255, 216, 176, 0.05),
        transparent 68%
      ),
      radial-gradient(
        60% 52% at 24% 74%,
        rgba(140, 144, 160, 0.045),
        transparent 70%
      ),
      radial-gradient(
        52% 46% at 78% 22%,
        rgba(150, 148, 170, 0.04),
        transparent 72%
      ),
      radial-gradient(130% 100% at 50% 8%, #05060b 0%, #020206 48%, #010102 100%);
    animation: nebula-drift 110s ease-in-out infinite alternate;
  }

  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      120% 95% at 50% 40%,
      transparent 52%,
      rgba(0, 0, 0, 0.55) 100%
    );
  }

  @keyframes nebula-drift {
    to {
      transform: translate3d(1.8%, -1.4%, 0) scale(1.04);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nebula {
      animation: none;
    }
  }
</style>
