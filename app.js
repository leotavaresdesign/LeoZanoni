/* ============================================================
   LEO ZANONI — portfolio interactions (simplified)
   ============================================================ */

(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function photoHTML({ tone, aspect, label, image, ratio, cursor, pos, zoom }) {
    const extra = (pos ? `background-position:${pos};` : "") + (zoom ? `background-size:${zoom};` : "");
    const layer = image
      ? `<div class="ph-layer" style="background-image:url('${encodeURI(image)}');${extra}"></div>`
      : `<div class="ph-layer"></div>`;
    const arStyle = ratio ? `aspect-ratio:${ratio};` : "";
    const cur = cursor ? "cursor:zoom-in;" : "";
    const style = (arStyle || cur) ? ` style="${arStyle}${cur}"` : "";
    return `
      <div class="photo ${ratio ? "" : (aspect || "ar-4-5")} ${image ? "" : (tone || "tone-warm")}"${style}>
        ${layer}
        <div class="ph-grain"></div>
        ${label ? `<div class="ph-label">${label}</div>` : ""}
      </div>`;
  }

  /* ---------- Nav scroll state ---------- */
  const nav = $("#nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile burger menu ---------- */
  const navToggle = $(".nav-toggle");
  const navLinksEl = $(".nav-links");
  function closeMenu() { document.body.classList.remove("menu-open"); }
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open");
    });
  }
  // close menu when any nav link is tapped
  if (navLinksEl) {
    navLinksEl.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", closeMenu);
    });
  }
  // close on Escape
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  /* ---------- Smooth scroll ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
  function observeReveals() { $$(".reveal").forEach(el => io.observe(el)); }

  /* ============================================================
     HERO — cycling photo beside the name
     ============================================================ */
  const HERO = window.HERO_PHOTOS || [];
  const heroFrame = $("#heroFrame");
  let heroIdx = 0;

  function renderHero() {
    const slides = HERO.map((p, i) => `
      <div class="hero-slide ${i === 0 ? "active" : ""}" data-slide="${i}">
        ${photoHTML({ image: p.src, tone: p.tone, label: "", pos: p.heroPos, zoom: p.heroZoom })}
        <div class="hero-slide-cap">
          <span>${p.title}</span><span>${p.year}</span>
        </div>
      </div>
    `).join("");

    const dots = HERO.map((_, i) => `<button class="hero-dot ${i===0?"active":""}" data-dot="${i}" aria-label="Photo ${i+1}"></button>`).join("");

    // Two static side photos (used only by the Triptych layout)
    const sideA = HERO[1] || HERO[0];
    const sideB = HERO[2] || HERO[0];

    heroFrame.innerHTML = `
      <div class="hero-main">
        ${slides}
        <div class="hero-dots">${dots}</div>
      </div>
      <div class="hero-side" aria-hidden="true">
        <div class="hero-side-ph"><div class="photo" style="height:100%;"><div class="ph-layer" style="background-image:url('${encodeURI(sideA.src)}');"></div><div class="ph-grain"></div></div></div>
        <div class="hero-side-ph"><div class="photo" style="height:100%;"><div class="ph-layer" style="background-image:url('${encodeURI(sideB.src)}');"></div><div class="ph-grain"></div></div></div>
      </div>
    `;

    heroFrame.querySelectorAll("[data-dot]").forEach(d => {
      d.addEventListener("click", () => goHero(+d.dataset.dot));
    });
  }

  function goHero(i) {
    heroIdx = (i + HERO.length) % HERO.length;
    heroFrame.querySelectorAll(".hero-slide").forEach((s, k) => s.classList.toggle("active", k === heroIdx));
    heroFrame.querySelectorAll(".hero-dot").forEach((d, k) => d.classList.toggle("active", k === heroIdx));
  }

  let heroTimer = null;
  function startHero() {
    stopHero();
    heroTimer = setInterval(() => goHero(heroIdx + 1), 6000);
  }
  function stopHero() { if (heroTimer) clearInterval(heroTimer); }

  if (HERO.length) {
    renderHero();
    startHero();
    heroFrame.addEventListener("mouseenter", stopHero);
    heroFrame.addEventListener("mouseleave", startHero);
  }

  /* ============================================================
     GALLERY
     ============================================================ */
  const PHOTOS = window.PHOTOS || [];
  const gallery = $("#gallery");

  function renderGallery() {
    gallery.innerHTML = PHOTOS.map((p, i) => `
      <figure class="g-item reveal" data-index="${i}" tabindex="0" role="button" aria-label="View ${p.title}">
        ${photoHTML({ image: p.src, ratio: p.ratio, label: "", cursor: true })}
        <figcaption class="g-cap">
          <span class="t">${p.title}</span>
          <span class="m">${p.place} · ${p.year}</span>
        </figcaption>
      </figure>
    `).join("");

    $$(".g-item").forEach(item => {
      item.addEventListener("click", () => openLightbox(+item.dataset.index));
      item.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(+item.dataset.index); }
      });
    });
    observeReveals();
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lightbox = $("#lightbox");
  const lbStage = $("#lbStage");
  const lbCaption = $("#lbCaption");
  let lbIdx = 0;

  function openLightbox(i) {
    lbIdx = i;
    renderLb();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function renderLb() {
    const p = PHOTOS[lbIdx];
    lbStage.innerHTML = `<img class="lb-img" src="${encodeURI(p.src)}" alt="${p.title}">`;
    lbCaption.innerHTML = `<span class="t">${p.title}</span><span class="m">${p.place} · ${p.year} · ${String(lbIdx+1).padStart(2,"0")} / ${String(PHOTOS.length).padStart(2,"0")}</span>`;
  }
  function lbGo(d) { lbIdx = (lbIdx + d + PHOTOS.length) % PHOTOS.length; renderLb(); }
  function closeLb() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $("[data-lb-close]").addEventListener("click", closeLb);
  $("[data-lb-prev]").addEventListener("click", () => lbGo(-1));
  $("[data-lb-next]").addEventListener("click", () => lbGo(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") lbGo(-1);
    if (e.key === "ArrowRight") lbGo(1);
  });

  /* ---------- Contact form (Web3Forms AJAX) ---------- */
  const cForm = $("#contactForm");
  const cStatus = $("#formStatus");
  if (cForm) {
    cForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = cForm.querySelector("button[type=submit]");
      const oldHTML = btn.innerHTML;
      btn.innerHTML = `<span>Sending…</span>`;
      cStatus.hidden = true;

      try {
        const data = new FormData(cForm);
        const res = await fetch(cForm.action, { method: "POST", body: data, headers: { Accept: "application/json" } });
        const json = await res.json();
        if (res.ok && json.success) {
          cForm.reset();
          cStatus.textContent = "Thank you — your message has been sent.";
          cStatus.className = "cform-status ok";
        } else {
          cStatus.textContent = json.message || "Something went wrong. Please try again or email via Instagram.";
          cStatus.className = "cform-status err";
        }
      } catch (err) {
        cStatus.textContent = "Network error. Please try again later.";
        cStatus.className = "cform-status err";
      }
      cStatus.hidden = false;
      btn.innerHTML = oldHTML;
    });
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav-links a[data-nav]");
  const sections = ["work", "about", "contact"].map(id => ({ id, el: document.getElementById(id) })).filter(s => s.el);
  function updateActiveNav() {
    const y = window.scrollY + window.innerHeight * 0.35;
    let active = null;
    for (const s of sections) {
      const top = s.el.getBoundingClientRect().top + window.scrollY;
      if (y >= top) active = s.id;
    }
    navLinks.forEach(a => a.classList.toggle("active", a.dataset.nav === active));
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* ---------- Boot ---------- */
  renderGallery();
  observeReveals();
  updateActiveNav();
})();
