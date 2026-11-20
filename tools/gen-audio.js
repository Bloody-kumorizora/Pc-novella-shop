#!/usr/bin/env node
/*
 * Процедурный генератор звука для новеллы (node tools/gen-audio.js).
 * Синтезирует музыку, звуки окружения, интерфейсные звуки и голосовые «бипы» в WAV,
 * затем конвертирует их ffmpeg-ом в .ogg (Vorbis) и .mp3 и удаляет промежуточные WAV.
 * Никаких сэмплов из внешних источников: всё — осцилляторы и шум. Лицензия результата — CC0.
 * Требуется: Node.js 18+ и ffmpeg в PATH (с libvorbis и libmp3lame).
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SR = 44100;
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets", "audio");

/* ── детерминированный ГПСЧ, чтобы результат воспроизводился ── */
let seed = 1234567;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const noise = () => rnd() * 2 - 1;

const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
const N = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const note = (s) => { const m = s.match(/^([A-G]#?)(-?\d)$/); return 12 * (+m[2] + 1) + N[m[1]]; };

function buf(sec) { const n = Math.ceil(sec * SR); return [new Float32Array(n), new Float32Array(n)]; }

function osc(type, ph) {
  const p = ph - Math.floor(ph);
  switch (type) {
    case "sine": return Math.sin(2 * Math.PI * p);
    case "tri": return 1 - 4 * Math.abs(p - 0.5);
    case "saw": return 2 * p - 1;
    case "square": return p < 0.5 ? 1 : -1;
  }
}

/** Нота с ADSR, панорамой, вибрато и однополюсным ФНЧ */
function tone(b, t0, dur, freq, o = {}) {
  const type = o.type || "sine", amp = o.amp ?? 0.2;
  const a = o.attack ?? 0.01, d = o.decay ?? 0.1, s = o.sustain ?? 0.6, r = o.release ?? 0.15;
  const pan = o.pan ?? 0, vib = o.vib || 0, vibF = o.vibF || 5;
  const lp = o.lp ? 1 - Math.exp(-2 * Math.PI * o.lp / SR) : 0;
  const harm = o.harm || null; // [[mult, gain], ...]
  const glide = o.glide || 0; // множитель частоты к концу ноты
  const i0 = Math.floor(t0 * SR), total = Math.floor((dur + r) * SR);
  const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
  let ph = rnd(), y = 0;
  const phs = harm ? harm.map(() => rnd()) : null;
  for (let i = 0; i < total; i++) {
    const t = i / SR;
    let env;
    if (t < a) env = t / a;
    else if (t < a + d) env = 1 - (1 - s) * ((t - a) / d);
    else if (t < dur) env = s;
    else env = s * Math.max(0, 1 - (t - dur) / r);
    if (o.expDecay) env *= Math.exp(-t * o.expDecay);
    const f = freq * (glide ? Math.pow(glide, t / (dur + r)) : 1) * (1 + vib * Math.sin(2 * Math.PI * vibF * t));
    ph += f / SR;
    let v = osc(type, ph);
    if (harm) harm.forEach(([m, g], k) => { phs[k] += f * m / SR; v += g * Math.sin(2 * Math.PI * phs[k]); });
    if (lp) { y += lp * (v - y); v = y; }
    v *= env * amp;
    const j = i0 + i;
    if (j >= 0 && j < b[0].length) { b[0][j] += v * gl; b[1][j] += v * gr; }
  }
}

/** Шумовой всплеск с полосовым фильтром (RBJ biquad) */
function noiseHit(b, t0, dur, o = {}) {
  const amp = o.amp ?? 0.2, pan = o.pan ?? 0;
  const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
  const i0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  let f = o.f || 3000, q = o.q || 0.8, fEnd = o.fEnd || f;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const fc = f * Math.pow(fEnd / f, t);
    const w = 2 * Math.PI * fc / SR, al = Math.sin(w) / (2 * q);
    const b0 = al, b2 = -al, a0 = 1 + al, a1 = -2 * Math.cos(w), a2 = 1 - al;
    const x = noise();
    const y = (b0 * x + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    let env = o.shape ? o.shape(t) : Math.exp(-t * (o.decay || 8));
    const v = y * env * amp;
    const j = i0 + i;
    if (j < b[0].length) { b[0][j] += v * gl; b[1][j] += v * gr; }
  }
}

function kick(b, t0, amp = 0.5) { tone(b, t0, 0.18, 120, { type: "sine", amp, attack: 0.002, decay: 0.15, sustain: 0, release: 0.05, glide: 0.35 }); }
function hat(b, t0, amp = 0.06, pan = 0.2) { noiseHit(b, t0, 0.06, { f: 8000, q: 0.7, amp, decay: 30, pan }); }
function snare(b, t0, amp = 0.15) { noiseHit(b, t0, 0.2, { f: 1800, q: 0.6, amp, decay: 14 }); tone(b, t0, 0.05, 190, { amp: amp * 0.5, decay: 0.05, sustain: 0, release: 0.05 }); }

/** Простой ревербератор Шрёдера (4 гребенчатых + 2 всепропускающих фильтра) */
function reverb(b, mix = 0.2, size = 1) {
  const combs = [1557, 1617, 1491, 1422].map((d) => Math.floor(d * size));
  const aps = [225, 556];
  for (let ch = 0; ch < 2; ch++) {
    const x = b[ch], n = x.length, wet = new Float32Array(n);
    combs.forEach((d, k) => {
      const dl = d + ch * 23 + k * 7, line = new Float32Array(dl); let idx = 0, filt = 0;
      for (let i = 0; i < n; i++) {
        const out = line[idx]; filt = out * 0.7 + filt * 0.3;
        line[idx] = x[i] + filt * 0.78; idx = (idx + 1) % dl; wet[i] += out * 0.25;
      }
    });
    aps.forEach((d) => {
      const line = new Float32Array(d); let idx = 0;
      for (let i = 0; i < n; i++) {
        const bufv = line[idx], v = -wet[i] + bufv; line[idx] = wet[i] + bufv * 0.5; idx = (idx + 1) % d; wet[i] = v;
      }
    });
    for (let i = 0; i < n; i++) x[i] = x[i] * (1 - mix * 0.5) + wet[i] * mix;
  }
}

/** Бесшовная петля: хвост после конца петли переносится в начало с кроссфейдом */
function makeLoop(b, loopSec, xfadeSec = 0) {
  const n = Math.floor(loopSec * SR);
  const outL = b[0].slice(0, n), outR = b[1].slice(0, n);
  const tail = b[0].length - n;
  const xf = Math.floor(xfadeSec * SR);
  for (let i = 0; i < tail && i < n; i++) {
    if (xf) {
      const g = Math.min(1, i / xf); // начало петли плавно перетекает в хвост
      outL[i] = outL[i] * g + b[0][n + i] * (1 - g);
      outR[i] = outR[i] * g + b[1][n + i] * (1 - g);
    } else { outL[i] += b[0][n + i]; outR[i] += b[1][n + i]; }
  }
  return [outL, outR];
}

function normalize(b, peak = 0.8) {
  let m = 0; for (const ch of b) for (const v of ch) m = Math.max(m, Math.abs(v));
  const k = m > 0 ? peak / m : 1; for (const ch of b) for (let i = 0; i < ch.length; i++) ch[i] *= k;
  return b;
}
function fadeEdges(b, inSec = 0.002, outSec = 0.02) {
  const n = b[0].length, fi = Math.floor(inSec * SR), fo = Math.floor(outSec * SR);
  for (const ch of b) {
    for (let i = 0; i < fi && i < n; i++) ch[i] *= i / fi;
    for (let i = 0; i < fo && i < n; i++) ch[n - 1 - i] *= i / fo;
  }
  return b;
}

function writeWav(file, b, mono = false) {
  const chs = mono ? 1 : 2, n = b[0].length;
  const data = Buffer.alloc(n * chs * 2);
  for (let i = 0; i < n; i++) for (let c = 0; c < chs; c++) {
    const v = mono ? (b[0][i] + b[1][i]) / 2 : b[c][i];
    data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), (i * chs + c) * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(chs, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * chs * 2, 28); h.writeUInt16LE(chs * 2, 32); h.writeUInt16LE(16, 34);
  h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}

function encode(rel, b, { mono = false, mp3kbps = 128, q = 4 } = {}) {
  const base = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(base), { recursive: true });
  const wav = base + ".wav";
  writeWav(wav, b, mono);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-c:a", "libvorbis", "-q:a", String(q), base + ".ogg"]);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-c:a", "libmp3lame", "-b:a", mp3kbps + "k", base + ".mp3"]);
  fs.unlinkSync(wav);
  console.log("  ✓", rel, (b[0].length / SR).toFixed(2) + "s");
}

