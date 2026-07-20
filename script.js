(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Mobile navigation
  const navToggle = $(".nav-toggle");
  const primaryNav = $("#primary-nav");

  if (navToggle && primaryNav) {
    const closeNav = () => {
      navToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    const openNav = () => {
      navToggle.setAttribute("aria-expanded", "true");
      primaryNav.classList.add("is-open");
      document.body.classList.add("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    $$("a", primaryNav).forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        primaryNav.classList.contains("is-open") &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1100) {
        closeNav();
      }
    });
  }

  // Footer year
  $$("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  // Gentle reveal animation with reduced-motion support
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealItems = $$(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  // Smooth FAQ accordions
  $$(".faq-list details").forEach((details) => {
    const summary = $("summary", details);
    if (!summary) return;

    const contentNodes = [...details.children].filter((child) => child !== summary);
    if (!contentNodes.length) return;

    const content = document.createElement("div");
    const inner = document.createElement("div");
    content.className = "accordion-content";
    inner.className = "accordion-content__inner";
    contentNodes.forEach((node) => inner.appendChild(node));
    content.appendChild(inner);
    details.appendChild(content);

    let animating = false;

    const finishOpen = (event) => {
      if (event.propertyName !== "height") return;
      content.style.height = "auto";
      animating = false;
      content.removeEventListener("transitionend", finishOpen);
    };

    const finishClose = (event) => {
      if (event.propertyName !== "height") return;
      details.open = false;
      animating = false;
      content.removeEventListener("transitionend", finishClose);
    };

    const openAccordion = () => {
      details.open = true;
      content.style.height = "0px";
      content.style.opacity = "0";
      requestAnimationFrame(() => {
        animating = true;
        content.style.height = `${inner.scrollHeight}px`;
        content.style.opacity = "1";
        content.addEventListener("transitionend", finishOpen);
      });
    };

    const closeAccordion = () => {
      content.style.height = `${inner.scrollHeight}px`;
      content.style.opacity = "1";
      requestAnimationFrame(() => {
        animating = true;
        content.style.height = "0px";
        content.style.opacity = "0";
        content.addEventListener("transitionend", finishClose);
      });
    };

    if (details.open) {
      content.style.height = "auto";
      content.style.opacity = "1";
    }

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (animating) return;
      details.open ? closeAccordion() : openAccordion();
    });
  });

  // Glossary search
  const glossarySearch = $("#glossary-search");
  const glossaryEntries = $$("[data-glossary-entry]");
  const glossaryCount = $("[data-glossary-count]");
  const glossaryEmpty = $("[data-glossary-empty]");

  if (glossarySearch && glossaryEntries.length) {
    const filterGlossary = () => {
      const query = glossarySearch.value.trim().toLowerCase();
      let visibleCount = 0;

      glossaryEntries.forEach((entry) => {
        const haystack = entry.dataset.searchText || entry.textContent.toLowerCase();
        const isVisible = !query || haystack.includes(query);

        entry.hidden = !isVisible;

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (glossaryCount) {
        glossaryCount.textContent = String(visibleCount);
      }

      if (glossaryEmpty) {
        glossaryEmpty.hidden = visibleCount !== 0;
      }
    };

    glossarySearch.addEventListener("input", filterGlossary);
  }

  // Prevent an unconfigured contact form from appearing to submit successfully.
  const contactForm = $("[data-contact-form]");
  const formStatus = $("[data-form-status]");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      const action = contactForm.getAttribute("action") || "";
      const endpointIsPlaceholder = action.includes("REPLACE_WITH_FORM_ID");

      if (!contactForm.checkValidity()) {
        event.preventDefault();
        contactForm.reportValidity();
        return;
      }

      if (endpointIsPlaceholder) {
        event.preventDefault();

        if (formStatus) {
          formStatus.textContent =
            "This form still needs its secure delivery endpoint before launch.";
        }
      }
    });
  }
})();
