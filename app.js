/* =====================================================
   MINIMAL — build 002
   dial · carousel · ask · reveals. No dependencies.
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

/* ================= STATIC CONTENT ================= */
$("#name").textContent = C.name;
$("#role").textContent = C.role;
$("#toast-title").textContent = C.toast.title;
$("#toast-line").textContent = C.toast.line;
$("#toast").href = C.toast.href;
$("#email").textContent = C.footer.email;
$("#email").href = "mailto:" + C.footer.email;
$("#buildtag").textContent = C.footer.tag;
$("#big").innerHTML = `${C.footer.big[0]}<br><em>${C.footer.big[1]}</em>`;

/* ================= THE DIAL ================= */
let level = 1;
const bioEl = $("#bio");

C.bio.forEach((par, pi) => {
  const p = document.createElement("p");
  if (pi > 0) p.className = "gap";
  p.dataset.min = Math.min(...par.map(t => t.l));
  par.forEach(tok => {
    const w = document.createElement("span");
    w.className = "w";
    w.dataset.l = tok.l;
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

/* ================= TOAST ================= */
const toast = $("#toast");
setTimeout(() => toast.classList.add("in"), 1100);
addEventListener("scroll", () => {
  toast.classList.toggle("gone", scrollY > 300);
}, { passive: true });

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

/* drag to scroll */
let dragging = false, sx = 0, sl = 0, moved = 0;
works.addEventListener("pointerdown", e => { dragging = true; moved = 0; sx = e.clientX; sl = works.scrollLeft; works.classList.add("drag"); });
addEventListener("pointermove", e => { if (!dragging) return; const d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); works.scrollLeft = sl - d; });
addEventListener("pointerup", () => { dragging = false; works.classList.remove("drag"); });
works.addEventListener("click", e => { if (moved > 6) e.preventDefault(); }, true);

/* proximity scale + progress line */
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
  if (max > 0 && bar) {
    const track = 120 - 24; // progress width minus thumb
    bar.style.setProperty("--x", (works.scrollLeft / max * track).toFixed(1) + "px");
  }
}
works.addEventListener("scroll", () => requestAnimationFrame(paintCarousel), { passive: true });
addEventListener("resize", paintCarousel);
paintCarousel();

/* ================= TABS + ROW REVEALS ================= */
const list = $("#list");
const rowObserver = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); rowObserver.unobserve(en.target); } });
}, { threshold: .3 });

function renderTab(name, instant) {
  list.innerHTML = "";
  C[name].forEach((r, i) => {
    const a = document.createElement("a");
    a.className = "row";
    a.href = r.href;
    a.style.setProperty("--d", (i * 55) + "ms");
    a.innerHTML = `<b>${r.title}</b><span>${r.meta}</span>`;
    list.appendChild(a);
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => a.classList.add("in")));
    else rowObserver.observe(a);
  });
  $$("#tabs button").forEach(b => b.classList.toggle("on", b.dataset.tab === name));
}
$$("#tabs button").forEach(b => b.onclick = () => renderTab(b.dataset.tab, true));
renderTab("writing", false);

/* ================= FOOTER PARALLAX + CLOCK ================= */
const footerInner = $("#footer-inner");
function paintFooter() {
  const doc = document.documentElement;
  const remaining = doc.scrollHeight - innerHeight - scrollY; // 0 at very bottom
  const fh = parseInt(getComputedStyle(doc).getPropertyValue("--footer-h")) || 440;
  const p = Math.max(0, Math.min(1, 1 - remaining / fh));    // 0..1 revealed
  if (!reduced) footerInner.style.transform = `translateY(${((1 - p) * 56).toFixed(1)}px)`;
  footerInner.style.opacity = (0.35 + p * 0.65).toFixed(3);
}
addEventListener("scroll", () => requestAnimationFrame(paintFooter), { passive: true });
paintFooter();

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

/* rotating placeholder */
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
  if (action.startsWith("tab:")) {
    renderTab(action.slice(4), true);
    return $("#tabs").scrollIntoView({ behavior: "smooth" });
  }
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