/* ═════════════════════ МУЗЫКА ═════════════════════ */
const chord = (names) => names.split(" ").map(note);

function epiano(b, t, dur, notes, amp, pan = 0) {
  notes.forEach((m, k) => tone(b, t + k * 0.012, dur, midi(m), {
    type: "sine", amp, attack: 0.005, decay: 0.6, sustain: 0.25, release: 0.4, harm: [[2, 0.35], [3, 0.08]], expDecay: 1.2, pan: pan + (k - 1.5) * 0.15
  }));
}

function trackStreet() {
  const bpm = 84, beat = 60 / bpm, bars = 8, loop = bars * 4 * beat;
  const b = buf(loop + 3);
  const prog = ["F3 A3 C4 E4", "E3 G3 B3 D4", "D3 F3 A3 C4", "C3 E3 G3 B3"].map(chord);
  const roots = ["F2", "E2", "D2", "C2"].map(note);
  for (let bar = 0; bar < bars; bar++) {
    const t = bar * 4 * beat, ch = prog[bar % 4];
    epiano(b, t, beat * 1.4, ch, 0.07, -0.1);
    epiano(b, t + beat * 2.5, beat * 1.2, ch, 0.05, 0.1);
    tone(b, t, beat * 1.6, midi(roots[bar % 4]), { type: "sine", amp: 0.22, attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.2 });
    tone(b, t + beat * 2, beat * 1.4, midi(roots[bar % 4] + 7), { type: "sine", amp: 0.16, attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.2 });
    for (let k = 0; k < 8; k++) hat(b, t + k * beat / 2 + (k % 2 ? beat * 0.08 : 0), k % 2 ? 0.025 : 0.04);
    kick(b, t, 0.35); kick(b, t + beat * 2.5, 0.25);
    snare(b, t + beat, 0.06); snare(b, t + beat * 3, 0.06);
    // мелодия «колокольчик» во второй половине петли
    if (bar >= 4) {
      const mel = [[0, "C5"], [1, "A4"], [1.5, "G4"], [2.5, "E4"], [3, "G4"]];
      mel.forEach(([pos, n]) => tone(b, t + pos * beat, beat * 0.5, midi(note(n)), { type: "sine", amp: 0.05, attack: 0.005, decay: 0.3, sustain: 0.1, release: 0.4, harm: [[3, 0.2]], pan: 0.3 }));
    }
  }
  // винтажный «треск»
  for (let i = 0; i < 160; i++) noiseHit(b, rnd() * loop, 0.004, { f: 5000, q: 0.5, amp: 0.05 + rnd() * 0.05, decay: 50, pan: noise() * 0.5 });
  reverb(b, 0.25, 1.1);
  return normalize(makeLoop(b, loop), 0.72);
}

