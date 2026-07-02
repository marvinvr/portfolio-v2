<script lang="ts">
  import { onMount } from "svelte";
  import { Rocket } from "lucide-svelte";
  import {
    space,
    toggleSpace,
    hasSeenSpace,
  } from "$lib/space/spaceMode.svelte";

  let nudge = $state(false);

  onMount(() => {
    // Bounce for attention until the visitor has tried it once.
    nudge = !hasSeenSpace();
  });

  function handleClick() {
    nudge = false;
    toggleSpace();
  }
</script>

<button
  type="button"
  class="space-toggle"
  class:nudge
  aria-pressed={space.on}
  aria-label={space.on ? "Leave space mode" : "Enter space mode"}
  onclick={handleClick}
>
  <span class="halo" role="presentation"></span>
  <span class="chip">
    <Rocket class="rocket" size={15} strokeWidth={2.2} />
    <span class="label">{space.on ? "back to earth" : "space mode"}</span>
  </span>
</button>

<style>
  .space-toggle {
    position: fixed;
    top: max(0.75rem, env(safe-area-inset-top));
    left: max(0.75rem, env(safe-area-inset-left));
    z-index: 40;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    cursor: pointer;
  }

  .chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.45rem 0.8rem;
    border: 1px solid #e5e7eb;
    border-radius: 2px;
    background: #ffffff;
    color: #374151;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1;
    transition:
      transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
      background-color 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.35s ease;
  }

  .space-toggle:hover .chip {
    transform: translateY(-1px) scale(1.045);
    border-color: #d1d5db;
    background: #f9fafb;
    color: #111827;
    box-shadow: 0 2px 10px -2px rgba(15, 23, 42, 0.12);
  }

  .space-toggle:active .chip {
    transform: scale(0.92);
    transition-duration: 0.08s;
  }

  .space-toggle:focus-visible .chip {
    outline: 2px solid #0369a1;
    outline-offset: 2px;
  }

  .space-toggle :global(.rocket) {
    color: #0369a1;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .space-toggle:hover :global(.rocket) {
    transform: rotate(-40deg);
  }

  .halo {
    position: absolute;
    inset: -2px;
    border-radius: 3px;
    border: 1px solid rgba(3, 105, 161, 0.55);
    opacity: 0;
    pointer-events: none;
  }

  .nudge .chip {
    animation: space-toggle-bump 7s ease-in-out infinite 2.5s;
  }

  .nudge .halo {
    animation: space-toggle-ping 7s cubic-bezier(0.16, 1, 0.3, 1) infinite 2.5s;
  }

  /* Space-mode look: glowing glass pill, rocket launched. */
  :global(html.space) .chip {
    border-color: rgba(148, 163, 201, 0.3);
    background: rgba(148, 163, 201, 0.1);
    color: #e2eaf9;
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    box-shadow:
      0 0 22px rgba(56, 189, 248, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  :global(html.space) .space-toggle:hover .chip {
    border-color: rgba(148, 163, 201, 0.5);
    background: rgba(148, 163, 201, 0.18);
    color: #ffffff;
    box-shadow:
      0 0 30px rgba(56, 189, 248, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }

  :global(html.space) .space-toggle :global(.rocket) {
    color: #7dd3fc;
    transform: rotate(-40deg);
    filter: drop-shadow(0 0 6px rgba(125, 211, 252, 0.7));
  }

  :global(html.space) .space-toggle:hover :global(.rocket) {
    transform: rotate(-40deg) translate(1px, -2px);
  }

  :global(html.space) .halo {
    border-color: rgba(125, 211, 252, 0.6);
  }

  @keyframes space-toggle-bump {
    0%,
    82%,
    100% {
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
    86% {
      transform: translate3d(0, -3px, 0) rotate(-3deg) scale(1.07);
    }
    90% {
      transform: translate3d(0, 1px, 0) rotate(2deg) scale(0.96);
    }
    94% {
      transform: translate3d(0, -1px, 0) scale(1.03);
    }
  }

  @keyframes space-toggle-ping {
    0%,
    82% {
      opacity: 0;
      transform: scale(1);
    }
    84% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: scale(2.1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .nudge .chip,
    .nudge .halo {
      animation: none;
    }
  }
</style>
