/* Round 1524: one tone per phrase, deterministic alternating ticker copy. */
document.addEventListener("DOMContentLoaded", () => {
  const marquee = document.querySelector(".charity-marquee");
  if (!marquee) return;
  const messages = [{"text": "Open 24/7", "tone": "pink"}, {"text": "Automation with a Human touch.", "tone": "green"}, {"text": "Elevating the human, not obsoleting them.", "tone": "pink"}, {"text": "Spend human time on human problems.", "tone": "green"}, {"text": "Connect the tools you already use.", "tone": "pink"}, {"text": "More time for people. Less time for process.", "tone": "green"}];

  const tickerText = messages.map(item => item.text).join(" ");
  marquee.setAttribute("aria-label", tickerText);
  marquee.dataset.text = tickerText;

  const makeMessage = (item) => {
    const copy = document.createElement("span");
    copy.className = "charity-marquee__copy";
    const segment = document.createElement("span");
    segment.className = `charity-marquee__segment charity-marquee__segment--${item.tone}`;
    segment.textContent = item.text;
    copy.append(segment);
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
    messages.forEach(item => loop.append(makeMessage(item), makeSeparator()));
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
  track.style.setProperty("animation", "r966-ticker-compositor 160s linear infinite", "important");
  track.style.setProperty("animation-timing-function", "linear", "important");
  track.style.setProperty("will-change", "transform", "important");
  track.style.setProperty("backface-visibility", "hidden", "important");
  track.style.setProperty("-webkit-backface-visibility", "hidden", "important");
  track.style.setProperty("transform-origin", "0 50%", "important");
});
