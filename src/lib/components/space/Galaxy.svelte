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

    interface Star {
      x: number;
      y: number;
      size: number;
      sprite: HTMLCanvasElement;
      alpha: number;
      twinkleSpeed: number;
      phase: number;
    }
    interface Layer {
      parallax: number;
      drift: number;
      stars: Star[];
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
    let layers: Layer[] = [];
    let meteors: Meteor[] = [];
    let nextMeteorIn = 2.8;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let rafId = 0;
    let running = false;
    let lastTime = 0;
    let elapsed = 0;

    // Hyperspace intro: stars streak radially while warp decays 1 -> 0.
    const warpDuration = 1.4;
    let warpElapsed = reducedMotion ? warpDuration : 0;

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
    const sprites = [
      makeSprite(255, 255, 255), // white
      makeSprite(186, 230, 253), // ice blue
      makeSprite(165, 243, 252), // teal
      makeSprite(253, 230, 138), // warm
    ];
    const pickSprite = () => {
      const roll = Math.random();
      if (roll < 0.6) return sprites[0];
      if (roll < 0.78) return sprites[1];
      if (roll < 0.92) return sprites[2];
      return sprites[3];
    };

    const buildField = () => {
      builtWidth = width;
      builtHeight = height;
      // Taller than the viewport so scroll parallax can wrap seamlessly, with
      // enough buffer that mobile URL-bar resizes don't force a rebuild.
      fieldHeight = height + 360;
      const specs = [
        { parallax: 0.14, drift: 2.4, density: 15000, min: 0.5, max: 1.05 },
        { parallax: 0.38, drift: 4.2, density: 26000, min: 0.8, max: 1.7 },
        { parallax: 0.8, drift: 6.5, density: 46000, min: 1.3, max: 2.5 },
      ];
      layers = specs.map((spec) => ({
        parallax: spec.parallax,
        drift: spec.drift,
        stars: Array.from(
          { length: Math.round((width * fieldHeight) / spec.density) },
          () => ({
            x: Math.random() * width,
            y: Math.random() * fieldHeight,
            size: spec.min + Math.random() * (spec.max - spec.min),
            sprite: pickSprite(),
            alpha: 0.35 + Math.random() * 0.6,
            twinkleSpeed: 0.8 + Math.random() * 2.6,
            phase: Math.random() * Math.PI * 2,
          }),
        ),
      }));
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

      for (const layer of layers) {
        const offY =
          scroll * layer.parallax +
          elapsed * layer.drift +
          pointerY * 22 * layer.parallax;
        const offX = pointerX * 30 * layer.parallax;

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
            // Streak star radially away from the viewport center.
            const dx = sx - cx;
            const dy = sy - cy;
            const near = 1 + warp * 0.06;
            const far = 1 + warp * (0.5 + layer.parallax * 0.35);
            ctx.strokeStyle = `rgba(214,230,255,${Math.min(1, twinkle + warp * 0.5)})`;
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
        gradient.addColorStop(0.3, `rgba(165,224,252,${alpha * 0.55})`);
        gradient.addColorStop(1, "rgba(165,224,252,0)");
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
        !layers.length ||
        Math.abs(width - builtWidth) > 2 ||
        Math.abs(height - builtHeight) > 260
      ) {
        buildField();
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
  <div class="band"></div>
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
    background: #05070f;
  }

  .nebula {
    position: absolute;
    inset: -14%;
    background:
      radial-gradient(
        42% 34% at 18% 78%,
        hsla(193, 67%, 40%, 0.3),
        transparent 68%
      ),
      radial-gradient(
        36% 30% at 78% 22%,
        hsla(258, 50%, 42%, 0.24),
        transparent 70%
      ),
      radial-gradient(
        28% 24% at 62% 74%,
        hsla(320, 55%, 38%, 0.13),
        transparent 72%
      ),
      radial-gradient(
        46% 40% at 40% 30%,
        hsla(199, 80%, 50%, 0.1),
        transparent 70%
      ),
      radial-gradient(120% 90% at 50% 12%, #0b1226 0%, #070b18 45%, #04060e 100%);
    animation: nebula-drift 90s ease-in-out infinite alternate;
  }

  .band {
    position: absolute;
    inset: -25%;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(190, 214, 255, 0.045) 47%,
      rgba(214, 231, 255, 0.085) 50%,
      rgba(190, 214, 255, 0.045) 53%,
      transparent 60%
    );
    transform: rotate(-16deg);
    animation: band-drift 120s ease-in-out infinite alternate;
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
      120% 95% at 50% 38%,
      transparent 55%,
      rgba(2, 4, 11, 0.5) 100%
    );
  }

  @keyframes nebula-drift {
    to {
      transform: translate3d(2.2%, -1.6%, 0) scale(1.05);
    }
  }

  @keyframes band-drift {
    from {
      transform: rotate(-16deg) translate3d(-1.5%, 0, 0);
    }
    to {
      transform: rotate(-16deg) translate3d(1.5%, 1%, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nebula,
    .band {
      animation: none;
    }
  }
</style>
