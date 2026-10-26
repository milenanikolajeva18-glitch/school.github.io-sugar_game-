/**
 * Hidden Sugar Detective — Canvas 2D Procedural Confetti Engine
 * Pure vanilla JavaScript module. Zero external dependencies.
 * Mounts on window.SugarApp.Confetti and exports via CommonJS for testing.
 */
(function(global) {
  'use strict';

  var SugarApp = global.SugarApp = global.SugarApp || {};

  var canvas = null;
  var ctx = null;
  var animationFrameId = null;
  var isRunning = false;
  var particles = [];

  var COLORS = [
    '#F59E0B', '#FDE047', '#38BDF8', '#2563EB',
    '#10B981', '#34D399', '#EC4899', '#A855F7',
    '#F43F5E', '#06B6D4', '#FB923C'
  ];

  function getCanvas() {
    if (canvas && ctx) {
      return canvas;
    }
    if (typeof document === 'undefined') {
      return null;
    }
    canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.className = 'victory-canvas-confetti';
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '50';
      var container = document.querySelector('.stage-container') || document.body;
      container.appendChild(canvas);
    }
    ctx = canvas.getContext('2d');
    resize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resize);
    }
    return canvas;
  }

  function resize() {
    if (!canvas) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    var w = rect.width || (canvas.parentElement ? canvas.parentElement.clientWidth : 960);
    var h = rect.height || (canvas.parentElement ? canvas.parentElement.clientHeight : 540);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  function createParticle(x, y, isBurst) {
    var rect = canvas ? canvas.getBoundingClientRect() : { width: 960, height: 540 };
    var startX = x !== undefined ? x : Math.random() * rect.width;
    var startY = y !== undefined ? y : -20;

    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var size = Math.random() * 8 + 6;

    var vx, vy;
    if (isBurst) {
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 12 + 4;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed - 4;
    } else {
      vx = (Math.random() - 0.5) * 4;
      vy = Math.random() * 3 + 2.5;
    }

    return {
      x: startX,
      y: startY,
      vx: vx,
      vy: vy,
      size: size,
      color: color,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.random() * 0.1 + 0.05,
      opacity: 1,
      fadeRate: isBurst ? (Math.random() * 0.015 + 0.008) : 0,
      shape: Math.random() > 0.3 ? 'rect' : 'circle'
    };
  }

  function loop() {
    if (!ctx || !canvas) return;
    var rect = canvas.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;

    ctx.clearRect(0, 0, width, height);

    if (isRunning && particles.length < 120) {
      for (var s = 0; s < 3; s++) {
        particles.push(createParticle(Math.random() * width, -10, false));
      }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;

      if (p.fadeRate > 0) {
        p.opacity -= p.fadeRate;
      }

      if (p.opacity <= 0 || p.y > height + 40 || p.x < -40 || p.x > width + 40) {
        if (isRunning && p.fadeRate === 0) {
          p.x = Math.random() * width;
          p.y = -15;
          p.vy = Math.random() * 3 + 2.5;
          p.vx = (Math.random() - 0.5) * 4;
          p.opacity = 1;
        } else {
          particles.splice(i, 1);
          continue;
        }
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      var scaleX = Math.cos(p.wobble);
      ctx.scale(scaleX, 1);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (isRunning || particles.length > 0) {
      if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        animationFrameId = window.requestAnimationFrame(loop);
      }
    } else {
      if (animationFrameId && typeof window !== 'undefined') {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  function start() {
    getCanvas();
    resize();
    isRunning = true;
    if (!animationFrameId && typeof window !== 'undefined' && window.requestAnimationFrame) {
      animationFrameId = window.requestAnimationFrame(loop);
    }
  }

  function stop() {
    isRunning = false;
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].fadeRate === 0) {
        particles[i].fadeRate = 0.03;
      }
    }
  }

  function burst(x, y, count) {
    getCanvas();
    resize();
    var rect = canvas.getBoundingClientRect();
    var posX = x !== undefined ? x : rect.width / 2;
    var posY = y !== undefined ? y : rect.height / 2;
    var total = count || 60;

    for (var i = 0; i < total; i++) {
      particles.push(createParticle(posX, posY, true));
    }

    if (!animationFrameId && typeof window !== 'undefined' && window.requestAnimationFrame) {
      animationFrameId = window.requestAnimationFrame(loop);
    }
  }

  var Confetti = {
    start: start,
    stop: stop,
    burst: burst,
    reset: function() {
      stop();
      particles = [];
      if (ctx && canvas) {
        var rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    },
    isRunning: function() {
      return isRunning;
    }
  };

  SugarApp.Confetti = Confetti;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Confetti;
  }
})(typeof window !== 'undefined' ? window : global);
