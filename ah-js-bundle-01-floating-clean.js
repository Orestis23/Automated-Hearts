

(() => {
  const engineFrame = document.querySelector('.home-hero-engine-embed');
  if (engineFrame && 'IntersectionObserver' in window) {
    const notify = (visible) => engineFrame.contentWindow?.postMessage({ type: 'engine-visibility', visible }, location.origin === 'null' ? '*' : location.origin);
    new IntersectionObserver(([entry]) => notify(entry.isIntersecting), { rootMargin: '160px 0px' }).observe(engineFrame);
  }



})();


/* Round 314 heart-home highlight pulse */
document.addEventListener("DOMContentLoaded", () => {
  const heartHomeLink = document.querySelector(".rim-heart-home-link");
  if (!heartHomeLink) return;
  const pulseHeart = () => {
    heartHomeLink.classList.remove("is-heart-pulsing");
    void heartHomeLink.offsetWidth;
    heartHomeLink.classList.add("is-heart-pulsing");
    window.setTimeout(() => heartHomeLink.classList.remove("is-heart-pulsing"), 820);
  };
  heartHomeLink.addEventListener("pointerdown", pulseHeart, { passive: true });
  heartHomeLink.addEventListener("click", pulseHeart);
});


/* Round 372: authoritative digital-screen text normalization */
document.addEventListener("DOMContentLoaded", () => {
  const canonicalSelector = ".screen-text-canonical:not(.home-title-text-standard)";
  const normalize = (element) => {
    /* Round 530: the Industries route labels deliberately contain one span
       per character. Flattening those children erases the lamp-by-lamp aging
       pattern, so they are excluded from every legacy text normalizer. */
    if (element.classList.contains('r530-who-bulb-field') ||
        (element.classList.contains('brand-route-screen__label') &&
         (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
    if (element.classList.contains('charity-marquee') || element.closest('.footer-page-screen')) return;
    const source = (element.dataset.text || element.getAttribute('aria-label') || element.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!source) return;
    const matteFilm = element.querySelector(':scope > .r488-extra-matte-film');
    const hasNonFilmChildren = [...element.children].some((child) => !child.classList.contains('r488-extra-matte-film'));
    if (element.textContent.replace(/\s+/g, ' ').trim() !== source || hasNonFilmChildren) {
      element.textContent = source;
      if (matteFilm) element.append(matteFilm);
    }
    if (!element.dataset.text) element.dataset.text = source;
  };

  document.querySelectorAll(canonicalSelector).forEach(normalize);
});


/* Round 485: deterministic multi-message charity marquee. Every loop is rebuilt
   from the same tone map so a repeated phrase can never swap colors between cycles. */
document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".charity-marquee");
  if (!marquee) return;
  const messages = [
    [{ text: "Open 24/7", tone: "green" }],
    [{ text: "Get rid of software costs.", tone: "pink" }],
    [
      { text: "Prioritizing", tone: "pink" },
      { text: "Job-Retention", tone: "green" }
    ],
    [
      { text: "Automation with a", tone: "green" },
      { text: "human touch.", tone: "pink" }
    ],
    [
      { text: "Elevating the human,", tone: "green" },
      { text: "not obsoleting them.", tone: "pink", joined: true }
    ]
  ];

  const tickerText = messages.map(parts => parts.map(part => part.text).join(' ')).join(' ');
  marquee.setAttribute('aria-label', tickerText);
  marquee.dataset.text = tickerText;

  const makeMessage = (parts) => {
    const copy = document.createElement("span");
    copy.className = "charity-marquee__copy";
    parts.forEach((part, index) => {
      const segment = document.createElement("span");
      segment.className = `charity-marquee__segment charity-marquee__segment--${part.tone}`;
      segment.textContent = part.text;
      if (index && !part.joined) segment.classList.add("charity-marquee__segment--spaced");
      copy.append(segment);
    });
    return copy;
  };

  const makeSeparator = () => {
    const separator = document.createElement("span");
    separator.className = "charity-marquee__separator";
    separator.setAttribute("aria-hidden", "true");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("charity-marquee__person");
    svg.setAttribute("viewBox", "0 0 18 30");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("aria-hidden", "true");

    const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    head.setAttribute("cx", "9");
    head.setAttribute("cy", "5");
    head.setAttribute("r", "3.2");

    const body = document.createElementNS("http://www.w3.org/2000/svg", "path");
    body.setAttribute("d", "M9 8.5V18 M9 11.5L3.3 15.3 M9 11.5L14.7 15.3 M9 18L4.7 27 M9 18L13.3 27");

    svg.append(head, body);
    separator.append(svg);
    return separator;
  };

  const makeLoop = () => {
    const loop = document.createElement("span");
    loop.className = "charity-marquee__loop";
    messages.forEach((parts) => {
      loop.append(makeMessage(parts), makeSeparator());
    });
    return loop;
  };

  let track = marquee.querySelector(".charity-marquee__track");
  if (!track) {
    track = document.createElement("span");
    track.className = "charity-marquee__track";
    marquee.replaceChildren(track);
  }
  track.setAttribute("aria-hidden", "true");
  /* Eight identical loops keep several complete cycles beyond either viewport
     edge, including ultrawide screens and font-loading width changes. */
  track.replaceChildren(...Array.from({ length: 8 }, makeLoop));

  /* Round 601: the ticker motion is compositor-driven by CSS again.
     Keeping JavaScript limited to deterministic content construction avoids
     inline transform writes that can be suppressed or conflict with the
     existing high-specificity ticker cascade. */
  track.style.removeProperty("transform");
  track.style.setProperty("animation", "r966-ticker-compositor 160s linear infinite", "important");
  track.style.setProperty("animation-timing-function", "linear", "important");
  track.style.setProperty("will-change", "transform", "important");
  track.style.setProperty("backface-visibility", "hidden", "important");
  track.style.setProperty("-webkit-backface-visibility", "hidden", "important");
  track.style.setProperty("transform-origin", "0 50%", "important");
});


