#!/usr/bin/env node
/*
 * Генератор SVG-графики для новеллы (запускать один раз: node tools/gen-art.js).
 * Создаёт:
 *   assets/characters/<id>/body.svg          — тело без лица (общая база для всех эмоций)
 *   assets/characters/<id>/<emotion>.svg     — слой лица: брови, глаза, закрытый рот (6 эмоций)
 *   assets/characters/<id>/blink.svg         — слой моргания (закрытые глаза)
 *   assets/characters/<id>/mouth1.svg, mouth2.svg — кадры открытого рта для «речи»
 *   assets/bg/*.svg, assets/ui/*.svg
 * Все слои персонажа имеют один viewBox 0 0 400 760 — их можно класть друг на друга.
 * Вся графика нарисована с нуля в этом скрипте; лицензия — CC0.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const out = (rel, svg) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, svg.trim() + "\n", "utf8");
};

const INK = "#2b2238";
const VB = 'viewBox="0 0 400 760"';
const svgWrap = (inner, vb = VB) =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${vb}>${inner}</svg>`;

/* ═════════════════════ ПЕРСОНАЖИ ═════════════════════ */

const HEAD =
  "M118 200 C118 138 158 108 200 108 C242 108 282 138 282 200 C282 240 270 264 250 283 C232 299 216 307 200 307 C184 307 168 299 150 283 C130 264 118 240 118 200 Z";
const EYE_L = 168, EYE_R = 232, EYE_Y = 226, MOUTH_Y = 272;

