// Generative glyph fields for PCD Amsterdam 2026.
//
// The flyer graphic is a cluster of grid cells, each holding a colored square
// or a small glyph (○ ● + × − | *). Here the same vocabulary is driven by a
// handful of noise fields, so the cluster slowly breathes and shifts.
// Move your pointer (or drag a finger) over the cluster to paint with it.

const FPS = 12;
const FRAME_TIME = 1000 / FPS;
const TAU = Math.PI * 2;

const COLORS = {
  purple: "#9f6ee0",
  orange: "#f28a26",
  blue: "#2649d4",
  green: "#b6dcaa",
  red: "#e8473d",
  cyan: "#3fc4dc",
};

const FIELD_COLORS = [
  COLORS.purple,
  COLORS.orange,
  COLORS.blue,
  COLORS.green,
  COLORS.red,
];

const ALL_COLORS = [...FIELD_COLORS, COLORS.cyan];

const RUN_GLYPHS = ["ring", "dot", "plus", "cross", "hline"];
const STRAY_GLYPHS = ["hline", "ring", "plus", "dot", "vline", "cross", "star"];

// Open call closes at the end of Saturday 10 October (Amsterdam time)
const OPEN_CALL_CLOSES = new Date("2026-10-11T00:00:00+02:00");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// ---------------------------------------------------------------------------
// Noise

function hash(x, y, z) {
  let h =
    Math.imul(x | 0, 374761393) ^
    Math.imul(y | 0, 668265263) ^
    Math.imul(z | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// 3D value noise in [0, 1]
function noise(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);

  const front = lerp(
    lerp(hash(xi, yi, zi), hash(xi + 1, yi, zi), u),
    lerp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u),
    v,
  );
  const back = lerp(
    lerp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u),
    lerp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u),
    v,
  );
  return lerp(front, back, w);
}

function fbm(x, y, z) {
  return (
    noise(x, y, z) * 0.55 +
    noise(x * 2.1 + 17, y * 2.1 + 31, z * 1.6) * 0.3 +
    noise(x * 4.3 + 71, y * 4.3 + 11, z * 2.2) * 0.15
  );
}

// Value noise piles up around 0.5, so picking from a list by angle around
// that center gives a much more even spread than slicing a single value.
function pickByAngle(list, a, b) {
  const angle = Math.atan2(a - 0.5, b - 0.5) / TAU + 0.5;
  return list[Math.min(list.length - 1, Math.floor(angle * list.length))];
}

function pickByValue(list, n) {
  const stretched = clamp((n - 0.5) * 2.4 + 0.5, 0, 0.9999);
  return list[Math.floor(stretched * list.length)];
}

// Small seeded PRNG for avatars
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

// ---------------------------------------------------------------------------
// Drawing

function line(ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

function drawGlyph(ctx, type, x, y, s, color, alpha = 1) {
  const cx = x + s / 2;
  const cy = y + s / 2;
  const r = s * 0.29;

  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, s * 0.12);

  if (type === "square") {
    const gap = Math.max(1, Math.round(s * 0.07));
    ctx.fillRect(x + gap, y + gap, s - gap * 2, s - gap * 2);
    return;
  }

  ctx.beginPath();
  switch (type) {
    case "ring":
      ctx.arc(cx, cy, s * 0.27, 0, TAU);
      ctx.stroke();
      return;
    case "dot":
      ctx.arc(cx, cy, s * 0.19, 0, TAU);
      ctx.fill();
      return;
    case "plus":
      line(ctx, cx - r, cy, cx + r, cy);
      line(ctx, cx, cy - r, cx, cy + r);
      break;
    case "cross":
      line(ctx, cx - r * 0.8, cy - r * 0.8, cx + r * 0.8, cy + r * 0.8);
      line(ctx, cx - r * 0.8, cy + r * 0.8, cx + r * 0.8, cy - r * 0.8);
      break;
    case "hline":
      line(ctx, cx - r, cy, cx + r, cy);
      break;
    case "vline":
      line(ctx, cx, cy - r, cx, cy + r);
      break;
    case "star":
      for (let i = 0; i < 3; i++) {
        const a = Math.PI / 2 + (i * Math.PI) / 3;
        const dx = Math.cos(a) * r;
        const dy = Math.sin(a) * r;
        line(ctx, cx - dx, cy - dy, cx + dx, cy + dy);
      }
      break;
  }
  ctx.stroke();
}

