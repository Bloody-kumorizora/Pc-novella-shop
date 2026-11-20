/*
 * Каталог товаров для визуальной новеллы «Пиксель: три компьютера».
 * Все цены и ссылки проверены вручную в браузере 14.11.2026 на сайте Ситилинк (citilink.ru):
 * каждая ссылка открыта, название товара совпадает, статус — «в наличии» (schema.org InStock).
 * price — цена, показанная в карточке поиска на дату проверки (при онлайн-оплате магазин иногда даёт на 0,3–2% меньше).
 * FPS в блоках perf — ориентиры: «≈» означает оценку, а не точный замер именно этой конфигурации.
 */
window.DATA = window.DATA || {};

window.DATA.products = {
  checkedAt: "2026-11-14",
  checkedAtHuman: "14 ноября 2026",
  currency: "₽",
  region: "Россия",
  store: "Ситилинк",

  builds: [
    {
      id: "budget",
      title: "Бюджетный ПК «Старт»",
      tagline: "Full HD-игры, учёба, код",
      platform: "AM4 · DDR4",
      parts: [
        {
          category: "cpu", model: "AMD Ryzen 5 5600 OEM [100-000000927]", price: 11490,
          url: "https://www.citilink.ru/product/processor-amd-ryzen-5-5600-am4-oem-100-000000927-1970792/",
          specs: ["6 ядер / 12 потоков", "до 4,4 ГГц", "Socket AM4", "TDP 65 Вт", "OEM — без кулера в комплекте"]
        },
        {
          category: "cooler", model: "DeepCool AK400 [R-AK400-BKNNMN-G-1]", price: 2200,
          url: "https://www.citilink.ru/product/ustroistvo-ohlazhdeniya-kuler-deepcool-ak400-120mm-ret-1999698/",
          specs: ["Башня, 4 теплотрубки, 120 мм", "Высота 155 мм", "AM4 / AM5 / LGA1700"]
        },
        {
          category: "motherboard", model: "Gigabyte B550M K", price: 7580,
          url: "https://www.citilink.ru/product/materinskaya-plata-gigabyte-b550m-k-socketam4-amd-b550-matx-ret-1896764/",
          specs: ["Socket AM4, чипсет B550", "mATX", "4× DDR4", "2× M.2"]
        },
        {
          category: "ram", model: "Patriot Signature PSD416G3200K, 2×8 ГБ DDR4-3200", price: 13990,
          url: "https://www.citilink.ru/product/operativnaya-pamyat-patriot-signature-psd416g3200k-ddr4-2x-8gb-3200mgc-1808633/",
          specs: ["16 ГБ (2×8 ГБ)", "DDR4-3200", "Двухканальный режим"]
        },
        {
          category: "gpu", model: "MSI GeForce RTX 5060 8G INSPIRE 2X OC", price: 54350,
          url: "https://www.citilink.ru/product/videokarta-msi-pci-e-5-0-rtx-5060-8g-inspire-2x-oc-nv-rtx5060-8gb-128b-2131076/",
          specs: ["8 ГБ GDDR7, 128 бит", "Длина 204 мм", "Рекоменд. БП 550 Вт", "DLSS 4, NVENC"]
        },
        {
          category: "ssd", model: "KingSpec NX-1TB, M.2 2280 NVMe", price: 14990,
          url: "https://www.citilink.ru/product/ssd-nakopitel-kingspec-nx-1tb-1tb-m-2-2280-pcie-3-0-x4-nvme-1742085/",
          specs: ["1 ТБ", "PCIe 3.0 ×4 NVMe", "M.2 2280"]
        },
        {
          category: "psu", model: "MSI MAG A550BN [306-7ZP2A11-CE0]", price: 4500,
          url: "https://www.citilink.ru/product/blok-pitaniya-msi-mag-a550bn-550vt-120mm-chernyi-retail-306-7zp2a11-ce-1979771/",
          specs: ["550 Вт", "80 PLUS Bronze", "2× PCIe 6+2 pin", "CPU 4+4 pin"]
        },
        {
          category: "case", model: "Zalman T4 Plus, Mini-Tower", price: 4190,
          url: "https://www.citilink.ru/product/korpus-zalman-zm-t4-plus-chernyi-bez-bp-matx-3x120mm-1xusb2-0-1xusb3-0-2057643/",
          specs: ["mATX", "Кулер CPU до 157 мм", "3 вентилятора 120 мм в комплекте"]
        }
      ],
      compatibility: [
        "Сокет AM4: Ryzen 5 5600 ↔ B550M K — совпадает (у новых партий плат BIOS поддерживает Ryzen 5000 «из коробки»).",
        "Память DDR4 ↔ плата 4× DDR4 — совпадает.",
        "Питание: RTX 5060 (~145 Вт) + Ryzen 5 5600 (65 Вт) + остальное ≈ 280 Вт пиковой нагрузки. БП 550 Вт — запас ~95%, производитель карты рекомендует 550 Вт.",
        "Габариты: видеокарта 204 мм — корпус mATX свободно; кулер 155 мм ≤ 157 мм лимита корпуса (впритык, но влезает).",
        "Разъёмы: карте нужен один 8-pin — у БП есть 2× 6+2 pin."
      ],
      perf: {
        games: [
          { game: "Cyberpunk 2077", mode: "1080p, High, без RT", fps: "≈ 90", estimate: true, source: "TechSpot: RTX 5060 ≈ 100 fps (с более быстрым CPU), поправка на Ryzen 5 5600" },
          { game: "Counter-Strike 2", mode: "1080p, High", fps: "≈ 250", estimate: true, source: "iChip (тест в 23 играх): ≈ 290 fps; с Ryzen 5 5600 ниже — упор в CPU" },
          { game: "Forza Horizon 5", mode: "1080p, Extreme", fps: "≈ 110", estimate: true, source: "iChip: ≈ 120 fps на максимальных" },
          { game: "Fortnite", mode: "1080p, High, DX12", fps: "≈ 130", estimate: true, source: "Оценка по уровню RTX 5060, прямого замера нет" }
        ],
        work: [
          "Монтаж: 1080p в DaVinci Resolve / Premiere — комфортно; 4K — с прокси-файлами.",
          "Стримы: 1080p60 через NVENC без заметной потери FPS; 16 ГБ ОЗУ — предел для OBS + игра + браузер.",
          "Учёба и работа: код, офис, Figma, браузер с 50 вкладками — без проблем."
        ],
        apps: {
          office:  ["great", "Без задержек."],
          code:    ["ok", "VS Code и PyCharm — отлично; Android Studio с эмулятором и Docker упираются в 16 ГБ ОЗУ."],
          photo:   ["great", "16 ГБ ОЗУ — рекомендация Adobe для Photoshop; ИИ-фильтры ускоряет RTX 5060."],
          video:   ["ok", "1080p — комфортно (Adobe: 16 ГБ для HD). Для 4K Adobe рекомендует 32 ГБ — пока только с прокси."],
          stream:  ["ok", "NVENC разгружает процессор, но 16 ГБ ОЗУ — впритык для OBS + игры + браузера."],
          blender: ["ok", "Рендер на OptiX быстрый, но 8 ГБ видеопамяти и 16 ГБ ОЗУ (Blender рекомендует 32 ГБ) ограничивают сложные сцены."],
          gamedev: ["limited", "Epic рекомендует 32 ГБ ОЗУ: с 16 ГБ редактор UE5 запускается, но тяжёлые уровни и сборка шейдеров тормозят. Unity и 2D — нормально."],
          cad:     ["great", "2D-чертежи и учебные 3D-сборки — без проблем."],
          ai:      ["limited", "8 ГБ видеопамяти: языковые модели примерно до 8 млрд параметров (4-бит), SDXL — медленно."]
        },
        sources: [
          { title: "TechSpot — GeForce RTX 5060 review", url: "https://www.techspot.com/review/2992-nvidia-geforce-rtx-5060/" },
          { title: "iChip — RTX 5060 протестировали в 23 играх 1080p", url: "https://ichip.ru/novosti/ideal-dlya-full-hd-geforce-rtx-5060-protestirovali-v-23-igrah-v-razreshenii-1080p-917492" }
        ]
      },
      laptop: {
        model: "ASUS TUF Gaming 16 FX610JH-TU073 (2026)",
        price: 119999,
        url: "https://www.citilink.ru/product/noutbuk-asus-tuf-gaming-fx610jh-tu073-i5-14450hx-16gb-ssd512gb-rtx5050-2196684/",
        officialUrl: "https://www.asus.com/ru/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-16-2026/techspec/",
        specs: ["16\" IPS 1920×1200, 144 Гц", "Intel Core i5-14450HX (10 ядер)", "RTX 5050 Laptop 8 ГБ, TGP 85 Вт", "16 ГБ DDR5-5600, SSD 512 ГБ", "Без ОС"],
        perf: {
          games: [
            { game: "Cyberpunk 2077", mode: "1080p, High, без RT", fps: "≈ 60", estimate: true, source: "Оценка по уровню RTX 5050 Laptop 85 Вт" },
            { game: "Counter-Strike 2", mode: "1080p, High", fps: "≈ 200", estimate: true, source: "Оценка" },
            { game: "Forza Horizon 5", mode: "1080p, High", fps: "≈ 90", estimate: true, source: "Оценка" }
          ],
          work: [
            "Учёба и работа: отлично, но это 16-дюймовый игровой ноутбук с внешним блоком питания — не ультрабук.",
            "Монтаж 1080p — да; стримы — да, но шумно под нагрузкой.",
            "SSD всего 512 ГБ — придётся докупить второй (есть второй слот)."
          ],
          apps: {
            office:  ["great", "Без задержек, можно носить с собой."],
            code:    ["ok", "16 ГБ ОЗУ и SSD 512 ГБ — тесно для эмуляторов и Docker; память и второй SSD можно добавить."],
            photo:   ["great", "16 ГБ — рекомендация Adobe; экран 100% sRGB."],
            video:   ["ok", "1080p — да; 4K — только с прокси, Adobe рекомендует 32 ГБ."],
            stream:  ["ok", "NVENC есть, но под нагрузкой шумно, а ОЗУ впритык."],
            blender: ["ok", "RTX 5050 8 ГБ — для учебных сцен; сложные упрутся в память."],
            gamedev: ["limited", "16 ГБ ОЗУ — вдвое меньше рекомендации Epic для UE5; Unity и 2D — нормально."],
            cad:     ["great", "2D и учебные 3D-модели — без проблем."],
            ai:      ["limited", "8 ГБ видеопамяти: небольшие модели (до ~8 млрд параметров, 4-бит)."]
          },
          sources: [
            { title: "91mobiles — ASUS TUF Gaming 16 (FX610JH) review", url: "https://www.91mobiles.com/reviews/asus-tuf-gaming-16-fx610jh-2026-review/" }
          ]
        }
      }
    },

    {
      id: "mid",
      title: "Средний ПК «Баланс»",
      tagline: "1440p-игры, стримы, апгрейд на годы",
      platform: "AM5 · DDR5",
      parts: [
        {
          category: "cpu", model: "AMD Ryzen 5 7500F OEM [100-000000597]", price: 12990,
          url: "https://www.citilink.ru/product/processor-amd-ryzen-5-7500f-am5-oem-100-000000597-2005596/",
          specs: ["6 ядер / 12 потоков", "до 5,0 ГГц", "Socket AM5", "Без встроенной графики", "OEM — без кулера"]
        },
        {
          category: "cooler", model: "DeepCool AK400 [R-AK400-BKNNMN-G-1]", price: 2200,
          url: "https://www.citilink.ru/product/ustroistvo-ohlazhdeniya-kuler-deepcool-ak400-120mm-ret-1999698/",
          specs: ["Башня, 4 теплотрубки, 120 мм", "Высота 155 мм", "AM5 в комплекте крепления"]
        },
        {
          category: "motherboard", model: "Gigabyte B650M D3HP AX", price: 11300,
          url: "https://www.citilink.ru/product/materinskaya-plata-gigabyte-b650m-d3hp-ax-socketam5-amd-b650-matx-ret-2001037/",
          specs: ["Socket AM5, чипсет B650", "mATX", "4× DDR5", "Wi-Fi (AX) + Bluetooth"]
        },
        {
          category: "ram", model: "Patriot Viper Elite 5 VEB532G6030KW, 2×16 ГБ DDR5-6000", price: 61800,
          url: "https://www.citilink.ru/product/pamyat-ddr5-2x16gb-6000mhz-patriot-veb532g6030kw-viper-elite-5-rtl-pc5-2194864/",
          specs: ["32 ГБ (2×16 ГБ)", "DDR5-6000, CL30", "Профиль EXPO"]
        },
        {
          category: "gpu", model: "MSI GeForce RTX 5060 Ti 16G INSPIRE 2X OC", price: 91280,
          url: "https://www.citilink.ru/product/videokarta-msi-pci-e-5-0-rtx-5060-ti-16g-inspire-2x-oc-nv-rtx-5060ti-1-2110859/",
          specs: ["16 ГБ GDDR7, 128 бит", "Длина 204 мм", "Рекоменд. БП 600 Вт", "DLSS 4, NVENC (AV1)"]
        },
        {
          category: "ssd", model: "KingSpec XF-1TB, M.2 2280 NVMe", price: 17630,
          url: "https://www.citilink.ru/product/ssd-nakopitel-kingspec-xf-1tb-1tb-m-2-2280-pcie-4-0-x4-nvme-1742088/",
          specs: ["1 ТБ", "PCIe 4.0 ×4 NVMe", "M.2 2280"]
        },
        {
          category: "psu", model: "DeepCool GamerStorm PN750M V2 Gen.5", price: 7830,
          url: "https://www.citilink.ru/product/blok-pitaniya-deepcool-atx-750w-pn750m-v2-gen-5-80-gold-20-4pin-apfc-1-2062645/",
          specs: ["750 Вт", "80 PLUS Gold, ATX 3.1", "3× PCIe 6+2 + 16-pin 12V-2x6", "Модульный"]
        },
        {
          category: "case", model: "DeepCool CC560 ARGB V3, Midi-Tower", price: 6100,
          url: "https://www.citilink.ru/product/korpus-deepcool-cc560-argb-v3-chernyi-bez-bp-atx-2x120mm-4x140mm-1xusb-2199342/",
          specs: ["ATX / mATX", "Видеокарта до 370 мм", "Кулер до 165 мм", "БП до 170 мм"]
        }
      ],
      compatibility: [
        "Сокет AM5: Ryzen 5 7500F ↔ B650M D3HP AX — совпадает.",
        "Память DDR5 ↔ плата 4× DDR5 — совпадает; 6000 МГц включается профилем EXPO (в спецификации базово «до 5200»).",
        "Питание: RTX 5060 Ti (~180 Вт) + 7500F (~90 Вт в пике) + остальное ≈ 330 Вт. БП 750 Вт — запас > 100%, рекомендация производителя — 600 Вт.",
        "Габариты: видеокарта 204 мм ≤ 370 мм; кулер 155 мм ≤ 165 мм; mATX-плата встаёт в ATX-корпус.",
        "Встроенной графики у 7500F нет — монитор подключается к видеокарте."
      ],
      perf: {
        games: [
          { game: "Cyberpunk 2077", mode: "1440p, High, без RT", fps: "≈ 79", estimate: true, source: "TechSpot: RTX 5060 Ti 16GB ≈ 79 fps в 1440p (уровень RTX 4070), тестовый стенд с более быстрым CPU" },
          { game: "Cyberpunk 2077", mode: "1440p, RT + DLSS Quality", fps: "≈ 45–50", estimate: true, source: "Оценка по обзорам RTX 5060 Ti 16GB" },
          { game: "Counter-Strike 2", mode: "1440p, High", fps: "≈ 300", estimate: true, source: "Оценка" },
          { game: "Forza Horizon 5", mode: "1440p, Extreme", fps: "≈ 110", estimate: true, source: "Оценка по обзорам RTX 5060 Ti" }
        ],
        work: [
          "Монтаж: 4K-таймлайн в DaVinci Resolve — уверенно, 16 ГБ видеопамяти помогают с эффектами.",
          "Стримы: 1080p60 / 1440p через NVENC AV1, 32 ГБ ОЗУ хватает на OBS + игру + чат.",
          "Апгрейд: на AM5 позже можно поставить Ryzen 7/9 без замены платы."
        ],
        apps: {
          office:  ["great", "Без задержек."],
          code:    ["great", "32 ГБ хватает на IDE + эмулятор Android + Docker одновременно."],
          photo:   ["great", "Большие PSD со слоями и ИИ-функции — быстро."],
          video:   ["great", "32 ГБ — рекомендация Adobe для 4K; 16 ГБ видеопамяти дают запас для эффектов и Fusion в Resolve."],
          stream:  ["great", "OBS + игра в 1440p, кодирование AV1 на видеокарте, памяти с запасом."],
          blender: ["great", "16 ГБ видеопамяти и 32 ГБ ОЗУ — уровень рекомендаций Blender (ядер 6 вместо рекомендуемых 8, но рендер идёт на видеокарте)."],
          gamedev: ["ok", "32 ГБ ОЗУ и 16 ГБ видеопамяти соответствуют рекомендациям Epic; на 6 ядрах компиляция и сборка шейдеров медленнее, чем на 8+."],
          cad:     ["great", "Сложные 3D-сборки и чертежи — комфортно."],
          ai:      ["ok", "16 ГБ видеопамяти: модели примерно до 14 млрд параметров (4-бит), SDXL и Flux в облегчённых форматах."]
        },
        sources: [
          { title: "TechSpot — GeForce RTX 5060 Ti 16GB review", url: "https://www.techspot.com/review/2979-nvidia-geforce-rtx-5060-ti-16gb" },
          { title: "Tom's Hardware — RTX 5060 Ti 16GB review", url: "https://www.tomshardware.com/pc-components/gpus/nvidia-geforce-rtx-5060-ti-16gb-review/6" }
        ]
      },
      laptop: {
        model: "ASUS TUF Gaming A18 FA808PR-S8046 (2025)",
        price: 209999,
        url: "https://www.citilink.ru/product/noutbuk-asus-tuf-gaming-fa808pr-s8046-ryzen-9-8940hx-16gb-ssd512gb-rtx-2173469/",
        officialUrl: "https://www.asus.com/ru/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a18-2025/techspec/",
        specs: ["18\" IPS", "AMD Ryzen 9 8940HX (16 ядер)", "RTX 5070 Ti Laptop 12 ГБ, TGP 140 Вт", "16 ГБ DDR5-5600, SSD 512 ГБ", "Без ОС"],
        perf: {
          games: [
            { game: "Cyberpunk 2077", mode: "1440p, High, без RT", fps: "≈ 70", estimate: true, source: "Оценка по уровню RTX 5070 Ti Laptop 140 Вт" },
            { game: "Counter-Strike 2", mode: "1440p, High", fps: "≈ 280", estimate: true, source: "Оценка" },
            { game: "Forza Horizon 5", mode: "1440p, Extreme", fps: "≈ 100", estimate: true, source: "Оценка" }
          ],
          work: [
            "16 ядер — монтаж и рендер быстрее, чем на 7500F.",
            "Стримы — да, но 16 ГБ ОЗУ стоит расширить до 32 ГБ.",
            "18 дюймов — это скорее «настольный» ноутбук, чем рюкзачный."
          ],
          apps: {
            office:  ["great", "Без задержек."],
            code:    ["ok", "16 ядер — быстрая компиляция, но 16 ГБ ОЗУ стоит расширить до 32 ГБ."],
            photo:   ["great", "Мощный процессор и видеокарта — быстро."],
            video:   ["ok", "Процессор и 12 ГБ видеопамяти сильные, но для 4K Adobe рекомендует 32 ГБ ОЗУ — после апгрейда памяти будет отлично."],
            stream:  ["ok", "Производительности хватает, но ОЗУ впритык и под нагрузкой шумно."],
            blender: ["great", "RTX 5070 Ti Laptop с 12 ГБ видеопамяти — быстрый рендер Cycles."],
            gamedev: ["ok", "16 ядер помогают при сборке, но 16 ГБ ОЗУ — вдвое меньше рекомендации Epic."],
            cad:     ["great", "Сложные сборки — комфортно, большой 18-дюймовый экран."],
            ai:      ["ok", "12 ГБ видеопамяти: модели примерно до 12 млрд параметров (4-бит), SDXL — нормально."]
          },
          sources: [
            { title: "LaptopMedia — ASUS TUF Gaming A18 FA808", url: "https://laptopmedia.com/gb/series/asus-tuf-gaming-a18-fa808/" }
          ]
        }
      }
    },

    {
      id: "high",
      title: "Дорогой ПК «Флагман»",
      tagline: "4K, стримы в 1440p, монтаж 4K/6K",
      platform: "AM5 · DDR5 · X870",
      parts: [
        {
          category: "cpu", model: "AMD Ryzen 7 9800X3D OEM [100-000001084]", price: 43990,
          url: "https://www.citilink.ru/product/processor-amd-ryzen-7-9800x3d-am5-100-000001084-4-3ghz-amd-radeon-oem-2073002/",
          specs: ["8 ядер / 16 потоков", "96 МБ L3 (3D V-Cache)", "Socket AM5", "TDP 120 Вт"]
        },
        {
          category: "cooler", model: "DeepCool LE360 V2 (СЖО 360 мм)", price: 6400,
          url: "https://www.citilink.ru/product/sistema-vodyanogo-ohlazhdeniya-deepcool-le360-v2-argb-soc-am5-am4-1200-2097025/",
          specs: ["Радиатор 360 мм (длина 402 мм)", "3× 120 мм ARGB", "AM5 / AM4 / LGA1700"]
        },
        {
          category: "motherboard", model: "Gigabyte X870 AORUS ELITE WIFI7", price: 26140,
          url: "https://www.citilink.ru/product/materinskaya-plata-gigabyte-x870-a-elite-wifi7-socketam5-amd-x870-4xdd-2054515/",
          specs: ["Socket AM5, чипсет X870", "ATX", "4× DDR5", "Wi-Fi 7, USB4"]
        },
        {
          category: "ram", model: "Patriot Viper Xtreme 5 RGB PVXR532G60C30K, 2×16 ГБ DDR5-6000", price: 62440,
          url: "https://www.citilink.ru/product/pamyat-ddr5-2x16gb-6000mhz-patriot-pvxr532g60c30k-viper-xtreme-5-rgb-r-2198476/",
          specs: ["32 ГБ (2×16 ГБ)", "DDR5-6000, CL30", "EXPO / XMP"]
        },
        {
          category: "gpu", model: "Palit GeForce RTX 5080 GamingPro V1 [NE75080019T2-GB2031Y]", price: 248930,
          url: "https://www.citilink.ru/product/videokarta-palit-pci-e-5-0-rtx5080-gamingpro-nv-rtx5080-16gb-256bit-gd-2103747/",
          specs: ["16 ГБ GDDR7, 256 бит", "Длина 331,9 мм", "Рекоменд. БП 850 Вт", "Питание 16-pin 12V-2x6"]
        },
        {
          category: "ssd", model: "Samsung 990 PRO 2 ТБ [MZ-V9P2T0BW]", price: 41990,
          url: "https://www.citilink.ru/product/ssd-nakopitel-samsung-990-pro-mz-v9p2t0bw-2tb-m-2-2280-pcie-4-0-x4-nvm-1899984/",
          specs: ["2 ТБ", "PCIe 4.0 ×4 NVMe", "до 7450 МБ/с"]
        },
        {
          category: "psu", model: "Seasonic Focus GX-1000 (ATX 3.1)", price: 20100,
          url: "https://www.citilink.ru/product/blok-pitaniya-seasonic-atx-1000w-focus-gx-1000-80-gold-24pin-apfc-135m-2031164/",
          specs: ["1000 Вт", "80 PLUS Gold, ATX 3.1", "16-pin 12VHPWR + 3× PCIe 6+2", "Модульный"]
        },
        {
          category: "case", model: "Lian Li Lancool 216 (без RGB), Midi-Tower", price: 9600,
          url: "https://www.citilink.ru/product/korpus-atx-lian-li-lancool-216-bez-rgb-midi-tower-bez-bp-chernyi-g99-l-2008408/",
          specs: ["ATX", "Видеокарта до 392 мм", "Кулер до 180,5 мм, БП до 220 мм", "Радиатор 360 мм спереди/сверху"]
        }
      ],
      compatibility: [
        "Сокет AM5: Ryzen 7 9800X3D ↔ X870 AORUS ELITE — совпадает.",
        "Память DDR5-6000 CL30 — «золотая» частота для Ryzen 9000, включается EXPO.",
        "Питание: RTX 5080 (~360 Вт) + 9800X3D (~120 Вт) + остальное ≈ 560 Вт. БП 1000 Вт — запас ~78%, рекомендация производителя карты — 850 Вт. Нативный кабель 16-pin в комплекте БП.",
        "Габариты: видеокарта 331,9 мм ≤ 392 мм; радиатор СЖО 360 мм ставится во фронт или верх Lancool 216 (по данным Lian Li).",
        "Длина БП Seasonic (140 мм) ≤ 220 мм лимита корпуса."
      ],
      perf: {
        games: [
          { game: "Cyberpunk 2077", mode: "4K, Ultra, без RT", fps: "≈ 60–65", estimate: true, source: "The FPS Review / PCWorld: RTX 5080 на ~28–32% быстрее RTX 4080 Super в 4K" },
          { game: "Cyberpunk 2077", mode: "4K, RT Ultra + DLSS", fps: "≈ 50", estimate: true, source: "Обзоры RTX 5080 (без генерации кадров)" },
          { game: "Alan Wake 2", mode: "1440p, RT Ultra", fps: "≈ 60", estimate: true, source: "KitGuru: в среднем ≈ 60 fps в 1440p с трассировкой" },
          { game: "Counter-Strike 2", mode: "1440p, High", fps: "≈ 500", estimate: true, source: "Оценка: 9800X3D — один из самых быстрых игровых CPU" }
        ],
        work: [
          "Монтаж: 4K/6K в DaVinci Resolve, тяжёлые эффекты и цветокор — без прокси.",
          "Стримы: 1440p60 через двойной NVENC (AV1) параллельно с записью.",
          "3D, рендер, нейросети локально — 16 ГБ видеопамяти хватает на большинство задач."
        ],
        apps: {
          office:  ["great", "Без задержек."],
          code:    ["great", "Большие проекты, несколько эмуляторов и контейнеров — без ожидания."],
          photo:   ["great", "Любые размеры файлов и ИИ-функции — мгновенно."],
          video:   ["great", "4K/6K, тяжёлый цветокор и эффекты без прокси."],
          stream:  ["great", "Стрим в 1440p и запись параллельно, два кодировщика NVENC."],
          blender: ["great", "RTX 5080 — одна из самых быстрых карт для Cycles; 8 ядер и 32 ГБ — уровень рекомендаций Blender."],
          gamedev: ["great", "8 ядер, 32 ГБ и RTX 5080 — выше рекомендаций Epic для UE5 с Lumen и Nanite."],
          cad:     ["great", "Крупные сборки и визуализация — без ограничений."],
          ai:      ["great", "Те же 16 ГБ видеопамяти, что у средней сборки, но заметно быстрее; для моделей 30+ млрд параметров 16 ГБ мало."]
        },
        sources: [
          { title: "TechSpot — GeForce RTX 5080 review", url: "https://www.techspot.com/review/2947-nvidia-geforce-rtx-5080/" },
          { title: "KitGuru — RTX 5080 review", url: "https://www.kitguru.net/components/graphic-cards/dominic-moass/nvidia-rtx-5080-review-efficiency-gains-but-a-performance-letdown/all/1" },
          { title: "The FPS Review — RTX 5080 FE review", url: "https://www.thefpsreview.com/2025/01/29/nvidia-geforce-rtx-5080-founders-edition-video-card-review/6" }
        ]
      },
      laptop: {
        model: "ASUS ROG Strix SCAR 18 G835LWG-SA280 (2026)",
        price: 394999,
        url: "https://www.citilink.ru/product/noutbuk-asus-rog-strix-g835lwg-sa280-ul9-290hx-plus-32gb-ssd1tb-rtx508-2173453/",
        officialUrl: "https://rog.asus.com/ru/laptops/rog-strix/rog-strix-scar-18-2026/spec/",
        specs: ["18\" Mini-LED 2560×1600, 240 Гц", "Intel Core Ultra 9 290HX Plus (24 ядра)", "RTX 5080 Laptop 16 ГБ, TGP 175 Вт", "32 ГБ DDR5-6400, SSD 1 ТБ", "Без ОС"],
        perf: {
          games: [
            { game: "Cyberpunk 2077", mode: "1600p, Ultra, без RT", fps: "≈ 85", estimate: true, source: "Оценка по уровню RTX 5080 Laptop 175 Вт" },
            { game: "Alan Wake 2", mode: "1600p, High + DLSS", fps: "≈ 70", estimate: true, source: "Оценка" },
            { game: "Counter-Strike 2", mode: "1600p, High", fps: "≈ 350", estimate: true, source: "Оценка" }
          ],
          work: [
            "Монтаж 4K — да, экран Mini-LED с 100% DCI-P3 подходит для цветокора.",
            "Стримы — да; под нагрузкой ноутбук громкий, блок питания крупный.",
            "Мобильная RTX 5080 заметно слабее настольной RTX 5080."
          ],
          apps: {
            office:  ["great", "Без задержек."],
            code:    ["great", "24 ядра и 32 ГБ — большие проекты и эмуляторы без ожидания."],
            photo:   ["great", "Экран Mini-LED со 100% DCI-P3 — удобно для работы с цветом."],
            video:   ["great", "4K-монтаж и цветокор; 32 ГБ — уровень рекомендации Adobe для 4K."],
            stream:  ["great", "Стрим и запись параллельно; под нагрузкой ноутбук громкий."],
            blender: ["great", "RTX 5080 Laptop 16 ГБ — быстрый рендер, но медленнее настольной RTX 5080."],
            gamedev: ["great", "24 ядра и 32 ГБ — выше рекомендаций Epic для UE5."],
            cad:     ["great", "Крупные сборки — без ограничений."],
            ai:      ["great", "16 ГБ видеопамяти — как у настольных сборок, но мобильный чип медленнее."]
          },
          sources: [
            { title: "ASUS ROG — пресс-релиз ROG Strix SCAR 18 (2026)", url: "https://press.asus.com/news/press-releases/rog-strix-scar-18-gaming-laptop-4k-240hz-mini-led/" }
          ]
        }
      }
    }
  ],

  /* Отдельный лёгкий ноутбук для программирования (не игровой). Проверен 18.11.2026 в Ситилинке, в наличии. */
  codingLaptop: {
    model: "Apple MacBook Air 13 (2026), M5, 16 ГБ, 512 ГБ [MDHE4HN/A]",
    shortName: "MacBook Air 13 на M5",
    price: 141490,
    checkedAt: "2026-11-18",
    url: "https://www.citilink.ru/product/noutbuk-apple-macbook-air-a3449-m5-10-core-16gb-ssd512gb-8-core-gpu-13-2204346/",
    officialUrl: "https://support.apple.com/en-us/126320",
    specs: [
      "13,6\" Liquid Retina 2560×1664, 500 нит",
      "Apple M5: 10 ядер CPU, 8 ядер GPU",
      "16 ГБ общей памяти, SSD 512 ГБ",
      "Без вентилятора — полная тишина",
      "До 15 ч веб-сёрфинга / 18 ч видео (данные Apple), 1,23 кг",
      "macOS"
    ],
    why: [
      "Батареи хватает на весь день пар, курсов или хакатона — зарядку можно оставить дома.",
      "Лёгкий и тонкий: 1,23 кг против 2+ кг у игровых ноутбуков.",
      "macOS — Unix-подобная система: терминал, Homebrew, Python и Node.js работают почти как на Linux-серверах.",
      "Для приложений под iPhone нужен Xcode, а он работает только на Mac.",
      "Минусы: игр мало, КОМПАС-3D и часть Windows-программ не запускаются, память не расширить — 16 ГБ навсегда."
    ],
    perf: {
      games: [
        { game: "Counter-Strike 2", mode: "—", fps: "нет", estimate: false, source: "Версии CS2 для macOS нет" },
        { game: "Cyberpunk 2077", mode: "Mac-версия, низкие", fps: "≈ 30", estimate: true, source: "Оценка: 8-ядерная графика M5, без замера" },
        { game: "Инди и браузерные игры", mode: "—", fps: "плавно", estimate: true, source: "Оценка" }
      ],
      work: [
        "Программирование: VS Code, JetBrains, Xcode, Android Studio — нативно на Apple Silicon.",
        "Учёба и работа весь день без розетки.",
        "Игры — не его сильная сторона: для них лучше любой ПК из этого магазина."
      ],
      apps: {
        office:  ["great", "Весь день от батареи, полная тишина."],
        code:    ["great", "VS Code, JetBrains, Xcode, Android Studio — нативно на Apple Silicon. Docker работает, но 16 ГБ — потолок для нескольких контейнеров."],
        photo:   ["great", "Photoshop и Figma нативно; яркий экран с хорошими цветами."],
        video:   ["ok", "1080p и лёгкий 4K — быстро; без вентилятора при долгом экспорте частоты снижаются."],
        stream:  ["ok", "OBS работает, но стримить игры не на чем."],
        blender: ["ok", "Рендер через Metal — для учебных сцен."],
        gamedev: ["limited", "Godot и Unity для 2D/мобильных — нормально; Unreal Engine 5 с 16 ГБ — тяжело."],
        cad:     ["limited", "AutoCAD для Mac есть, а КОМПАС-3D — только для Windows."],
        ai:      ["ok", "16 ГБ общей памяти: модели примерно до 8 млрд параметров через Ollama / LM Studio."]
      },
      sources: [
        { title: "Apple — MacBook Air (13-inch, M5) Tech Specs", url: "https://support.apple.com/en-us/126320" }
      ]
    }
  },

  categories: {
    cpu: "Процессор",
    cooler: "Охлаждение",
    motherboard: "Материнская плата",
    ram: "Оперативная память",
    gpu: "Видеокарта",
    ssd: "SSD",
    psu: "Блок питания",
    case: "Корпус"
  },

  /* Рабочие приложения: оценки «что тянет» по официальным системным требованиям.
     great — отлично, ok — нормально (с оговорками), limited — с ограничениями. Все оценки — ориентиры. */
  appsCatalog: [
    { id: "office",  name: "Офис и браузер",            task: "Word / Excel, Google Docs, 30+ вкладок, видеозвонки" },
    { id: "code",    name: "Программирование",          task: "VS Code, PyCharm / IntelliJ, Android Studio с эмулятором, Docker" },
    { id: "photo",   name: "Photoshop / Figma",         task: "Ретушь, макеты, слои, ИИ-функции" },
    { id: "video",   name: "Premiere Pro / DaVinci Resolve", task: "Монтаж 1080p и 4K, цветокор, эффекты" },
    { id: "stream",  name: "OBS Studio",                task: "Стрим и запись одновременно с игрой" },
    { id: "blender", name: "Blender",                   task: "3D-моделирование, рендер Cycles" },
    { id: "gamedev", name: "Unreal Engine 5 / Unity",   task: "Разработка игр, Lumen и Nanite" },
    { id: "cad",     name: "AutoCAD / КОМПАС-3D",       task: "Чертежи 2D и 3D-сборки" },
    { id: "ai",      name: "Локальные нейросети",       task: "LM Studio / Ollama, Stable Diffusion / ComfyUI" }
  ],
  appLevels: {
    great:   "Отлично",
    ok:      "Нормально",
    limited: "С ограничениями"
  },
  appSources: [
    { title: "Adobe — системные требования Premiere (16 ГБ для HD, 32 ГБ для 4K, 8 ГБ видеопамяти)", url: "https://helpx.adobe.com/premiere/desktop/get-started/technical-requirements/adobe-premiere-pro-technical-requirements.html" },
    { title: "Adobe — требования Photoshop", url: "https://helpx.adobe.com/photoshop/desktop/get-started/technical-requirements-installation/adobe-photoshop-on-desktop-technical-requirements.html" },
    { title: "Blender — требования (рекомендуется 8 ядер, 32 ГБ)", url: "https://www.blender.org/download/requirements/" },
    { title: "Epic Games — требования Unreal Engine 5 (32 ГБ, от 8 ГБ видеопамяти)", url: "https://dev.epicgames.com/documentation/en-us/unreal-engine/hardware-and-software-specifications-for-unreal-engine" },
    { title: "PremiumBeat — требования DaVinci Resolve (16 ГБ, 32 ГБ с Fusion)", url: "https://www.premiumbeat.com/blog/davinci-resolve-system-requirements/" }
  ],

  notes: [
    "Монитор, клавиатура и мышь в сборки не входят (опционально по ТЗ, не выбирались).",
    "ОС в сборки и ноутбуки не входит — все ноутбуки поставляются без ОС.",
    "DNS отдаёт автоматическим запросам 401, Мегамаркет не понадобился: все позиции нашлись в наличии в Ситилинке."
  ]
};