const chars = {
  lesha: {
    skin: "#f6d3bd", skinShade: "#e7b49b", eye: "#4a78c9", hair: "#4a3328", hairHi: "#6b4a3a",
    body: (c) => `
      <!-- капюшон за шеей -->
      <path d="M128 330 C140 300 170 296 200 300 C230 296 260 300 272 330 C250 350 150 350 128 330 Z" fill="#355fc0" stroke="${INK}" stroke-width="3"/>
      <!-- толстовка -->
      <path d="M62 760 L72 430 C76 372 108 346 160 334 L200 350 L240 334 C292 346 324 372 328 430 L338 760 Z" fill="#3f6fd8" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M72 430 C76 372 108 346 160 334 L150 360 C118 372 98 400 96 450 L92 760 L62 760 Z" fill="#355fc0"/>
      <path d="M118 470 L112 760 M282 470 L288 760" stroke="${INK}" stroke-width="2.5" opacity=".55" fill="none"/>
      <!-- карман -->
      <path d="M140 610 L260 610 L276 700 L124 700 Z" fill="#3866cc" stroke="${INK}" stroke-width="2.5"/>
      <!-- шнурки -->
      <path d="M182 352 C178 400 182 430 176 460" stroke="#f0f0f5" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M218 352 C222 400 218 430 224 460" stroke="#f0f0f5" stroke-width="5" fill="none" stroke-linecap="round"/>
      <circle cx="176" cy="464" r="5" fill="#d8d8e4"/><circle cx="224" cy="464" r="5" fill="#d8d8e4"/>
      <!-- принт -->
      <rect x="180" y="500" width="40" height="40" rx="6" fill="none" stroke="#9fc0ff" stroke-width="4"/>
      <path d="M190 520 h20 M200 510 v20" stroke="#9fc0ff" stroke-width="4"/>`,
    hairBack: (c) => `
      <path d="M112 210 C100 150 130 92 200 88 C270 92 302 150 288 214 L282 180 C270 130 240 112 200 112 C160 112 130 130 118 180 Z" fill="${c.hair}" stroke="${INK}" stroke-width="3"/>`,
    hairFront: (c) => `
      <path d="M116 196 C108 120 160 84 206 86 C262 88 298 128 286 198 L270 160 L262 186 L244 148 L232 178 L214 140 L200 176 L184 142 L170 180 L156 150 L144 186 L132 160 Z" fill="${c.hair}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M160 104 C186 92 226 92 250 108" stroke="${c.hairHi}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M196 86 L208 64 L216 90" fill="${c.hair}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    extras: () => ""
  },

  vika: {
    skin: "#fbe0cf", skinShade: "#eec0a6", eye: "#2f9e72", hair: "#a8452f", hairHi: "#cf6a4c",
    body: (c) => `
      <!-- рубашка -->
      <path d="M66 760 L76 430 C80 372 112 346 162 334 L200 352 L238 334 C288 346 320 372 324 430 L334 760 Z" fill="#f4f2fa" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <!-- жилет -->
      <path d="M84 760 L92 440 C96 392 118 366 156 352 L200 470 L244 352 C282 366 304 392 308 440 L316 760 Z" fill="#e5533d" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M92 440 C96 392 118 366 156 352 L170 390 C140 400 120 420 116 470 L112 760 L84 760 Z" fill="#c9432f"/>
      <!-- воротник -->
      <path d="M162 334 L200 352 L186 380 Z M238 334 L200 352 L214 380 Z" fill="#ffffff" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <!-- бейдж -->
      <rect x="226" y="500" width="64" height="34" rx="5" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <rect x="232" y="506" width="12" height="12" fill="#ffb03a"/><rect x="236" y="510" width="4" height="4" fill="#e5533d"/>
      <text x="248" y="521" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="${INK}">ВИКА</text>
      <path d="M232 526 h50" stroke="#c9c3e6" stroke-width="2"/>
      <!-- пуговицы -->
      <circle cx="200" cy="560" r="5" fill="#fff" stroke="${INK}" stroke-width="2"/>
      <circle cx="200" cy="620" r="5" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
    hairBack: (c) => `
      <!-- хвост -->
      <path d="M262 150 C330 120 350 210 330 300 C318 360 300 400 296 450 C280 400 296 330 290 270 C286 220 276 190 262 150 Z" fill="${c.hair}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M110 220 C96 150 128 90 200 86 C272 90 304 150 290 222 L284 300 L270 220 L130 220 L116 300 Z" fill="${c.hair}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
    hairFront: (c) => `
      <path d="M116 214 C104 132 150 86 204 86 C262 88 300 130 286 214 C278 180 266 160 250 148 C236 176 206 192 166 196 C186 180 196 164 200 146 C178 170 150 186 122 214 Z" fill="${c.hair}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M150 112 C176 96 224 94 252 112" stroke="${c.hairHi}" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- резинка -->
      <rect x="262" y="138" width="18" height="22" rx="5" fill="#ffb03a" stroke="${INK}" stroke-width="2.5" transform="rotate(-25 271 149)"/>
      <!-- прядь у щеки -->
      <path d="M122 214 C116 250 120 280 132 300 C126 268 128 240 134 214 Z" fill="${c.hair}" stroke="${INK}" stroke-width="2.5"/>`,
    extras: () => ""
  },

  senya: {
    skin: "#d9a07a", skinShade: "#c08460", eye: "#6b4426", hair: "#1f1a24", hairHi: "#3b3344",
    body: (c) => `
      <!-- рубашка нараспашку -->
      <path d="M60 760 L70 430 C74 372 106 346 158 334 L200 350 L242 334 C294 346 326 372 330 430 L340 760 Z" fill="#3a3f5c" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M80 440 L320 440 M76 520 L324 520 M72 600 L328 600 M70 680 L330 680" stroke="#ffb03a" stroke-width="3" opacity=".45"/>
      <path d="M110 380 L108 760 M150 350 L148 760 M250 350 L252 760 M290 380 L292 760" stroke="#ffb03a" stroke-width="3" opacity=".35"/>
      <!-- футболка -->
      <path d="M150 346 L200 362 L250 346 L262 760 L138 760 Z" fill="#2f9e72" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <!-- пиксельное сердце -->
      <g fill="#ffe36a" transform="translate(176 470)">
        <rect x="6" y="0" width="12" height="6"/><rect x="30" y="0" width="12" height="6"/>
        <rect x="0" y="6" width="48" height="12"/><rect x="6" y="18" width="36" height="6"/>
        <rect x="12" y="24" width="24" height="6"/><rect x="18" y="30" width="12" height="6"/>
      </g>
      <!-- наушники на шее -->
      <path d="M140 330 C150 372 250 372 260 330" stroke="#1d1d28" stroke-width="10" fill="none" stroke-linecap="round"/>
      <rect x="120" y="318" width="34" height="46" rx="12" fill="#26263a" stroke="${INK}" stroke-width="3"/>
      <rect x="246" y="318" width="34" height="46" rx="12" fill="#26263a" stroke="${INK}" stroke-width="3"/>
      <rect x="128" y="328" width="18" height="26" rx="6" fill="#3ccf91"/>
      <rect x="254" y="328" width="18" height="26" rx="6" fill="#3ccf91"/>`,
    hairBack: (c) => `
      <path d="M114 214 C106 160 130 110 200 106 C270 110 294 160 286 214 L280 186 L120 186 Z" fill="${c.hair}" stroke="${INK}" stroke-width="3"/>`,
    hairFront: (c) => `
      <!-- кепка задом наперёд -->
      <path d="M112 182 C108 112 154 84 200 84 C246 84 292 112 288 182 C254 166 146 166 112 182 Z" fill="#2f9e72" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M200 84 L200 168" stroke="${INK}" stroke-width="2" opacity=".5"/>
      <path d="M150 96 C160 120 160 150 156 170 M250 96 C240 120 240 150 244 170" stroke="${INK}" stroke-width="2" opacity=".35" fill="none"/>
      <!-- застёжка снепбэка над лбом -->
      <path d="M172 176 C176 160 224 160 228 176 Z" fill="${c.hair}" stroke="${INK}" stroke-width="2.5"/>
      <path d="M176 178 L224 178" stroke="#f0f0f5" stroke-width="4"/>
      <circle cx="200" cy="90" r="6" fill="#26845f" stroke="${INK}" stroke-width="2"/>
      <!-- пряди из-под кепки -->
      <path d="M114 182 L120 214 L128 190 L134 210 L140 184 Z M286 182 L280 214 L272 190 L266 210 L260 184 Z" fill="${c.hair}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M180 178 L186 196 L194 180 L202 198 L210 180 L218 194 L222 178 Z" fill="${c.hair}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`,
    extras: () => ""
  }
};

function bodySvg(id) {
  const c = chars[id];
  return svgWrap(`
    ${c.hairBack(c)}
    ${c.body(c)}
    <!-- шея -->
    <path d="M176 282 L224 282 L228 342 C214 356 186 356 172 342 Z" fill="${c.skin}" stroke="${INK}" stroke-width="3"/>
    <path d="M176 290 C190 312 210 312 224 290 L224 312 C210 326 190 326 176 312 Z" fill="${c.skinShade}"/>
    <!-- уши -->
    <ellipse cx="120" cy="228" rx="12" ry="20" fill="${c.skin}" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="280" cy="228" rx="12" ry="20" fill="${c.skin}" stroke="${INK}" stroke-width="3"/>
    <!-- голова -->
    <path d="${HEAD}" fill="${c.skin}" stroke="${INK}" stroke-width="3.5"/>
    <path d="M128 240 C134 266 148 284 166 296 C150 290 132 270 126 246 Z" fill="${c.skinShade}" opacity=".6"/>
    <!-- нос (постоянный) -->
    <path d="M200 246 L196 254 L202 255" stroke="${c.skinShade}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${c.hairFront(c)}
    ${c.extras(c)}
  `);
}