// Sizes a canvas to its CSS box at device resolution.
// Returns true when the backing store changed.
function fitCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));

  if (canvas.width === width && canvas.height === height) return false;

  canvas.width = width;
  canvas.height = height;
  return true;
}

// ---------------------------------------------------------------------------
// Glyph fields (hero cluster and the strips between sections)

class GlyphField {
  constructor(canvas, { cellSize, cell, intro = 0, layout }) {
    this.canvas = canvas;
    this.layout = layout;
    this.ctx = canvas.getContext("2d");
    this.cellSize = cellSize;
    this.cellFn = cell;
    this.introMs = intro;
    this.out = { type: "", color: "", alpha: 1 };
    this.cols = 0;
    this.rows = 0;
    this.heat = new Float32Array(0);
    this.seed = Math.random() * 100;
    this.startTime = performance.now();
    this.lastFrame = 0;

    this.resize();
  }

  resize() {
    if (!fitCanvas(this.canvas) && this.cols) return;

    const { width, height } = this.canvas;
    const dpr = width / Math.max(1, this.canvas.clientWidth);
    const cssCell = this.cellSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.cell = Math.max(4, Math.round(cssCell * dpr));
    this.cols = Math.ceil(width / this.cell);
    this.rows = Math.ceil(height / this.cell);
    this.offsetX = Math.floor((width - this.cols * this.cell) / 2);
    this.offsetY = Math.floor((height - this.rows * this.cell) / 2);
    this.heat = new Float32Array(this.cols * this.rows);
    this.layout?.(this);
  }

  // Adds "heat" around a point given in client coordinates. Heat pushes
  // cells towards denser glyphs and fades out over a second or two.
  touch(clientX, clientY, radius, amount) {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const scale = this.canvas.width / rect.width;
    const px = ((clientX - rect.left) * scale - this.offsetX) / this.cell;
    const py = ((clientY - rect.top) * scale - this.offsetY) / this.cell;

    const minX = Math.max(0, Math.floor(px - radius));
    const maxX = Math.min(this.cols - 1, Math.ceil(px + radius));
    const minY = Math.max(0, Math.floor(py - radius));
    const maxY = Math.min(this.rows - 1, Math.ceil(py + radius));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const d = Math.hypot(x + 0.5 - px, y + 0.5 - py);
        if (d > radius) continue;
        const i = y * this.cols + x;
        this.heat[i] = Math.min(1.4, this.heat[i] + amount * (1 - d / radius));
      }
    }
  }

  render(now) {
    const { ctx, canvas, cols, rows, cell, out } = this;
    const elapsed = now - this.startTime;

    this.time = this.seed + elapsed / 1000;
    this.grow = this.introMs
      ? 1 - Math.pow(1 - clamp(elapsed / this.introMs, 0, 1), 3)
      : 1;

    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!this.cellFn(this, x, y, out)) continue;
        drawGlyph(
          ctx,
          out.type,
          this.offsetX + x * cell,
          this.offsetY + y * cell,
          cell,
          out.color,
          out.alpha,
        );
      }
    }

    for (let i = 0; i < this.heat.length; i++) {
      this.heat[i] *= 0.9;
    }
  }
}

function fieldColor(x, y, t, scale) {
  return pickByAngle(
    FIELD_COLORS,
    fbm(x * scale, y * scale, t * 0.08 + 3),
    fbm(x * scale + 40, y * scale + 40, t * 0.08 + 9),
  );
}

