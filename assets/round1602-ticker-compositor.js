/* Round 1711 — ticker clarity + smooth compositor authority.
   - Keep exactly two identical loops, so -50% is one exact loop.
   - Start only after fonts settle to prevent width/duration jumps.
   - Keep a constant compositor-driven pixel speed.
   - Reduce the upper glass glare, remove lens blur, strengthen the LED text,
     and keep a symmetrical expanded breathing zone around every gold human separator. */
(() => {
  'use strict';

  const DESKTOP_LEFT_GAP = '144px';
  const DESKTOP_RIGHT_GAP = '144px';
  const MOBILE_LEFT_GAP = '96px';
  const MOBILE_RIGHT_GAP = '96px';
  const PIXELS_PER_SECOND = 27;

  const setImportant = (el, prop, value) => {
    if (el) el.style.setProperty(prop, value, 'important');
  };

  const tuneTube = (root) => {
    const shell = root.querySelector('#home-charity-ticker');
    if (!shell) return;

    /* Crisp rounded tube: the bright reflection is deliberately confined to
       the very top of the glass so it no longer washes over the lettering. */
    setImportant(shell, 'border', '2px solid rgba(232,249,252,.96)');
    setImportant(shell, 'border-radius', '28px');
    setImportant(shell, 'background', [
      'radial-gradient(170% 58% at 50% -24%,rgba(255,255,255,.28) 0%,rgba(226,248,252,.10) 13%,rgba(166,225,237,.035) 21%,rgba(255,255,255,0) 30%)',
      'radial-gradient(130% 76% at 50% 122%,rgba(74,181,211,.13) 0%,rgba(20,67,89,.035) 51%,transparent 70%)',
      'linear-gradient(180deg,#15394e 0%,#0c2a3d 24%,#071b2a 56%,#04111c 78%,#02090f 100%)'
    ].join(','));
    setImportant(shell, 'box-shadow', [
      'inset 0 1px 0 rgba(255,255,255,.58)',
      'inset 0 3px 6px rgba(181,235,245,.07)',
      'inset 0 -7px 10px rgba(0,0,0,.48)',
      'inset 6px 0 8px rgba(146,224,239,.055)',
      'inset -6px 0 8px rgba(146,224,239,.055)',
      '0 2px 4px rgba(0,0,0,.42)'
    ].join(','));

    const lens = shell.querySelector('.r966-ticker-bubble-lens');
    if (lens) {
      setImportant(lens, 'inset', '2px');
      setImportant(lens, 'border-radius', '25px');
      setImportant(lens, 'border', '1px solid rgba(223,248,252,.22)');
      setImportant(lens, 'background', [
        'linear-gradient(180deg,rgba(255,255,255,.11) 0%,rgba(255,255,255,.038) 6%,rgba(255,255,255,.010) 11%,transparent 17%,transparent 74%,rgba(0,0,0,.025) 86%,rgba(0,0,0,.08) 100%)',
        'radial-gradient(145% 42% at 50% -3%,rgba(245,255,255,.16) 0%,rgba(206,241,248,.045) 42%,transparent 69%)',
        'radial-gradient(120% 62% at 50% 118%,rgba(94,206,228,.08) 0%,rgba(24,74,94,.025) 54%,transparent 72%)'
      ].join(','));
      setImportant(lens, 'box-shadow', [
        'inset 0 1px 0 rgba(255,255,255,.16)',
        'inset 0 -5px 8px rgba(0,0,0,.17)',
        'inset 4px 0 6px rgba(188,240,248,.055)',
        'inset -4px 0 6px rgba(188,240,248,.055)'
      ].join(','));
      setImportant(lens, '-webkit-backdrop-filter', 'none');
      setImportant(lens, 'backdrop-filter', 'none');
      setImportant(lens, 'mix-blend-mode', 'normal');
      setImportant(lens, 'opacity', '1');
    }

    /* Retire the older auxiliary glare layer completely. */
    shell.querySelectorAll('.ticker-matte-film,.r966-ticker-matte-film,.r488-extra-matte-film').forEach(el => {
      setImportant(el, 'display', 'none');
      setImportant(el, 'visibility', 'hidden');
      setImportant(el, 'opacity', '0');
      setImportant(el, 'background', 'none');
      setImportant(el, 'box-shadow', 'none');
      setImportant(el, '-webkit-backdrop-filter', 'none');
      setImportant(el, 'backdrop-filter', 'none');
    });
  };

  const tuneCharacters = (root) => {
    root.querySelectorAll('#home-charity-ticker .charity-marquee__segment').forEach(segment => {
      setImportant(segment, 'font-weight', '800');
      setImportant(segment, 'letter-spacing', '.04em');
      setImportant(segment, 'opacity', '1');
      setImportant(segment, 'filter', 'brightness(1.48) contrast(1.28) saturate(1.06) drop-shadow(0 0 .45px currentColor) drop-shadow(0 0 1.6px currentColor)');
      setImportant(segment, '-webkit-filter', 'brightness(1.48) contrast(1.28) saturate(1.06) drop-shadow(0 0 .45px currentColor) drop-shadow(0 0 1.6px currentColor)');
      setImportant(segment, 'text-shadow', '0 0 .8px currentColor,0 0 2.2px currentColor');
      setImportant(segment, 'text-rendering', 'geometricPrecision');
      setImportant(segment, '-webkit-font-smoothing', 'antialiased');
    });

    root.querySelectorAll('#home-charity-ticker .charity-marquee__segment--green').forEach(segment => {
      setImportant(segment, '--round418-bulb-face', '#caffef');
      setImportant(segment, '--round418-bulb-middle', '#8fffd7');
      setImportant(segment, '--round418-bulb-halo', 'rgba(143,255,215,.62)');
    });
    root.querySelectorAll('#home-charity-ticker .charity-marquee__segment--pink').forEach(segment => {
      setImportant(segment, '--round418-bulb-face', '#ff9bd7');
      setImportant(segment, '--round418-bulb-middle', '#ff2ea8');
      setImportant(segment, '--round418-bulb-halo', 'rgba(255,46,168,.62)');
    });

    const mobile = matchMedia('(max-width:760px)').matches;
    const leftGap = mobile ? MOBILE_LEFT_GAP : DESKTOP_LEFT_GAP;
    const rightGap = mobile ? MOBILE_RIGHT_GAP : DESKTOP_RIGHT_GAP;
    root.querySelectorAll('#home-charity-ticker .charity-marquee__separator').forEach(separator => {
      setImportant(separator, 'box-sizing', 'content-box');
      setImportant(separator, 'margin', '0');
      setImportant(separator, 'padding-left', leftGap);
      setImportant(separator, 'padding-right', rightGap);
      const person = separator.querySelector('svg.charity-marquee__person');
      if (person) {
        setImportant(person, 'filter', 'brightness(1.34) contrast(1.20) drop-shadow(0 0 1px currentColor) drop-shadow(0 0 3px currentColor)');
        setImportant(person, 'stroke-width', '2.05');
      }
    });
  };

  const startTrack = (track) => {
    const loops = Array.from(track.children).filter(el => el.classList && el.classList.contains('charity-marquee__loop'));
    if (loops.length < 2) return;
    loops.slice(2).forEach(el => el.remove());

    const first = loops[0];
    const width = first.getBoundingClientRect().width;
    if (!(width > 0)) return;
    const duration = Math.max(120, Math.min(540, width / PIXELS_PER_SECOND));

    /* One clean animation start after layout/fonts settle. No ResizeObserver
       loop rewriting the duration while the ticker is already moving. */
    setImportant(track, 'animation', 'none');
    setImportant(track, 'transform', 'translate3d(0,0,0)');
    setImportant(track, 'will-change', 'transform');
    setImportant(track, 'backface-visibility', 'hidden');
    setImportant(track, '-webkit-backface-visibility', 'hidden');
    setImportant(track, 'transform-origin', '0 50%');
    setImportant(track, 'text-rendering', 'geometricPrecision');
    setImportant(track, '-webkit-font-smoothing', 'antialiased');

    /* Force the reset into its own frame so the compositor starts cleanly. */
    void track.offsetWidth;
    requestAnimationFrame(() => {
      setImportant(track, 'animation-name', 'ah1602-ticker-compositor');
      setImportant(track, 'animation-duration', `${duration.toFixed(3)}s`);
      setImportant(track, 'animation-timing-function', 'linear');
      setImportant(track, 'animation-iteration-count', 'infinite');
      setImportant(track, 'animation-fill-mode', 'both');
      track.style.removeProperty('transform');
    });
  };

  const setup = () => {
    tuneTube(document);
    tuneCharacters(document);
    document.querySelectorAll('#home-charity-ticker .charity-marquee__track').forEach(startTrack);
  };

  const boot = () => {
    const afterFonts = () => requestAnimationFrame(() => requestAnimationFrame(setup));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(afterFonts, afterFonts);
    } else {
      afterFonts();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, {once:true});
  } else {
    boot();
  }
})();
