import { MODULES, LESSONS, lessonById, lessonIndex } from "./lessons.js";
import { MODELS, modelSVG, drawModel } from "./models.js";
import { GUIDES, rngFrom } from "./guides.js";
import { DrawingPad, SIZES } from "./canvas.js";
import { progress, settings, gallery } from "./store.js";

const $ = (sel, root = document) => root.querySelector(sel);
const view = $("#view");

// ---------- iconos ----------
const svg = (d, extra = "") => `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra}><path d="${d}"/></svg>`;
const I = {
  pen: svg("M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3"),
  eraser: svg("M8 20h12M5 15l8-8 6 6-6 6H9l-4-4zM10 10l6 6"),
  undo: svg("M9 7L4 12l5 5M4 12h11a5 5 0 010 10h-3"),
  redo: svg("M15 7l5 5-5 5M20 12H9a5 5 0 000 10h3"),
  eye: svg("M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z"),
  eyeOff: svg("M3 3l18 18M10.6 5.1A10 10 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 4M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 005.4-1.6M9.9 9.9a3 3 0 004.2 4.2"),
  sheet: svg("M6 3h9l4 4v14H6zM14 3v5h5M12 11v6M9 14h6"),
  trash: svg("M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"),
  save: svg("M12 4v11M7 10l5 5 5-5M5 20h14"),
  back: svg("M15 5l-7 7 7 7"),
  help: svg("M9.5 9a2.5 2.5 0 115 0c0 2-2.5 2-2.5 4M12 17.5v.5"),
  copy: svg("M4 5h7v14H4zM14 5h6v14h-6z"),
  trace: svg("M4 4h16v16H4zM8 15l3-6 3 4 2-3"),
  home: svg("M4 11l8-7 8 7v9h-5v-6H9v6H4z"),
  path: svg("M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM6 15V9a3 3 0 013-3h7M18 9v6a3 3 0 01-3 3H8"),
  book: svg("M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h10"),
  images: svg("M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9.5a1 1 0 100-.1"),
  gear: svg("M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 13a7.6 7.6 0 000-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 00-1.7-1L15 3h-4l-.4 2.6a7.4 7.4 0 00-1.7 1l-2.4-1-2 3.4L6.6 11a7.6 7.6 0 000 2l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 001.7 1L11 21h4l.4-2.6a7.4 7.4 0 001.7-1l2.4 1 2-3.4z"),
  check: svg("M5 12.5l4.5 4.5L19 7.5"),
  play: svg("M8 5l11 7-11 7z"),
  flame: svg("M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"),
  clock: svg("M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z"),
  chev: svg("M9 5l7 7-7 7"),
  download: svg("M12 4v11M7 10l5 5 5-5M5 20h14"),
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmtMin = (sec) => {
  const m = Math.round(sec / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
};
const fmtClock = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

// ---------- diálogo ----------
function dialog(title, text, buttons) {
  return new Promise((resolve) => {
    const wrap = document.createElement("div");
    wrap.className = "modal";
    wrap.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true">
      <h3>${title}</h3>${text ? `<p>${text}</p>` : ""}
      <div class="modal-actions">${buttons.map((b, i) => `<button class="btn ${b.kind || ""}" data-i="${i}">${b.label}</button>`).join("")}</div>
    </div>`;
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (b) { wrap.remove(); resolve(buttons[+b.dataset.i].value); }
      else if (e.target === wrap) { wrap.remove(); resolve(null); }
    });
    document.body.append(wrap);
  });
}
function toast(msg, ms = 2600) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, ms);
}

// ---------- vistas ----------
function nextLesson() {
  return LESSONS.find((l) => !progress.isDone(l.id)) || null;
}
function moduleProgress(mod) {
  const done = mod.lessons.filter((l) => progress.isDone(l.id)).length;
  return { done, total: mod.lessons.length };
}

function setNav(active) {
  document.body.classList.remove("in-studio");
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.nav === active));
  window.scrollTo(0, 0);
}

function homeView() {
  setNav("home");
  const next = nextLesson();
  const doneN = progress.doneCount();
  const week = progress.last7();
  const maxSec = Math.max(600, ...week.map((d) => d.sec));
  const streak = progress.streak();
  view.innerHTML = `
  <section class="hero">
    <p class="eyebrow">Dibujo desde cero</p>
    <h1>Un trazo cada día.</h1>
    <p class="lead">Lecciones cortas, ejercicios en el lienzo con tu lápiz y una ruta clara: de la primera línea a dibujar figuras y cabezas.</p>
  </section>

  <section class="stats">
    <div class="stat">${I.flame}<b>${streak}</b><span>${streak === 1 ? "día seguido" : "días seguidos"}</span></div>
    <div class="stat">${I.clock}<b>${Math.round(progress.secondsToday() / 60)}</b><span>min hoy</span></div>
    <div class="stat">${I.check}<b>${doneN}<small>/${LESSONS.length}</small></b><span>lecciones</span></div>
  </section>

  ${next ? `
  <a class="next-card" href="#/leccion/${next.id}">
    <div>
      <p class="eyebrow">${doneN ? "Continúa" : "Empieza aquí"} · ${esc(next.module.title)}</p>
      <h2>${esc(next.title)}</h2>
      <p>${esc(next.intro)}</p>
    </div>
    <span class="btn primary">${I.play} Abrir lección</span>
  </a>` : `
  <div class="next-card done"><div><p class="eyebrow">Ruta completada</p><h2>¡Has terminado todas las lecciones!</h2><p>Repite las que más te cuesten y compara en la galería.</p></div></div>`}

  <section class="quick">
    <a class="quick-card" href="#/calentamiento">
      <h3>Calentamiento</h3><p>3 rondas de 2 min: líneas, elipses y curvas. Ideal antes de cada sesión.</p>
    </a>
    <a class="quick-card" href="#/cuaderno">
      <h3>Cuaderno libre</h3><p>Una hoja en blanco para dibujar lo que quieras.</p>
    </a>
  </section>

  <section class="week">
    <h3>Tu semana</h3>
    <div class="bars">${week.map((d) => `<div class="bar ${d.today ? "today" : ""}"><i style="height:${Math.max(4, (d.sec / maxSec) * 100)}%"></i><span>${d.day}</span></div>`).join("")}</div>
    <p class="muted">${fmtMin(progress.totalSeconds())} dibujando en total.</p>
  </section>

  <section>
    <h3 class="section-title">La ruta</h3>
    <div class="mod-mini">
      ${MODULES.map((m, i) => {
        const p = moduleProgress(m);
        return `<a href="#/ruta#${m.id}" class="mod-chip ${p.done === p.total ? "complete" : ""}">
          <span class="num">${i + 1}</span><span class="t">${esc(m.title)}</span>
          <span class="meter"><i style="width:${(p.done / p.total) * 100}%"></i></span></a>`;
      }).join("")}
    </div>
  </section>`;
}

function pathView(anchor) {
  setNav("path");
  view.innerHTML = `
  <section class="page-head"><h1>La ruta</h1>
  <p class="lead">Nueve módulos en orden. Cada lección tiene un poco de teoría y un ejercicio con tu lápiz. No hace falta hacerlo perfecto para avanzar: basta con hacerlo.</p></section>
  ${MODULES.map((m, i) => {
    const p = moduleProgress(m);
    return `<section class="module" id="${m.id}">
      <header><span class="mod-num">${i + 1}</span><div><h2>${esc(m.title)}</h2><p>${esc(m.tagline)}</p></div><span class="mod-count">${p.done}/${p.total}</span></header>
      <ol class="lesson-list">${m.lessons.map((l) => `
        <li><a href="#/leccion/${l.id}" class="${progress.isDone(l.id) ? "is-done" : ""}">
          <span class="tick">${progress.isDone(l.id) ? I.check : ""}</span>
          <span class="lt">${esc(l.title)}</span><span class="lm">${l.mins} min</span>${I.chev}</a></li>`).join("")}
      </ol></section>`;
  }).join("")}`;
  if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: "start" });
}

function lessonView(id) {
  const l = lessonById(id);
  if (!l) return homeView();
  setNav("path");
  settings.set("lastLesson", id);
  const idx = lessonIndex(id);
  const prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  const ex = l.exercise;
  const done = progress.isDone(id);
  const count = progress.practiceCount(id);
  view.innerHTML = `
  <article class="lesson">
    <a class="crumb" href="#/ruta#${l.module.id}">${I.back} ${esc(l.module.title)}</a>
    <h1>${esc(l.title)}</h1>
    <p class="meta">${l.mins} min · lección ${idx + 1} de ${LESSONS.length}</p>
    <p class="lead">${l.intro}</p>
    ${l.sections.map((s) => `<section class="theory"><h2>${s.h}</h2><p>${s.p}</p>${s.fig ? modelSVG(s.fig) : ""}</section>`).join("")}

    <section class="exercise">
      <p class="eyebrow">Ejercicio</p>
      <h2>${esc(ex.goal)}</h2>
      <ol>${ex.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      <div class="ex-actions">
        <a class="btn primary big" href="#/practica/${l.id}">${I.pen} Practicar ${ex.time ? `· ${Math.round(ex.time / 60)} min` : ""}</a>
        ${count ? `<span class="muted">Practicado ${count} ${count === 1 ? "vez" : "veces"}</span>` : ""}
      </div>
    </section>

    <section class="review">
      <h3>Revisa tu dibujo</h3>
      <ul>${l.review.map((r, i) => `<li><label><input type="checkbox" id="rv${i}"> <span>${esc(r)}</span></label></li>`).join("")}</ul>
      <p class="muted">Si contestas que no a alguna, repite el ejercicio fijándote solo en eso.</p>
      <button class="btn ${done ? "" : "primary"}" id="mark">${done ? `${I.check} Completada` : "Marcar como completada"}</button>
    </section>

    <nav class="pager">
      ${prev ? `<a href="#/leccion/${prev.id}" class="pg prev"><small>Anterior</small>${esc(prev.title)}</a>` : "<span></span>"}
      ${next ? `<a href="#/leccion/${next.id}" class="pg next"><small>Siguiente</small>${esc(next.title)}</a>` : "<span></span>"}
    </nav>
  </article>`;
  $("#mark").onclick = () => {
    const now = !progress.isDone(id);
    progress.setDone(id, now);
    if (now) {
      toast("¡Lección completada!");
      if (next) setTimeout(() => (location.hash = `#/leccion/${next.id}`), 700);
      else lessonView(id);
    } else lessonView(id);
  };
}

async function galleryView() {
  setNav("gallery");
  view.innerHTML = `<section class="page-head"><h1>Galería</h1><p class="lead">Tus dibujos guardados. Vuelve aquí de vez en cuando para ver cuánto has mejorado.</p></section><div class="gallery" id="gal"><p class="muted">Cargando…</p></div>`;
  let list = [];
  try { list = await gallery.all(); } catch { list = []; }
  const gal = $("#gal");
  if (!list.length) {
    gal.innerHTML = `<div class="empty"><p>Aún no has guardado ningún dibujo.</p><p class="muted">En el lienzo, pulsa el botón de guardar.</p><a class="btn primary" href="#/cuaderno">Abrir el cuaderno</a></div>`;
    return;
  }
  const urls = list.map((it) => URL.createObjectURL(it.blob));
  gal.innerHTML = list.map((it, i) => `
    <button class="thumb" data-i="${i}">
      <img src="${urls[i]}" alt="${esc(it.title)}" loading="lazy">
      <span>${esc(it.title)}<small>${new Date(it.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</small></span>
    </button>`).join("");
  gal.onclick = async (e) => {
    const b = e.target.closest(".thumb");
    if (!b) return;
    const i = +b.dataset.i, it = list[i];
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img src="${urls[i]}" alt="">
      <div class="lb-bar"><span>${esc(it.title)} · ${new Date(it.date).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</span>
      <a class="btn" download="dibujo-${it.date.slice(0, 10)}.png" href="${urls[i]}">${I.download} Descargar</a>
      <button class="btn danger" data-a="del">${I.trash} Borrar</button>
      <button class="btn" data-a="close">Cerrar</button></div>`;
    box.onclick = async (ev) => {
      const a = ev.target.closest("[data-a]")?.dataset.a;
      if (a === "close" || ev.target === box) box.remove();
      if (a === "del") {
        const ok = await dialog("¿Borrar este dibujo?", "No se puede deshacer.", [
          { label: "Cancelar", value: false }, { label: "Borrar", value: true, kind: "danger" },
        ]);
        if (ok) { await gallery.remove(it.id); box.remove(); galleryView(); }
      }
    };
    document.body.append(box);
  };
}

function settingsView() {
  setNav("settings");
  const po = settings.get("penOnly"), hand = settings.get("hand");
  view.innerHTML = `
  <section class="page-head"><h1>Ajustes</h1></section>
  <section class="card-block">
    <h2>Lápiz y mano</h2>
    <label class="field"><span>Ignorar la palma y los dedos al dibujar</span>
      <select id="penOnly">
        <option value="auto" ${po === "auto" ? "selected" : ""}>Automático (al detectar el lápiz)</option>
        <option value="on" ${po === "on" ? "selected" : ""}>Siempre: solo dibuja el lápiz</option>
        <option value="off" ${po === "off" ? "selected" : ""}>Nunca: también dibujan los dedos</option>
      </select></label>
    <label class="field"><span>Dibujo con la mano…</span>
      <select id="hand">
        <option value="right" ${hand === "right" ? "selected" : ""}>Derecha (herramientas a la izquierda)</option>
        <option value="left" ${hand === "left" ? "selected" : ""}>Izquierda (herramientas a la derecha)</option>
      </select></label>
    <p class="muted">En el lienzo: toca con dos dedos para deshacer. Si tu lápiz tiene botón de goma, también funciona.</p>
  </section>
  <section class="card-block">
    <h2>Instalar en la tablet</h2>
    <p><b>iPad (Safari):</b> botón Compartir → «Añadir a pantalla de inicio».<br><b>Android (Chrome):</b> menú ⋮ → «Instalar aplicación».<br>Se abrirá a pantalla completa y funcionará sin conexión.</p>
  </section>
  <section class="card-block">
    <h2>Para seguir aprendiendo</h2>
    <ul class="links">
      <li><a href="https://drawabox.com" target="_blank" rel="noopener">Drawabox</a> — curso gratuito de fundamentos (líneas, cajas, construcción).</li>
      <li><a href="https://line-of-action.com" target="_blank" rel="noopener">Line of Action</a> — fotos de poses con temporizador para practicar gesto.</li>
      <li><a href="https://quickposes.com" target="_blank" rel="noopener">Quickposes</a> — otra web de poses, manos y caras.</li>
      <li><a href="https://www.youtube.com/@ProkoTV" target="_blank" rel="noopener">Proko (YouTube)</a> — anatomía y figura humana.</li>
    </ul>
  </section>
  <section class="card-block">
    <h2>Tus datos</h2>
    <p class="muted">Tu progreso y tus dibujos se guardan solo en este dispositivo y navegador.</p>
    <button class="btn danger" id="reset">Reiniciar progreso</button>
  </section>`;
  $("#penOnly").onchange = (e) => settings.set("penOnly", e.target.value);
  $("#hand").onchange = (e) => settings.set("hand", e.target.value);
  $("#reset").onclick = async () => {
    const ok = await dialog("¿Reiniciar el progreso?", "Se borran las lecciones completadas y el tiempo. Los dibujos de la galería se mantienen.", [
      { label: "Cancelar", value: false }, { label: "Reiniciar", value: true, kind: "danger" },
    ]);
    if (ok) { progress.reset(); toast("Progreso reiniciado"); }
  };
}

// ---------- estudio (lienzo de práctica) ----------
let studio = null;

function modelSplit(W, H) {
  if (W >= H * 1.05) {
    const mw = Math.round(W * 0.36);
    return { model: { x: 0, y: 0, w: mw, h: H }, draw: { x: mw, y: 0, w: W - mw, h: H }, vertical: true };
  }
  const mh = Math.round(H * 0.34);
  return { model: { x: 0, y: 0, w: W, h: mh }, draw: { x: 0, y: mh, w: W, h: H - mh }, vertical: false };
}

function openStudio(cfg) {
  closeStudio();
  document.body.classList.add("in-studio");
  const hand = settings.get("hand") || "right";
  view.innerHTML = `
  <section class="studio hand-${hand}">
    <header class="st-top">
      <button class="icon-btn" data-act="exit" aria-label="Salir">${I.back}</button>
      <div class="st-title"><b>${esc(cfg.title)}</b><span id="st-sub"></span></div>
      <div class="st-timer" id="st-timer">0:00</div>
      <button class="icon-btn" data-act="help" aria-label="Instrucciones">${I.help}</button>
    </header>
    <div class="st-body">
      <div class="tools" id="tools">
        <button class="tool active" data-act="pen" aria-label="Lápiz">${I.pen}</button>
        <button class="tool" data-act="eraser" aria-label="Goma">${I.eraser}</button>
        <button class="tool size" data-act="size" aria-label="Grosor"><i></i></button>
        <span class="sep"></span>
        <button class="tool" data-act="undo" aria-label="Deshacer">${I.undo}</button>
        <button class="tool" data-act="redo" aria-label="Rehacer">${I.redo}</button>
        <span class="sep"></span>
        <button class="tool" data-act="guide" aria-label="Mostrar u ocultar guía">${I.eye}</button>
        <button class="tool" data-act="mode" aria-label="Copiar o calcar" hidden>${I.copy}</button>
        <button class="tool" data-act="next" aria-label="Hoja nueva">${I.sheet}</button>
        <button class="tool" data-act="clear" aria-label="Borrar todo">${I.trash}</button>
        <span class="grow"></span>
        <button class="tool save" data-act="save" aria-label="Guardar en la galería">${I.save}</button>
      </div>
      <div class="paper" id="paper"></div>
    </div>
    <div class="brief" id="brief" hidden></div>
  </section>`;

  const pad = new DrawingPad($("#paper"));
  pad.penOnly = settings.get("penOnly") || "auto";
  const st = {
    cfg, pad, round: 0, modelIdx: 0, seed: (Math.random() * 1e9) | 0,
    mode: "copy", dirty: false, drewAny: false,
    elapsed: 0, active: 0, lastStroke: 0, pendingSec: 0, timeUpShown: false,
  };
  studio = st;

  const R = () => cfg.rounds[st.round];
  st.mode = R().mode || "copy";

  function renderGuide(ctx, W, H) {
    const r = R();
    const models = r.models || [];
    const full = { x: 0, y: 0, w: W, h: H };
    if (models.length) {
      const key = models[st.modelIdx % models.length];
      if (st.mode === "trace") {
        drawModel(ctx, key, { x: W * 0.1, y: H * 0.08, w: W * 0.8, h: H * 0.84 }, "trace");
        return;
      }
      const sp = modelSplit(W, H);
      ctx.save();
      ctx.fillStyle = "#f4f0e7";
      ctx.fillRect(sp.model.x, sp.model.y, sp.model.w, sp.model.h);
      ctx.strokeStyle = "rgba(70,130,200,.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      if (sp.vertical) { ctx.moveTo(sp.model.w, 0); ctx.lineTo(sp.model.w, H); }
      else { ctx.moveTo(0, sp.model.h); ctx.lineTo(W, sp.model.h); }
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.font = '700 12px "Nunito Sans", system-ui, sans-serif';
      ctx.fillStyle = "rgba(60,90,130,.8)";
      ctx.textBaseline = "top";
      ctx.fillText(`MODELO · ${MODELS[key].name.toUpperCase()}`, sp.model.x + 16, sp.model.y + 14);
      ctx.restore();
      const m = sp.model, padM = 30;
      drawModel(ctx, key, { x: m.x + padM, y: m.y + padM + 14, w: m.w - padM * 2, h: m.h - padM * 2 - 14 }, "copy");
      if (r.guide && GUIDES[r.guide]) GUIDES[r.guide](ctx, sp.draw, rngFrom(st.seed));
      return;
    }
    const g = GUIDES[r.guide || "none"];
    if (g) g(ctx, full, rngFrom(st.seed));
  }

  function updateUI() {
    const r = R();
    const tools = $("#tools");
    tools.querySelector('[data-act="pen"]').classList.toggle("active", pad.tool === "pen");
    tools.querySelector('[data-act="eraser"]').classList.toggle("active", pad.tool === "eraser");
    const sz = tools.querySelector(".size i");
    const d = [6, 10, 16][pad.sizeIdx];
    sz.style.width = sz.style.height = d + "px";
    tools.querySelector('[data-act="guide"]').innerHTML = pad.guideVisible ? I.eye : I.eyeOff;
    tools.querySelector('[data-act="guide"]').classList.toggle("off", !pad.guideVisible);
    const modeBtn = tools.querySelector('[data-act="mode"]');
    modeBtn.hidden = !(r.models && r.models.length);
    modeBtn.innerHTML = st.mode === "trace" ? `${I.trace}<em>Calcar</em>` : `${I.copy}<em>Copiar</em>`;
    tools.querySelector('[data-act="undo"]').disabled = !pad.strokes.length && !pad.cleared;
    tools.querySelector('[data-act="redo"]').disabled = !pad.undone.length;
    const sub = [];
    if (cfg.rounds.length > 1) sub.push(`Ronda ${st.round + 1}/${cfg.rounds.length}`);
    if (r.label) sub.push(r.label);
    if (r.models && r.models.length > 1) sub.push(`Modelo ${(st.modelIdx % r.models.length) + 1}/${r.models.length}`);
    $("#st-sub").textContent = sub.join(" · ");
  }

  function showBrief(first = false) {
    const r = R();
    const b = $("#brief");
    b.hidden = false;
    b.innerHTML = `<div class="brief-card">
      ${cfg.rounds.length > 1 ? `<p class="eyebrow">Ronda ${st.round + 1} de ${cfg.rounds.length}</p>` : `<p class="eyebrow">Ejercicio</p>`}
      <h3>${esc(r.goal || cfg.title)}</h3>
      ${r.steps ? `<ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
      <p class="muted small">Dos dedos = deshacer · El ojo oculta la guía · La hoja con + pasa a una hoja nueva${r.models && r.models.length ? " o al siguiente modelo" : ""}.</p>
      <button class="btn primary" data-act="brief-ok">${first ? "Empezar" : "Seguir dibujando"}</button>
    </div>`;
  }

  pad.onStroke = () => {
    st.dirty = true;
    st.drewAny = true;
    st.lastStroke = Date.now();
  };
  pad.onChange = updateUI;
  pad.setGuide(renderGuide);
  requestAnimationFrame(() => { pad.resetWorld(); updateUI(); });
  if (cfg.rounds[0].goal) showBrief(true);

  // temporizador: cuenta tiempo real y tiempo activo (dibujando)
  st.timer = setInterval(() => {
    if (document.hidden || !$("#brief").hidden) return;
    st.elapsed++;
    if (Date.now() - st.lastStroke < 45000) {
      st.active++;
      st.pendingSec++;
      if (st.pendingSec >= 10) { progress.addSeconds(st.pendingSec); st.pendingSec = 0; }
    }
    const r = R();
    const el = $("#st-timer");
    if (r.time) {
      st.roundElapsed = (st.roundElapsed || 0) + 1;
      const left = r.time - st.roundElapsed;
      el.textContent = left >= 0 ? fmtClock(left) : `+${fmtClock(-left)}`;
      el.classList.toggle("over", left < 0);
      if (left === 0 && !st.timeUpShown) {
        st.timeUpShown = true;
        if (st.round < cfg.rounds.length - 1) toast("¡Tiempo! Pulsa la hoja nueva para la siguiente ronda.", 4000);
        else toast("¡Tiempo! Puedes seguir o guardar tu dibujo.", 4000);
        navigator.vibrate?.(120);
      }
    } else el.textContent = fmtClock(st.elapsed);
  }, 1000);

  async function saveDrawing() {
    if (pad.isEmpty()) { toast("Aún no hay nada que guardar"); return false; }
    const blob = await pad.toBlob();
    try {
      await gallery.add({ title: cfg.title, lessonId: cfg.lessonId || null, blob });
      st.dirty = false;
      toast("Guardado en tu galería");
      return true;
    } catch {
      toast("No se pudo guardar");
      return false;
    }
  }

  async function confirmLoss(title) {
    if (!st.dirty || pad.isEmpty()) return true;
    const v = await dialog(title, "Tienes trazos sin guardar en la galería.", [
      { label: "Cancelar", value: "cancel" },
      { label: "No guardar", value: "skip" },
      { label: "Guardar", value: "save", kind: "primary" },
    ]);
    if (v === "save") return await saveDrawing();
    return v === "skip";
  }

  async function nextSheet() {
    const r = R();
    const lastRound = st.round >= cfg.rounds.length - 1;
    if (!(await confirmLoss("¿Pasar a una hoja nueva?"))) return;
    if (cfg.rounds.length > 1 && !lastRound) {
      st.round++;
      st.roundElapsed = 0;
      st.timeUpShown = false;
      st.mode = R().mode || "copy";
      st.modelIdx = 0;
      showBrief();
    } else if (cfg.rounds.length > 1 && lastRound) {
      const v = await dialog("¡Calentamiento hecho!", "Ya tienes la mano lista. ¿Qué hacemos ahora?", [
        { label: "Seguir aquí", value: "stay" },
        { label: nextLesson() ? "Ir a mi lección" : "Volver al inicio", value: "go", kind: "primary" },
      ]);
      if (v === "go") { exit(true); location.hash = nextLesson() ? `#/leccion/${nextLesson().id}` : "#/"; return; }
    } else if (r.models && r.models.length > 1) st.modelIdx++;
    st.seed = (Math.random() * 1e9) | 0;
    st.dirty = false;
    pad.newSheet();
    pad.setGuide(renderGuide);
    updateUI();
  }

  function exit(skipNav) {
    if (st.drewAny && cfg.lessonId) progress.addPractice(cfg.lessonId);
    if (st.pendingSec) progress.addSeconds(st.pendingSec);
    st.pendingSec = 0;
    st.exited = true;
    closeStudio();
    if (!skipNav) location.hash = cfg.back || "#/";
  }

  view.querySelector(".studio").addEventListener("click", async (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const act = b.dataset.act;
    if (act === "pen" || act === "eraser") pad.tool = act;
    else if (act === "size") pad.sizeIdx = (pad.sizeIdx + 1) % SIZES.length;
    else if (act === "undo") pad.undo();
    else if (act === "redo") pad.redo();
    else if (act === "guide") pad.toggleGuide();
    else if (act === "mode") { st.mode = st.mode === "copy" ? "trace" : "copy"; pad.drawGuide(); }
    else if (act === "next") await nextSheet();
    else if (act === "clear") { if (!pad.isEmpty()) { pad.clear(); toast("Hoja borrada · deshacer la recupera"); } }
    else if (act === "save") await saveDrawing();
    else if (act === "help") showBrief();
    else if (act === "brief-ok") $("#brief").hidden = true;
    else if (act === "exit") { if (await confirmLoss("¿Salir del ejercicio?")) exit(); return; }
    updateUI();
  });

  st.keys = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      e.shiftKey ? pad.redo() : pad.undo();
    }
  };
  window.addEventListener("keydown", st.keys);
  st.beforeUnload = (e) => { if (st.dirty && !pad.isEmpty()) { e.preventDefault(); e.returnValue = ""; } };
  window.addEventListener("beforeunload", st.beforeUnload);
}

function closeStudio() {
  if (!studio) return;
  clearInterval(studio.timer);
  if (studio.pendingSec) progress.addSeconds(studio.pendingSec);
  window.removeEventListener("keydown", studio.keys);
  window.removeEventListener("beforeunload", studio.beforeUnload);
  studio.pad.destroy();
  studio = null;
  document.body.classList.remove("in-studio");
}

function practiceView(id) {
  const l = lessonById(id);
  if (!l) return homeView();
  const ex = l.exercise;
  openStudio({
    title: l.title, lessonId: l.id, back: `#/leccion/${l.id}`,
    rounds: [{ goal: ex.goal, steps: ex.steps, guide: ex.guide, models: ex.models, mode: ex.mode, time: ex.time }],
  });
}

function warmupView() {
  const third = progress.isDone("cajas") ? "boxes" : progress.isDone("curvas") ? "arcs" : "traceLines";
  const thirdGoal = {
    boxes: "Dibuja una caja en cada cruz, con sus aristas ocultas.",
    arcs: "Repasa cada curva unas cuantas veces y cópiala al lado.",
    traceLines: "Repasa cada línea 6–8 veces de un solo golpe.",
  }[third];
  openStudio({
    title: "Calentamiento", back: "#/",
    rounds: [
      { label: "Líneas rectas", guide: "dots", time: 120, goal: "Une los puntos con líneas rectas y seguras.", steps: ["Planea.", "Ensaya en el aire.", "Traza de una vez."] },
      { label: "Elipses", guide: "ellipses", time: 120, goal: "Repasa las elipses dando 2–3 vueltas sin levantar el lápiz.", steps: ["Mueve el hombro.", "Vueltas suaves y continuas."] },
      { label: "Tercera ronda", guide: third, time: 120, goal: thirdGoal },
    ],
  });
}

function sketchView() {
  openStudio({ title: "Cuaderno libre", back: "#/", rounds: [{ guide: "grid" }] });
  studio.pad.toggleGuide(false);
  $("#tools [data-act='guide']").innerHTML = I.eyeOff;
}

// ---------- router ----------
function route() {
  const h = location.hash.replace(/^#/, "") || "/";
  const [path, anchor] = h.split("#");
  const parts = path.split("/").filter(Boolean);
  if (studio && !studio.exited && !["practica", "calentamiento", "cuaderno"].includes(parts[0])) closeStudio();
  switch (parts[0]) {
    case undefined: return homeView();
    case "ruta": return pathView(anchor);
    case "leccion": return lessonView(parts[1]);
    case "practica": return practiceView(parts[1]);
    case "calentamiento": return warmupView();
    case "cuaderno": return sketchView();
    case "galeria": return galleryView();
    case "ajustes": return settingsView();
    default: return homeView();
  }
}

document.querySelector(".nav").innerHTML = `
  <a href="#/" data-nav="home">${I.home}<span>Inicio</span></a>
  <a href="#/ruta" data-nav="path">${I.path}<span>Ruta</span></a>
  <a href="#/cuaderno" data-nav="sketch">${I.book}<span>Cuaderno</span></a>
  <a href="#/galeria" data-nav="gallery">${I.images}<span>Galería</span></a>
  <a href="#/ajustes" data-nav="settings">${I.gear}<span>Ajustes</span></a>`;

window.addEventListener("hashchange", route);
route();

if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