// Same color field and glyph runs as the flyer: glyph types change slowly
// along x and quickly along y, so they line up in short horizontal runs.
function runGlyph(x, y, t) {
  return pickByValue(RUN_GLYPHS, noise(x * 0.32 + 90, y * 1.1, t * 0.12));
}

function heroCell(field, x, y, out) {
  const { cols, rows, time: t } = field;
  const radius = Math.min(cols, rows) * 0.47 * field.grow;
  const breathe = 1 + Math.sin(t * 0.4) * 0.04;

  const dx = x + 0.5 - cols * field.centerX;
  const dy = y + 0.5 - rows / 2;
  const angle = Math.atan2(dy, dx);

  // Tendrils: the reach of the cluster varies with direction
  const tendril = noise(Math.cos(angle) * 1.7 + 5, Math.sin(angle) * 1.7 + 5, t * 0.06);
  const reach = Math.max(0.001, radius * breathe * (0.5 + tendril));
  const dist = Math.hypot(dx * 0.92, dy * 1.08) / reach;

  const detail = fbm(x * 0.11, y * 0.11, t * 0.14) - 0.5;
  // Keep the left edge quiet where the field sits behind the title
  const fade = field.fadeLeft ? Math.max(0, 0.3 - x / cols) * 4 : 0;
  const v = (1 - dist) * 1.25 + detail * 0.95 - fade + field.heat[y * cols + x];
  const r = hash(x, y, 7);

  out.alpha = 1;

  if (v > 0.62) {
    // Dense core: mostly squares, with the odd run of glyphs carved out
    if (noise(x * 0.4 + 300, y * 0.9, t * 0.1) > 0.69) {
      out.type = runGlyph(x, y, t);
    } else {
      out.type = "square";
      if (v > 0.9 && noise(x * 0.2 + 200, y * 0.2, t * 0.1) > 0.76) {
        out.color = COLORS.cyan;
        return true;
      }
    }
  } else if (v > 0.12) {
    // Fringe: glyphs thinning out towards the edge
    if (r > ((v - 0.12) / 0.5) * 0.95) return false;
    out.type = runGlyph(x, y, t);
  } else if (v > -0.5) {
    // Strays: rare loose marks scattered around the cluster
    const p = (v + 0.5) / 0.62;
    if (r > p * 0.05) return false;
    out.type = STRAY_GLYPHS[Math.floor(hash(x, y, 11) * STRAY_GLYPHS.length)];
    out.alpha = 0.4 + 0.6 * p;
  } else {
    return false;
  }

  out.color = fieldColor(x, y, t, 0.085);
  return true;
}

function stripCell(field, x, y, out) {
  const { time: t } = field;
  const v = fbm(x * 0.07, y * 0.5 + 9, t * 0.12) * 1.7 - 0.82 + field.heat[y * field.cols + x];

  if (v > 0.32) {
    out.type = "square";
    out.alpha = 1;
  } else if (hash(x, y, 3) < clamp(v + 0.3, 0, 1) * 0.55) {
    out.type = runGlyph(x, y, t);
    out.alpha = clamp(0.5 + v * 2, 0.4, 1);
  } else {
    return false;
  }

  out.color = fieldColor(x, y, t, 0.05);
  return true;
}

// ---------------------------------------------------------------------------
// Program icons: a tiny grid whose density grows with every act

class IconGrid {
  constructor(canvas, density, fast) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.size = 8;
    this.density = density;
    this.glyphs = 0.12;
    this.baseInterval = fast ? 140 : 650;
    this.boost = 1;
    this.cells = Array.from({ length: this.size * this.size }, () => this.roll());
    this.lastFrame = 0;

