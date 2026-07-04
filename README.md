# Minimal

A quiet personal site that can say more.

**The premise:** [marvinschwaibold.com](https://www.marvinschwaibold.com)'s restraint — one small centered column, work as oversized cards, a sheet that lifts to reveal the footer — crossed with [nternet.company](https://nternet.company)'s **less/more dial**, where the intro is one sentence that grows in place. Plus a third layer neither has: **ask the site**, and the page answers with itself (no chatbot — it scrolls, expands, and highlights).

## Structure

| File | What |
|---|---|
| `index.html` | markup only |
| `styles.css` | design system + motion |
| `app.js` | dial · carousel · ask · reveals (no dependencies) |
| `content.js` | **all copy and data — edit this one** |
| `sketch-001/` | the original prototype + annotated comps board |

## Interactions

- `−` / `+` (keys or dock) — dial the bio between 4 levels of detail
- `⌘K` — ask the site; try *"what do you do"*, *"show me WKNDR"*, *"how do I reach you"*
- Drag the work cards; scroll to the very bottom for the footer reveal

Vanilla HTML/CSS/JS. v1 answers are keyword-routed; v2 swaps in a real model over the same actions.