/* ── Глаза ── */
function eye(cx, c, o = {}) {
  const w = o.w || 23, h = o.h || 27, dx = o.look || 0;
  const top = EYE_Y - h, bot = EYE_Y + h * 0.75;
  const irisR = o.iris || 13;
  const lid = o.lid || 0; // 0..1 опущенное верхнее веко
  const lower = o.lower || 0; // приподнятое нижнее веко (улыбка)
  const id = `clip${Math.round(cx)}${Math.round(Math.random() * 1e6)}`;
  const lidY = top + (bot - top) * lid;
  const lowY = bot - (bot - top) * lower;
  return `
    <clipPath id="${id}"><path d="M${cx - w} ${EYE_Y} C${cx - w} ${top} ${cx + w} ${top} ${cx + w} ${EYE_Y} C${cx + w} ${bot} ${cx - w} ${bot} ${cx - w} ${EYE_Y} Z"/></clipPath>
    <g clip-path="url(#${id})">
      <rect x="${cx - w - 2}" y="${top - 2}" width="${w * 2 + 4}" height="${bot - top + 4}" fill="#ffffff"/>
      <circle cx="${cx + dx}" cy="${EYE_Y + 2}" r="${irisR}" fill="${c.eye}"/>
      <circle cx="${cx + dx}" cy="${EYE_Y + 7}" r="${irisR * 0.62}" fill="${shade(c.eye, -0.35)}"/>
      <circle cx="${cx + dx}" cy="${EYE_Y + 3}" r="${o.pupil || 5.5}" fill="#1b1424"/>
      <circle cx="${cx + dx - 5}" cy="${EYE_Y - 4}" r="4.2" fill="#fff"/>
      <circle cx="${cx + dx + 5}" cy="${EYE_Y + 8}" r="2" fill="#fff" opacity=".85"/>
      ${lid > 0 ? `<rect x="${cx - w - 2}" y="${top - 4}" width="${w * 2 + 4}" height="${lidY - top + 4}" fill="${c.skin}"/>` : ""}
      ${lower > 0 ? `<rect x="${cx - w - 2}" y="${lowY}" width="${w * 2 + 4}" height="${bot - lowY + 4}" fill="${c.skin}"/>` : ""}
    </g>
    <!-- верхнее веко/ресницы -->
    <path d="M${cx - w - 3} ${lid > 0 ? lidY + 3 : EYE_Y - 2} C${cx - w + 2} ${lid > 0 ? lidY - 2 : top - 1} ${cx + w - 2} ${lid > 0 ? lidY - 2 : top - 1} ${cx + w + 3} ${lid > 0 ? lidY + 3 : EYE_Y - 4}"
      stroke="${INK}" stroke-width="5.5" fill="none" stroke-linecap="round"/>
    ${lower > 0
      ? `<path d="M${cx - w + 2} ${lowY + 2} C${cx - 8} ${lowY - 5} ${cx + 8} ${lowY - 5} ${cx + w - 2} ${lowY + 2}" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
      : `<path d="M${cx - w + 6} ${bot - 1} C${cx - 6} ${bot + 3} ${cx + 6} ${bot + 3} ${cx + w - 6} ${bot - 1}" stroke="${INK}" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`}`;
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return "#" + [f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, "0")).join("");
}

const brow = (x1, y1, x2, y2, curve = -6, w = 6) =>
  `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + curve} ${x2} ${y2}" stroke="${INK}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;

const blush = (c, strong) => `
  <g opacity="${strong ? 0.75 : 0.4}">
    <ellipse cx="148" cy="258" rx="17" ry="9" fill="#ff7a8a"/>
    <ellipse cx="252" cy="258" rx="17" ry="9" fill="#ff7a8a"/>
    ${strong ? `<path d="M138 256 l6 -6 M148 258 l6 -6 M158 256 l6 -6 M242 256 l6 -6 M252 258 l6 -6 M262 256 l6 -6" stroke="#e0485d" stroke-width="2" stroke-linecap="round"/>` : ""}
  </g>`;

const emotions = {
  neutral: (c) => `
    ${brow(148, 192, 186, 190, -5)} ${brow(214, 190, 252, 192, -5)}
    ${eye(EYE_L, c)} ${eye(EYE_R, c)}
    <path d="M188 ${MOUTH_Y} Q200 ${MOUTH_Y + 4} 212 ${MOUTH_Y}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  happy: (c) => `
    ${brow(146, 186, 186, 182, -9)} ${brow(214, 182, 254, 186, -9)}
    ${eye(EYE_L, c, { lower: 0.32 })} ${eye(EYE_R, c, { lower: 0.32 })}
    ${blush(c, false)}
    <path d="M182 ${MOUTH_Y - 4} Q200 ${MOUTH_Y + 14} 218 ${MOUTH_Y - 4}" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  surprised: (c) => `
    ${brow(148, 176, 186, 170, -8)} ${brow(214, 170, 252, 176, -8)}
    ${eye(EYE_L, c, { w: 25, h: 31, iris: 11, pupil: 3.5 })} ${eye(EYE_R, c, { w: 25, h: 31, iris: 11, pupil: 3.5 })}
    <ellipse cx="200" cy="${MOUTH_Y + 2}" rx="8" ry="10" fill="#7a2a3a" stroke="${INK}" stroke-width="3.5"/>`,
  thinking: (c) => `
    ${brow(148, 184, 186, 180, -8)} ${brow(214, 194, 252, 190, 2)}
    ${eye(EYE_L, c, { look: 7, lid: 0.18 })} ${eye(EYE_R, c, { look: 7, lid: 0.28 })}
    <path d="M190 ${MOUTH_Y + 2} Q202 ${MOUTH_Y} 214 ${MOUTH_Y - 4}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  sad: (c) => `
    ${brow(150, 194, 186, 182, 3)} ${brow(214, 182, 250, 194, 3)}
    ${eye(EYE_L, c, { lid: 0.32, look: -1 })} ${eye(EYE_R, c, { lid: 0.32, look: 1 })}
    <path d="M186 ${MOUTH_Y + 6} Q200 ${MOUTH_Y - 6} 214 ${MOUTH_Y + 6}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  embarrassed: (c) => `
    ${brow(148, 190, 186, 184, 2)} ${brow(214, 184, 252, 190, 2)}
    ${eye(EYE_L, c, { look: -7, lower: 0.18 })} ${eye(EYE_R, c, { look: -7, lower: 0.18 })}
    ${blush(c, true)}
    <path d="M186 ${MOUTH_Y + 2} q5 -5 9 0 q5 5 9 0 q5 -5 9 0" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M270 168 C262 182 262 192 270 194 C278 192 278 182 270 168 Z" fill="#9fd8ff" stroke="${INK}" stroke-width="2.5"/>`
};