/* Round 447: keep one complete text node per field. Homepage title fields use
   a cleaner 24pt bulb face; other fields retain the established fit tiers. */
(() => {
  const DIGITAL_SELECTOR = [
    '.screen-text-canonical:not(.home-title-text-standard):not(.ah1749-title-progress-text):not(.charity-marquee):not(.footer-page-led):not(.header-page-led)',
    '.charity-marquee__segment',
    '.negative-software-screen-round344 h3',
    '.negative-software-screen-round344 li',
  ].join(',');

  const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

  const toneFor = (element) => {
    if (
      element.classList.contains('screen-text-canonical--pink') ||
      element.classList.contains('charity-marquee__segment--pink') ||
      element.classList.contains('footer-nav-label') ||
      element.closest('.negative-software-screen-round344')
    ) return {
      face: '#FF2EA8',
      middle: 'rgba(255,46,168,.88)',
      halo: 'rgba(255,46,168,.44)'
    };
    return {
      face: '#8FFFD7',
      middle: 'rgba(143,255,215,.88)',
      halo: 'rgba(143,255,215,.42)'
    };
  };

  const hashText = (value) => {
    let hash = 2166136261;
    Array.from(value).forEach((character) => {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    });
    return hash >>> 0;
  };

  const seededFraction = (seed, index) => {
    let value = (seed + Math.imul(index + 1, 0x9e3779b9)) >>> 0;
    value = Math.imul(value ^ (value >>> 16), 0x21f0aaad);
    value = Math.imul(value ^ (value >>> 15), 0x735a2d97);
    return ((value ^ (value >>> 15)) >>> 0) / 4294967295;
  };

  const agingPatternFor = (source, fieldIndex, textBox = null, isHomeHeaderTitle = false) => {
    const visibleLength = source.replace(/\s/g, '').length;
    const count = isHomeHeaderTitle
      ? (visibleLength <= 18 ? 3 : 4)
      : (visibleLength <= 8 ? 1 : visibleLength <= 24 ? 2 : 3);
    const anchors = count === 1
      ? [52]
      : count === 2
        ? [29, 72]
        : count === 3
          ? [19, 51, 82]
          : [14, 39, 64, 87];
    const seed = hashText(`${document.body?.dataset?.page || 'page'}|${source}|${fieldIndex}`);
    const clusters = anchors.map((anchor, index) => {
      const rawX = anchor + (seededFraction(seed, index * 5) * 7 - 3.5);
      const rawY = 24 + seededFraction(seed, index * 5 + 1) * 52;
      const rawRadiusX = isHomeHeaderTitle
        ? .8 + seededFraction(seed, index * 5 + 2) * .9
        : 1.7 + seededFraction(seed, index * 5 + 2) * 1.8;
      const rawRadiusY = isHomeHeaderTitle
        ? 9 + seededFraction(seed, index * 5 + 3) * 8
        : 12 + seededFraction(seed, index * 5 + 3) * 12;
      const opacity = isHomeHeaderTitle
        ? .10 + seededFraction(seed, index * 5 + 4) * .12
        : .22 + seededFraction(seed, index * 5 + 4) * .16;

      if (!textBox) {
        return { x: rawX, y: rawY, radiusX: rawRadiusX, radiusY: rawRadiusY, opacity };
      }

      return {
        x: textBox.left + (rawX / 100) * textBox.width,
        y: textBox.top + (rawY / 100) * textBox.height,
        radiusX: Math.max(.5, (rawRadiusX / 100) * textBox.width),
        radiusY: Math.max(2.8, (rawRadiusY / 100) * textBox.height),
        opacity
      };
    });

    const gradients = clusters.map((cluster) => {
      const edgeOpacity = (cluster.opacity * .36).toFixed(3);
      return `radial-gradient(ellipse ${cluster.radiusX.toFixed(2)}% ${cluster.radiusY.toFixed(2)}% at ${cluster.x.toFixed(2)}% ${cluster.y.toFixed(2)}%, rgba(3,4,5,${cluster.opacity.toFixed(3)}) 0 26%, rgba(3,4,5,${edgeOpacity}) 48%, transparent 80%)`;
    });

    return {
      gradients,
      marker: clusters.map((cluster) => `${Math.round(cluster.x)}:${Math.round(cluster.y)}`).join('|')
    };
  };

  const applyAgingPattern = (element, source, fieldIndex, textBox = null) => {
    const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
      Boolean(element.closest('.home-header-screen'));
    const agingPattern = agingPatternFor(source, fieldIndex, textBox, isHomeHeaderTitle);
    const layerCount = agingPattern.gradients.length;
    const bulbGradient = isHomeHeaderTitle
      ? 'radial-gradient(circle at 1.28px 1.24px, #ffffff 0 .28px, var(--round418-bulb-face) .34px .86px, var(--round418-bulb-middle) .92px 1.10px, transparent 1.24px)'
      : 'radial-gradient(circle at 1.10px 1.10px, #f4fffb 0 .22px, var(--round418-bulb-face) .28px .84px, var(--round418-bulb-middle) .90px 1.14px, transparent 1.30px)';
    const bulbGrid = isHomeHeaderTitle ? '3.75px 3.75px' : '3.25px 3.25px';
    element.dataset.round418AgingPattern = agingPattern.marker;
    element.style.setProperty(
      'background-image',
      `${agingPattern.gradients.join(',')}, ${bulbGradient}`,
      'important'
    );
    element.style.setProperty('background-size', `${Array(layerCount).fill('auto').join(',')}, ${bulbGrid}`, 'important');
    element.style.setProperty('background-position', `${Array(layerCount).fill('0 0').join(',')}, 0 0`, 'important');
    element.style.setProperty('background-repeat', `${Array(layerCount).fill('no-repeat').join(',')}, repeat`, 'important');
    element.style.setProperty('background-blend-mode', `${Array(layerCount).fill('multiply').join(',')}, normal`, 'important');
  };

  const applyPageProgressText = (element) => {
    element.style.setProperty('background-image','linear-gradient(90deg,#07111b 0%,#07111b var(--page-sign-scroll-percent,0%),#8fffd7 var(--page-sign-scroll-percent,0%),#8fffd7 100%)','important');
    element.style.setProperty('background-size','100% 100%','important');
    element.style.setProperty('background-position','center','important');
    element.style.setProperty('background-repeat','no-repeat','important');
    element.style.setProperty('-webkit-mask-image','radial-gradient(circle at 1.12px 1.12px,#000 0 .92px,transparent 1.18px)','important');
    element.style.setProperty('mask-image','radial-gradient(circle at 1.12px 1.12px,#000 0 .92px,transparent 1.18px)','important');
    element.style.setProperty('-webkit-mask-size','3.25px 3.25px','important');
    element.style.setProperty('mask-size','3.25px 3.25px','important');
    element.style.setProperty('-webkit-mask-repeat','repeat','important');
    element.style.setProperty('mask-repeat','repeat','important');
    element.style.setProperty('filter','none','important');
    element.style.setProperty('-webkit-filter','none','important');
  };

  const restoreCompleteDigitalText = () => {
    document.querySelectorAll(DIGITAL_SELECTOR).forEach((element, fieldIndex) => {
      if (element.classList.contains('r530-who-bulb-field') ||
          (element.classList.contains('brand-route-screen__label') &&
           (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
      if (element.closest('#home-solution-framework')) return;
      /* Round 2108: footer labels and page-name hardware are CSS-owned from first paint. */
      if (element.classList.contains('footer-nav-label') || element.matches('.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led')) return;
      const source = normalizeText(
        element.dataset.text ||
        element.getAttribute('aria-label') ||
        element.textContent
      );
      if (!source) return;

      /* Round 806: footer labels on every primary page have one fixed first-paint
         geometry in CSS. Never rewrite their font metrics or DOM here; page-specific
         inline !important writes caused inconsistent label sizes between pages. */
      const isStableFooterLabel = element.classList.contains('footer-nav-label');
      const isStableHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
        Boolean(element.closest('.home-header-screen'));
      if (isStableFooterLabel) {
        element.hidden = false;
        element.dataset.round418Size = 'footer';
        element.style.setProperty('font-family', '"Orbitron", system-ui, sans-serif', 'important');
        element.style.setProperty('font-size', window.matchMedia('(max-width:760px)').matches ? '10px' : '18.4px', 'important');
        element.style.setProperty('font-weight', window.matchMedia('(max-width:760px)').matches ? '700' : '400', 'important');
        element.style.setProperty('font-style', 'normal', 'important');
        element.style.setProperty('line-height', window.matchMedia('(max-width:760px)').matches ? '1' : '18.4px', 'important');
        element.style.setProperty('letter-spacing', '0', 'important');
        element.style.setProperty('word-spacing', '0', 'important');
        element.style.setProperty('opacity', '1', 'important');
        element.style.setProperty('visibility', 'visible', 'important');
        element.style.setProperty('transform', 'none', 'important');
        return;
      }
      if (isStableHomeHeaderTitle) return;

      const matteFilm = element.querySelector(':scope > .r488-extra-matte-film');
      const hasNonFilmChildren = [...element.children].some((child) => !child.classList.contains('r488-extra-matte-film'));
      if (normalizeText(element.textContent) !== source || hasNonFilmChildren) {
        element.textContent = source;
        if (matteFilm) element.append(matteFilm);
      }

      const tone = toneFor(element);
      const isFooterLabel = element.classList.contains('footer-nav-label');
      const isPageName = element.matches(
        '.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led'
      );
      const isLearningFutureStatement = Boolean(element.closest('.learning-future-display'));
      const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
        Boolean(element.closest('.home-header-screen'));
      if (isFooterLabel) {
        element.hidden = false;
        element.dataset.round418Size = 'footer';
        [
          '-webkit-text-stroke','font-family','font-size','font-weight','font-style','line-height',
          'letter-spacing','word-spacing','opacity','visibility','text-shadow','animation','transition',
          'transform','color','-webkit-text-fill-color','background','background-image',
          '-webkit-background-clip','background-clip','filter','-webkit-filter'
        ].forEach((prop) => element.style.removeProperty(prop));
        return;
      }
      if (isPageName) {
        element.hidden = false;
        element.dataset.round418Size = 'compact';
        [
          '-webkit-text-stroke','font-family','font-size','font-weight','font-style','line-height',
          'letter-spacing','word-spacing','opacity','visibility','text-shadow','animation','transition',
          'transform','color','-webkit-text-fill-color','background','background-color','background-image',
          'background-size','background-position','background-repeat','background-blend-mode',
          '-webkit-background-clip','background-clip','filter','-webkit-filter',
          '-webkit-mask-image','mask-image','-webkit-mask-size','mask-size',
          '-webkit-mask-repeat','mask-repeat'
        ].forEach((prop) => element.style.removeProperty(prop));
        return;
      }
      element.hidden = false;
      element.style.setProperty('-webkit-text-stroke', '0 transparent', 'important');
      element.style.setProperty('font-family', '"Orbitron",system-ui,sans-serif', 'important');
      element.style.setProperty(
        'font-size',
        isFooterLabel
          ? '12pt'
          : isPageName
            ? (window.matchMedia('(max-width:760px)').matches ? '18.75pt' : '20pt')
            : isHomeHeaderTitle
              ? (window.matchMedia('(max-width:760px)').matches ? '18pt' : window.matchMedia('(max-width:1100px)').matches ? '21pt' : '24pt')
              : '20pt',
        'important'
      );
      element.style.setProperty('font-weight', isFooterLabel || isLearningFutureStatement ? '400' : '700', 'important');
      element.style.setProperty('font-style', 'normal', 'important');
      element.style.setProperty('line-height', isPageName ? '1' : '1.08', 'important');
      element.style.setProperty(
        'letter-spacing',
        isFooterLabel ? '.018em' : isPageName ? '.001em' : isHomeHeaderTitle ? '.018em' : '.045em',
        'important'
      );
      if (isHomeHeaderTitle) {
        element.style.setProperty(
          'word-spacing',
          element.closest('.home-header-screen--red') ? '-.14em' : '-.08em',
          'important'
        );
      }
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('visibility', 'visible', 'important');
      element.style.setProperty('text-shadow', 'none', 'important');
      element.style.setProperty('animation', 'none', 'important');
      element.style.setProperty('transition', 'none', 'important');
      element.style.setProperty('transform', 'none', 'important');

      element.dataset.round418Size = isPageName ? 'compact' : 'large';
      element.dataset.round418FieldIndex = String(fieldIndex);

      element.style.setProperty('--round418-bulb-face', tone.face, 'important');
      element.style.setProperty('--round418-bulb-middle', tone.middle, 'important');
      element.style.setProperty('--round418-bulb-halo', tone.halo, 'important');
      element.style.setProperty('color', 'transparent', 'important');
      element.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
      element.style.setProperty('background-color', 'transparent', 'important');
      if (isPageName) applyPageProgressText(element);
      else applyAgingPattern(element, source, fieldIndex);
      element.style.setProperty('-webkit-background-clip', 'text', 'important');
      element.style.setProperty('background-clip', 'text', 'important');
      element.style.setProperty(
        'filter',
        isPageName ? 'none' : `${isHomeHeaderTitle ? 'brightness(1.32) contrast(1.22)' : 'brightness(1.22) contrast(1.18)'}  `,
        'important'
      );
      element.style.setProperty(
        '-webkit-filter',
        isPageName ? 'none' : `${isHomeHeaderTitle ? 'brightness(1.32) contrast(1.22)' : 'brightness(1.22) contrast(1.18)'}  `,
        'important'
      );
    });
  };

  let fitFrame = 0;
  const fitDigitalTextTiers = () => {
    if (fitFrame) window.cancelAnimationFrame(fitFrame);
    fitFrame = window.requestAnimationFrame(() => {
      fitFrame = 0;
      document.querySelectorAll(DIGITAL_SELECTOR).forEach((element) => {
        if (element.classList.contains('r530-who-bulb-field') ||
            (element.classList.contains('brand-route-screen__label') &&
             (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
        if (element.closest('#home-solution-framework')) return;
        const isFooterLabel = element.classList.contains('footer-nav-label');
        const isPageName = element.matches(
          '.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led'
        );
        const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
          Boolean(element.closest('.home-header-screen'));
        if (isFooterLabel || isPageName || isHomeHeaderTitle) return;

        element.dataset.round418Size = 'large';
        element.style.setProperty(
          'font-size',
          isHomeHeaderTitle
            ? (window.matchMedia('(max-width:760px)').matches ? '18pt' : window.matchMedia('(max-width:1100px)').matches ? '21pt' : '24pt')
            : '20pt',
          'important'
        );
      });

      /* Measure only after every candidate has been given the large tier.
         A four-pixel safety inset protects the bulb halo and glass edge. */
      document.querySelectorAll(DIGITAL_SELECTOR).forEach((element) => {
        if (element.classList.contains('r530-who-bulb-field') ||
            (element.classList.contains('brand-route-screen__label') &&
             (element.closest('#who-we-help-solutions') || element.closest('#learning-route-buttons')))) return;
        if (element.closest('#home-solution-framework')) return;
        const isFooterLabel = element.classList.contains('footer-nav-label');
        const isPageName = element.matches(
          '.rim-page-name-screen > .footer-page-led, .rim-page-name-screen > .header-page-led'
        );
        const isHomeHeaderTitle = element.classList.contains('home-title-text-standard') &&
          Boolean(element.closest('.home-header-screen'));
        if (isFooterLabel || isPageName || isHomeHeaderTitle) return;

        const bounds = element.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const range = document.createRange();
        range.selectNodeContents(element);
        const contentBounds = range.getBoundingClientRect();
        const overflows =
          contentBounds.width > Math.max(0, bounds.width - 4) ||
          contentBounds.height > Math.max(0, bounds.height - 4);

        if (isHomeHeaderTitle) {
          /* Round 447: the two homepage title fields stay out of the compact
             tier. Desktop uses 24pt; smaller viewports step down only to fit. */
          const homeTitleSize = window.matchMedia('(max-width:760px)').matches
            ? '18pt'
            : window.matchMedia('(max-width:1100px)').matches
              ? '21pt'
              : '24pt';
          element.style.setProperty('font-size', homeTitleSize, 'important');
          element.dataset.round447TitleSize = homeTitleSize;
        } else if (!isPageName && overflows) {
          element.dataset.round418Size = 'compact';
          element.style.setProperty('font-size', '16pt', 'important');
        }

        const finalContentBounds = range.getBoundingClientRect();
        const relativeLeft = Math.max(0, Math.min(bounds.width, finalContentBounds.left - bounds.left));
        const relativeTop = Math.max(0, Math.min(bounds.height, finalContentBounds.top - bounds.top));
        const relativeWidth = Math.max(1, Math.min(bounds.width - relativeLeft, finalContentBounds.width));
        const relativeHeight = Math.max(1, Math.min(bounds.height - relativeTop, finalContentBounds.height));
        const source = normalizeText(
          element.dataset.text || element.getAttribute('aria-label') || element.textContent
        );
        const fieldIndex = Number.parseInt(element.dataset.round418FieldIndex || '0', 10) || 0;
        if (isPageName) applyPageProgressText(element);
        else applyAgingPattern(element, source, fieldIndex, {
          left: (relativeLeft / bounds.width) * 100,
          top: (relativeTop / bounds.height) * 100,
          width: (relativeWidth / bounds.width) * 100,
          height: (relativeHeight / bounds.height) * 100
        });
      });
    });
  };

  const initializeRound418DigitalText = () => {
    restoreCompleteDigitalText();
    fitDigitalTextTiers();
  };

  initializeRound418DigitalText();
  document.addEventListener('DOMContentLoaded', initializeRound418DigitalText, { once: true });
  window.addEventListener('pageshow', initializeRound418DigitalText);
  (window.AHResponsive?window.AHResponsive.watch(fitDigitalTextTiers):window.addEventListener('resize',fitDigitalTextTiers,{passive:true}));
  if (document.fonts?.ready) document.fonts.ready.then(fitDigitalTextTiers).catch(() => {});
})();


/* Round 426: one physically smooth protective lens sits in front of every
   digital field on the homepage. Real elements avoid collisions with the
   legacy bulb and screen pseudo-elements. */
(() => {
  if (document.body?.dataset?.page !== 'home') return;
  const screenSelectors = [
    'main#main-content .home-header-screen-row > .home-header-screen',
    'main#main-content .home-message-display',
    'main#main-content #home-route-buttons .premium-route-card__title-sign',
    'main#main-content #home-solution-framework .brand-lcd-bar',
    'main#main-content #home-solution-framework .negative-software-screen-round344',
    'main#main-content #home-solution-framework .negative-software-explore-round344'
  ];

  const installRound426Glass = () => {
    document.querySelectorAll(screenSelectors.join(',')).forEach((screen) => {
      if (screen.querySelector(':scope > .round426-glass-lens')) return;

      /* This must not be a span. Several legacy screen rules intentionally
         style direct-child spans as the visible label; using a span for the
         lens produced the empty secondary boxes seen on all three route signs. */
      const lens = document.createElement('i');
      lens.className = 'round426-glass-lens';
      lens.setAttribute('aria-hidden', 'true');
      screen.append(lens);
    });
  };

  /* The digital-text initializer can rebuild a field on DOMContentLoaded or
     pageshow. Reinstalling afterward guarantees that every screen retains one
     lens—never zero and never a duplicate. */
  installRound426Glass();
  document.addEventListener('DOMContentLoaded', installRound426Glass, { once: true });
  window.addEventListener('pageshow', installRound426Glass);
})();
/* Round 779 cleanup: removed redundant Round 533 footer rebuild fallback.
   The earlier balanceHeaderNavigation() fallback remains; primary pages ship the
   complete mechanical footer directly in HTML, so a second startup DOM rebuild
   was unnecessary and could only reintroduce layout/style instability. */
/* Round 939: removed legacy footer-cluster illumination so each footer control
   behaves independently like the top Messages control. */
/* Round 527: pronounced deterministic aging for the two homepage title
   fields. Whole letters range from overdriven to nearly failed, and each glyph
   receives independent hot, flare, survivor, dim, dead, and charred bulbs. */
(() => {
  "use strict";
  const fields = [...document.querySelectorAll('.home-title-text-standard[data-text]')];
  if (!fields.length) return;
  /* Hand-balanced sequences prevent repetitive stripes while guaranteeing
     that both fields contain every kind of aging. */
  const fieldPatterns = [
    ['normal','surge','weak','burnt','hot','failing','normal','burnt','surge','weak','normal','hot','failing','burnt','normal'],
    ['weak','normal','hot','burnt','surge','normal','failing','hot','burnt','weak','normal','surge','failing','normal','hot','burnt','normal','weak','surge','failing','normal','hot','burnt','normal','weak','surge']
  ];
  fields.forEach((field, fieldIndex) => {
    if (field.classList.contains('r486-title-glyphs')) return;
    const source = field.dataset.text || field.textContent || '';
    const frag = document.createDocumentFragment();
    let visibleIndex = 0;
    [...source].forEach((char) => {
      const span = document.createElement('span');
      span.className = 'r486-title-char';
      span.setAttribute('aria-hidden','true');
      if (/\s/.test(char)) {
        span.classList.add('r486-title-space');
        span.textContent = '\u00a0';
      } else {
        const pattern = fieldPatterns[fieldIndex % fieldPatterns.length];
        const state = pattern[visibleIndex % pattern.length];
        if (state !== 'normal') span.dataset.lamp = state;
        span.dataset.glyph = char;
        let hash = 2166136261;
        for (const code of `${fieldIndex}:${visibleIndex}:${char}`) {
          hash ^= code.charCodeAt(0);
          hash = Math.imul(hash,16777619) >>> 0;
        }
        const pick = (shift,modulo) => (hash >>> shift) % modulo;
        span.style.setProperty('--r526-grid-x',`${pick(0,5) - 2}px`);
        span.style.setProperty('--r526-grid-y',`${pick(3,5) - 2}px`);
        span.style.setProperty('--r526-hot-x',`${pick(6,4) * 5}px`);
        span.style.setProperty('--r526-hot-y',`${pick(9,4) * 5}px`);
        span.style.setProperty('--r526-flare-x',`${pick(11,5) * 5}px`);
        span.style.setProperty('--r526-flare-y',`${pick(14,5) * 5}px`);
        span.style.setProperty('--r526-survivor-x',`${pick(5,6) * 5}px`);
        span.style.setProperty('--r526-survivor-y',`${pick(17,6) * 5}px`);
        span.style.setProperty('--r526-dead-x',`${pick(12,5) * 5}px`);
        span.style.setProperty('--r526-dead-y',`${pick(15,5) * 5}px`);
        span.style.setProperty('--r526-dim-x',`${pick(18,4) * 5}px`);
        span.style.setProperty('--r526-dim-y',`${pick(21,4) * 5}px`);
        span.style.setProperty('--r526-scar-x',`${pick(24,6) * 5}px`);
        span.style.setProperty('--r526-scar-y',`${pick(27,4) * 5}px`);
        span.textContent = char;
        visibleIndex += 1;
      }
      frag.appendChild(span);
    });
    field.replaceChildren(frag);
    field.classList.add('r486-title-glyphs');
  });
})();

/* Round 1037: route labels are plain text on both Industries and Good Information.
   The retired per-character aged-bulb renderers (Rounds 528/530/531) were removed
   because they rebuilt words after load and collapsed/blurred visible spaces. */
(() => {
  "use strict";
  const selectors = [
    'body.page-home[data-page="home"] #home-route-buttons .brand-route-screen__label[data-text]',
    'body.page-who-we-help[data-page="who-we-help"] #who-we-help-solutions .brand-route-screen__label[data-text]',
    'body.page-learning[data-page="learning"] #learning-route-buttons .brand-route-screen__label[data-text]'
  ].join(',');
  const normalize = () => {
    document.querySelectorAll(selectors).forEach((label) => {
      const source = label.dataset.text || label.getAttribute('aria-label') || label.textContent || '';
      label.replaceChildren(document.createTextNode(source));
      label.classList.remove('r528-who-glyphs','r530-who-bulb-field','r531-learning-bulb-field');
      label.setAttribute('aria-label', source);
    });
  };
  normalize();
  document.addEventListener('DOMContentLoaded', normalize, { once:true });
  window.addEventListener('pageshow', normalize);
})();

/* Round 958: scroll-direction section leaning/depth effect removed entirely. */

/* Round 661 — final Home title fitting and linked footer illumination.
   This runs after the legacy digital-text/glyph passes so they cannot restore
   oversized title text or single-button-only hover behavior afterward. */
(() => {
  "use strict";

  /* Round 780: no post-paint Home title measurements. */
  if (document.body?.dataset?.page === 'home') return;

  const fitHomeTitles = () => {
    const row = document.getElementById('home-title-fields');
    if (!row) return;
    const fields = [...row.querySelectorAll('.home-title-text-standard')];
    fields.forEach((field) => {
      const screen = field.closest('.home-header-screen');
      if (!screen) return;
      const red = screen.classList.contains('home-header-screen--red');
      const narrow = window.matchMedia('(max-width:760px)').matches;
      const mid = !narrow && window.matchMedia('(max-width:1180px)').matches;
      const maxSize = narrow ? 24 : mid ? (red ? 25.5 : 29) : (red ? 32 : 36);
      const minSize = narrow ? 12 : 14;

      // Round 723: measure against the title row's allocated grid track, not
      // the screen's previously trimmed width. Measuring the already-trimmed
      // screen created a feedback loop that clipped both titles more on every
      // fit pass. Desktop/tablet use the canonical 38/62 (40/60 mid) split.
      const rowWidth = Math.max(1, row.clientWidth || row.getBoundingClientRect().width || 1);
      const rowGap = narrow ? 12 : (mid ? 14 : 18);
      const usableRow = Math.max(1, rowWidth - (narrow ? 0 : rowGap));
      const trackRatio = narrow ? 1 : (mid ? (red ? .60 : .40) : (red ? .62 : .38));
      const trackWidth = narrow ? rowWidth : usableRow * trackRatio;
      const horizontalAllowance = narrow ? 26 : (red ? 60 : 48);
      const available = Math.max(120, trackWidth - horizontalAllowance);

      field.style.setProperty('display', 'inline-flex', 'important');
      field.style.setProperty('width', 'max-content', 'important');
      field.style.setProperty('max-width', 'none', 'important');
      field.style.setProperty('letter-spacing', red ? '.040em' : '.052em', 'important');
      field.style.setProperty('word-spacing', '0', 'important');
      field.style.setProperty('white-space', 'nowrap', 'important');

      let low = minSize;
      let high = maxSize;
      let best = minSize;
      for (let i = 0; i < 12; i += 1) {
        const test = (low + high) / 2;
        field.style.setProperty('font-size', `${test}px`, 'important');
        const width = field.getBoundingClientRect().width;
        if (width <= available) {
          best = test;
          low = test;
        } else {
          high = test;
        }
      }
      field.style.setProperty('font-size', `${Math.floor(best * 10) / 10}px`, 'important');

      // Round 675: trim the physical blue field to the actual rendered title.
      // Keep only a modest side margin while preserving the established title size.
      const renderedTitleWidth = Math.ceil(field.getBoundingClientRect().width);
      const trimAllowance = narrow ? 30 : (red ? 56 : 44);
      const trimmedScreenWidth = Math.min(trackWidth, renderedTitleWidth + trimAllowance);
      screen.style.setProperty('width', `${Math.max(120, Math.round(trimmedScreenWidth))}px`, 'important');
      screen.style.setProperty('min-width', '0', 'important');
      screen.style.setProperty('max-width', `${Math.max(120, Math.round(trackWidth))}px`, 'important');
      screen.style.setProperty('justify-self', 'center', 'important');
      screen.style.setProperty('flex', '0 0 auto', 'important');
    });
  };

  let resizeFrame = 0;
  const scheduleFit = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      fitHomeTitles();
      requestAnimationFrame(fitHomeTitles);
    });
  };

  scheduleFit();
  document.addEventListener('DOMContentLoaded', scheduleFit, { once: true });
  window.addEventListener('load', scheduleFit, { once: true });
  window.addEventListener('pageshow', scheduleFit);
  (window.AHResponsive?window.AHResponsive.watch(scheduleFit):window.addEventListener('resize',scheduleFit,{passive:true}));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleFit).catch(() => {});

  /* Round 939: footer cluster-light listeners removed; controls are independent. */
})();

/* Round 680 — slow, exclusive Home machine-window shutters. */
(function(){
  'use strict';
  function initHomeMachineHaze(){
    var grid=document.getElementById('home-machine-grid');
    if(!grid) return;
    var frames=Array.prototype.slice.call(grid.querySelectorAll(':scope > .home-hero-engine-frame'));
    if(!frames.length) return;
    var duration=1000;

    function setOpen(frame,open){
      if(!frame) return;
      frame.classList.toggle('is-haze-open',!!open);
      var screen=frame.querySelector('[data-machine-haze]');
      if(screen) screen.setAttribute('aria-expanded',open?'true':'false');
    }
    function resetClosed(){
      frames.forEach(function(frame){
        frame.classList.remove('is-haze-open','is-haze-closing');
        var screen=frame.querySelector('[data-machine-haze]');
        if(screen) screen.setAttribute('aria-expanded','false');
      });
      grid.dataset.hazeBusy='0';
    }
    function finishClose(frame,done){
      if(!frame){ if(done) done(); return; }
      frame.classList.add('is-haze-closing');
      setOpen(frame,false);
      var screen=frame.querySelector('[data-machine-haze]');
      var finished=false;
      function complete(){
        if(finished) return;
        finished=true;
        frame.classList.remove('is-haze-closing');
        if(screen) screen.removeEventListener('transitionend',onEnd);
        if(done) done();
      }
      function onEnd(e){
        if(e.propertyName==='transform') complete();
      }
      if(screen) screen.addEventListener('transitionend',onEnd);
      window.setTimeout(complete,duration+120);
    }

    if(grid.dataset.hazeInit!=='1'){
      grid.dataset.hazeInit='1';
      resetClosed();
      grid.addEventListener('click',function(e){
        var screen=e.target.closest('[data-machine-haze]');
        if(!screen || !grid.contains(screen) || grid.dataset.hazeBusy==='1') return;
        var target=screen.closest('.home-hero-engine-frame');
        if(!target) return;
        e.preventDefault();

        /* Clicking the retained heart handle on an already-open shield lowers it. */
        if(target.classList.contains('is-haze-open')){
          grid.dataset.hazeBusy='1';
          finishClose(target,function(){
            grid.dataset.hazeBusy='0';
          });
          return;
        }

        var current=grid.querySelector(':scope > .home-hero-engine-frame.is-haze-open');
        if(current && current!==target){
          grid.dataset.hazeBusy='1';
          finishClose(current,function(){
            setOpen(target,true);
            grid.dataset.hazeBusy='0';
          });
        }else{
          setOpen(target,true);
        }
      });
    }
    return resetClosed;
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){ initHomeMachineHaze(); },{once:true});
  }else{
    initHomeMachineHaze();
  }
  window.addEventListener('pageshow',function(){
    var reset=initHomeMachineHaze();
    if(reset) reset();
  });
})();