function trackShop() {
  const bpm = 112, beat = 60 / bpm, bars = 8, loop = bars * 4 * beat;
  const b = buf(loop + 3);
  const prog = ["C4 E4 G4 B4", "A3 C4 E4 G4", "F3 A3 C4 E4", "G3 B3 D4 F4"].map(chord);
  const roots = ["C2", "A1", "F1", "G1"].map(note);
  for (let bar = 0; bar < bars; bar++) {
    const t = bar * 4 * beat, ch = prog[bar % 4];
    // арпеджио 16-ми
    for (let k = 0; k < 16; k++) {
      const m = ch[[0, 1, 2, 3, 2, 1][k % 6]] + (k >= 8 ? 12 : 0);
      tone(b, t + k * beat / 4, beat / 4, midi(m), { type: "tri", amp: 0.06, attack: 0.002, decay: 0.12, sustain: 0.1, release: 0.08, pan: k % 2 ? 0.35 : -0.35 });
    }
    epiano(b, t, beat * 3.5, ch.map((m) => m - 12), 0.035);
    for (let k = 0; k < 8; k++) tone(b, t + k * beat / 2, beat * 0.4, midi(roots[bar % 4] + (k % 4 === 3 ? 12 : 0)), { type: "tri", amp: 0.2, attack: 0.004, decay: 0.1, sustain: 0.5, release: 0.05, lp: 900 });
    for (let k = 0; k < 4; k++) { kick(b, t + k * beat, 0.32); hat(b, t + k * beat + beat / 2, 0.05); }
    snare(b, t + beat, 0.08); snare(b, t + beat * 3, 0.08);
  }
  reverb(b, 0.18, 0.9);
  return normalize(makeLoop(b, loop), 0.7);
}

