/* Automated Hearts Round 1096 — shared frame gate for legacy model pages. */
(() => {
  'use strict';
  if (window.__AH1096ModelFrameGate) return;
  window.__AH1096ModelFrameGate = 1;

  const nativeRequest = window.requestAnimationFrame.bind(window);
  const nativeCancel = window.cancelAnimationFrame.bind(window);
  let sequence = 1;
  let hostActive = true;
  let viewportActive = true;
  const queued = new Map();
  const running = new Map();
  const isActive = () => hostActive && viewportActive && !document.hidden;

  const schedule = (id, callback) => {
    const nativeId = nativeRequest((time) => {
      running.delete(id);
      if (!isActive()) {
        queued.set(id, callback);
        return;
      }
      callback(time);
    });
    running.set(id, nativeId);
  };

  const resume = () => {
    if (!isActive() || !queued.size) return;
    const pending = [...queued];
    queued.clear();
    pending.forEach(([id, callback]) => schedule(id, callback));
  };

  window.requestAnimationFrame = (callback) => {
    const id = sequence++;
    if (isActive()) schedule(id, callback);
    else queued.set(id, callback);
    return id;
  };

  window.cancelAnimationFrame = (id) => {
    queued.delete(id);
    const nativeId = running.get(id);
    if (nativeId !== undefined) {
      nativeCancel(nativeId);
      running.delete(id);
    }
  };

  window.addEventListener('message', (event) => {
    const data = event.data || {};
    if (data.type === 'engine-visibility') hostActive = !!data.visible;
    else if (data.type === 'automated-hearts:learning-activity') hostActive = !!data.active;
    else if (data.type === 'automated-hearts:viewport-activity') viewportActive = !!data.active;
    else return;
    resume();
  });
  document.addEventListener('visibilitychange', resume, { passive:true });
})();
