/* Round 1924 — Rolodex hidden-tab RAF gate.
   Home-window start/stop timing is handled by the Rolodex page itself so its
   first live frame can match the deterministic poster before motion begins. */
(() => {
  "use strict";
  const nativeRequest = window.requestAnimationFrame.bind(window);
  const nativeCancel = window.cancelAnimationFrame.bind(window);
  let nextId = 1;
  let documentActive = !document.hidden;
  const scheduled = new Map();
  const held = new Map();

  window.requestAnimationFrame = (callback) => {
    const id = nextId++;
    if (!documentActive) {
      held.set(id, callback);
      return id;
    }
    const nativeId = nativeRequest((time) => {
      scheduled.delete(id);
      callback(time);
    });
    scheduled.set(id, nativeId);
    return id;
  };

  window.cancelAnimationFrame = (id) => {
    held.delete(id);
    const nativeId = scheduled.get(id);
    if (nativeId !== undefined) {
      scheduled.delete(id);
      nativeCancel(nativeId);
    }
  };

  const sync = () => {
    documentActive = !document.hidden;
    document.documentElement.classList.toggle('r532-render-paused', !documentActive);
    if (!documentActive || !held.size) return;
    const callbacks = [...held.entries()];
    held.clear();
    callbacks.forEach(([id, callback]) => {
      const nativeId = nativeRequest((time) => {
        scheduled.delete(id);
        callback(time);
      });
      scheduled.set(id, nativeId);
    });
  };

  /* Parent window activity is handled by the page-level motion gate. This helper
     only suspends RAF work when the browser document itself is hidden. */
  document.addEventListener('visibilitychange', sync);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.screen .meta').forEach((node) => node.remove());
  }, { once: true });
})();
