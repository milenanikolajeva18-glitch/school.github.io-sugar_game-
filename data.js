/**
 * Hidden Sugar Detective: PRO Edition (Сахарный детектив — Расширенная версия)
 * Database of 15 Thematic Levels (81 Questions), Shop, Boosters, Avatars, Themes,
 * Secret Dossiers, Calculator Database, and 16 Achievements.
 * Pure vanilla JavaScript module. Zero external dependencies.
 * Mounts on window.SugarApp.DATA and exports via CommonJS for Node.js testing.
 */
(function(global) {
  'use strict';

  var SugarApp = global.SugarApp = global.SugarApp || {};

  /**
   * Helper to normalize answers for single or multi-choice questions
   */
  function normalizeAnswer(ans) {
    if (Array.isArray(ans)) {
      return ans.map(function(item) {
        return String(item).trim().toLowerCase();
      }).sort();
    }
    return String(ans || '').trim().toLowerCase();
  }

  /**
   * Universal answer evaluation supporting single-select, multi-select, and fuzzy matching
   */
  function checkQuestionAnswer(question, userAnswer) {
    if (!question || userAnswer === undefined || userAnswer === null) {
      return false;
    }

    if (question.type === 'multi_select' || Array.isArray(question.correctAnswer)) {
      var expected = normalizeAnswer(question.correctAnswer);
      var userArr = normalizeAnswer(Array.isArray(userAnswer) ? userAnswer : [userAnswer]);
      if (expected.length !== userArr.length) {
        return false;
      }
      for (var i = 0; i < expected.length; i++) {
        if (expected[i] !== userArr[i]) {
          return false;
        }
      }
      return true;
    }

    var expectedSingle = normalizeAnswer(question.correctAnswer);
    var userSingle = normalizeAnswer(userAnswer);

    if (userSingle === expectedSingle) {
      return true;
    }

    // Match against option text or id if user passed either
    if (Array.isArray(question.options)) {
      for (var j = 0; j < question.options.length; j++) {
        var opt = question.options[j];
        var optId = normalizeAnswer(opt.id);
        var optText = normalizeAnswer(opt.text);
        if (optId === expectedSingle || optText === expectedSingle) {
          if (userSingle === optId || userSingle === optText) {
            return true;
          }
        }
      }
    }

    return false;
  }

  // =========================================================================
  // 15 THEMATIC LEVELS (81 QUESTIONS TOTAL)
  // =========================================================================

  var LEVELS = [
    // -----------------------------------------------------------------------
    // УРОВЕНЬ 1: НАПИТКИ (Drinks) — 6 вопросов
    // -----------------------------------------------------------------------
    {
      id: 1,
      number: 1,
      department: "Отдел прохладительных напитков",
      title: "Напитки",
      subtitle: "Сколько чайных ложек сахара прячется в популярных напитках?",
      themeColor: "#2563EB",
      rewardPerQuestion: 5,
      maxCoins: 30,
      icon: "🥤",
      hint: "Помни: дневная норма сахара для подростка — не более 5-6 чайных ложек (25 г)!",
      questions: [
        {
          id: "L1_Q1",
          levelId: 1,
          number: 1,
          productName: "Сладкая газировка",
          packaging: "0.5 л",
          svgKey: "soda_bottle",
          type: "spoons_quiz",
          prompt: "Газировка 0.5 л: сколько чайных ложек сахара содержится в этом стакане?",
          spoonsAmount: 13,
          options: [
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_13", text: "13 ложек", spoons: 13 },
            { id: "opt_8", text: "8 ложек", spoons: 8 },
            { id: "opt_18", text: "18 ложек", spoons: 18 }
          ],
          correctAnswer: "opt_13",
          hint: "В одной стандартной бутылке газировки сахара больше дневной нормы в 2 раза!",
          explanation: "В этом стакане около 13 чайных ложек сахара (~52–65 г). Старайся пить чистую воду и несладкие напитки!"
        },
        {
          id: "L1_Q2",
          levelId: 1,
          number: 2,
          productName: "Вишневый сок (нектар)",
          packaging: "1.0 л",
          svgKey: "juice_box",
          type: "spoons_quiz",
          prompt: "Вишневый нектар 1.0 л: сколько чайных ложек сахара содержится в этой упаковке?",
          spoonsAmount: 25,
          options: [
            { id: "opt_8", text: "8 ложек", spoons: 8 },
            { id: "opt_13", text: "13 ложек", spoons: 13 },
            { id: "opt_18", text: "18 ложек", spoons: 18 },
            { id: "opt_25", text: "25 ложек", spoons: 25 }
          ],
          correctAnswer: "opt_25",
          hint: "Кислые ягоды вроде вишни требуют огромного количества добавленного сахара для сладкого вкуса!",
          explanation: "В этой упаковке около 25 чайных ложек сахара! Теперь ты знаешь куда больше о скрытых сахарах в соках и нектарах."
        },
        {
          id: "L1_Q3",
          levelId: 1,
          number: 3,
          productName: "Холодный бутилированный чай",
          packaging: "0.5 л",
          svgKey: "ice_tea_bottle",
          type: "spoons_quiz",
          prompt: "Холодный чай 0.5 л: сколько чайных ложек сахара содержится в этой бутылке?",
          spoonsAmount: 9,
          options: [
            { id: "opt_2", text: "2 ложки", spoons: 2 },
            { id: "opt_4", text: "4 ложки", spoons: 4 },
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_9", text: "9 ложек", spoons: 9 }
          ],
          correctAnswer: "opt_9",
          hint: "Хотя на этикетке нарисованы чайные листья, это почти такой же сладкий напиток, как лимонад.",
          explanation: "В этом холодном чае целых 9 ложек сахара (~36–45 г)! Гораздо полезнее заваривать чай самостоятельно дома."
        },
        {
          id: "L1_Q4",
          levelId: 1,
          number: 4,
          productName: "Энергетический напиток",
          packaging: "0.25 л",
          svgKey: "energy_drink_can",
          type: "spoons_quiz",
          prompt: "Энергетик 0.25 л: сколько чайных ложек сахара прячется в этой маленькой баночке?",
          spoonsAmount: 13,
          options: [
            { id: "opt_8", text: "8 ложек", spoons: 8 },
            { id: "opt_13", text: "13 ложек", spoons: 13 },
            { id: "opt_15", text: "15 ложек", spoons: 15 },
            { id: "opt_18", text: "18 ложек", spoons: 18 }
          ],
          correctAnswer: "opt_13",
          hint: "Ударная доза кофеина в энергетиках обычно маскируется гигантским количеством сахара.",
          explanation: "В этом энергетике целых 13 чайных ложек сахара! Ну и ну. Ты отлично справляешься с расследованием, продолжай в том же духе!"
        },
        {
          id: "L1_Q5",
          levelId: 1,
          number: 5,
          productName: "Питьевой сладкий йогурт",
          packaging: "0.33 л",
          svgKey: "drinking_yogurt_bottle",
          type: "spoons_quiz",
          prompt: "Питьевой йогурт 0.33 л: сколько чайных ложек сахара содержится в этом десертном напитке?",
          spoonsAmount: 9,
          options: [
            { id: "opt_8", text: "8 ложек", spoons: 8 },
            { id: "opt_15", text: "15 ложек", spoons: 15 },
            { id: "opt_9", text: "9 ложек", spoons: 9 },
            { id: "opt_18", text: "18 ложек", spoons: 18 }
          ],
          correctAnswer: "opt_9",
          hint: "Кисломолочная основа кажется полезной, но фруктовые наполнители готовятся на сахарном сиропе.",
          explanation: "В этом йогурте содержится целых 9 ложек сахара! Натуральный белый йогурт без добавок намного полезнее."
        },
        {
          id: "L1_Q6",
          levelId: 1,
          number: 6,
          productName: "Фруктовая вода (Vitamin Water)",
          packaging: "0.5 л",
          svgKey: "fruit_water_bottle",
          type: "spoons_quiz",
          prompt: "Фруктовая вода 0.5 л: сколько чайных ложек сахара содержит эта «витаминная» вода?",
          spoonsAmount: 5,
          options: [
            { id: "opt_2", text: "2 ложки", spoons: 2 },
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_3", text: "3 ложки", spoons: 3 },
            { id: "opt_8", text: "8 ложек", spoons: 8 }
          ],
          correctAnswer: "opt_5",
          hint: "Слово «вода» в названии может усыпить бдительность, но фруктовый концентрат содержит сахар.",
          explanation: "В этой фруктовой воде всего 5 ложек сахара — меньше, чем в коле, но это все равно дневная норма подростка!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 2: ЗАВТРАКИ (Breakfasts) — 6 вопросов
    // -----------------------------------------------------------------------
    {
      id: 2,
      number: 2,
      department: "Бакалея и сухие завтраки",
      title: "Скрытый сахар в завтраках",
      subtitle: "Внимательно прочитай состав и определи, есть ли в продукте скрытый сахар.",
      themeColor: "#8B5CF6",
      rewardPerQuestion: 10,
      maxCoins: 60,
      icon: "🥣",
      hint: "Ищи в составе не только слово «сахар», но и сиропы, патоку, декстрозу и мальтозу!",
      questions: [
        {
          id: "L2_Q1",
          levelId: 2,
          number: 1,
          productName: "Кукурузные хлопья",
          svgKey: "corn_flakes_box",
          type: "yes_no",
          prompt: "Кукурузные хлопья: есть ли в этом составе скрытый сахар?",
          compositionText: "Кукурузная крупа, сахар, глюкозный сироп, соль, витамины, ароматизатор (ваниль).",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Посмотри на второе и третье слово в списке ингредиентов!",
          explanation: "В составе есть и обычный сахар, и глюкозный сироп! Это классический пример двойного сахара в сухих завтраках."
        },
        {
          id: "L2_Q2",
          levelId: 2,
          number: 2,
          productName: "Фруктовый йогурт",
          svgKey: "fruit_yogurt_cup",
          type: "yes_no",
          prompt: "Фруктовый йогурт: есть ли в этом составе скрытый сахар?",
          compositionText: "Молоко, клубничное пюре, сахар, обезжиренное молоко, загустители, ароматизатор, пробиотики.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Фруктовое пюре само по себе сладкое, но производители почти всегда добавляют сахар.",
          explanation: "Да! Сахар указан на третьем месте состава. В баночке 120 г может быть до 3-4 ложек чистого сахара."
        },
        {
          id: "L2_Q3",
          levelId: 2,
          number: 3,
          productName: "Батончик мюсли",
          svgKey: "muesli_bar",
          type: "yes_no",
          prompt: "Злаковый батончик мюсли: есть ли в этом составе скрытый сахар?",
          compositionText: "Овсяные хлопья, сухофрукты, мёд, сироп глюкозы, растительное масло, ароматизатор.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Мёд и сироп глюкозы — это источники быстрых углеводов и сахаров.",
          explanation: "Верно! Мёд и сироп глюкозы выполняют роль сладкого связующего клея для хлопьев."
        },
        {
          id: "L2_Q4",
          levelId: 2,
          number: 4,
          productName: "Хлеб для тостов",
          svgKey: "toast_bread_pack",
          type: "yes_no",
          prompt: "Хлеб для тостов: есть ли в этом составе скрытый сахар?",
          compositionText: "Пшеничная мука, вода, дрожжи, сахар, соль, растительное масло, консервант.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Даже несладкий на вкус белый хлеб для тостов может содержать добавленный сахар для золотистой корочки.",
          explanation: "Да! В тостовом хлебе сахар ускоряет работу дрожжей и придает характерную золотистую корочку при поджаривании."
        },
        {
          id: "L2_Q5",
          levelId: 2,
          number: 5,
          productName: "Овсяная каша быстрого приготовления",
          svgKey: "instant_oatmeal_pouch",
          type: "yes_no",
          prompt: "Овсяная каша быстрого приготовления: есть ли здесь скрытый сахар?",
          compositionText: "Овсяные хлопья, сахар, соль, ароматизатор, витамины, натуральные красители.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Пакетики «высыпал и залил кипятком» часто на 20-30% состоят из сахара!",
          explanation: "Точно! Сахар стоит на втором месте сразу после овсяных хлопьев. Гораздо лучше варить цельные хлопья геркулес!"
        },
        {
          id: "L2_Q6",
          levelId: 2,
          number: 6,
          productName: "Шоколадные шарики",
          svgKey: "chocolate_cereal_balls",
          type: "yes_no",
          prompt: "Шоколадные шарики: есть ли в этом составе скрытый сахар?",
          compositionText: "Кукурузная мука, сахар, какао-порошок, глюкозный сироп, эмульгатор, ароматизатор.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Внимательно прочти ингредиенты между какао и эмульгатором.",
          explanation: "Браво! В составе присутствуют и обычный сахар, и глюкозный сироп. Уровень сахара превышает 30 г на 100 г продукта!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 3: ПЕРЕКУСЫ И БАТОНЧИКИ (Snacks) — 6 вопросов
    // -----------------------------------------------------------------------
    {
      id: 3,
      number: 3,
      department: "Снэки и кондитерский отдел",
      title: "Перекусы и псевдонимы сахара",
      subtitle: "Найди среди ингредиентов коварный замаскированный сахар!",
      themeColor: "#EC4899",
      rewardPerQuestion: 10,
      maxCoins: 60,
      icon: "🍫",
      hint: "Скрытый сахар часто прячется за словами: мальтодекстрин, декстроза, инвертный сироп, мальтоза!",
      questions: [
        {
          id: "L3_Q1",
          levelId: 3,
          number: 1,
          productName: "Злаковый батончик",
          svgKey: "cereal_snack_bar",
          type: "select_sugar",
          prompt: "Злаковый батончик: какой ингредиент является скрытым сахаром?",
          compositionText: "Овсяные хлопья, сироп глюкозы, орехи, сушеные фрукты, растительное масло, ароматизаторы, соль.",
          options: [
            { id: "oat_flakes", text: "Овсяные хлопья" },
            { id: "glucose_syrup", text: "Сироп глюкозы" },
            { id: "dried_fruits", text: "Сушеные фрукты" },
            { id: "vegetable_oil", text: "Растительное масло" },
            { id: "aroma", text: "Ароматизаторы" },
            { id: "salt", text: "Соль" }
          ],
          correctAnswer: "glucose_syrup",
          hint: "Ищи густой концентрированный сироп, удерживающий форму батончика.",
          explanation: "Сироп глюкозы — это концентрированный раствор сахаров, получаемый расщеплением крахмала."
        },
        {
          id: "L3_Q2",
          levelId: 3,
          number: 2,
          productName: "Печенье с овсяными хлопьями",
          svgKey: "oat_cookies_pack",
          type: "select_sugar",
          prompt: "Печенье овсяное: какой компонент является замаскированным сахаром?",
          compositionText: "Овсяные хлопья, пшеничная мука, инвертный сахарный сироп, сливочное масло, какао, разрыхлитель.",
          options: [
            { id: "oat_flakes", text: "Овсяные хлопья" },
            { id: "wheat_flour", text: "Пшеничная мука" },
            { id: "invert_syrup", text: "Инвертный сахарный сироп" },
            { id: "butter", text: "Сливочное масло" },
            { id: "cocoa", text: "Какао" },
            { id: "baking_powder", text: "Разрыхлитель" }
          ],
          correctAnswer: "invert_syrup",
          hint: "Инвертный сироп — смесь глюкозы и фруктозы, часто используемая в кондитерском деле.",
          explanation: "Инвертный сахарный сироп слаще обычного сахара и удерживает влагу в печенье."
        },
        {
          id: "L3_Q3",
          levelId: 3,
          number: 3,
          productName: "Шоколадное молоко",
          svgKey: "chocolate_milk_carton",
          type: "select_sugar",
          prompt: "Шоколадное молоко: что из перечисленного является скрытым сахаром?",
          compositionText: "Молоко, какао, мальтодекстрин, шоколадный ароматизатор, стабилизатор.",
          options: [
            { id: "milk", text: "Молоко" },
            { id: "cocoa", text: "Какао" },
            { id: "maltodextrin", text: "Мальтодекстрин" },
            { id: "aroma", text: "Ароматизатор" },
            { id: "stabilizer", text: "Стабилизатор" }
          ],
          correctAnswer: "maltodextrin",
          hint: "Это вещество часто добавляют для густоты, но его гликемический индекс даже выше, чем у обычного сахара!",
          explanation: "Мальтодекстрин — быстрый углевод с гликемическим индексом до 110! Он мгновенно повышает глюкозу в крови."
        },
        {
          id: "L3_Q4",
          levelId: 3,
          number: 4,
          productName: "Вафли с ванильной начинкой",
          svgKey: "waffles_pack",
          type: "select_sugar",
          prompt: "Вафли с ванильной начинкой: какой ингредиент скрывает сахар?",
          compositionText: "Пшеничная мука, растительное масло, сухое молоко, сироп глюкозы, какао-масло, ванилин, разрыхлитель.",
          options: [
            { id: "flour", text: "Пшеничная мука" },
            { id: "vegetable_oil", text: "Растительное масло" },
            { id: "dry_milk", text: "Сухое молоко" },
            { id: "glucose_syrup", text: "Сироп глюкозы" },
            { id: "vanillin", text: "Ванилин" }
          ],
          correctAnswer: "glucose_syrup",
          hint: "Сироп глюкозы придает начинке нежную тающую консистенцию.",
          explanation: "Сироп глюкозы — популярный дешевый заменитель сахара в кондитерской индустрии."
        },
        {
          id: "L3_Q5",
          levelId: 3,
          number: 5,
          productName: "Творожок с персиком",
          svgKey: "peach_curd_pot",
          type: "select_sugar",
          prompt: "Творожок с персиком: найди замаскированное название сахара!",
          compositionText: "Творог, персиковое пюре, мальтоза, сливки, загуститель.",
          options: [
            { id: "curd", text: "Творог" },
            { id: "peach_puree", text: "Персиковое пюре" },
            { id: "maltose", text: "Мальтоза" },
            { id: "cream", text: "Сливки" },
            { id: "thickener", text: "Загуститель" }
          ],
          correctAnswer: "maltose",
          hint: "Окончание «-оза» в химии всегда указывает на углевод/сахар!",
          explanation: "Мальтоза (солодовый сахар) состоит из двух молекул глюкозы и быстро усваивается организмом."
        },
        {
          id: "L3_Q6",
          levelId: 3,
          number: 6,
          productName: "Банановый молочный коктейль",
          svgKey: "banana_milkshake_bottle",
          type: "select_sugar",
          prompt: "Банановый милкшейк: какой компонент представляет собой скрытый сахар?",
          compositionText: "Молоко, банановое пюре, глюкозно-фруктозный сироп, какао, ароматизатор.",
          options: [
            { id: "milk", text: "Молоко" },
            { id: "banana_puree", text: "Банановое пюре" },
            { id: "gfs", text: "Глюкозно-фруктозный сироп" },
            { id: "cocoa", text: "Какао" },
            { id: "flavoring", text: "Ароматизатор" }
          ],
          correctAnswer: "gfs",
          hint: "ГФС (кукурузный сироп) очень дешев и часто используется в коктейлях вместо сахара.",
          explanation: "Глюкозно-фруктозный сироп (ГФС) — один из главных источников скрытого сахара в промышленных десертах."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 4: СОУСЫ И ЗАПРАВКИ (Sauces) — 4 вопроса
    // -----------------------------------------------------------------------
    {
      id: 4,
      number: 4,
      department: "Отдел соусов и приправ",
      title: "Соусы и заправки",
      subtitle: "Даже несладкие соусы могут таить в себе ударную дозу сахара!",
      themeColor: "#DC2626",
      rewardPerQuestion: 15,
      maxCoins: 60,
      icon: "🥫",
      hint: "Кетчуп, барбекю и терияки содержат до трети сахара от своего объема!",
      questions: [
        {
          id: "L4_Q1",
          levelId: 4,
          number: 1,
          productName: "Классические соусы",
          svgKey: "sauces_variety",
          type: "checkbox_sauces",
          prompt: "Какой из этих популярных соусов содержит больше всего добавленного сахара?",
          options: [
            { id: "ketchup", text: "Кетчуп томатный", svgKey: "ketchup" },
            { id: "mayonnaise", text: "Майонез классический", svgKey: "mayonnaise_jar" },
            { id: "mustard", text: "Горчица столовая", svgKey: "mustard_jar" },
            { id: "soy_sauce", text: "Соевый соус", svgKey: "soy_sauce_bottle" }
          ],
          correctAnswer: "ketchup",
          hint: "Подумай: какой томатный соус имеет выраженный кисло-сладкий вкус?",
          explanation: "В стандартной столовой ложке кетчупа содержится целая чайная ложка сахара (до 25-30% от состава)!"
        },
        {
          id: "L4_Q2",
          levelId: 4,
          number: 2,
          productName: "Соусы для гриля",
          svgKey: "bbq_sauces_set",
          type: "checkbox_sauces",
          prompt: "Какой из перечисленных соусов содержит рекордный скрытый сахар?",
          options: [
            { id: "mustard", text: "Горчица дижонская", svgKey: "mustard_jar" },
            { id: "mayonnaise", text: "Майонез оливковый", svgKey: "mayonnaise_jar" },
            { id: "bbq", text: "Соус Барбекю (BBQ)", svgKey: "ketchup" },
            { id: "lemon_sauce", text: "Лимонный соус", svgKey: "lemon_sauce" }
          ],
          correctAnswer: "bbq",
          hint: "В соусах для мяса часто используют патоку, жженый сахар и карамельный сироп для глазури.",
          explanation: "Соус Барбекю может содержать до 40-50% сахара и патоки для создания липкой аппетитной корочки на гриле!"
        },
        {
          id: "L4_Q3",
          levelId: 4,
          number: 3,
          productName: "Острые и пряные соусы",
          svgKey: "spicy_sauces_set",
          type: "checkbox_sauces",
          prompt: "Какой соус маскирует жгучую остроту большим количеством скрытого сахара?",
          options: [
            { id: "garlic_sauce", text: "Чесночный соус", svgKey: "garlic_sauce" },
            { id: "hot_sweet_sauce", text: "Острый соус (Сладкий чили)", svgKey: "ketchup" },
            { id: "mustard", text: "Горчица русская", svgKey: "mustard_jar" },
            { id: "mayonnaise", text: "Майонез легкий", svgKey: "mayonnaise_jar" }
          ],
          correctAnswer: "hot_sweet_sauce",
          hint: "Кисло-сладкий чили содержит сахар на первом или втором месте состава!",
          explanation: "В тайских и паназиатских острых соусах (Sweet Chili) сахар балансирует остроту перца и доходит до 40 г на 100 г."
        },
        {
          id: "L4_Q4",
          levelId: 4,
          number: 4,
          productName: "Восточные заправки",
          svgKey: "asian_sauces_set",
          type: "checkbox_sauces",
          prompt: "Какой азиатский глазированный соус буквально сварен на сахарном сиропе?",
          options: [
            { id: "mustard", text: "Горчица зернистая", svgKey: "mustard_jar" },
            { id: "mayonnaise", text: "Майонез домашний", svgKey: "mayonnaise_jar" },
            { id: "soy_sauce", text: "Соевый классический", svgKey: "soy_sauce_bottle" },
            { id: "teriyaki", text: "Соус Терияки", svgKey: "soy_sauce_bottle" }
          ],
          correctAnswer: "teriyaki",
          hint: "Блестящая глазурь терияки создается увариванием сои с сахаром и мирином.",
          explanation: "Терияки в переводе означает «блеск и жарка» — именно карамелизующийся сахар дает блюдам этот глянцевый блеск."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 5: КОНСЕРВЫ И ПОЛУФАБРИКАТЫ (Canned) — 4 вопроса
    // -----------------------------------------------------------------------
    {
      id: 5,
      number: 5,
      department: "Консервный отдел и заготовки",
      title: "Консервы и полуфабрикаты",
      subtitle: "Найди продукт с НАИМЕНЬШИМ количеством сахара!",
      themeColor: "#0D9488",
      rewardPerQuestion: 15,
      maxCoins: 60,
      icon: "🐟",
      hint: "Продукты в собственном соку и натуральной воде почти не содержат добавленного сахара.",
      questions: [
        {
          id: "L5_Q1",
          levelId: 5,
          number: 1,
          productName: "Мясные и рыбные консервы",
          type: "compare_least",
          prompt: "Выбери консервированный продукт с НАИМЕНЬШИМ количеством сахара:",
          options: [
            { id: "canned_beef", text: "Говядина тушеная (в соку)", svgKey: "canned_beef" },
            { id: "canned_tuna", text: "Тунец в собственном соку", svgKey: "canned_tuna" },
            { id: "sweet_corn", text: "Кукуруза консервированная", svgKey: "sweet_corn" },
            { id: "canned_beans_tomato", text: "Фасоль в томатном соусе", svgKey: "canned_beans" },
            { id: "canned_fish_oil", text: "Скумбрия в масле", svgKey: "canned_fish" },
            { id: "lecho", text: "Лечо в томате", svgKey: "lecho_jar" }
          ],
          correctAnswer: "canned_tuna",
          hint: "Сахар часто добавляют в томатные заливки, маринады и сладкую кукурузу.",
          explanation: "Тунец в собственном соку содержит 0 г углеводов и 0 г добавленного сахара — только рыба, вода и щепотка соли!"
        },
        {
          id: "L5_Q2",
          levelId: 5,
          number: 2,
          productName: "Консервированные фрукты и ягоды",
          type: "compare_least",
          prompt: "Какой фруктовый продукт содержит НАИМЕНЬШЕЕ количество сахара?",
          options: [
            { id: "pineapple_syrup", text: "Ананасы в сиропе", svgKey: "canned_pineapple" },
            { id: "peaches_syrup", text: "Персики в сиропе", svgKey: "canned_peaches" },
            { id: "pears_syrup", text: "Груши в сиропе", svgKey: "canned_pears" },
            { id: "mandarins_syrup", text: "Мандарины в сиропе", svgKey: "canned_mandarins" },
            { id: "cherries_own_juice", text: "Вишня в собственном соку", svgKey: "canned_cherries" },
            { id: "berry_compote", text: "Ягодный компот с сахаром", svgKey: "canned_berries" }
          ],
          correctAnswer: "cherries_own_juice",
          hint: "Слово «сироп» гарантирует высокую концентрацию сахара (до 20-25%).",
          explanation: "Вишня в собственном соку сохраняет натуральную легкую кислинку без сахарного сиропа!"
        },
        {
          id: "L5_Q3",
          levelId: 5,
          number: 3,
          productName: "Овощные и рыбные заготовки",
          type: "compare_least",
          prompt: "В каком из этих продуктов содержится МЕНЬШЕ ВСЕГО сахара?",
          options: [
            { id: "tuna_tomato", text: "Тунец в томатном соусе", svgKey: "canned_tuna" },
            { id: "sprats_oil", text: "Шпроты в масле", svgKey: "canned_sprats" },
            { id: "sweet_corn_syrup", text: "Кукуруза в заливке", svgKey: "sweet_corn" },
            { id: "green_peas", text: "Горошек с сахаром", svgKey: "frozen_peas" },
            { id: "black_olives", text: "Маслины с косточкой", svgKey: "canned_olives" },
            { id: "green_olives", text: "Оливки без косточки", svgKey: "canned_olives" }
          ],
          correctAnswer: "black_olives",
          hint: "Маслины выдерживают в солевом рассоле с маслом, сахара в них практически нет.",
          explanation: "Маслины содержат полезные мононенасыщенные жиры и практически нулевое количество сахара."
        },
        {
          id: "L5_Q4",
          levelId: 5,
          number: 4,
          productName: "Бобовые и пасты",
          type: "compare_least",
          prompt: "В каком продукте НАИМЕНЬШЕЕ количество скрытого сахара?",
          options: [
            { id: "tomato_paste", text: "Томатная паста концентрированная", svgKey: "canned_tomato_paste" },
            { id: "ketchup", text: "Кетчуп магазинный", svgKey: "ketchup" },
            { id: "bbq_sauce", text: "Соус Барбекю", svgKey: "ketchup" },
            { id: "beans_plain", text: "Фасоль натуральная в воде", svgKey: "canned_beans" },
            { id: "beans_tomato", text: "Фасоль в томатном соусе", svgKey: "canned_beans" },
            { id: "lecho_jar", text: "Лечо с сахаром", svgKey: "lecho_jar" }
          ],
          correctAnswer: "beans_plain",
          hint: "Фасоль в чистой воде не содержит добавленных сладких маринадов.",
          explanation: "Фасоль натуральная в воде — идеальный источник клетчатки и белка с нулевым добавленным сахаром!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 6: МОЛОЧНЫЕ ДЕСЕРТЫ (Dairy) — 5 вопросов
    // -----------------------------------------------------------------------
    {
      id: 6,
      number: 6,
      department: "Молочный гастроном",
      title: "Молочные десерты",
      subtitle: "Раскрой секретные названия сахара в молочных продуктах!",
      themeColor: "#6366F1",
      rewardPerQuestion: 15,
      maxCoins: 75,
      icon: "🥛",
      hint: "Лактоза — естественный молочный сахар, но производители добавляют сахарозу, сиропы и мальтодекстрин.",
      questions: [
        {
          id: "L6_Q1",
          levelId: 6,
          number: 1,
          productName: "Йогурт с лесными ягодами",
          svgKey: "berry_yogurt",
          type: "select_sugar",
          prompt: "Йогурт с лесными ягодами: какой компонент является скрытым сахаром?",
          compositionText: "Молоко, сахарный сироп из лесных ягод (сахар, вода, ягоды, пектин), сахар, ароматизаторы, красители, витамин D.",
          options: [
            { id: "aroma", text: "Ароматизаторы" },
            { id: "dye", text: "Красители" },
            { id: "vit_d", text: "Витамин D" },
            { id: "sugar_syrup", text: "Сахарный сироп из ягод" }
          ],
          correctAnswer: "sugar_syrup",
          hint: "Фруктовый наполнитель йогурта почти всегда варится на концентрированном сиропе.",
          explanation: "Сахарный сироп из ягод — это способ добавить дополнительный сахар под видом фруктового наполнителя."
        },
        {
          id: "L6_Q2",
          levelId: 6,
          number: 2,
          productName: "Сгущенное молоко",
          svgKey: "condensed_milk",
          type: "select_sugar",
          prompt: "Сгущенное молоко с сахаром: какой скрытый термин обозначает добавленный сахар?",
          compositionText: "Нормализованное молоко, сахароза, лактоза.",
          options: [
            { id: "milk", text: "Молоко" },
            { id: "sucrose", text: "Сахароза" },
            { id: "lactose", text: "Лактоза (натуральный молочный сахар)" },
            { id: "emulsifier", text: "Эмульгатор" }
          ],
          correctAnswer: "sucrose",
          hint: "Сахароза — это точное химическое название белого столового сахара!",
          explanation: "Сахароза — это и есть обычный сахар. В банке сгущенки сахарозы содержится до 45% от общего веса!"
        },
        {
          id: "L6_Q3",
          levelId: 6,
          number: 3,
          productName: "Кофейный молочный напиток",
          svgKey: "coffee_drink",
          type: "select_sugar",
          prompt: "Кофейный молочный напиток: найди замаскированный сахар в составе!",
          compositionText: "Молоко, кофе, сахар, стабилизаторы, натуральные ароматизаторы, фосфат натрия, карамелизированный сахарный сироп.",
          options: [
            { id: "stabilizer", text: "Стабилизатор" },
            { id: "phosphate", text: "Фосфат натрия" },
            { id: "caramel_syrup", text: "Карамелизированный сахарный сироп" },
            { id: "emulsifier", text: "Эмульгатор" }
          ],
          correctAnswer: "caramel_syrup",
          hint: "Карамельный сироп дает кофейному напитку сладкий привкус и насыщенный цвет.",
          explanation: "Карамелизированный сахарный сироп — это нагретый сахар, который используется как краситель и подсластитель."
        },
        {
          id: "L6_Q4",
          levelId: 6,
          number: 4,
          productName: "Детская молочная смесь",
          svgKey: "baby_formula",
          type: "select_sugar",
          prompt: "Детская смесь: какой быстрый углевод выполняет роль скрытого сахара?",
          compositionText: "Вода, мальтодекстрин, растительные масла, белок коровьего молока, лактоза, рыбий жир, эмульгатор, минералы, витамины.",
          options: [
            { id: "lactose", text: "Лактоза" },
            { id: "emulsifier", text: "Эмульгатор" },
            { id: "maltodextrin", text: "Мальтодекстрин" },
            { id: "fish_oil", text: "Рыбий жир" }
          ],
          correctAnswer: "maltodextrin",
          hint: "Этот углевод часто маскируют под «сложные углеводы», но он быстро превращается в глюкозу.",
          explanation: "Мальтодекстрин часто добавляют в детские смеси для калорийности и густоты, заменяя молочные жиры."
        },
        {
          id: "L6_Q5",
          levelId: 6,
          number: 5,
          productName: "Карамельный молочный пудинг",
          svgKey: "caramel_pudding",
          type: "multi_select",
          prompt: "Карамельный пудинг: выбери ДВА ингредиента, являющихся скрытым сахаром!",
          compositionText: "Молоко, сливки, сахар, сухое молоко, декстроза, карамельный сироп, крахмал, загустители, ароматизатор.",
          options: [
            { id: "cream", text: "Сливки" },
            { id: "dextrose", text: "Декстроза" },
            { id: "flavoring", text: "Ароматизатор" },
            { id: "caramel_syrup", text: "Карамельный сироп" }
          ],
          correctAnswer: ["dextrose", "caramel_syrup"],
          hint: "Внимание: в этом задании ДВА правильных ответа! Ищи химический изомер глюкозы и жидкий сироп.",
          explanation: "Отличная детективная работа! Декстроза (D-глюкоза) и карамельный сироп — это сразу две формы скрытого сахара."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 7: ЗАМОРОЗКА И ГОТОВАЯ ЕДА (Freezer) — 6 вопросов
    // -----------------------------------------------------------------------
    {
      id: 7,
      number: 7,
      department: "Отдел глубокой заморозки",
      title: "Заморозка и готовая еда",
      subtitle: "Какой замороженный продукт содержит НАИБОЛЬШЕЕ количество добавленного сахара?",
      themeColor: "#0284C7",
      rewardPerQuestion: 20,
      maxCoins: 120,
      icon: "❄️",
      hint: "Смотри внимательно: сладкие начинки, глазури и сладкие соусы бьют все рекорды по сахару!",
      questions: [
        {
          id: "L7_Q1",
          levelId: 7,
          number: 1,
          productName: "Овощи и полуфабрикаты",
          type: "compare_most",
          prompt: "Какой из этих продуктов содержит НАИБОЛЬШЕЕ количество добавленного сахара?",
          options: [
            { id: "frozen_peas", text: "Зеленый горошек замороженный", svgKey: "frozen_peas" },
            { id: "sweet_corn", text: "Кукуруза замороженная", svgKey: "sweet_corn" },
            { id: "frozen_carrot", text: "Морковь кубиками", svgKey: "frozen_carrot" },
            { id: "french_fries", text: "Картофель по-деревенски", svgKey: "french_fries" },
            { id: "cherry_dumplings", text: "Вареники с вишней", svgKey: "cherry_dumplings" }
          ],
          correctAnswer: "cherry_dumplings",
          hint: "В начинку ягодных вареников добавляют щедрые порции сахара для сочности.",
          explanation: "В варениках с вишней содержится до 18-22 г сахара на 100 г за счет сладкой ягодной начинки!"
        },
        {
          id: "L7_Q2",
          levelId: 7,
          number: 2,
          productName: "Замороженные ягоды и фрукты",
          type: "compare_most",
          prompt: "Какой ягодный десерт содержит НАИБОЛЬШЕЕ количество сахара?",
          options: [
            { id: "frozen_strawberry", text: "Клубника шоковой заморозки", svgKey: "frozen_strawberry" },
            { id: "frozen_berries", text: "Черника замороженная", svgKey: "frozen_berries" },
            { id: "frozen_mango", text: "Смесь персика и манго", svgKey: "frozen_mango" },
            { id: "cherries_in_syrup", text: "Вишня в сахарном сиропе", svgKey: "cherries_in_syrup" },
            { id: "frozen_pineapple", text: "Ананас замороженный", svgKey: "canned_pineapple" }
          ],
          correctAnswer: "cherries_in_syrup",
          hint: "Обычные ягоды содержат только природную фруктозу, а сахарный сироп удваивает калорийность.",
          explanation: "Замороженная вишня в сахарном сиропе — это фактически варенье, где сахар составляет до половины массы!"
        },
        {
          id: "L7_Q3",
          levelId: 7,
          number: 3,
          productName: "Гарниры и снеки",
          type: "compare_most",
          prompt: "Какой полуфабрикат содержит НАИБОЛЬШЕЕ количество добавленного сахара?",
          options: [
            { id: "french_fries", text: "Картофель фри замороженный", svgKey: "french_fries" },
            { id: "frozen_carrot", text: "Овощи с морковью", svgKey: "frozen_carrot" },
            { id: "sweet_corn", text: "Кукуруза замороженная", svgKey: "sweet_corn" },
            { id: "chicken_nuggets", text: "Куриные наггетсы", svgKey: "chicken_nuggets" },
            { id: "sweet_potato", text: "Батат в сладком соусе", svgKey: "sweet_potato" }
          ],
          correctAnswer: "sweet_potato",
          hint: "Сладкий карамельный соус превращает обычный батат в десертное блюдо.",
          explanation: "Батат в сладком соусе глазируют патокой и сахаром, что делает его рекордсменом в этой группе!"
        },
        {
          id: "L7_Q4",
          levelId: 7,
          number: 4,
          productName: "Замороженная выпечка",
          type: "compare_most",
          prompt: "Какое замороженное мучное изделие лидирует по количеству сахара?",
          options: [
            { id: "pancakes_curd", text: "Блинчики с творогом", svgKey: "pancakes_curd" },
            { id: "potato_dumplings", text: "Вареники с картофелем", svgKey: "cherry_dumplings" },
            { id: "croissants_cheese", text: "Круассаны с сыром", svgKey: "croissants_cheese" },
            { id: "frozen_waffles", text: "Вафли с ванильной начинкой", svgKey: "frozen_waffles" },
            { id: "frozen_pizza", text: "Пицца с овощами", svgKey: "frozen_pizza" }
          ],
          correctAnswer: "frozen_waffles",
          hint: "Ванильная кремовая прослойка почти полностью состоит из кондитерского жира и сахара.",
          explanation: "В вафлях с начинкой сахар содержится и в тесте, и в креме (до 35 г сахара на 100 г)!"
        },
        {
          id: "L7_Q5",
          levelId: 7,
          number: 5,
          productName: "Десертные фрукты",
          type: "compare_most",
          prompt: "Какой из этих фруктовых продуктов содержит МАКСИМУМ сахара?",
          options: [
            { id: "frozen_strawberry", text: "Клубника натуральная", svgKey: "frozen_strawberry" },
            { id: "frozen_mango", text: "Замороженное манго", svgKey: "frozen_mango" },
            { id: "frozen_cherries", text: "Замороженная вишня", svgKey: "canned_cherries" },
            { id: "frozen_berries", text: "Ягодная смесь", svgKey: "frozen_berries" },
            { id: "glazed_strawberries", text: "Клубника в сахарной глазури", svgKey: "glazed_strawberries" }
          ],
          correctAnswer: "glazed_strawberries",
          hint: "Сахарная глазурь — это плотная твердая корка из чистого сахара и сиропа.",
          explanation: "Клубника в глазури содержит больше сахара, чем чистые ягоды, в 4–5 раз!"
        },
        {
          id: "L7_Q6",
          levelId: 7,
          number: 6,
          productName: "Мороженое и десерты",
          type: "compare_most",
          prompt: "ФИНАЛ: какой десерт содержит абсолютный максимум добавленного сахара?",
          options: [
            { id: "pancakes_curd", text: "Блинчики с творогом", svgKey: "pancakes_curd" },
            { id: "cherry_dumplings", text: "Вареники с вишней", svgKey: "cherry_dumplings" },
            { id: "frozen_waffles", text: "Венские вафли", svgKey: "frozen_waffles" },
            { id: "caramel_dairy_dessert", text: "Молочный десерт с карамелью", svgKey: "caramel_dairy_dessert" },
            { id: "frozen_berries", text: "Замороженный ягодный десерт", svgKey: "frozen_berries" }
          ],
          correctAnswer: "caramel_dairy_dessert",
          hint: "Карамельный соус удваивает сладость молочной основы.",
          explanation: "В замороженном десерте с карамельным топингом сахар доходит до 40 г на порцию — это 8 чайных ложек!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 8: «ЗОЖ» И ФИТНЕС-МИФЫ (Fitness Myths) — 6 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 8,
      number: 8,
      department: "Фитнес-маркет и здоровое питание",
      title: "«ЗОЖ» и фитнес-мифы",
      subtitle: "Разоблачи сахар в продуктах с надписями «Фитнес», «Эко» и «0% жира»!",
      themeColor: "#10B981",
      rewardPerQuestion: 20,
      maxCoins: 120,
      icon: "🥑",
      hint: "Когда с продукта убирают жир, для сохранения вкуса производители часто щедро добавляют сахар!",
      questions: [
        {
          id: "L8_Q1",
          levelId: 8,
          number: 1,
          productName: "Протеиновый батончик",
          packaging: "60 г",
          svgKey: "cereal_snack_bar",
          type: "select_sugar",
          prompt: "Протеиновый батончик: какой компонент маскирует сахар в фитнес-перекусе?",
          compositionText: "Изолят сывороточного белка, полидекстроза, сироп изомальтоолигосахарида, кокосовое масло, какао-порошок.",
          options: [
            { id: "protein", text: "Изолят сывороточного белка" },
            { id: "imo_syrup", text: "Сироп изомальтоолигосахарида (ИМО)" },
            { id: "polydextrose", text: "Полидекстроза" },
            { id: "coconut_oil", text: "Кокосовое масло" }
          ],
          correctAnswer: "imo_syrup",
          hint: "ИМО-сироп рекламируют как пребиотик, но в организме он быстро расщепляется до глюкозы.",
          explanation: "Изомальтоолигосахарид (ИМО) в организме быстро превращается в глюкозу и повышает сахар крови так же, как обычный сироп."
        },
        {
          id: "L8_Q2",
          levelId: 8,
          number: 2,
          productName: "Фитнес-гранола «Без сахара»",
          svgKey: "muesli_bar",
          type: "yes_no",
          prompt: "Фитнес-гранола: действительно ли в составе НЕТ скрытых подсластителей?",
          compositionText: "Запеченные овсяные хлопья, концентрированный яблочный сок, финиковый сироп, семена чиа, корица.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Концентрированный сок и финиковый сироп — это фруктозные сахарные сиропы!",
          explanation: "Да! Финиковый сироп и концентрированный сок на 70-80% состоят из сахаров (фруктозы и глюкозы), хотя на коробке пишут «Без добавленного белого сахара»."
        },
        {
          id: "L8_Q3",
          levelId: 8,
          number: 3,
          productName: "Изотонический спорт-дринк",
          packaging: "0.5 л",
          svgKey: "fruit_water_bottle",
          type: "spoons_quiz",
          prompt: "Спортивный изотоник 0.5 л: сколько чайных ложек сахара в этой спортивной бутылке?",
          spoonsAmount: 7,
          options: [
            { id: "opt_2", text: "2 ложки", spoons: 2 },
            { id: "opt_4", text: "4 ложки", spoons: 4 },
            { id: "opt_7", text: "7 ложек", spoons: 7 },
            { id: "opt_12", text: "12 ложек", spoons: 12 }
          ],
          correctAnswer: "opt_7",
          hint: "Изотоники нужны марафонцам для быстрого восполнения гликогена, поэтому в них растворено немало сахара.",
          explanation: "В изотонике около 7 чайных ложек сахара (~28-35 г). Обычному человеку на легкой прогулке такой напиток не нужен — достаточно воды!"
        },
        {
          id: "L8_Q4",
          levelId: 8,
          number: 4,
          productName: "Детокс зеленый смузи",
          packaging: "0.33 л",
          svgKey: "juice_box",
          type: "select_sugar",
          prompt: "Зеленый детокс-смузи: почему он такой сладкий, несмотря на шпинат и огурец?",
          compositionText: "Яблочный сок прямого отжима (60%), пюре манго, шпинат, банан, сок белого винограда.",
          options: [
            { id: "spinach", text: "Шпинат" },
            { id: "apple_grape_juice", text: "Основа из яблочного и виноградного сока" },
            { id: "cucumber", text: "Огурец" },
            { id: "water", text: "Минеральная вода" }
          ],
          correctAnswer: "apple_grape_juice",
          hint: "Виноградный и яблочный соки содержат огромное количество природных сахаров, маскируя овощной вкус.",
          explanation: "В таком зеленом смузи за ярким шпинатом прячется до 30-35 г сахара из виноградного и яблочного сока!"
        },
        {
          id: "L8_Q5",
          levelId: 8,
          number: 5,
          productName: "Сушеное манго «Экзотик»",
          svgKey: "frozen_mango",
          type: "yes_no",
          prompt: "Сушеное манго в упаковке: есть ли здесь добавленный сахар?",
          compositionText: "Манго сушеное, сахарная пудра, регулятор кислотности лимонная кислота, консервант диоксид серы.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Чтобы ломтики были мягкими и долго не портились, их часто вымачивают в сахаре перед сушкой.",
          explanation: "В составе четко указана сахарная пудра! Натуральное сушеное манго должно содержать только один ингредиент: манго 100%."
        },
        {
          id: "L8_Q6",
          levelId: 8,
          number: 6,
          productName: "Арахисовая паста «Фитнес»",
          packaging: "300 г",
          svgKey: "mayonnaise_jar",
          type: "select_sugar",
          prompt: "Арахисовая паста с пометкой «Фитнес»: какой ингредиент маскирует добавленный сахар?",
          compositionText: "Жареный тертый арахис, мальтозная патока, морская пищевая соль, антиокислитель токоферол.",
          options: [
            { id: "peanuts", text: "Жареный тертый арахис" },
            { id: "maltose_syrup", text: "Мальтозная патока" },
            { id: "sea_salt", text: "Морская пищевая соль" },
            { id: "tocopherol", text: "Токоферол (витамин E)" }
          ],
          correctAnswer: "maltose_syrup",
          hint: "Слово «патока» — это жидкий сахарный сироп, получаемый осахариванием крахмала.",
          explanation: "Мальтозная патока — это концентрированный сироп мальтозы (высокий гликемический индекс 105!). Натуральная арахисовая паста должна содержать только 100% арахис."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 9: ДЕТСКОЕ МЕНЮ И ШКОЛЬНЫЙ БУФЕТ (Kids Menu) — 6 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 9,
      number: 9,
      department: "Детское питание и сладости",
      title: "Детское меню и буфет",
      subtitle: "Раскрой секреты любимых лакомств из школьного буфета!",
      themeColor: "#F59E0B",
      rewardPerQuestion: 20,
      maxCoins: 120,
      icon: "🧸",
      hint: "Яркие мультяшные упаковки часто содержат максимальную дозу сахаров в расчете на детский вес!",
      questions: [
        {
          id: "L9_Q1",
          levelId: 9,
          number: 1,
          productName: "Глазированный творожный сырок",
          packaging: "40 г",
          svgKey: "peach_curd_pot",
          type: "spoons_quiz",
          prompt: "Глазированный сырок всего 40 г: сколько чайных ложек сахара прячется в этой крошке?",
          spoonsAmount: 3,
          options: [
            { id: "opt_0_5", text: "0.5 ложки", spoons: 0.5 },
            { id: "opt_1", text: "1 ложка", spoons: 1 },
            { id: "opt_3", text: "3 ложки", spoons: 3 },
            { id: "opt_6", text: "6 ложек", spoons: 6 }
          ],
          correctAnswer: "opt_3",
          hint: "Около 30-35% веса сырка — это чистый сахар в твороге и в шоколадной глазури.",
          explanation: "В крошечном сырке целых 3 чайные ложки сахара (~14-16 г) — больше половины суточной нормы младшеклассника!"
        },
        {
          id: "L9_Q2",
          levelId: 9,
          number: 2,
          productName: "Бисквитный мишка с начинкой",
          packaging: "30 г",
          svgKey: "waffles_pack",
          type: "select_sugar",
          prompt: "Бисквитный мишка: какой сироп обеспечивает мягкость и сладость начинки?",
          compositionText: "Мука пшеничная, глюкозно-фруктозный сироп, сахар, яйца, растительное масло, сухое молоко, стабилизатор глицерин.",
          options: [
            { id: "flour", text: "Пшеничная мука" },
            { id: "gfs", text: "Глюкозно-фруктозный сироп" },
            { id: "eggs", text: "Яйца" },
            { id: "glycerin", text: "Стабилизатор глицерин" }
          ],
          correctAnswer: "gfs",
          hint: "ГФС стоит на втором месте состава, опережая даже обычный сахар!",
          explanation: "Глюкозно-фруктозный сироп делает бисквит влажным и сладким, но нагружает печень фруктозой."
        },
        {
          id: "L9_Q3",
          levelId: 9,
          number: 3,
          productName: "Растворимое какао в гранулах",
          packaging: "Порция 20 г",
          svgKey: "chocolate_milk_carton",
          type: "select_sugar",
          prompt: "Растворимое какао: что стоит на ПЕРВОМ месте в списке ингредиентов?",
          compositionText: "Сахар (до 75%), какао-порошок со сниженным содержанием жира, соевый лецитин, минералы, витамины, соль.",
          options: [
            { id: "cocoa", text: "Какао-порошок" },
            { id: "sugar", text: "Сахар" },
            { id: "vitamins", text: "Витамины" },
            { id: "milk", text: "Сухое молоко" }
          ],
          correctAnswer: "sugar",
          hint: "Ингредиенты на этикетке всегда сортируются по убыванию веса.",
          explanation: "В популярном гранулированном какао до 75% объема — это обычный белый сахар, а какао лишь около 15-20%!"
        },
        {
          id: "L9_Q4",
          levelId: 9,
          number: 4,
          productName: "Молочный ломтик (бисквит)",
          svgKey: "frozen_waffles",
          type: "yes_no",
          prompt: "Молочный ломтик: содержит ли он добавленный сахар?",
          compositionText: "Пастеризованное молоко, сахар, растительный жир, пшеничная мука, сухое молоко, мёд, концентрированное сливочное масло.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Сахар стоит на втором месте, а в креме добавлен еще и мёд.",
          explanation: "Да! Сахар и мёд составляют около 30% продукта. Это десерт, а не замена полезному молоку."
        },
        {
          id: "L9_Q5",
          levelId: 9,
          number: 5,
          productName: "Детский сок в коробочке",
          packaging: "0.2 л",
          svgKey: "juice_box",
          type: "spoons_quiz",
          prompt: "Детский яблочный осветленный сок 0.2 л: сколько ложек сахара в этой маленькой коробочке с трубочкой?",
          spoonsAmount: 5,
          options: [
            { id: "opt_1", text: "1 ложка", spoons: 1 },
            { id: "opt_2", text: "2 ложки", spoons: 2 },
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_8", text: "8 ложек", spoons: 8 }
          ],
          correctAnswer: "opt_5",
          hint: "В осветленном соке удалена полезная клетчатка, остался чистый растворенный сахар.",
          explanation: "В маленькой коробочке 200 мл содержится около 5 чайных ложек сахара (~20-22 г) — вся дневная норма ребенка за 30 секунд!"
        },
        {
          id: "L9_Q6",
          levelId: 9,
          number: 6,
          productName: "Кукурузные сладкие палочки",
          packaging: "100 г",
          svgKey: "cornflakes_box",
          type: "yes_no",
          prompt: "Кукурузные сладкие палочки: есть ли в этой легкой хрустящей пачке скрытый сахар?",
          compositionText: "Крупа кукурузная, сахарная пудра (30%), масло растительное подсолнечное рафинированное дезодорированное, соль пищевая.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Обрати внимание на белый сладкий налет, покрывающий каждую палочку.",
          explanation: "Да! Сахарная пудра составляет почти треть пачки (30 г сахара на 100 г палочек — целых 6 чайных ложек!)."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 10: АЗИАТСКАЯ КУХНЯ И СТРИТ-ФУД (Asian Food) — 6 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 10,
      number: 10,
      department: "Паназиатская кухня и Стрит-фуд",
      title: "Азиатская кухня и Стрит-фуд",
      subtitle: "Почему блюда в воке и суши такие сладкие на вкус?",
      themeColor: "#E11D48",
      rewardPerQuestion: 25,
      maxCoins: 150,
      icon: "🥢",
      hint: "Азиатский баланс вкусов «умами» почти всегда строится на сочетании соли, глутамата и огромного количества сахара!",
      questions: [
        {
          id: "L10_Q1",
          levelId: 10,
          number: 1,
          productName: "Заправка для риса суши (Сушидзу)",
          svgKey: "soy_sauce_bottle",
          type: "select_sugar",
          prompt: "Рис для суши: почему он такой липкий и сладковатый?",
          compositionText: "Рисовый уксус, сахар (до 30%), соль, сладкое кулинарное вино мирин.",
          options: [
            { id: "vinegar", text: "Рисовый уксус" },
            { id: "sugar_mirin", text: "Сахар и сладкое вино мирин" },
            { id: "salt", text: "Морская соль" },
            { id: "water", text: "Вода" }
          ],
          correctAnswer: "sugar_mirin",
          hint: "Чтобы рис для суши блестел и держал форму ролла, уксус варят с сахаром.",
          explanation: "В каждую порцию риса для суши добавляют заправку из сахара и мирина. В сете роллов может быть 3-4 ложки сахара!"
        },
        {
          id: "L10_Q2",
          levelId: 10,
          number: 2,
          productName: "Бабл-ти (Bubble Tea) с тапиокой",
          packaging: "0.5 л",
          svgKey: "drinking_yogurt_bottle",
          type: "spoons_quiz",
          prompt: "Молочный Бабл-ти с шариками тапиоки 0.5 л: сколько чайных ложек сахара прячется в этом стакане?",
          spoonsAmount: 14,
          options: [
            { id: "opt_4", text: "4 ложки", spoons: 4 },
            { id: "opt_8", text: "8 ложек", spoons: 8 },
            { id: "opt_14", text: "14 ложек", spoons: 14 },
            { id: "opt_20", text: "20 ложек", spoons: 20 }
          ],
          correctAnswer: "opt_14",
          hint: "Сахар растворен в молочном чае, а сами шарики тапиоки вываривают в коричневом сахарном сиропе.",
          explanation: "В стандартном стакане бабл-ти около 14 чайных ложек сахара (~55-65 г) — абсолютный рекорд среди уличных напитков!"
        },
        {
          id: "L10_Q3",
          levelId: 10,
          number: 3,
          productName: "Соус Хойсин (Hoisin)",
          svgKey: "ketchup",
          type: "select_sugar",
          prompt: "Соус Хойсин для утки и вока: что является его главным сладким компонентом?",
          compositionText: "Сахар (35%), вода, ферментированная соевая паста, чеснок, карамельный краситель, модифицированный кукурузный крахмал.",
          options: [
            { id: "soy_paste", text: "Соевая паста" },
            { id: "sugar_first", text: "Сахар (стоит на 1 месте!)" },
            { id: "garlic", text: "Чеснок" },
            { id: "starch", text: "Крахмал" }
          ],
          correctAnswer: "sugar_first",
          hint: "Посмотри, что указано самым первым ингредиентом в составе.",
          explanation: "В соусе Хойсин сахара больше, чем сои — более 35%! Это фактически соевое варенье со специями."
        },
        {
          id: "L10_Q4",
          levelId: 10,
          number: 4,
          productName: "Лапша Вок в кисло-сладком соусе",
          svgKey: "sweet_potato",
          type: "yes_no",
          prompt: "Вок с курицей в кисло-сладком соусе: содержит ли он добавленный сахар?",
          compositionText: "Пшеничная лапша, куриное филе, болгарский перец, ананасовый сироп, сахар, соевый соус, уксус, крахмал.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Кисло-сладкий соус делают из уксуса и ананасового сиропа с сахаром.",
          explanation: "Да! Кисло-сладкий соус для вока содержит до 25-30 г сахара на порцию, чтобы сбалансировать кислоту уксуса."
        },
        {
          id: "L10_Q5",
          levelId: 10,
          number: 5,
          productName: "Спринг-роллы с дип-соусом",
          type: "compare_least",
          prompt: "Какой компонент традиционного азиатского обеда содержит МЕНЬШЕ всего сахара?",
          options: [
            { id: "sweet_chili", text: "Соус Сладкий чили", svgKey: "ketchup" },
            { id: "teriyaki_glaze", text: "Глазурь Терияки", svgKey: "soy_sauce_bottle" },
            { id: "plain_soy", text: "Классический соевый соус (без сахара)", svgKey: "soy_sauce_bottle" },
            { id: "plum_sauce", text: "Сливовый сладкий соус", svgKey: "lemon_sauce" }
          ],
          correctAnswer: "plain_soy",
          hint: "Натурально сброженный соевый соус состоит только из сои, пшеницы, соли и воды.",
          explanation: "Классический качественный соевый соус содержит 0 г сахара (в отличие от сладких глазурей и терияки)!"
        },
        {
          id: "L10_Q6",
          levelId: 10,
          number: 6,
          productName: "Соус Сладкий Чили (порция)",
          packaging: "50 г",
          svgKey: "asian_sauces_set",
          type: "spoons_quiz",
          prompt: "Соус Сладкий Чили (порция дип-соуса 50 г): сколько чайных ложек сахара скрывается в этой порции к наггетсам?",
          spoonsAmount: 5,
          options: [
            { id: "opt_1", text: "1 ложка", spoons: 1 },
            { id: "opt_3", text: "3 ложки", spoons: 3 },
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_8", text: "8 ложек", spoons: 8 }
          ],
          correctAnswer: "opt_5",
          hint: "Густая сиропообразная консистенция соуса создается сахаром, которого в составе почти 50%.",
          explanation: "В маленькой 50-граммовой порции сладкого чили содержится около 5 чайных ложек сахара (~20-22 г) — почти столько же, сколько в шоколадном батончике!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 11: ХЛЕБНАЯ КОРЗИНА И ПЕКАРНЯ (Bakery) — 5 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 11,
      number: 11,
      department: "Пекарня и хлебобулочный цех",
      title: "Хлебная корзина и пекарня",
      subtitle: "Почему несладкая выпечка и тосты вызывают скачки сахара?",
      themeColor: "#D97706",
      rewardPerQuestion: 25,
      maxCoins: 125,
      icon: "🥖",
      hint: "Патока, солод и декстроза — любимые друзья пекарей для пышности и темного цвета!",
      questions: [
        {
          id: "L11_Q1",
          levelId: 11,
          number: 1,
          productName: "Бородинский хлеб",
          svgKey: "toast_bread_pack",
          type: "select_sugar",
          prompt: "Бородинский хлеб: какой ингредиент придает ему сладость и глубокий темный цвет?",
          compositionText: "Мука ржаная, мука пшеничная, вода, сахар, солод ржаной ферментированный, патока крахмальная, соль, кориандр.",
          options: [
            { id: "flour", text: "Ржаная мука" },
            { id: "malt_molasses", text: "Патока крахмальная и сахар" },
            { id: "coriander", text: "Кориандр" },
            { id: "salt", text: "Соль" }
          ],
          correctAnswer: "malt_molasses",
          hint: "Патока — это густой побочный продукт переработки крахмала, насыщенный мальтозой.",
          explanation: "В бородинском хлебе по ГОСТу обязательно используется сахар и мальтозная патока — в 100 г до 4-6 г сахаров!"
        },
        {
          id: "L11_Q2",
          levelId: 11,
          number: 2,
          productName: "Булочка для бургера с кунжутом",
          svgKey: "croissants_cheese",
          type: "spoons_quiz",
          prompt: "Булочка для бургера (1 шт): сколько чайных ложек сахара в этой мягкой булочке?",
          spoonsAmount: 2,
          options: [
            { id: "opt_0", text: "0 ложек", spoons: 0 },
            { id: "opt_2", text: "2 ложки", spoons: 2 },
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_7", text: "7 ложек", spoons: 7 }
          ],
          correctAnswer: "opt_2",
          hint: "Сахар нужен для карамелизации на тостере, чтобы бургер не размокал от соуса.",
          explanation: "В одной пышной булочке для бургера содержится около 2 чайных ложек чистого сахара (~8-10 г)!"
        },
        {
          id: "L11_Q3",
          levelId: 11,
          number: 3,
          productName: "Соленые крекеры",
          svgKey: "oat_cookies_pack",
          type: "select_sugar",
          prompt: "Крекеры соленые: какой скрытый сахар содержится в СОЛЕНОМ снеке?",
          compositionText: "Мука пшеничная, пальмовое масло, сироп инвертный, разрыхлитель, соль морская, мальтодекстрин, эмульгатор.",
          options: [
            { id: "flour", text: "Мука пшеничная" },
            { id: "palm_oil", text: "Пальмовое масло" },
            { id: "maltodextrin_invert", text: "Инвертный сироп и мальтодекстрин" },
            { id: "salt", text: "Морская соль" }
          ],
          correctAnswer: "maltodextrin_invert",
          hint: "Даже в откровенно соленых крекерах есть сахара для рассыпчатости теста.",
          explanation: "Инвертный сироп и мальтодекстрин добавляют для хрусткости и румянца, хотя на вкус крекер соленый!"
        },
        {
          id: "L11_Q4",
          levelId: 11,
          number: 4,
          productName: "Тостовый сэндвичный хлеб",
          svgKey: "toast_bread_pack",
          type: "compare_least",
          prompt: "Какой вид хлеба содержит НАИМЕНЬШЕЕ количество добавленного сахара?",
          options: [
            { id: "brioche", text: "Булочка бриошь французская", svgKey: "croissants_cheese" },
            { id: "american_toast", text: "Американский тостовый хлеб", svgKey: "toast_bread_pack" },
            { id: "sourdough", text: "Традиционный хлеб на закваске (мука, вода, соль)", svgKey: "toast_bread_pack" },
            { id: "borodinsky", text: "Бородинский с патокой", svgKey: "toast_bread_pack" }
          ],
          correctAnswer: "sourdough",
          hint: "Традиционный ремесленный тартин на закваске выпекают без добавления сахара и патоки.",
          explanation: "Хлеб длительного брожения на закваске содержит 0 г добавленного сахара — только мука, закваска, вода и соль."
        },
        {
          id: "L11_Q5",
          levelId: 11,
          number: 5,
          productName: "Круассан классический без начинки",
          svgKey: "croissants_cheese",
          type: "yes_no",
          prompt: "Французский круассан без начинки: есть ли сахар в самом слоеном тесте?",
          compositionText: "Мука пшеничная, сливочное масло 82%, вода, сахар (6%), дрожжи, соль, пшеничная клейковина.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "В слоеное дрожжевое тесто обязательно кладут сахар для питания дрожжей и карамелизации слоев.",
          explanation: "Да! Даже в круассане без начинки содержится около 1.5 чайных ложек сахара в самом тесте."
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 12: КОФЕЙНЯ И НАПИТКИ «НА БЕГУ» (Coffee Shop) — 5 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 12,
      number: 12,
      department: "Городская кофейня",
      title: "Кофейня и напитки «на бегу»",
      subtitle: "Раскрой сахарные бомбы в сиропах, топпингах и взбитых сливках!",
      themeColor: "#9333EA",
      rewardPerQuestion: 25,
      maxCoins: 125,
      icon: "☕",
      hint: "Один сладкий раф или карамельный фраппе может содержать дневную норму сахара на 3 дня вперед!",
      questions: [
        {
          id: "L12_Q1",
          levelId: 12,
          number: 1,
          productName: "Карамельный Макиато",
          packaging: "Гранде 450 мл",
          svgKey: "coffee_drink",
          type: "spoons_quiz",
          prompt: "Карамельный Макиато 450 мл: сколько чайных ложек сахара в этом кофейном десерте?",
          spoonsAmount: 11,
          options: [
            { id: "opt_3", text: "3 ложки", spoons: 3 },
            { id: "opt_6", text: "6 ложек", spoons: 6 },
            { id: "opt_11", text: "11 ложек", spoons: 11 },
            { id: "opt_18", text: "18 ложек", spoons: 18 }
          ],
          correctAnswer: "opt_11",
          hint: "Ванильный сироп на дне + молоко + густой карамельный соус сверху!",
          explanation: "В карамельном макиато около 11 чайных ложек сахара (~44-50 г)! Это полноценный калорийный десерт, а не просто кофе."
        },
        {
          id: "L12_Q2",
          levelId: 12,
          number: 2,
          productName: "Ванильный Раф-кофе",
          packaging: "350 мл",
          svgKey: "drinking_yogurt_bottle",
          type: "select_sugar",
          prompt: "Раф-кофе: почему он такой сладкий еще до добавления сахара из пакетика?",
          compositionText: "Эспрессо, сливки 10-15%, ванильный сахар (20 г), сироп.",
          options: [
            { id: "espresso", text: "Эспрессо" },
            { id: "vanilla_sugar", text: "Ванильный сахар и сироп взбиваются вместе со сливками" },
            { id: "cream", text: "Чистые сливки" },
            { id: "milk_foam", text: "Молочная пенка" }
          ],
          correctAnswer: "vanilla_sugar",
          hint: "Классический рецепт рафа предполагает взбивание сливок прямо с порцией сахара пароотводом.",
          explanation: "В раф-кофе сахар закладывают сразу в питчер перед взбиванием (от 3 до 5 ложек сахара на порцию)!"
        },
        {
          id: "L12_Q3",
          levelId: 12,
          number: 3,
          productName: "Матча-Латте в кофейне",
          packaging: "400 мл",
          svgKey: "juice_box",
          type: "yes_no",
          prompt: "Зеленый Матча-латте: действительно ли он абсолютно полезен без сахара?",
          compositionText: "Зеленый чай матча порошок, кокосовое молоко, сахарная пудра в смеси матча (до 50%), сироп агавы.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "В большинстве сетевых кофеен используют готовую смесь матча с сахаром, чтобы скрыть природную горечь.",
          explanation: "Да! Промышленные смеси для матча-латте на 40-50% состоят из сахара, иначе напиток был бы слишком горьким для клиентов."
        },
        {
          id: "L12_Q4",
          levelId: 12,
          number: 4,
          productName: "Бутилированный Айс-кофе из холодильника",
          packaging: "0.25 л",
          svgKey: "coffee_drink",
          type: "spoons_quiz",
          prompt: "Бутилированный холодный кофе 0.25 л: сколько чайных ложек сахара в этой стеклянной бутылке?",
          spoonsAmount: 6,
          options: [
            { id: "opt_1", text: "1 ложка", spoons: 1 },
            { id: "opt_3", text: "3 ложки", spoons: 3 },
            { id: "opt_6", text: "6 ложек", spoons: 6 },
            { id: "opt_10", text: "10 ложек", spoons: 10 }
          ],
          correctAnswer: "opt_6",
          hint: "На этикетке написано «Кофейный напиток с молоком», сахара там больше, чем кофе.",
          explanation: "В маленькой бутылке 250 мл содержится около 6 чайных ложек сахара (~25 г) — сразу вся норма подростка!"
        },
        {
          id: "L12_Q5",
          levelId: 12,
          number: 5,
          productName: "Кофейный выбор сыщика",
          type: "compare_least",
          prompt: "Какой кофейный напиток содержит 0 г добавленного сахара?",
          options: [
            { id: "caramel_frappe", text: "Карамельный фраппучино со сливками", svgKey: "coffee_drink" },
            { id: "vanilla_latte", text: "Ванильный латте", svgKey: "coffee_drink" },
            { id: "black_americano", text: "Черный американо без сиропа", svgKey: "coffee_drink" },
            { id: "mocha_chocolate", text: "Моккачино с шоколадом", svgKey: "coffee_drink" }
          ],
          correctAnswer: "black_americano",
          hint: "Только чистый кофе и вода не содержат сахаров.",
          explanation: "Черный кофе (американо, эспрессо, фильтр-кофе) без сиропа и добавок содержит 0 г сахара и почти 0 калорий!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 13: АПТЕЧКА И «ВИТАМИНЫ» (Pharmacy & Meds) — 5 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 13,
      number: 13,
      department: "Аптечный пункт и БАДы",
      title: "Аптечка и «витамины»",
      subtitle: "Сахар прячется даже в лекарствах от простуды и витаминных желейках!",
      themeColor: "#059669",
      rewardPerQuestion: 30,
      maxCoins: 150,
      icon: "💊",
      hint: "Чтобы горькие лекарства пили дети, фармкомпании делают из них сладкие сиропы!",
      questions: [
        {
          id: "L13_Q1",
          levelId: 13,
          number: 1,
          productName: "Сироп от кашля детский",
          packaging: "Доза 10 мл",
          svgKey: "lemon_sauce",
          type: "select_sugar",
          prompt: "Детский сироп от кашля: что является его жидкой основой?",
          compositionText: "Активное вещество (амброксол 30 мг), сироп сорбитола, сахароза (до 60%), ароматизатор клубничный, вода.",
          options: [
            { id: "active", text: "Активное вещество" },
            { id: "sucrose_syrup", text: "Сахароза и сироп сорбитола" },
            { id: "flavoring", text: "Ароматизатор" },
            { id: "water", text: "Очищенная вода" }
          ],
          correctAnswer: "sucrose_syrup",
          hint: "В 1 мерной ложке сиропа сахара больше, чем самого лекарства, в сотни раз!",
          explanation: "В 10 мл сиропа содержится до 4-6 г сахарозы (целая ложка сахара), чтобы скрыть сильную химическую горечь!"
        },
        {
          id: "L13_Q2",
          levelId: 13,
          number: 2,
          productName: "Леденцы от боли в горле",
          packaging: "1 леденец 2.5 г",
          svgKey: "cherry_dumplings",
          type: "select_sugar",
          prompt: "Леденцы от боли в горле: из чего состоит карамельная основа леденца?",
          compositionText: "Изомальт или сахароза, жидкая глюкоза (патока), антисептики (2,4-дихлорбензиловый спирт), краситель, масло мяты.",
          options: [
            { id: "antiseptic", text: "Антисептик" },
            { id: "sugar_glucose", text: "Сахароза и жидкая глюкоза (патока)" },
            { id: "mint_oil", text: "Масло мяты" },
            { id: "dye", text: "Краситель" }
          ],
          correctAnswer: "sugar_glucose",
          hint: "Аптечный леденец изготавливается по той же технологии, что и обычная карамель «чупа-чупс».",
          explanation: "Один аптечный леденец на 90% состоит из сахара и глюкозной патоки (около 2-2.5 г сахара в каждой пастилке)!"
        },
        {
          id: "L13_Q3",
          levelId: 13,
          number: 3,
          productName: "Жевательные витамишки (мармелад)",
          packaging: "2 пастилки",
          svgKey: "glazed_strawberries",
          type: "yes_no",
          prompt: "Жевательные витамины-мишки: есть ли в них добавленный сахар?",
          compositionText: "Глюкозный сироп, сахар, желатин, комплекс витаминов, лимонная кислота, натуральный ароматизатор.",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Глюкозный сироп и сахар стоят на первом и втором местах состава!",
          explanation: "Да! Витаминные мишки — это обычные мармеладные конфеты с добавлением микродоз витаминов."
        },
        {
          id: "L13_Q4",
          levelId: 13,
          number: 4,
          productName: "Шипучий растворимый витамин C",
          packaging: "1 таблетка",
          svgKey: "fruit_water_bottle",
          type: "select_sugar",
          prompt: "Шипучий витамин C: какой подсластитель или углевод помогает таблетке быстро растворяться?",
          compositionText: "Аскорбиновая кислота 1000 мг, лимонная кислота, гидрокарбонат натрия, декстроза, сахарин, ароматизатор апельсиновый.",
          options: [
            { id: "ascorbic", text: "Аскорбиновая кислота" },
            { id: "dextrose", text: "Декстроза (быстрый сахар)" },
            { id: "soda", text: "Гидрокарбонат натрия" },
            { id: "flavor", text: "Апельсиновый ароматизатор" }
          ],
          correctAnswer: "dextrose",
          hint: "Декстроза служит наполнителем таблетки для прессования.",
          explanation: "Декстроза (D-глюкоза) часто используется в шипучих таблетках как формообразователь и подсластитель."
        },
        {
          id: "L13_Q5",
          levelId: 13,
          number: 5,
          productName: "Порошок от гриппа и простуды",
          packaging: "1 пакетик 15 г",
          svgKey: "instant_oatmeal_pouch",
          type: "spoons_quiz",
          prompt: "Горячий порошок от простуды (пакетик 15 г): сколько чайных ложек сахара в нем растворено?",
          spoonsAmount: 3,
          options: [
            { id: "opt_0", text: "0 ложек", spoons: 0 },
            { id: "opt_1", text: "1 ложка", spoons: 1 },
            { id: "opt_3", text: "3 ложки", spoons: 3 },
            { id: "opt_5", text: "5 ложек", spoons: 5 }
          ],
          correctAnswer: "opt_3",
          hint: "Парацетамола в пакетике всего 500-750 мг (0.75 г), а весь остальной вес пакетика (14 г) — это наполнитель.",
          explanation: "В 1 пакетике горячего противопростудного питья около 3 чайных ложек сахарозы (~12-13 г), чтобы заглушить горечь парацетамола!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 14: РЕСТОРАННЫЙ ФАСТФУД (Fast Food) — 6 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 14,
      number: 14,
      department: "Зона фастфуда и комбо-обедов",
      title: "Ресторанный фастфуд",
      subtitle: "Куриные крылышки, соус Цезарь и картофель с секретной глазурью!",
      themeColor: "#B91C1C",
      rewardPerQuestion: 30,
      maxCoins: 180,
      icon: "🍔",
      hint: "Чтобы панировка наггетсов и стрипсов была супер-хрустящей и коричневой, ее пропитывают декстрозой!",
      questions: [
        {
          id: "L14_Q1",
          levelId: 14,
          number: 1,
          productName: "Картофель фри из фастфуда",
          svgKey: "french_fries",
          type: "select_sugar",
          prompt: "Картофель фри: зачем при его заводской обработке используют декстрозу?",
          compositionText: "Картофель, смесь масел, соль, декстроза (раствор глюкозы), пирофосфат натрия.",
          options: [
            { id: "oil", text: "Для жирности" },
            { id: "dextrose_color", text: "Декстроза обеспечивает равномерный золотистый цвет при обжарке" },
            { id: "salt", text: "Для соленого вкуса" },
            { id: "pyrophosphate", text: "Для аромата" }
          ],
          correctAnswer: "dextrose_color",
          hint: "При погружении в горячее масло декстроза мгновенно карамелизуется, создавая глянец.",
          explanation: "Перед заморозкой брусочки картофеля омывают слабым раствором декстрозы, чтобы во фритюре они гарантированно стали золотистыми!"
        },
        {
          id: "L14_Q2",
          levelId: 14,
          number: 2,
          productName: "Салат Коул-Слоу (Капустный)",
          packaging: "Порция 150 г",
          svgKey: "lecho_jar",
          type: "spoons_quiz",
          prompt: "Овощной салат Коул-Слоу: сколько ложек сахара прячется в заправке этой полезной с виду капусты?",
          spoonsAmount: 4,
          options: [
            { id: "opt_0", text: "0 ложек", spoons: 0 },
            { id: "opt_1", text: "1 ложка", spoons: 1 },
            { id: "opt_4", text: "4 ложки", spoons: 4 },
            { id: "opt_7", text: "7 ложек", spoons: 7 }
          ],
          correctAnswer: "opt_4",
          hint: "Традиционная американская заправка коул-слоу делается из майонеза, уксуса и обильной порции сахара.",
          explanation: "В стандартной порции салата коул-слоу около 4 чайных ложек сахара (~16-18 г) — овощи превращаются в десерт!"
        },
        {
          id: "L14_Q3",
          levelId: 14,
          number: 3,
          productName: "Хрустящие куриные крылья BBQ",
          svgKey: "chicken_nuggets",
          type: "yes_no",
          prompt: "Крылышки в глазури BBQ: содержат ли они добавленный сахар?",
          compositionText: "Куриные крылья, маринад (вода, сахар, соевый соус, патока, карамель, ароматизатор дыма, чеснок).",
          options: [
            { id: "yes", text: "⚠️ ЕСТЬ скрытый сахар" },
            { id: "no", text: "🌿 НЕТ скрытого сахара" }
          ],
          correctAnswer: "yes",
          hint: "Сладковато-липкая корочка на мясе — верный признак сахара и патоки.",
          explanation: "Да! В порции крылышек барбекю может быть до 20-25 г сахара из карамельной патоки и соуса."
        },
        {
          id: "L14_Q4",
          levelId: 14,
          number: 4,
          productName: "Соус Цезарь для салата",
          svgKey: "mayonnaise_jar",
          type: "select_sugar",
          prompt: "Соус Цезарь фасованный: какой компонент часто добавляют для смягчения вкуса уксуса?",
          compositionText: "Масло растительное, вода, уксус, сыр пармезан, сахар (4%), желток, чеснок, анчоусы.",
          options: [
            { id: "parmesan", text: "Сыр пармезан" },
            { id: "sugar", text: "Сахар (маскирует кислоту)" },
            { id: "anchovies", text: "Анчоусы" },
            { id: "yolk", text: "Яичный желток" }
          ],
          correctAnswer: "sugar",
          hint: "В промышленном соусе Цезарь сахар балансирует уксусную кислоту.",
          explanation: "В ресторанном соусе Цезарь в порционном стаканчике (50 г) содержится около 1 чайной ложки чистого сахара."
        },
        {
          id: "L14_Q5",
          levelId: 14,
          number: 5,
          productName: "Комбо-обед: сытный перекус",
          type: "compare_least",
          prompt: "Какой элемент фастфуд-комбо содержит НАИМЕНЬШЕЕ количество скрытого сахара?",
          options: [
            { id: "soda_large", text: "Большой стакан газировки (0.5 л)", svgKey: "soda_bottle" },
            { id: "bbq_dip", text: "Дип-соус Барбекю", svgKey: "ketchup" },
            { id: "plain_burger_patty", text: "Говяжья котлета на гриле (без булки и соуса)", svgKey: "canned_beef" },
            { id: "apple_pie", text: "Жареный пирожок с вишней", svgKey: "cherry_dumplings" }
          ],
          correctAnswer: "plain_burger_patty",
          hint: "Чистое рубленое мясо на гриле без панировки и соусов не содержит сахара.",
          explanation: "Говяжья котлета из 100% фарша без панировки и соусов содержит 0 г углеводов и 0 г сахара!"
        },
        {
          id: "L14_Q6",
          levelId: 14,
          number: 6,
          productName: "Ванильный молочный коктейль",
          packaging: "0.4 л",
          svgKey: "banana_shake",
          type: "spoons_quiz",
          prompt: "Ванильный молочный шейк 0.4 л в ресторане фастфуда: сколько чайных ложек сахара в этом десерте?",
          spoonsAmount: 15,
          options: [
            { id: "opt_5", text: "5 ложек", spoons: 5 },
            { id: "opt_9", text: "9 ложек", spoons: 9 },
            { id: "opt_15", text: "15 ложек", spoons: 15 },
            { id: "opt_22", text: "22 ложки", spoons: 22 }
          ],
          correctAnswer: "opt_15",
          hint: "Коктейль состоит из мороженого на сиропе и сладкого ванильного топпинга.",
          explanation: "В стакане милкшейка 400 мл содержится около 15 чайных ложек сахара (~60-70 г) — трехдневная норма сахара для подростка в одном напитке!"
        }
      ]
    },

    // -----------------------------------------------------------------------
    // УРОВЕНЬ 15: БОСС-БАТТЛ «СИНТЕТИЧЕСКИЙ САХАРНЫЙ ТИТАН» (Boss Lab) — 5 вопросов [НОВЫЙ УРОВЕНЬ]
    // -----------------------------------------------------------------------
    {
      id: 15,
      number: 15,
      department: "Секретная лаборатория Сахарного Титана",
      title: "БОСС: Сахарный Титан",
      subtitle: "Финальная битва пищевого сыщика! Разгадай сложнейшие химические ловушки!",
      themeColor: "#7C3AED",
      rewardPerQuestion: 40,
      maxCoins: 200,
      icon: "👑",
      isBossLevel: true,
      hint: "Внимание: Сахарный Титан использует изомальтулозу, ГФС-55, гидролизаты и полиолы!",
      questions: [
        {
          id: "L15_Q1",
          levelId: 15,
          number: 1,
          productName: "Химическая загадка №1: ГФС-55",
          svgKey: "baby_formula",
          type: "select_sugar",
          prompt: "Сахарный Титан скрывается за аббревиатурой ГФС-55. Что означает число 55?",
          compositionText: "Глюкозно-фруктозный сироп модифицированный промышленный (ГФС-55).",
          options: [
            { id: "temp", text: "Температуру кипения 55°C" },
            { id: "fructose_pct", text: "55% чистой свободной фруктозы (High-Fructose Corn Syrup)" },
            { id: "year", text: "Год изобретения (1955)" },
            { id: "index", text: "Гликемический индекс 55" }
          ],
          correctAnswer: "fructose_pct",
          hint: "В США этот сироп называют HFCS-55, и он слаще обычного сахарозы.",
          explanation: "ГФС-55 содержит 55% фруктозы и 42% глюкозы. Это самый коварный промышленный подсластитель газировок в мире!"
        },
        {
          id: "L15_Q2",
          levelId: 15,
          number: 2,
          productName: "Химическая загадка №2: Изомальтулоза (Палатиноза)",
          svgKey: "cereal_snack_bar",
          type: "select_sugar",
          prompt: "В составе модного спортпита указана «Палатиноза». Что это за вещество?",
          compositionText: "Изомальтулоза (палатиноза) 100%, натуральный ароматизатор.",
          options: [
            { id: "vitamin", text: "Витаминный комплекс группы B" },
            { id: "mineral", text: "Хелатный минерал" },
            { id: "disaccharide", text: "Дисахарид из глюкозы и фруктозы (сахар медленного расщепления)" },
            { id: "amino", text: "Незаменимая аминокислота" }
          ],
          correctAnswer: "disaccharide",
          hint: "Окончание «-оза» прямо кричит о том, что это углевод/сахар!",
          explanation: "Изомальтулоза — это дисахарид (сахар), полученный ферментацией сахарозы. Хотя он усваивается медленнее, это все равно сахар!"
        },
        {
          id: "L15_Q3",
          levelId: 15,
          number: 3,
          productName: "Химическая загадка №3: Двойной агент Титана",
          svgKey: "caramel_dairy_dessert",
          type: "multi_select",
          prompt: "Сахарный Титан защищен двойной броней! Выбери ДВА псевдонима скрытого сахара:",
          compositionText: "Декстрин кукурузный гидролизованный, экстракт солодовый (мальтозный концентрат), соевый белок, клетчатка яблочная.",
          options: [
            { id: "soy_protein", text: "Соевый белок" },
            { id: "corn_dextrin", text: "Декстрин гидролизованный" },
            { id: "apple_fiber", text: "Клетчатка яблочная" },
            { id: "malt_extract", text: "Экстракт солодовый (мальтозный)" }
          ],
          correctAnswer: ["corn_dextrin", "malt_extract"],
          hint: "Выбери оба расщепленных углевода крахмала и ячменного зерна!",
          explanation: "Гидролизованный декстрин и солодовый экстракт — это скрытые сахара с преобладанием мальтозы и глюкозы!"
        },
        {
          id: "L15_Q4",
          levelId: 15,
          number: 4,
          productName: "Химическая загадка №4: Гликемический индекс",
          type: "compare_most",
          prompt: "Какой замаскированный ингредиент имеет САМЫЙ высокий гликемический индекс (быстрее всех поднимает сахар в крови)?",
          options: [
            { id: "fructose", text: "Фруктоза кристаллическая (ГИ ~20)" },
            { id: "table_sugar", text: "Обычный белый сахар (сахароза ГИ ~65)" },
            { id: "maltodextrin", text: "Мальтодекстрин промышленный (ГИ ~105-110)" },
            { id: "lactose", text: "Молочный сахар лактоза (ГИ ~46)" }
          ],
          correctAnswer: "maltodextrin",
          hint: "Этот углевод расщепляется ферментами слюны быстрее, чем чистая глюкоза!",
          explanation: "Мальтодекстрин имеет чудовищный ГИ 105-110 — он усваивается организмом быстрее и агрессивнее чистого столового сахара!"
        },
        {
          id: "L15_Q5",
          levelId: 15,
          number: 5,
          productName: "ФИНАЛЬНЫЙ УДАР: Золотое правило сыщика",
          svgKey: "diploma",
          type: "select_sugar",
          prompt: "Как по закону производители обязаны указывать ингредиенты на этикетке любого продукта?",
          options: [
            { id: "alphabet", text: "По алфавиту" },
            { id: "cost", text: "По стоимости ингредиентов" },
            { id: "weight_descending", text: "Строго в порядке убывания их массы (от большего к меньшему)" },
            { id: "random", text: "В произвольном порядке" }
          ],
          correctAnswer: "weight_descending",
          hint: "Первый компонент в списке — это то, из чего продукт состоит больше всего.",
          explanation: "БРАВО, ДЕТЕКТИВ! ТИТАН ПОВЕРЖЕН! Ингредиенты ВСЕГДА перечисляются в порядке убывания массы. Если сахар в первых 3-4 пунктах — перед тобой сладкая бомба!"
        }
      ]
    }
  ];

  // =========================================================================
  // DETECTIVE STORE: BOOSTERS CATALOG
  // =========================================================================

  var BOOSTERS = [
    {
      id: "booster_5050",
      name: "Лупа истины (50:50)",
      cost: 20,
      icon: "🔍",
      tag: "Расходник",
      description: "Исключает 2 заведомо неверных варианта ответа прямо во время расследования.",
      usageHint: "Нажмите на лупу под вопросом, чтобы отсечь ложные следы!"
    },
    {
      id: "booster_shield",
      name: "Сахарный щит",
      cost: 35,
      icon: "🛡️",
      tag: "Защита",
      description: "Поглощает урон: при ошибке в текущем раунде жизнь НЕ сгорает.",
      usageHint: "Щит активируется на раунд и автоматически спасает от одной ошибки."
    },
    {
      id: "booster_hint",
      name: "Химический реагент",
      cost: 15,
      icon: "🧪",
      tag: "Подсказка",
      description: "Анализирует состав продукта и подсвечивает подозрительные слова-псевдонимы.",
      usageHint: "Дает подробную лабораторную подсказку нутрициолога."
    },
    {
      id: "booster_heart",
      name: "Аптечка сыщика (+1 ❤️)",
      cost: 30,
      icon: "❤️",
      tag: "Лечение",
      description: "Мгновенно восстанавливает 1 потерянную жизнь прямо во время прохождения уровня.",
      usageHint: "Используйте, когда осталось мало сердец перед сложным вопросом."
    },
    {
      id: "booster_freeze",
      name: "Заморозка времени (+15 сек)",
      cost: 15,
      icon: "⏳",
      tag: "Таймер",
      description: "Дает +15 секунд дополнительного времени в режиме Блиц-марафона и на Боссе.",
      usageHint: "Продлевает время раунда для спокойного анализа этикетки."
    }
  ];

  // =========================================================================
  // DETECTIVE WARDROBE: AVATARS
  // =========================================================================

  var AVATARS = [
    // Free default avatars
    { id: "avatar_detective_boy", name: "Юный детектив (Макс)", emoji: "👦🔍", cost: 0, unlocked: true },
    { id: "avatar_detective_girl", name: "Сыщица Алиса", emoji: "👧🔎", cost: 0, unlocked: true },
    { id: "avatar_cat", name: "Кот-детектив Ватсон", emoji: "🐱🕵️", cost: 0, unlocked: true },
    { id: "avatar_owl", name: "Сова-инспектор София", emoji: "🦉👓", cost: 0, unlocked: true },

    // Premium unlockable avatars
    { id: "avatar_cyber", name: "Кибер-сыщик 2077", emoji: "🤖⚡", cost: 50, unlocked: false, desc: "Оснащен биосканером углеводов" },
    { id: "avatar_sherlock", name: "Золотой Шерлок", emoji: "🎩✨", cost: 80, unlocked: false, desc: "Классическая дедукция и золотой монокль" },
    { id: "avatar_scientist", name: "Профессор Сахаровед", emoji: "👨‍🔬🧪", cost: 100, unlocked: false, desc: "Доктор биохимии и пищевой инспекции" },
    { id: "avatar_chef", name: "Шеф-нутрициолог", emoji: "🧑‍🍳🥗", cost: 70, unlocked: false, desc: "Мастер кулинарных расследований" }
  ];

  // =========================================================================
  // UI VISUAL THEMES (Стили оформления)
  // =========================================================================

  var THEMES = [
    {
      id: "theme_default",
      name: "Slate Classic (Темный космос)",
      cost: 0,
      previewColor: "#0F172A",
      accentColor: "#2563EB",
      description: "Стандартная профессиональная тема"
    },
    {
      id: "theme_cyber",
      name: "Cyberpunk Glow (Неоновый кибер)",
      cost: 60,
      previewColor: "#083344",
      accentColor: "#06B6D4",
      description: "Яркие бирюзовые неоновые акценты и темный фон"
    },
    {
      id: "theme_eco",
      name: "Eco Lab (Изумрудная лаборатория)",
      cost: 60,
      previewColor: "#064E3B",
      accentColor: "#10B981",
      description: "Свежая травянисто-зеленая палитра ЗОЖ"
    },
    {
      id: "theme_amethyst",
      name: "Royal Amethyst (Королевский аметист)",
      cost: 60,
      previewColor: "#3B0764",
      accentColor: "#A855F7",
      description: "Глубокие фиолетовые тона с золотой отделкой"
    },
    {
      id: "theme_noir",
      name: "Golden Noir (Ретро-детектив)",
      cost: 60,
      previewColor: "#1C1917",
      accentColor: "#F59E0B",
      description: "Атмосфера винтажного детективного агентства"
    }
  ];

  // =========================================================================
  // SECRET SCIENCE DOSSIERS (Секретные архивные досье)
  // =========================================================================

  var DOSSIERS = [
    {
      id: "dossier_aliases",
      title: "Энциклопедия: 60+ псевдонимов сахара",
      cost: 40,
      icon: "📜",
      category: "Химия",
      summary: "Полный классификатор сахаров по 4 химическим группам: сахарозы, сиропы, декстрины и полиолы.",
      content: [
        "1. Простые сахара: сахароза, глюкоза, фруктоза, декстроза, мальтоза, галактоза.",
        "2. Промышленные сиропы: кукурузный сироп, сироп глюкозы, глюкозно-фруктозный сироп (ГФС/HFCS), инвертный сироп, патока мальтозная, карамельный сироп.",
        "3. «Натуральные» подсластители: концентрат яблочного/виноградного сока, финиковый сироп, сироп агавы, кленовый сироп, мёд, кокосовый сахар.",
        "4. Крахмальные дериваты: мальтодекстрин (ГИ 110), гидролизованный крахмал, декстрин, изомальтоолигосахарид."
      ]
    },
    {
      id: "dossier_brain",
      title: "Досье: Сахар и мозг подростка",
      cost: 50,
      icon: "🧠",
      category: "Биология",
      summary: "Как быстрые скачки глюкозы влияют на дофаминовые рецепторы, память, сон и усталость на уроках.",
      content: [
        "• Дофаминовая ловушка: сахар активирует ту же систему вознаграждения в мозге, вызывая желание съесть добавку через 20 минут.",
        "• Инсулиновые качели: резкий скачок глюкозы сменяется резким спадом — именно поэтому после сладкого батончика на уроке наступает сонливость и упадок сил.",
        "• Память и нейрогенез: избыток добавленного сахара снижает концентрацию внимания и долговременное запоминание формул и правил."
      ]
    },
    {
      id: "dossier_recipes",
      title: "Рецепты: 5 перекусов без добавленного сахара",
      cost: 60,
      icon: "🥗",
      category: "Практика",
      summary: "Простые и вкусные перекусы для школы, которые дают ровную энергию на 3–4 часа.",
      content: [
        "1. Батончики «Энергия орехов»: овсяные хлопья, банан, грецкие орехи и щепотка корицы (запекать 15 минут).",
        "2. Зеленый хруст: ломтики огурца и моркови с домашним соусом из натурального белого йогурта, укропа и чеснока.",
        "3. Ягодный чиа-пудинг: семена чиа, теплое молоко или кефир, свежемороженая черника (настоять ночь в холодильнике).",
        "4. Яблочные тосты с арахисовой пастой: кружочки свежего яблока, 100% арахисовая паста без сахара, семена тыквы.",
        "5. Сырный ролл в лаваше: тонкий цельнозерновой лаваш, сыр, помидор и листья салата."
      ]
    }
  ];

  // =========================================================================
  // INTERACTIVE SUGAR CALCULATOR DATABASE
  // =========================================================================

  var CALCULATOR_FOODS = [
    { name: "Сладкая кола (0.5 л)", portionWeight: 500, sugarGrams: 53, spoons: 13, category: "Напитки" },
    { name: "Вишневый нектар (1 л)", portionWeight: 1000, sugarGrams: 100, spoons: 25, category: "Напитки" },
    { name: "Энергетик (0.25 л)", portionWeight: 250, sugarGrams: 28, spoons: 7, category: "Напитки" },
    { name: "Холодный чай (0.5 л)", portionWeight: 500, sugarGrams: 36, spoons: 9, category: "Напитки" },
    { name: "Бабл-ти с тапиокой (0.5 л)", portionWeight: 500, sugarGrams: 56, spoons: 14, category: "Напитки" },
    { name: "Карамельный Макиато (450 мл)", portionWeight: 450, sugarGrams: 44, spoons: 11, category: "Кофе" },
    { name: "Ванильный Раф (350 мл)", portionWeight: 350, sugarGrams: 32, spoons: 8, category: "Кофе" },
    { name: "Кетчуп (1 столовая ложка, 20 г)", portionWeight: 20, sugarGrams: 5, spoons: 1.25, category: "Соусы" },
    { name: "Соус Барбекю (30 г)", portionWeight: 30, sugarGrams: 12, spoons: 3, category: "Соусы" },
    { name: "Соус Терияки (30 г)", portionWeight: 30, sugarGrams: 10, spoons: 2.5, category: "Соусы" },
    { name: "Глазированный сырок (40 г)", portionWeight: 40, sugarGrams: 14, spoons: 3.5, category: "Сладости" },
    { name: "Шоколадный батончик (50 г)", portionWeight: 50, sugarGrams: 30, spoons: 7.5, category: "Сладости" },
    { name: "Кукурузные хлопья (порция 50 г)", portionWeight: 50, sugarGrams: 15, spoons: 3.75, category: "Завтраки" },
    { name: "Фруктовый йогурт (150 г)", portionWeight: 150, sugarGrams: 20, spoons: 5, category: "Молочка" },
    { name: "Молочный пудинг (120 г)", portionWeight: 120, sugarGrams: 22, spoons: 5.5, category: "Молочка" },
    { name: "Булочка для бургера (80 г)", portionWeight: 80, sugarGrams: 8, spoons: 2, category: "Выпечка" },
    { name: "Яблоко свежее (150 г, натуральный сахар)", portionWeight: 150, sugarGrams: 15, spoons: 3.75, category: "Фрукты", isNatural: true },
    { name: "Огурец свежий (100 г)", portionWeight: 100, sugarGrams: 1.5, spoons: 0.3, category: "Овощи", isNatural: true }
  ];

  // =========================================================================
  // 16 DETECTIVE ACHIEVEMENTS
  // =========================================================================

  var ACHIEVEMENTS = [
    {
      id: "first_step",
      title: "Первый след",
      icon: "🥤",
      description: "Завершить Уровень 1 «Напитки»",
      rewardTitle: "Юный детектив"
    },
    {
      id: "breakfast_pro",
      title: "Завтрак чемпиона",
      icon: "🥣",
      description: "Пройти Уровень 2 «Завтраки» без единой ошибки",
      rewardTitle: "Эксперт бакалеи"
    },
    {
      id: "detective_eye",
      title: "Глаз-алмаз",
      icon: "🔍",
      description: "Разоблачить все 6 замаскированных сахаров Уровня 3",
      rewardTitle: "Зоркий сыщик"
    },
    {
      id: "sauce_master",
      title: "Мастер соусов",
      icon: "🥫",
      description: "Распознать сахар во всех соусах Уровня 4",
      rewardTitle: "Шеф-инспектор"
    },
    {
      id: "canning_guru",
      title: "Консервный гуру",
      icon: "🐟",
      description: "Безошибочно найти консервы с наименьшим сахаром (Ур. 5)",
      rewardTitle: "Консервный гуру"
    },
    {
      id: "dairy_sleuth",
      title: "Молочный сыщик",
      icon: "🥛",
      description: "Раскрыть двойную ловушку карамельного пудинга (L6.5)",
      rewardTitle: "Молочный сыщик"
    },
    {
      id: "freezer_titan",
      title: "Ледяной титан",
      icon: "❄️",
      description: "Пройти Уровень 7 «Заморозка»",
      rewardTitle: "Ледяной титан"
    },
    {
      id: "fitness_buster",
      title: "Фитнес-разоблачитель",
      icon: "🥑",
      description: "Пройти Уровень 8 «ЗОЖ и фитнес-мифы»",
      rewardTitle: "ЗОЖ-инспектор"
    },
    {
      id: "kid_shield",
      title: "Хранитель буфета",
      icon: "🧸",
      description: "Пройти Уровень 9 «Детское меню и буфет»",
      rewardTitle: "Школьный инспектор"
    },
    {
      id: "asian_master",
      title: "Мастер вока и палочек",
      icon: "🥢",
      description: "Разоблачить сахар во всех блюдах Азиатского Уровня 10",
      rewardTitle: "Вок-мастер"
    },
    {
      id: "pharmacy_sleuth",
      title: "Аптечный ревизор",
      icon: "💊",
      description: "Найти скрытый сахар в лекарствах Уровня 13",
      rewardTitle: "Фарм-детектив"
    },
    {
      id: "boss_slayer",
      title: "Победитель Титана",
      icon: "👑",
      description: "Одолеть финального Босса в Уровне 15!",
      rewardTitle: "Истребитель Сахарных Титанов"
    },
    {
      id: "shopaholic",
      title: "Снаряженный сыщик",
      icon: "🛍️",
      description: "Купить свой первый бустер или улучшение в Лавке",
      rewardTitle: "Подготовленный детектив"
    },
    {
      id: "shield_master",
      title: "Непробиваемый щит",
      icon: "🛡️",
      description: "Успешно спастись от ошибки с помощью Сахарного Щита",
      rewardTitle: "Мастер защиты"
    },
    {
      id: "coin_collector",
      title: "Золотой фонд",
      icon: "🪙",
      description: "Накопить более 300 монет на игровом балансе",
      rewardTitle: "Богатый детектив"
    },
    {
      id: "sugar_grandmaster",
      title: "Великий Грандмастер 15/15",
      icon: "🎖️",
      description: "Пройти все 15 уровней расширенной игры (100% расследование)!",
      rewardTitle: "Легендарный Сахарный Грандмастер"
    }
  ];

  // Fast lookups & Economy Precomputations
  var QUESTIONS_MAP = {};
  var TOTAL_QUESTIONS_COUNT = 0;
  var TOTAL_POSSIBLE_COINS = 100; // Starter coins

  LEVELS.forEach(function(lvl) {
    TOTAL_POSSIBLE_COINS += (lvl.questions.length * lvl.rewardPerQuestion);
    lvl.questions.forEach(function(q) {
      QUESTIONS_MAP[q.id] = q;
      TOTAL_QUESTIONS_COUNT++;
    });
  });

  SugarApp.DATA = {
    LEVELS: LEVELS,
    BOOSTERS: BOOSTERS,
    AVATARS: AVATARS,
    THEMES: THEMES,
    DOSSIERS: DOSSIERS,
    CALCULATOR_FOODS: CALCULATOR_FOODS,
    ACHIEVEMENTS: ACHIEVEMENTS,
    QUESTIONS_MAP: QUESTIONS_MAP,
    TOTAL_QUESTIONS_COUNT: TOTAL_QUESTIONS_COUNT,
    TOTAL_POSSIBLE_COINS: TOTAL_POSSIBLE_COINS,
    checkQuestionAnswer: checkQuestionAnswer,
    getQuestionById: function(id) {
      return QUESTIONS_MAP[id] || null;
    },
    getLevelById: function(id) {
      if (typeof id === 'string' && (id.startsWith('L') || id.startsWith('l'))) {
        id = id.substring(1);
      }
      var num = Number(id);
      for (var i = 0; i < LEVELS.length; i++) {
        if (LEVELS[i].id === num || LEVELS[i].number === num) {
          return LEVELS[i];
        }
      }
      return null;
    },
    getBoosterById: function(id) {
      for (var i = 0; i < BOOSTERS.length; i++) {
        if (BOOSTERS[i].id === id) return BOOSTERS[i];
      }
      return null;
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SugarApp.DATA;
  }
})(typeof window !== 'undefined' ? window : global);
