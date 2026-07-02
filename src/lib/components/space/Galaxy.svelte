<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

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
    // on screen. Rotation combines a slow idle spin with scroll, so scrolling
    // down turns the galaxy right-to-left across its top edge.
    const TILT = 0.46;
    const PLANE = -0.42;
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

    const drawFrame = (dt: number) => {
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

          if (warp > 0.015) {
            const dx = sx - cx;
            const dy = sy - cy;
            const near = 1 + warp * 0.06;
            const far = 1 + warp * (0.5 + layer.parallax * 0.4);
            ctx.strokeStyle = `rgba(240,244,252,${Math.min(1, twinkle + warp * 0.5)})`;
            ctx.lineWidth = star.size;
            ctx.beginPath();
            ctx.moveTo(cx + dx * near, cy + dy * near);
            ctx.lineTo(cx + dx * far, cy + dy * far);
            ctx.stroke();
          } else {
            const drawSize = star.size * 4;
            ctx.globalAlpha = twinkle;
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
        const gx = width * 0.5 + pointerX * 16;
        const gy =
          height * 0.46 -
          Math.min(scroll * 0.03, height * 0.1) +
          pointerY * 12;

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

      ctx.globalCompositeOperation = "source-over";

      if (warpT < 1) warpElapsed += dt;
    };

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      drawFrame(dt);
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
      if (reducedMotion) drawFrame(0);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onPointerMove = (event: PointerEvent) => {
      targetPointerX = event.clientX / width - 0.5;
      targetPointerY = event.clientY / height - 0.5;
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      start();
    }

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
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
