// Lienzo de dibujo para lápiz de tablet:
// presión, rechazo de palma, goma, deshacer con dos dedos y guías en capa aparte.

const INK = "#2a2926";
const PAPER = "#fffdf8";
const OUTSIDE = "#e6e0d4";
export const SIZES = [1.6, 3, 6];

export class DrawingPad {
  constructor(el) {
    this.el = el;
    this.guideCv = document.createElement("canvas");
    this.inkCv = document.createElement("canvas");
    this.guideCv.className = "cv-guide";
    this.inkCv.className = "cv-ink";
    el.append(this.guideCv, this.inkCv);
    this.gctx = this.guideCv.getContext("2d");
    this.ictx = this.inkCv.getContext("2d");

    this.strokes = [];
    this.undone = [];
    this.cleared = null;
    this.cur = null;
    this.tool = "pen";
    this.sizeIdx = 1;
    this.penOnly = "auto"; // auto | on | off
    this.sawPen = false;
    this.guideVisible = true;
    this.renderGuide = null;
    this.W = 0; this.H = 0; this.s = 1; this.ox = 0; this.oy = 0;
    this.onStroke = () => {};
    this.onChange = () => {};
    this.touches = new Map();
    this.gesture = null;

    const c = this.inkCv;
    c.addEventListener("pointerdown", (e) => this.down(e));
    c.addEventListener("pointermove", (e) => this.move(e));
    c.addEventListener("pointerup", (e) => this.up(e));
    c.addEventListener("pointercancel", (e) => this.up(e, true));
    c.addEventListener("contextmenu", (e) => e.preventDefault());
    el.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
    el.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    this.ro = new ResizeObserver(() => {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => this.layout());
    });
    this.ro.observe(el);
  }

  destroy() {
    this.ro.disconnect();
    this.el.innerHTML = "";
  }

  /** Fija el tamaño del "papel" al tamaño visible actual */
  resetWorld() {
    this.W = Math.max(300, this.el.clientWidth);
    this.H = Math.max(300, this.el.clientHeight);
    this.layout();
  }

  layout() {
    const cw = this.el.clientWidth, ch = this.el.clientHeight;
    if (!cw || !ch) return;
    if (!this.W) { this.W = cw; this.H = ch; }
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    this.dpr = dpr;
    for (const cv of [this.guideCv, this.inkCv]) {
      cv.width = Math.round(cw * dpr);
      cv.height = Math.round(ch * dpr);
      cv.style.width = cw + "px";
      cv.style.height = ch + "px";
    }
    this.s = Math.min(cw / this.W, ch / this.H);
    this.ox = (cw - this.W * this.s) / 2;
    this.oy = (ch - this.H * this.s) / 2;
    this.drawGuide();
    this.redrawInk();
  }

  worldTransform(ctx) {
    const d = this.dpr;
    ctx.setTransform(d * this.s, 0, 0, d * this.s, d * this.ox, d * this.oy);
  }

  drawGuide() {
    if (!this.W || !this.dpr) return;
    const ctx = this.gctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = OUTSIDE;
    ctx.fillRect(0, 0, this.guideCv.width, this.guideCv.height);
    this.worldTransform(ctx);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, this.W, this.H);
    if (this.guideVisible && this.renderGuide) this.renderGuide(ctx, this.W, this.H);
  }

  setGuide(fn) {
    this.renderGuide = fn;
    this.drawGuide();
  }

  toggleGuide(v = !this.guideVisible) {
    this.guideVisible = v;
    this.drawGuide();
    return v;
  }

  // ---------- trazos ----------

  width(st, p) {
    const base = SIZES[st.size] ?? 3;
    if (st.tool === "eraser") return base * 6;
    if (!st.pen) return base;
    return base * (0.3 + 1.4 * Math.min(1, Math.max(0, p)));
  }

  styleFor(ctx, st) {
    ctx.globalCompositeOperation = st.tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = INK;
    ctx.fillStyle = INK;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  /** Dibuja el tramo que termina en el punto i */
  seg(ctx, st, i) {
    const P = st.pts;
    if (i === 0) return;
    const a = i === 1 ? P[0] : mid(P[i - 2], P[i - 1]);
    const b = mid(P[i - 1], P[i]);
    ctx.lineWidth = this.width(st, (P[i - 1][2] + P[i][2]) / 2);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.quadraticCurveTo(P[i - 1][0], P[i - 1][1], b[0], b[1]);
    ctx.stroke();
  }

  tail(ctx, st) {
    const P = st.pts, n = P.length;
    if (n === 1) {
      ctx.beginPath();
      ctx.arc(P[0][0], P[0][1], this.width(st, P[0][2]) / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    const a = n === 2 ? P[0] : mid(P[n - 2], P[n - 1]);
    ctx.lineWidth = this.width(st, P[n - 1][2]);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(P[n - 1][0], P[n - 1][1]);
    ctx.stroke();
  }

  paintStroke(ctx, st) {
    this.styleFor(ctx, st);
    for (let i = 1; i < st.pts.length; i++) this.seg(ctx, st, i);
    this.tail(ctx, st);
  }

  redrawInk() {
    if (!this.dpr) return;
    const ctx = this.ictx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.inkCv.width, this.inkCv.height);
    this.worldTransform(ctx);
    for (const st of this.strokes) this.paintStroke(ctx, st);
    if (this.cur) this.paintStroke(ctx, this.cur);
    ctx.globalCompositeOperation = "source-over";
  }

  toWorld(e) {
    const r = this.inkCv.getBoundingClientRect();
    return [(e.clientX - r.left - this.ox) / this.s, (e.clientY - r.top - this.oy) / this.s];
  }

  rejectTouch() {
    return this.penOnly === "on" || (this.penOnly === "auto" && this.sawPen);
  }

  down(e) {
    if (e.pointerType === "pen") this.sawPen = true;
    if (e.pointerType === "touch" && this.rejectTouch()) return this.touchDown(e);
    if (e.pointerType === "touch") {
      this.touchDown(e, true);
      if (this.touches.size > 1) return;
    }
    if (this.cur) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    try { this.inkCv.setPointerCapture(e.pointerId); } catch {}
    const erase = this.tool === "eraser" || (e.pointerType === "pen" && (e.buttons & 32) === 32);
    this.cur = { id: e.pointerId, tool: erase ? "eraser" : "pen", size: this.sizeIdx, pen: e.pointerType === "pen", pts: [] };
    this.addPoint(e);
  }

  addPoint(e) {
    const [x, y] = this.toWorld(e);
    const p = this.cur.pen ? (e.pressure || 0.5) : 0.5;
    const P = this.cur.pts;
    const last = P[P.length - 1];
    if (last && Math.hypot(x - last[0], y - last[1]) < 0.6 / this.s) return;
    P.push([x, y, p]);
    const ctx = this.ictx;
    this.worldTransform(ctx);
    this.styleFor(ctx, this.cur);
    this.seg(ctx, this.cur, P.length - 1);
    ctx.globalCompositeOperation = "source-over";
  }

  move(e) {
    if (e.pointerType === "touch") this.touchMove(e);
    if (!this.cur || e.pointerId !== this.cur.id) return;
    e.preventDefault();
    const list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    for (const ev of list && list.length ? list : [e]) this.addPoint(ev);
  }

  up(e, cancelled = false) {
    if (e.pointerType === "touch") this.touchUp(e);
    if (!this.cur || e.pointerId !== this.cur.id) return;
    const st = this.cur;
    this.cur = null;
    if (cancelled && st.pts.length < 3) { this.redrawInk(); return; }
    // si este trazo era el primer dedo de un gesto de dos dedos, se descarta
    if (this.discardCurrent) { this.discardCurrent = false; this.redrawInk(); return; }
    const ctx = this.ictx;
    this.worldTransform(ctx);
    this.styleFor(ctx, st);
    this.tail(ctx, st);
    ctx.globalCompositeOperation = "source-over";
    this.strokes.push(st);
    this.undone = [];
    this.cleared = null;
    this.onStroke(st);
    this.onChange();
  }

  // ---------- gesto: tocar con dos dedos = deshacer ----------

  touchDown(e, drawing = false) {
    this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.touches.size === 2) {
      this.gesture = { t: performance.now(), moved: false };
      if (drawing && this.cur && !this.cur.pen) {
        this.cur = null;
        this.discardCurrent = false;
        this.redrawInk();
      }
    } else if (this.touches.size > 2) this.gesture = null;
  }
  touchMove(e) {
    const t = this.touches.get(e.pointerId);
    if (t && this.gesture && Math.hypot(e.clientX - t.x, e.clientY - t.y) > 24) this.gesture.moved = true;
  }
  touchUp(e) {
    if (!this.touches.has(e.pointerId)) return;
    this.touches.delete(e.pointerId);
    if (this.gesture && this.touches.size === 1) {
      const quick = performance.now() - this.gesture.t < 350;
      if (quick && !this.gesture.moved) this.undo();
      this.gesture.done = true;
    }
    if (this.touches.size === 0) this.gesture = null;
  }

  // ---------- acciones ----------

  undo() {
    if (this.strokes.length) this.undone.push(this.strokes.pop());
    else if (this.cleared) { this.strokes = this.cleared; this.cleared = null; }
    else return;
    this.redrawInk();
    this.onChange();
  }
  redo() {
    if (!this.undone.length) return;
    this.strokes.push(this.undone.pop());
    this.redrawInk();
    this.onChange();
  }
  clear() {
    if (!this.strokes.length) return;
    this.cleared = this.strokes;
    this.strokes = [];
    this.undone = [];
    this.redrawInk();
    this.onChange();
  }
  /** Hoja nueva: sin trazos, ajustada al tamaño actual de pantalla */
  newSheet() {
    this.strokes = [];
    this.undone = [];
    this.cleared = null;
    this.resetWorld();
    this.onChange();
  }
  isEmpty() {
    return this.strokes.length === 0;
  }

  /** Exporta el dibujo (con guía si está visible) como PNG */
  async toBlob(includeGuide = this.guideVisible) {
    const k = Math.min(2, 4096 / Math.max(this.W, this.H));
    const w = Math.round(this.W * k), h = Math.round(this.H * k);
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    const o = out.getContext("2d");
    o.fillStyle = PAPER;
    o.fillRect(0, 0, w, h);
    if (includeGuide && this.renderGuide) {
      o.save(); o.scale(k, k); this.renderGuide(o, this.W, this.H); o.restore();
    }
    const ink = document.createElement("canvas");
    ink.width = w; ink.height = h;
    const ic = ink.getContext("2d");
    ic.scale(k, k);
    for (const st of this.strokes) this.paintStroke(ic, st);
    o.drawImage(ink, 0, 0);
    return new Promise((res) => out.toBlob(res, "image/png"));
  }
}

function mid(a, b) {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}