function trackTense() {
  const bpm = 96, beat = 60 / bpm, bars = 8, loop = bars * 4 * beat;
  const b = buf(loop + 3);
  const prog = ["A2 C3 E3", "F2 A2 C3", "D2 F2 A2", "E2 G#2 B2"].map(chord);
  const roots = ["A1", "F1", "D1", "E1"].map(note);
  for (let bar = 0; bar < bars; bar++) {
    const t = bar * 4 * beat, ch = prog[bar % 4];
    // пульсирующий бас восьмыми
    for (let k = 0; k < 8; k++) tone(b, t + k * beat / 2, beat * 0.35, midi(roots[bar % 4]), { type: "saw", amp: 0.16, attack: 0.003, decay: 0.12, sustain: 0.4, release: 0.05, lp: 420 });
    // струнный пэд
    ch.forEach((m, i) => tone(b, t, beat * 4, midi(m + 12), { type: "saw", amp: 0.035, attack: 0.8, decay: 0.5, sustain: 0.8, release: 0.6, lp: 1400, vib: 0.004, pan: (i - 1) * 0.4 }));
    // тиканье часов
    for (let k = 0; k < 4; k++) noiseHit(b, t + k * beat, 0.03, { f: k % 2 ? 3200 : 4200, q: 6, amp: 0.25, decay: 60, pan: k % 2 ? 0.3 : -0.3 });
    kick(b, t, 0.4);
    if (bar % 2 === 1) kick(b, t + beat * 3.5, 0.25);
  }
  reverb(b, 0.25, 1.2);
  return normalize(makeLoop(b, loop), 0.7);
}

