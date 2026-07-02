import type { ActionReturn } from "svelte/action";

interface FlowInOptions {
  delay?: number;
}

/**
 * Marks an element as a galaxy-mode "flow" panel: in galaxy mode it starts
 * deep in the bottom right and swings into place once it enters the viewport,
 * and the entrance reverses when it exits through the bottom again (so
 * scrolling back down replays it). Panels that exit through the top stay
 * settled. All visuals live in space.scss under `html.space`, so the action
 * has no effect in the default theme. When galaxy mode is switched on, every
 * panel re-arms so the sections currently on screen fly in again.
 */
export function flowIn(
  node: HTMLElement,
  options: FlowInOptions = {},
): ActionReturn<FlowInOptions> {
  node.classList.add("space-flow");
  if (options.delay) {
    node.style.setProperty("--flow-delay", `${options.delay}ms`);
  }

  let observer: IntersectionObserver | null = null;

  const observe = () => {
    observer?.disconnect();
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("flow-in");
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

  observe();
  window.addEventListener("space:on", arm);

  return {
    destroy() {
      observer?.disconnect();
      window.removeEventListener("space:on", arm);
    },
  };
}
