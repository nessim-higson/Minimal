/* =====================================================
   MINIMAL — build 004
   inline dial · "Questions?" pill · card lift-off.
   No dependencies.
   ===================================================== */
(() => {
"use strict";
const C = window.CONTENT;
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/* ================= LOAD CHOREOGRAPHY ================= */
const ready = () => requestAnimationFrame(() =>
  requestAnimationFrame(() => document.documentElement.classList.add("ready")));
(document.fonts?.ready || Promise.resolve()).then(ready);
setTimeout(ready, 900);
setTimeout(() => document.documentElement.classList.add("ready"), 1600);

/* ================= STATIC CONTENT ================= */
$("#name").textContent = C.name;
$("#role").textContent = C.role;
$("#email").textContent = C.footer.email;
$("#email").href = "mailto:" + C.footer.email;
$("#buildtag").textContent = C.footer.tag;
$("#big").innerHTML = `${C.footer.big[0]}<br><em>${C.footer.big[1]}</em>`;

/* ================= INLINE DIAL (by the name) ================= */
/* levels 0..3 — level 0 is uber-minimal (name + role only); + reveals more */
const LMIN = 0, LMAX = 3;
let level = LMIN;
const bioEl = $("#bio");
const less = $("#less"), more = $("#more");
let tokenCount = 0;

C.bio.forEach((par, pi) => {
  const p = document.createElement("p");
  if (pi > 0) p.className = "gap";
  p.dataset.min = Math.min(...par.map(t => t.l));
  par.forEach(tok => {
    const w = document.createElement("span");
    w.className = "w";
    w.dataset.l = tok.l;
    w.style.setProperty("--i", (300 + tokenCount++ * 26) + "ms");
    if (tok.chip) {
      const a = document.createElement("a");
      a.className = "chip " + tok.chip;
      a.textContent = tok.t;
      a.href = tok.href || "#";
      if (a.getAttribute("href").startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      w.appendChild(a);
      w.appendChild(document.createTextNode((tok.after || "") + " "));
    } else {
      w.textContent = tok.t + " ";
    }
    p.appendChild(w);
  });
  bioEl.appendChild(p);
});
setTimeout(() => $$("#bio .w").forEach(w => w.style.setProperty("--i", "0ms")), 2600);

function renderLevel() {
  let i = 0, j = 0;
  $$("#bio .w").forEach(w => {
    const show = +w.dataset.l <= level;
    const was = !w.classList.contains("hid");
    if (show && !was) w.style.setProperty("--i", (i++ * 16) + "ms");
    if (!show && was) w.style.setProperty("--i", (j++ * 7) + "ms");
    w.classList.toggle("hid", !show);
  });
  $$("#bio p").forEach(p => p.classList.toggle("empty", +p.dataset.min > level));
  bioEl.classList.toggle("allempty", level < 1);

  // + hides at max; − appears (with a pop) only once expanded
  const showLess = level > LMIN, showMore = level < LMAX;
  if (showLess && less.hidden) { less.hidden = false; less.classList.add("pop"); }
  else if (!showLess) less.hidden = true;
  if (showMore && more.hidden) { more.hidden = false; more.classList.add("pop"); }
  else if (!showMore) more.hidden = true;
}
const setLevel = n => { level = clamp(n, LMIN, LMAX); renderLevel(); };
[less, more].forEach(b => b.addEventListener("animationend", () => b.classList.remove("pop")));
less.onclick = () => setLevel(level - 1);
more.onclick = () => setLevel(level + 1);
addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (e.key === "-" || e.key === "_") setLevel(level - 1);
  if (e.key === "+" || e.key === "=") setLevel(level + 1);
});
renderLevel();

/* ================= WORK CAROUSEL ================= */
const works = $("#works");
C.works.forEach(w => {
  const a = document.createElement("a");
  a.className = "card" + (w.dark ? "" : " dark-text");
  a.dataset.k = w.k;
  a.href = w.href;
  if (w.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
  a.innerHTML = `<span class="fill ${w.art}">${w.k === "arena" ? "<i></i>" : ""}</span>
    <span class="arrow">↗</span>
    <span class="meta"><b>${w.title}</b><span>${w.line}</span></span>`;
  works.appendChild(a);
});

let dragging = false, sx = 0, sl = 0, moved = 0;
works.addEventListener("pointerdown", e => { dragging = true; moved = 0; sx = e.clientX; sl = works.scrollLeft; works.classList.add("drag"); });
addEventListener("pointermove", e => { if (!dragging) return; const d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); works.scrollLeft = sl - d; });
addEventListener("pointerup", () => { dragging = false; works.classList.remove("drag"); });
works.addEventListener("click", e => { if (moved > 6) e.preventDefault(); }, true);

const cards = $$(".card");
const bar = $("#progress-bar");
function paintCarousel() {
  const mid = innerWidth / 2;
  cards.forEach(c => {
    const r = c.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - mid);
    const s = reduced ? 1 : 1 - Math.min(d / innerWidth, 1) * 0.045;
    c.style.setProperty("--s", s.toFixed(4));
  });
  const max = works.scrollWidth - works.clientWidth;
  if (max > 0 && bar) bar.style.setProperty("--x", (works.scrollLeft / max * 96).toFixed(1) + "px");
}
works.addEventListener("scroll", () => requestAnimationFrame(paintCarousel), { passive: true });
addEventListener("resize", paintCarousel);
paintCarousel();

/* ================= WRITING SHELF ================= */
const shelf = $("#shelf");
C.writing.forEach((r, i) => {
  const a = document.createElement("a");
  a.className = "wcard";
  a.href = r.href;
  a.style.setProperty("--d", (i * 70) + "ms");
  a.innerHTML = `<span class="fill ${r.art}"></span>
    <span class="meta"><b>${r.title}</b><span>${r.tag}</span></span>`;
  shelf.appendChild(a);
});