function trackEnding() {
  const bpm = 76, beat = 60 / bpm, bars = 8, loop = bars * 4 * beat;
  const b = buf(loop + 4);
  const prog = ["F3 A3 C4", "G3 B3 D4", "E3 G3 B3", "A3 C4 E4", "F3 A3 C4", "G3 B3 D4", "C3 E3 G3", "C3 E3 G3"].map(chord);
  const roots = ["F2", "G2", "E2", "A2", "F2", "G2", "C2", "C2"].map(note);
  const melody = [
    ["A4", 0, 1], ["C5", 1, 1], ["F5", 2, 2], ["G5", 4, 1.5], ["F5", 5.5, 0.5], ["D5", 6, 2],
    ["E5", 8, 1], ["G5", 9, 1], ["B4", 10, 2], ["C5", 12, 1], ["E5", 13, 1], ["A5", 14, 2],
    ["A5", 16, 1], ["G5", 17, 1], ["F5", 18, 2], ["D5", 20, 1], ["G5", 21, 1], ["B4", 22, 2],
    ["C5", 24, 2], ["E5", 26, 1], ["G5", 27, 1], ["C6", 28, 4]
  ];
  for (let bar = 0; bar < bars; bar++) {
    const t = bar * 4 * beat;
    prog[bar].forEach((m, i) => tone(b, t, beat * 4, midi(m), { type: "tri", amp: 0.05, attack: 0.6, decay: 0.4, sustain: 0.7, release: 0.8, lp: 2000, pan: (i - 1) * 0.5 }));
    tone(b, t, beat * 3.5, midi(roots[bar]), { type: "sine", amp: 0.2, attack: 0.05, decay: 0.5, sustain: 0.6, release: 0.5 });
    for (let k = 0; k < 4; k++) hat(b, t + k * beat + beat / 2, 0.018, 0.4);
    kick(b, t, 0.22);
  }
  melody.forEach(([n, pos, len]) => tone(b, pos * beat, len * beat * 0.8, midi(note(n)), {
    type: "sine", amp: 0.09, attack: 0.004, decay: 0.5, sustain: 0.2, release: 0.6, harm: [[2, 0.25], [3.01, 0.12], [4.2, 0.05]], expDecay: 0.8, pan: 0.15
  }));
  reverb(b, 0.35, 1.3);
  return normalize(makeLoop(b, loop), 0.7);
}

/* ═════════════════════ ОКРУЖЕНИЕ ═════════════════════ */
function brownInto(b, t0, dur, amp, lpHz, pan = 0, ampFn = null) {
  const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
  const a = 1 - Math.exp(-2 * Math.PI * lpHz / SR);
  let y = 0, y2 = 0;
  const i0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n; i++) {
    y += a * (noise() - y); y2 += a * (y - y2);
    const g = ampFn ? ampFn(i / SR) : 1;
    const v = y2 * amp * g, j = i0 + i;
    if (j < b[0].length) { b[0][j] += v * gl; b[1][j] += v * gr; }
  }
}

function ambStreet() {
  const L = 14, b = buf(L + 2);
  brownInto(b, 0, L + 2, 1.6, 220, -0.2);
  brownInto(b, 0, L + 2, 1.2, 260, 0.2);
  // проезжающие машины
  [1.5, 7.2, 11.0].forEach((t, k) => {
    const pan = k % 2 ? 0.6 : -0.6;
    noiseHit(b, t, 3.2, { f: 300, fEnd: 900, q: 0.5, amp: 0.5, pan, shape: (x) => Math.sin(Math.PI * x) ** 2 });
  });
  // птицы
  for (let i = 0; i < 9; i++) {
    const t = rnd() * L, f = 3200 + rnd() * 1800, pan = noise() * 0.8;
    for (let c = 0; c < 2 + Math.floor(rnd() * 3); c++)
      tone(b, t + c * 0.11, 0.06, f, { type: "sine", amp: 0.05, attack: 0.005, decay: 0.05, sustain: 0.3, release: 0.03, glide: 1.4, pan });
  }
  return normalize(makeLoop(b, L, 1.5), 0.55);
}

function ambShop() {
  const L = 14, b = buf(L + 2);
  brownInto(b, 0, L + 2, 0.7, 500, 0);
  // «гомон» голосов: полосовой шум с медленной модуляцией
  for (let v = 0; v < 6; v++) {
    const f = 350 + rnd() * 500, rate = 2 + rnd() * 3, ph = rnd() * 6, pan = noise() * 0.7;
    noiseHit(b, 0, L + 2, { f, q: 3, amp: 0.25, pan, shape: (x) => 0.5 + 0.5 * Math.sin(ph + x * (L + 2) * rate) * Math.sin(ph * 2 + x * (L + 2) * 0.7) });
  }
  // писк сканера на кассе и мягкий звонок двери вдали
  tone(b, 4.4, 0.09, 1850, { type: "square", amp: 0.025, attack: 0.002, decay: 0.02, sustain: 0.8, release: 0.02, lp: 3000, pan: 0.5 });
  tone(b, 10.1, 0.09, 1850, { type: "square", amp: 0.025, attack: 0.002, decay: 0.02, sustain: 0.8, release: 0.02, lp: 3000, pan: -0.4 });
  return normalize(makeLoop(b, L, 1.5), 0.45);
}

