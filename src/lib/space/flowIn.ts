import type { ActionReturn } from "svelte/action";

interface FlowInOptions {
  delay?: number;
}

/**
 * Marks an element as a space-mode "flow" panel: in space mode it starts
 * shifted towards the bottom left and glides into place once it enters the
 * viewport. All visuals live in space.scss under `html.space`, so the action
 * has no effect in the default theme. When space mode is switched on, every
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

  const arm = () => {
    observer?.disconnect();
    node.classList.remove("flow-in");
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.classList.add("flow-in");
          observer?.disconnect();
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -4% 0px" },
    );
    observer.observe(node);
  };

  arm();
  window.addEventListener("space:on", arm);

  return {
    destroy() {
      observer?.disconnect();
      window.removeEventListener("space:on", arm);
    },
  };
}
