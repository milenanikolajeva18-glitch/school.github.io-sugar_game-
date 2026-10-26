/**
 * Hidden Sugar Detective: PRO Edition — Enhanced State & Economy Store
 * Pure vanilla JavaScript module. Zero external dependencies.
 * Manages player state, shop transactions, booster inventory, cosmetic themes,
 * sugar shield mechanics, boss HP, and persistent storage.
 * Mounts on window.SugarApp.State and exports via CommonJS for Node.js testing.
 */
(function(global) {
  'use strict';

  var SugarApp = global.SugarApp = global.SugarApp || {};
  var STORAGE_KEY = 'HIDDEN_SUGAR_GAME_PRO_SAVE_V2';

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function createDefaultState() {
    return {
      version: 2,
      player: {
        name: "Юный детектив",
        avatarId: "avatar_detective_boy",
        registeredAt: Date.now()
      },
      economy: {
        coins: 100, // Starter capital: 100 coins
        totalEarned: 100,
        totalSpent: 0,
        claimedQuestions: []
      },
      inventory: {
        booster_5050: 1,   // 1 free starter booster
        booster_shield: 1, // 1 free starter shield
        booster_hint: 1,   // 1 free starter hint
        booster_heart: 0,
        booster_freeze: 0
      },
      customization: {
        unlockedAvatars: ["avatar_detective_boy", "avatar_detective_girl", "avatar_cat", "avatar_owl"],
        unlockedThemes: ["theme_default"],
        activeTheme: "theme_default",
        unlockedDossiers: []
      },
      progress: {
        currentLevelId: 1,
        currentQuestionIndex: 0,
        unlockedLevels: [1], // Level 1 is unlocked initially
        completedLevels: [],
        totalSugarFound: 0,
        totalMistakes: 0,
        victoryAchieved: false,
        marathonHighScore: 0,
        bossDefeated: false
      },
      round: {
        lives: 3,
        maxLives: 3,
        isLevelFailed: false,
        mistakesInRound: 0,
        isShieldActive: false,
        is5050Used: false,
        isHintUsed: false,
        bossCurrentHp: 5,
        bossMaxHp: 5
      },
      settings: {
        soundVolume: 0.8,
        sfxVolume: 0.8,
        musicVolume: 0.6,
        isMuted: false,
        isMusicMuted: false,
        isSfxMuted: false
      },
      achievements: {
        unlockedIds: [],
        unlockedTimestamps: {}
      },
      ui: {
        isPaused: false,
        isDebugOpen: false,
        activeModal: null
      }
    };
  }

  var state = createDefaultState();
  var listeners = [];

  var memoryStorage = {};
  var storage = {
    getItem: function(key) {
      try {
        if (typeof global.localStorage !== 'undefined') {
          return global.localStorage.getItem(key);
        }
      } catch (e) {}
      return memoryStorage[key] || null;
    },
    setItem: function(key, val) {
      try {
        if (typeof global.localStorage !== 'undefined') {
          global.localStorage.setItem(key, val);
          return;
        }
      } catch (e) {}
      memoryStorage[key] = String(val);
    },
    removeItem: function(key) {
      try {
        if (typeof global.localStorage !== 'undefined') {
          global.localStorage.removeItem(key);
          return;
        }
      } catch (e) {}
      delete memoryStorage[key];
    }
  };

  function notify(event) {
    for (var i = 0; i < listeners.length; i++) {
      try {
        listeners[i](state, event || { type: 'state_changed' });
      } catch (err) {
        console.error('State listener error:', err);
      }
    }
  }

  function save() {
    try {
      var payload = {
        version: state.version,
        timestamp: Date.now(),
        player: state.player,
        economy: state.economy,
        inventory: state.inventory,
        customization: state.customization,
        progress: state.progress,
        settings: state.settings,
        achievements: state.achievements
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Unable to save state:', e);
    }
  }

  function load() {
    try {
      var raw = storage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return false;

      if (parsed.player && typeof parsed.player === 'object') {
        state.player.name = parsed.player.name || state.player.name;
        state.player.avatarId = parsed.player.avatarId || state.player.avatarId;
      }

      if (parsed.economy && typeof parsed.economy === 'object') {
        state.economy.coins = Number.isFinite(parsed.economy.coins) ? Math.max(0, parsed.economy.coins) : 100;
        state.economy.totalEarned = Number.isFinite(parsed.economy.totalEarned) ? parsed.economy.totalEarned : state.economy.coins;
        state.economy.totalSpent = Number.isFinite(parsed.economy.totalSpent) ? parsed.economy.totalSpent : 0;
        if (Array.isArray(parsed.economy.claimedQuestions)) {
          state.economy.claimedQuestions = parsed.economy.claimedQuestions.slice();
        }
      }

      if (parsed.inventory && typeof parsed.inventory === 'object') {
        for (var k in state.inventory) {
          if (parsed.inventory[k] !== undefined && Number.isFinite(parsed.inventory[k])) {
            state.inventory[k] = Math.max(0, parsed.inventory[k]);
          }
        }
      }

      if (parsed.customization && typeof parsed.customization === 'object') {
        if (Array.isArray(parsed.customization.unlockedAvatars)) {
          state.customization.unlockedAvatars = parsed.customization.unlockedAvatars.slice();
        }
        if (Array.isArray(parsed.customization.unlockedThemes)) {
          state.customization.unlockedThemes = parsed.customization.unlockedThemes.slice();
        }
        if (parsed.customization.activeTheme) {
          state.customization.activeTheme = parsed.customization.activeTheme;
        }
        if (Array.isArray(parsed.customization.unlockedDossiers)) {
          state.customization.unlockedDossiers = parsed.customization.unlockedDossiers.slice();
        }
      }

      if (parsed.progress && typeof parsed.progress === 'object') {
        state.progress.currentLevelId = Number(parsed.progress.currentLevelId) || 1;
        state.progress.currentQuestionIndex = Number(parsed.progress.currentQuestionIndex) || 0;
        if (Array.isArray(parsed.progress.unlockedLevels)) {
          state.progress.unlockedLevels = parsed.progress.unlockedLevels.map(Number);
        }
        if (Array.isArray(parsed.progress.completedLevels)) {
          state.progress.completedLevels = parsed.progress.completedLevels.map(Number);
        }
        state.progress.totalSugarFound = Number(parsed.progress.totalSugarFound) || 0;
        state.progress.totalMistakes = Number(parsed.progress.totalMistakes) || 0;
        state.progress.victoryAchieved = Boolean(parsed.progress.victoryAchieved);
        state.progress.marathonHighScore = Number(parsed.progress.marathonHighScore) || 0;
        state.progress.bossDefeated = Boolean(parsed.progress.bossDefeated);
      }

      if (parsed.settings && typeof parsed.settings === 'object') {
        state.settings.soundVolume = Number.isFinite(parsed.settings.soundVolume) ? parsed.settings.soundVolume : 0.8;
        state.settings.sfxVolume = Number.isFinite(parsed.settings.sfxVolume) ? parsed.settings.sfxVolume : 0.8;
        state.settings.musicVolume = Number.isFinite(parsed.settings.musicVolume) ? parsed.settings.musicVolume : 0.6;
        state.settings.isMuted = Boolean(parsed.settings.isMuted);
        state.settings.isMusicMuted = Boolean(parsed.settings.isMusicMuted);
        state.settings.isSfxMuted = Boolean(parsed.settings.isSfxMuted);
      }

      if (parsed.achievements && typeof parsed.achievements === 'object') {
        if (Array.isArray(parsed.achievements.unlockedIds)) {
          state.achievements.unlockedIds = parsed.achievements.unlockedIds.slice();
        }
        if (parsed.achievements.unlockedTimestamps && typeof parsed.achievements.unlockedTimestamps === 'object') {
          state.achievements.unlockedTimestamps = deepClone(parsed.achievements.unlockedTimestamps);
        }
      }

      return true;
    } catch (e) {
      console.warn('Corrupted save data, falling back to default:', e);
      resetProgress();
      return false;
    }
  }

  function resetProgress() {
    storage.removeItem(STORAGE_KEY);
    var fresh = createDefaultState();
    fresh.settings = deepClone(state.settings);
    fresh.player = deepClone(state.player);
    state = fresh;
    save();
    notify({ type: 'progress_reset' });
  }

  // =========================================================================
  // ECONOMY & COINS ENGINE
  // =========================================================================

  function getCoins() {
    return state.economy.coins;
  }

  function getTotalEarned() {
    return state.economy.totalEarned;
  }

  function getTotalSpent() {
    return state.economy.totalSpent;
  }

  function addCoins(amount, questionId) {
    var amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return false;
    }

    if (questionId) {
      if (state.economy.claimedQuestions.indexOf(questionId) !== -1) {
        return false; // Anti-farming duplicate check
      }
      state.economy.claimedQuestions.push(questionId);
    }

    state.economy.coins += amt;
    state.economy.totalEarned += amt;

    if (state.economy.coins >= 300) {
      unlockAchievement('coin_collector');
    }

    save();
    notify({ type: 'coins_added', amount: amt, questionId: questionId, total: state.economy.coins });
    return true;
  }

  function spendCoins(amount, reason) {
    var amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return false;
    }
    if (state.economy.coins < amt) {
      return false; // Insufficient funds
    }

    state.economy.coins -= amt;
    state.economy.totalSpent += amt;

    unlockAchievement('shopaholic'); // First purchase badge

    save();
    notify({ type: 'coins_spent', amount: amt, reason: reason, total: state.economy.coins });
    return true;
  }

  // =========================================================================
  // INVENTORY & SHOP TRANSACTIONS
  // =========================================================================

  function getInventory() {
    return deepClone(state.inventory);
  }

  function getBoosterCount(boosterId) {
    return state.inventory[boosterId] || 0;
  }

  function addBooster(boosterId, count) {
    var c = Math.max(1, Number(count) || 1);
    state.inventory[boosterId] = (state.inventory[boosterId] || 0) + c;
    save();
    notify({ type: 'booster_added', boosterId: boosterId, count: state.inventory[boosterId] });
    return state.inventory[boosterId];
  }

  function buyBooster(boosterId) {
    var DATA = SugarApp.DATA;
    var booster = DATA && DATA.getBoosterById ? DATA.getBoosterById(boosterId) : null;
    if (!booster) return false;

    if (spendCoins(booster.cost, 'buy_' + boosterId)) {
      state.inventory[boosterId] = (state.inventory[boosterId] || 0) + 1;
      save();
      notify({ type: 'booster_bought', boosterId: boosterId, count: state.inventory[boosterId] });
      return true;
    }
    return false;
  }

  function useBooster(boosterId) {
    var currentCount = state.inventory[boosterId] || 0;
    if (currentCount <= 0) {
      return false;
    }

    if (boosterId === 'booster_shield') {
      if (state.round.isShieldActive) {
        return false; // Shield already active in this round
      }
      state.inventory[boosterId]--;
      state.round.isShieldActive = true;
      save();
      notify({ type: 'shield_activated', boosterId: boosterId });
      return true;
    }

    if (boosterId === 'booster_heart') {
      if (state.round.lives >= state.round.maxLives) {
        return false; // Hearts already full
      }
      state.inventory[boosterId]--;
      state.round.lives = Math.min(state.round.maxLives, state.round.lives + 1);
      save();
      notify({ type: 'heart_restored', lives: state.round.lives });
      return true;
    }

    if (boosterId === 'booster_5050') {
      if (state.round.is5050Used) {
        return false;
      }
      state.inventory[boosterId]--;
      state.round.is5050Used = true;
      save();
      notify({ type: 'booster_5050_used' });
      return true;
    }

    if (boosterId === 'booster_hint') {
      if (state.round.isHintUsed) {
        return false;
      }
      state.inventory[boosterId]--;
      state.round.isHintUsed = true;
      save();
      notify({ type: 'booster_hint_used' });
      return true;
    }

    if (boosterId === 'booster_freeze') {
      state.inventory[boosterId]--;
      save();
      notify({ type: 'booster_freeze_used', seconds: 15 });
      return true;
    }

    return false;
  }

  function buyAvatar(avatarId, cost) {
    if (state.customization.unlockedAvatars.indexOf(avatarId) !== -1) {
      return true; // Already owned
    }
    if (spendCoins(cost, 'avatar_' + avatarId)) {
      state.customization.unlockedAvatars.push(avatarId);
      setAvatar(avatarId);
      save();
      notify({ type: 'avatar_unlocked', avatarId: avatarId });
      return true;
    }
    return false;
  }

  function setAvatar(avatarId) {
    if (state.customization.unlockedAvatars.indexOf(avatarId) !== -1) {
      state.player.avatarId = avatarId;
      save();
      notify({ type: 'avatar_changed', avatarId: avatarId });
      return true;
    }
    return false;
  }

  function buyTheme(themeId, cost) {
    if (state.customization.unlockedThemes.indexOf(themeId) !== -1) {
      return true; // Already owned
    }
    if (spendCoins(cost, 'theme_' + themeId)) {
      state.customization.unlockedThemes.push(themeId);
      setTheme(themeId);
      save();
      notify({ type: 'theme_unlocked', themeId: themeId });
      return true;
    }
    return false;
  }

  function setTheme(themeId) {
    if (state.customization.unlockedThemes.indexOf(themeId) !== -1) {
      state.customization.activeTheme = themeId;
      save();
      notify({ type: 'theme_changed', themeId: themeId });
      return true;
    }
    return false;
  }

  function buyDossier(dossierId, cost) {
    if (state.customization.unlockedDossiers.indexOf(dossierId) !== -1) {
      return true;
    }
    if (spendCoins(cost, 'dossier_' + dossierId)) {
      state.customization.unlockedDossiers.push(dossierId);
      save();
      notify({ type: 'dossier_unlocked', dossierId: dossierId });
      return true;
    }
    return false;
  }

  function isDossierUnlocked(dossierId) {
    return state.customization.unlockedDossiers.indexOf(dossierId) !== -1;
  }

  // =========================================================================
  // LIVES & SHIELD MECHANICS
  // =========================================================================

  function getLives() {
    return state.round.lives;
  }

  function isShieldActive() {
    return state.round.isShieldActive;
  }

  function decrementLife() {
    // If shield is active, it absorbs the damage!
    if (state.round.isShieldActive) {
      state.round.isShieldActive = false;
      unlockAchievement('shield_master');
      save();
      notify({ type: 'shield_absorbed', lives: state.round.lives });
      return state.round.lives; // Protected! No life lost.
    }

    state.round.lives = Math.max(0, state.round.lives - 1);
    state.round.mistakesInRound++;
    state.progress.totalMistakes++;

    if (state.round.lives === 0) {
      state.round.isLevelFailed = true;
    }

    save();
    notify({ type: 'life_decremented', lives: state.round.lives, isGameOver: isGameOver() });
    return state.round.lives;
  }

  function resetLives() {
    state.round.lives = state.round.maxLives;
    state.round.isLevelFailed = false;
    state.round.mistakesInRound = 0;
    state.round.isShieldActive = false;
    state.round.is5050Used = false;
    state.round.isHintUsed = false;
    notify({ type: 'lives_reset', lives: state.round.lives });
  }

  function isGameOver() {
    return state.round.lives <= 0;
  }

  function setLives(count) {
    var num = Math.max(0, Math.min(state.round.maxLives, Number(count) || 0));
    state.round.lives = num;
    state.round.isLevelFailed = (num === 0);
    notify({ type: 'lives_set', lives: num });
    return num;
  }

  // =========================================================================
  // BOSS MECHANICS (LEVEL 15)
  // =========================================================================

  function getBossHp() {
    return state.round.bossCurrentHp;
  }

  function resetBossHp() {
    state.round.bossCurrentHp = state.round.bossMaxHp;
    notify({ type: 'boss_hp_reset', hp: state.round.bossCurrentHp });
  }

  function damageBoss(amount) {
    var dmg = Math.max(1, Number(amount) || 1);
    state.round.bossCurrentHp = Math.max(0, state.round.bossCurrentHp - dmg);
    var isDefeated = state.round.bossCurrentHp === 0;
    if (isDefeated) {
      state.progress.bossDefeated = true;
      unlockAchievement('boss_slayer');
    }
    save();
    notify({ type: 'boss_damaged', remainingHp: state.round.bossCurrentHp, isDefeated: isDefeated });
    return state.round.bossCurrentHp;
  }

  // =========================================================================
  // PROGRESSION & LEVELS (1..15)
  // =========================================================================

  function getCurrentLevel() {
    return state.progress.currentLevelId;
  }

  function setCurrentLevel(levelId) {
    var num = Number(levelId) || 1;
    state.progress.currentLevelId = num;
    state.progress.currentQuestionIndex = 0;
    resetLives();
    if (num === 15) {
      resetBossHp();
    }
    save();
    notify({ type: 'level_changed', levelId: num });
  }

  function getCurrentQuestionIndex() {
    return state.progress.currentQuestionIndex;
  }

  function setCurrentQuestionIndex(index) {
    state.progress.currentQuestionIndex = Math.max(0, Number(index) || 0);
    state.round.is5050Used = false;
    state.round.isHintUsed = false;
    notify({ type: 'question_index_changed', index: state.progress.currentQuestionIndex });
  }

  function isLevelUnlocked(levelId) {
    var num = Number(levelId);
    return state.progress.unlockedLevels.indexOf(num) !== -1;
  }

  function unlockLevel(levelId) {
    var num = Number(levelId);
    if (state.progress.unlockedLevels.indexOf(num) === -1) {
      state.progress.unlockedLevels.push(num);
      state.progress.unlockedLevels.sort(function(a, b) { return a - b; });
      save();
      notify({ type: 'level_unlocked', levelId: num });
    }
  }

  function unlockAllLevels() {
    var all = [];
    for (var i = 1; i <= 15; i++) all.push(i);
    state.progress.unlockedLevels = all;
    save();
    notify({ type: 'all_levels_unlocked' });
  }

  function completeLevel(levelId) {
    var num = Number(levelId);
    if (state.progress.completedLevels.indexOf(num) === -1) {
      state.progress.completedLevels.push(num);
      state.progress.completedLevels.sort(function(a, b) { return a - b; });
    }

    if (num < 15) {
      unlockLevel(num + 1);
    }

    // Milestone achievements
    if (num === 1) unlockAchievement('first_step');
    if (num === 2 && state.round.mistakesInRound === 0) unlockAchievement('breakfast_pro');
    if (num === 3) unlockAchievement('detective_eye');
    if (num === 4) unlockAchievement('sauce_master');
    if (num === 5) unlockAchievement('canning_guru');
    if (num === 7) unlockAchievement('freezer_titan');
    if (num === 8) unlockAchievement('fitness_buster');
    if (num === 9) unlockAchievement('kid_shield');
    if (num === 10) unlockAchievement('asian_master');
    if (num === 13) unlockAchievement('pharmacy_sleuth');
    if (num === 15) {
      if (state.round.bossCurrentHp === 0 || state.progress.bossDefeated) {
        unlockAchievement('boss_slayer');
        state.progress.bossDefeated = true;
      }
    }

    if (state.progress.completedLevels.length >= 15) {
      state.progress.victoryAchieved = true;
      unlockAchievement('sugar_grandmaster');
    }

    save();
    notify({ type: 'level_completed', levelId: num });
  }

  function isLevelCompleted(levelId) {
    var num = Number(levelId);
    return state.progress.completedLevels.indexOf(num) !== -1;
  }

  function getCompletedLevels() {
    return state.progress.completedLevels.slice();
  }

  function getUnlockedLevels() {
    return state.progress.unlockedLevels.slice();
  }

  // =========================================================================
  // ACHIEVEMENTS
  // =========================================================================

  function getAchievements() {
    return {
      unlockedIds: state.achievements.unlockedIds.slice(),
      unlockedTimestamps: deepClone(state.achievements.unlockedTimestamps)
    };
  }

  function unlockAchievement(id) {
    if (!id || state.achievements.unlockedIds.indexOf(id) !== -1) {
      return false;
    }
    state.achievements.unlockedIds.push(id);
    state.achievements.unlockedTimestamps[id] = Date.now();
    save();
    notify({ type: 'achievement_unlocked', id: id });
    return true;
  }

  function hasAchievement(id) {
    return state.achievements.unlockedIds.indexOf(id) !== -1;
  }

  function unlockAllAchievements() {
    var all = SugarApp.DATA && SugarApp.DATA.ACHIEVEMENTS ? SugarApp.DATA.ACHIEVEMENTS : [];
    for (var i = 0; i < all.length; i++) {
      unlockAchievement(all[i].id);
    }
  }

  // =========================================================================
  // BLITZ MARATHON MODE
  // =========================================================================

  function updateMarathonScore(score) {
    var s = Math.max(0, Number(score) || 0);
    if (s > state.progress.marathonHighScore) {
      state.progress.marathonHighScore = s;
      save();
      notify({ type: 'marathon_highscore_updated', score: s });
      return true;
    }
    return false;
  }

  function getMarathonHighScore() {
    return state.progress.marathonHighScore;
  }

  // =========================================================================
  // SETTINGS & PLAYER PROFILE
  // =========================================================================

  function getSettings() {
    return deepClone(state.settings);
  }

  function updateSettings(patch) {
    if (!patch || typeof patch !== 'object') return;
    for (var k in patch) {
      if (state.settings[k] !== undefined) {
        state.settings[k] = patch[k];
      }
    }
    save();
    notify({ type: 'settings_updated', settings: state.settings });
  }

  function getPlayer() {
    return deepClone(state.player);
  }

  function updatePlayer(name, avatarId) {
    if (name && typeof name === 'string') state.player.name = name.trim();
    if (avatarId && typeof avatarId === 'string') state.player.avatarId = avatarId;
    save();
    notify({ type: 'player_updated', player: state.player });
  }

  function subscribe(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
    return function unsubscribe() {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  // Boot load
  load();

  SugarApp.State = {
    getCoins: getCoins,
    getTotalEarned: getTotalEarned,
    getTotalSpent: getTotalSpent,
    addCoins: addCoins,
    spendCoins: spendCoins,
    getInventory: getInventory,
    getBoosterCount: getBoosterCount,
    addBooster: addBooster,
    buyBooster: buyBooster,
    useBooster: useBooster,
    buyAvatar: buyAvatar,
    setAvatar: setAvatar,
    buyTheme: buyTheme,
    setTheme: setTheme,
    getActiveTheme: function() { return state.customization.activeTheme; },
    buyDossier: buyDossier,
    isDossierUnlocked: isDossierUnlocked,
    getLives: getLives,
    isShieldActive: isShieldActive,
    decrementLife: decrementLife,
    resetLives: resetLives,
    isGameOver: isGameOver,
    setLives: setLives,
    getBossHp: getBossHp,
    resetBossHp: resetBossHp,
    damageBoss: damageBoss,
    getCurrentLevel: getCurrentLevel,
    setCurrentLevel: setCurrentLevel,
    getCurrentQuestionIndex: getCurrentQuestionIndex,
    setCurrentQuestionIndex: setCurrentQuestionIndex,
    isLevelUnlocked: isLevelUnlocked,
    unlockLevel: unlockLevel,
    unlockAllLevels: unlockAllLevels,
    completeLevel: completeLevel,
    isLevelCompleted: isLevelCompleted,
    getCompletedLevels: getCompletedLevels,
    getUnlockedLevels: getUnlockedLevels,
    getAchievements: getAchievements,
    unlockAchievement: unlockAchievement,
    hasAchievement: hasAchievement,
    unlockAllAchievements: unlockAllAchievements,
    updateMarathonScore: updateMarathonScore,
    getMarathonHighScore: getMarathonHighScore,
    getSettings: getSettings,
    updateSettings: updateSettings,
    getPlayer: getPlayer,
    updatePlayer: updatePlayer,
    resetProgress: resetProgress,
    save: save,
    load: load,
    subscribe: subscribe,
    _getRawState: function() { return deepClone(state); }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SugarApp.State;
  }
})(typeof window !== 'undefined' ? window : global);
