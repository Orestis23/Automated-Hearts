/* Automated Hearts Round 1376 DOM cleanup */
(() => {
  const apply = () => {
    const mobileMessage = document.querySelector('body > a.message');
    if (mobileMessage) {
      mobileMessage.style.setProperty('left', 'auto', 'important');
      mobileMessage.style.setProperty('right', '14px', 'important');
      mobileMessage.style.setProperty('top', 'calc(env(safe-area-inset-top,0px) + 12px)', 'important');
      mobileMessage.style.setProperty('bottom', 'auto', 'important');
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