;
/* Round 913 — keep the Message control/contact state stable across same-tab
   navigation. The early head marker prevents the control from visually
   resetting before the shared contact drawer has rebuilt on the destination. */
(()=>{
  'use strict';
  const KEY='ah-message-open-v1';
  const getStored=()=>{try{return sessionStorage.getItem(KEY)==='1';}catch(_){return false;}};
  const store=(open)=>{try{sessionStorage.setItem(KEY,open?'1':'0');}catch(_){}}
  const root=document.documentElement;
  const syncRoot=(open)=>root.classList.toggle('ah-message-persist-open',!!open);

  const bind=()=>{
    const trigger=document.getElementById('header-send-message');
    if(!trigger) return;
    const syncFromTrigger=()=>{
      const open=trigger.getAttribute('aria-expanded')==='true'||trigger.classList.contains('is-contact-latched');
      store(open);syncRoot(open);
    };
    new MutationObserver(syncFromTrigger).observe(trigger,{attributes:true,attributeFilter:['aria-expanded','class']});

    if(getStored()){
      syncRoot(true);
      // script-round447 creates/binds the drawer first because this file is loaded after it.
      requestAnimationFrame(()=>{
        if(trigger.getAttribute('aria-expanded')!=='true') trigger.click();
      });
    }else{
      syncRoot(false);
    }
    window.addEventListener('pagehide',syncFromTrigger,{capture:true});
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();
})();


/* Round 1034: footer hardware dimensions are CSS-owned and immutable; no runtime sizing. */