    const card = canvas.closest(".act");
    if (card) {
      card.addEventListener("pointerenter", () => (this.boost = 3));
      card.addEventListener("pointerleave", () => (this.boost = 1));
    }
  }

  roll() {
    const r = Math.random();
    if (r < this.density) {
      return { type: "square", color: pickColor() };
    }
    if (r < this.density + this.glyphs) {
      return { type: pickGlyph(), color: pickColor() };
    }
    return null;
  }

  resize() {
    fitCanvas(this.canvas);
  }

  get interval() {
    return this.baseInterval / this.boost;
  }

  step() {
    const changes = Math.max(1, Math.round(this.cells.length * 0.05));
    for (let i = 0; i < changes; i++) {
      this.cells[Math.floor(Math.random() * this.cells.length)] = this.roll();
    }
  }

  render(now) {
    if (now - this.lastFrame >= this.interval) {
      if (this.lastFrame) this.step();
      this.lastFrame = now;
    }
    drawGrid(this.ctx, this.canvas, this.cells, this.size);
  }
}

function pickColor(random = Math.random) {
  return random() < 0.08
    ? COLORS.cyan
    : FIELD_COLORS[Math.floor(random() * FIELD_COLORS.length)];
}

function pickGlyph(random = Math.random) {
  return STRAY_GLYPHS[Math.floor(random() * STRAY_GLYPHS.length)];
}

function drawGrid(ctx, canvas, cells, size) {
  const cell = Math.floor(Math.min(canvas.width, canvas.height) / size);
  const offsetX = Math.floor((canvas.width - cell * size) / 2);
  const offsetY = Math.floor((canvas.height - cell * size) / 2);

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  cells.forEach((c, i) => {
    if (!c) return;
    const x = offsetX + (i % size) * cell;
    const y = offsetY + Math.floor(i / size) * cell;
    drawGlyph(ctx, c.type, x, y, cell, c.color);
  });
}

// ---------------------------------------------------------------------------
// Organizer avatars: a mirrored glyph pattern seeded by name.
// Hovering shuffles through variations, leaving restores the original.

class Avatar {
  constructor(canvas, name) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.size = 5;
    this.baseSeed = hashString(name);
    this.variation = 0;
    this.hovering = false;
    this.lastFrame = 0;
    this.cells = this.generate();

    const person = canvas.closest(".person");
    if (person) {
      person.addEventListener("pointerenter", () => (this.hovering = true));
      person.addEventListener("pointerleave", () => {
        this.hovering = false;
        this.variation = 0;
        this.cells = this.generate();
        this.render(performance.now(), true);
      });
    }
  }

  get animating() {
    return this.hovering;
  }

  generate() {
    const random = mulberry32(this.baseSeed + this.variation * 7919);
    const size = this.size;
    const primary = ALL_COLORS[Math.floor(random() * ALL_COLORS.length)];
    const cells = new Array(size * size).fill(null);
    const half = Math.ceil(size / 2);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < half; x++) {
        const r = random();
        let c = null;
        if (r < 0.5) {
          c = { type: "square", color: random() < 0.7 ? primary : pickColor(random) };
        } else if (r < 0.72) {
          c = { type: pickGlyph(random), color: random() < 0.7 ? primary : pickColor(random) };
        }
        cells[y * size + x] = c;
        cells[y * size + (size - 1 - x)] = c;
      }
    }
    return cells;
  }

  resize() {
    fitCanvas(this.canvas);
  }

  render(now, force = false) {
    if (this.hovering && now - this.lastFrame > 160) {
      this.lastFrame = now;
      this.variation++;
      this.cells = this.generate();
    } else if (!force && this.lastFrame && !this.hovering) {
      return;
    }
    drawGrid(this.ctx, this.canvas, this.cells, this.size);
  }
}

// ---------------------------------------------------------------------------
// Setup

const fields = [];
const icons = [];
const avatars = [];
const visible = new WeakMap();

const visibility = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    visible.set(entry.target, entry.isIntersecting);
  }
});

