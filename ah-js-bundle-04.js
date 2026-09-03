(() => {
  const roots = document.querySelectorAll("[data-ah-rates]");

  roots.forEach((root) => {
    const navLinks = [...root.querySelectorAll('.ah-rates__nav a[href^="#"]')];
    const sections = navLinks
      .map((link) => root.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const topButton = root.querySelector(".ah-rates__to-top");

    root.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    });

    root.querySelectorAll("[data-ah-contact]").forEach((link) => {
      link.addEventListener("click", () => {
        document.dispatchEvent(
          new CustomEvent("automated-hearts:contact", {
            detail: { service: link.getAttribute("data-ah-contact") },
          }),
        );
      });
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          const active = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!active) return;
          navLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${active.target.id}`;
            if (isCurrent) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        },
        { rootMargin: "-20% 0px -65%", threshold: [0.08, 0.2, 0.5] },
      );
      sections.forEach((section) => observer.observe(section));
    }

    const toggleTopButton = () => {
      if (topButton) {
        topButton.setAttribute("data-visible", window.scrollY > 700 ? "true" : "false");
      }
    };
    toggleTopButton();
    window.addEventListener("scroll", toggleTopButton, { passive: true });
  });
})();

;
(() => {
  const root = document.querySelector("[data-r864-rates]");
  if (!root) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const drawers = [...root.querySelectorAll(".r864-rates__drawer")];
  const jumpLinks = [...root.querySelectorAll("[data-r864-open]")];
  const topButton = root.querySelector("[data-r864-top]");

  const setCurrent = (drawerId) => {
    jumpLinks.forEach((link) => {
      if (link.closest(".r864-rates__paths")) return;
      if (link.getAttribute("data-r864-open") === drawerId) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const openDrawer = (drawerId, shouldScroll = true) => {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return;

    if (drawer instanceof HTMLDetailsElement) drawer.open = true;
    setCurrent(drawerId);

    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        drawer.scrollIntoView({
          behavior: prefersReducedMotion.matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  jumpLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const drawerId = link.getAttribute("data-r864-open");
      if (!drawerId) return;
      event.preventDefault();
      openDrawer(drawerId);
      window.history.replaceState(null, "", `#${drawerId}`);
    });
  });

  drawers.forEach((drawer) => {
    if (drawer instanceof HTMLDetailsElement) {
      drawer.addEventListener("toggle", () => {
        if (drawer.open) setCurrent(drawer.id);
      });
    }
  });

  root.querySelectorAll("[data-ah-contact]").forEach((link) => {
    link.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("automated-hearts:contact", {
          detail: { service: link.getAttribute("data-ah-contact") || "Rates & Services" },
        }),
      );
    });
  });

  if (topButton) {
    topButton.addEventListener("click", (event) => {
      event.preventDefault();
      const top = document.getElementById("r864-rates-top");
      if (!top) return;
      top.scrollIntoView({
        behavior: prefersReducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
    });

    const updateTopButton = () => {
      topButton.setAttribute("data-visible", window.scrollY > 720 ? "true" : "false");
    };
    updateTopButton();
    window.addEventListener("scroll", updateTopButton, { passive: true });
  }

  const initialDrawerId = window.location.hash.slice(1);
  if (drawers.some((drawer) => drawer.id === initialDrawerId)) {
    openDrawer(initialDrawerId, false);
  }
})();

;
(() => {
  const root = document.querySelector("[data-r864-rates]");
  if (!root) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute("data-r864-open") || link.hasAttribute("data-contact-trigger")) return;

    const targetId = link.getAttribute("href").slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${targetId}`);
  });
})();