/* ================= LAB MASONRY ================= */
const masonry = $("#masonry");
C.experiments.forEach((x, i) => {
  const a = document.createElement("a");
  a.className = "tile " + x.size;
  a.href = x.href;
  if (x.href.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
  a.style.setProperty("--d", ((i % 4) * 90) + "ms");
  a.innerHTML = `<span class="art ${x.art}"></span>
    <span class="cap"><b>${x.title}</b><span>${x.meta}</span></span>`;
  masonry.appendChild(a);
});

const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .18 });
$$(".wcard, .tile").forEach(el => io.observe(el));

/* ================= CARD LIFT-OFF PARALLAX ================= */
/* the dark room emerges from *under* the lifting sheet: its content
   starts pushed down and settles to rest as the sheet edge passes up */
const labHead = $("#lab-head");
const island = $("#island");
const room = $(".room");
const sheet = $(".sheet");
function paintLift() {
  const rect = room.getBoundingClientRect();
  // p: 0 when the room top sits at the viewport bottom, 1 once it reaches the top.
  // This is the window where the writing tail is on screen and the sheet lifts off.
  const p = clamp((innerHeight - rect.top) / (innerHeight * 0.85), 0, 1);
  if (!reduced) {
    const e = p * p;                                   // ease-in the lift
    const lift = e * 132;                              // sheet rises faster than the room
    const scale = 1 - p * 0.055;                       // and shrinks toward its bottom edge
    const rad = (40 + p * 40) | 0;
    sheet.style.transform = `translateY(${(-lift).toFixed(1)}px) scale(${scale.toFixed(4)})`;
    sheet.style.borderRadius = `0 0 ${rad}px ${rad}px`;
    sheet.style.boxShadow =
      `0 ${(44 + p * 36) | 0}px ${(80 + p * 50) | 0}px -10px rgba(0,0,0,${(0.6 + p * 0.28).toFixed(2)}),`
      + ` inset 0 -1px 0 rgba(255,255,255,.55)`;
    // the dark room rises up from under the lifting card
    const push = (1 - p) * 54;
    labHead.style.transform = `translateY(${push.toFixed(1)}px)`;
    masonry.style.transform = `translateY(${(push * 1.3).toFixed(1)}px)`;
  }
  // pill adapts to the dark room behind it
  island.classList.toggle("dusk", rect.top <= 58);
}
addEventListener("scroll", () => requestAnimationFrame(paintLift), { passive: true });
addEventListener("resize", paintLift);
paintLift();

/* ================= CLOCK ================= */
function tick() {
  $("#clock").textContent =
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " local";
}
tick(); setInterval(tick, 30000);

/* ================= ASK — the "Questions?" pill ================= */
const qPill = $("#qPill");
const askInput = $("#askInput");
const askGo = $("#askGo");
const answerEl = $("#answer");
let hideTimer, typeTimer;

function openAsk() { island.classList.add("open"); askInput.focus(); }
function closeAsk() { if (!askInput.value) island.classList.remove("open"); }
qPill.addEventListener("click", openAsk);
askInput.addEventListener("blur", () => setTimeout(closeAsk, 120));
addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); openAsk(); }
  if (e.key === "Escape") { askInput.value = ""; island.classList.remove("open"); hideAnswer(); }
});

askInput.placeholder = C.suggestions[0];

function showAnswer(text) {
  clearTimeout(hideTimer); clearInterval(typeTimer);
  answerEl.classList.add("in");
  if (reduced) { answerEl.textContent = text; }
  else {
    answerEl.innerHTML = `<span id="atext"></span><span class="caret"></span>`;
    const at = $("#atext");
    let n = 0;
    typeTimer = setInterval(() => {
      at.textContent = text.slice(0, ++n);
      if (n >= text.length) { clearInterval(typeTimer); setTimeout(() => answerEl.querySelector(".caret")?.remove(), 900); }
    }, 16);
  }
  hideTimer = setTimeout(hideAnswer, 8000);
}
const hideAnswer = () => answerEl.classList.remove("in");

function highlightBio() {
  const ws = $$("#bio .w:not(.hid)");
  ws.forEach((w, i) => setTimeout(() => w.classList.add("hl"), 450 + i * 28));
  setTimeout(() => ws.forEach(w => w.classList.remove("hl")), 4400);
}
function goCard(k) {
  const c = document.querySelector(`.card[data-k="${k}"]`);
  if (!c) return;
  $("#work").scrollIntoView({ behavior: "smooth" });
  c.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  c.classList.remove("pulse"); void c.offsetWidth; c.classList.add("pulse");
}
const ACTIONS = {
  level3: () => { setLevel(LMAX); $("#intro").scrollIntoView({ behavior: "smooth" }); highlightBio(); },
  footer: () => scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
  none:   () => {}
};
function runAction(action) {
  if (action.startsWith("card:")) return goCard(action.slice(5));
  if (action === "tab:writing")     return $("#writing").scrollIntoView({ behavior: "smooth" });
  if (action === "tab:experiments") return $("#lab").scrollIntoView({ behavior: "smooth" });
  (ACTIONS[action] || ACTIONS.none)();
}
function submitAsk() {
  const q = askInput.value.trim().toLowerCase();
  if (!q) return;
  const hit = C.kb.find(en => en.k.some(k => q.includes(k)));
  if (hit) { showAnswer(hit.a); runAction(hit.action); }
  else showAnswer(C.fallback);
  askInput.value = "";
  askInput.blur();
  island.classList.remove("open");
}
askGo.addEventListener("click", submitAsk);
askInput.addEventListener("keydown", e => { if (e.key === "Enter") submitAsk(); });
})();