function ambPc() {
  const L = 10, b = buf(L + 2);
  brownInto(b, 0, L + 2, 1.2, 380, -0.1, (t) => 1 + 0.05 * Math.sin(t * 2 * Math.PI * 0.3));
  brownInto(b, 0, L + 2, 1.0, 420, 0.1);
  tone(b, 0, L + 1.5, 120, { type: "sine", amp: 0.03, attack: 0.5, decay: 0.1, sustain: 1, release: 0.5 });
  tone(b, 0, L + 1.5, 240, { type: "sine", amp: 0.012, attack: 0.5, decay: 0.1, sustain: 1, release: 0.5 });
  return normalize(makeLoop(b, L, 1.5), 0.4);
}

/* ═════════════════════ ЭФФЕКТЫ ═════════════════════ */
const sfx = {
  click: () => { const b = buf(0.08); tone(b, 0, 0.012, 1400, { type: "square", amp: 0.3, attack: 0.001, decay: 0.01, sustain: 0, release: 0.02, lp: 4000 }); noiseHit(b, 0, 0.02, { f: 5000, amp: 0.2, decay: 40 }); return b; },
  hover: () => { const b = buf(0.08); tone(b, 0, 0.03, 980, { type: "sine", amp: 0.25, attack: 0.003, decay: 0.03, sustain: 0, release: 0.03 }); return b; },
  select: () => { const b = buf(0.25); tone(b, 0, 0.06, 660, { type: "tri", amp: 0.3, attack: 0.002, decay: 0.06, sustain: 0.2, release: 0.05 }); tone(b, 0.07, 0.1, 990, { type: "tri", amp: 0.3, attack: 0.002, decay: 0.08, sustain: 0.2, release: 0.08 }); return b; },
  cart: () => {
    const b = buf(0.6);
    tone(b, 0, 0.08, 500, { type: "sine", amp: 0.35, attack: 0.002, decay: 0.08, sustain: 0, release: 0.03, glide: 0.4 });
    [1318.5, 1975.5].forEach((f, k) => tone(b, 0.08 + k * 0.08, 0.3, f, { type: "sine", amp: 0.22, attack: 0.002, decay: 0.3, sustain: 0.05, release: 0.2, harm: [[2.76, 0.2]], expDecay: 6 }));
    return b;
  },
  cash: () => {
    const b = buf(1.3);
    for (let i = 0; i < 7; i++) noiseHit(b, i * 0.035, 0.02, { f: 2500, q: 2, amp: 0.4, decay: 50 });
    noiseHit(b, 0.27, 0.08, { f: 900, q: 1, amp: 0.4, decay: 20 });
    [2093, 2637].forEach((f, k) => tone(b, 0.32 + k * 0.14, 0.7, f, { type: "sine", amp: 0.25, attack: 0.002, decay: 0.6, sustain: 0.05, release: 0.3, harm: [[2.4, 0.25], [5.2, 0.06]], expDecay: 4 }));
    return b;
  },
  menu: () => { const b = buf(0.35); noiseHit(b, 0, 0.25, { f: 600, fEnd: 4000, q: 1.2, amp: 0.25, shape: (x) => Math.sin(Math.PI * x) }); tone(b, 0.18, 0.08, 1175, { type: "sine", amp: 0.2, decay: 0.08, sustain: 0, release: 0.08 }); return b; },
  door: () => {
    const b = buf(2.0);
    [[1318.5, 0], [1046.5, 0.22], [1318.5, 0.5]].forEach(([f, t]) => tone(b, t, 1.2, f, { type: "sine", amp: 0.25, attack: 0.002, decay: 1.0, sustain: 0.05, release: 0.4, harm: [[2.76, 0.3], [5.4, 0.1]], expDecay: 3 }));
    reverb(b, 0.3, 1); return b;
  },
  chime: () => { const b = buf(1.4); ["E5", "G5", "C6"].forEach((n, k) => tone(b, k * 0.1, 0.6, midi(note(n)), { type: "sine", amp: 0.2, attack: 0.002, decay: 0.5, sustain: 0.1, release: 0.4, harm: [[3, 0.15]], expDecay: 3 })); reverb(b, 0.3, 1); return b; },
  beep: () => { const b = buf(0.2); tone(b, 0, 0.1, 1850, { type: "square", amp: 0.15, attack: 0.002, decay: 0.02, sustain: 0.8, release: 0.02, lp: 3500 }); return b; },
  whoosh: () => { const b = buf(0.7); noiseHit(b, 0, 0.6, { f: 300, fEnd: 2600, q: 0.9, amp: 0.45, shape: (x) => Math.sin(Math.PI * x) ** 1.5 }); return b; },
  surprise: () => { const b = buf(0.6); tone(b, 0, 0.35, 320, { type: "sine", amp: 0.35, attack: 0.005, decay: 0.2, sustain: 0.6, release: 0.15, glide: 3, vib: 0.03, vibF: 18 }); return b; },
  laugh: () => {
    const b = buf(1.0);
    [0, 0.14, 0.28, 0.42].forEach((t, k) => {
      const f = 330 - k * 22;
      tone(b, t, 0.08, f, { type: "tri", amp: 0.3, attack: 0.008, decay: 0.06, sustain: 0.4, release: 0.04, harm: [[2, 0.4], [3, 0.2]], lp: 2200 });
      noiseHit(b, t, 0.1, { f: 1200, q: 1.5, amp: 0.12, decay: 18 });
    });
    return b;
  },
  sigh: () => { const b = buf(1.3); noiseHit(b, 0, 1.2, { f: 1400, fEnd: 450, q: 0.9, amp: 0.5, shape: (x) => Math.sin(Math.PI * Math.min(1, x * 1.3)) * (1 - x * 0.4) }); return b; }
};

