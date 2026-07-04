/* =====================================================
   MINIMAL — build 003
   island nav · dial · carousel · shelf · lab · ask.
   No dependencies.
   ===================================================== */
(() => {
"use strict";
const C = window.CONTENT;
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ================= LOAD CHOREOGRAPHY ================= */
const ready = () => requestAnimationFrame(() =>
  requestAnimationFrame(() => document.documentElement.classList.add("ready")));
(document.fonts?.ready || Promise.resolve()).then(ready);
setTimeout(ready, 900); // fallback if fonts hang
// hard fallback: background tabs throttle rAF — never leave content hidden
setTimeout(() => document.documentElement.classList.add("ready"), 1600);

/* ================= STATIC CONTENT ================= */
$("#name").textContent = C.name;
$("#role").textContent = C.role;
$("#email").textContent = C.footer.email;
$("#email").href = "mailto:" + C.footer.email;
$("#buildtag").textContent = C.footer.tag;
$("#big").innerHTML = `${C.footer.big[0]}<br><em>${C.footer.big[1]}</em>`;

/* ================= ISLAND NAV (Dynamic-Island style) ================= */
const island = $("#island");
const navEl = $("#nav");
const thumb = $("#thumb");
$("#note-title").textContent = C.toast.title;
$("#note-line").textContent = C.toast.line;
$("#note").href = C.toast.href;

C.nav.forEach(item => {
  const b = document.createElement("button");
  b.className = "nav-item";
  b.textContent = item.label;
  b.dataset.target = item.target;
  b.onclick = () => document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth" });
  navEl.insertBefore(b, thumb);
});
const navItems = $$(".nav-item");

function sizeIsland(mode) {
  island.classList.remove("mode-note", "mode-nav");
  island.classList.add(mode);
  const layer = mode === "mode-note" ? $("#note") : navEl;
  // measure the target layer's natural width
  const prev = layer.style.position;
  island.style.width = "auto";
  layer.style.position = "static";
  const w = layer.scrollWidth + 16;
  layer.style.position = prev || "";
  island.style.width = w + "px";
}
function setThumb(el) {
  navItems.forEach(b => b.classList.toggle("on", b === el));
  if (!el) { thumb.style.setProperty("--tw", "0px"); return; }
  thumb.style.setProperty("--tx", (el.offsetLeft) + "px");
  thumb.style.setProperty("--tw", el.offsetWidth + "px");
}

/* arrive as the studio note, then fold into the nav */
sizeIsland("mode-note");
setTimeout(() => { sizeIsland("mode-nav"); setThumb(null); }, 3400);
addEventListener("resize", () => sizeIsland(island.classList.contains("mode-note") ? "mode-note" : "mode-nav"));

/* scrollspy — thumb glides to the section in view; island goes dusk in the Lab */
const SPY = [["#work", "Work"], ["#writing", "Writing"], ["#lab", "Lab"]];
function spy() {
  const y = scrollY + innerHeight * 0.35;
  let current = null;
  SPY.forEach(([sel]) => {
    const el = document.querySelector(sel);
    if (el && el.offsetTop <= y) current = sel;
  });
  if ($("#intro").offsetTop + $("#intro").offsetHeight * .5 > y) current = null;
  setThumb(navItems.find(b => b.dataset.target === current) || null);
  island.classList.toggle("dusk", scrollY + 64 >= $("#lab").offsetTop);
}
addEventListener("scroll", () => requestAnimationFrame(spy), { passive: true });

/* ================= THE DIAL ================= */
let level = 1;
const bioEl = $("#bio");
let tokenCount = 0;

C.bio.forEach((par, pi) => {
  const p = document.createElement("p");
  if (pi > 0) p.className = "gap";
  p.dataset.min = Math.min(...par.map(t => t.l));
  par.forEach(tok => {
    const w = document.createElement("span");
    w.className = "w";
    w.dataset.l = tok.l;
    w.style.setProperty("--i", (300 + tokenCount++ * 26) + "ms"); // word-by-word entrance
    if (tok.chip) {
      const a = document.createElement("a");
      a.className = "chip " + tok.chip;
      a.textContent = tok.t;
      a.href = tok.href || "#";
      if (a.getAttribute("href").startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
      w.appendChild(a);
      w.appendChild(document.createTextNode((tok.after || "") + " "));
    } else {
      w.textContent = tok.t + " ";
    }
    p.appendChild(w);
  });
  bioEl.appendChild(p);
});
/* after the entrance, clear the load delays so the dial feels instant */
setTimeout(() => $$("#bio .w").forEach(w => w.style.setProperty("--i", "0ms")), 2600);

function renderLevel() {
  let i = 0, j = 0;
  $$("#bio .w").forEach(w => {
    const show = level > 0 && +w.dataset.l <= level;
    const was = !w.classList.contains("hid");
    if (show && !was) w.style.setProperty("--i", (i++ * 16) + "ms");
    if (!show && was) w.style.setProperty("--i", (j++ * 7) + "ms");
    w.classList.toggle("hid", !show);
  });
  $$("#bio p.gap").forEach(p => p.classList.toggle("empty", +p.dataset.min > level));
  $$("#dots i").forEach((d, k) => d.classList.toggle("on", k === level));
  $("#less").disabled = level === 0;
  $("#more").disabled = level === 3;
}
const setLevel = n => { level = Math.max(0, Math.min(3, n)); renderLevel(); };

$("#less").onclick = () => setLevel(level - 1);
$("#more").onclick = () => setLevel(level + 1);
$("#lessK").onclick = () => setLevel(level - 1);
$("#moreK").onclick = () => setLevel(level + 1);
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

/* shared in-view reveal */
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .18 });
$$(".wcard, .tile").forEach(el => io.observe(el));

/* ================= CLOCK ================= */
function tick() {
  $("#clock").textContent =
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " local";
}
tick(); setInterval(tick, 30000);

/* ================= ASK THE SITE ================= */
const ask = $("#ask");
const askWrap = $("#askWrap");
const answerEl = $("#answer");
let hideTimer, typeTimer;

let sug = 0;
setInterval(() => {
  if (document.activeElement === ask || ask.value) return;
  ask.classList.add("swap");
  setTimeout(() => {
    sug = (sug + 1) % C.suggestions.length;
    ask.placeholder = C.suggestions[sug];
    ask.classList.remove("swap");
  }, 300);
}, 4200);

ask.addEventListener("focus", () => askWrap.classList.add("wide"));
ask.addEventListener("blur", () => askWrap.classList.remove("wide"));
addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); ask.focus(); }
  if (e.key === "Escape") { ask.blur(); hideAnswer(); }
});

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
  level3: () => { setLevel(3); $("#intro").scrollIntoView({ behavior: "smooth" }); highlightBio(); },
  footer: () => scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
  none:   () => {}
};
function runAction(action) {
  if (action.startsWith("card:")) return goCard(action.slice(5));
  if (action === "tab:writing")     return $("#writing").scrollIntoView({ behavior: "smooth" });
  if (action === "tab:experiments") return $("#lab").scrollIntoView({ behavior: "smooth" });
  (ACTIONS[action] || ACTIONS.none)();
}

ask.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;
  const q = ask.value.trim().toLowerCase();
  if (!q) return;
  const hit = C.kb.find(en => en.k.some(k => q.includes(k)));
  if (hit) { showAnswer(hit.a); runAction(hit.action); }
  else showAnswer(C.fallback);
  ask.value = "";
  ask.blur();
});
})();
