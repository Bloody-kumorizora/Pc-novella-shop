/*
 * Сценарий новеллы «Пиксель: три компьютера».
 * Формат: узлы (nodes) — массивы команд, выполняются по порядку.
 *
 *  { bg: "street" }                         — сменить фон (плавный переход)
 *  { music: "shop" } / { music: null }      — фоновая музыка (crossfade)
 *  { amb: "shop" }                          — звук окружения
 *  { sfx: "door" }                          — разовый звуковой эффект
 *  { show: "vika", at: "center", emotion: "happy" } / { hide: "vika" }
 *  { say: "vika", emotion: "happy", sfx: null, text: "..." }
 *        emotion — эмоция говорящего; sfx — звуковое событие реплики (null = только голос-бип)
 *        react — "bounce" | "shake" (по умолчанию: happy → bounce, surprised → shake)
 *  { choice: [ { text, set: {...}, goto: "node" } ], music: "tense" }
 *  { set: { key: value } }
 *  { if: { key: value, ... }, goto: "node" } — переход, если все условия совпали
 *  { goto: "node" }
 *  { shop: true }                           — открыть экран «Магазин/Сборка»
 *  { ending: "id" }                         — показать концовку и открыть её в галерее
 *
 * Подстановки в тексте: {budgetTotal} {midTotal} {highTotal} {buildTotal} {buildTitle}
 *   {laptopName} {laptopPrice} {purchaseTotal} {purchaseName} {goalPhrase}
 * Суммы считаются движком из data/products.js — в сценарии цены не зашиты.
 */
window.DATA = window.DATA || {};