const blinkSvg = (c) => svgWrap(`
  <ellipse cx="${EYE_L}" cy="${EYE_Y + 2}" rx="29" ry="34" fill="${c.skin}"/>
  <ellipse cx="${EYE_R}" cy="${EYE_Y + 2}" rx="29" ry="34" fill="${c.skin}"/>
  <path d="M${EYE_L - 24} ${EYE_Y + 4} Q${EYE_L} ${EYE_Y + 16} ${EYE_L + 24} ${EYE_Y + 4}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M${EYE_R - 24} ${EYE_Y + 4} Q${EYE_R} ${EYE_Y + 16} ${EYE_R + 24} ${EYE_Y + 4}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M${EYE_L - 24} ${EYE_Y + 4} l-6 -4 M${EYE_R + 24} ${EYE_Y + 4} l6 -4" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`);

const mouthSvg = (c, open) => svgWrap(`
  <ellipse cx="200" cy="${MOUTH_Y + 2}" rx="30" ry="16" fill="${c.skin}"/>
  <path d="M${200 - (open ? 13 : 11)} ${MOUTH_Y - 2} Q200 ${MOUTH_Y - 6} ${200 + (open ? 13 : 11)} ${MOUTH_Y - 2} Q${200 + (open ? 11 : 9)} ${MOUTH_Y + (open ? 16 : 8)} 200 ${MOUTH_Y + (open ? 17 : 9)} Q${200 - (open ? 11 : 9)} ${MOUTH_Y + (open ? 16 : 8)} ${200 - (open ? 13 : 11)} ${MOUTH_Y - 2} Z"
    fill="#7a2a3a" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  ${open ? `<ellipse cx="200" cy="${MOUTH_Y + 10}" rx="7" ry="4" fill="#ff8a9a"/>` : ""}`);

for (const id of Object.keys(chars)) {
  const c = chars[id];
  out(`assets/characters/${id}/body.svg`, bodySvg(id));
  for (const [emo, fn] of Object.entries(emotions)) out(`assets/characters/${id}/${emo}.svg`, svgWrap(fn(c)));
  out(`assets/characters/${id}/blink.svg`, blinkSvg(c));
  out(`assets/characters/${id}/mouth1.svg`, mouthSvg(c, false));
  out(`assets/characters/${id}/mouth2.svg`, mouthSvg(c, true));
}

/* ═════════════════════ ФОНЫ 1920×1080 ═════════════════════ */
const BGVB = 'viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"';
const bg = (inner) => svgWrap(inner, BGVB);

function windowsGrid(x, y, cols, rows, w, h, gap, colors) {
  let s = "";
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const col = colors[(r * 7 + c * 3) % colors.length];
      s += `<rect x="${x + c * (w + gap)}" y="${y + r * (h + gap)}" width="${w}" height="${h}" rx="3" fill="${col}"/>`;
    }
  return s;
}

