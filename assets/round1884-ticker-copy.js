/* Round 1884: ticker phrases flanked by human figures; phrase-to-phrase spacing preserved. */
document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".charity-marquee");
  if (!marquee) return;
  const messages = [{"text": "“With the right information, you can predict the future.”", "tone": "pink"}, {"text": "“Open 24/7.”", "tone": "green"}, {"text": "“Get rid of software costs.”", "tone": "pink"}];

  const tickerText = messages.map(item => item.text).join(" ");
  marquee.setAttribute("aria-label", tickerText);
  marquee.dataset.text = tickerText;


  const makeMessage = (item) => {
    const copy = document.createElement("span");
    copy.className = "charity-marquee__copy";
    copy.style.setProperty("display", "inline-flex", "important");
    copy.style.setProperty("flex", "0 0 auto", "important");
    copy.style.setProperty("align-items", "center", "important");
    copy.style.setProperty("white-space", "nowrap", "important");
    const segment = document.createElement("span");
    segment.className = `charity-marquee__segment charity-marquee__segment--${item.tone}`;
    const text = item.text.replace(/^[“\"]|[”\"]$/g, "");
    for (const [value, kind] of [["“", "quote"], [text, "phrase"], ["”", "quote"]]) {
      const glyph = document.createElement("span");
      glyph.className = `ah1985-progress-text-glyphs ah-ticker-${kind}`;
      glyph.textContent = value;
      segment.append(glyph);
    }
    copy.append(segment);
    return copy;
  };

  const makeSeparator = () => {
    const separator = document.createElement("span");
    separator.className = "charity-marquee__separator";
    separator.setAttribute("aria-hidden", "true");
    separator.style.setProperty("box-sizing", "border-box", "important");
    separator.style.setProperty("width", "402px", "important");
    separator.style.setProperty("min-width", "402px", "important");
    separator.style.setProperty("max-width", "402px", "important");
    separator.style.setProperty("flex-basis", "402px", "important");
    separator.style.setProperty("padding-inline", "0", "important");
    return separator;
  };

  const makeLoop = () => {
    const loop = document.createElement("span");
    loop.className = "charity-marquee__loop";
    [...messages,...messages].forEach((item,i) => loop.append(makeMessage({...item,tone:i%2?'green':'pink'}), makeSeparator()));
    return loop;
  };

  let track = marquee.querySelector(".charity-marquee__track");
  if (!track) {
    track = document.createElement("span");
    track.className = "charity-marquee__track";
    marquee.replaceChildren(track);
  }
  track.setAttribute("aria-hidden", "true");
  track.replaceChildren(...Array.from({length:8}, makeLoop));
  track.style.removeProperty("transform");
  track.style.setProperty("animation", "r966-ticker-compositor 320s linear infinite", "important");
  track.style.setProperty("animation-timing-function", "linear", "important");
  track.style.setProperty("will-change", "transform", "important");
  track.style.setProperty("backface-visibility", "hidden", "important");
  track.style.setProperty("-webkit-backface-visibility", "hidden", "important");
  track.style.setProperty("transform-origin", "0 50%", "important");
});
