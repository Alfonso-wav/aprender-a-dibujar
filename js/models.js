// Modelos vectoriales: se usan como ilustración en las lecciones (SVG)
// y como modelo para copiar o calcar en el lienzo (Path2D).
// Cada parte: { d: "path SVG", t: "m" (línea principal) | "g" (línea guía/oculta, discontinua) | "h" (trama) | "f" (relleno) }

const f = (n) => Math.round(n * 10) / 10;
const pt = (p) => `${f(p[0])} ${f(p[1])}`;

/** Elipse completa (cx, cy, radios, rotación en grados) */
export function E(cx, cy, rx, ry, rot = 0) {
  const a = (rot * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);
  const x1 = cx + rx * c, y1 = cy + rx * s, x2 = cx - rx * c, y2 = cy - rx * s;
  return `M${f(x1)} ${f(y1)}A${rx} ${ry} ${rot} 1 1 ${f(x2)} ${f(y2)}A${rx} ${ry} ${rot} 1 1 ${f(x1)} ${f(y1)}Z`;
}
/** Mitad delantera (inferior) de una elipse horizontal */
const Hf = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 0 0 ${f(cx + rx)} ${f(cy)}`;
/** Mitad trasera (superior) de una elipse horizontal */
const Hb = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)}A${rx} ${ry} 0 0 1 ${f(cx + rx)} ${f(cy)}`;
const C = (cx, cy, r) => E(cx, cy, r, r);
const L = (...p) => "M" + p.map(pt).join("L");
const Z = (...p) => L(...p) + "Z";
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function intersect(p1, p2, p3, p4) {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
}
const m = (d) => ({ d, t: "m" });
const g = (d) => ({ d, t: "g" });
const h = (d) => ({ d, t: "h" });
const fill = (d) => ({ d, t: "f" });

/** Trama diagonal dentro de una caja */
function hatchBox(x, y, s, step, dir = 1) {
  const out = [];
  for (let k = -s; k < s; k += step) {
    const t0 = Math.max(0, -k), t1 = Math.min(s, s - k);
    if (t1 - t0 < 1) continue;
    if (dir > 0) out.push(L([x + k + t0, y + s - t0], [x + k + t1, y + s - t1]));
    else out.push(L([x + k + t0, y + t0], [x + k + t1, y + t1]));
  }
  return out.join("");
}

// ---------- Ilustraciones de teoría ----------

const ghost3 = {
  name: "Método fantasma", vb: [300, 100],
  parts: [
    fill(C(15, 72, 3.5)), fill(C(85, 30, 3.5)),
    fill(C(115, 72, 3.5)), fill(C(185, 30, 3.5)),
    g(L([118, 66], [182, 28])), g(L([120, 74], [184, 36])),
    fill(C(215, 72, 3.5)), fill(C(285, 30, 3.5)),
    m(L([215, 72], [285, 30])),
    g(L([100, 10], [100, 92])), g(L([200, 10], [200, 92])),
  ],
  caption: ["1 · Planea", "2 · Ensaya en el aire", "3 · Traza de una vez"],
};

const lineConfidence = (() => {
  const wob = [];
  for (let x = 10; x <= 210; x += 4) wob.push([x, 22 + 2.4 * Math.sin(x * 0.35) + 1.4 * Math.sin(x * 0.9)]);
  const hairy = [];
  for (let i = 0; i < 8; i++) {
    const x = 10 + i * 25;
    hairy.push(L([x, 58 + (i % 3) - 1], [x + 34, 57 + ((i + 1) % 3) - 1]));
  }
  return {
    name: "Líneas", vb: [220, 112],
    parts: [m(L(...wob)), m(hairy.join("")), m(L([10, 95], [210, 95]))],
    caption: ["Temblorosa: dibujada despacio", "Peluda: muchos trazos cortos", "Segura: un trazo decidido"],
  };
})();