out("assets/bg/street.svg", bg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec8ff"/><stop offset="1" stop-color="#d9f0ff"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2c3b66"/><stop offset="1" stop-color="#1a2240"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <g fill="#ffffff" opacity=".9">
    <ellipse cx="300" cy="140" rx="110" ry="34"/><ellipse cx="370" cy="120" rx="80" ry="40"/>
    <ellipse cx="1500" cy="110" rx="130" ry="36"/><ellipse cx="1590" cy="94" rx="80" ry="38"/>
  </g>
  <!-- дальние дома -->
  <rect x="0" y="300" width="380" height="520" fill="#b9c4e0"/>
  <rect x="1560" y="260" width="360" height="560" fill="#b4bedb"/>
  ${windowsGrid(30, 340, 5, 6, 46, 54, 22, ["#d7def0", "#e9eefb", "#c9d3ec"])}
  ${windowsGrid(1590, 300, 4, 7, 56, 52, 24, ["#d7def0", "#e9eefb", "#c9d3ec"])}
  <!-- здание магазина -->
  <rect x="360" y="180" width="1220" height="660" fill="#f2e6d8" stroke="#2b2238" stroke-width="4"/>
  ${windowsGrid(420, 220, 8, 2, 110, 80, 30, ["#a9c6ee", "#c4d8f4"])}
  <!-- вывеска -->
  <rect x="520" y="420" width="910" height="110" rx="18" fill="#1d1630" stroke="#2b2238" stroke-width="4"/>
  <g transform="translate(560 452)">
    <rect width="46" height="46" fill="#ffb03a"/><rect x="14" y="14" width="18" height="18" fill="#e5533d"/>
  </g>
  <text x="635" y="498" font-family="Arial Black, Arial, sans-serif" font-size="64" font-weight="900" fill="#ff7ad9" letter-spacing="8">ПИКСЕЛЬ</text>
  <text x="1120" y="494" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#7ee0ff">компьютеры · сборка</text>
  <!-- витрины -->
  <rect x="420" y="570" width="440" height="270" fill="url(#glass)" stroke="#2b2238" stroke-width="4"/>
  <rect x="1080" y="570" width="440" height="270" fill="url(#glass)" stroke="#2b2238" stroke-width="4"/>
  <g>
    <rect x="460" y="640" width="150" height="100" rx="6" fill="#0f1426" stroke="#58e0ff" stroke-width="4"/>
    <rect x="470" y="650" width="130" height="80" fill="#3a6bff" opacity=".7"/>
    <rect x="640" y="610" width="90" height="190" rx="8" fill="#141a2e" stroke="#ff7ad9" stroke-width="4"/>
    <circle cx="685" cy="660" r="22" fill="none" stroke="#ff7ad9" stroke-width="4"/><circle cx="685" cy="730" r="22" fill="none" stroke="#58e0ff" stroke-width="4"/>
    <rect x="1120" y="650" width="180" height="110" rx="6" fill="#0f1426" stroke="#ffd34d" stroke-width="4"/>
    <rect x="1130" y="660" width="160" height="90" fill="#ff9a3a" opacity=".6"/>
    <rect x="1330" y="700" width="150" height="60" rx="6" fill="#2a2440" stroke="#58e0ff" stroke-width="3"/>
    <text x="1340" y="740" font-family="Arial" font-size="26" font-weight="700" fill="#ffd34d">-10%</text>
  </g>
  <!-- дверь -->
  <rect x="880" y="570" width="180" height="270" fill="#26304f" stroke="#2b2238" stroke-width="4"/>
  <rect x="896" y="586" width="68" height="238" fill="#7fa7e8" opacity=".55"/>
  <rect x="976" y="586" width="68" height="238" fill="#7fa7e8" opacity=".55"/>
  <rect x="955" y="690" width="8" height="40" rx="3" fill="#ffd34d"/><rect x="977" y="690" width="8" height="40" rx="3" fill="#ffd34d"/>
  <text x="970" y="560" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#2b2238">ОТКРЫТО 10–22</text>
  <!-- тротуар и дорога -->
  <rect x="0" y="820" width="1920" height="260" fill="#c9c3d6"/>
  <g stroke="#b3acc4" stroke-width="4">${Array.from({ length: 13 }, (_, i) => `<path d="M${i * 160} 820 L${i * 160 - 120} 1080"/>`).join("")}</g>
  <rect x="0" y="1010" width="1920" height="70" fill="#5c5670"/>
  <g fill="#f4f0ff">${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 260 + 40}" y="1040" width="140" height="10" rx="4"/>`).join("")}</g>
  <!-- дерево и фонарь -->
  <rect x="190" y="560" width="28" height="270" fill="#7a5238"/>
  <circle cx="204" cy="520" r="110" fill="#5cbf7a" stroke="#2b2238" stroke-width="4"/>
  <circle cx="150" cy="470" r="60" fill="#6fd28c"/>
  <rect x="1720" y="420" width="16" height="410" fill="#3a3550"/>
  <path d="M1728 420 Q1728 380 1690 380 L1660 380" stroke="#3a3550" stroke-width="14" fill="none"/>
  <rect x="1630" y="370" width="60" height="26" rx="8" fill="#ffe9a0" stroke="#2b2238" stroke-width="3"/>
  <!-- скамейка -->
  <rect x="1580" y="860" width="230" height="20" rx="6" fill="#a8744d" stroke="#2b2238" stroke-width="3"/>
  <rect x="1590" y="830" width="210" height="16" rx="6" fill="#a8744d" stroke="#2b2238" stroke-width="3"/>
  <rect x="1600" y="880" width="14" height="40" fill="#3a3550"/><rect x="1776" y="880" width="14" height="40" fill="#3a3550"/>
`));

out("assets/bg/hall.svg", bg(`
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2550"/><stop offset="1" stop-color="#3d3470"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfc7e6"/><stop offset="1" stop-color="#a99fcb"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#wall)"/>
  <!-- световые полосы потолка -->
  <g fill="#fff6d8" opacity=".9">
    <rect x="200" y="40" width="420" height="16" rx="8"/><rect x="750" y="40" width="420" height="16" rx="8"/><rect x="1300" y="40" width="420" height="16" rx="8"/>
  </g>
  <!-- стена мониторов -->
  <rect x="560" y="120" width="800" height="380" rx="14" fill="#15112a" stroke="#0a0814" stroke-width="6"/>
  ${(() => {
    const cols = ["#3a6bff", "#ff7ad9", "#3ccf91", "#ffb03a", "#58e0ff", "#a06bff"];
    let s = "";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      const x = 584 + c * 192, y = 140 + r * 118;
      s += `<rect x="${x}" y="${y}" width="176" height="104" rx="6" fill="${cols[(r * 4 + c) % cols.length]}" opacity=".85"/>`;
      s += `<path d="M${x + 14} ${y + 80} L${x + 60} ${y + 40} L${x + 100} ${y + 70} L${x + 160} ${y + 24}" stroke="#fff" stroke-width="5" fill="none" opacity=".55"/>`;
    }
    return s;
  })()}
  <!-- полки с коробками слева и справа -->
  ${[0, 1].map((side) => {
    const x0 = side ? 1440 : 60;
    let s = `<rect x="${x0}" y="140" width="420" height="640" fill="#4a3f80" stroke="#1d1630" stroke-width="5"/>`;
    for (let r = 0; r < 4; r++) {
      const y = 170 + r * 150;
      s += `<rect x="${x0}" y="${y + 120}" width="420" height="12" fill="#1d1630"/>`;
      for (let b = 0; b < 4; b++) {
        const cols = ["#e5533d", "#3a6bff", "#ffb03a", "#3ccf91", "#ff7ad9", "#f4f2fa"];
        const col = cols[(r + b * 2 + side) % cols.length];
        const h = 70 + ((r * 3 + b * 5) % 4) * 12;
        s += `<rect x="${x0 + 20 + b * 100}" y="${y + 120 - h}" width="84" height="${h}" rx="4" fill="${col}" stroke="#1d1630" stroke-width="3"/>`;
        s += `<rect x="${x0 + 30 + b * 100}" y="${y + 130 - h}" width="40" height="8" fill="#fff" opacity=".6"/>`;
      }
    }
    return s;
  }).join("")}
  <!-- баннер -->
  <rect x="760" y="530" width="400" height="80" rx="12" fill="#ff7ad9"/>
  <text x="960" y="584" text-anchor="middle" font-family="Arial Black, Arial" font-size="38" font-weight="900" fill="#1d1630">СБОРКА ПК 0 ₽</text>
  <!-- пол -->
  <path d="M0 780 L1920 780 L1920 1080 L0 1080 Z" fill="url(#floor)"/>
  <g stroke="#9c92c2" stroke-width="3" opacity=".8">
    ${Array.from({ length: 15 }, (_, i) => `<path d="M${960 + (i - 7) * 90} 780 L${960 + (i - 7) * 330} 1080"/>`).join("")}
    <path d="M0 850 L1920 850"/><path d="M0 950 L1920 950"/>
  </g>
