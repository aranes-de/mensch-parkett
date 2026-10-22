(() => {
  const root = document.documentElement;
  root.classList.add("js");

  /* ---------- Webfonts erst nach der ersten Anzeige laden ---------- */
  const fonts = [
    ["Instrument Serif", "instrument-serif", {}],
    ["Instrument Serif", "instrument-serif-italic", { style: "italic" }],
    ["Manrope", "manrope", { weight: "400 700" }],
  ];
  const loadFonts = () => fonts.forEach(([family, file, desc]) => {
    const face = new FontFace(family, `url(/fonts/${file}.woff2) format("woff2")`, { display: "swap", ...desc });
    document.fonts.add(face);
    face.load().catch(() => {});
  });
  if ("FontFace" in window) requestAnimationFrame(() => setTimeout(loadFonts, 0));

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Header: über dem Hero transparent, danach helle Leiste ---------- */
  const hdr = $("[data-hdr]");
  const hero = $(".hero");
  new IntersectionObserver(([en]) => hdr.classList.toggle("is-solid", !en.isIntersecting), {
    rootMargin: "-110px 0px 0px 0px",
  }).observe(hero);

  /* ---------- Mobile-Menü ---------- */
  const burger = $("[data-burger]");
  const mnav = $("[data-mnav]");
  const setMenu = (open) => {
    if (open) mnav.hidden = false;
    requestAnimationFrame(() => mnav.classList.toggle("is-open", open));
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    if (!open) setTimeout(() => { if (!mnav.classList.contains("is-open")) mnav.hidden = true; }, 700);
  };
  burger.addEventListener("click", () => setMenu(!mnav.classList.contains("is-open")));
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && mnav.classList.contains("is-open")) { setMenu(false); burger.focus(); } });

  /* ---------- Scroll-Reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-in");
      io.unobserve(en.target);
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal], [data-steps]").forEach((el) => io.observe(el));

  /* ---------- Zweites Hero-Bild erst nach dem Laden der Seite ---------- */
  const loadDeferred = () => $$("[data-defer]").forEach((img) => {
    const src = img.parentElement.querySelector("source[data-srcset]");
    if (src) src.srcset = src.dataset.srcset;
    img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
  });
  if (document.readyState === "complete") setTimeout(loadDeferred, 1200);
  else addEventListener("load", () => setTimeout(loadDeferred, 1200));

  /* ---------- Imagefilm: YouTube erst beim Klick laden ---------- */
  $$("[data-yt]").forEach((box) => {
    $("button", box).addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${box.dataset.yt}?autoplay=1&rel=0`;
      f.title = "Imagefilm Christian Mensch Parkett- und Fußbodentechnik";
      f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      box.replaceChildren(f);
      f.focus();
    });
  });
})();