const ellipseDegrees = {
  name: "Grados de elipse", vb: [240, 80],
  parts: [3, 9, 16, 24].flatMap((ry, i) => {
    const cx = 30 + i * 60;
    return [m(E(cx, 40, 24, ry)), g(L([cx, 40 - ry - 5], [cx, 40 + ry + 5])), g(L([cx - 29, 40], [cx + 29, 40]))];
  }),
  caption: ["De canto", "Estrecha", "Media", "Círculo"],
};

const pressureDemo = {
  name: "Presión", vb: [220, 104],
  parts: [
    fill("M10 18Q110 16.5 205 13Q212 18 205 23Q110 19.5 10 18Z"),
    fill("M15 52Q8 52 9 47Q12 43 20 46.5Q110 50 212 52Q110 54 20 57.5Q12 61 9 57Q8 52 15 52Z"),
    fill("M10 88Q110 72 210 88Q110 96 10 88Z"),
  ],
  caption: ["fino → grueso", "grueso → fino", "fino · grueso · fino"],
};

const shapes2d = {
  name: "Formas básicas", vb: [240, 80],
  parts: [m(C(40, 40, 30)), m(Z([95, 12], [150, 12], [150, 67], [95, 67])), m(Z([200, 10], [232, 68], [168, 68]))],
};

// ---------- Siluetas con formas planas ----------

const house = {
  name: "Casa", vb: [200, 190],
  parts: [
    g(Z([50, 100], [150, 100], [150, 170], [50, 170])),
    m(Z([40, 100], [100, 45], [160, 100])),
    m(L([50, 100], [50, 170], [150, 170], [150, 100])),
    m(L([88, 170], [88, 132], [112, 132], [112, 170])),
    m(Z([62, 114], [80, 114], [80, 132], [62, 132])),
    m(Z([122, 114], [140, 114], [140, 132], [122, 132])),
    m(L([128, 72], [128, 52], [140, 52], [140, 83])),
  ],
};
const tree = {
  name: "Árbol", vb: [200, 190],
  parts: [
    m(C(100, 80, 34)), m(C(70, 100, 24)), m(C(130, 100, 24)), m(C(100, 116, 22)),
    m(L([92, 178], [92, 132])), m(L([108, 178], [108, 132])), m(L([60, 178], [140, 178])),
  ],
};
const cat = {
  name: "Gato", vb: [200, 200],
  parts: [
    m(E(100, 140, 42, 46)), m(C(100, 72, 26)),
    m(Z([80, 58], [76, 32], [95, 48])), m(Z([120, 58], [124, 32], [105, 48])),
    m("M138 160Q182 150 170 108"),
    fill(C(91, 70, 3)), fill(C(109, 70, 3)),
    m(Z([96, 79], [104, 79], [100, 84])),
  ],
};

// ---------- Volumen ----------

const overlap = {
  name: "Superposición", vb: [200, 190],
  parts: [
    m(L([132, 52], [132, 20], [176, 20], [176, 60], [158, 60])),
    m(L([40, 72], [40, 40], [120, 40], [120, 80])),
    m(L([40, 72], [40, 110], [80, 110])),
    m(Z([80, 80], [170, 80], [170, 165], [80, 165])),
    g(L([120, 80], [120, 110], [80, 110])),
  ],
  caption: ["Lo que tapa está delante; lo pequeño y alto parece lejos."],
};

const cubePts = {
  F: [100, 85], B: [100, 160], TL: [48, 65], BL: [48, 128], TR: [158, 62], BR: [158, 126], TB: [106, 47], HB: [106, 104],
};
const cube = (() => {
  const p = cubePts;
  return {
    name: "Cubo", vb: [200, 180],
    parts: [
      m(Z(p.F, p.TL, p.TB, p.TR)), m(L(p.TL, p.BL, p.B, p.BR, p.TR)), m(L(p.F, p.B)),
      g(L(p.BL, p.HB, p.BR)), g(L(p.HB, p.TB)),
    ],
  };
})();