`));

out("assets/bg/stand.svg", bg(`
  <defs>
    <linearGradient id="sw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1a3a"/><stop offset="1" stop-color="#352c63"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sw)"/>
  <!-- стеклянные полки -->
  ${[0, 1, 2].map((r) => `<rect x="80" y="${200 + r * 220}" width="1760" height="14" rx="6" fill="#9fd8ff" opacity=".55"/>`).join("")}
  <!-- коробки видеокарт -->
  ${(() => {
    let s = "";
    const cols = ["#121826", "#2a2440", "#3a1f2e", "#1d2c3a"];
    const acc = ["#3ccf91", "#ff7ad9", "#58e0ff", "#ffb03a"];
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) {
      if (r === 1 && i >= 3 && i <= 5) continue;
      const x = 110 + i * 192, y = 200 + r * 220 - 130;
      s += `<rect x="${x}" y="${y}" width="170" height="126" rx="6" fill="${cols[(i + r) % 4]}" stroke="#0a0814" stroke-width="3"/>`;
      s += `<circle cx="${x + 55}" cy="${y + 66}" r="30" fill="none" stroke="${acc[(i + r) % 4]}" stroke-width="5"/>`;
      s += `<circle cx="${x + 120}" cy="${y + 66}" r="30" fill="none" stroke="${acc[(i + r) % 4]}" stroke-width="5"/>`;
      s += `<rect x="${x + 10}" y="${y + 108}" width="70" height="10" fill="${acc[(i + r) % 4]}" opacity=".8"/>`;
      s += `<rect x="${x + 110}" y="${y + 132}" width="56" height="26" rx="4" fill="#ffe36a"/>`;
    }
    return s;
  })()}
  <!-- тестовый стенд с подсветкой в центре -->
  <rect x="770" y="300" width="380" height="430" rx="20" fill="#0e0b1c" stroke="#58e0ff" stroke-width="6"/>
  <rect x="800" y="330" width="320" height="200" rx="8" fill="#1a1530"/>
  <rect x="830" y="420" width="260" height="60" rx="8" fill="#26263a" stroke="#ff7ad9" stroke-width="4"/>
  <circle cx="880" cy="450" r="20" fill="none" stroke="#ff7ad9" stroke-width="4"/>
  <circle cx="960" cy="450" r="20" fill="none" stroke="#ff7ad9" stroke-width="4"/>
  <circle cx="1040" cy="450" r="20" fill="none" stroke="#ff7ad9" stroke-width="4"/>
  <rect x="920" y="350" width="60" height="50" rx="6" fill="#3a3550" stroke="#3ccf91" stroke-width="3"/>
  <rect x="1000" y="345" width="12" height="60" fill="#ffb03a"/><rect x="1020" y="345" width="12" height="60" fill="#ffb03a"/>
  ${[0, 1, 2].map((i) => `<circle cx="960" cy="${580 + i * 50}" r="0" />`).join("")}
  <circle cx="900" cy="620" r="44" fill="none" stroke="#3ccf91" stroke-width="6"/>
  <circle cx="1020" cy="620" r="44" fill="none" stroke="#58e0ff" stroke-width="6"/>
  <!-- стойка -->
  <rect x="0" y="820" width="1920" height="260" fill="#cfc7e6"/>
  <rect x="0" y="800" width="1920" height="30" fill="#ece8f8" stroke="#2b2238" stroke-width="3"/>
  <g>
    <rect x="300" y="760" width="220" height="44" rx="6" fill="#f4f2fa" stroke="#2b2238" stroke-width="3"/>
    <text x="410" y="790" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#2b2238">ПРОЦЕССОРЫ</text>
    <rect x="1400" y="760" width="220" height="44" rx="6" fill="#f4f2fa" stroke="#2b2238" stroke-width="3"/>
    <text x="1510" y="790" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" fill="#2b2238">ВИДЕОКАРТЫ</text>
  </g>
