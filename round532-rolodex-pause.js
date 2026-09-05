/* Automated Hearts Round 1094 — Rolodex continuous-behind-shutter authority.
   The right Home machine keeps its cards moving whether its local shutter is
   raised or lowered. Only a genuinely hidden browser tab pauses the loop. */
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

  /* Deliberately ignore engine-visibility/viewport-activity messages from the
     parent. They represent the shutter or page shield, not permission to stop
     this lightweight card carousel. */
  document.addEventListener('visibilitychange', sync);

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.screen .meta').forEach((node) => node.remove());
  }, { once: true });
})();