const sphere = {
  name: "Esfera", vb: [200, 180],
  parts: [m(C(100, 90, 62)), m(Hf(100, 90, 62, 18)), g(Hb(100, 90, 62, 18)), g(E(100, 90, 22, 62))],
};
const cylinder = {
  name: "Cilindro", vb: [200, 190],
  parts: [
    m(E(100, 45, 46, 14)), m(L([54, 45], [54, 145])), m(L([146, 45], [146, 145])),
    m(Hf(100, 145, 46, 19)), g(Hb(100, 145, 46, 19)), g(L([100, 25], [100, 175])),
  ],
};
const cone = {
  name: "Cono", vb: [200, 190],
  parts: [m(L([48, 145], [100, 25], [152, 145])), m(Hf(100, 145, 52, 18)), g(Hb(100, 145, 52, 18)), g(L([100, 25], [100, 163]))],
};
const icecream = {
  name: "Helado", vb: [200, 200],
  parts: [
    m(C(100, 64, 38)), g(Hb(100, 96, 31, 9)), m(Hf(100, 96, 31, 9)),
    m(L([69, 96], [100, 188], [131, 96])),
    h(L([80, 110], [118, 140])), h(L([86, 132], [114, 112])), h(L([90, 150], [104, 140])),
  ],
};
const cup = {
  name: "Taza", vb: [200, 190],
  parts: [
    m(E(98, 50, 44, 13)), m(E(98, 50, 38, 10)),
    m(L([54, 50], [61, 150])), m(L([142, 50], [135, 150])),
    m(Hf(98, 150, 37, 12)), g(Hb(98, 150, 37, 12)), g(L([98, 30], [98, 170])),
    m("M140 74C176 72 176 126 136 124"), m("M139 86C160 86 160 112 137 110"),
  ],
};
const lamp = {
  name: "Lámpara", vb: [200, 210],
  parts: [
    m(E(100, 30, 24, 7)), m(L([76, 30], [44, 92])), m(L([124, 30], [156, 92])),
    m(Hf(100, 92, 56, 16)), g(Hb(100, 92, 56, 16)), g(L([100, 37], [100, 108])),
    m(L([96, 108], [96, 170])), m(L([104, 108], [104, 170])),
    m(E(100, 172, 42, 11)), m(L([58, 172], [58, 182])), m(L([142, 172], [142, 182])), m(Hf(100, 182, 42, 11)),
  ],
};

// ---------- Perspectiva ----------

const persp1Demo = (() => {
  const VP = [200, 70];
  const t = 0.35;
  const A = [60, 110], B = [120, 110], Cc = [120, 170], D = [60, 170];
  const [A2, B2, C2, D2] = [A, B, Cc, D].map((p) => lerp(p, VP, t));
  const E1 = [230, 18], F1 = [272, 18], G1 = [272, 48], H1 = [230, 48];
  const [E2, F2, G2, H2] = [E1, F1, G1, H1].map((p) => lerp(p, VP, t));
  return {
    name: "Perspectiva de 1 punto", vb: [300, 190],
    parts: [
      g(L([0, 70], [300, 70])), fill(C(VP[0], VP[1], 3.5)),
      ...[A, B, Cc, D, E1, F1, G1, H1].map((p) => g(L(p, VP))),
      m(Z(A, B, Cc, D)), m(L(A, A2, B2, B)), m(L(B2, C2, Cc)),
      g(L(A2, D2, C2)), g(L(D, D2)),
      m(Z(E1, F1, G1, H1)), m(L(E1, E2, H2, G2, G1)), m(L(H1, H2)),
      g(L(E2, F2, G2)), g(L(F1, F2)),
    ],
    caption: ["Horizonte = altura de tus ojos. Todas las líneas de profundidad van al punto de fuga."],
  };
})();

