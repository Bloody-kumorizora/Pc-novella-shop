/*
 * Персонажи: послойный спрайт (тело + слой лица на эмоцию + рот + моргание).
 * Слои лежат в assets/characters/<id>/ и имеют общий viewBox, поэтому просто накладываются.
 *  - смена эмоции — crossfade слоёв лица (CSS transition 200 мс);
 *  - моргание — случайно каждые 2–6 с (иногда двойное);
 *  - «речь» — 2 кадра открытого рта по таймеру, рот закрыт, когда текст допечатан;
 *  - реакции bounce/shake отключаются при prefers-reduced-motion (через CSS).
 */
(function () {
  "use strict";

  const EMOTIONS = ["neutral", "happy", "surprised", "thinking", "sad", "embarrassed"];
  const IDS = ["lesha", "vika", "senya"];
  const reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };

  class CharacterView {
    constructor(id, container) {
      this.id = id;
      this.emotion = "neutral";
      this.el = document.createElement("div");
      this.el.className = "char";
      this.el.dataset.char = id;
      const rig = document.createElement("div");
      rig.className = "rig";
      this.el.appendChild(rig);

      const base = "assets/characters/" + id + "/";
      const img = (file, cls) => {
        const i = document.createElement("img");
        i.src = base + file;
        i.alt = "";
        i.draggable = false;
        if (cls) i.className = cls;
        rig.appendChild(i);
        return i;
      };
      img("body.svg", "body");
      this.faces = {};
      EMOTIONS.forEach((e) => { this.faces[e] = img(e + ".svg", "face"); });
      this.mouths = [img("mouth1.svg", "mouth"), img("mouth2.svg", "mouth")];
      this.blinkEl = img("blink.svg", "blink");
      this.faces.neutral.classList.add("on");

      container.appendChild(this.el);
      this._blinkTimer = null;
      this._talkTimer = null;
      this._scheduleBlink();
    }

    setEmotion(emo) {
      if (!this.faces[emo]) emo = "neutral";
      if (emo === this.emotion) return;
      this.faces[this.emotion].classList.remove("on");
      this.faces[emo].classList.add("on");
      this.emotion = emo;
    }

    react(type) {
      if (!type || reduceMotion.matches) return;
      const cls = "react-" + type;
      this.el.classList.remove("react-bounce", "react-shake");
      void this.el.offsetWidth; // перезапуск анимации
      this.el.classList.add(cls);
      clearTimeout(this._reactT);
      this._reactT = setTimeout(() => this.el.classList.remove(cls), 600);
    }

    /* анимация рта: кадры 1→2→1→закрыт в случайном ритме */
    talk(on) {
      clearInterval(this._talkTimer);
      this.mouths.forEach((m) => m.classList.remove("on"));
      if (!on) return;
      let frame = 0;
      const seq = [0, 1, 0, -1, 1, 0, -1];
      this._talkTimer = setInterval(() => {
        this.mouths.forEach((m) => m.classList.remove("on"));
        const f = seq[frame++ % seq.length];
        if (f >= 0) this.mouths[f].classList.add("on");
      }, 85);
    }

    blink() {
      this.blinkEl.classList.add("on");
      setTimeout(() => this.blinkEl.classList.remove("on"), 120);
    }

    _scheduleBlink() {
      const delay = 2000 + Math.random() * 4000;
      this._blinkTimer = setTimeout(() => {
        this.blink();
        if (Math.random() < 0.2) setTimeout(() => this.blink(), 260); // двойное моргание
        this._scheduleBlink();
      }, delay);
    }

    place(at) { this.el.dataset.at = at || "center"; }
    show() { requestAnimationFrame(() => this.el.classList.add("visible")); }
    hide() { this.el.classList.remove("visible"); this.talk(false); }
    setSpeaking(isSpeaker, someoneSpeaks) {
      this.el.classList.toggle("speaking", !!isSpeaker);
      this.el.classList.toggle("dim", !!someoneSpeaks && !isSpeaker);
    }
    destroy() {
      clearTimeout(this._blinkTimer); clearInterval(this._talkTimer); clearTimeout(this._reactT);
      this.el.remove();
    }
  }

  /* реакция по умолчанию для эмоции */
  const defaultReact = (emo) => (emo === "happy" ? "bounce" : emo === "surprised" ? "shake" : null);

  window.NovelCharacters = { CharacterView, EMOTIONS, IDS, defaultReact };
})();
