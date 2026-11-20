/*
 * Экран «Магазин/Сборка»: карточки комплектующих, итоговая сумма, ноутбук того же уровня,
 * сравнение ПК и ноутбука, блок «Что тянет». Консультант Вика реагирует мимикой на выбор.
 * Данные — window.DATA.products (data/products.js).
 */
(function () {
  "use strict";

  const P = window.DATA.products;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => new Intl.NumberFormat("ru-RU").format(n) + " " + P.currency;

  const buildById = (id) => P.builds.find((b) => b.id === id) || P.builds[0];
  const total = (id) => buildById(id).parts.reduce((s, p) => s + p.price, 0);

  /* фразы консультанта по категориям */
  function lineFor(part, build) {
    const price = fmt(part.price);
    switch (part.category) {
      case "gpu":
        return part.price > 150000
          ? { emo: "surprised", text: `Видеокарта — <b>${price}</b>. Больше половины сборки, зато 4K ей по плечу.` }
          : { emo: "happy", text: `Главная деталь для игр: ${esc(part.model.split(" ").slice(1, 5).join(" "))} за <b>${price}</b>. DLSS 4 и NVENC для стримов.` };
      case "ram":
        return /32/.test(part.model)
          ? { emo: "sad", text: `Больное место года: 32 ГБ DDR5 — <b>${price}</b>. Без дефицита было бы втрое дешевле.` }
          : { emo: "thinking", text: `16 ГБ DDR4 за <b>${price}</b> — разумный минимум. Позже можно добавить ещё два модуля.` };
      case "cpu":
        return { emo: part.price > 30000 ? "surprised" : "happy", text: part.price > 30000
          ? `9800X3D — <b>${price}</b>. Огромный кэш, один из лучших игровых процессоров.`
          : `Шесть ядер за <b>${price}</b>. Для игр и учёбы — отличное соотношение цены и скорости.` };
      case "cooler":
        return { emo: "happy", text: `Охлаждение за <b>${price}</b> — тихо и с запасом. Процессор в комплекте идёт без кулера.` };
      case "motherboard":
        return { emo: "neutral", text: `Плата на ${esc(build.platform.split(" · ")[0])}: сокет совпадает с процессором, память — тоже. <b>${price}</b>.` };
      case "ssd":
        return { emo: "happy", text: `Система и игры грузятся за секунды. <b>${price}</b>.` };
      case "psu":
        return { emo: "thinking", text: `Блок питания с запасом мощности больше 20–30%: так тише и надёжнее. <b>${price}</b>.` };
      case "case":
        return { emo: "neutral", text: `Проверила габариты: видеокарта и кулер влезают. <b>${price}</b>.` };
      default:
        return { emo: "neutral", text: `${esc(part.model)} — <b>${price}</b>.` };
    }
  }

  /* рабочие приложения */
  const LEVEL_EMO = { great: "happy", ok: "thinking", limited: "sad" };
  const levelBadge = (lvl) => `<span class="lvl lvl-${lvl}">${esc(P.appLevels[lvl])}</span>`;

  function appsHtml(apps, src) {
    if (!apps) return "";
    const rows = P.appsCatalog.map((a) => {
      const [lvl, note] = apps[a.id];
      return `<tr class="app-row" tabindex="0" data-app="${a.id}" data-src="${src}">
        <td><strong>${esc(a.name)}</strong><div class="src">${esc(a.task)}</div></td>
        <td>${levelBadge(lvl)}</td>
        <td class="app-note">${esc(note)}</td></tr>`;
    }).join("");
    return `
      <div class="perf-box apps-box"><table class="apps">
        <thead><tr><th>Программа</th><th>Оценка</th><th>Комментарий</th></tr></thead>
        <tbody>${rows}</tbody></table></div>`;
  }

  const appSourcesHtml = () =>
    `<p class="sources">Оценки рабочих программ — ориентиры по официальным системным требованиям: ${P.appSources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join(" · ")}. Для САПР и нейросетей — оценка по объёму памяти.</p>`;

  function perfHtml(perf, src) {
    const rows = perf.games.map((g) => `
      <tr><td>${esc(g.game)}<div class="src">${esc(g.mode)}</div></td>
      <td class="fps">${esc(g.fps)}</td>
      <td class="src">${g.estimate ? '<span class="badge">≈ оценка</span> ' : '<span class="badge ok">обзор</span> '}${esc(g.source)}</td></tr>`).join("");
    return `
      <div class="perf">
        <div class="perf-box"><table>
          <thead><tr><th>Игра / режим</th><th>FPS</th><th>Источник</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
        <div class="perf-box"><ul>${perf.work.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>
      </div>
      <p class="sources">Источники: ${perf.sources.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`).join(" · ")}.
      «≈» — ориентир, а не замер этой конфигурации; фактический FPS зависит от драйверов, патчей и настроек.</p>
      ${perf.apps ? `<h4 class="sub-h">Рабочие программы</h4>${appsHtml(perf.apps, src)}${appSourcesHtml()}` : ""}`;
  }

  class Shop {
    constructor() {
      this.root = $("#shop");
      this.main = $("#shop-main");
      this.bubble = $("#advisor-bubble");
      this.btnCart = $("#btn-cart");
      this.btnDone = $("#btn-shop-done");
      this.tabs = Array.from(this.root.querySelectorAll(".tab"));
      this.advisor = null;
      this.tab = "pc";

      this.tabs.forEach((t) => t.addEventListener("click", () => { this.audio.sfx("click"); this.showTab(t.dataset.tab); }));
      this.root.querySelector(".tabs").addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const i = this.tabs.findIndex((t) => t.dataset.tab === this.tab);
        const n = this.tabs[(i + (e.key === "ArrowRight" ? 1 : this.tabs.length - 1)) % this.tabs.length];
        n.focus(); this.showTab(n.dataset.tab);
      });
      this.btnCart.addEventListener("click", () => this.addToCart());
      this.btnDone.addEventListener("click", () => this.close());
    }

    open({ tier, audio, onDone, startTab }) {
      this.audio = audio;
      this.onDone = onDone;
      this.build = buildById(tier);
      this.inCart = false;
      this.btnCart.disabled = false;
      this.btnCart.textContent = "Добавить в корзину";
      this.btnCart.classList.remove("done");
      this.btnDone.disabled = true;

      $("#shop-build-title").textContent = this.build.title;
      $("#shop-build-tagline").textContent = this.build.tagline + " · " + this.build.platform;
      $("#shop-foot").innerHTML =
        `Цены актуальны на <strong>${esc(P.checkedAtHuman)}</strong> (ноутбук для кода — на <strong>18 ноября 2026</strong>), могут измениться. Магазин: ${esc(P.store)} (${esc(P.region)}). ` +
        `Ссылки ведут на карточки товаров и открываются в новой вкладке.`;

      if (!this.advisor) {
        this.advisor = new window.NovelCharacters.CharacterView("vika", $("#advisor-portrait"));
        this.advisor.place("center");
      }
      this.root.hidden = false;
      this.audio.sfx("menu");
      this.showTab(startTab || "pc");
      if (startTab && startTab !== "pc") return; // вкладка сама даёт реплику консультанта
      this.say("happy", `Вот «${esc(this.build.title)}». Нажмите на карточку — расскажу про деталь. Внизу — что сборка тянет в играх и рабочих программах: на строку тоже можно нажать.`);
      setTimeout(() => this.root.querySelector(".tab[aria-selected=true]").focus({ preventScroll: true }), 50);
    }

    /* реплика консультанта с мимикой и «речью» */
    say(emo, html) {
      const v = this.advisor;
      v.setEmotion(emo);
      v.react(window.NovelCharacters.defaultReact(emo));
      this.bubble.innerHTML = html;
      v.talk(true);
      const plain = this.bubble.textContent.length;
      clearTimeout(this._talkT);
      let beeps = 0;
      clearInterval(this._beepT);
      this._beepT = setInterval(() => { this.audio.voice("vika"); if (++beeps > Math.min(12, plain / 6)) clearInterval(this._beepT); }, 90);
      this._talkT = setTimeout(() => v.talk(false), Math.min(2400, 400 + plain * 22));
      if (emo === "surprised") this.audio.sfx("surprise");
    }

    setTotal(label, sum) {
      $("#total-label").textContent = label;
      $("#total-sum").textContent = fmt(sum);
    }

    showTab(tab) {
      this.tab = tab;
      this.tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === tab)));
      const b = this.build, lap = b.laptop, pcSum = total(b.id);
      if (tab === "pc") {
        this.setTotal("Итого за сборку (" + b.parts.length + " позиций)", pcSum);
        this.main.innerHTML = `
          <h3 class="section-h">Комплектующие</h3>
          <div class="cards">${b.parts.map((p, i) => `
            <article class="card" tabindex="0" data-i="${i}" aria-label="${esc(P.categories[p.category])}: ${esc(p.model)}, ${fmt(p.price)}">
              <div class="card-top"><img class="card-ico" src="assets/ui/${p.category}.svg" alt="">
                <div><div class="card-cat">${esc(P.categories[p.category])}</div><div class="card-price">${fmt(p.price)}</div></div></div>
              <p class="card-model">${esc(p.model)}</p>
              <ul>${p.specs.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
              <a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">Открыть в магазине ↗</a>
            </article>`).join("")}
          </div>
          <h3 class="section-h">Совместимость проверена</h3>
          <ul class="compat">${b.compatibility.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          <h3 class="section-h">Что тянет</h3>
          ${perfHtml(b.perf, "pc")}`;
        this.main.querySelectorAll(".card").forEach((card) => {
          const part = b.parts[+card.dataset.i];
          const pick = () => {
            this.main.querySelectorAll(".card.active").forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            const l = lineFor(part, b);
            this.audio.sfx("select");
            this.say(l.emo, l.text);
          };
          card.addEventListener("click", (e) => { if (e.target.closest("a")) { this.audio.sfx("click"); return; } pick(); });
          card.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target === card) { e.preventDefault(); pick(); } });
          card.addEventListener("mouseenter", () => this.audio.sfx("hover"));
        });
      } else if (tab === "laptop") {
        this.setTotal("Ноутбук того же уровня", lap.price);
        this.main.innerHTML = `
          <div class="laptop-hero">
            <img src="assets/ui/laptop.svg" alt="">
            <div>
              <h3>${esc(lap.model)}</h3>
              <div class="card-price">${fmt(lap.price)}</div>
              <ul>${lap.specs.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
              <div class="link-row">
                <a class="btn primary" href="${esc(lap.url)}" target="_blank" rel="noopener">Открыть в магазине ↗</a>
                <a class="btn" href="${esc(lap.officialUrl)}" target="_blank" rel="noopener">Страница производителя ↗</a>
              </div>
            </div>
          </div>
          <h3 class="section-h">Что тянет</h3>
          ${perfHtml(lap.perf, "lap")}`;
        const diff = lap.price - pcSum;
        this.say("thinking", diff > 0
          ? `Ноутбук дороже сборки на <b>${fmt(diff)}</b> — плата за мобильность. И видеокарта у него мобильная, слабее.`
          : `Ноутбук дешевле сборки на <b>${fmt(-diff)}</b>, но и слабее: мобильная видеокарта и меньше памяти или SSD.`);
      } else if (tab === "code") {
        const cl = P.codingLaptop;
        this.setTotal("Ноутбук для кода", cl.price);
        this.main.innerHTML = `
          <div class="laptop-hero">
            <img src="assets/ui/laptop.svg" alt="">
            <div>
              <h3>${esc(cl.model)}</h3>
              <div class="card-price">${fmt(cl.price)}</div>
              <ul>${cl.specs.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
              <div class="link-row">
                <a class="btn primary" href="${esc(cl.url)}" target="_blank" rel="noopener">Открыть в магазине ↗</a>
                <a class="btn" href="${esc(cl.officialUrl)}" target="_blank" rel="noopener">Характеристики Apple ↗</a>
              </div>
            </div>
          </div>
          <h3 class="section-h">Почему для программирования</h3>
          <ul class="compat why">${cl.why.map((w) => `<li${/^Минусы/.test(w) ? ' class="minus"' : ""}>${esc(w)}</li>`).join("")}</ul>
          <h3 class="section-h">Что тянет</h3>
          ${perfHtml(cl.perf, "code")}`;
        const diff = cl.price - pcSum;
        this.say("happy", `Это не игровой, а рабочий ноутбук: тихий, лёгкий и до 15 часов от батареи. ${diff > 0 ? `Дороже выбранной сборки на <b>${fmt(diff)}</b>` : `Дешевле выбранной сборки на <b>${fmt(-diff)}</b>`}, зато для кода — то что надо.`);
      } else {
        this.setTotal("Разница ПК − ноутбук", pcSum - lap.price);
        const gpuPart = b.parts.find((p) => p.category === "gpu");
        const cpuPart = b.parts.find((p) => p.category === "cpu");
        const ramPart = b.parts.find((p) => p.category === "ram");
        const ssdPart = b.parts.find((p) => p.category === "ssd");
        const row = (k, a, c, win) => `<tr><td>${k}</td><td class="${win === "pc" ? "win" : ""}">${a}</td><td class="${win === "lap" ? "win" : ""}">${c}</td></tr>`;
        this.main.innerHTML = `
          <table class="cmp">
            <thead><tr><th></th><th>${esc(b.title)}</th><th>${esc(lap.model)}</th></tr></thead>
            <tbody>
              ${row("Цена", fmt(pcSum), fmt(lap.price), pcSum < lap.price ? "pc" : "lap")}
              ${row("Процессор", esc(cpuPart.model), esc(lap.specs[1]))}
              ${row("Видеокарта", esc(gpuPart.model), esc(lap.specs[2]), "pc")}
              ${row("Память / SSD", esc(ramPart.specs[0] + " · " + ssdPart.specs[0]), esc(lap.specs[3]))}
              ${row("Апгрейд", "Любая деталь меняется отдельно", "Только ОЗУ и SSD", "pc")}
              ${row("Шум под нагрузкой", "Тише: большие вентиляторы", "Громче: компактное охлаждение", "pc")}
              ${row("Мобильность", "Стоит дома", "Можно взять с собой, есть экран", "lap")}
              ${row("Монитор, клавиатура, мышь", "Нужно докупить", "Уже встроены", "lap")}
            </tbody>
          </table>
          <h3 class="section-h">Рабочие программы: ПК и ноутбук</h3>
          <table class="cmp apps-cmp">
            <thead><tr><th>Программа</th><th>${esc(b.title)}</th><th>Ноутбук</th></tr></thead>
            <tbody>${P.appsCatalog.map((a) => `<tr class="app-row" tabindex="0" data-app="${a.id}" data-src="cmp">
              <td>${esc(a.name)}</td><td>${levelBadge(b.perf.apps[a.id][0])}</td><td>${levelBadge(lap.perf.apps[a.id][0])}</td></tr>`).join("")}
            </tbody>
          </table>
          <h3 class="section-h">Что тянет: ПК</h3>${perfHtml(b.perf, "pc")}
          <h3 class="section-h">Что тянет: ноутбук</h3>${perfHtml(lap.perf, "lap")}`;
        this.say("thinking", `Честно: ПК быстрее и легче апгрейдить, ноутбук — свобода и всё в одном корпусе. Монитор к ПК в сумму не входит.`);
      }
      this.bindApps();
      this.main.scrollTop = 0;
    }

    /* клик по программе — Вика комментирует с мимикой по оценке */
    bindApps() {
      this.main.querySelectorAll(".app-row").forEach((row) => {
        const pick = () => {
          const app = P.appsCatalog.find((a) => a.id === row.dataset.app);
          this.main.querySelectorAll(".app-row.active").forEach((r) => r.classList.remove("active"));
          row.classList.add("active");
          this.audio.sfx("select");
          const lv = (l) => esc(P.appLevels[l].toLowerCase());
          if (row.dataset.src === "cmp") {
            const pc = this.build.perf.apps[app.id][0], lap = this.build.laptop.perf.apps[app.id][0];
            const rank = { great: 2, ok: 1, limited: 0 };
            const emo = pc === lap ? LEVEL_EMO[pc] : "thinking";
            const verdict = pc === lap ? "Здесь они равны." : rank[pc] > rank[lap] ? "Системный блок справится лучше." : "Ноутбук тут даже удобнее.";
            this.say(emo, `<b>${esc(app.name)}</b>: на ПК — ${lv(pc)}, на ноутбуке — ${lv(lap)}. ${verdict}`);
            return;
          }
          const src = row.dataset.src;
          const perf = src === "lap" ? this.build.laptop.perf : src === "code" ? P.codingLaptop.perf : this.build.perf;
          const where = src === "lap" ? "ноутбуке" : src === "code" ? "MacBook Air" : "этой сборке";
          const [lvl, note] = perf.apps[app.id];
          this.say(LEVEL_EMO[lvl], `<b>${esc(app.name)}</b> на ${where} — ${lv(lvl)}. ${esc(note)}`);
        };
        row.addEventListener("click", pick);
        row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      });
    }

    addToCart() {
      if (this.inCart) return;
      this.inCart = true;
      this.audio.sfx("cart");
      this.btnCart.textContent = "В корзине ✓";
      this.btnCart.classList.add("done");
      this.btnCart.disabled = true;
      this.btnDone.disabled = false;
      if (this.tab === "code" || this.tab === "laptop") {
        const item = this.tab === "code" ? P.codingLaptop : this.build.laptop;
        this.say("happy", `Отложила для вас ${esc(item.model)} — <b>${fmt(item.price)}</b>. Окончательно выберете у кассы: ПК, ноутбук или ноутбук для кода.`);
        this.btnDone.focus();
        return;
      }
      const sum = total(this.build.id);
      if (sum > 300000) this.say("surprised", `Ух... <b>${fmt(sum)}</b>. Серьёзная покупка! Но всё совместимо, проверено.`);
      else this.say("happy", `Отличная сборка — всё совместимо! В корзине <b>${fmt(sum)}</b>. Ноутбук можно сравнить во вкладках.`);
      this.btnDone.focus();
    }

    close() {
      this.audio.sfx("select");
      this.advisor.talk(false);
      clearInterval(this._beepT);
      this.root.hidden = true;
      if (this.onDone) this.onDone();
    }
  }

  window.NovelShop = { Shop, total, buildById, fmt };
})();