/* голосовые «бипы»: у каждого персонажа своя высота тона и тембр */
const voices = {
  voice_lesha: { f: 300, type: "square", lp: 1800 },
  voice_vika: { f: 520, type: "tri", lp: 3200 },
  voice_senya: { f: 230, type: "saw", lp: 1400 }
};

/* ═════════════════════ СБОРКА ═════════════════════ */
console.log("Музыка:");
encode("music/street", trackStreet());
encode("music/shop", trackShop());
encode("music/tense", trackTense());
encode("music/ending", trackEnding());
console.log("Окружение:");
encode("sfx/amb_street", ambStreet(), { mp3kbps: 96, q: 3 });
encode("sfx/amb_shop", ambShop(), { mp3kbps: 96, q: 3 });
encode("sfx/amb_pc", ambPc(), { mp3kbps: 96, q: 3 });
console.log("Эффекты:");
for (const [k, fn] of Object.entries(sfx)) encode("sfx/" + k, fadeEdges(normalize(fn(), 0.8)), { mono: true, mp3kbps: 96, q: 4 });
for (const [k, v] of Object.entries(voices)) {
  const b = buf(0.09);
  tone(b, 0, 0.045, v.f, { type: v.type, amp: 0.4, attack: 0.003, decay: 0.03, sustain: 0.5, release: 0.03, lp: v.lp });
  encode("sfx/" + k, fadeEdges(normalize(b, 0.7)), { mono: true, mp3kbps: 96, q: 4 });
}
console.log("Готово:", OUT);