const persp2Demo = (() => {
  const VL = [8, 60], VR = [292, 60];
  const T = [150, 100], B = [150, 168];
  const along = (p, v, x) => lerp(p, v, (p[0] - x) / (p[0] - v[0]));
  const LT = along(T, VL, 92), LB = along(B, VL, 92);
  const RT = along(T, VR, 222), RB = along(B, VR, 222);
  const BK = intersect(LT, VR, RT, VL);
  const BKb = intersect(LB, VR, RB, VL);
  return {
    name: "Perspectiva de 2 puntos", vb: [300, 190],
    parts: [
      g(L([0, 60], [300, 60])), fill(C(VL[0], VL[1], 3.5)), fill(C(VR[0], VR[1], 3.5)),
      g(L(T, VL)), g(L(T, VR)), g(L(B, VL)), g(L(B, VR)), g(L(LT, VR)), g(L(RT, VL)),
      m(Z(T, LT, BK, RT)), m(L(LT, LB, B, RB, RT)), m(L(T, B)),
      g(L(LB, BKb, RB)), g(L(BKb, BK)),
    ],
    caption: ["Dos puntos de fuga en el horizonte. Las verticales siguen siendo verticales."],
  };
})();

// ---------- Sombra con líneas ----------

const valueDemo = (() => {
  const parts = [];
  const s = 48;
  const conf = [[], [[11, 1]], [[5.5, 1]], [[5.5, 1], [9, -1]], [[3.4, 1], [4, -1]]];
  conf.forEach((layers, i) => {
    const x = 6 + i * 58, y = 8;
    parts.push(m(Z([x, y], [x + s, y], [x + s, y + s], [x, y + s])));
    layers.forEach(([step, dir]) => parts.push(h(hatchBox(x, y, s, step, dir))));
  });
  return { name: "Escala de valor", vb: [296, 64], parts, caption: ["1 · papel", "2", "3", "4 · cruzada", "5 · muy oscuro"] };
})();

const sphereShade = (() => {
  const parts = [m(C(100, 88, 56))];
  parts.push(g("M139.6 48.4A56 22 -45 0 1 60.4 127.6"));
  for (let r = 54; r >= 30; r -= 6) {
    const a0 = (-30 * Math.PI) / 180, a1 = (125 * Math.PI) / 180;
    const p0 = [100 + r * Math.cos(a0), 88 + r * Math.sin(a0)];
    const p1 = [100 + r * Math.cos(a1), 88 + r * Math.sin(a1)];
    parts.push(h(`M${pt(p0)}A${r} ${r} 0 0 1 ${pt(p1)}`));
  }
  parts.push(m(E(132, 152, 50, 10)));
  for (let x = 92; x <= 176; x += 7) {
    const dy = 10 * Math.sqrt(Math.max(0, 1 - ((x - 132) / 50) ** 2));
    if (dy > 2) parts.push(h(L([x, 152 - dy + 1], [x, 152 + dy - 1])));
  }
  parts.push(g("M20 30L40 50"), fill("M44 54L33 49L39 43Z"));
  return { name: "Esfera con sombra", vb: [200, 175], parts, caption: ["Luz desde arriba a la izquierda: sombra propia abajo a la derecha y sombra proyectada en el suelo."] };
})();

const cubeShade = (() => {
  const p = cubePts;
  const parts = [...cube.parts];
  for (let x = 106; x < 158; x += 5) {
    const t = (x - 100) / 58;
    parts.push(h(L(lerp(p.F, p.TR, t), lerp(p.B, p.BR, t))));
  }
  for (let x = 56; x < 100; x += 11) {
    const t = (x - 48) / 52;
    parts.push(h(L(lerp(p.TL, p.F, t), lerp(p.BL, p.B, t))));
  }
  const S1 = [196, 136], S2 = [150, 174];
  parts.push(m(L(p.BR, S1, S2, p.B)));
  for (let i = 1; i < 9; i++) {
    const t = i / 9;
    parts.push(h(L(lerp(p.B, p.BR, t), lerp(S2, S1, t))));
  }
  return { name: "Cubo con sombra", vb: [200, 180], parts };
})();

