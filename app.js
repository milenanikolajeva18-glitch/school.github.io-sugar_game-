/**
 * Hidden Sugar Detective: PRO Edition (Сахарный детектив — Расширенная версия)
 * Main Application Controller
 * Pure vanilla JavaScript ES6+. Zero external dependencies.
 * Handles 15 levels, in-game boosters, live store, sugar calculator, marathon mode,
 * boss battle mechanics, themes, audio synthesis, and educational drawers.
 */
(function(global) {
  'use strict';

  var SugarApp = global.SugarApp = global.SugarApp || {};

  var DATA = SugarApp.DATA;
  var State = SugarApp.State;
  var Audio = SugarApp.Audio;
  var Graphics = SugarApp.Graphics;
  var Confetti = SugarApp.Confetti;

  // Active game runtime state
  var currentLevelData = null;
  var currentQuestionIndex = 0;
  var currentQuestion = null;
  var isAnsweringLocked = false;
  var selectedAnswerTemp = null;
  var currentCatalogFilter = 'all';

  // Marathon Mode Runtime State
  var marathonTimer = null;
  var marathonSecondsLeft = 60;
  var marathonScore = 0;
  var marathonStreak = 0;
  var marathonCurrentQuestion = null;
  var marathonIsLocked = false;

  // =========================================================================
  // UTILITY HELPERS
  // =========================================================================

  function shuffleArray(arr) {
    if (!arr || !Array.isArray(arr)) return [];
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  // =========================================================================
  // 1. SCREEN ROUTER & NAVIGATION
  // =========================================================================

  var SCREENS = {
    HERO: 'screen-hero',
    HUB: 'screen-hub',
    CATALOG: 'screen-catalog',
    GAME: 'screen-game',
    VICTORY: 'screen-victory'
  };

  var activeScreenId = SCREENS.HERO;

  function showScreen(screenId) {
    if (!screenId) return;

    var allScreens = document.querySelectorAll('.screen');
    allScreens.forEach(function(s) {
      s.classList.remove('active');
    });

    var target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      activeScreenId = screenId;
    }

    if (screenId !== SCREENS.VICTORY && Confetti && Confetti.isRunning()) {
      Confetti.stop();
    }

    if (screenId === SCREENS.HUB) {
      updateHubView();
    } else if (screenId === SCREENS.CATALOG) {
      renderCatalog();
    } else if (screenId === SCREENS.VICTORY) {
      setupVictoryScreen();
    }

    updateGlobalHUD();
  }

  // =========================================================================
  // 2. MODAL CONTROLLER
  // =========================================================================

  function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      if (Audio) Audio.playSFX('click');
    }
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      if (Audio) Audio.playSFX('click');
    }
    if (modalId === 'modal-marathon' && marathonTimer) {
      clearInterval(marathonTimer);
      marathonTimer = null;
    }
  }

  function closeAllModals() {
    if (marathonTimer) {
      clearInterval(marathonTimer);
      marathonTimer = null;
    }
    var modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(function(m) {
      m.classList.remove('open');
    });
  }

  // =========================================================================
  // 3. GLOBAL HUD & THEMES
  // =========================================================================

  function updateGlobalHUD() {
    if (!State) return;

    var coins = State.getCoins();
    var coinsEls = [
      document.getElementById('hub-coins-val'),
      document.getElementById('catalog-coins-val'),
      document.getElementById('hud-coins-val'),
      document.getElementById('shop-coins-val')
    ];
    coinsEls.forEach(function(el) {
      if (el) el.textContent = coins;
    });

    // Update Hearts in Game Screen
    var lives = State.getLives();
    for (var i = 1; i <= 3; i++) {
      var heart = document.getElementById('heart-' + i);
      if (heart) {
        if (i <= lives) {
          heart.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#EF4444"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
          heart.style.opacity = '1';
        } else {
          heart.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#475569"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
          heart.style.opacity = '0.35';
        }
      }
    }

    // Shield active indicator on hearts container
    var heartsContainer = document.getElementById('hud-hearts-container');
    if (heartsContainer) {
      if (State.isShieldActive()) {
        heartsContainer.classList.add('shield-active');
      } else {
        heartsContainer.classList.remove('shield-active');
      }
    }

    // Update in-game booster toolbar badge counts
    updateBoosterToolbar();

    // Sync theme
    applyActiveTheme();
  }

  function applyActiveTheme() {
    var themeId = State.getActiveTheme ? State.getActiveTheme() : 'theme_default';
    document.body.setAttribute('data-theme', themeId);
  }

  function updateBoosterToolbar() {
    var count5050 = State.getBoosterCount('booster_5050');
    var countShield = State.getBoosterCount('booster_shield');
    var countHint = State.getBoosterCount('booster_hint');
    var countHeart = State.getBoosterCount('booster_heart');
    var countFreeze = State.getBoosterCount('booster_freeze');

    var b5050 = document.getElementById('badge-boost-5050');
    if (b5050) {
      b5050.textContent = count5050;
      b5050.className = 'booster-badge-count' + (count5050 === 0 ? ' zero' : '');
    }

    var bShield = document.getElementById('badge-boost-shield');
    var btnShield = document.getElementById('btn-boost-shield');
    if (bShield) {
      bShield.textContent = countShield;
      bShield.className = 'booster-badge-count' + (countShield === 0 ? ' zero' : '');
    }
    if (btnShield) {
      if (State.isShieldActive()) {
        btnShield.classList.add('active-shield');
        btnShield.title = 'Сахарный щит уже активен!';
      } else {
        btnShield.classList.remove('active-shield');
        btnShield.title = 'Защитить от 1 ошибки';
      }
    }

    var bHint = document.getElementById('badge-boost-hint');
    if (bHint) {
      bHint.textContent = countHint;
      bHint.className = 'booster-badge-count' + (countHint === 0 ? ' zero' : '');
    }

    var bHeart = document.getElementById('badge-boost-heart');
    if (bHeart) {
      bHeart.textContent = countHeart;
      bHeart.className = 'booster-badge-count' + (countHeart === 0 ? ' zero' : '');
    }

    var bFreeze = document.getElementById('badge-boost-freeze');
    if (bFreeze) {
      bFreeze.textContent = countFreeze;
      bFreeze.className = 'booster-badge-count' + (countFreeze === 0 ? ' zero' : '');
    }

    var mFreeze = document.getElementById('marathon-freeze-badge');
    if (mFreeze) {
      mFreeze.textContent = countFreeze;
    }
  }

  function showFloatingCoinBadge(amount) {
    var hudCoins = document.getElementById('hud-coins-pill') || document.getElementById('hub-coins-pill');
    if (!hudCoins) return;

    var badge = document.createElement('div');
    badge.className = 'floating-coin-badge';
    badge.textContent = '+' + amount + ' 🪙';
    badge.style.position = 'absolute';
    badge.style.top = '-20px';
    badge.style.right = '10px';
    badge.style.color = '#FDE047';
    badge.style.fontWeight = '900';
    badge.style.fontSize = '16px';
    badge.style.textShadow = '0 0 10px rgba(245,158,11,0.8)';
    badge.style.animation = 'float-up-fade 1.2s forwards ease-out';
    badge.style.pointerEvents = 'none';

    hudCoins.style.position = 'relative';
    hudCoins.appendChild(badge);

    setTimeout(function() {
      if (badge && badge.parentNode) {
        badge.parentNode.removeChild(badge);
      }
    }, 1250);
  }

  // =========================================================================
  // 4. HUB CONTROLLER
  // =========================================================================

  function updateHubView() {
    var player = State.getPlayer();
    var nameEl = document.getElementById('hub-player-name');
    var avatarContainer = document.getElementById('hub-avatar-container');
    var rankTextEl = document.getElementById('hub-player-rank-text');

    if (nameEl) nameEl.textContent = player.name || 'Юный детектив';

    if (avatarContainer && Graphics) {
      avatarContainer.innerHTML = Graphics.getAvatarSvg(player.avatarId || 'avatar_boy', 76);
    }

    if (rankTextEl) {
      var completedCount = State.getCompletedLevels().length;
      if (completedCount >= 15) {
        rankTextEl.textContent = 'Грандмастер Пищевой Инспекции 👑';
      } else if (completedCount >= 10) {
        rankTextEl.textContent = 'Старший инспектор детекции';
      } else if (completedCount >= 5) {
        rankTextEl.textContent = 'Опытный сыщик этикеток';
      } else {
        rankTextEl.textContent = 'Стажер пищевой инспекции';
      }
    }
  }

  // =========================================================================
  // 5. LEVEL CATALOG (15 LEVELS)
  // =========================================================================

  function renderCatalog() {
    var grid = document.getElementById('catalog-grid');
    var badge = document.getElementById('catalog-progress-badge');
    if (!grid) return;

    var completed = State.getCompletedLevels();
    if (badge) {
      badge.textContent = 'Пройдено: ' + completed.length + ' / 15';
    }

    grid.innerHTML = '';
    var levels = DATA.LEVELS;

    levels.forEach(function(lvl) {
      // Filter logic
      if (currentCatalogFilter === 'starter' && lvl.number > 5) return;
      if (currentCatalogFilter === 'pro' && (lvl.number < 6 || lvl.number > 10)) return;
      if (currentCatalogFilter === 'expert' && lvl.number < 11) return;

      var isUnlocked = State.isLevelUnlocked(lvl.number);
      var isCompleted = State.isLevelCompleted(lvl.number);

      var card = document.createElement('div');
      var cardClasses = 'level-card';
      if (!isUnlocked) cardClasses += ' locked';
      if (isCompleted) cardClasses += ' completed';
      if (lvl.isBossLevel) cardClasses += ' boss-card';
      card.className = cardClasses;
      card.setAttribute('data-level-num', lvl.number);

      var themeColor = lvl.themeColor || '#2563EB';

      var topBar = document.createElement('div');
      topBar.className = 'level-card-top-bar';
      topBar.style.backgroundColor = themeColor;
      topBar.style.height = '6px';
      topBar.style.width = '100%';
      topBar.style.borderRadius = '10px 10px 0 0';

      var header = document.createElement('div');
      header.className = 'level-card-header';
      header.style.padding = '12px 14px 4px 14px';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';

      var badgeLevel = document.createElement('div');
      badgeLevel.className = 'badge';
      badgeLevel.style.fontSize = '11px';
      badgeLevel.style.padding = '2px 8px';
      badgeLevel.textContent = lvl.isBossLevel ? '👑 ФИНАЛЬНЫЙ БОСС' : 'Уровень ' + lvl.number;

      var coinReward = document.createElement('div');
      coinReward.className = 'level-card-reward';
      coinReward.style.color = '#FDE047';
      coinReward.style.fontWeight = 'bold';
      coinReward.style.fontSize = '12px';
      coinReward.innerHTML = '+' + lvl.rewardPerQuestion + ' 🪙';

      header.appendChild(badgeLevel);
      header.appendChild(coinReward);

      var body = document.createElement('div');
      body.className = 'level-card-body';
      body.style.padding = '8px 14px 14px 14px';

      var iconSlot = document.createElement('div');
      iconSlot.style.fontSize = '36px';
      iconSlot.style.margin = '4px 0';
      iconSlot.textContent = lvl.icon || '🔍';

      var title = document.createElement('div');
      title.className = 'level-card-title';
      title.style.fontSize = '16px';
      title.style.fontWeight = '800';
      title.textContent = lvl.title;

      var dept = document.createElement('div');
      dept.style.fontSize = '11px';
      dept.style.color = 'var(--text-muted)';
      dept.style.marginTop = '2px';
      dept.textContent = lvl.department || '';

      var desc = document.createElement('div');
      desc.className = 'level-card-desc';
      desc.style.fontSize = '12px';
      desc.style.color = 'var(--text-secondary)';
      desc.style.marginTop = '6px';
      desc.style.lineHeight = '1.3';
      desc.textContent = lvl.subtitle;

      var meta = document.createElement('div');
      meta.style.display = 'flex';
      meta.style.justifyContent = 'space-between';
      meta.style.alignItems = 'center';
      meta.style.marginTop = '10px';
      meta.style.fontSize = '11px';
      meta.style.color = 'var(--text-muted)';

      var qCount = document.createElement('span');
      qCount.textContent = lvl.questions.length + ' вопросов';

      var statusSpan = document.createElement('span');
      if (isCompleted) {
        statusSpan.style.color = 'var(--color-success)';
        statusSpan.textContent = '★ Пройдено';
      } else if (isUnlocked) {
        statusSpan.style.color = 'var(--color-info)';
        statusSpan.textContent = 'Доступен →';
      } else {
        statusSpan.textContent = '🔒 Заблокирован';
      }

      meta.appendChild(qCount);
      meta.appendChild(statusSpan);

      body.appendChild(iconSlot);
      body.appendChild(title);
      if (lvl.department) body.appendChild(dept);
      body.appendChild(desc);
      body.appendChild(meta);

      card.appendChild(topBar);
      card.appendChild(header);
      card.appendChild(body);

      card.addEventListener('click', function() {
        if (!isUnlocked) {
          if (Audio) Audio.playSFX('wrong');
          return;
        }
        if (Audio) Audio.playSFX('click');
        startLevel(lvl.number);
      });

      grid.appendChild(card);
    });
  }

  // =========================================================================
  // 6. GAME CONTROLLER & LEVEL RUNTIME
  // =========================================================================

  function startLevel(levelNumber) {
    var lvl = DATA.getLevelById(levelNumber);
    if (!lvl) return;

    var shuffledQuestions = shuffleArray(lvl.questions);

    currentLevelData = {
      id: lvl.id,
      number: lvl.number,
      title: lvl.title,
      subtitle: lvl.subtitle,
      department: lvl.department,
      themeColor: lvl.themeColor,
      rewardPerQuestion: lvl.rewardPerQuestion,
      isBossLevel: Boolean(lvl.isBossLevel),
      questions: shuffledQuestions
    };

    currentQuestionIndex = 0;
    State.setCurrentLevel(levelNumber);
    State.setCurrentQuestionIndex(0);
    State.resetLives();

    showScreen(SCREENS.GAME);

    // Setup Boss Banner if Level 15
    var bossBanner = document.getElementById('boss-banner');
    if (bossBanner) {
      if (currentLevelData.isBossLevel) {
        bossBanner.style.display = 'flex';
        updateBossHpDisplay();
      } else {
        bossBanner.style.display = 'none';
      }
    }

    loadQuestion(currentQuestionIndex);
  }

  function loadQuestion(index) {
    if (!currentLevelData || !currentLevelData.questions) return;
    if (index >= currentLevelData.questions.length) {
      onLevelCompleted();
      return;
    }

    currentQuestionIndex = index;
    currentQuestion = currentLevelData.questions[index];
    isAnsweringLocked = false;
    selectedAnswerTemp = null;

    if (State && State.setCurrentQuestionIndex) {
      State.setCurrentQuestionIndex(index);
    }

    closeFeedbackDrawer();
    updateHUD();
    renderQuestion(currentQuestion);
    updateBoosterToolbar();
  }

  function updateHUD() {
    if (!currentLevelData || !currentQuestion) return;

    var levelTitleEl = document.getElementById('hud-level-title');
    if (levelTitleEl) {
      var isSmallScreen = (typeof window !== 'undefined' && window.innerWidth <= 420);
      var prefix = isSmallScreen ? 'Ур. ' : 'Уровень ';
      var titleText = prefix + currentLevelData.number + ': ' + currentLevelData.title;
      levelTitleEl.innerHTML = 
        '<span class="level-indicator-dot" style="width: 10px; height: 10px; border-radius: 50%; background: ' + 
        (currentLevelData.themeColor || '#2563EB') + '; flex-shrink: 0;"></span>' +
        '<span class="hud-title-text" title="' + titleText + '">' + titleText + '</span>';
    }

    var stepCounterEl = document.getElementById('hud-step-counter');
    if (stepCounterEl) {
      stepCounterEl.textContent = 'Вопрос ' + (currentQuestionIndex + 1) + ' из ' + currentLevelData.questions.length;
    }

    var progressFillEl = document.getElementById('hud-progress-fill');
    if (progressFillEl) {
      var pct = ((currentQuestionIndex) / currentLevelData.questions.length) * 100;
      progressFillEl.style.width = Math.max(8, pct) + '%';
      progressFillEl.style.background = 'linear-gradient(90deg, ' + (currentLevelData.themeColor || '#2563EB') + ', #38BDF8)';
    }

    updateGlobalHUD();
  }

  function updateBossHpDisplay() {
    var container = document.getElementById('boss-hp-container');
    if (!container) return;

    var currentHp = State.getBossHp();
    var heartsHtml = '';
    for (var i = 1; i <= 5; i++) {
      if (i <= currentHp) {
        heartsHtml += '<span class="boss-hp-heart">💜</span>';
      } else {
        heartsHtml += '<span class="boss-hp-heart empty">🖤</span>';
      }
    }
    container.innerHTML = heartsHtml;
  }

  // =========================================================================
  // 7. QUESTION RENDERING ENGINE
  // =========================================================================

  function renderQuestion(q) {
    var promptText = document.getElementById('question-prompt-text');
    var promptHint = document.getElementById('question-prompt-hint');
    var container = document.getElementById('question-interaction-container');

    if (promptText) promptText.textContent = q.prompt;
    if (promptHint) promptHint.textContent = q.hint || 'Внимательно изучите этикетку и сделайте выбор';
    if (!container) return;

    container.innerHTML = '';

    switch (q.type) {
      case 'spoons_quiz':
        renderModeSpoonsQuiz(container, q);
        break;
      case 'yes_no':
        renderModeYesNo(container, q);
        break;
      case 'select_sugar':
        renderModeSelectSugar(container, q);
        break;
      case 'checkbox_sauces':
        renderModeCheckboxSauces(container, q);
        break;
      case 'compare_least':
      case 'compare_most':
        renderModeCompareGrid(container, q);
        break;
      case 'multi_select':
        renderModeMultiSelect(container, q);
        break;
      default:
        renderModeSelectSugar(container, q);
        break;
    }
  }

  function renderModeSpoonsQuiz(container, q) {
    var layout = document.createElement('div');
    layout.className = 'mode-spoons-layout';

    var showcase = document.createElement('div');
    showcase.className = 'product-showcase-card';

    var svgBox = document.createElement('div');
    svgBox.className = 'product-showcase-svg';
    svgBox.innerHTML = Graphics.getProductSvg(q.svgKey || 'soda_bottle', 180, 180);

    var title = document.createElement('div');
    title.className = 'product-showcase-title';
    title.textContent = q.productName;

    var vol = document.createElement('div');
    vol.className = 'product-showcase-vol';
    vol.textContent = q.packaging || '';

    showcase.appendChild(svgBox);
    showcase.appendChild(title);
    if (q.packaging) showcase.appendChild(vol);

    var grid = document.createElement('div');
    grid.className = 'spoons-quiz-grid';

    var btnElements = [];
    var randomizedOptions = shuffleArray(q.options || []);
    randomizedOptions.forEach(function(opt) {
      var btn = document.createElement('div');
      btn.className = 'spoon-choice-btn';
      btn.setAttribute('data-id', opt.id);

      var spoonIcon = document.createElement('div');
      spoonIcon.style.fontSize = '26px';
      spoonIcon.textContent = '🥄';

      var num = document.createElement('div');
      num.className = 'spoon-count-number';
      num.textContent = opt.spoons !== undefined ? opt.spoons : opt.text;

      var label = document.createElement('div');
      label.className = 'spoon-label-text';
      label.textContent = opt.text;

      btn.appendChild(spoonIcon);
      btn.appendChild(num);
      btn.appendChild(label);

      btn.addEventListener('click', function() {
        if (isAnsweringLocked) return;
        btn.classList.add('selected');
        handleAnswerSubmission(opt.id, btnElements);
      });

      btnElements.push(btn);
      grid.appendChild(btn);
    });

    layout.appendChild(showcase);
    layout.appendChild(grid);
    container.appendChild(layout);
  }

  function renderModeYesNo(container, q) {
    var layout = document.createElement('div');
    layout.className = 'mode-composition-layout';

    var showcase = document.createElement('div');
    showcase.className = 'product-showcase-card';
    showcase.style.padding = '14px';

    var svgBox = document.createElement('div');
    svgBox.className = 'product-showcase-svg';
    svgBox.style.width = '140px';
    svgBox.style.height = '140px';
    svgBox.innerHTML = Graphics.getProductSvg(q.svgKey, 140, 140);

    var title = document.createElement('div');
    title.className = 'product-showcase-title';
    title.style.fontSize = '15px';
    title.textContent = q.productName;

    showcase.appendChild(svgBox);
    showcase.appendChild(title);

    var rightCol = document.createElement('div');
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.gap = '14px';

    var labelBox = document.createElement('div');
    labelBox.className = 'nutrition-label-box';

    var labelHeader = document.createElement('div');
    labelHeader.className = 'nutrition-label-header';
    labelHeader.textContent = 'СОСТАВ ПРОДУКТА (ИНГРЕДИЕНТЫ)';

    var labelText = document.createElement('div');
    labelText.className = 'nutrition-ingredients-text';
    labelText.textContent = q.compositionText || '';

    labelBox.appendChild(labelHeader);
    labelBox.appendChild(labelText);

    var actionsRow = document.createElement('div');
    actionsRow.className = 'yes-no-actions-row';

    var btnYes = document.createElement('button');
    btnYes.className = 'btn btn-danger btn-yes-sugar';
    btnYes.setAttribute('data-id', 'yes');
    btnYes.innerHTML = '<span>⚠️ ЕСТЬ скрытый сахар</span>';

    var btnNo = document.createElement('button');
    btnNo.className = 'btn btn-success btn-no-sugar';
    btnNo.setAttribute('data-id', 'no');
    btnNo.innerHTML = '<span>🌿 НЕТ скрытого сахара</span>';

    btnYes.addEventListener('click', function() {
      if (isAnsweringLocked) return;
      btnYes.classList.add('selected');
      handleAnswerSubmission('yes', [btnYes, btnNo]);
    });

    btnNo.addEventListener('click', function() {
      if (isAnsweringLocked) return;
      btnNo.classList.add('selected');
      handleAnswerSubmission('no', [btnYes, btnNo]);
    });

    var randomizedActions = shuffleArray([btnYes, btnNo]);
    randomizedActions.forEach(function(btn) {
      actionsRow.appendChild(btn);
    });

    rightCol.appendChild(labelBox);
    rightCol.appendChild(actionsRow);

    layout.appendChild(showcase);
    layout.appendChild(rightCol);
    container.appendChild(layout);
  }

  function renderModeSelectSugar(container, q) {
    var layout = document.createElement('div');
    layout.className = 'mode-select-sugar-layout';

    var topRow = document.createElement('div');
    topRow.style.display = 'flex';
    topRow.style.alignItems = 'center';
    topRow.style.gap = '16px';
    topRow.style.backgroundColor = 'var(--bg-surface)';
    topRow.style.padding = '10px 20px';
    topRow.style.borderRadius = '14px';
    topRow.style.border = '1px solid var(--border-subtle)';

    var svgPreview = document.createElement('div');
    svgPreview.style.width = '70px';
    svgPreview.style.height = '70px';
    svgPreview.innerHTML = Graphics.getProductSvg(q.svgKey, 70, 70);

    var nameBlock = document.createElement('div');
    nameBlock.innerHTML = 
      '<div style="font-size:16px;font-weight:800;color:var(--text-primary);">' + q.productName + '</div>' +
      '<div style="font-size:12px;color:var(--text-muted);font-family:var(--font-code);">' + (q.packaging || '') + '</div>';

    topRow.appendChild(svgPreview);
    topRow.appendChild(nameBlock);
    layout.appendChild(topRow);

    if (q.compositionText) {
      var labelCompact = document.createElement('div');
      labelCompact.style.fontSize = '13px';
      labelCompact.style.fontFamily = 'var(--font-code)';
      labelCompact.style.color = 'var(--text-secondary)';
      labelCompact.style.background = '#0F172A';
      labelCompact.style.padding = '8px 16px';
      labelCompact.style.borderRadius = '8px';
      labelCompact.style.border = '1px solid var(--border-subtle)';
      labelCompact.style.maxWidth = '840px';
      labelCompact.innerHTML = '<span style="color:#38BDF8;font-weight:bold;">Состав: </span>' + q.compositionText;
      layout.appendChild(labelCompact);
    }

    var chipsCloud = document.createElement('div');
    chipsCloud.className = 'chips-cloud-container';

    var selectedChipId = null;
    var chipElements = [];

    var randomizedOptions = shuffleArray(q.options || []);
    randomizedOptions.forEach(function(opt) {
      var chip = document.createElement('button');
      chip.className = 'ingredient-chip';
      chip.setAttribute('data-id', opt.id);
      chip.textContent = opt.text;

      chip.addEventListener('click', function() {
        if (isAnsweringLocked) return;
        if (Audio) Audio.playSFX('click');

        chipElements.forEach(function(c) { c.classList.remove('selected'); });
        chip.classList.add('selected');
        selectedChipId = opt.id;
        verifyBtn.removeAttribute('disabled');
        verifyBtn.style.opacity = '1';
      });

      chipElements.push(chip);
      chipsCloud.appendChild(chip);
    });

    layout.appendChild(chipsCloud);

    var verifyBtn = document.createElement('button');
    verifyBtn.className = 'btn btn-primary btn-lg';
    verifyBtn.style.marginTop = '8px';
    verifyBtn.style.opacity = '0.5';
    verifyBtn.setAttribute('disabled', 'true');
    verifyBtn.innerHTML = '<span>Проверить термин</span><span>🔍</span>';

    verifyBtn.addEventListener('click', function() {
      if (isAnsweringLocked || !selectedChipId) return;
      handleAnswerSubmission(selectedChipId, chipElements);
    });

    layout.appendChild(verifyBtn);
    container.appendChild(layout);
  }

  function renderModeCheckboxSauces(container, q) {
    var layout = document.createElement('div');
    layout.style.display = 'flex';
    layout.style.flexDirection = 'column';
    layout.style.alignItems = 'center';
    layout.style.gap = '14px';
    layout.style.width = '100%';
    layout.style.maxWidth = '780px';

    var grid = document.createElement('div');
    grid.className = 'mode-checkbox-grid';

    var selectedSauceId = null;
    var cardElements = [];

    var randomizedOptions = shuffleArray(q.options || []);
    randomizedOptions.forEach(function(opt) {
      var item = document.createElement('div');
      item.className = 'checkbox-card-item';
      item.setAttribute('data-id', opt.id);

      var indicator = document.createElement('div');
      indicator.className = 'custom-checkbox-indicator';

      var sauceSvg = document.createElement('div');
      sauceSvg.style.width = '48px';
      sauceSvg.style.height = '48px';
      sauceSvg.innerHTML = Graphics.getProductSvg(opt.svgKey || opt.id || 'ketchup', 48, 48);

      var label = document.createElement('div');
      label.className = 'checkbox-card-label';
      label.textContent = opt.text;

      item.appendChild(indicator);
      item.appendChild(sauceSvg);
      item.appendChild(label);

      item.addEventListener('click', function() {
        if (isAnsweringLocked) return;
        if (Audio) Audio.playSFX('click');

        cardElements.forEach(function(c) { c.classList.remove('checked'); });
        item.classList.add('checked');
        selectedSauceId = opt.id;
        verifyBtn.removeAttribute('disabled');
        verifyBtn.style.opacity = '1';
      });

      cardElements.push(item);
      grid.appendChild(item);
    });

    var verifyBtn = document.createElement('button');
    verifyBtn.className = 'btn btn-primary btn-lg';
    verifyBtn.style.opacity = '0.5';
    verifyBtn.setAttribute('disabled', 'true');
    verifyBtn.innerHTML = '<span>Проверить выбор</span><span>🥫</span>';

    verifyBtn.addEventListener('click', function() {
      if (isAnsweringLocked || !selectedSauceId) return;
      handleAnswerSubmission(selectedSauceId, cardElements);
    });

    layout.appendChild(grid);
    layout.appendChild(verifyBtn);
    container.appendChild(layout);
  }

  function renderModeCompareGrid(container, q) {
    var layout = document.createElement('div');
    layout.style.display = 'flex';
    layout.style.flexDirection = 'column';
    layout.style.alignItems = 'center';
    layout.style.gap = '12px';
    layout.style.width = '100%';

    var grid = document.createElement('div');
    grid.className = 'compare-products-grid';

    var selectedProdId = null;
    var cardElements = [];

    var randomizedOptions = shuffleArray(q.options || []);
    randomizedOptions.forEach(function(opt) {
      var card = document.createElement('div');
      card.className = 'compare-product-card';
      card.setAttribute('data-id', opt.id);

      var svgBox = document.createElement('div');
      svgBox.style.width = '60px';
      svgBox.style.height = '60px';
      svgBox.innerHTML = Graphics.getProductSvg(opt.svgKey || opt.id, 60, 60);

      var label = document.createElement('div');
      label.className = 'compare-product-name';
      label.textContent = opt.text;

      card.appendChild(svgBox);
      card.appendChild(label);

      card.addEventListener('click', function() {
        if (isAnsweringLocked) return;
        if (Audio) Audio.playSFX('click');

        cardElements.forEach(function(c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        selectedProdId = opt.id;
        verifyBtn.removeAttribute('disabled');
        verifyBtn.style.opacity = '1';
      });

      cardElements.push(card);
      grid.appendChild(card);
    });

    var verifyBtn = document.createElement('button');
    verifyBtn.className = 'btn btn-primary btn-lg';
    verifyBtn.style.marginTop = '8px';
    verifyBtn.style.opacity = '0.5';
    verifyBtn.setAttribute('disabled', 'true');
    verifyBtn.innerHTML = '<span>Подтвердить выбор</span><span>🎯</span>';

    verifyBtn.addEventListener('click', function() {
      if (isAnsweringLocked || !selectedProdId) return;
      handleAnswerSubmission(selectedProdId, cardElements);
    });

    layout.appendChild(grid);
    layout.appendChild(verifyBtn);
    container.appendChild(layout);
  }

  function renderModeMultiSelect(container, q) {
    var layout = document.createElement('div');
    layout.className = 'mode-select-sugar-layout';

    var topPreview = document.createElement('div');
    topPreview.style.display = 'flex';
    topPreview.style.alignItems = 'center';
    topPreview.style.gap = '14px';
    topPreview.style.backgroundColor = 'var(--bg-surface)';
    topPreview.style.padding = '8px 18px';
    topPreview.style.borderRadius = '12px';
    topPreview.style.border = '1px solid var(--border-subtle)';

    var svgBox = document.createElement('div');
    svgBox.style.width = '64px';
    svgBox.style.height = '64px';
    svgBox.innerHTML = Graphics.getProductSvg(q.svgKey || 'caramel_pudding', 64, 64);

    var info = document.createElement('div');
    info.innerHTML = 
      '<div style="font-size:16px;font-weight:900;color:var(--text-primary);">' + q.productName + '</div>' +
      '<div style="font-size:12px;color:#F59E0B;font-weight:bold;">Внимание: выберите ДВА скрытых сахара!</div>';

    topPreview.appendChild(svgBox);
    topPreview.appendChild(info);
    layout.appendChild(topPreview);

    if (q.compositionText) {
      var compBox = document.createElement('div');
      compBox.style.fontSize = '12px';
      compBox.style.fontFamily = 'var(--font-code)';
      compBox.style.color = 'var(--text-secondary)';
      compBox.style.background = '#0F172A';
      compBox.style.padding = '6px 14px';
      compBox.style.borderRadius = '8px';
      compBox.style.border = '1px solid var(--border-subtle)';
      compBox.innerHTML = '<span style="color:#38BDF8;font-weight:bold;">Состав: </span>' + q.compositionText;
      layout.appendChild(compBox);
    }

    var chipsCloud = document.createElement('div');
    chipsCloud.className = 'chips-cloud-container';

    var selectedChips = [];
    var chipElements = [];

    var randomizedOptions = shuffleArray(q.options || []);
    randomizedOptions.forEach(function(opt) {
      var chip = document.createElement('button');
      chip.className = 'ingredient-chip';
      chip.setAttribute('data-id', opt.id);
      chip.textContent = opt.text;

      chip.addEventListener('click', function() {
        if (isAnsweringLocked) return;
        if (Audio) Audio.playSFX('click');

        var idx = selectedChips.indexOf(opt.id);
        if (idx !== -1) {
          selectedChips.splice(idx, 1);
          chip.classList.remove('selected');
        } else {
          selectedChips.push(opt.id);
          chip.classList.add('selected');
        }

        if (selectedChips.length > 0) {
          verifyBtn.removeAttribute('disabled');
          verifyBtn.style.opacity = '1';
        } else {
          verifyBtn.setAttribute('disabled', 'true');
          verifyBtn.style.opacity = '0.5';
        }
      });

      chipElements.push(chip);
      chipsCloud.appendChild(chip);
    });

    layout.appendChild(chipsCloud);

    var verifyBtn = document.createElement('button');
    verifyBtn.className = 'btn btn-primary btn-lg';
    verifyBtn.style.marginTop = '10px';
    verifyBtn.style.opacity = '0.5';
    verifyBtn.setAttribute('disabled', 'true');
    verifyBtn.innerHTML = '<span>Проверить выбор (2 сахара)</span><span>🔍</span>';

    verifyBtn.addEventListener('click', function() {
      if (isAnsweringLocked || selectedChips.length === 0) return;
      handleAnswerSubmission(selectedChips, chipElements);
    });

    layout.appendChild(verifyBtn);
    container.appendChild(layout);
  }

  // =========================================================================
  // 8. ANSWER EVALUATION & BOSS MECHANICS
  // =========================================================================

  function handleAnswerSubmission(userAnswer, optionElements) {
    if (isAnsweringLocked || !currentQuestion) return;
    isAnsweringLocked = true;

    var isCorrect = DATA.checkQuestionAnswer(currentQuestion, userAnswer);

    if (optionElements && optionElements.length > 0) {
      optionElements.forEach(function(el) {
        var elId = el.getAttribute('data-id');
        var isThisCorrect = false;

        if (Array.isArray(currentQuestion.correctAnswer)) {
          isThisCorrect = currentQuestion.correctAnswer.indexOf(elId) !== -1;
        } else {
          isThisCorrect = (elId === currentQuestion.correctAnswer);
        }

        if (isThisCorrect) {
          el.classList.add('correct');
        } else if (el.classList.contains('selected') || el.classList.contains('checked')) {
          el.classList.add('wrong');
        }
      });
    }

    if (isCorrect) {
      if (Audio) Audio.playSFX('correct');

      var reward = currentLevelData.rewardPerQuestion || 5;
      var wasNewlyAdded = State.addCoins(reward, currentQuestion.id);

      if (wasNewlyAdded) {
        showFloatingCoinBadge(reward);
        if (Audio) setTimeout(function() { Audio.playSFX('coin'); }, 200);
      }

      // Boss damage on Level 15
      if (currentLevelData.isBossLevel) {
        State.damageBoss(1);
        updateBossHpDisplay();
        if (Audio) setTimeout(function() { Audio.playSFX('boss_hit'); }, 150);
      }

      State.recordAnswer ? State.recordAnswer(currentQuestion.id, true) : null;
      openFeedbackDrawer(true, currentQuestion);

    } else {
      // Mistake path: check if sugar shield protects
      var hadShield = State.isShieldActive();
      var remainingLives = State.decrementLife();

      if (hadShield) {
        if (Audio) Audio.playSFX('shield_absorb');
      } else {
        if (Audio) Audio.playSFX('heart_loss');
        triggerHeartLossAnimation();
      }

      updateGlobalHUD();
      openFeedbackDrawer(false, currentQuestion, hadShield);
    }
  }

  function triggerHeartLossAnimation() {
    var heartsContainer = document.getElementById('hud-hearts-container');
    if (heartsContainer) {
      heartsContainer.classList.add('heart-loss-shake');
      setTimeout(function() {
        heartsContainer.classList.remove('heart-loss-shake');
      }, 500);
    }
  }

  // =========================================================================
  // 9. EDUCATIONAL FEEDBACK DRAWER
  // =========================================================================

  function openFeedbackDrawer(isCorrect, question, wasShielded) {
    var drawer = document.getElementById('feedback-drawer');
    var iconBox = document.getElementById('drawer-icon-box');
    var titleEl = document.getElementById('drawer-status-title');
    var explanationEl = document.getElementById('drawer-explanation');
    var nextBtn = document.getElementById('drawer-btn-next');

    if (!drawer) return;

    drawer.classList.remove('success', 'error');

    if (isCorrect) {
      drawer.classList.add('open', 'success');
      if (iconBox) iconBox.innerHTML = '<span style="font-size: 26px; font-weight: 900;">✓</span>';
      if (titleEl) titleEl.textContent = 'Верно! Отличная детективная работа!';
    } else {
      drawer.classList.add('open', 'error');
      if (iconBox) iconBox.innerHTML = '<span style="font-size: 26px; font-weight: 900;">✕</span>';
      if (titleEl) {
        titleEl.textContent = wasShielded
          ? 'Ошибка! Но Сахарный Щит 🛡️ спас твою жизнь!'
          : 'Ошибка! Скрытый сахар ускользнул!';
      }
    }

    if (explanationEl) {
      explanationEl.textContent = question.explanation || 'Внимательно проверяйте список ингредиентов на этикетке.';
    }

    if (nextBtn) {
      var isLast = (currentQuestionIndex + 1 >= currentLevelData.questions.length);
      var btnLabel = isLast ? 'Завершить уровень ★' : 'Следующий вопрос →';
      nextBtn.innerHTML = '<span>' + btnLabel + '</span>';
    }
  }

  function closeFeedbackDrawer() {
    var drawer = document.getElementById('feedback-drawer');
    if (drawer) {
      drawer.classList.remove('open', 'success', 'error');
    }
  }

  function advanceToNextStep() {
    closeFeedbackDrawer();

    if (State.isGameOver()) {
      showGameOverModal();
      return;
    }

    if (currentQuestionIndex + 1 < currentLevelData.questions.length) {
      loadQuestion(currentQuestionIndex + 1);
    } else {
      if (currentLevelData.isBossLevel && State.getBossHp() > 0) {
        showGameOverModal(
          'Сахарный Титан устоял! Нанесите 5 точных ударов или используйте Заморозку, чтобы сокрушить босса!',
          'БОСС НЕ ПОБЕЖДЕН!',
          '😈'
        );
        return;
      }
      onLevelCompleted();
    }
  }

  // =========================================================================
  // 10. LEVEL COMPLETION & VICTORY
  // =========================================================================

  function onLevelCompleted() {
    var completedLvlNum = currentLevelData.number;
    State.completeLevel(completedLvlNum);

    if (currentLevelData.isBossLevel && Audio) {
      Audio.playSFX('boss_defeat');
    } else if (Audio) {
      Audio.playSFX('level_clear');
    }

    if (Confetti) Confetti.burst(undefined, undefined, 80);

    if (completedLvlNum >= 15) {
      setTimeout(function() {
        showScreen(SCREENS.VICTORY);
      }, 700);
    } else {
      setTimeout(function() {
        showScreen(SCREENS.CATALOG);
      }, 900);
    }
  }

  function setupVictoryScreen() {
    if (Confetti) Confetti.start();
    if (Audio) Audio.playSFX('victory');

    var coinsEl = document.getElementById('victory-stat-coins');
    if (coinsEl) coinsEl.textContent = State.getCoins() + ' 🪙';

    var levelsEl = document.getElementById('victory-stat-levels');
    if (levelsEl) levelsEl.textContent = State.getCompletedLevels().length + ' / 15';

    var sugarsEl = document.getElementById('victory-stat-sugars');
    if (sugarsEl) sugarsEl.textContent = '81 продукт';
  }

  function showGameOverModal(customMessage, customTitle, customIcon) {
    var iconEl = document.querySelector('#modal-game-over .game-over-icon');
    var titleEl = document.querySelector('#modal-game-over h2');
    var pEl = document.querySelector('#modal-game-over p');

    if (customIcon && iconEl) iconEl.textContent = customIcon;
    else if (iconEl) iconEl.textContent = '💔';

    if (customTitle && titleEl) titleEl.textContent = customTitle;
    else if (titleEl) titleEl.textContent = 'ЖИЗНИ ЗАКОНЧИЛИСЬ!';

    if (customMessage && pEl) pEl.textContent = customMessage;
    else if (pEl) pEl.textContent = 'Сахарные ловушки оказались коварными! Монеты и открытые уровни сохранены. Используйте Сахарный Щит 🛡️ в следующий раз, чтобы не терять жизни!';

    openModal('modal-game-over');
    if (Audio) Audio.playSFX('wrong');
  }

  // =========================================================================
  // 11. IN-GAME BOOSTERS HANDLERS
  // =========================================================================

  function handleUse5050() {
    if (!currentQuestion || isAnsweringLocked) return;

    if (currentQuestion.type === 'yes_no') {
      alert('В вопросах формата "Да / Нет" бустер 50:50 не требуется — здесь всего два варианта!');
      return;
    }

    var count = State.getBoosterCount('booster_5050');
    if (count <= 0) {
      openShopModal('boosters');
      return;
    }

    var success = State.useBooster('booster_5050');
    if (!success) return;

    if (Audio) Audio.playSFX('zap_5050');
    updateBoosterToolbar();

    // Eliminate 2 wrong choices
    var optionEls = document.querySelectorAll('.spoon-choice-btn, .ingredient-chip, .checkbox-card-item, .compare-product-card');
    var wrongEls = [];

    optionEls.forEach(function(el) {
      var id = el.getAttribute('data-id');
      var isCorrect = false;
      if (Array.isArray(currentQuestion.correctAnswer)) {
        isCorrect = currentQuestion.correctAnswer.indexOf(id) !== -1;
      } else {
        isCorrect = (id === currentQuestion.correctAnswer);
      }
      if (!isCorrect) wrongEls.push(el);
    });

    var shuffledWrong = shuffleArray(wrongEls);
    for (var i = 0; i < Math.min(2, shuffledWrong.length); i++) {
      var wrongEl = shuffledWrong[i];
      wrongEl.style.opacity = '0.2';
      wrongEl.style.pointerEvents = 'none';
      wrongEl.style.textDecoration = 'line-through';
      wrongEl.classList.remove('selected', 'checked');

      var wrongId = wrongEl.getAttribute('data-id');
      if (selectedAnswerTemp === wrongId) {
        selectedAnswerTemp = null;
      }
    }

    var selectedRemaining = document.querySelectorAll('#question-interaction-container .selected, #question-interaction-container .checked');
    if (selectedRemaining.length === 0) {
      var allVerifyBtns = document.querySelectorAll('#question-interaction-container .btn-primary');
      allVerifyBtns.forEach(function(btn) {
        btn.setAttribute('disabled', 'true');
        btn.style.opacity = '0.5';
      });
    }
  }

  function handleUseShield() {
    var count = State.getBoosterCount('booster_shield');
    if (count <= 0) {
      openShopModal('boosters');
      return;
    }
    if (State.isShieldActive()) return;

    var success = State.useBooster('booster_shield');
    if (success) {
      if (Audio) Audio.playSFX('shield_on');
      updateGlobalHUD();
    }
  }

  function handleUseHint() {
    if (!currentQuestion) return;

    var count = State.getBoosterCount('booster_hint');
    if (count <= 0) {
      openShopModal('boosters');
      return;
    }

    var success = State.useBooster('booster_hint');
    if (!success) return;

    if (Audio) Audio.playSFX('clue_ding');
    updateBoosterToolbar();

    var hintEl = document.getElementById('question-prompt-hint');
    if (hintEl) {
      hintEl.innerHTML = '<span style="color:#FDE047;font-weight:900;">💡 ЭКСПЕРТНЫЙ АНАЛИЗ:</span> ' + (currentQuestion.hint || currentQuestion.explanation);
      hintEl.style.animation = 'pulse-gold 1s infinite alternate';
    }
  }

  function handleUseHeart() {
    var count = State.getBoosterCount('booster_heart');
    if (count <= 0) {
      openShopModal('boosters');
      return;
    }

    var success = State.useBooster('booster_heart');
    if (success) {
      if (Audio) Audio.playSFX('heal');
      updateGlobalHUD();
    }
  }

  function handleUseFreeze() {
    var count = State.getBoosterCount('booster_freeze');
    if (count <= 0) {
      openShopModal('boosters');
      return;
    }

    if (currentLevelData && currentLevelData.isBossLevel) {
      if (State.getBossHp() <= 0) return;
      var success = State.useBooster('booster_freeze');
      if (success) {
        if (Audio) Audio.playSFX('shield_absorb');
        State.damageBoss(1);
        updateBossHpDisplay();
        updateBoosterToolbar();
        var bossBanner = document.getElementById('boss-banner');
        if (bossBanner) {
          bossBanner.style.filter = 'drop-shadow(0 0 16px #38BDF8)';
          setTimeout(function() {
            bossBanner.style.filter = '';
          }, 800);
        }
      }
      return;
    }

    alert('Бустер "Заморозка времени" применяется в режиме Блиц-Марафона (для добавления +15 секунд) и в битве с Сахарным Титаном (наносит 1 крио-урон)!');
  }

  // =========================================================================
  // 12. DETECTIVE SHOP MODAL
  // =========================================================================

  var currentShopTab = 'boosters';

  function openShopModal(tab) {
    currentShopTab = tab || 'boosters';
    renderShopView();
    openModal('modal-shop');
  }

  function renderShopView() {
    var container = document.getElementById('shop-items-container');
    if (!container) return;

    container.innerHTML = '';
    updateGlobalHUD();

    var tabs = document.querySelectorAll('.shop-tab-btn');
    tabs.forEach(function(t) {
      t.classList.toggle('active', t.getAttribute('data-tab') === currentShopTab);
    });

    if (currentShopTab === 'boosters') {
      DATA.BOOSTERS.forEach(function(b) {
        var count = State.getBoosterCount(b.id);
        var card = document.createElement('div');
        card.className = 'shop-item-card';

        card.innerHTML = 
          '<div class="shop-item-header">' +
            '<div class="shop-item-icon">' + b.icon + '</div>' +
            '<div>' +
              '<div class="shop-item-title">' + b.name + '</div>' +
              '<div style="font-size:11px;color:var(--color-info);">' + b.tag + ' • В запасе: ' + count + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="shop-item-desc">' + b.description + '</div>' +
          '<div class="shop-item-footer">' +
            '<div class="shop-price-tag"><span>🪙</span><span>' + b.cost + '</span></div>' +
            '<button class="btn btn-gold btn-sm btn-buy-booster" data-id="' + b.id + '">Купить</button>' +
          '</div>';

        card.querySelector('.btn-buy-booster').addEventListener('click', function() {
          var ok = State.buyBooster(b.id);
          if (ok) {
            if (Audio) Audio.playSFX('shop_buy');
            renderShopView();
          } else {
            if (Audio) Audio.playSFX('wrong');
            alert('Недостаточно монет! Пройдите уровни или сыграйте в Блиц-Марафон.');
          }
        });

        container.appendChild(card);
      });

    } else if (currentShopTab === 'avatars') {
      var rawState = State._getRawState();
      var unlockedAvatars = rawState.customization.unlockedAvatars;
      var activeAvatarId = rawState.player.avatarId;

      DATA.AVATARS.forEach(function(av) {
        var isOwned = unlockedAvatars.indexOf(av.id) !== -1;
        var isEquipped = activeAvatarId === av.id;

        var card = document.createElement('div');
        card.className = 'shop-item-card';

        var svgPreview = Graphics.getAvatarSvg(av.id, 50);

        var actionHtml = '';
        if (isEquipped) {
          actionHtml = '<span class="shop-owned-badge">✓ Надет</span>';
        } else if (isOwned) {
          actionHtml = '<button class="btn btn-sm btn-equip-avatar" data-id="' + av.id + '">Надеть</button>';
        } else {
          actionHtml = '<button class="btn btn-gold btn-sm btn-buy-avatar" data-id="' + av.id + '">Купить</button>';
        }

        card.innerHTML = 
          '<div class="shop-item-header">' +
            '<div style="width:50px;height:50px;">' + svgPreview + '</div>' +
            '<div>' +
              '<div class="shop-item-title">' + av.name + '</div>' +
              '<div style="font-size:11px;color:var(--text-muted);">' + (av.desc || 'Классический образ') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="shop-item-footer">' +
            '<div class="shop-price-tag">' + (isOwned ? '<span style="color:var(--color-success);">Приобретено</span>' : '<span>🪙</span><span>' + av.cost + '</span>') + '</div>' +
            actionHtml +
          '</div>';

        var buyBtn = card.querySelector('.btn-buy-avatar');
        if (buyBtn) {
          buyBtn.addEventListener('click', function() {
            var ok = State.buyAvatar(av.id, av.cost);
            if (ok) {
              if (Audio) Audio.playSFX('shop_buy');
              renderShopView();
              updateHubView();
            } else {
              if (Audio) Audio.playSFX('wrong');
              alert('Недостаточно монет!');
            }
          });
        }

        var equipBtn = card.querySelector('.btn-equip-avatar');
        if (equipBtn) {
          equipBtn.addEventListener('click', function() {
            State.setAvatar(av.id);
            if (Audio) Audio.playSFX('click');
            renderShopView();
            updateHubView();
          });
        }

        container.appendChild(card);
      });

    } else if (currentShopTab === 'themes') {
      var rawState = State._getRawState();
      var unlockedThemes = rawState.customization.unlockedThemes;
      var activeTheme = rawState.customization.activeTheme;

      DATA.THEMES.forEach(function(th) {
        var isOwned = unlockedThemes.indexOf(th.id) !== -1;
        var isEquipped = activeTheme === th.id;

        var card = document.createElement('div');
        card.className = 'shop-item-card';

        var actionHtml = '';
        if (isEquipped) {
          actionHtml = '<span class="shop-owned-badge">✓ Активна</span>';
        } else if (isOwned) {
          actionHtml = '<button class="btn btn-sm btn-equip-theme" data-id="' + th.id + '">Применить</button>';
        } else {
          actionHtml = '<button class="btn btn-gold btn-sm btn-buy-theme" data-id="' + th.id + '">Купить</button>';
        }

        card.innerHTML = 
          '<div class="shop-item-header">' +
            '<div style="width:36px;height:36px;border-radius:8px;background:' + th.previewColor + ';border:2px solid ' + th.accentColor + ';"></div>' +
            '<div>' +
              '<div class="shop-item-title">' + th.name + '</div>' +
              '<div style="font-size:11px;color:var(--text-muted);">' + th.description + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="shop-item-footer">' +
            '<div class="shop-price-tag">' + (isOwned ? '<span style="color:var(--color-success);">Приобретено</span>' : '<span>🪙</span><span>' + th.cost + '</span>') + '</div>' +
            actionHtml +
          '</div>';

        var buyBtn = card.querySelector('.btn-buy-theme');
        if (buyBtn) {
          buyBtn.addEventListener('click', function() {
            var ok = State.buyTheme(th.id, th.cost);
            if (ok) {
              if (Audio) Audio.playSFX('shop_buy');
              renderShopView();
              applyActiveTheme();
            } else {
              if (Audio) Audio.playSFX('wrong');
              alert('Недостаточно монет!');
            }
          });
        }

        var equipBtn = card.querySelector('.btn-equip-theme');
        if (equipBtn) {
          equipBtn.addEventListener('click', function() {
            State.setTheme(th.id);
            if (Audio) Audio.playSFX('click');
            renderShopView();
            applyActiveTheme();
          });
        }

        container.appendChild(card);
      });

    } else if (currentShopTab === 'dossiers') {
      DATA.DOSSIERS.forEach(function(d) {
        var isOwned = State.isDossierUnlocked(d.id);

        var card = document.createElement('div');
        card.className = 'shop-item-card';

        var actionHtml = '';
        if (isOwned) {
          actionHtml = '<button class="btn btn-primary btn-sm btn-read-dossier" data-id="' + d.id + '">📖 Читать</button>';
        } else {
          actionHtml = '<button class="btn btn-gold btn-sm btn-buy-dossier" data-id="' + d.id + '">Открыть за ' + d.cost + ' 🪙</button>';
        }

        card.innerHTML = 
          '<div class="shop-item-header">' +
            '<div class="shop-item-icon">' + d.icon + '</div>' +
            '<div>' +
              '<div class="shop-item-title">' + d.title + '</div>' +
              '<div style="font-size:11px;color:var(--color-info);">' + d.category + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="shop-item-desc">' + d.summary + '</div>' +
          '<div class="shop-item-footer">' +
            '<div class="shop-price-tag">' + (isOwned ? '<span style="color:var(--color-success);">Открыто в архиве</span>' : '<span>🪙</span><span>' + d.cost + '</span>') + '</div>' +
            actionHtml +
          '</div>';

        var buyBtn = card.querySelector('.btn-buy-dossier');
        if (buyBtn) {
          buyBtn.addEventListener('click', function() {
            var ok = State.buyDossier(d.id, d.cost);
            if (ok) {
              if (Audio) Audio.playSFX('shop_buy');
              renderShopView();
            } else {
              if (Audio) Audio.playSFX('wrong');
              alert('Недостаточно монет!');
            }
          });
        }

        var readBtn = card.querySelector('.btn-read-dossier');
        if (readBtn) {
          readBtn.addEventListener('click', function() {
            openDossierReader(d);
          });
        }

        container.appendChild(card);
      });
    }
  }

  function openDossierReader(dossier) {
    var titleEl = document.getElementById('dossier-modal-title');
    var bodyEl = document.getElementById('dossier-modal-body');
    if (!titleEl || !bodyEl) return;

    titleEl.textContent = dossier.icon + ' ' + dossier.title;
    var contentHtml = '<p style="margin-bottom:14px;color:var(--color-gold);">' + dossier.summary + '</p>';
    dossier.content.forEach(function(line) {
      contentHtml += '<div style="background:#0F172A;padding:10px 14px;border-radius:8px;margin-bottom:8px;border:1px solid var(--border-subtle);line-height:1.4;">' + line + '</div>';
    });

    bodyEl.innerHTML = contentHtml;
    openModal('modal-dossier');
  }

  // =========================================================================
  // 13. INTERACTIVE SUGAR CALCULATOR
  // =========================================================================

  function initSugarCalculator() {
    var chipsContainer = document.getElementById('calc-quick-chips-container');
    var inputSugar = document.getElementById('calc-input-sugar');
    var inputPortion = document.getElementById('calc-input-portion');

    if (!chipsContainer || !inputSugar || !inputPortion) return;

    chipsContainer.innerHTML = '';
    DATA.CALCULATOR_FOODS.forEach(function(food) {
      var chip = document.createElement('button');
      chip.className = 'calc-chip';
      chip.textContent = food.name;

      chip.addEventListener('click', function() {
        chipsContainer.querySelectorAll('.calc-chip').forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');

        var sugarPer100 = (food.sugarGrams / food.portionWeight) * 100;
        inputSugar.value = sugarPer100.toFixed(1);
        inputPortion.value = food.portionWeight;
        calculateSugar();
      });

      chipsContainer.appendChild(chip);
    });

    inputSugar.addEventListener('input', calculateSugar);
    inputPortion.addEventListener('input', calculateSugar);

    calculateSugar();
  }

  function calculateSugar() {
    var inputSugar = document.getElementById('calc-input-sugar');
    var inputPortion = document.getElementById('calc-input-portion');
    var resSpoons = document.getElementById('calc-res-spoons');
    var resGrams = document.getElementById('calc-res-grams');
    var resPct = document.getElementById('calc-res-pct');
    var resBurn = document.getElementById('calc-res-burn');
    var cubesVisual = document.getElementById('calc-cubes-visual');

    if (!inputSugar || !inputPortion) return;

    var sugarPer100 = Math.max(0, parseFloat(inputSugar.value) || 0);
    var portion = Math.max(0, parseFloat(inputPortion.value) || 0);

    var totalGrams = (sugarPer100 * portion) / 100.0;
    var spoons = totalGrams / 4.0; // 1 teaspoon approx 4g of sugar
    var pctOfDailyLimit = (totalGrams / 25.0) * 100.0; // WHO daily recommendation: 25g
    var runningMinutes = (totalGrams * 4.0) / 7.0; // approx 7 kcal burned per minute jogging

    if (resSpoons) resSpoons.textContent = spoons.toFixed(1);
    if (resGrams) resGrams.textContent = totalGrams.toFixed(0) + ' г';
    if (resPct) {
      resPct.textContent = pctOfDailyLimit.toFixed(0) + '%';
      resPct.style.color = pctOfDailyLimit > 100 ? '#EF4444' : '#10B981';
    }
    if (resBurn) resBurn.textContent = Math.round(runningMinutes) + ' мин';

    if (cubesVisual && Graphics) {
      cubesVisual.innerHTML = Graphics.getSugarCubesSvg(spoons);
    }
  }

  // =========================================================================
  // 14. BLITZ MARATHON MODE CONTROLLER
  // =========================================================================

  function openMarathonModal() {
    var introView = document.getElementById('marathon-intro-view');
    var activeView = document.getElementById('marathon-active-view');
    var finishView = document.getElementById('marathon-finish-view');
    var highScoreEl = document.getElementById('marathon-high-score');

    if (introView) introView.style.display = 'block';
    if (activeView) activeView.style.display = 'none';
    if (finishView) finishView.style.display = 'none';

    if (highScoreEl) highScoreEl.textContent = State.getMarathonHighScore();

    openModal('modal-marathon');
  }

  function startMarathon() {
    var introView = document.getElementById('marathon-intro-view');
    var activeView = document.getElementById('marathon-active-view');
    var finishView = document.getElementById('marathon-finish-view');

    if (introView) introView.style.display = 'none';
    if (activeView) activeView.style.display = 'block';
    if (finishView) finishView.style.display = 'none';

    marathonSecondsLeft = 60;
    marathonScore = 0;
    marathonStreak = 0;
    marathonIsLocked = false;

    updateMarathonHUD();
    loadMarathonQuestion();

    if (marathonTimer) clearInterval(marathonTimer);
    marathonTimer = setInterval(function() {
      marathonSecondsLeft--;
      updateMarathonHUD();
      if (marathonSecondsLeft <= 0) {
        finishMarathon();
      }
    }, 1000);
  }

  function updateMarathonHUD() {
    var timerEl = document.getElementById('marathon-timer-val');
    var scoreEl = document.getElementById('marathon-score-val');
    var comboBadge = document.getElementById('marathon-combo-badge');
    var freezeBadge = document.getElementById('marathon-freeze-badge');

    if (timerEl) timerEl.textContent = marathonSecondsLeft;
    if (scoreEl) scoreEl.textContent = marathonScore;

    if (comboBadge) {
      var mult = 1.0 + (marathonStreak * 0.2);
      comboBadge.textContent = '(x' + mult.toFixed(1) + ')';
    }

    if (freezeBadge) {
      freezeBadge.textContent = State.getBoosterCount('booster_freeze');
    }
  }

  function handleMarathonFreeze() {
    var count = State.getBoosterCount('booster_freeze');
    if (count <= 0) {
      openShopModal('boosters');
      return;
    }

    var success = State.useBooster('booster_freeze');
    if (success) {
      marathonSecondsLeft += 15;
      if (Audio) Audio.playSFX('shield_on');
      updateMarathonHUD();
      updateBoosterToolbar();
      var timerEl = document.getElementById('marathon-timer-val');
      if (timerEl) {
        timerEl.style.color = '#38BDF8';
        setTimeout(function() {
          timerEl.style.color = '';
        }, 600);
      }
    }
  }

  function loadMarathonQuestion() {
    var promptEl = document.getElementById('marathon-question-prompt');
    var optionsContainer = document.getElementById('marathon-options-container');
    if (!promptEl || !optionsContainer) return;

    // Filter candidate questions to single-choice only (prevent impossible multi_select in blitz mode)
    var validQuestions = [];
    DATA.LEVELS.forEach(function(lvl) {
      lvl.questions.forEach(function(item) {
        if (item.type !== 'multi_select' && !Array.isArray(item.correctAnswer)) {
          validQuestions.push(item);
        }
      });
    });

    if (validQuestions.length === 0) return;
    var q = validQuestions[Math.floor(Math.random() * validQuestions.length)];

    marathonCurrentQuestion = q;
    marathonIsLocked = false;

    promptEl.textContent = q.prompt;
    optionsContainer.innerHTML = '';

    var options = q.options || [];
    var randomized = shuffleArray(options);

    randomized.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.style.width = '100%';
      btn.style.textAlign = 'center';
      btn.style.padding = '8px 12px';
      btn.textContent = opt.text;

      btn.addEventListener('click', function() {
        if (marathonIsLocked) return;
        marathonIsLocked = true;

        var isCorrect = DATA.checkQuestionAnswer(marathonCurrentQuestion, opt.id);
        if (isCorrect) {
          btn.style.background = '#10B981';
          if (Audio) Audio.playSFX('correct');
          marathonStreak++;
          var mult = 1.0 + (marathonStreak * 0.2);
          marathonScore += Math.round(10 * mult);
        } else {
          btn.style.background = '#EF4444';
          if (Audio) Audio.playSFX('wrong');
          marathonStreak = 0;
        }

        updateMarathonHUD();
        setTimeout(function() {
          if (marathonSecondsLeft > 0) {
            loadMarathonQuestion();
          }
        }, 400);
      });

      optionsContainer.appendChild(btn);
    });
  }

  function finishMarathon() {
    if (marathonTimer) {
      clearInterval(marathonTimer);
      marathonTimer = null;
    }

    var activeView = document.getElementById('marathon-active-view');
    var finishView = document.getElementById('marathon-finish-view');
    var finalScoreEl = document.getElementById('marathon-final-score');
    var coinsEarnedEl = document.getElementById('marathon-coins-earned');

    if (activeView) activeView.style.display = 'none';
    if (finishView) finishView.style.display = 'block';

    if (finalScoreEl) finalScoreEl.textContent = marathonScore;

    var coinsAwarded = Math.round(marathonScore * 0.4);
    if (coinsEarnedEl) coinsEarnedEl.textContent = '+' + coinsAwarded;

    if (coinsAwarded > 0) {
      State.addCoins(coinsAwarded);
      if (Audio) Audio.playSFX('victory');
    }

    State.updateMarathonScore(marathonScore);
    updateGlobalHUD();
  }

  // =========================================================================
  // 15. DIPLOMA RENDERING
  // =========================================================================

  function renderDiploma() {
    var container = document.getElementById('diploma-svg-container');
    if (!container) return;

    var player = State.getPlayer();
    var completedCount = State.getCompletedLevels().length;

    var svg = '';
    if (completedCount >= 15) {
      svg = Graphics.getGrandmasterDiplomaSvg({
        playerName: player.name || 'Юный Детектив',
        totalCoins: State.getCoins(),
        sugarFound: 81,
        date: new Date().toLocaleDateString('ru-RU')
      });
    } else {
      svg = Graphics.getCertificateSvg({
        playerName: player.name || 'Юный Детектив',
        rankTitle: 'Сахарный детектив',
        totalCoins: State.getCoins(),
        sugarFound: 37,
        date: new Date().toLocaleDateString('ru-RU')
      });
    }

    container.innerHTML = svg;
    openModal('modal-diploma');
  }

  // =========================================================================
  // 16. ACHIEVEMENTS CONTROLLER
  // =========================================================================

  function renderAchievementsModal() {
    var container = document.getElementById('achievements-container');
    if (!container) return;

    container.innerHTML = '';
    var achievements = DATA.ACHIEVEMENTS;

    achievements.forEach(function(ach) {
      var isUnlocked = State.hasAchievement(ach.id);

      var item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '14px';
      item.style.backgroundColor = isUnlocked ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)';
      item.style.border = isUnlocked ? '1px solid #F59E0B' : '1px solid #334155';
      item.style.borderRadius = '12px';
      item.style.padding = '12px 16px';
      item.style.opacity = isUnlocked ? '1' : '0.6';

      var icon = document.createElement('div');
      icon.style.fontSize = '32px';
      icon.textContent = isUnlocked ? ach.icon : '🔒';

      var info = document.createElement('div');
      info.style.flexGrow = '1';

      var title = document.createElement('div');
      title.style.fontSize = '15px';
      title.style.fontWeight = 'bold';
      title.style.color = isUnlocked ? '#FDE047' : '#94A3B8';
      title.textContent = ach.title;

      var desc = document.createElement('div');
      desc.style.fontSize = '12px';
      desc.style.color = 'var(--text-secondary)';
      desc.style.marginTop = '2px';
      desc.textContent = ach.description;

      info.appendChild(title);
      info.appendChild(desc);

      var badge = document.createElement('div');
      badge.className = 'badge ' + (isUnlocked ? 'badge-amber' : '');
      badge.style.fontSize = '11px';
      badge.textContent = isUnlocked ? '★ Получено' : 'Закрыто';

      item.appendChild(icon);
      item.appendChild(info);
      item.appendChild(badge);

      container.appendChild(item);
    });

    openModal('modal-achievements');
  }

  // =========================================================================
  // 17. SETTINGS & PROFILE CONTROLLER
  // =========================================================================

  function setupSettingsModal() {
    var rawState = State._getRawState();
    var player = rawState.player;
    var settings = rawState.settings;

    var nameInput = document.getElementById('setting-player-name');
    if (nameInput) nameInput.value = player.name;

    var sfxSlider = document.getElementById('setting-slider-sound');
    if (sfxSlider) sfxSlider.value = settings.sfxVolume;

    var bgmSlider = document.getElementById('setting-slider-music');
    if (bgmSlider) bgmSlider.value = settings.musicVolume;

    // Render themes selector
    var themeGrid = document.getElementById('setting-theme-grid');
    if (themeGrid) {
      themeGrid.innerHTML = '';
      DATA.THEMES.forEach(function(th) {
        var isUnlocked = rawState.customization.unlockedThemes.indexOf(th.id) !== -1;
        var isCurrent = rawState.customization.activeTheme === th.id;

        var btn = document.createElement('button');
        btn.className = 'btn btn-sm';
        btn.style.borderColor = isCurrent ? 'var(--border-focus)' : 'var(--border-subtle)';
        btn.style.opacity = isUnlocked ? '1' : '0.4';
        btn.textContent = (isCurrent ? '● ' : '') + th.name;

        btn.addEventListener('click', function() {
          if (!isUnlocked) {
            alert('Эта тема закрыта! Приобретите ее в Детективной Лавке.');
            return;
          }
          State.setTheme(th.id);
          applyActiveTheme();
          setupSettingsModal();
        });

        themeGrid.appendChild(btn);
      });
    }

    // Render avatars selector
    var avatarGrid = document.getElementById('setting-avatar-grid');
    if (avatarGrid) {
      avatarGrid.innerHTML = '';
      DATA.AVATARS.forEach(function(av) {
        var isUnlocked = rawState.customization.unlockedAvatars.indexOf(av.id) !== -1;
        var isCurrent = player.avatarId === av.id;

        var box = document.createElement('div');
        box.className = 'avatar-option' + (isCurrent ? ' selected' : '');
        box.style.opacity = isUnlocked ? '1' : '0.35';
        box.innerHTML = Graphics.getAvatarSvg(av.id, 50);

        box.addEventListener('click', function() {
          if (!isUnlocked) {
            alert('Этот аватар закрыт! Приобретите его в Детективной Лавке.');
            return;
          }
          State.setAvatar(av.id);
          updateHubView();
          setupSettingsModal();
        });

        avatarGrid.appendChild(box);
      });
    }

    openModal('modal-settings');
  }

  // =========================================================================
  // 18. INITIALIZATION & EVENT BINDINGS
  // =========================================================================

  function initApp() {
    // 1. Hero Buttons
    var heroBtnStart = document.getElementById('hero-btn-start');
    if (heroBtnStart) {
      heroBtnStart.addEventListener('click', function() {
        if (Audio) Audio.playSFX('click');
        showScreen(SCREENS.HUB);
      });
    }

    var heroBtnCalc = document.getElementById('hero-btn-calc');
    if (heroBtnCalc) {
      heroBtnCalc.addEventListener('click', function() {
        if (Audio) Audio.playSFX('click');
        openModal('modal-calc');
      });
    }

    var heroBtnSound = document.getElementById('hero-btn-sound');
    if (heroBtnSound) {
      heroBtnSound.addEventListener('click', function() {
        toggleMute();
      });
    }

    var heroBtnSettings = document.getElementById('hero-btn-settings');
    if (heroBtnSettings) {
      heroBtnSettings.addEventListener('click', function() {
        setupSettingsModal();
      });
    }

    // 2. Hub Buttons & Tiles
    var hubBtnPlay = document.getElementById('hub-btn-play');
    if (hubBtnPlay) {
      hubBtnPlay.addEventListener('click', function() {
        if (Audio) Audio.playSFX('click');
        showScreen(SCREENS.CATALOG);
      });
    }

    var hubTileCatalog = document.getElementById('hub-tile-catalog');
    if (hubTileCatalog) {
      hubTileCatalog.addEventListener('click', function() {
        if (Audio) Audio.playSFX('click');
        showScreen(SCREENS.CATALOG);
      });
    }

    var hubTileShop = document.getElementById('hub-tile-shop');
    var hubBtnShop = document.getElementById('hub-btn-shop');
    var hubCoinsPill = document.getElementById('hub-coins-pill');
    [hubTileShop, hubBtnShop, hubCoinsPill].forEach(function(el) {
      if (el) {
        el.addEventListener('click', function() {
          openShopModal('boosters');
        });
      }
    });

    var hubTileCalc = document.getElementById('hub-tile-calc');
    if (hubTileCalc) {
      hubTileCalc.addEventListener('click', function() {
        openModal('modal-calc');
      });
    }

    var hubTileMarathon = document.getElementById('hub-tile-marathon');
    if (hubTileMarathon) {
      hubTileMarathon.addEventListener('click', function() {
        openMarathonModal();
      });
    }

    var hubTileAchievements = document.getElementById('hub-tile-achievements');
    if (hubTileAchievements) {
      hubTileAchievements.addEventListener('click', function() {
        renderAchievementsModal();
      });
    }

    var hubTileSettings = document.getElementById('hub-tile-settings');
    var hubBtnSettings = document.getElementById('hub-btn-settings');
    var hubBtnAvatar = document.getElementById('hub-btn-change-avatar');
    [hubTileSettings, hubBtnSettings, hubBtnAvatar].forEach(function(el) {
      if (el) {
        el.addEventListener('click', function() {
          setupSettingsModal();
        });
      }
    });

    var hubBtnSound = document.getElementById('hub-btn-sound');
    if (hubBtnSound) {
      hubBtnSound.addEventListener('click', function() {
        toggleMute();
      });
    }

    // 3. Catalog Buttons & Filters
    var catalogBtnBack = document.getElementById('catalog-btn-back');
    if (catalogBtnBack) {
      catalogBtnBack.addEventListener('click', function() {
        if (Audio) Audio.playSFX('click');
        showScreen(SCREENS.HUB);
      });
    }

    var catalogCoinsPill = document.getElementById('catalog-coins-pill');
    if (catalogCoinsPill) {
      catalogCoinsPill.addEventListener('click', function() {
        openShopModal('boosters');
      });
    }

    var filterBtns = document.querySelectorAll('.catalog-filter-btn');
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCatalogFilter = btn.getAttribute('data-filter') || 'all';
        renderCatalog();
      });
    });

    // 4. Game Screen Controls & Booster Toolbar
    var gameBtnBack = document.getElementById('game-btn-back');
    if (gameBtnBack) {
      gameBtnBack.addEventListener('click', function() {
        if (Audio) Audio.playSFX('click');
        showScreen(SCREENS.CATALOG);
      });
    }

    var gameBtnPause = document.getElementById('game-btn-pause');
    if (gameBtnPause) {
      gameBtnPause.addEventListener('click', function() {
        openModal('modal-pause');
      });
    }

    var hudCoinsPill = document.getElementById('hud-coins-pill');
    if (hudCoinsPill) {
      hudCoinsPill.addEventListener('click', function() {
        openShopModal('boosters');
      });
    }

    var btnBoost5050 = document.getElementById('btn-boost-5050');
    if (btnBoost5050) btnBoost5050.addEventListener('click', handleUse5050);

    var btnBoostShield = document.getElementById('btn-boost-shield');
    if (btnBoostShield) btnBoostShield.addEventListener('click', handleUseShield);

    var btnBoostHint = document.getElementById('btn-boost-hint');
    if (btnBoostHint) btnBoostHint.addEventListener('click', handleUseHint);

    var btnBoostHeart = document.getElementById('btn-boost-heart');
    if (btnBoostHeart) btnBoostHeart.addEventListener('click', handleUseHeart);

    var btnBoostFreeze = document.getElementById('btn-boost-freeze');
    if (btnBoostFreeze) btnBoostFreeze.addEventListener('click', handleUseFreeze);

    var btnOpenShopQuick = document.getElementById('btn-open-shop-quick');
    if (btnOpenShopQuick) btnOpenShopQuick.addEventListener('click', function() {
      openShopModal('boosters');
    });

    var drawerBtnNext = document.getElementById('drawer-btn-next');
    if (drawerBtnNext) {
      drawerBtnNext.addEventListener('click', function() {
        advanceToNextStep();
      });
    }

    // 5. Victory Screen Controls
    var victoryBtnDiploma = document.getElementById('victory-btn-diploma');
    if (victoryBtnDiploma) victoryBtnDiploma.addEventListener('click', renderDiploma);

    var victoryBtnReplay = document.getElementById('victory-btn-replay');
    if (victoryBtnReplay) {
      victoryBtnReplay.addEventListener('click', function() {
        startLevel(1);
      });
    }

    var victoryBtnHub = document.getElementById('victory-btn-hub');
    if (victoryBtnHub) {
      victoryBtnHub.addEventListener('click', function() {
        showScreen(SCREENS.HUB);
      });
    }

    // 6. Shop Modal Controls
    var shopBtnCloseX = document.getElementById('shop-btn-close-x');
    var shopBtnClose = document.getElementById('shop-btn-close');
    [shopBtnCloseX, shopBtnClose].forEach(function(el) {
      if (el) {
        el.addEventListener('click', function() {
          closeModal('modal-shop');
        });
      }
    });

    var shopTabBtns = document.querySelectorAll('.shop-tab-btn');
    shopTabBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.getAttribute('data-tab');
        currentShopTab = tab;
        renderShopView();
      });
    });

    // 7. Calculator Controls
    initSugarCalculator();
    var calcBtnCloseX = document.getElementById('calc-btn-close-x');
    var calcBtnClose = document.getElementById('calc-btn-close');
    [calcBtnCloseX, calcBtnClose].forEach(function(el) {
      if (el) el.addEventListener('click', function() { closeModal('modal-calc'); });
    });

    // 8. Marathon Controls
    var marathonBtnCloseX = document.getElementById('marathon-btn-close-x');
    if (marathonBtnCloseX) marathonBtnCloseX.addEventListener('click', function() {
      if (marathonTimer) clearInterval(marathonTimer);
      closeModal('modal-marathon');
    });

    var marathonBtnStartRun = document.getElementById('marathon-btn-start-run');
    if (marathonBtnStartRun) marathonBtnStartRun.addEventListener('click', startMarathon);

    var marathonBtnRetry = document.getElementById('marathon-btn-retry');
    if (marathonBtnRetry) marathonBtnRetry.addEventListener('click', startMarathon);

    var marathonBtnFreeze = document.getElementById('marathon-btn-freeze');
    if (marathonBtnFreeze) marathonBtnFreeze.addEventListener('click', handleMarathonFreeze);

    // 9. Dossier Modal Controls
    var dossierBtnCloseX = document.getElementById('dossier-btn-close-x');
    var dossierBtnClose = document.getElementById('dossier-btn-close');
    [dossierBtnCloseX, dossierBtnClose].forEach(function(el) {
      if (el) el.addEventListener('click', function() { closeModal('modal-dossier'); });
    });

    // 10. Pause Modal Controls
    var pauseBtnCloseX = document.getElementById('pause-btn-close-x');
    var pauseBtnResume = document.getElementById('pause-btn-resume');
    [pauseBtnCloseX, pauseBtnResume].forEach(function(el) {
      if (el) el.addEventListener('click', function() { closeModal('modal-pause'); });
    });

    var pauseBtnHub = document.getElementById('pause-btn-hub');
    if (pauseBtnHub) {
      pauseBtnHub.addEventListener('click', function() {
        closeModal('modal-pause');
        showScreen(SCREENS.CATALOG);
      });
    }

    var pauseBtnRestart = document.getElementById('pause-btn-restart');
    if (pauseBtnRestart) {
      pauseBtnRestart.addEventListener('click', function() {
        closeModal('modal-pause');
        if (currentLevelData) startLevel(currentLevelData.number);
      });
    }

    var pauseToggleMusic = document.getElementById('pause-toggle-music');
    if (pauseToggleMusic) {
      pauseToggleMusic.addEventListener('click', function() {
        if (Audio && Audio.isMusicPlaying()) {
          Audio.stopMusic();
        } else if (Audio) {
          Audio.startMusic();
        }
      });
    }

    // 11. Settings Modal Controls
    var sfxSlider = document.getElementById('setting-slider-sound');
    if (sfxSlider) {
      sfxSlider.addEventListener('input', function() {
        var v = parseFloat(sfxSlider.value);
        if (Audio) Audio.setSoundVolume(v);
        State.updateSettings({ sfxVolume: v });
      });
    }

    var bgmSlider = document.getElementById('setting-slider-music');
    if (bgmSlider) {
      bgmSlider.addEventListener('input', function() {
        var v = parseFloat(bgmSlider.value);
        if (Audio) Audio.setMusicVolume(v);
        State.updateSettings({ musicVolume: v });
      });
    }

    var settingsBtnCloseX = document.getElementById('settings-btn-close-x');
    var settingsBtnSave = document.getElementById('settings-btn-save');
    [settingsBtnCloseX, settingsBtnSave].forEach(function(el) {
      if (el) {
        el.addEventListener('click', function() {
          var nameInput = document.getElementById('setting-player-name');
          if (nameInput) State.updatePlayer(nameInput.value);
          if (sfxSlider) {
            var sv = parseFloat(sfxSlider.value);
            if (Audio) Audio.setSoundVolume(sv);
            State.updateSettings({ sfxVolume: sv });
          }
          if (bgmSlider) {
            var mv = parseFloat(bgmSlider.value);
            if (Audio) Audio.setMusicVolume(mv);
            State.updateSettings({ musicVolume: mv });
          }
          closeModal('modal-settings');
          updateHubView();
        });
      }
    });

    var settingBtnReset = document.getElementById('setting-btn-reset');
    if (settingBtnReset) {
      settingBtnReset.addEventListener('click', function() {
        if (confirm('Сбросить весь прогресс и монеты?')) {
          State.resetProgress();
          closeModal('modal-settings');
          showScreen(SCREENS.HERO);
        }
      });
    }

    var settingBtnDebug = document.getElementById('setting-btn-debug');
    if (settingBtnDebug) {
      settingBtnDebug.addEventListener('click', function() {
        toggleDebugPanel();
      });
    }

    // 12. Diploma Controls
    var diplomaBtnCloseX = document.getElementById('diploma-btn-close-x');
    var diplomaBtnClose = document.getElementById('diploma-btn-close');
    [diplomaBtnCloseX, diplomaBtnClose].forEach(function(el) {
      if (el) el.addEventListener('click', function() { closeModal('modal-diploma'); });
    });

    var diplomaBtnPrint = document.getElementById('diploma-btn-print');
    if (diplomaBtnPrint) {
      diplomaBtnPrint.addEventListener('click', function() {
        window.print();
      });
    }

    // 13. Game Over Controls
    var gameOverBtnRestart = document.getElementById('game-over-btn-restart');
    if (gameOverBtnRestart) {
      gameOverBtnRestart.addEventListener('click', function() {
        closeModal('modal-game-over');
        if (currentLevelData) startLevel(currentLevelData.number);
      });
    }

    var gameOverBtnCatalog = document.getElementById('game-over-btn-catalog');
    if (gameOverBtnCatalog) {
      gameOverBtnCatalog.addEventListener('click', function() {
        closeModal('modal-game-over');
        showScreen(SCREENS.CATALOG);
      });
    }

    var gameOverBtnShop = document.getElementById('game-over-btn-shop');
    if (gameOverBtnShop) {
      gameOverBtnShop.addEventListener('click', function() {
        closeModal('modal-game-over');
        openShopModal('boosters');
      });
    }

    // 14. Achievements Close
    var achBtnCloseX = document.getElementById('achievements-btn-close-x');
    var achBtnClose = document.getElementById('achievements-btn-close');
    [achBtnCloseX, achBtnClose].forEach(function(el) {
      if (el) el.addEventListener('click', function() { closeModal('modal-achievements'); });
    });

    // 15. Debug Panel Setup
    setupDebugPanel();

    // Hotkey ~ listener
    document.addEventListener('keydown', function(e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return;
      }
      if (e.key === '`' || e.key === '~' || e.key === 'ё' || e.key === 'Ё') {
        toggleDebugPanel();
      }
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    // Subscribe to state changes
    State.subscribe(function(s, evt) {
      updateGlobalHUD();
    });

    // Start background chiptune music on first user click
    var startMusicOnce = function() {
      if (Audio) Audio.startMusic();
      document.removeEventListener('click', startMusicOnce);
      document.removeEventListener('keydown', startMusicOnce);
    };
    document.addEventListener('click', startMusicOnce);
    document.addEventListener('keydown', startMusicOnce);

    // Initial HUD & theme
    updateGlobalHUD();
    updateHubView();
  }

  function toggleMute() {
    var raw = State._getRawState();
    var newMuted = !raw.settings.isMuted;
    State.updateSettings({ isMuted: newMuted });
    if (Audio) Audio.setMuted(newMuted);

    var soundBtns = [document.getElementById('hero-btn-sound'), document.getElementById('hub-btn-sound')];
    soundBtns.forEach(function(btn) {
      if (btn) btn.innerHTML = '<span class="icon-slot">' + (newMuted ? '🔇' : '🔊') + '</span>';
    });
  }

  function setupDebugPanel() {
    var debugPanel = document.getElementById('debug-panel');
    var debugClose = document.getElementById('debug-btn-close');
    if (debugClose) {
      debugClose.addEventListener('click', function() {
        if (debugPanel) debugPanel.classList.remove('open');
      });
    }

    var debugBtns = document.querySelectorAll('#debug-panel .btn-debug');
    debugBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var action = btn.getAttribute('data-action');
        var lvl = btn.getAttribute('data-level');
        var count = btn.getAttribute('data-count');
        var amt = btn.getAttribute('data-amount');

        if (action === 'jump') {
          if (debugPanel) debugPanel.classList.remove('open');
          startLevel(Number(lvl));
        } else if (action === 'jump-victory') {
          if (debugPanel) debugPanel.classList.remove('open');
          showScreen(SCREENS.VICTORY);
        } else if (action === 'jump-gameover') {
          if (debugPanel) debugPanel.classList.remove('open');
          showGameOverModal();
        } else if (action === 'lives') {
          State.setLives(Number(count));
          updateGlobalHUD();
        } else if (action === 'toggle-shield') {
          var isAct = State.isShieldActive();
          if (isAct) {
            State._getRawState().round.isShieldActive = false;
          } else {
            State.useBooster('booster_shield');
          }
          updateGlobalHUD();
        } else if (action === 'damage-boss') {
          State.damageBoss(1);
          updateBossHpDisplay();
          if (Audio) Audio.playSFX('boss_hit');
        } else if (action === 'coins') {
          State.addCoins(Number(amt));
          updateGlobalHUD();
        } else if (action === 'give-boosters') {
          var inv = State._getRawState().inventory;
          inv.booster_5050 += 3;
          inv.booster_shield += 3;
          inv.booster_hint += 3;
          inv.booster_heart += 3;
          inv.booster_freeze += 3;
          State.save();
          updateGlobalHUD();
          updateBoosterToolbar();
          alert('+3 всех бустеров добавлено!');
        } else if (action === 'unlock-all') {
          State.unlockAllLevels();
          renderCatalog();
          alert('Все 15 уровней открыты!');
        } else if (action === 'unlock-achieve') {
          State.unlockAllAchievements();
          alert('Все достижения открыты!');
        }
      });
    });
  }

  function toggleDebugPanel() {
    var panel = document.getElementById('debug-panel');
    if (panel) {
      panel.classList.toggle('open');
    }
  }

  // DOMContentLoaded or immediate execution
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initApp);
    } else {
      initApp();
    }
  }

  SugarApp.App = {
    init: initApp,
    showScreen: showScreen,
    startLevel: startLevel,
    openShopModal: openShopModal,
    openMarathonModal: openMarathonModal,
    calculateSugar: calculateSugar,
    advanceToNextStep: advanceToNextStep
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SugarApp.App;
  }
})(typeof window !== 'undefined' ? window : global);