window.DATA.story = {
  title: "Пиксель: три компьютера",
  start: "intro",

  characters: {
    lesha:    { name: "Лёша",  color: "#4f8cff" },
    vika:     { name: "Вика",  color: "#ff6b5a" },
    senya:    { name: "Сеня",  color: "#3ccf91" },
    narrator: { name: "",      color: "#c9c3e6" }
  },

  goalPhrases: {
    study:  "учёба, код и немного игр по вечерам",
    games:  "игры — нормально, в 1440p, без слайд-шоу",
    stream: "стримы и монтаж роликов",
    code:   "программирование: курсы, пет-проекты и хакатоны"
  },

  endings: {
    study:    { title: "Учёба на отлично",      text: "Тихий и надёжный ПК закрыл сессию, курсовую и пару сотен матчей по вечерам.", icon: "📚" },
    gamer:    { title: "Игрок 1440p",           text: "Высокие настройки, высокая частота кадров и ни одного слайд-шоу.", icon: "🎮" },
    studio:   { title: "Студия мечты",          text: "4K-монтаж, стрим без лагов и компьютер, который не просит пощады.", icon: "🎬" },
    laptop:   { title: "Свобода на колёсах",    text: "Ноутбук в рюкзаке: игры и работа — хоть в общаге, хоть в поезде.", icon: "🎒" },
    coder:    { title: "Код в рюкзаке",         text: "Лёгкий тихий ноутбук, батарея на весь день и первый пул-реквест, который приняли.", icon: "💻" },
    overkill: { title: "Космолёт для конспектов", text: "Самый мощный ПК на потоке. Ворд открывается за 0,2 секунды. Наверное.", icon: "🚀" },
    wait:     { title: "Не сегодня",            text: "Иногда лучшая покупка — та, которую ты отложил и обдумал.", icon: "⏳" }
  },

  nodes: {
    /* ───────────── УЛИЦА ───────────── */
    intro: [
      { bg: "street" }, { music: "street" }, { amb: "street" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Суббота, полдень. У дверей компьютерного магазина «Пиксель» пахнет кофе и новыми коробками." },
      { show: "lesha", at: "left", emotion: "neutral" },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Ну всё. Год подработок, ноль пиццы «просто так» — и вот я здесь." },
      { say: "lesha", emotion: "thinking", sfx: null,
        text: "Осталось понять, что именно мне нужно. И не разориться в первые пять минут." },
      { show: "senya", at: "right", emotion: "happy" },
      { say: "senya", emotion: "happy", sfx: "laugh",
        text: "Лёха! Я же говорил — без меня не заходи. Ты опять выберешь видеокарту по цвету коробки." },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Это было один раз! И коробка правда была красивая." },
      { say: "senya", emotion: "thinking", sfx: null,
        text: "Ладно, главный вопрос. Зачем тебе компьютер? От ответа пляшет вся сборка." },
      { choice: [
          { text: "Для учёбы: код, курсовые и немного игр по вечерам", set: { goal: "study" },  goto: "goal_study" },
          { text: "Играть! Нормально, в 1440p, без слайд-шоу",           set: { goal: "games" },  goto: "goal_games" },
          { text: "Стримить и монтировать — как ты",                     set: { goal: "stream" }, goto: "goal_stream" },
          { text: "Учусь программировать — хочу кодить где угодно",      set: { goal: "code" },   goto: "goal_code" }
        ] }
    ],

    goal_code: [
      { say: "senya", emotion: "surprised", sfx: "surprise",
        text: "Программист?! Тогда видеокарта — дело десятое. Важнее батарея, клавиатура и чтобы не весил как кирпич." },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Ага. Курсы по вечерам, пет-проект в выходные, а в декабре — первый хакатон." },
      { say: "senya", emotion: "thinking", sfx: null,
        text: "Только не забудь про меня: мне нужен бот для чата на стриме. Бесплатно. По дружбе." },
      { goto: "to_shop" }
    ],

    code_hint: [
      { say: "vika", emotion: "thinking", sfx: null,
        text: "Хотя для программирования есть вариант интереснее — {codeLaptopName} за {codeLaptopPrice}. Не игровой, зато лёгкий, тихий и до 15 часов от батареи. Покажу на стенде." },
      { say: "lesha", emotion: "surprised", sfx: "surprise",
        text: "Без вентилятора? Совсем? Даже когда компилируешь?" },
      { say: "vika", emotion: "happy", sfx: null,
        text: "Совсем. Слышно будет только, как вы стучите по клавишам." },
      { goto: "stand" }
    ],

    goal_study: [
      { say: "senya", emotion: "neutral", sfx: null,
        text: "Разумно. Значит, нужен тихий и надёжный, без лишних понтов. Хотя немного понтов не помешает." },
      { goto: "to_shop" }
    ],
    goal_games: [
      { say: "senya", emotion: "happy", sfx: "laugh",
        text: "Вот это разговор! Тогда главный герой сборки — видеокарта. Всё остальное — свита." },
      { goto: "to_shop" }
    ],
    goal_stream: [
      { say: "senya", emotion: "surprised", sfx: "surprise",
        text: "Конкурент растёт?! Тогда нужны ядра, много памяти и хороший кодировщик в видеокарте." },
      { say: "senya", emotion: "embarrassed", sfx: null,
        text: "...И ты обязан упомянуть меня на первом стриме. Это не обсуждается." },
      { goto: "to_shop" }
    ],

    to_shop: [
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Договорились. Пошли внутрь, пока я не передумал." },
      { sfx: "door" },
      { goto: "hall" }
    ],

    /* ───────────── ТОРГОВЫЙ ЗАЛ ───────────── */
    hall: [
      { hide: "senya" }, { hide: "lesha" },
      { bg: "hall" }, { music: "shop" }, { amb: "shop" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Внутри — ровный гул вентиляторов, стена мониторов и стенды с подсветкой всех цветов радуги." },
      { show: "lesha", at: "left", emotion: "surprised" },
      { show: "senya", at: "right", emotion: "neutral" },
      { show: "vika", at: "center", emotion: "happy" },
      { say: "vika", emotion: "happy", sfx: "chime",
        text: "Добрый день! Я Вика, консультант. Ищете что-то конкретное — или «просто посмотреть», которое заканчивается тремя пакетами?" },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Скорее первое... Хочу компьютер. Ну, или ноутбук. Я ещё не решил." },
      { say: "vika", emotion: "thinking", sfx: null,
        text: "Честное «не решил» — лучшая отправная точка. Для чего он вам?" },
      { say: "lesha", emotion: "neutral", sfx: null,
        text: "В основном — {goalPhrase}." },
      { say: "vika", emotion: "neutral", sfx: null,
        text: "Поняла. Сразу честно предупрежу: в этом году оперативная память сильно подорожала." },
      { say: "vika", emotion: "sad", sfx: "sigh",
        text: "Комплект DDR5 на 32 гигабайта сейчас стоит как хорошая видеокарта пару лет назад. Чипы памяти массово уходят в серверы для нейросетей." },
      { say: "lesha", emotion: "surprised", sfx: "surprise",
        text: "Серьёзно?! Память дороже процессора?" },
      { say: "senya", emotion: "thinking", sfx: null,
        text: "«Нейросети съели мою оперативку». Звучит как название трека." },
      { say: "vika", emotion: "happy", sfx: "laugh",
        text: "Звучит! Но не грустим: у меня есть три проверенные конфигурации на разные кошельки." },
      { say: "vika", emotion: "neutral", sfx: "menu",
        text: "Сколько вы готовы потратить? Цены — на сегодня, по комплектующим из нашего каталога." },
      { choice: [
          { text: "Уложиться в накопленное — около {budgetTotal}", set: { tier: "budget" }, goto: "tier_budget" },
          { text: "Добавить с подработки — около {midTotal}",       set: { tier: "mid" },    goto: "tier_mid" },
          { text: "Помечтать по-крупному — {highTotal}",            set: { tier: "high" },   goto: "tier_high" }
        ], music: "tense" }
    ],

    tier_budget: [
      { music: "shop" },
      { say: "vika", emotion: "happy", sfx: null,
        text: "Самый популярный выбор! Шесть ядер, RTX 5060 и терабайтный SSD — для Full HD с запасом." },
      { if: { goal: "code" }, goto: "code_hint" },
      { if: { goal: "games" }, goto: "warn_budget_games" },
      { if: { goal: "stream" }, goto: "warn_budget_stream" },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "И на учёбу, и на вечерние катки. Звучит как мой вариант." },
      { goto: "stand" }
    ],
    warn_budget_games: [
      { say: "vika", emotion: "thinking", sfx: null,
        text: "Но честно: для 1440p на высоких он слабоват. Это машина для Full HD — зато какая." },
      { say: "lesha", emotion: "sad", sfx: "sigh",
        text: "Эх. Ну, Full HD — тоже HD." },
      { goto: "stand" }
    ],
    warn_budget_stream: [
      { say: "vika", emotion: "thinking", sfx: null,
        text: "Для стримов этот вариант на грани: 16 ГБ памяти маловато для OBS и игры одновременно. Зато кодировщик NVENC в видеокарте выручит." },
      { say: "senya", emotion: "neutral", sfx: null,
        text: "Я первые полгода стримил на худшем. Главное — начать." },
      { goto: "stand" }
    ],

    tier_mid: [
      { music: "shop" },
      { say: "vika", emotion: "happy", sfx: null,
        text: "Золотая середина: RTX 5060 Ti с 16 гигабайтами и платформа AM5 — на неё потом встанет процессор помощнее." },
      { say: "senya", emotion: "happy", sfx: null,
        text: "16 гигов видеопамяти — для монтажа это прямо подарок." },
      { if: { goal: "code" }, goto: "code_hint" },
      { goto: "stand" }
    ],

    tier_high: [
      { music: "shop" },
      { say: "vika", emotion: "surprised", sfx: "surprise",
        text: "Ого. Тогда без компромиссов: Ryzen 7 9800X3D и RTX 5080. Это уже не компьютер, а космический корабль." },
      { if: { goal: "study" }, goto: "overkill_note" },
      { if: { goal: "code" }, goto: "code_hint" },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Я просто хочу один раз купить и не думать об апгрейде лет пять." },
      { goto: "stand" }
    ],
    overkill_note: [
      { set: { overkill: true } },
      { say: "senya", emotion: "surprised", sfx: "laugh",
        text: "Для курсовых?! Ты будешь писать конспекты в 4K и 240 кадрах?" },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Ну... вдруг курсовые станут очень требовательными." },
      { goto: "stand" }
    ],

    /* ───────────── СТЕНД КОМПЛЕКТУЮЩИХ ───────────── */
    stand: [
      { hide: "senya" },
      { bg: "stand" }, { sfx: "whoosh" },
      { show: "lesha", at: "left", emotion: "neutral" },
      { show: "vika", at: "right", emotion: "neutral" },
      { say: "vika", emotion: "neutral", sfx: null,
        text: "Пройдёмте к стенду — разберём «{buildTitle}» по деталям. На каждой карточке цена, характеристики и ссылка на товар." },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Как инвентарь в игре, только с реальными ценами." },
      { say: "vika", emotion: "happy", sfx: null,
        text: "И с реальными ссылками. Цены я сверяла сегодня — вот, внизу дата проверки." },
      { say: "vika", emotion: "thinking", sfx: null,
        text: "А в блоке «Что тянет» — не только игры. Там видно, как сборка справится с монтажом, кодом, 3D, Photoshop и даже локальными нейросетями." },
      { if: { goal: "study" }, goto: "stand_apps_study" },
      { goto: "stand_open" }
    ],
    stand_apps_study: [
      { say: "lesha", emotion: "happy", sfx: null,
        text: "О, мне как раз важно, чтобы тянул Android Studio и КОМПАС для курсовых." },
      { goto: "stand_open" }
    ],
    stand_open: [
      { shop: true },
      { show: "senya", at: "center", emotion: "neutral" },
      { say: "vika", emotion: "thinking", sfx: null,
        text: "Ну что: собираем системный блок — или берём ноутбук того же уровня?" },
      { say: "lesha", emotion: "thinking", sfx: null,
        text: "Ноутбук можно таскать на пары... Но ПК потом можно апгрейдить по частям." },
      { say: "senya", emotion: "neutral", sfx: null,
        text: "ПК за те же деньги быстрее и тише. Ноут — свобода, но под нагрузкой шумит и греется." },
      { say: "vika", emotion: "neutral", sfx: null,
        text: "Для сравнения: {laptopName} — {laptopPrice}, а сборка — {buildTotal}." },
      { choice: [
          { text: "Беру системный блок", set: { form: "pc" },     goto: "form_pc" },
          { text: "Беру ноутбук",        set: { form: "laptop" }, goto: "form_laptop" },
          { text: "Беру лёгкий ноутбук для кода — {codeLaptopPrice}", set: { form: "coder" }, goto: "form_coder" },
          { text: "Мне нужно подумать ещё", set: { form: "none" }, goto: "wait_path" }
        ], music: "tense" }
    ],

    form_pc: [
      { music: "shop" },
      { say: "vika", emotion: "happy", sfx: "cart",
        text: "Отличный выбор! Соберём и прогоним стресс-тест прямо здесь — сборка бесплатная." },
      { say: "senya", emotion: "happy", sfx: null,
        text: "Кабели уложим красиво. Я прослежу." },
      { goto: "checkout" }
    ],
    form_laptop: [
      { music: "shop" },
      { say: "vika", emotion: "happy", sfx: "cart",
        text: "Ноутбук уже собран и проверен — сразу в рюкзак. Только второй SSD потом докупите, если не хватит места." },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Игры на парах... то есть, конечно, конспекты на парах." },
      { goto: "checkout" }
    ],

    form_coder: [
      { music: "shop" },
      { say: "vika", emotion: "happy", sfx: "cart",
        text: "Для кода — отличный выбор: тишина, батарея на весь день и терминал, как на серверах." },
      { if: { goal: "study" }, goto: "coder_study_warn" },
      { if: { goal: "games" }, goto: "coder_games_warn" },
      { say: "senya", emotion: "thinking", sfx: null,
        text: "Игры на нём, конечно, так себе. Зато бота для моего стрима напишешь хоть в электричке." },
      { goto: "checkout" }
    ],
    coder_study_warn: [
      { say: "vika", emotion: "thinking", sfx: null,
        text: "Одно «но»: КОМПАС-3D под macOS не работает. Если он нужен на курсовой — придётся в компьютерный класс." },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Ничего, черчу я раз в семестр, а кодю каждый день. Переживу." },
      { goto: "checkout" }
    ],
    coder_games_warn: [
      { say: "senya", emotion: "surprised", sfx: "surprise",
        text: "Погоди, ты же хотел играть в 1440p! На этом ноуте даже CS2 не запустится." },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Да... но я посмотрел курсы и понял, что хочу игры делать, а не только играть. Начну с Godot." },
      { goto: "checkout" }
    ],

    /* ───────────── КАССА ───────────── */
    checkout: [
      { hide: "senya" },
      { bg: "checkout" }, { sfx: "whoosh" },
      { show: "lesha", at: "left", emotion: "neutral" },
      { show: "vika", at: "right", emotion: "neutral" },
      { say: "narrator", emotion: "neutral", sfx: "beep",
        text: "Касса. Терминал моргает зелёным, где-то рядом шуршит принтер чеков." },
      { say: "vika", emotion: "neutral", sfx: null,
        text: "Итого: {purchaseName} — {purchaseTotal}. Оплачиваете сейчас?" },
      { say: "lesha", emotion: "thinking", sfx: null,
        text: "Вот он, момент истины..." },
      { choice: [
          { text: "Оплатить", goto: "pay" },
          { text: "Подождать распродажи", goto: "wait_path" }
        ], music: "tense" }
    ],

    pay: [
      { music: "shop" },
      { sfx: "cash" },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Готово! Я... я правда это сделал!" },
      { say: "vika", emotion: "happy", sfx: null,
        text: "Поздравляю! Чек сохраните — гарантия на всё. И приходите рассказать, как оно." },
      { show: "senya", at: "center", emotion: "happy" },
      { say: "senya", emotion: "happy", sfx: "laugh",
        text: "Сегодня вечером тестим! Я принесу пиццу. В этот раз — за мой счёт." },
      { if: { form: "coder" }, goto: "end_coder" },
      { if: { form: "laptop" }, goto: "end_laptop" },
      { if: { overkill: true }, goto: "end_overkill" },
      { if: { tier: "budget" }, goto: "end_study" },
      { if: { tier: "mid" }, goto: "end_gamer" },
      { goto: "end_studio" }
    ],

    wait_path: [
      { music: "shop" },
      { say: "lesha", emotion: "sad", sfx: "sigh",
        text: "Слушайте... давайте я ещё недельку подумаю. Деньги никуда не денутся." },
      { say: "vika", emotion: "neutral", sfx: null,
        text: "Это нормально. Только учтите: цены могут измениться — в обе стороны. Я сохраню вам конфигурацию." },
      { say: "vika", emotion: "happy", sfx: null,
        text: "И если что — пишите, подскажу без всякой спешки." },
      { goto: "end_wait" }
    ],

    /* ───────────── КОНЦОВКИ ───────────── */
    end_study: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "room" }, { music: "ending" }, { amb: "pc" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Вечер. На столе тихо гудит новый «Старт», в углу экрана — открытая курсовая и чат с одногруппниками." },
      { show: "lesha", at: "center", emotion: "happy" },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Код компилируется за секунды, игры летают в Full HD. А главное — я уложился в бюджет." },
      { say: "lesha", emotion: "thinking", sfx: null,
        text: "Через год добавлю ещё 16 гигабайт памяти. Если она когда-нибудь подешевеет." },
      { ending: "study" }
    ],

    end_gamer: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "room" }, { music: "ending" }, { amb: "pc" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Ночь. Монитор светится закатом из любимой игры, счётчик кадров уверенно держится за шестьдесят." },
      { show: "lesha", at: "left", emotion: "happy" },
      { show: "senya", at: "right", emotion: "surprised" },
      { say: "senya", emotion: "surprised", sfx: "surprise",
        text: "1440p, высокие, и даже 16 гигов видеопамяти не кончились? Кажется, я тебе завидую." },
      { say: "lesha", emotion: "happy", sfx: "laugh",
        text: "А когда захочу — поставлю процессор помощнее. Плата AM5, всё продумано!" },
      { ending: "gamer" }
    ],

    end_studio: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "room" }, { music: "ending" }, { amb: "pc" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Вечер. В комнате ровно светится «Флагман»: в одном окне монтаж в 4K, в другом — идёт стрим." },
      { show: "lesha", at: "left", emotion: "happy" },
      { show: "senya", at: "right", emotion: "happy" },
      { say: "senya", emotion: "happy", sfx: null,
        text: "Рендер ролика за пару минут, стрим без единого дропа. Ты точно новичок?" },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Новичок с очень хорошим компьютером. Осталось научиться так же хорошо шутить в эфире." },
      { ending: "studio" }
    ],

    end_overkill: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "room" }, { music: "ending" }, { amb: "pc" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Ночь перед дедлайном. Самый мощный компьютер в общежитии с гордостью открывает текстовый редактор." },
      { show: "lesha", at: "center", emotion: "embarrassed" },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Курсовая открылась за 0,2 секунды. Написал я её, правда, тоже за ночь." },
      { say: "lesha", emotion: "happy", sfx: "laugh",
        text: "Зато перерывы на игры в 4K — просто космос. Надо бы освоить монтаж, чтобы он не скучал." },
      { ending: "overkill" }
    ],

    end_laptop: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "room" }, { music: "ending" }, { amb: "pc" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Вечер. Новый ноутбук стоит на столе, а завтра поедет в рюкзаке на пары и к Сене на выходные." },
      { show: "lesha", at: "center", emotion: "happy" },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Не так тихо, как системник, зато вся моя «игровая» помещается под мышкой." },
      { say: "lesha", emotion: "thinking", sfx: null,
        text: "Надо будет купить подставку с охлаждением. И второй SSD. И, кажется, ещё одну пиццу." },
      { ending: "laptop" }
    ],

    end_coder: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "room" }, { music: "ending" }, { amb: null },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Две недели спустя. Ночь, в комнате тихо — вентиляторов не слышно, только стук клавиш. В терминале зелёным горит: «All tests passed»." },
      { show: "lesha", at: "left", emotion: "happy" },
      { say: "lesha", emotion: "happy", sfx: null,
        text: "Первый пул-реквест приняли! А ноутбук за весь день ни разу не попросил зарядку." },
      { show: "senya", at: "right", emotion: "happy" },
      { say: "senya", emotion: "happy", sfx: "laugh",
        text: "Бот для моего чата работает! Он уже трижды забанил меня самого. Это фича или баг?" },
      { say: "lesha", emotion: "embarrassed", sfx: null,
        text: "Это... фича. Наверное. Завтра пофикшу — прямо на паре." },
      { ending: "coder" }
    ],

    end_wait: [
      { hide: "vika" }, { hide: "senya" }, { hide: "lesha" },
      { bg: "street" }, { music: "ending" }, { amb: "street" },
      { say: "narrator", emotion: "neutral", sfx: null,
        text: "Лёша выходит на улицу. Солнце уже клонится к вечеру, а в телефоне — сохранённая конфигурация." },
      { show: "lesha", at: "left", emotion: "thinking" },
      { show: "senya", at: "right", emotion: "sad" },
      { say: "senya", emotion: "sad", sfx: "sigh",
        text: "Эх, а я уже придумал название для нашего первого совместного стрима..." },
      { say: "lesha", emotion: "happy", sfx: "laugh",
        text: "Придержи его. Через неделю вернёмся — и я буду точно знать, чего хочу." },
      { ending: "wait" }
    ]
  }
};