const contourCyl = {
  name: "Trama que sigue la forma", vb: [200, 190],
  parts: [
    ...cylinder.parts,
    ...[66, 84, 102, 120].map((y, i) => h(Hf(100, y, 46, 15 + i * 1))),
    ...[72, 78, 90, 96, 108, 114, 126, 132].map((y, i) => h(`M118 ${y + 16}A46 ${15 + i * 0.5} 0 0 0 146 ${y}`)),
  ],
};

// ---------- Figura humana ----------

const figure8 = (() => {
  const top = 10, u = 22.5;
  const y = (k) => top + k * u;
  const parts = [];
  for (let k = 0; k <= 8; k++) parts.push(g(L([4, y(k)], [126, y(k)])));
  for (let k = 0; k < 8; k++) parts.push(g(E(146, y(k) + u / 2, 7.5, u / 2 - 0.5)));
  parts.push(
    m(E(60, y(0.5), 8.5, u / 2)), m(L([60, y(1)], [60, y(1.25)])),
    m(Z([39, y(1.35)], [81, y(1.35)], [75, y(3)], [45, y(3)])),
    m(Z([47, y(3.15)], [73, y(3.15)], [79, y(4)], [41, y(4)])),
    m(L([47, y(4)], [51, y(6)], [51, y(8)])), m(L([73, y(4)], [69, y(6)], [69, y(8)])),
    m(L([39, y(1.35)], [33, y(2.9)], [31, y(4.1)])), m(L([81, y(1.35)], [87, y(2.9)], [89, y(4.1)])),
    fill(C(51, y(6), 2.5)), fill(C(69, y(6), 2.5)), fill(C(33, y(2.9), 2.5)), fill(C(87, y(2.9), 2.5)),
  );
  return { name: "Proporciones (8 cabezas)", vb: [160, 200], parts };
})();

const stickPose = {
  name: "Pose de pie", vb: [120, 200],
  parts: [
    g("M62 8Q48 100 52 192"),
    m(C(62, 20, 10)), m("M62 30Q56 62 60 92"),
    m(L([42, 41], [80, 35])), m(L([46, 92], [74, 99])),
    m(L([42, 41], [36, 68], [41, 94])), m(L([80, 35], [88, 62], [84, 88])),
    m(L([47, 92], [54, 140], [52, 188], [62, 190])), m(L([73, 99], [77, 142], [86, 186], [96, 188])),
    fill(C(36, 68, 2.6)), fill(C(88, 62, 2.6)), fill(C(54, 140, 2.6)), fill(C(77, 142, 2.6)),
  ],
};
const runPose = {
  name: "Pose corriendo", vb: [170, 200],
  parts: [
    g("M104 12Q82 92 30 148"),
    m(C(102, 26, 10)), m("M96 36Q84 66 80 96"),
    m(L([76, 48], [104, 44])), m(L([70, 96], [90, 100])),
    m(L([104, 44], [122, 66], [140, 54])), m(L([76, 48], [58, 72], [44, 64])),
    m(L([90, 100], [114, 128], [108, 166], [124, 170])), m(L([70, 96], [52, 128], [26, 140], [20, 128])),
    fill(C(122, 66, 2.6)), fill(C(58, 72, 2.6)), fill(C(114, 128, 2.6)), fill(C(52, 128, 2.6)),
  ],
};
const actionLines = {
  name: "Líneas de acción", vb: [240, 150],
  parts: [
    m(C(40, 18, 8)), m("M40 26Q14 80 40 140"),
    m(C(120, 18, 8)), m("M120 26C150 60 90 100 120 140"),
    m(C(200, 18, 8)), m("M200 26Q204 84 198 140"),
  ],
  caption: ["C", "S", "I"],
};

