/*
 * Аудио: музыка (crossfade), окружение, эффекты и голосовые «бипы».
 * Используются только HTMLAudioElement — они работают при открытии через file://
 * (Web Audio с fetch/decodeAudioData на file:// не работает).
 * Звук стартует только после первого жеста пользователя (политика автозапуска браузеров).
 */
(function () {
  "use strict";

  const probe = document.createElement("audio");
  const EXT = probe.canPlayType('audio/ogg; codecs="vorbis"') ? "ogg" : "mp3";
  const BASE = "assets/audio/";
  const FADE_MS = 1500;
  const AMB_GAIN = 0.45; // окружение тише эффектов

  const MUSIC = { street: "music/street", shop: "music/shop", tense: "music/tense", ending: "music/ending" };
  const AMB = { street: "sfx/amb_street", shop: "sfx/amb_shop", pc: "sfx/amb_pc" };
  const SFX = ["click", "hover", "select", "cart", "cash", "menu", "door", "chime", "beep", "whoosh", "surprise", "laugh", "sigh"];
  const VOICE = { lesha: "sfx/voice_lesha", vika: "sfx/voice_vika", senya: "sfx/voice_senya" };

  const state = {
    unlocked: false,
    vol: { music: 0.6, sfx: 0.8, voice: 0.5 },
    muted: false,
    music: null, musicName: null,
    amb: null, ambName: null,
    pools: {},
    errors: new Set(),
    lastVoice: 0
  };

  const src = (rel) => BASE + rel + "." + EXT;

  function makeEl(rel, loop) {
    const el = new Audio();
    el.preload = "auto";
    el.loop = !!loop;
    el.src = src(rel);
    el.addEventListener("error", () => {
      if (!state.errors.has(rel)) {
        state.errors.add(rel);
        console.warn("[audio] не удалось загрузить", src(rel));
      }
    });
    return el;
  }

  const effective = (ch) => (state.muted ? 0 : state.vol[ch]);

  function safePlay(el) {
    const p = el.play();
    if (p && p.catch) p.catch(() => { /* автозапуск заблокирован — запустится после жеста */ });
  }

  /* плавное изменение громкости элемента */
  function fadeTo(el, target, ms, done) {
    if (!el) return;
    el._fadeId = (el._fadeId || 0) + 1;
    const id = el._fadeId, from = el.volume, t0 = performance.now();
    const step = (now) => {
      if (el._fadeId !== id) return;
      const k = Math.min(1, (now - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k < 1) requestAnimationFrame(step);
      else if (done) done();
    };
    requestAnimationFrame(step);
  }

  /* общий переход для музыки и окружения */
  function swapLoop(kind, name, table, gainFn) {
    const curKey = kind, nameKey = kind + "Name";
    if (state[nameKey] === name) return;
    state[nameKey] = name;
    if (!state.unlocked) return; // запустится в unlock()
    const old = state[curKey];
    if (old) fadeTo(old, 0, FADE_MS, () => { old.pause(); old.removeAttribute("src"); old.load(); });
    if (!name || !table[name]) { state[curKey] = null; return; }
    const el = makeEl(table[name], true);
    el.volume = 0;
    el.muted = state.muted; // на iOS volume только для чтения — «Без звука» работает через muted
    state[curKey] = el;
    safePlay(el);
    fadeTo(el, gainFn(), FADE_MS);
  }

  const musicGain = () => effective("music");
  const ambGain = () => effective("sfx") * AMB_GAIN;

  function getFromPool(rel, size = 4) {
    let pool = state.pools[rel];
    if (!pool) { pool = state.pools[rel] = { i: 0, els: [] }; for (let k = 0; k < size; k++) pool.els.push(makeEl(rel, false)); }
    const el = pool.els[pool.i]; pool.i = (pool.i + 1) % pool.els.length;
    return el;
  }

  const Audio_ = {
    ext: EXT,
    get unlocked() { return state.unlocked; },

    unlock() {
      if (state.unlocked) return;
      state.unlocked = true;
      // прогрев пулов эффектов
      SFX.forEach((n) => getFromPool("sfx/" + n));
      Object.values(VOICE).forEach((r) => getFromPool(r, 6));
      const m = state.musicName, a = state.ambName;
      state.musicName = null; state.ambName = null;
      if (m) this.music(m);
      if (a) this.amb(a);
    },

    music(name) { swapLoop("music", name || null, MUSIC, musicGain); },
    amb(name) { swapLoop("amb", name || null, AMB, ambGain); },

    sfx(name) {
      if (!state.unlocked || !name || SFX.indexOf(name) < 0) return;
      const v = effective("sfx");
      if (v <= 0) return;
      const el = getFromPool("sfx/" + name);
      try { el.currentTime = 0; } catch (e) { /* ещё не загружен */ }
      el.volume = v;
      safePlay(el);
    },

    /* голос-«бип»: у каждого персонажа свой файл (своя высота), лёгкий случайный разброс */
    voice(charId) {
      if (!state.unlocked || !VOICE[charId]) return;
      const v = effective("voice");
      if (v <= 0) return;
      const now = performance.now();
      if (now - state.lastVoice < 55) return;
      state.lastVoice = now;
      const el = getFromPool(VOICE[charId], 6);
      try { el.currentTime = 0; } catch (e) { /* ignore */ }
      el.preservesPitch = false; el.mozPreservesPitch = false; el.webkitPreservesPitch = false;
      el.playbackRate = 0.92 + Math.random() * 0.16;
      el.volume = v * 0.6;
      safePlay(el);
    },

    setVolumes(vol, muted) {
      Object.assign(state.vol, vol);
      if (typeof muted === "boolean") state.muted = muted;
      [state.music, state.amb].forEach((el) => { if (el) el.muted = state.muted; });
      if (state.music) fadeTo(state.music, musicGain(), 150);
      if (state.amb) fadeTo(state.amb, ambGain(), 150);
    },

    get errors() { return Array.from(state.errors); },
    get current() { return { music: state.musicName, amb: state.ambName, ext: EXT }; },
    /* для автотестов: реально ли играет музыка */
    get musicPlaying() { return !!(state.music && !state.music.paused && state.music.volume > 0); },
    get musicVolume() { return state.music ? state.music.volume : 0; }
  };

  window.NovelAudio = Audio_;
})();
