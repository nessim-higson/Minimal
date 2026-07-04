/* =====================================================
   MINIMAL — content model
   All copy lives here. Edit this file, touch nothing else.
   ===================================================== */

window.CONTENT = {

  name: "Nessim Higson",
  role: "Design & creative technology.",

  /* ---- the dial ----
     Bio is one growing text. Each token has a minimum level (1–3).
     level 0 = name only. Chips render as inline project tags;
     `after` is punctuation glued to the chip. */
  bio: [
    [
      { t: "I run", l: 1 },
      { chip: "iaah", t: "IAAH", l: 1, href: "https://iamalwayshungry.com" },
      { t: "— an independent design practice.", l: 1 },
      { t: "I make brands, websites, and interactive systems.", l: 1 },
      { t: "Lately they behave more like weather than software.", l: 2 }
    ],
    [
      { t: "Right now that means", l: 2 },
      { chip: "wkndr", t: "WKNDR", l: 2, href: "#work", after: ", a weather-native city app;" },
      { chip: "fields", t: "FIELDS", l: 2, href: "#work", after: ", a family of generative light engines;" },
      { t: "and show systems for", l: 2 },
      { chip: "arena", t: "THE ARENA", l: 2, href: "#work", after: "." }
    ],
    [
      { t: "Before this I spent two decades art-directing for music, film, and technology —", l: 3 },
      { t: "work that taught me the best interfaces are the ones with an inner life.", l: 3 },
      { t: "I prototype daily, write occasionally, and believe every site should be able to answer for itself.", l: 3 }
    ]
  ],

  toast: {
    title: "Studio note",
    line: "New experiments in the hub weekly",
    href: "https://nessim-higson.github.io"
  },

  nav: [
    { label: "Work",    target: "#work" },
    { label: "Writing", target: "#writing" },
    { label: "Lab",     target: "#lab" }
  ],

  /* ---- latest work ----
     art = CSS class painting the card (see styles.css) */
  works: [
    { k: "wkndr",    title: "WKNDR",     line: "Weather-native plans for your city",      art: "art-wkndr", dark: false, href: "#" },
    { k: "fields",   title: "FIELDS",    line: "A family of generative light engines",    art: "art-fields", dark: true,  href: "https://nessim-higson.github.io/fields/" },
    { k: "arena",    title: "The Arena", line: "Living brand systems for an IP studio",   art: "art-arena", dark: true,  href: "https://nessim-higson.github.io/arena-guidelines/" },
    { k: "fovea",    title: "FOVEA",     line: "A lens-tunnel portfolio engine",          art: "art-fovea", dark: true,  href: "https://github.com/nessim-higson/fovea" },
    { k: "coltrane", title: "Coltrane",  line: "A living clock that plays itself",        art: "art-coltrane", dark: false, href: "https://nessim-higson.github.io/coltrane/" }
  ],

  /* writing = tall cover cards on the sheet (Marvin-style); art = CSS class */
  writing: [
    { title: "Weather as interface",   tag: "Essay",  art: "wa-weather", href: "#" },
    { title: "Sites that answer back", tag: "Thesis", art: "wa-answer",  href: "#" },
    { title: "Breeding letterforms",   tag: "Notes",  art: "wa-letters", href: "#" },
    { title: "The reframe lathe",      tag: "Essay",  art: "wa-lathe",   href: "#" },
    { title: "Grids that breathe",     tag: "Notes",  art: "wa-grids",   href: "#" }
  ],

  /* experiments = dim masonry tiles in the dark under-world revealed by the sheet lift.
     size: s | m | l controls tile height */
  experiments: [
    { title: "Orb Studies",       meta: "Nav R&D · 2026",        art: "la-orbs",     size: "m", href: "https://nessim-higson.github.io" },
    { title: "TYPEFORGE",         meta: "Type invention · 2026", art: "la-forge",    size: "l", href: "https://nessim-higson.github.io" },
    { title: "UNIQLOCK v2",       meta: "Living clock · 2025",   art: "la-clock",    size: "s", href: "https://nessim-higson.github.io" },
    { title: "Coltrane",          meta: "Grid orchestra · 2026", art: "la-coltrane", size: "m", href: "https://nessim-higson.github.io/coltrane/" },
    { title: "Kunumi Nav",        meta: "Physics tree · 2025",   art: "la-kunumi",   size: "l", href: "https://nessim-higson.github.io" },
    { title: "Vincent Lowe lens", meta: "GLSL teardown · 2025",  art: "la-lens",     size: "m", href: "https://nessim-higson.github.io" },
    { title: "Ideation Engine",   meta: "Idea tooling · 2026",   art: "la-ideation", size: "s", href: "https://nessim-higson.github.io" },
    { title: "Spectra",           meta: "Light leaks · 2026",    art: "la-spectra",  size: "m", href: "https://nessim-higson.github.io/fields/" }
  ],

  footer: {
    big: ["Always", "hungry."],
    email: "ness@iamalwayshungry.com",
    tag: "Minimal · build 005"
  },

  /* ---- ask the site ----
     v1 = keyword routing. actions: level3 | card:<k> | tab:<name> | footer | none */
  suggestions: [
    "Ask this site anything ⌘K",
    "Try “what do you do?”",
    "Try “show me WKNDR”",
    "Try “how do I reach you?”"
  ],
  kb: [
    { k: ["who","about","background","story","bio","yourself","do you do","what do you"],
      a: "The long version — expanded above.", action: "level3" },
    { k: ["wkndr","weather","city app","weekend"],
      a: "WKNDR — a weather-native way to plan your city. Shown below.", action: "card:wkndr" },
    { k: ["fields","generative","spectra","light"],
      a: "FIELDS — generative light-leak engines. Take a look.", action: "card:fields" },
    { k: ["arena"],
      a: "The Arena — living brand systems for an IP studio.", action: "card:arena" },
    { k: ["fovea","portfolio engine","lens"],
      a: "FOVEA — a lens-tunnel engine for showing work.", action: "card:fovea" },
    { k: ["coltrane","clock","music"],
      a: "Coltrane — a clock that plays itself.", action: "card:coltrane" },
    { k: ["contact","email","reach","hire","available","work together","collab"],
      a: "ness@iamalwayshungry.com — the footer has the rest.", action: "footer" },
    { k: ["write","writing","essay","read"],
      a: "Recent writing, below.", action: "tab:writing" },
    { k: ["experiment","lab","play","prototype","toys"],
      a: "The lab — everything half-finished on purpose.", action: "tab:experiments" },
    { k: ["site","built","how does this","stack","made"],
      a: "Vanilla HTML/CSS/JS. The dial borrows from nternet.company; the quiet from marvinschwaibold.com.", action: "none" }
  ],
  fallback: "Not sure yet — try “what do you do”, “show me WKNDR”, or “how do I reach you”."
};