`));

out("assets/bg/checkout.svg", bg(`
  <defs>
    <linearGradient id="cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e7d6"/><stop offset="1" stop-color="#e6d3bd"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#cw)"/>
  <!-- вывеска КАССА -->
  <rect x="760" y="70" width="400" height="100" rx="16" fill="#1d1630"/>
  <text x="960" y="138" text-anchor="middle" font-family="Arial Black, Arial" font-size="56" font-weight="900" fill="#3ccf91" letter-spacing="8">КАССА</text>
  <!-- стеллаж с аксессуарами -->
  <rect x="120" y="210" width="560" height="520" fill="#c9a882" stroke="#2b2238" stroke-width="4"/>
  <rect x="1240" y="210" width="560" height="520" fill="#c9a882" stroke="#2b2238" stroke-width="4"/>
  ${[120, 1240].map((x0) => {
    let s = "";
    for (let r = 0; r < 4; r++) {
      s += `<rect x="${x0}" y="${330 + r * 120}" width="560" height="10" fill="#8a6a4a"/>`;
      for (let i = 0; i < 6; i++) {
        const cols = ["#3a6bff", "#e5533d", "#3ccf91", "#ffb03a", "#ff7ad9", "#2b2238"];
        s += `<rect x="${x0 + 20 + i * 90}" y="${250 + r * 120}" width="70" height="80" rx="8" fill="${cols[(i + r * 2) % 6]}" stroke="#2b2238" stroke-width="3"/>`;
        s += `<circle cx="${x0 + 55 + i * 90}" cy="${282 + r * 120}" r="14" fill="#fff" opacity=".55"/>`;
      }
    }
    return s;
  }).join("")}
  <!-- кассовая стойка -->
  <path d="M260 760 L1660 760 L1720 1080 L200 1080 Z" fill="#3d3470" stroke="#2b2238" stroke-width="5"/>
  <rect x="240" y="730" width="1440" height="44" rx="10" fill="#f4f2fa" stroke="#2b2238" stroke-width="4"/>
  <rect x="300" y="820" width="1320" height="16" fill="#ff7ad9" opacity=".7"/>
  <!-- терминал -->
  <rect x="1180" y="600" width="140" height="130" rx="14" fill="#26263a" stroke="#2b2238" stroke-width="4"/>
  <rect x="1198" y="616" width="104" height="56" rx="6" fill="#3ccf91"/>
  <text x="1250" y="652" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" fill="#0b2a1e">OK</text>
  ${Array.from({ length: 6 }, (_, i) => `<rect x="${1202 + (i % 3) * 34}" y="${684 + Math.floor(i / 3) * 20}" width="26" height="14" rx="3" fill="#56567a"/>`).join("")}
  <!-- принтер чеков -->
  <rect x="560" y="640" width="170" height="90" rx="12" fill="#f4f2fa" stroke="#2b2238" stroke-width="4"/>
  <path d="M600 640 L600 560 L690 560 L690 640" fill="#ffffff" stroke="#2b2238" stroke-width="3"/>
  <path d="M612 580 h66 M612 598 h50 M612 616 h60" stroke="#c9c3e6" stroke-width="5"/>
  <!-- монитор кассира -->
  <rect x="820" y="520" width="280" height="190" rx="12" fill="#1d1630" stroke="#2b2238" stroke-width="5"/>
  <rect x="840" y="540" width="240" height="150" rx="6" fill="#58e0ff" opacity=".35"/>
  <rect x="940" y="710" width="40" height="22" fill="#2b2238"/>
