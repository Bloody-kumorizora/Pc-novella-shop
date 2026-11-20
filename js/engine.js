/*
 * Движок визуальной новеллы: исполняет сценарий из data/story.js.
 * Диалог с печатью текста, смена фонов/спрайтов/эмоций, ветвления и переменные,
 * экран магазина, меню (начать / продолжить / настройки / галерея), автосохранение.
 */
(function () {
  "use strict";

  const STORY = window.DATA.story;
  const PRODUCTS = window.DATA.products;
  const A = window.NovelAudio;
  const { CharacterView, defaultReact } = window.NovelCharacters;
  const { Shop, total, buildById, fmt } = window.NovelShop;
  const $ = (s) => document.querySelector(s);

  /* ─────────── хранилище (localStorage в try/catch) ─────────── */
  const KEY = { save: "pcnovel.save.v1", settings: "pcnovel.settings.v1", endings: "pcnovel.endings.v1" };
  const store = {
    get(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* приватный режим / запрет */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  const DEFAULTS = { speed: 45, music: 60, sfx: 80, voice: 50, muted: false };
  let settings = Object.assign({}, DEFAULTS, store.get(KEY.settings, {}));
  const applyAudio = () => A.setVolumes({ music: settings.music / 100, sfx: settings.sfx / 100, voice: settings.voice / 100 }, settings.muted);
  applyAudio();

  /* ─────────── состояние ─────────── */
  let st = null; // { node, idx, vars, scene: { bg, music, amb, chars: { id: {at, emotion} } } }
  const views = {};
  let mode = "title"; // title | play | choice | shop | ending
  let typing = null;  // { full, shown, timer, speaker }
  let waiting = false;
  let busy = false;

  const els = {
    stage: $("#stage"), chars: $("#chars"), dialog: $("#dialog"), name: $("#namebox"), text: $("#text"),
    choices: $("#choices"), bgA: $("#bg-a"), bgB: $("#bg-b"), fader: $("#fader"), title: $("#title"),
    mute: $("#btn-mute"), toast: $("#toast")
  };
  const shop = new Shop();

  /* ─────────── подстановки ─────────── */
  function vars() {
    const v = (st && st.vars) || {};
    const tier = v.tier || "budget";
    const b = buildById(tier);
    const pcTotal = total(tier);
    const isLaptop = v.form === "laptop";
    const cl = PRODUCTS.codingLaptop;
    const purchase = v.form === "coder" ? { name: cl.model, price: cl.price }
      : isLaptop ? { name: b.laptop.model, price: b.laptop.price } : { name: b.title, price: pcTotal };
    return {
      codeLaptopName: cl.shortName, codeLaptopPrice: fmt(cl.price),
      budgetTotal: fmt(total("budget")), midTotal: fmt(total("mid")), highTotal: fmt(total("high")),
      buildTotal: fmt(pcTotal), buildTitle: b.title,
      laptopName: b.laptop.model, laptopPrice: fmt(b.laptop.price),
      purchaseTotal: fmt(purchase.price),
      purchaseName: purchase.name,
      goalPhrase: STORY.goalPhrases[v.goal] || STORY.goalPhrases.study
    };
  }
  const fill = (s) => { const v = vars(); return String(s).replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m)); };

  /* ─────────── фон ─────────── */
  let bgFront = els.bgA;
  function setBg(name, instant) {
    if (st) st.scene.bg = name;
    const url = 'url("assets/bg/' + name + '.svg")';
    const back = bgFront === els.bgA ? els.bgB : els.bgA;
    if (bgFront.style.backgroundImage === url) return;
    back.style.transition = instant ? "none" : "";
    bgFront.style.transition = instant ? "none" : "";
    back.style.backgroundImage = url;
    back.classList.add("on");
    bgFront.classList.remove("on");
    bgFront = back;
  }

  /* ─────────── персонажи ─────────── */
  function view(id) {
    if (!views[id]) views[id] = new CharacterView(id, els.chars);
    return views[id];
  }
  function showChar(id, at, emotion) {
    const v = view(id);
    v.place(at);
    if (emotion) v.setEmotion(emotion);
    v.show();
    st.scene.chars[id] = { at: at || "center", emotion: emotion || v.emotion };
  }
  function hideChar(id) {
    if (views[id]) views[id].hide();
    delete st.scene.chars[id];
  }
  function clearChars() { Object.keys(views).forEach((id) => { views[id].hide(); views[id].setSpeaking(false, false); }); }
  function highlight(speaker) {
    const someone = !!views[speaker] && !!st.scene.chars[speaker];
    Object.keys(views).forEach((id) => views[id].setSpeaking(id === speaker, someone));
  }

  /* ─────────── исполнение сценария ─────────── */
  function cmdList() { return STORY.nodes[st.node] || []; }

  function jump(node) {
    if (!STORY.nodes[node]) { console.error("[novel] нет узла", node); return; }
    st.node = node; st.idx = 0;
  }

  function step() {
    if (busy) return;
    waiting = false;
    let guard = 0;
    while (guard++ < 500) {
      const list = cmdList();
      if (st.idx >= list.length) { console.warn("[novel] узел закончился без перехода:", st.node); return; }
      const c = list[st.idx];
      // блокирующие команды
      if (c.say) { save(); doSay(c); st.idx++; return; }
      if (c.choice) { save(); doChoice(c); return; }
      if (c.shop) { save(); doShop(); return; }
      if (c.ending) { doEnding(c.ending); return; }
      st.idx++;
      if ("bg" in c) setBg(c.bg);
      if ("music" in c) { st.scene.music = c.music; A.music(c.music); }
      if ("amb" in c) { st.scene.amb = c.amb; A.amb(c.amb); }
      if (c.sfx && Object.keys(c).length === 1) A.sfx(c.sfx);
      if (c.show) showChar(c.show, c.at, c.emotion);
      if (c.hide) hideChar(c.hide);
      if (c.set) Object.assign(st.vars, c.set);
      if (c.if) {
        const ok = Object.keys(c.if).every((k) => st.vars[k] === c.if[k]);
        if (ok) jump(c.goto);
        continue;
      }
      if (c.goto) jump(c.goto);
    }
  }

  function doSay(c) {
    mode = "play";
    const id = c.say;
    const meta = STORY.characters[id] || { name: id, color: "#fff" };
    const isNarr = id === "narrator";
    els.dialog.classList.toggle("narration", isNarr);
    els.name.hidden = isNarr || !meta.name;
    els.name.textContent = meta.name;
    document.documentElement.style.setProperty("--speaker", meta.color);
    highlight(isNarr ? null : id);
    if (!isNarr && views[id] && st.scene.chars[id]) {
      views[id].setEmotion(c.emotion || "neutral");
      st.scene.chars[id].emotion = c.emotion || "neutral";
      views[id].react(c.react || defaultReact(c.emotion));
    }
    if (c.sfx) A.sfx(c.sfx);
    typeText(fill(c.text), isNarr ? null : id);
  }

  function typeText(full, speaker) {
    stopTyping();
    els.dialog.classList.remove("done");
    const cps = settings.speed;
    if (cps >= 110) { els.text.textContent = full; finishTyping(); return; }
    typing = { full, shown: 0, speaker };
    els.text.textContent = "";
    if (speaker && views[speaker]) views[speaker].talk(true);
    const interval = 1000 / cps;
    let last = performance.now(), acc = 0;
    const tick = (now) => {
      if (!typing) return;
      if (modalOpen()) { // на паузе текст и голос не идут
        last = now;
        if (speaker && views[speaker]) views[speaker].talk(false);
        typing.paused = true;
        typing.raf = requestAnimationFrame(tick);
        return;
      }
      if (typing.paused) { typing.paused = false; if (speaker && views[speaker]) views[speaker].talk(true); }
      acc += now - last; last = now;
      while (acc >= interval && typing.shown < full.length) {
        acc -= interval;
        const ch = full[typing.shown++];
        if (speaker && /[\p{L}\p{N}]/u.test(ch) && typing.shown % 2 === 0) A.voice(speaker);
        if (/[.,!?…—]/.test(ch)) acc -= interval * 2; // паузы на знаках препинания
      }
      els.text.textContent = full.slice(0, typing.shown);
      if (typing.shown >= full.length) finishTyping();
      else typing.raf = requestAnimationFrame(tick);
    };
    typing.raf = requestAnimationFrame(tick);
  }
  function stopTyping() {
    if (typing) cancelAnimationFrame(typing.raf);
    if (typing && typing.speaker && views[typing.speaker]) views[typing.speaker].talk(false);
    typing = null;
  }
  function finishTyping() {
    if (typing) els.text.textContent = typing.full;
    stopTyping();
    els.dialog.classList.add("done");
    waiting = true;
  }

  function advance() {
    if (mode !== "play" || busy || modalOpen()) return;
    if (typing) { finishTyping(); return; }
    if (waiting) { A.sfx("click"); step(); }
  }

  function doChoice(c) {
    mode = "choice";
    highlight(null);
    if (c.music) { st.scene.music = c.music; A.music(c.music); }
    A.sfx("menu");
    els.choices.innerHTML = "";
    c.choice.forEach((opt, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.dataset.key = String(i + 1);
      b.textContent = fill(opt.text);
      b.addEventListener("mouseenter", () => A.sfx("hover"));
      b.addEventListener("click", (e) => { e.stopPropagation(); pick(opt); });
      els.choices.appendChild(b);
    });
    els.choices.hidden = false;
    els.dialog.hidden = true;
    setTimeout(() => { const f = els.choices.querySelector(".choice"); if (f) f.focus({ preventScroll: true }); }, 30);
  }
  function pick(opt) {
    if (mode !== "choice") return;
    A.sfx("select");
    els.choices.hidden = true;
    els.dialog.hidden = false;
    if (opt.set) Object.assign(st.vars, opt.set);
    jump(opt.goto);
    mode = "play";
    step();
  }

  function doShop() {
    mode = "shop";
    stopTyping();
    shop.open({
      tier: st.vars.tier || "budget", audio: A,
      startTab: st.vars.goal === "code" ? "code" : "pc",
      onDone: () => { mode = "play"; st.idx++; step(); }
    });
  }

  function doEnding(id) {
    mode = "ending";
    store.del(KEY.save);
    const got = store.get(KEY.endings, []);
    if (got.indexOf(id) < 0) { got.push(id); store.set(KEY.endings, got); }
    const e = STORY.endings[id];
    const ids = Object.keys(STORY.endings);
    $("#ending-icon").textContent = e.icon;
    $("#ending-num").textContent = (ids.indexOf(id) + 1) + " из " + ids.length;
    $("#h-ending").textContent = e.title;
    $("#ending-text").textContent = e.text;
    A.sfx("chime");
    setTimeout(() => openModal("m-ending"), 500);
  }

  /* ─────────── сохранение ─────────── */
  function save() { if (st) store.set(KEY.save, st); }
  function hasSave() { const s = store.get(KEY.save, null); return !!(s && s.node && STORY.nodes[s.node]); }

  function restoreScene() {
    clearChars();
    const sc = st.scene;
    if (sc.bg) setBg(sc.bg, true);
    A.music(sc.music || null);
    A.amb(sc.amb || null);
    Object.keys(sc.chars).forEach((id) => {
      const v = view(id); v.place(sc.chars[id].at); v.setEmotion(sc.chars[id].emotion); v.show();
    });
  }

  function fadeOutIn(fn) {
    busy = true;
    els.fader.classList.add("on");
    setTimeout(() => { fn(); els.fader.classList.remove("on"); setTimeout(() => { busy = false; step(); }, 300); }, 460);
  }

  function startNew() {
    if (busy || mode !== "title") return; // защита от двойного клика
    st ={ node: STORY.start, idx: 0, vars: {}, scene: { bg: null, music: null, amb: null, chars: {} } };
    fadeOutIn(() => { clearChars(); els.text.textContent = ""; els.name.hidden = true; enterPlay(); });
  }
  function continueGame() {
    if (busy || mode !== "title") return;
    const s = store.get(KEY.save, null);
    if (!s) return startNew();
    if (!(s.idx >= 0 && s.idx < STORY.nodes[s.node].length)) s.idx = 0; // сохранение от старой версии сценария
    st = s;
    fadeOutIn(() => { restoreScene(); enterPlay(); });
  }
  function enterPlay() {
    mode = "play";
    els.title.hidden = true;
    els.choices.hidden = true;
    els.dialog.hidden = false;
  }
  function toTitle() {
    if (busy) return;
    closeModals();
    stopTyping();
    shop.root.hidden = true;
    busy = true;
    els.fader.classList.add("on");
    setTimeout(() => {
      clearChars();
      mode = "title";
      els.title.hidden = false;
      $("#btn-continue").disabled = !hasSave();
      A.music("street"); A.amb(null);
      els.fader.classList.remove("on");
      busy = false;
      setTimeout(() => $("#btn-new").focus(), 50);
    }, 460);
  }

  /* ─────────── модальные окна ─────────── */
  /*
   * Стек окон: открытое последним всегда сверху (z-index по позиции в стеке),
   * нижние окна и фон недоступны (inert) — фокус и клики не уходят «под» окно.
   * Каждая кнопка закрытия закрывает именно своё окно.
   */
  const modalStack = []; // [{ id, returnFocus }]
  const BACKGROUND = [els.stage, els.title, shop.root];
  function modalOpen() { return modalStack.length > 0; }
  const topModal = () => (modalStack.length ? modalStack[modalStack.length - 1].id : null);

  function syncModalLayers() {
    modalStack.forEach((entry, i) => {
      const m = document.getElementById(entry.id);
      const isTop = i === modalStack.length - 1;
      m.style.zIndex = String(50 + i);
      m.classList.toggle("under", !isTop);
      m.inert = !isTop;
    });
    BACKGROUND.forEach((el) => { el.inert = modalOpen(); });
  }

  function openModal(id) {
    if (modalStack.some((e) => e.id === id)) return; // уже открыто — не дублируем
    const m = document.getElementById(id);
    if (id === "m-settings") syncSettingsUI();
    if (id === "m-gallery") renderGallery();
    modalStack.push({ id, returnFocus: document.activeElement });
    m.hidden = false;
    syncModalLayers();
    A.sfx("menu");
    const f = m.querySelector("button:not(:disabled), input");
    if (f) setTimeout(() => f.focus({ preventScroll: true }), 30);
  }

  function closeModal(id, silent) {
    const i = id ? modalStack.findIndex((e) => e.id === id) : modalStack.length - 1;
    if (i < 0) return;
    const [entry] = modalStack.splice(i, 1);
    const m = document.getElementById(entry.id);
    m.hidden = true;
    m.inert = false;
    m.classList.remove("under");
    m.style.zIndex = "";
    syncModalLayers();
    if (!silent) A.sfx("click");
    const back = entry.returnFocus;
    if (back && document.contains(back) && !back.closest("[hidden]") && !back.closest("[inert]")) {
      setTimeout(() => back.focus({ preventScroll: true }), 0);
    }
  }
  function closeModals() { while (modalStack.length) closeModal(null, true); }

  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (m.id !== topModal()) return;
      if (e.target === m && m.id !== "m-ending") closeModal(m.id);
      else if (e.target.closest("[data-close]")) closeModal(m.id);
    });
  });

  /* настройки */
  const sliders = { speed: "#s-speed", music: "#s-music", sfx: "#s-sfx", voice: "#s-voice" };
  function speedLabel(v) { return v >= 110 ? "мгновенно" : v + " зн/с"; }
  function syncSettingsUI() {
    Object.keys(sliders).forEach((k) => { $(sliders[k]).value = settings[k]; });
    $("#s-mute").checked = settings.muted;
    updateOutputs();
  }
  function updateOutputs() {
    $("#o-speed").textContent = speedLabel(settings.speed);
    $("#o-music").textContent = settings.music + "%";
    $("#o-sfx").textContent = settings.sfx + "%";
    $("#o-voice").textContent = settings.voice + "%";
    els.mute.classList.toggle("is-muted", settings.muted);
    els.mute.setAttribute("aria-pressed", String(settings.muted));
  }
  Object.keys(sliders).forEach((k) => {
    $(sliders[k]).addEventListener("input", (e) => {
      settings[k] = +e.target.value;
      store.set(KEY.settings, settings);
      applyAudio(); updateOutputs();
    });
    $(sliders[k]).addEventListener("change", () => { if (k === "sfx") A.sfx("select"); if (k === "voice") A.voice("vika"); });
  });
  $("#s-mute").addEventListener("change", (e) => setMuted(e.target.checked));
  function setMuted(m) {
    settings.muted = m;
    store.set(KEY.settings, settings);
    applyAudio(); updateOutputs();
    toast(m ? "Звук выключен" : "Звук включён");
  }

  /* галерея */
  function renderGallery() {
    const got = store.get(KEY.endings, []);
    const ids = Object.keys(STORY.endings);
    $("#gallery-count").textContent = "Открыто " + got.filter((g) => ids.indexOf(g) >= 0).length + " из " + ids.length;
    $("#gallery").innerHTML = ids.map((id) => {
      const e = STORY.endings[id], open = got.indexOf(id) >= 0;
      return `<div class="g-item${open ? "" : " locked"}"><div class="g-ico">${open ? e.icon : "🔒"}</div>
        <h3>${open ? e.title : "???"}</h3><p>${open ? e.text : "Пройдите историю иначе, чтобы открыть."}</p></div>`;
    }).join("");
  }

  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { els.toast.hidden = true; }, 1400);
  }

  /* ─────────── ввод ─────────── */
  // первый жест пользователя разблокирует звук
  const unlock = () => {
    if (A.unlocked) return;
    A.unlock();
    if (mode === "title") A.music("street");
    $("#title-hint").textContent = "Звук включён. Громкость — в настройках.";
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });

  els.stage.addEventListener("click", (e) => {
    if (e.target.closest("#hud") || e.target.closest("#choices")) return;
    advance();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (busy) { e.preventDefault(); return; }
      if (modalOpen()) { if (topModal() !== "m-ending") closeModal(topModal()); }
      else if (mode === "play" || mode === "choice" || mode === "shop") openModal("m-pause");
      e.preventDefault();
      return;
    }
    if (modalOpen()) return;
    if ((e.key === "m" || e.key === "M" || e.key === "ь" || e.key === "Ь") && mode !== "title") { setMuted(!settings.muted); return; }
    if (mode === "choice" && /^[1-9]$/.test(e.key)) {
      const b = els.choices.querySelectorAll(".choice")[+e.key - 1];
      if (b) b.click();
      return;
    }
    if (mode === "play" && (e.key === " " || e.key === "Enter")) {
      if (e.target.closest && e.target.closest("#hud")) return;
      e.preventDefault();
      advance();
    }
  });

  /* кнопки */
  const on = (sel, fn) => { const el = $(sel); el.addEventListener("click", fn); el.addEventListener("mouseenter", () => A.sfx("hover")); };
  on("#btn-new", () => { A.sfx("select"); startNew(); });
  on("#btn-continue", () => { A.sfx("select"); continueGame(); });
  on("#btn-settings", () => openModal("m-settings"));
  on("#btn-gallery", () => openModal("m-gallery"));
  on("#btn-menu", (e) => { e.stopPropagation(); openModal("m-pause"); });
  on("#btn-mute", (e) => { e.stopPropagation(); setMuted(!settings.muted); });
  on("#p-settings", () => openModal("m-settings"));
  on("#p-gallery", () => openModal("m-gallery"));
  on("#p-title", () => toTitle());
  on("#e-title", () => toTitle());
  on("#e-gallery", () => openModal("m-gallery"));

  /* ─────────── старт ─────────── */
  $("#btn-continue").disabled = !hasSave();
  syncSettingsUI();
  setBg("street", true);
  A.music("street"); // начнёт играть после первого клика

  // проверка данных при загрузке
  (function validate() {
    const nodes = STORY.nodes, bad = [];
    Object.keys(nodes).forEach((n) => nodes[n].forEach((c) => {
      [c.goto].concat((c.choice || []).map((o) => o.goto)).forEach((g) => { if (g && !nodes[g]) bad.push(n + " → " + g); });
      if (c.say && c.say !== "narrator" && !("emotion" in c)) bad.push(n + ": реплика без эмоции");
      if (c.say && !("sfx" in c)) bad.push(n + ": реплика без звукового события");
      if (c.ending && !STORY.endings[c.ending]) bad.push(n + ": нет концовки " + c.ending);
    }));
    if (bad.length) console.error("[novel] ошибки сценария:", bad);
  })();

  // хук для автотестов и отладки
  window.NOVEL = {
    get state() { return st; }, get mode() { return mode; }, get typing() { return !!typing; },
    advance, pick: (i) => { const b = els.choices.querySelectorAll(".choice")[i]; if (b) b.click(); },
    totals: { budget: total("budget"), mid: total("mid"), high: total("high") },
    views, settings: () => settings
  };
})();