const bean = (() => {
  const W = 130;
  const mx = (p) => [W - p[0], p[1]];
  const sym = (...pts) => [m(L(...pts)), m(L(...pts.map(mx)))];
  const symC = (x, y, r) => [m(C(x, y, r)), m(C(W - x, y, r))];
  return {
    name: "Maniquí", vb: [W, 212],
    parts: [
      m(E(65, 20, 10, 13)), ...sym([61, 33], [61, 41]),
      m(E(65, 63, 22, 26)), m(Z([48, 93], [82, 93], [79, 114], [51, 114])), g(L([65, 34], [65, 112])),
      ...symC(42, 46, 5),
      ...sym([38, 50], [35, 86]), ...sym([46, 51], [44, 86]), ...symC(40, 89, 4.5),
      ...sym([36, 92], [37, 122]), ...sym([44, 92], [45, 122]), ...symC(41, 128, 5.5),
      ...sym([51, 114], [52, 160]), ...sym([63, 114], [62, 160]), ...symC(57, 164, 5.5),
      ...sym([52, 168], [54, 196]), ...sym([62, 168], [60, 196]), ...sym([52, 196], [50, 206], [66, 206], [61, 196]),
    ],
  };
})();

const mitten = {
  name: "Mano simplificada", vb: [200, 200],
  parts: [
    m("M62 92Q58 30 92 28Q128 26 122 92"),
    m("M62 92L66 160Q94 172 120 160L122 92"),
    m("M122 118Q152 110 156 84Q154 70 142 76Q134 96 122 100"),
    g("M62 92Q92 84 122 92"),
    g(L([76, 90], [72, 40])), g(L([92, 88], [92, 30])), g(L([107, 89], [111, 36])),
    g(Z([66, 92], [122, 92], [120, 160], [66, 160])),
  ],
  caption: ["Primero la forma de manopla, luego divides los dedos."],
};

// ---------- La cabeza ----------

const loomisFront = {
  name: "Cabeza de frente (Loomis)", vb: [160, 200],
  parts: [
    m(C(80, 75, 52)),
    g(L([80, 14], [80, 190])), g(L([22, 75], [138, 75])), g(L([30, 40], [130, 40])),
    g(L([30, 110], [130, 110])), g(L([46, 145], [114, 145])),
    m("M32 95Q36 130 62 141Q80 149 98 141Q124 130 128 95"),
    m(E(61, 87, 10, 4)), m(E(99, 87, 10, 4)),
    m("M74 108Q80 113 86 108"), m("M68 124Q80 127 92 124"),
    m("M30 78Q22 93 32 108"), m("M130 78Q138 93 128 108"),
    m(L([56, 140], [56, 190])), m(L([104, 140], [104, 190])),
  ],
  caption: ["Tres partes iguales: frente, nariz y boca-barbilla."],
};
const loomis34 = {
  name: "Cabeza de 3/4", vb: [170, 200],
  parts: [
    m(C(80, 75, 50)), g(E(58, 80, 21, 31)),
    g("M110 26Q130 76 114 147"), g("M30 72Q80 86 129 70"), g("M36 108Q84 118 132 106"),
    m("M58 112Q70 140 104 150Q116 150 122 138L128 112"),
    m("M124 84L134 107L122 110"), m(E(102, 88, 7, 3.5)), m(E(126, 86, 4, 3)),
    m("M108 126Q118 128 126 124"), m("M56 80Q45 94 58 106"),
    m(L([62, 124], [66, 196])), m(L([106, 150], [110, 196])),
  ],
};
const profile = {
  name: "Cabeza de perfil", vb: [170, 200],
  parts: [
    m(C(75, 75, 50)), g(E(78, 84, 26, 33)),
    g(L([20, 40], [150, 40])), g(L([20, 75], [150, 75])), g(L([20, 110], [150, 110])), g(L([20, 146], [150, 146])),
    m("M122 40Q129 58 126 73L139 104L127 110Q131 116 128 122Q122 128 127 134Q125 144 112 147Q86 147 74 125"),
    m("M72 82Q87 80 85 96Q83 109 74 108"), m("M112 88L122 86"),
    m(L([70, 125], [66, 196])), m(L([112, 147], [118, 196])),
  ],
};
const features = {
  name: "Rasgos", vb: [210, 170],
  parts: [
    m("M18 52Q50 26 84 52Q50 70 18 52Z"), m(C(51, 49, 11)), fill(C(51, 49, 4)),
    m("M22 44Q50 18 80 44"), m("M14 30Q50 10 88 28"),
    g(Z([128, 10], [172, 10], [184, 84], [116, 84])), g(C(150, 74, 10)),
    m("M134 64Q118 70 124 82Q132 90 142 84"), m("M166 64Q182 70 176 82Q168 90 158 84"),
    m("M142 84Q150 88 158 84"), m("M140 22L136 60"), m("M160 22L164 60"),
    m("M48 136Q62 128 72 132Q77 129 82 132Q92 128 106 136"), m("M48 136Q77 142 106 136"),
    m("M54 141Q77 160 100 141"),
    g(L([20, 98], [200, 98])),
  ],
  caption: ["Ojo: una almendra con una esfera dentro. Nariz: una cuña con una bola en la punta. Boca: tres líneas."],
};

