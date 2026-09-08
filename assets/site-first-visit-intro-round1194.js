/* Automated Hearts Round 1194 — site-wide first-visit intro runtime. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (root.getAttribute('data-ah-site-intro') !== '1') return;
  if (window.self !== window.top) return;
  if (window.__AH_SITE_FIRST_VISIT_INTRO_1194) return;
  window.__AH_SITE_FIRST_VISIT_INTRO_1194 = true;

  const KEY = 'ah-site-first-visit-intro-v1194';
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const esc = (value) => value.replace(/[&<>']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;'}[char]));

  const colorize = (value) => {
    let text = esc(value);
    return text
      .replace(/AI/g, '<span class="pink">AI</span>')
      .replace(/Human/g, '<span class="green">Human</span>')
      .replace(/maximum efficiency/g, '<span class="green">maximum efficiency</span>')
      .replace(/Nothing you don&#39;t need\./g, '<span class="pink">Nothing</span> you <span class="green">don&#39;t need.</span>')
      .replace(/Just what you do\./g, '<span class="pink">Just</span> <span class="green">what you do.</span>');
  };

  const boot = () => {
    const intro = document.getElementById('site-first-visit-intro');
    const lines = Array.from(document.querySelectorAll('#site-first-visit-intro [data-site-intro-line]'));
    const cursor = document.getElementById('site-intro-cursor');
    const signature = document.getElementById('site-intro-signature-heart');
    if (!intro || lines.length < 5 || !cursor) return false;
    if (intro.dataset.booted === '1') return true;
    intro.dataset.booted = '1';
    intro.hidden = false;

    const state = ['', '', '', '', ''];
    const render = (index) => {
      lines[index].innerHTML = colorize(state[index]);
      lines[index].appendChild(cursor);
    };
    const type = async (index, text) => {
      for (const char of text) {
        state[index] += char;
        render(index);
        let delay = 34 + Math.random() * 48;
        if (/[.,%]/.test(char)) delay += 65;
        await sleep(delay);
      }
    };
    const back = async (index, amount) => {
      for (let i = 0; i < amount; i += 1) {
        state[index] = state[index].slice(0, -1);
        render(index);
        await sleep(78 + Math.random() * 42);
      }
    };
    const story = async () => {
      await type(0, 'AI should elevtae'); await sleep(330); await back(0, 3); await sleep(160); await type(0, 'ate the Human.'); await sleep(620);
      await type(1, 'Fully customized minimalistic systems in both design & foundation for maximum efficency'); await sleep(340); await back(1, 5); await sleep(160); await type(1, 'ciency.'); await sleep(610);
      await type(2, 'Nothing you dont'); await sleep(310); await back(2, 4); await sleep(150); await type(2, "don't need."); await sleep(520);
      await type(3, 'Just what you do.'); await sleep(520);
    };
    const finish = async () => {
      try { localStorage.setItem(KEY, '1'); } catch (_) {}
      cursor.style.opacity = '0';
      await sleep(180);
      if (signature) {
        signature.classList.remove('is-signing');
        signature.hidden = false;
        void signature.offsetWidth;
        signature.classList.add('is-signing');
        await sleep(1650);
      } else {
        await sleep(420);
      }
      intro.classList.add('is-raising');
      await Promise.race([
        new Promise((resolve) => intro.addEventListener('transitionend', resolve, {once:true})),
        sleep(3300)
      ]);
      intro.hidden = true;
      root.setAttribute('data-ah-site-intro', '0');
      root.style.removeProperty('overflow');
      window.dispatchEvent(new CustomEvent('ah:first-intro-finished'));
    };

    story().then(finish).catch(async () => {
      try { localStorage.setItem(KEY, '1'); } catch (_) {}
      intro.classList.add('is-raising');
      await sleep(700);
      intro.hidden = true;
      root.setAttribute('data-ah-site-intro', '0');
      root.style.removeProperty('overflow');
    });
    return true;
  };

  if (!boot()) {
    const observer = new MutationObserver(() => {
      if (boot()) observer.disconnect();
    });
    observer.observe(root, {childList:true, subtree:true});
  }
})();
