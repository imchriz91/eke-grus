/* ==========================================================================
   Eke Grus AB — shared vanilla JS (all pages, both languages)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initScrollReveal();
  initFaqAccordion();
  initGalleryLightbox();
  initCalculator();
  initPdfScrollGuard();
});

/* ---- Mobile nav toggle ---- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("nav-panel");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    if (isOpen) {
      panel.setAttribute("hidden", "");
    } else {
      panel.removeAttribute("hidden");
    }
  });

  // Keep the panel usable if the viewport is resized past the mobile breakpoint.
  const desktopQuery = window.matchMedia("(min-width: 768px)");
  desktopQuery.addEventListener("change", (e) => {
    if (e.matches) {
      panel.removeAttribute("hidden");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      panel.setAttribute("hidden", "");
    }
  });
}

/* ---- Scroll reveal via IntersectionObserver ---- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---- FAQ accordion: keep only one <details> open at a time ---- */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });

    // Clicking the open answer (but not a link inside it) closes it again,
    // since only the <summary> row toggles a native <details> by default.
    const answer = item.querySelector(".faq-answer");
    if (answer) {
      answer.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        item.open = false;
      });
    }
  });
}

/* ---- Gallery lightbox ---- */
function initGalleryLightbox() {
  const items = [...document.querySelectorAll(".gallery-item")];
  if (!items.length) return;

  let currentIndex = 0;
  let triggerEl = null;

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Stäng / Close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <button type="button" class="lightbox__prev" aria-label="Föregående / Previous">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button type="button" class="lightbox__next" aria-label="Nästa / Next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
    <figure class="lightbox__figure">
      <img class="lightbox__img" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector(".lightbox__img");
  const captionEl = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__prev");
  const nextBtn = lightbox.querySelector(".lightbox__next");
  const focusable = [prevBtn, nextBtn, closeBtn];

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const caption = item.querySelector("img").alt;
    imgEl.src = item.dataset.full;
    imgEl.alt = caption;
    captionEl.textContent = caption;
  }

  function open(index, trigger) {
    triggerEl = trigger;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    imgEl.removeAttribute("src");
    if (triggerEl) triggerEl.focus();
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index, item));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(currentIndex - 1);
    else if (e.key === "ArrowRight") show(currentIndex + 1);
    else if (e.key === "Tab") {
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* ---- PDF embed scroll guard: a click "unlocks" the embedded PDF for
   normal scrolling/zooming; moving the mouse away re-locks it, so a
   mouse just passing over it while scrolling the page never gets
   swallowed by the PDF viewer. ---- */
function initPdfScrollGuard() {
  document.querySelectorAll(".pdf-card__embed").forEach((wrap) => {
    const guard = wrap.querySelector(".pdf-card__embed-guard");
    if (!guard) return;

    guard.addEventListener("click", () => {
      wrap.classList.add("is-unlocked");
    });

    wrap.addEventListener("mouseleave", () => {
      wrap.classList.remove("is-unlocked");
    });
  });
}

/* ---- Material quantity calculator (volume + weight from L x W x depth) ---- */
function initCalculator() {
  const calculator = document.querySelector(".calculator");
  if (!calculator) return;

  const lengthInput = document.getElementById("calc-length");
  const widthInput = document.getElementById("calc-width");
  const depthInput = document.getElementById("calc-depth");
  const materialSelect = document.getElementById("calc-material");
  const marginCheckbox = document.getElementById("calc-margin");
  const marginPercentEl = document.getElementById("calc-margin-percent");
  const resultEl = document.getElementById("calc-result");
  if (!lengthInput || !widthInput || !depthInput || !materialSelect || !marginCheckbox || !resultEl) return;

  const locale = document.documentElement.lang === "en" ? "en-US" : "sv-SE";
  const volLabel = calculator.dataset.volLabel || "Volume";
  const kgLabel = calculator.dataset.kgLabel || "Weight";
  const tonLabel = calculator.dataset.tonLabel || "Weight (tonnes)";
  const tonUnit = calculator.dataset.tonUnit || "t";
  const placeholder = calculator.dataset.placeholder || "";

  function selectedMaterial() {
    const opt = materialSelect.selectedOptions[0];
    if (!opt || !opt.dataset.density) return null;
    return { density: parseFloat(opt.dataset.density), margin: parseFloat(opt.dataset.margin || "10") };
  }

  function updateMarginLabel() {
    const material = selectedMaterial();
    marginPercentEl.textContent = material ? material.margin : 10;
  }

  function showPlaceholder() {
    resultEl.innerHTML = '<p class="calculator__placeholder"></p>';
    resultEl.querySelector(".calculator__placeholder").textContent = placeholder;
  }

  function calculate() {
    const length = parseFloat(lengthInput.value);
    const width = parseFloat(widthInput.value);
    const depthCm = parseFloat(depthInput.value);
    const material = selectedMaterial();

    if (!(length > 0) || !(width > 0) || !(depthCm > 0) || !material) {
      showPlaceholder();
      return;
    }

    const depthM = depthCm / 100;
    let volume = length * width * depthM;
    if (marginCheckbox.checked) {
      volume *= 1 + material.margin / 100;
    }
    const weightKg = volume * material.density;

    // Round up to a practical order size — never round down, so the
    // estimate stays on the safe side of "enough material".
    const roundedVolume = Math.ceil(volume * 10) / 10;
    const roundedKg = Math.ceil(weightKg / 50) * 50;
    const roundedTon = roundedKg / 1000;

    const fmt = (n, maxDecimals) => n.toLocaleString(locale, { maximumFractionDigits: maxDecimals });

    resultEl.innerHTML = `
      <div class="calculator__result-grid">
        <div class="calculator__stat">
          <span class="calculator__stat-value">${fmt(roundedVolume, 1)} m³</span>
          <span class="calculator__stat-label">${volLabel}</span>
        </div>
        <div class="calculator__stat">
          <span class="calculator__stat-value">${fmt(roundedKg, 0)} kg</span>
          <span class="calculator__stat-label">${kgLabel}</span>
        </div>
        <div class="calculator__stat">
          <span class="calculator__stat-value">${fmt(roundedTon, 2)} ${tonUnit}</span>
          <span class="calculator__stat-label">${tonLabel}</span>
        </div>
      </div>
    `;
  }

  [lengthInput, widthInput, depthInput].forEach((el) => el.addEventListener("input", calculate));
  materialSelect.addEventListener("change", () => {
    updateMarginLabel();
    calculate();
  });
  marginCheckbox.addEventListener("change", calculate);

  updateMarginLabel();
  showPlaceholder();
}
