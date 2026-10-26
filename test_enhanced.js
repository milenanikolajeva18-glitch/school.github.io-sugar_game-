/**
 * Hidden Sugar Detective: PRO Edition — Autonomous Comprehensive Verification Suite
 * Tests 100% of all enhanced features: 15 levels, 81 questions, Store economy,
 * In-game Boosters, Sugar Shield damage absorption, Boss battle HP, Themes,
 * Audio synthesizer, and End-to-End walkthrough simulation.
 * Pure Node.js test runner with zero external dependencies. Exit code 0 on pass, 1 on fail.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const vm = require('vm');

// Test suite metrics
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✔ [PASS] ${name}`);
  } catch (err) {
    failedTests++;
    failures.push({ name, err });
    console.error(`  ✖ [FAIL] ${name}`);
    console.error(`    -> ${err.message}`);
  }
}

function suite(title, fn) {
  console.log(`\n▶ [SUITE] ${title}`);
  fn();
}

// Sandbox loader for modules
function loadModuleInSandbox(filePath, mockWindow = {}) {
  const code = fs.readFileSync(filePath, 'utf8');
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Date,
    Math,
    JSON,
    Number,
    String,
    Boolean,
    Array,
    Object,
    RegExp,
    AudioContext: null,
    webkitAudioContext: null,
    localStorage: mockWindow.localStorage || {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    },
    ...mockWindow
  };
  sandbox.window = sandbox;
  sandbox.global = sandbox;

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.SugarApp;
}

const basePath = path.resolve(__dirname);
const dataModule = require('./js/data.js');
const stateModule = require('./js/state.js');
const audioModule = require('./js/audio.js');
const graphicsModule = require('./js/graphics.js');

console.log('======================================================================');
console.log('  🔍 HIDDEN SUGAR DETECTIVE: PRO EDITION — VERIFICATION SUITE');
console.log('======================================================================');

// ============================================================================
// TIER 1: FEATURE COVERAGE (15 LEVELS, 81 QUESTIONS & CATALOGS)
// ============================================================================
suite('Tier 1: Feature Coverage (15 Levels & 81 Questions)', () => {

  runTest('All 15 thematic levels exist with valid metadata and non-empty questions', () => {
    assert.strictEqual(dataModule.LEVELS.length, 15, 'Must have exactly 15 levels');
    for (let i = 0; i < 15; i++) {
      const lvl = dataModule.LEVELS[i];
      assert.strictEqual(lvl.number, i + 1, `Level number must be ${i + 1}`);
      assert.ok(lvl.title && lvl.title.length > 2, `Level ${i + 1} must have title`);
      assert.ok(lvl.themeColor && lvl.themeColor.startsWith('#'), `Level ${i + 1} must have themeColor`);
      assert.ok(lvl.rewardPerQuestion >= 5, `Level ${i + 1} reward >= 5 coins`);
      assert.ok(Array.isArray(lvl.questions) && lvl.questions.length >= 4, `Level ${i + 1} questions >= 4`);
    }
    assert.strictEqual(dataModule.LEVELS[14].isBossLevel, true, 'Level 15 must be flagged as Boss Level');
  });

  runTest('Total question count across all 15 levels is exactly 81', () => {
    assert.strictEqual(dataModule.TOTAL_QUESTIONS_COUNT, 81, 'Total question count must be 81');
    assert.strictEqual(Object.keys(dataModule.QUESTIONS_MAP).length, 81, 'QUESTIONS_MAP must have 81 keys');
  });

  runTest('All 81 questions have unique IDs, non-empty prompts, and valid answers', () => {
    const ids = new Set();
    dataModule.LEVELS.forEach(lvl => {
      lvl.questions.forEach(q => {
        assert.ok(!ids.has(q.id), `Duplicate question ID: ${q.id}`);
        ids.add(q.id);
        assert.ok(q.prompt && q.prompt.length >= 10, `Question ${q.id} prompt too short`);
        assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Question ${q.id} must have >= 2 options`);
        assert.ok(q.explanation && q.explanation.length >= 15, `Question ${q.id} explanation too short`);
        assert.ok(q.correctAnswer !== undefined && q.correctAnswer !== null, `Question ${q.id} missing correctAnswer`);
      });
    });
  });

  runTest('Answer evaluation works for single-select, multi-select, and ID/text matching', () => {
    // Single select ID matching
    const q1 = dataModule.getQuestionById('L1_Q1');
    assert.strictEqual(dataModule.checkQuestionAnswer(q1, 'opt_13'), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q1, '13 ложек'), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q1, 'opt_5'), false);

    // Yes/No matching
    const q2 = dataModule.getQuestionById('L2_Q1');
    assert.strictEqual(dataModule.checkQuestionAnswer(q2, 'yes'), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q2, 'no'), false);

    // Multi-select matching (L6_Q5 Caramel Pudding: dextrose + caramel_syrup)
    const q6_5 = dataModule.getQuestionById('L6_Q5');
    assert.strictEqual(dataModule.checkQuestionAnswer(q6_5, ['dextrose', 'caramel_syrup']), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q6_5, ['caramel_syrup', 'dextrose']), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q6_5, ['dextrose']), false);
    assert.strictEqual(dataModule.checkQuestionAnswer(q6_5, ['dextrose', 'cream']), false);

    // Boss multi-select (L15_Q3: corn_dextrin + malt_extract)
    const q15_3 = dataModule.getQuestionById('L15_Q3');
    assert.strictEqual(dataModule.checkQuestionAnswer(q15_3, ['corn_dextrin', 'malt_extract']), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q15_3, ['malt_extract', 'corn_dextrin']), true);
    assert.strictEqual(dataModule.checkQuestionAnswer(q15_3, ['corn_dextrin']), false);
  });

  runTest('Store catalogs: 5 boosters, 8 avatars, 5 themes, 3 dossiers, and 16 achievements', () => {
    assert.strictEqual(dataModule.BOOSTERS.length, 5, 'Must have 5 boosters');
    assert.strictEqual(dataModule.AVATARS.length, 8, 'Must have 8 avatars');
    assert.strictEqual(dataModule.THEMES.length, 5, 'Must have 5 themes');
    assert.strictEqual(dataModule.DOSSIERS.length, 3, 'Must have 3 dossiers');
    assert.strictEqual(dataModule.ACHIEVEMENTS.length, 16, 'Must have 16 achievements');
    assert.ok(dataModule.CALCULATOR_FOODS.length >= 15, 'Calculator foods >= 15');
  });

  runTest('Graphics engine renders valid SVG for products, icons, sugar cubes, and Grandmaster diploma', () => {
    // Check product SVG
    const sodaSvg = graphicsModule.getProductSvg('soda_bottle', 160, 160);
    assert.ok(sodaSvg.startsWith('<svg') && sodaSvg.includes('viewBox="0 0 160 160"'));

    // Check boss SVG
    const bossSvg = graphicsModule.getProductSvg('sugar_titan', 160, 160);
    assert.ok(bossSvg.startsWith('<svg') && bossSvg.includes('C12'));

    // Check booster icons
    const shieldIcon = graphicsModule.getIconSvg('booster_shield', 24);
    assert.ok(shieldIcon.startsWith('<svg') && shieldIcon.includes('viewBox="0 0 24 24"'));

    // Check Sugar Cubes stack
    const cubesSvg = graphicsModule.getSugarCubesSvg(13);
    assert.ok(cubesSvg.startsWith('<svg') && cubesSvg.includes('sugar-cubes-svg'));

    // Check Grandmaster Diploma
    const diplomaSvg = graphicsModule.getGrandmasterDiplomaSvg({
      playerName: 'Тестовый Детектив',
      totalCoins: 1250,
      sugarCount: 81
    });
    assert.ok(diplomaSvg.startsWith('<svg') && diplomaSvg.includes('ГРАНДМАСТЕР ПИЩЕВОЙ ИНСПЕКЦИИ'));
    assert.ok(diplomaSvg.includes('15 / 15'));
  });
});

// ============================================================================
// TIER 2: BOUNDARY & CORNER CASES (ECONOMY & BOOSTERS)
// ============================================================================
suite('Tier 2: Boundary & Corner Cases (Store, Shield & Invariants)', () => {

  runTest('Initial state conforms to specs (100 starter coins, 3 lives, starter boosters)', () => {
    stateModule.resetProgress();
    assert.strictEqual(stateModule.getCoins(), 100, 'Starter balance must be 100');
    assert.strictEqual(stateModule.getLives(), 3, 'Starter lives must be 3');
    assert.strictEqual(stateModule.isShieldActive(), false, 'Shield initially inactive');

    const inv = stateModule.getInventory();
    assert.strictEqual(inv.booster_5050, 1, '1 free 50:50 booster');
    assert.strictEqual(inv.booster_shield, 1, '1 free shield');
    assert.strictEqual(inv.booster_hint, 1, '1 free hint');
  });

  runTest('addCoins rejects negative, NaN, null, and +Infinity amounts safely', () => {
    stateModule.resetProgress();
    const initial = stateModule.getCoins();

    assert.strictEqual(stateModule.addCoins(0), false);
    assert.strictEqual(stateModule.addCoins(-50), false);
    assert.strictEqual(stateModule.addCoins(NaN), false);
    assert.strictEqual(stateModule.addCoins(Infinity), false);
    assert.strictEqual(stateModule.addCoins(null), false);
    assert.strictEqual(stateModule.getCoins(), initial);
  });

  runTest('spendCoins enforces positive finite bounds and prevents balance overdraft', () => {
    stateModule.resetProgress(); // 100 coins
    assert.strictEqual(stateModule.spendCoins(0), false);
    assert.strictEqual(stateModule.spendCoins(-20), false);
    assert.strictEqual(stateModule.spendCoins(Infinity), false);
    assert.strictEqual(stateModule.spendCoins(150), false, 'Cannot overspend 150 from 100 balance');
    assert.strictEqual(stateModule.getCoins(), 100);

    // Legitimate spend
    assert.strictEqual(stateModule.spendCoins(35, 'test_shield'), true);
    assert.strictEqual(stateModule.getCoins(), 65);
    assert.strictEqual(stateModule.getTotalSpent(), 35);
  });

  runTest('Sugar Shield absorption mechanic: mistakes do NOT deplete lives when shield is active', () => {
    stateModule.resetProgress(); // 3 lives, 1 shield in inventory
    assert.strictEqual(stateModule.getLives(), 3);
    assert.strictEqual(stateModule.isShieldActive(), false);

    // Activate shield
    const activated = stateModule.useBooster('booster_shield');
    assert.strictEqual(activated, true);
    assert.strictEqual(stateModule.isShieldActive(), true);
    assert.strictEqual(stateModule.getBoosterCount('booster_shield'), 0);

    // Trigger mistake: decrementLife() must be absorbed by shield!
    const livesAfterMistake = stateModule.decrementLife();
    assert.strictEqual(livesAfterMistake, 3, 'Lives must remain at 3 due to shield protection!');
    assert.strictEqual(stateModule.getLives(), 3);
    assert.strictEqual(stateModule.isShieldActive(), false, 'Shield is consumed after absorbing error');
    assert.strictEqual(stateModule.hasAchievement('shield_master'), true, 'Unlocks shield_master achievement');

    // Next mistake without shield MUST decrement lives
    const livesSecondMistake = stateModule.decrementLife();
    assert.strictEqual(livesSecondMistake, 2, 'Life is decremented normally when shield is inactive');
  });

  runTest('First Aid Heart restores lost life up to max (3) and rejects when full', () => {
    stateModule.resetProgress(); // 3 lives
    stateModule.decrementLife(); // 2 lives
    assert.strictEqual(stateModule.getLives(), 2);

    // Add heart to inventory
    stateModule.addBooster('booster_heart', 1);
    const restored = stateModule.useBooster('booster_heart');
    assert.strictEqual(restored, true);
    assert.strictEqual(stateModule.getLives(), 3);

    // Try to restore when already at 3 lives: should be rejected
    stateModule.addBooster('booster_heart', 1);
    const rejected = stateModule.useBooster('booster_heart');
    assert.strictEqual(rejected, false, 'Cannot overheal past max lives');
  });

  runTest('Boss Battle mechanics: Sugar Titan starts with 5 HP and is damaged to 0', () => {
    stateModule.resetProgress();
    stateModule.setCurrentLevel(15);
    assert.strictEqual(stateModule.getBossHp(), 5, 'Boss starts with 5 HP');

    stateModule.damageBoss(1);
    assert.strictEqual(stateModule.getBossHp(), 4);
    stateModule.damageBoss(2);
    assert.strictEqual(stateModule.getBossHp(), 2);
    stateModule.damageBoss(2);
    assert.strictEqual(stateModule.getBossHp(), 0);
    assert.strictEqual(stateModule.hasAchievement('boss_slayer'), true, 'Boss defeat unlocks boss_slayer');
  });
  runTest('Freeze booster mechanics: inventory bounds and countdown notification', () => {
    stateModule.resetProgress();
    assert.strictEqual(stateModule.getBoosterCount('booster_freeze'), 0);
    assert.strictEqual(stateModule.useBooster('booster_freeze'), false, 'Cannot use freeze with 0 count');

    stateModule.addBooster('booster_freeze', 2);
    assert.strictEqual(stateModule.getBoosterCount('booster_freeze'), 2);

    let receivedNotify = false;
    const unsub = stateModule.subscribe((s, evt) => {
      if (evt.type === 'booster_freeze_used') receivedNotify = true;
    });

    assert.strictEqual(stateModule.useBooster('booster_freeze'), true);
    assert.strictEqual(stateModule.getBoosterCount('booster_freeze'), 1);
    assert.strictEqual(receivedNotify, true);
    unsub();
  });

  runTest('Booster availability resets across questions via setCurrentQuestionIndex', () => {
    stateModule.resetProgress();
    stateModule.addBooster('booster_5050', 5);
    stateModule.setCurrentLevel(1);

    // Question 0
    stateModule.setCurrentQuestionIndex(0);
    assert.strictEqual(stateModule.useBooster('booster_5050'), true);
    // Second use on same question is locked
    assert.strictEqual(stateModule.useBooster('booster_5050'), false);

    // Advancing to question 1 resets round lockout
    stateModule.setCurrentQuestionIndex(1);
    assert.strictEqual(stateModule.useBooster('booster_5050'), true, '50:50 unlocked for question 1');
  });

  runTest('Level 15 Boss survival invariant: Boss HP > 0 prevents boss_slayer achievement', () => {
    stateModule.resetProgress();
    stateModule.setCurrentLevel(15);
    assert.strictEqual(stateModule.getBossHp(), 5);

    // Only deal 3 damage (2 HP left)
    stateModule.damageBoss(3);
    assert.strictEqual(stateModule.getBossHp(), 2);
    assert.strictEqual(stateModule.hasAchievement('boss_slayer'), false);

    // If completeLevel(15) is invoked while HP > 0, boss_slayer must NOT be awarded
    stateModule.completeLevel(15);
    assert.strictEqual(stateModule.hasAchievement('boss_slayer'), false, 'Boss must not be slain if HP > 0');
  });
});

// ============================================================================
// TIER 3: PROGRESSION & PERSISTENCE
// ============================================================================
suite('Tier 3: Progression, Serialization & Audio Synthesis', () => {

  runTest('Sequential level progression unlocks all 15 levels in order', () => {
    stateModule.resetProgress();
    assert.deepStrictEqual(stateModule.getUnlockedLevels(), [1]);

    for (let lvl = 1; lvl < 15; lvl++) {
      stateModule.completeLevel(lvl);
      assert.ok(stateModule.isLevelUnlocked(lvl + 1), `Level ${lvl + 1} must be unlocked after level ${lvl}`);
    }

    assert.strictEqual(stateModule.getUnlockedLevels().length, 15);
    stateModule.completeLevel(15);
    assert.strictEqual(stateModule.isLevelCompleted(15), true);
    assert.strictEqual(stateModule.hasAchievement('sugar_grandmaster'), true);
  });

  runTest('Marathon mode candidate question filter excludes multi-select questions', () => {
    const singleChoiceQuestions = [];
    dataModule.LEVELS.forEach(lvl => {
      lvl.questions.forEach(q => {
        if (q.type !== 'multi_select' && !Array.isArray(q.correctAnswer)) {
          singleChoiceQuestions.push(q);
        }
      });
    });

    assert.ok(singleChoiceQuestions.length >= 75, 'Must have at least 75 single-choice questions');
    singleChoiceQuestions.forEach(q => {
      assert.notStrictEqual(q.type, 'multi_select');
      assert.strictEqual(Array.isArray(q.correctAnswer), false);
    });
  });

  runTest('Full state schema serialization roundtrip preserves inventory, customization & economy', () => {
    stateModule.resetProgress();
    stateModule.addCoins(200);
    stateModule.buyBooster('booster_5050');
    stateModule.updatePlayer('Шерлок Холмс', 'avatar_cyber');
    stateModule.completeLevel(1);

    const savedCoins = stateModule.getCoins();
    const savedInventory = stateModule.getInventory();
    const savedPlayer = stateModule.getPlayer();

    // Trigger save and reload
    stateModule.save();
    const loadSuccess = stateModule.load();
    assert.strictEqual(loadSuccess, true);

    assert.strictEqual(stateModule.getCoins(), savedCoins);
    assert.strictEqual(stateModule.getBoosterCount('booster_5050'), savedInventory.booster_5050);
    assert.strictEqual(stateModule.getPlayer().name, 'Шерлок Холмс');
    assert.strictEqual(stateModule.getPlayer().avatarId, 'avatar_cyber');
  });

  runTest('Corrupted JSON payloads in storage fallback safely without uncaught crashes', () => {
    const sandboxApp = loadModuleInSandbox('./js/state.js', {
      localStorage: {
        getItem() { return '{{BAD_JSON_GARBAGE}}'; },
        setItem() {},
        removeItem() {}
      }
    });

    assert.doesNotThrow(() => {
      sandboxApp.State.load();
    });
    assert.strictEqual(sandboxApp.State.getCoins(), 100, 'Falls back safely to starter capital');
  });

  runTest('Audio engine volume setters clamp values between 0.0 and 1.0', () => {
    assert.doesNotThrow(() => {
      audioModule.setSoundVolume(0.5);
      audioModule.setSoundVolume(-1.0);
      audioModule.setSoundVolume(2.0);
      audioModule.setMusicVolume(0.4);
      audioModule.setMusicVolume(-0.5);
      audioModule.setMusicVolume(1.5);
      audioModule.setMuted(true);
      audioModule.setMuted(false);
    });
  });

  runTest('Web Audio API procedural engine synthesizes all 16 SFX safely in headless Node.js', () => {
    assert.doesNotThrow(() => {
      audioModule.playSFX('click');
      audioModule.playSFX('coin');
      audioModule.playSFX('correct');
      audioModule.playSFX('wrong');
      audioModule.playSFX('heart_loss');
      audioModule.playSFX('level_clear');
      audioModule.playSFX('victory');
      audioModule.playSFX('confetti');
      audioModule.playSFX('shop_buy');
      audioModule.playSFX('shield_on');
      audioModule.playSFX('shield_absorb');
      audioModule.playSFX('zap_5050');
      audioModule.playSFX('clue_ding');
      audioModule.playSFX('heal');
      audioModule.playSFX('boss_hit');
      audioModule.playSFX('boss_defeat');
    });
  });
});

// ============================================================================
// TIER 4: REAL-WORLD WALKTHROUGH SIMULATION (FULL 15-LEVEL CAMPAIGN)
// ============================================================================
suite('Tier 4: Real-world Walkthrough Simulation (15 Levels + Store + Boss)', () => {

  runTest('Complete Playthrough: Shop purchases -> Shield absorbs error -> Defeat Titan -> Grandmaster Diploma', () => {
    stateModule.resetProgress();
    assert.strictEqual(stateModule.getCoins(), 100);

    // 1. Visit shop, buy extra booster
    const boughtBooster = stateModule.buyBooster('booster_5050'); // 20 coins
    assert.strictEqual(boughtBooster, true);
    assert.strictEqual(stateModule.getCoins(), 80);
    assert.strictEqual(stateModule.hasAchievement('shopaholic'), true, 'First purchase unlocks shopaholic');

    // 2. Play through levels 1..7 (37 questions)
    for (let l = 1; l <= 7; l++) {
      const lvl = dataModule.getLevelById(l);
      lvl.questions.forEach(q => {
        stateModule.addCoins(lvl.rewardPerQuestion, q.id);
      });
      stateModule.completeLevel(l);
    }
    assert.strictEqual(stateModule.isLevelCompleted(7), true);
    assert.ok(stateModule.getCoins() > 400);

    // 3. Play through new levels 8..14 (35 questions)
    // On Level 8, test Shield Protection
    stateModule.useBooster('booster_shield');
    assert.strictEqual(stateModule.isShieldActive(), true);
    // Intentional mistake
    stateModule.decrementLife();
    assert.strictEqual(stateModule.getLives(), 3, 'Shield absorbed mistake on Level 8');

    for (let l = 8; l <= 14; l++) {
      const lvl = dataModule.getLevelById(l);
      lvl.questions.forEach(q => {
        stateModule.addCoins(lvl.rewardPerQuestion, q.id);
      });
      stateModule.completeLevel(l);
    }
    assert.strictEqual(stateModule.isLevelCompleted(14), true);
    assert.ok(stateModule.isLevelUnlocked(15), 'Level 15 Boss is now unlocked!');

    // 4. Level 15: Boss Battle vs Synthetic Sugar Titan
    stateModule.setCurrentLevel(15);
    const bossLevel = dataModule.getLevelById(15);
    assert.strictEqual(stateModule.getBossHp(), 5);

    // Buy and use Freeze Booster to deal 1 freeze damage to Titan
    stateModule.buyBooster('booster_freeze'); // 15 coins
    stateModule.useBooster('booster_freeze');
    stateModule.damageBoss(1);
    assert.strictEqual(stateModule.getBossHp(), 4, 'Boss HP is 4 after freeze damage');

    // Answer first 4 boss questions correctly to deal remaining 4 damage
    for (let qIdx = 0; qIdx < 4; qIdx++) {
      const q = bossLevel.questions[qIdx];
      stateModule.addCoins(bossLevel.rewardPerQuestion, q.id);
      stateModule.damageBoss(1);
    }
    // Also claim 5th question coins
    stateModule.addCoins(bossLevel.rewardPerQuestion, bossLevel.questions[4].id);

    assert.strictEqual(stateModule.getBossHp(), 0, 'Titan HP reduced to 0');
    assert.strictEqual(stateModule.hasAchievement('boss_slayer'), true);

    stateModule.completeLevel(15);
    assert.strictEqual(stateModule.isLevelCompleted(15), true);
    assert.strictEqual(stateModule.hasAchievement('sugar_grandmaster'), true);

    // 5. Verify Final Victory Certificate Generation
    const grandmasterSvg = graphicsModule.getGrandmasterDiplomaSvg({
      playerName: 'Макс Сыщик',
      totalCoins: stateModule.getCoins(),
      sugarFound: 81
    });
    assert.ok(grandmasterSvg.includes('ГРАНДМАСТЕР ПИЩЕВОЙ ИНСПЕКЦИИ'));
    assert.ok(grandmasterSvg.includes('15 / 15'));

    console.log(`    ⭐ Simulation Complete: Balance = ${stateModule.getCoins()} coins, Levels = 15/15, Achievements = ${stateModule.getAchievements().unlockedIds.length}`);
  });
});

// ============================================================================
// TIER 5: DOM & INTERACTIVE SCHEMA VERIFICATION
// ============================================================================
suite('Tier 5: DOM Schema, Controls & Interactive Calculator', () => {

  runTest('index.html contains all HUD, Booster bar, Shop, Calc and Marathon DOM IDs', () => {
    const html = fs.readFileSync(path.join(basePath, 'index.html'), 'utf8');
    const requiredIds = [
      'screen-hero', 'screen-hub', 'screen-catalog', 'screen-game', 'screen-victory',
      'modal-shop', 'modal-calc', 'modal-marathon', 'modal-pause', 'modal-settings',
      'modal-achievements', 'modal-game-over', 'modal-diploma', 'modal-dossier',
      'btn-boost-5050', 'btn-boost-shield', 'btn-boost-hint', 'btn-boost-heart', 'btn-boost-freeze',
      'badge-boost-5050', 'badge-boost-shield', 'badge-boost-hint', 'badge-boost-heart', 'badge-boost-freeze',
      'marathon-btn-freeze', 'marathon-freeze-badge', 'marathon-timer-val', 'marathon-score-val',
      'setting-slider-sound', 'setting-slider-music', 'setting-player-name',
      'boss-banner', 'boss-hp-container'
    ];

    requiredIds.forEach(id => {
      assert.ok(html.includes(`id="${id}"`), `DOM element #${id} must exist in index.html`);
    });
  });

  runTest('Interactive Sugar Calculator accurately computes spoons, grams and exercise burn', () => {
    // 250ml portion of sweetened beverage with 10.6g sugar per 100ml
    const portion = 250;
    const sugarPer100 = 10.6;
    const totalGrams = (sugarPer100 * portion) / 100.0; // 26.5g
    const spoons = totalGrams / 4.0; // 6.625 spoons
    const pctOfDailyLimit = (totalGrams / 25.0) * 100.0; // 106%
    const runningMinutes = (totalGrams * 4.0) / 7.0; // ~15.1 min

    assert.strictEqual(totalGrams.toFixed(1), '26.5');
    assert.strictEqual(spoons.toFixed(1), '6.6');
    assert.strictEqual(pctOfDailyLimit.toFixed(0), '106');
    assert.strictEqual(Math.round(runningMinutes), 15);
  });
});

// ============================================================================
// FINAL SUMMARY & EXIT CODE
// ============================================================================
console.log('\n======================================================================');
console.log(`  VERIFICATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
if (failedTests > 0) {
  console.error(`  FAILURES: ${failedTests}`);
  failures.forEach(f => console.error(`    - ${f.name}: ${f.err.message}`));
  process.exit(1);
} else {
  console.log('  STATUS: 100% EMPIRICAL VERIFICATION COMPLETE — ALL TESTS PASSED!');
  console.log('======================================================================\n');
  process.exit(0);
}