`));

out("assets/bg/room.svg", bg(`
  <defs>
    <linearGradient id="rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2d5c"/><stop offset="1" stop-color="#2a2045"/></linearGradient>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a8c"/><stop offset=".6" stop-color="#ff8a6a"/><stop offset="1" stop-color="#ffcf7a"/></linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#58e0ff" stop-opacity=".45"/><stop offset="1" stop-color="#58e0ff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#rw)"/>
  <!-- окно -->
  <rect x="1240" y="120" width="540" height="420" rx="10" fill="url(#dusk)" stroke="#1a1430" stroke-width="10"/>
  <path d="M1510 120 L1510 540 M1240 330 L1780 330" stroke="#1a1430" stroke-width="10"/>
  <g fill="#2a2045">
    <rect x="1250" y="430" width="70" height="105"/><rect x="1330" y="400" width="60" height="135"/><rect x="1400" y="450" width="90" height="85"/>
    <rect x="1520" y="420" width="80" height="115"/><rect x="1610" y="380" width="70" height="155"/><rect x="1690" y="440" width="80" height="95"/>
  </g>
  <g fill="#ffe36a">${Array.from({ length: 16 }, (_, i) => `<rect x="${1262 + (i * 37) % 500}" y="${410 + ((i * 53) % 110)}" width="8" height="10"/>`).join("")}</g>
  <!-- постер -->
  <rect x="160" y="140" width="260" height="340" rx="8" fill="#ff7ad9" stroke="#1a1430" stroke-width="6"/>
  <g transform="translate(230 220)" fill="#1d1630">
    <rect x="0" y="40" width="120" height="20"/><rect x="20" y="20" width="80" height="20"/><rect x="40" y="0" width="40" height="20"/>
    <rect x="0" y="100" width="120" height="16"/><rect x="30" y="130" width="60" height="14"/>
  </g>
  <!-- свечение монитора -->
  <ellipse cx="760" cy="520" rx="520" ry="300" fill="url(#glow)"/>
  <!-- стол -->
  <rect x="200" y="700" width="1200" height="34" rx="6" fill="#8a6a4a" stroke="#1a1430" stroke-width="5"/>
  <rect x="240" y="734" width="30" height="346" fill="#6e5238"/><rect x="1330" y="734" width="30" height="346" fill="#6e5238"/>
  <!-- монитор -->
  <rect x="470" y="380" width="580" height="320" rx="14" fill="#0e0b1c" stroke="#1a1430" stroke-width="6"/>
  <rect x="490" y="400" width="540" height="270" rx="6" fill="#2a3a8c"/>
  <path d="M490 600 L620 520 L720 580 L860 470 L1030 560 L1030 670 L490 670 Z" fill="#3ccf91" opacity=".7"/>
  <circle cx="900" cy="460" r="34" fill="#ffe36a" opacity=".9"/>
  <rect x="730" y="700" width="60" height="0"/>
  <rect x="740" y="690" width="40" height="14" fill="#1a1430"/>
  <!-- клавиатура и мышь -->
  <rect x="560" y="660" width="0" height="0"/>
  <rect x="570" y="676" width="340" height="22" rx="6" fill="#26263a" stroke="#ff7ad9" stroke-width="2"/>
  <ellipse cx="980" cy="688" rx="20" ry="12" fill="#26263a" stroke="#58e0ff" stroke-width="2"/>
  <!-- системный блок с подсветкой -->
  <rect x="1120" y="420" width="220" height="280" rx="14" fill="#141024" stroke="#1a1430" stroke-width="6"/>
  <rect x="1140" y="440" width="140" height="240" rx="8" fill="#1f1838" stroke="#58e0ff" stroke-width="3"/>
  <circle cx="1210" cy="500" r="32" fill="none" stroke="#ff7ad9" stroke-width="5"/>
  <circle cx="1210" cy="600" r="32" fill="none" stroke="#58e0ff" stroke-width="5"/>
  <rect x="1300" y="450" width="20" height="8" rx="3" fill="#3ccf91"/>
  <!-- лампа -->
  <path d="M300 700 L320 560 L280 520" stroke="#ffd34d" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M240 520 L320 520 L300 470 L260 470 Z" fill="#ffd34d" stroke="#1a1430" stroke-width="4"/>
  <!-- кровать -->
  <rect x="1460" y="780" width="460" height="300" rx="20" fill="#5a4a8c" stroke="#1a1430" stroke-width="5"/>
  <rect x="1500" y="740" width="200" height="80" rx="30" fill="#f4f2fa" stroke="#1a1430" stroke-width="4"/>
  <rect x="0" y="1000" width="1920" height="80" fill="#1f1838" opacity=".6"/>
`));

/* ═════════════════════ ИКОНКИ UI ═════════════════════ */
const icon = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const icons = {
  cpu: `<rect x="16" y="16" width="32" height="32" rx="4"/><rect x="24" y="24" width="16" height="16" rx="2"/><path d="M24 8v8M32 8v8M40 8v8M24 48v8M32 48v8M40 48v8M8 24h8M8 32h8M8 40h8M48 24h8M48 32h8M48 40h8"/>`,
  cooler: `<rect x="10" y="10" width="44" height="44" rx="8"/><circle cx="32" cy="32" r="4"/><path d="M32 28c0-8 6-12 12-10M36 32c8 0 12 6 10 12M32 36c0 8-6 12-12 10M28 32c-8 0-12-6-10-12"/>`,
  motherboard: `<rect x="8" y="8" width="48" height="48" rx="4"/><rect x="16" y="16" width="16" height="16" rx="2"/><path d="M40 16v16M46 16v16M16 42h32M16 48h24"/>`,
  ram: `<rect x="6" y="18" width="52" height="22" rx="3"/><path d="M14 24v10M24 24v10M34 24v10M44 24v10M10 40v8M18 40v8M26 40v8M38 40v8M46 40v8M54 40v8"/>`,
  gpu: `<rect x="6" y="16" width="52" height="30" rx="4"/><circle cx="22" cy="31" r="8"/><circle cx="42" cy="31" r="8"/><path d="M10 46v6h20v-6"/>`,
  ssd: `<rect x="6" y="22" width="52" height="20" rx="3"/><rect x="12" y="27" width="12" height="10" rx="1"/><rect x="28" y="27" width="10" height="10" rx="1"/><circle cx="50" cy="32" r="2"/>`,
  psu: `<rect x="8" y="12" width="48" height="40" rx="4"/><circle cx="28" cy="32" r="12"/><path d="M28 24v16M20 32h16"/><path d="M46 20h4M46 26h4"/>`,
  case: `<rect x="16" y="6" width="32" height="52" rx="4"/><circle cx="32" cy="24" r="7"/><circle cx="32" cy="42" r="7"/><path d="M22 12h20"/>`,
  laptop: `<rect x="12" y="12" width="40" height="28" rx="3"/><path d="M4 48h56l-4 6H8z"/>`,
  sound: `<path d="M10 24h10l12-10v36L20 40H10z"/><path d="M42 22c4 4 4 16 0 20M48 16c8 8 8 24 0 32"/>`,
  mute: `<path d="M10 24h10l12-10v36L20 40H10z"/><path d="M42 24l14 16M56 24L42 40"/>`,
  menu: `<path d="M12 18h40M12 32h40M12 46h40"/>`
};
for (const [k, v] of Object.entries(icons)) out(`assets/ui/${k}.svg`, icon(v));

/* логотип / favicon */
out("assets/ui/logo.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#1d1630"/><rect x="14" y="14" width="36" height="36" fill="#ffb03a"/><rect x="26" y="26" width="12" height="12" fill="#e5533d"/></svg>`);

console.log("SVG-графика сгенерирована в", path.join(ROOT, "assets"));
