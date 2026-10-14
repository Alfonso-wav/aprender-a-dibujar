// Progreso y ajustes (localStorage) y galería de dibujos (IndexedDB).
// Todo se guarda solo en este dispositivo.

const KEY = "aad.v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}
const state = Object.assign(
  { done: {}, practice: {}, days: {}, settings: { penOnly: "auto", hand: "right" } },
  load(),
);
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const progress = {
  isDone: (id) => !!state.done[id],
  setDone(id, v = true) {
    if (v) state.done[id] = today();
    else delete state.done[id];
    save();
  },
  doneCount: () => Object.keys(state.done).length,
  addPractice(id) {
    state.practice[id] = (state.practice[id] || 0) + 1;
    save();
  },
  practiceCount: (id) => state.practice[id] || 0,
  addSeconds(sec) {
    const t = today();
    state.days[t] = (state.days[t] || 0) + sec;
    save();
  },
  secondsToday: () => state.days[today()] || 0,
  totalSeconds: () => Object.values(state.days).reduce((a, b) => a + b, 0),
  streak() {
    let n = 0;
    const d = new Date();
    const key = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    if ((state.days[key(d)] || 0) < 60) d.setDate(d.getDate() - 1); // hoy aún no cuenta
    while ((state.days[key(d)] || 0) >= 60) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  },
  last7() {
    const out = [];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      out.push({ day: d.toLocaleDateString("es-ES", { weekday: "narrow" }), sec: state.days[k] || 0, today: i === 6 });
      d.setDate(d.getDate() + 1);
    }
    return out;
  },
  reset() {
    state.done = {}; state.practice = {}; state.days = {};
    save();
  },
};

export const settings = {
  get: (k) => state.settings[k],
  set(k, v) {
    state.settings[k] = v;
    save();
  },
};

// ---------- Galería ----------

let dbp;
function db() {
  if (!dbp)
    dbp = new Promise((res, rej) => {
      const r = indexedDB.open("aprender-a-dibujar", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("drawings", { keyPath: "id" });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  return dbp;
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction("drawings", mode);
    const out = fn(t.objectStore("drawings"));
    t.oncomplete = () => res(out && "result" in out ? out.result : undefined);
    t.onerror = () => rej(t.error);
  });
}

export const gallery = {
  add: (item) => tx("readwrite", (s) => s.put({ id: Date.now() + "-" + Math.random().toString(36).slice(2, 7), date: new Date().toISOString(), ...item })),
  all: async () => {
    const list = await tx("readonly", (s) => s.getAll());
    return (list || []).sort((a, b) => b.date.localeCompare(a.date));
  },
  remove: (id) => tx("readwrite", (s) => s.delete(id)),
};