for (const canvas of document.querySelectorAll("[data-field]")) {
  const kind = canvas.dataset.field;
  const field =
    kind === "hero"
      ? new GlyphField(canvas, {
          cellSize: (w) => clamp(w / 58, 9, 15),
          cell: heroCell,
          intro: 1800,
          layout: (f) => {
            // Beside the title on wide screens, centered above it otherwise
            const wide = window.matchMedia("(min-width: 961px)").matches;
            f.centerX = wide ? 0.56 : 0.5;
            f.fadeLeft = wide;
          },
        })
      : new GlyphField(canvas, {
          cellSize: (w, h) => h / 2,
          cell: stripCell,
        });
  fields.push(field);
  visibility.observe(canvas);
}

for (const canvas of document.querySelectorAll("[data-icon]")) {
  fitCanvas(canvas);
  icons.push(
    new IconGrid(canvas, Number(canvas.dataset.icon), canvas.dataset.iconSpeed === "fast"),
  );
  visibility.observe(canvas);
}

for (const canvas of document.querySelectorAll("[data-avatar]")) {
  fitCanvas(canvas);
  avatars.push(new Avatar(canvas, canvas.dataset.avatar));
}

function renderAll(now) {
  for (const field of fields) field.render(now);
  for (const icon of icons) icon.render(now);
  for (const avatar of avatars) avatar.render(now, true);
}

let lastFrame = 0;
let running = false;

function tick(now) {
  if (!running) return;
  requestAnimationFrame(tick);

  if (now - lastFrame < FRAME_TIME) return;
  lastFrame = now;

  for (const field of fields) {
    if (visible.get(field.canvas) !== false) field.render(now);
  }
  for (const icon of icons) {
    if (visible.get(icon.canvas) !== false) icon.render(now);
  }
  for (const avatar of avatars) {
    if (avatar.animating) avatar.render(now);
  }
}

function start() {
  if (running) return;
  running = true;
  requestAnimationFrame(tick);
}

function stop() {
  running = false;
  // Draw a settled frame: the intro finished and the cluster at rest
  const settled = performance.now() + 10000;
  for (const field of fields) field.render(settled);
  for (const icon of icons) drawGrid(icon.ctx, icon.canvas, icon.cells, icon.size);
  for (const avatar of avatars) avatar.render(settled, true);
}

function applyMotionPreference() {
  if (reducedMotion.matches) {
    stop();
  } else {
    start();
  }
}

reducedMotion.addEventListener("change", applyMotionPreference);

const resizeObserver = new ResizeObserver(() => {
  for (const item of [...fields, ...icons, ...avatars]) item.resize();
  if (reducedMotion.matches) {
    stop();
  } else {
    renderAll(performance.now());
  }
});

for (const item of [...fields, ...icons, ...avatars]) {
  resizeObserver.observe(item.canvas);
}

// Pointer painting on the hero cluster and the strips
function paint(event, radius, amount) {
  if (reducedMotion.matches) return;
  for (const field of fields) {
    const rect = field.canvas.getBoundingClientRect();
    const margin = radius * 16;
    if (
      event.clientX < rect.left - margin ||
      event.clientX > rect.right + margin ||
      event.clientY < rect.top - margin ||
      event.clientY > rect.bottom + margin
    ) {
      continue;
    }
    field.touch(event.clientX, event.clientY, radius, amount);
  }
}

window.addEventListener("pointermove", (event) => paint(event, 3.2, 0.35), {
  passive: true,
});
window.addEventListener("pointerdown", (event) => paint(event, 7, 1.1), {
  passive: true,
});

renderAll(performance.now());
applyMotionPreference();

// ---------------------------------------------------------------------------
// Open call: hide the apply links once the deadline has passed

if (Date.now() >= OPEN_CALL_CLOSES.getTime()) {
  document.querySelector("[data-open-call]")?.classList.add("is-closed");
  for (const el of document.querySelectorAll("[data-open-call-only]")) {
    el.hidden = true;
  }
  const status = document.querySelector("[data-open-call-status]");
  if (status) status.textContent = "The open call has closed";
}