export const MODELS = {
  ghost3, lineConfidence, ellipseDegrees, pressureDemo, shapes2d,
  house, tree, cat, overlap, cube, sphere, cylinder, cone, icecream, cup, lamp,
  persp1Demo, persp2Demo, valueDemo, sphereShade, cubeShade, contourCyl,
  figure8, stickPose, runPose, actionLines, bean, mitten,
  loomisFront, loomis34, profile, features,
};

/** Devuelve el SVG de un modelo para usarlo como ilustración */
export function modelSVG(key) {
  const md = MODELS[key];
  if (!md) return "";
  const [w, hgt] = md.vb;
  const paths = md.parts
    .map((p) => `<path class="p-${p.t}" d="${p.d}"/>`)
    .join("");
  const caps = md.caption
    ? `<figcaption>${md.caption.length > 1 ? `<ol class="caps">${md.caption.map((c) => `<li>${c}</li>`).join("")}</ol>` : md.caption[0]}</figcaption>`
    : "";
  return `<figure class="fig"><svg viewBox="-4 -4 ${w + 8} ${hgt + 8}" role="img" aria-label="${md.name}">${paths}</svg>${caps}</figure>`;
}

/** Dibuja un modelo en un canvas dentro de un rectángulo */
export function drawModel(ctx, key, rect, style = "copy") {
  const md = MODELS[key];
  if (!md) return;
  const [w, hgt] = md.vb;
  const s = Math.min(rect.w / w, rect.h / hgt);
  ctx.save();
  ctx.translate(rect.x + (rect.w - w * s) / 2, rect.y + (rect.h - hgt * s) / 2);
  ctx.scale(s, s);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const trace = style === "trace";
  for (const p of md.parts) {
    const path = new Path2D(p.d);
    if (p.t === "f") {
      ctx.fillStyle = trace ? "rgba(70,130,200,.45)" : "#4a4741";
      ctx.fill(path);
      continue;
    }
    ctx.setLineDash(p.t === "g" ? [6 / s, 5 / s] : []);
    ctx.lineWidth = (p.t === "m" ? 2.4 : p.t === "h" ? 1.2 : 1.4) / s;
    if (trace) ctx.strokeStyle = p.t === "m" ? "rgba(70,130,200,.55)" : "rgba(70,130,200,.38)";
    else ctx.strokeStyle = p.t === "m" ? "#4a4741" : p.t === "h" ? "#6d6960" : "rgba(60,120,190,.75)";
    ctx.stroke(path);
  }
  ctx.restore();
}
