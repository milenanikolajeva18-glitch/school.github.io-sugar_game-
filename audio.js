/**
 * Hidden Sugar Detective: PRO Edition — Pure Procedural Web Audio API Engine
 * Pure vanilla JavaScript module. Zero external media files, zero external dependencies.
 * Synthesizes 16 procedural SFX and a 124 BPM 8-bit chiptune BGM loop with low-pass filtering.
 * Mounts on window.SugarApp.Audio and exports via CommonJS for Node.js testing.
 */
(function(global) {
  'use strict';

  var SugarApp = global.SugarApp = global.SugarApp || {};

  var audioCtx = null;
  var masterGain = null;
  var bgmGain = null;
  var sfxGain = null;
  var bgmFilter = null;

  var isMuted = false;
  var musicVolume = 0.6;
  var soundVolume = 0.8;
  var isMusicPlaying = false;

  var bpm = 124;
  var secondsPer16th = (60.0 / bpm) / 4.0;
  var nextNoteTime = 0.0;
  var currentStep = 0;
  var timerId = null;
  var lookahead = 0.1;
  var scheduleInterval = 25;

  var NOTE = {
    REST: 0,
    C2: 65.41,
    G2: 98.00,
    A2: 110.00,
    C3: 130.81,
    E3: 164.81,
    F3: 174.61,
    G3: 196.00,
    A3: 220.00,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    G4: 392.00,
    A4: 440.00,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    G5: 783.99,
    A5: 880.00,
    C6: 1046.50
  };

  var MELODY_PATTERN = [
    NOTE.C5, NOTE.REST, NOTE.E5, NOTE.G5, NOTE.A5, NOTE.REST, NOTE.G5, NOTE.E5,
    NOTE.D5, NOTE.E5,   NOTE.D5, NOTE.C5, NOTE.A4, NOTE.C5,   NOTE.D5, NOTE.REST,
    NOTE.E5, NOTE.G5,   NOTE.A5, NOTE.C6, NOTE.A5, NOTE.G5,   NOTE.E5, NOTE.D5,
    NOTE.C5, NOTE.D5,   NOTE.E5, NOTE.D5, NOTE.C5, NOTE.REST, NOTE.C5, NOTE.REST
  ];

  var BASS_PATTERN = [
    NOTE.C3, NOTE.REST, NOTE.C3, NOTE.REST, NOTE.G2, NOTE.REST, NOTE.G2, NOTE.REST,
    NOTE.A2, NOTE.REST, NOTE.A2, NOTE.REST, NOTE.F2, NOTE.REST, NOTE.G2, NOTE.REST,
    NOTE.C3, NOTE.REST, NOTE.C3, NOTE.REST, NOTE.E3, NOTE.REST, NOTE.G2, NOTE.REST,
    NOTE.A2, NOTE.REST, NOTE.F2, NOTE.REST, NOTE.G2, NOTE.REST, NOTE.C3, NOTE.REST
  ];

  var DRUM_PATTERN = [
    2, 0, 1, 0,  2, 0, 1, 0,  2, 0, 1, 0,  2, 1, 1, 0,
    2, 0, 1, 0,  2, 0, 1, 0,  2, 0, 1, 0,  2, 1, 2, 1
  ];

  function initAudioContext() {
    if (audioCtx) return audioCtx;
    var AudioContextClass = global.AudioContext || global.webkitAudioContext;
    if (!AudioContextClass) return null;

    try {
      audioCtx = new AudioContextClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1.0, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      sfxGain = audioCtx.createGain();
      sfxGain.gain.setValueAtTime(soundVolume, audioCtx.currentTime);
      sfxGain.connect(masterGain);

      bgmFilter = audioCtx.createBiquadFilter();
      bgmFilter.type = 'lowpass';
      bgmFilter.frequency.setValueAtTime(3200, audioCtx.currentTime);
      bgmFilter.connect(masterGain);

      bgmGain = audioCtx.createGain();
      bgmGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);
      bgmGain.connect(bgmFilter);

      return audioCtx;
    } catch (e) {
      console.warn('AudioContext creation failed:', e);
      return null;
    }
  }

  function getAudioContext() {
    return initAudioContext();
  }

  var noiseBufferCache = null;
  function getNoiseBuffer(ctx) {
    if (noiseBufferCache && noiseBufferCache.sampleRate === ctx.sampleRate) {
      return noiseBufferCache;
    }
    var bufferSize = ctx.sampleRate * 1;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var output = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noiseBufferCache = buffer;
    return buffer;
  }

  function scheduleNote(step, time) {
    if (!audioCtx || !bgmGain) return;

    var melFreq = MELODY_PATTERN[step % MELODY_PATTERN.length];
    if (melFreq > 0) {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(melFreq, time);

      var noteDuration = secondsPer16th * 0.85;
      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + noteDuration);

      osc.connect(gain);
      gain.connect(bgmGain);
      osc.start(time);
      osc.stop(time + noteDuration);
    }

    var bassFreq = BASS_PATTERN[step % BASS_PATTERN.length];
    if (bassFreq > 0) {
      var bassOsc = audioCtx.createOscillator();
      var bassGain = audioCtx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq, time);

      var bassDur = secondsPer16th * 0.9;
      bassGain.gain.setValueAtTime(0.18, time);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + bassDur);

      bassOsc.connect(bassGain);
      bassGain.connect(bgmGain);
      bassOsc.start(time);
      bassOsc.stop(time + bassDur);
    }

    var drumType = DRUM_PATTERN[step % DRUM_PATTERN.length];
    if (drumType > 0) {
      var noiseBuffer = getNoiseBuffer(audioCtx);
      var noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      var filter = audioCtx.createBiquadFilter();
      filter.type = drumType === 2 ? 'bandpass' : 'highpass';
      filter.frequency.setValueAtTime(drumType === 2 ? 1800 : 4500, time);

      var noiseGain = audioCtx.createGain();
      var noiseDur = drumType === 2 ? 0.05 : 0.025;
      var vol = drumType === 2 ? 0.06 : 0.03;

      noiseGain.gain.setValueAtTime(vol, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + noiseDur);

      noiseSource.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(bgmGain);

      noiseSource.start(time);
      noiseSource.stop(time + noiseDur);
    }
  }

  function bgmScheduler() {
    if (!audioCtx || !isMusicPlaying) return;
    while (nextNoteTime < audioCtx.currentTime + lookahead) {
      scheduleNote(currentStep, nextNoteTime);
      nextNoteTime += secondsPer16th;
      currentStep = (currentStep + 1) % 32;
    }
  }

  function startMusic() {
    var ctx = initAudioContext();
    if (!ctx || isMusicPlaying) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(function(){});
    }

    isMusicPlaying = true;
    currentStep = 0;
    nextNoteTime = ctx.currentTime + 0.05;

    if (timerId) clearInterval(timerId);
    timerId = setInterval(bgmScheduler, scheduleInterval);
  }

  function stopMusic() {
    isMusicPlaying = false;
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // =========================================================================
  // 16 PROCEDURAL SOUND EFFECTS (SFX)
  // =========================================================================

  function playSFX(name) {
    var ctx = initAudioContext();
    if (!ctx || isMuted || soundVolume <= 0) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(function(){});
    }

    var now = ctx.currentTime;

    switch (name) {
      case 'click':
        playClick(ctx, now);
        break;
      case 'coin':
        playCoin(ctx, now);
        break;
      case 'correct':
        playCorrect(ctx, now);
        break;
      case 'wrong':
        playWrong(ctx, now);
        break;
      case 'heart_loss':
        playHeartLoss(ctx, now);
        break;
      case 'level_clear':
        playLevelClear(ctx, now);
        break;
      case 'victory':
        playVictory(ctx, now);
        break;
      case 'confetti':
        playConfetti(ctx, now);
        break;
      case 'shop_buy':
        playShopBuy(ctx, now);
        break;
      case 'shield_on':
        playShieldOn(ctx, now);
        break;
      case 'shield_absorb':
        playShieldAbsorb(ctx, now);
        break;
      case 'zap_5050':
        playZap5050(ctx, now);
        break;
      case 'clue_ding':
        playClueDing(ctx, now);
        break;
      case 'heal':
        playHeal(ctx, now);
        break;
      case 'boss_hit':
        playBossHit(ctx, now);
        break;
      case 'boss_defeat':
        playBossDefeat(ctx, now);
        break;
      default:
        playClick(ctx, now);
        break;
    }
  }

  function playClick(ctx, t) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  function playCoin(ctx, t) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t);
    osc.frequency.setValueAtTime(1318.51, t + 0.07);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  function playCorrect(ctx, t) {
    [523.25, 659.25, 783.99, 1046.50].forEach(function(freq, idx) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var st = t + (idx * 0.07);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);
      gain.gain.setValueAtTime(0.22, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.22);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(st);
      osc.stop(st + 0.22);
    });
  }

  function playWrong(ctx, t) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(90, t + 0.28);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.28);
  }

  function playHeartLoss(ctx, t) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.35);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  function playLevelClear(ctx, t) {
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach(function(f, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var st = t + (i * 0.09);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(st);
      osc.stop(st + 0.35);
    });
  }

  function playVictory(ctx, t) {
    var chord = [523.25, 659.25, 783.99, 1046.50];
    chord.forEach(function(f) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  function playConfetti(ctx, t) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.08);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // --- NEW ENHANCED SFX ---

  function playShopBuy(ctx, t) {
    // Rich shop purchase chime: C5 -> G5 -> C6 arpeggio
    [523.25, 783.99, 1046.50].forEach(function(f, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var st = t + (i * 0.06);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.2, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.25);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(st);
      osc.stop(st + 0.25);
    });
  }

  function playShieldOn(ctx, t) {
    // Sci-fi shield hum and rising power tone
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.3);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.35);
  }

  function playShieldAbsorb(ctx, t) {
    // Metallic force-field ricochet
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.15);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  function playZap5050(ctx, t) {
    // Quick laser zap
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.12);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  function playClueDing(ctx, t) {
    // Magic laboratory bell
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, t); // A6
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  function playHeal(ctx, t) {
    // Warm healing harmonic
    [440, 554.37, 659.25, 880].forEach(function(f, idx) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var st = t + (idx * 0.05);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.18, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.3);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(st);
      osc.stop(st + 0.3);
    });
  }

  function playBossHit(ctx, t) {
    // Heavy bass impact
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  function playBossDefeat(ctx, t) {
    // Grand boss explosion & fanfare
    [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach(function(f, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var st = t + (i * 0.08);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.25, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.6);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(st);
      osc.stop(st + 0.6);
    });
  }

  // =========================================================================
  // VOLUME & MUTE CONTROLS
  // =========================================================================

  function setMuted(muted) {
    isMuted = Boolean(muted);
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1.0, audioCtx.currentTime);
    }
  }

  function setMusicVolume(vol) {
    musicVolume = Math.max(0, Math.min(1.0, Number(vol) || 0));
    if (bgmGain && audioCtx) {
      bgmGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);
    }
  }

  function setSoundVolume(vol) {
    soundVolume = Math.max(0, Math.min(1.0, Number(vol) || 0));
    if (sfxGain && audioCtx) {
      sfxGain.gain.setValueAtTime(soundVolume, audioCtx.currentTime);
    }
  }

  SugarApp.Audio = {
    init: initAudioContext,
    startMusic: startMusic,
    stopMusic: stopMusic,
    isMusicPlaying: function() { return isMusicPlaying; },
    playSFX: playSFX,
    setMuted: setMuted,
    setMusicVolume: setMusicVolume,
    setSoundVolume: setSoundVolume,
    getAudioContext: getAudioContext
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SugarApp.Audio;
  }
})(typeof window !== 'undefined' ? window : global);
