/**
 * Moves an element to document.body. Needed for fullscreen overlays that
 * live inside space-mode glass panels: backdrop-filter creates a containing
 * block, which would make `position: fixed` children position relative to
 * the panel instead of the viewport.
 */
export function portal(node: HTMLElement) {
  document.body.appendChild(node);
  return {
    destroy() {
      node.parentNode?.removeChild(node);
    },
  };
}
