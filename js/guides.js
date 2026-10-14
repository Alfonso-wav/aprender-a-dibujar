// Guías de ejercicio dibujadas bajo los trazos del usuario.
// Todas reciben (ctx, rect, rng) en coordenadas de "mundo" del lienzo.

const BLUE = "rgba(70,130,200,.55)";
const BLUE_SOFT = "rgba(70,130,200,.28)";
const RED = "#c8553d";
const LABEL = "rgba(60,90,130,.8)";

export function rngFrom(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = (r, a, b) => a + r() * (b - a);

function cells(rect, target, pad = 24) {
  const w = Math.max(40, rect.w - pad * 2), h = Math.max(40, rect.h - pad * 2);
  const cols = Math.max(1, Math.round(w / target));
  const rows = Math.max(1, Math.round(h / target));
  const cw = w / cols, ch = h / rows;
  const out = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) out.push({ x: rect.x + pad + i * cw, y: rect.y + pad + j * ch, w: cw, h: ch });
  return out;
}
function line(ctx, a, b, color = BLUE, w = 2, dash = []) {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash); ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  ctx.restore();
}
function dot(ctx, p, r = 6, filled = false, color = RED) {
  ctx.save();
  ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2);
  ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.fillStyle = color;
  filled ? ctx.fill() : ctx.stroke();
  ctx.restore();
}
function label(ctx, text, x, y, size = 14, align = "left", color = LABEL) {
  ctx.save();
  ctx.font = `600 ${size}px "Nunito Sans", system-ui, sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
  ctx.restore();
}
function segmentInCell(c, r, minF = 0.5, maxF = 0.85) {
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const ang = rand(r, 0, Math.PI);
  const reach = Math.min(c.w, c.h) * rand(r, minF, maxF) * 0.5;
  // longitud limitada a lo que cabe en la celda en esa dirección
  const lx = Math.abs(Math.cos(ang)) > 0.01 ? (c.w * 0.36) / Math.abs(Math.cos(ang)) : 1e9;
  const ly = Math.abs(Math.sin(ang)) > 0.01 ? (c.h * 0.36) / Math.abs(Math.sin(ang)) : 1e9;
  const len = Math.min(reach * 1.6, lx, ly);
  const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
  return [[cx - dx, cy - dy], [cx + dx, cy + dy]];
}

export const GUIDES = {
  none() {},

  grid(ctx, rect) {
    ctx.save();
    ctx.fillStyle = "rgba(70,130,200,.3)";
    for (let x = rect.x + 20; x < rect.x + rect.w; x += 32)
      for (let y = rect.y + 20; y < rect.y + rect.h; y += 32) ctx.fillRect(x - 1, y - 1, 2, 2);
    ctx.restore();
  },

  dots(ctx, rect, r) {
    const colors = [RED, "#3d7ab8", "#5b8a5a", "#b8860b"];
    cells(rect, 230).forEach((c, i) => {
      const [a, b] = segmentInCell(c, r, 0.7, 1);
      const col = colors[(i + Math.floor(i / 7)) % colors.length];
      dot(ctx, a, 6, true, col); dot(ctx, b, 6, false, col);
    });
  },

  traceLines(ctx, rect, r) {
    for (const c of cells(rect, 220)) {
      const [a, b] = segmentInCell(c, r, 0.6, 1);
      line(ctx, a, b, BLUE, 2.5);
    }
  },

  arcs(ctx, rect, r) {
    const cs = cells(rect, 230);
    cs.forEach((c, i) => {
      const [a, b] = segmentInCell(c, r, 0.6, 0.95);
      if (i % 2 === 1) {
        // casilla de copia libre: solo dos puntos tenues de referencia
        dot(ctx, a, 3, true, BLUE_SOFT); dot(ctx, b, 3, true, BLUE_SOFT);
        return;
      }
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dx, dy);
      const k = rand(r, 0.25, 0.5) * (r() < 0.5 ? -1 : 1);
      const cxp = mx + (-dy / len) * len * k, cyp = my + (dx / len) * len * k;
      ctx.save();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(cxp, cyp, b[0], b[1]); ctx.stroke();
      ctx.restore();
    });
  },

  ellipses(ctx, rect, r) {
    const cs = cells(rect, 210);
    cs.forEach((c, i) => {
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      const rx = Math.min(c.w, c.h) * rand(r, 0.3, 0.4);
      const ry = rx * rand(r, 0.25, 1);
      const rot = rand(r, 0, Math.PI);
      ctx.save();
      ctx.strokeStyle = i % 3 === 2 ? BLUE_SOFT : BLUE;
      ctx.lineWidth = 2.5;
      if (i % 3 === 2) ctx.setLineDash([3, 9]);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    });
  },

  pressure(ctx, rect) {
    const labels = ["fino → grueso", "grueso → fino", "fino · grueso · fino"];
    const pad = 30, rowH = 120;
    const rows = Math.max(3, Math.floor((rect.h - pad * 2) / rowH));
    const rh = (rect.h - pad * 2) / rows;
    for (let i = 0; i < rows; i++) {
      const y = rect.y + pad + i * rh;
      label(ctx, labels[i % 3], rect.x + pad, y + 6);
      line(ctx, [rect.x + pad, y + rh - 14], [rect.x + rect.w - pad, y + rh - 14], BLUE_SOFT, 1.5);
    }
  },

  shapes2d(ctx, rect) {
    const cs = cells(rect, 190);
    cs.forEach((c, i) => {
      ctx.save();
      ctx.strokeStyle = BLUE_SOFT; ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]);
      ctx.strokeRect(c.x + 8, c.y + 8, c.w - 16, c.h - 16);
      ctx.restore();
      const ix = c.x + 18, iy = c.y + 18, s = 18;
      ctx.save();
      ctx.strokeStyle = RED; ctx.lineWidth = 2;
      ctx.beginPath();
      const kind = i % 3;
      if (kind === 0) ctx.arc(ix + s / 2, iy + s / 2, s / 2, 0, Math.PI * 2);
      else if (kind === 1) ctx.rect(ix, iy, s, s);
      else { ctx.moveTo(ix + s / 2, iy); ctx.lineTo(ix + s, iy + s); ctx.lineTo(ix, iy + s); ctx.closePath(); }
      ctx.stroke();
      ctx.restore();
    });
  },

  valueScale(ctx, rect) {
    const pad = 30;
    const size = Math.min((rect.w - pad * 2) / 5.6, (rect.h - pad * 2 - 120) / 2.6, 170);
    const gap = size * 0.15;
    const total = size * 5 + gap * 4;
    const x0 = rect.x + (rect.w - total) / 2;
    const names = ["Trama paralela", "Trama cruzada"];
    for (let row = 0; row < 2; row++) {
      const y = rect.y + pad + 30 + row * (size + 80);
      label(ctx, names[row], x0, y - 26, 15);
      for (let i = 0; i < 5; i++) {
        const x = x0 + i * (size + gap);
        ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2; ctx.strokeRect(x, y, size, size); ctx.restore();
        label(ctx, String(i + 1), x + size / 2, y + size + 8, 14, "center");
      }
    }
  },

  persp1(ctx, rect, r) {
    const hy = rect.y + rect.h * 0.42;
    const vp = [rect.x + rect.w / 2, hy];
    line(ctx, [rect.x + 10, hy], [rect.x + rect.w - 10, hy], BLUE, 1.5);
    label(ctx, "horizonte", rect.x + 16, hy - 22, 13);
    dot(ctx, vp, 6, true);
    label(ctx, "PF", vp[0] + 10, vp[1] - 24, 14, "left", RED);
    const spots = [
      [0.15, 0.12], [0.72, 0.1], [0.12, 0.62], [0.55, 0.72], [0.82, 0.58], [0.35, 0.86],
    ];
    for (const [fx, fy] of spots) {
      const w = rand(r, 70, 120), h = rand(r, 55, 100);
      const x = rect.x + fx * rect.w - w / 2 + rand(r, -20, 20);
      const y = rect.y + fy * rect.h - h / 2 + rand(r, -10, 10);
      if (y < hy && y + h > hy - 10) continue;
      ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h); ctx.restore();
    }
  },

  persp2(ctx, rect, r) {
    const hy = rect.y + rect.h * 0.4;
    const vl = [rect.x + 24, hy], vr = [rect.x + rect.w - 24, hy];
    line(ctx, [rect.x + 10, hy], [rect.x + rect.w - 10, hy], BLUE, 1.5);
    dot(ctx, vl, 6, true); dot(ctx, vr, 6, true);
    label(ctx, "PF 1", vl[0] + 4, hy + 10, 13, "left", RED);
    label(ctx, "PF 2", vr[0] - 4, hy + 10, 13, "right", RED);
    const n = 4;
    for (let i = 0; i < n; i++) {
      const x = rect.x + rect.w * (0.22 + (0.56 * i) / (n - 1)) + rand(r, -20, 20);
      const len = rand(r, 70, 130);
      const below = i % 2 === 0;
      const y0 = below ? hy + rand(r, 50, 110) : hy - rand(r, 70, 120) - len;
      line(ctx, [x, y0], [x, y0 + len], BLUE, 3);
    }
  },

  boxes(ctx, rect, r) {
    const hy = rect.y + rect.h * rand(r, 0.3, 0.5);
    line(ctx, [rect.x + 10, hy], [rect.x + rect.w - 10, hy], BLUE, 1.5);
    label(ctx, "horizonte", rect.x + 16, hy - 22, 13);
    for (const c of cells(rect, 260, 60)) {
      const p = [c.x + c.w / 2 + rand(r, -30, 30), c.y + c.h / 2 + rand(r, -30, 30)];
      if (Math.abs(p[1] - hy) < 40) p[1] += 70;
      line(ctx, [p[0] - 7, p[1] - 7], [p[0] + 7, p[1] + 7], RED, 2);
      line(ctx, [p[0] - 7, p[1] + 7], [p[0] + 7, p[1] - 7], RED, 2);
    }
  },

  figureRuler(ctx, rect) {
    const pad = 28;
    const top = rect.y + pad + 6, bottom = rect.y + rect.h - pad;
    const u = (bottom - top) / 8;
    const names = ["cabeza", "barbilla", "pecho", "ombligo", "entrepierna", "mitad muslo", "rodillas", "mitad pierna", "pies"];
    for (let k = 0; k <= 8; k++) {
      const y = top + k * u;
      line(ctx, [rect.x + pad, y], [rect.x + rect.w - pad, y], k === 4 ? BLUE : BLUE_SOFT, k === 4 ? 2 : 1.5, k === 4 ? [] : [6, 6]);
      label(ctx, `${k}`, rect.x + pad, y + 3, 12);
      label(ctx, names[k], rect.x + rect.w - pad, y + 3, 12, "right");
    }
  },

  actionLines(ctx, rect, r) {
    const cs = cells(rect, 250, 30);
    cs.forEach((c) => {
      const top = [c.x + c.w / 2 + rand(r, -c.w * 0.15, c.w * 0.15), c.y + c.h * 0.18];
      const bot = [c.x + c.w / 2 + rand(r, -c.w * 0.25, c.w * 0.25), c.y + c.h * 0.92];
      const head = Math.min(c.w, c.h) * 0.07;
      ctx.save();
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(top[0], top[1] - head, head, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(top[0], top[1]);
      const kind = r();
      const bend = c.w * rand(r, 0.2, 0.38) * (r() < 0.5 ? -1 : 1);
      const mx = (top[0] + bot[0]) / 2, my = (top[1] + bot[1]) / 2;
      if (kind < 0.45) ctx.quadraticCurveTo(mx + bend, my, bot[0], bot[1]);
      else if (kind < 0.85) ctx.bezierCurveTo(mx + bend, top[1] + (bot[1] - top[1]) * 0.3, mx - bend, top[1] + (bot[1] - top[1]) * 0.7, bot[0], bot[1]);
      else ctx.quadraticCurveTo(mx + bend * 0.25, my, bot[0], bot[1]);
      ctx.stroke();
      ctx.restore();
    });
  },

  headCircles(ctx, rect, r) {
    const dirs = ["de frente", "3/4 → derecha", "3/4 ← izquierda", "perfil →", "← perfil", "mirando arriba", "mirando abajo"];
    const cs = cells(rect, 220, 24);
    let off = Math.floor(r() * dirs.length);
    cs.forEach((c, i) => {
      const rad = Math.min(c.w, c.h) * 0.27;
      const cx = c.x + c.w / 2, cy = c.y + c.h * 0.44;
      ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      label(ctx, dirs[(i + off) % dirs.length], cx, c.y + c.h - 26, 13, "center");
    });
  },
};

export const GUIDE_NAMES = {
  dots: "Puntos a unir", traceLines: "Líneas para repasar", arcs: "Curvas", ellipses: "Elipses",
  pressure: "Presión", shapes2d: "Formas", valueScale: "Escala de valor", persp1: "Perspectiva 1 punto",
  persp2: "Perspectiva 2 puntos", boxes: "Cajas", figureRuler: "Regla de figura", actionLines: "Líneas de acción",
  headCircles: "Cabezas", grid: "Cuadrícula de puntos", none: "Hoja en blanco",
};
