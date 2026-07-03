<script lang="ts">
  import { onMount } from "svelte";
  import {
    space,
    toggleSpace,
    hasSeenSpace,
  } from "$lib/space/spaceMode.svelte";

  let nudge = $state(false);

  onMount(() => {
    // The thumb tugs for attention until the visitor has flipped it once.
    nudge = !hasSeenSpace();
  });

  function handleClick() {
    nudge = false;
    // Turning it on from the footer: glide back to the top first so the
    // galaxy forms and the sections fly in from a clean starting point.
    if (!space.on) {
      scrollToTopThen(toggleSpace);
    } else {
      toggleSpace();
    }
  }

  function scrollToTopThen(action: () => void) {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (window.scrollY < 4 || reduced) {
      window.scrollTo(0, 0);
      action();
      return;
    }

    let fired = false;
    const run = () => {
      if (fired) return;
      fired = true;
      window.removeEventListener("scrollend", run);
      action();
    };

    // `scrollend` fires when the smooth scroll settles; the timeout is a
    // fallback for browsers that don't emit it.
    window.addEventListener("scrollend", run);
    setTimeout(run, 1000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<button
  type="button"
  class="galaxy-toggle"
  class:nudge
  role="switch"
  aria-checked={space.on}
  aria-label="Galaxy mode"
  onclick={handleClick}
>
  <span class="halo" role="presentation"></span>
  <span class="track">
    <span class="thumb"></span>
  </span>
  <span class="label">galaxy mode</span>
</button>

<style>
  /* No box — sits inline in the footer like a quiet link that happens to
     carry a switch. */
  .galaxy-toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    border: 0;
    background: none;
    color: #6b7280;
    font: inherit;
    font-size: 0.875rem;
    line-height: 1;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 0.15s ease;
  }

  /* Galaxy mode is a desktop-only easter egg — hide the toggle on mobile. */
  @media (max-width: 639px) {
    .galaxy-toggle {
      display: none;
    }
  }

  .galaxy-toggle:hover {
    color: #1f2937;
  }

  .galaxy-toggle:focus-visible {
    outline: 2px solid #0369a1;
    outline-offset: 3px;
    border-radius: 2px;
  }

  /* The switch */
  .track {
    position: relative;
    width: 34px;
    height: 18px;
    flex: none;
    border-radius: 9px;
    background: #e5e7eb;
    box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.12);
    transition: background-color 0.35s ease, box-shadow 0.35s ease;
  }

  .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.3),
      0 0 0 1px rgba(15, 23, 42, 0.06);
    transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1),
      background-color 0.35s ease, box-shadow 0.35s ease;
  }

  /* Leans towards "on" when hovered, squishes when pressed. */
  .galaxy-toggle:hover .thumb {
    transform: translateX(4px);
  }

  .galaxy-toggle:active .thumb {
    transform: translateX(7px) scale(0.9);
  }

  .halo {
    position: absolute;
    inset: -2px;
    border-radius: 3px;
    border: 1px solid rgba(3, 105, 161, 0.5);
    opacity: 0;
    pointer-events: none;
  }

  /* The "it wants to be flipped" act: a little impatient hop, then a big
     thumb tug towards the on side while the whole switch hops and rocks.
     Pauses on hover. */
  .nudge:not(:hover) {
    animation: galaxy-toggle-rock 3.6s ease-in-out infinite 1.2s;
  }

  .nudge:not(:hover) .thumb {
    animation: galaxy-toggle-tug 3.6s cubic-bezier(0.34, 1.56, 0.64, 1)
      infinite 1.2s;
  }

  .nudge:not(:hover) .halo {
    animation: galaxy-toggle-ping 3.6s cubic-bezier(0.16, 1, 0.3, 1) infinite
      1.2s;
  }

  /* Galaxy mode: night-sky track with stars, glowing moon thumb. */
  :global(html.space) .galaxy-toggle {
    color: #7f8492;
  }

  :global(html.space) .galaxy-toggle:hover {
    color: #e7e9ee;
  }

  :global(html.space) .track {
    background: #06070c;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.18),
      inset 0 1px 3px rgba(0, 0, 0, 0.8);
  }

  /* Tiny stars in the night-side of the track. */
  :global(html.space) .track::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      radial-gradient(1px 1px at 22% 36%, rgba(255, 255, 255, 0.9), transparent 60%),
      radial-gradient(1px 1px at 42% 68%, rgba(255, 255, 255, 0.55), transparent 60%),
      radial-gradient(1.4px 1.4px at 33% 55%, rgba(255, 224, 189, 0.7), transparent 60%);
  }

  :global(html.space) .thumb {
    transform: translateX(16px);
    background: #ffffff;
    box-shadow:
      0 0 8px rgba(255, 255, 255, 0.9),
      0 0 18px rgba(255, 255, 255, 0.35);
  }

  :global(html.space) .galaxy-toggle:hover .thumb {
    transform: translateX(16px);
    box-shadow:
      0 0 10px rgba(255, 255, 255, 1),
      0 0 26px rgba(255, 255, 255, 0.5);
  }

  :global(html.space) .galaxy-toggle:active .thumb {
    transform: translateX(13px) scale(0.9);
  }

  :global(html.space) .halo {
    border-color: rgba(255, 255, 255, 0.5);
  }

  @keyframes galaxy-toggle-tug {
    0%,
    18%,
    52%,
    72%,
    100% {
      transform: translateX(0);
    }
    /* impatient mini-tug */
    6% {
      transform: translateX(5px) scaleX(1.08);
    }
    11% {
      transform: translateX(-1px) scaleX(0.95);
    }
    /* the big one */
    57% {
      transform: translateX(9px) scaleX(1.14);
    }
    62% {
      transform: translateX(-2px) scaleX(0.92);
    }
    67% {
      transform: translateX(5px);
    }
  }

  @keyframes galaxy-toggle-rock {
    0%,
    18%,
    52%,
    73%,
    100% {
      transform: none;
    }
    /* little hop */
    6% {
      transform: translateY(-2px) rotate(-1.1deg) scale(1.02);
    }
    11% {
      transform: translateY(0) rotate(0.6deg);
    }
    /* bigger hop with the big tug */
    57% {
      transform: translateY(-3px) rotate(-1.6deg) scale(1.045);
    }
    62% {
      transform: translateY(1px) rotate(1deg) scale(0.985);
    }
    67% {
      transform: translateY(-1px);
    }
  }

  @keyframes galaxy-toggle-ping {
    0%,
    52% {
      opacity: 0;
      transform: scale(1);
    }
    56% {
      opacity: 0.75;
    }
    85%,
    100% {
      opacity: 0;
      transform: scale(1.9);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nudge:not(:hover),
    .nudge:not(:hover) .thumb,
    .nudge:not(:hover) .halo {
      animation: none;
    }
  }
</style>
