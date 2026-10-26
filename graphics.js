/**
 * SugarApp.Graphics — High-Fidelity SVG Vector Graphics Engine
 * 
 * Contains:
 * - 40+ High-definition vector illustrations of food products across all 7 levels
 * - UI Vector Icons (hearts, coins, stars, trophy, audio, pause, gear, check, cross, etc.)
 * - Detective Avatars (Boy, Girl, Cyber, Classic Sherlock)
 * - Detective Diploma / Certificate Vector Template
 * - Responsive SVG wrapper & alias resolution engine
 * 
 * Fully standalone: zero external dependencies, 100% vector SVG.
 */

(function(root) {
  'use strict';

  var SugarApp = root.SugarApp || (root.SugarApp = {});
  var Graphics = {};

  // ==========================================
  // 1. HELPER UTILITIES
  // ==========================================

  var svgUid = 0;
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function scopeSvgIds(svgContent) {
    if (!svgContent || typeof svgContent !== 'string') return svgContent;
    var prefix = 'sugarsvg_' + (++svgUid) + '_';
    var idRegex = /\bid=["']([^"']+)["']/g;
    var match;
    var ids = [];
    while ((match = idRegex.exec(svgContent)) !== null) {
      if (ids.indexOf(match[1]) === -1) {
        ids.push(match[1]);
      }
    }
    if (ids.length === 0) return svgContent;

    var res = svgContent;
    for (var i = 0; i < ids.length; i++) {
      var oldId = ids[i];
      var newId = prefix + oldId;
      var escaped = escapeRegex(oldId);
      res = res.replace(new RegExp('\\bid=(["\'])' + escaped + '\\1', 'g'), 'id="' + newId + '"');
      res = res.replace(new RegExp('url\\((["\']?)#' + escaped + '\\1\\)', 'g'), 'url(#' + newId + ')');
      res = res.replace(new RegExp('href=(["\'])#' + escaped + '\\1', 'g'), 'href="#' + newId + '"');
    }
    return res;
  }

  function wrapSvg(viewBox, width, height, content, extraClass) {
    var scopedContent = scopeSvgIds(content);
    var cls = extraClass ? ' class="' + extraClass + '"' : '';
    var w = width ? ' width="' + width + '"' : '';
    var h = height ? ' height="' + height + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '"' + w + h + cls + ' role="img">' + scopedContent + '</svg>';
  }

  // Common SVG filters and reusable defs
  var COMMON_DEFS = 
    '<defs>' +
      '<filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feGaussianBlur stdDeviation="3" result="blur" />' +
        '<feComposite in="SourceGraphic" in2="blur" operator="over" />' +
      '</filter>' +
      '<linearGradient id="metal-silver" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#E2E8F0" />' +
        '<stop offset="50%" stop-color="#94A3B8" />' +
        '<stop offset="100%" stop-color="#CBD5E1" />' +
      '</linearGradient>' +
    '</defs>';

  // ==========================================
  // 2. PRODUCT VECTOR CATALOG (160x160)
  // ==========================================

  var PRODUCTS = {};
  // --- ENHANCED PRODUCTS ---
  PRODUCTS['sugar_titan'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="150" rx="54" ry="10" fill="#000" opacity="0.4" />' +
      '<polygon points="80,24 115,55 125,95 105,142 55,142 35,95 45,55" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="3" />' +
      '<polygon points="80,24 60,65 80,85 100,65" fill="#6D28D9" opacity="0.8" />' +
      '<polygon points="60,65 35,95 55,115 80,85" fill="#4C1D95" opacity="0.7" />' +
      '<polygon points="100,65 125,95 105,115 80,85" fill="#5B21B6" opacity="0.7" />' +
      '<polygon points="55,115 80,85 105,115 80,140" fill="#7C3AED" opacity="0.9" />' +
      '<ellipse cx="66" cy="56" rx="7" ry="4" fill="#FDE047" filter="url(#glow-gold)" />' +
      '<ellipse cx="94" cy="56" rx="7" ry="4" fill="#FDE047" filter="url(#glow-gold)" />' +
      '<line x1="62" y1="56" x2="70" y2="56" stroke="#EF4444" stroke-width="1.5" />' +
      '<line x1="90" y1="56" x2="98" y2="56" stroke="#EF4444" stroke-width="1.5" />' +
      '<polygon points="80,12 85,26 75,26" fill="#A78BFA" />' +
      '<polygon points="58,18 68,32 54,32" fill="#C4B5FD" />' +
      '<polygon points="102,18 106,32 92,32" fill="#C4B5FD" />' +
      '<polygon points="36,36 48,46 36,52" fill="#8B5CF6" />' +
      '<polygon points="124,36 124,52 112,46" fill="#8B5CF6" />' +
      '<circle cx="80" cy="102" r="14" fill="#F59E0B" stroke="#FDE047" stroke-width="2" filter="url(#glow-gold)" />' +
      '<text x="80" y="106" font-family="Consolas, monospace" font-size="10" font-weight="bold" fill="#0F172A" text-anchor="middle">C12</text>' +
    '</g>';

  PRODUCTS['sauces_variety'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="50" ry="8" fill="#000" opacity="0.25" />' +
      '<rect x="40" y="60" width="28" height="75" rx="8" fill="#FEF08A" stroke="#CA8A04" stroke-width="2" />' +
      '<rect x="44" y="80" width="20" height="35" fill="#FFF" rx="3" />' +
      '<rect x="66" y="45" width="34" height="95" rx="10" fill="#DC2626" stroke="#991B1B" stroke-width="2" />' +
      '<rect x="72" y="75" width="22" height="45" fill="#FEF2F2" rx="4" />' +
      '<circle cx="83" cy="95" r="7" fill="#EF4444" />' +
      '<rect x="78" y="32" width="10" height="15" fill="#FFF" rx="2" />' +
      '<rect x="98" y="65" width="26" height="70" rx="6" fill="#1E293B" stroke="#475569" stroke-width="2" />' +
      '<rect x="104" y="48" width="14" height="18" fill="#DC2626" rx="2" />' +
    '</g>';

  PRODUCTS['bbq_sauces_set'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="8" fill="#000" opacity="0.3" />' +
      '<rect x="54" y="46" width="52" height="94" rx="12" fill="#450A0A" stroke="#7F1D1D" stroke-width="2.5" />' +
      '<rect x="66" y="25" width="28" height="22" fill="#1E293B" rx="3" />' +
      '<rect x="60" y="72" width="40" height="52" rx="6" fill="#FEF3C7" />' +
      '<text x="80" y="92" font-family="Impact, sans-serif" font-size="14" fill="#991B1B" text-anchor="middle">BBQ</text>' +
      '<path d="M74 112 C72 104 80 100 80 96 C82 100 88 104 86 112 Z" fill="#EA580C" />' +
    '</g>';

  PRODUCTS['spicy_sauces_set'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="36" ry="7" fill="#000" opacity="0.3" />' +
      '<path d="M66 40 L94 40 L96 80 L92 142 L68 142 L64 80 Z" fill="#EF4444" stroke="#B91C1C" stroke-width="2" />' +
      '<rect x="72" y="22" width="16" height="18" fill="#15803D" rx="3" />' +
      '<rect x="68" y="70" width="24" height="44" fill="#FFF" rx="4" />' +
      '<path d="M74 95 Q80 105 86 92" stroke="#DC2626" stroke-width="3" fill="none" stroke-linecap="round" />' +
    '</g>';

  PRODUCTS['asian_sauces_set'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.25" />' +
      '<rect x="60" y="45" width="40" height="95" rx="8" fill="#0F172A" stroke="#E11D48" stroke-width="2" />' +
      '<rect x="70" y="24" width="20" height="22" fill="#E11D48" rx="3" />' +
      '<rect x="66" y="70" width="28" height="50" fill="#FFF" rx="4" />' +
      '<text x="80" y="94" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold" fill="#E11D48" text-anchor="middle">醤</text>' +
      '<line x1="45" y1="30" x2="115" y2="140" stroke="#D97706" stroke-width="3" stroke-linecap="round" />' +
      '<line x1="55" y1="25" x2="125" y2="135" stroke="#B45309" stroke-width="3" stroke-linecap="round" />' +
    '</g>';


  // --- LEVEL 1: DRINKS ---

  // L1.1: Soda Bottle / Cola Can (0.5L)
  PRODUCTS['soda_bottle'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      // Shadow under bottle
      '<ellipse cx="80" cy="148" rx="36" ry="7" fill="#000" opacity="0.3" />' +
      // Bottle Body (deep red transparent cola bottle)
      '<path d="M68 28 L92 28 L94 45 C98 55 106 68 106 82 L106 134 C106 142 100 146 92 146 L68 146 C60 146 54 142 54 134 L54 82 C54 68 62 55 66 45 Z" fill="url(#soda-liquid-grad)" />' +
      '<defs>' +
        '<linearGradient id="soda-liquid-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#7F1D1D" />' +
          '<stop offset="25%" stop-color="#DC2626" />' +
          '<stop offset="70%" stop-color="#991B1B" />' +
          '<stop offset="100%" stop-color="#450A0A" />' +
        '</linearGradient>' +
        '<linearGradient id="label-red-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#EF4444" />' +
          '<stop offset="50%" stop-color="#B91C1C" />' +
          '<stop offset="100%" stop-color="#991B1B" />' +
        '</linearGradient>' +
      '</defs>' +
      // Cola Label
      '<rect x="54" y="82" width="52" height="38" rx="3" fill="url(#label-red-grad)" />' +
      '<path d="M54 94 Q80 84 106 94 Q80 104 54 94 Z" fill="#FFF" opacity="0.9" />' +
      '<text x="80" y="106" font-family="Segoe UI, sans-serif" font-weight="900" font-size="11" fill="#FFF" text-anchor="middle" letter-spacing="1">COLA</text>' +
      '<text x="80" y="116" font-family="Consolas, monospace" font-weight="bold" font-size="6.5" fill="#FEF08A" text-anchor="middle">0.5 Л • ORIGINAL</text>' +
      // Bubbles
      '<circle cx="68" cy="72" r="2.5" fill="#FFF" opacity="0.6" />' +
      '<circle cx="88" cy="65" r="1.8" fill="#FFF" opacity="0.6" />' +
      '<circle cx="75" cy="55" r="1.5" fill="#FFF" opacity="0.5" />' +
      '<circle cx="92" cy="128" r="2" fill="#FFF" opacity="0.5" />' +
      '<circle cx="64" cy="132" r="1.8" fill="#FFF" opacity="0.5" />' +
      // Highlights & Glass Reflection
      '<path d="M60 52 C58 60 57 72 57 82 L57 134" stroke="#FFF" stroke-width="3" stroke-linecap="round" opacity="0.4" fill="none" />' +
      '<path d="M64 54 C63 60 62 70 62 80" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.3" fill="none" />' +
      // Neck and Cap
      '<rect x="71" y="24" width="18" height="6" rx="2" fill="#E2E8F0" />' +
      '<rect x="70" y="16" width="20" height="9" rx="3" fill="#DC2626" />' +
      '<path d="M70 20 L90 20" stroke="#991B1B" stroke-width="1" />' +

    '</g>';

  // L1.2: Cherry Juice (1L Tetra Pak)
  PRODUCTS['cherry_juice'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.3" />' +
      // Tetra Pak Box 3D
      // Front face
      '<defs>' +
        '<linearGradient id="juice-front-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#9F1239" />' +
          '<stop offset="50%" stop-color="#BE123C" />' +
          '<stop offset="100%" stop-color="#881337" />' +
        '</linearGradient>' +
        '<linearGradient id="juice-top-grad" x1="0%" y1="100%" x2="0%" y2="0%">' +
          '<stop offset="0%" stop-color="#FDA4AF" />' +
          '<stop offset="100%" stop-color="#FFF1F2" />' +
        '</linearGradient>' +
      '</defs>' +
      // Top sloped flap
      '<polygon points="46,46 114,46 102,28 58,28" fill="url(#juice-top-grad)" />' +
      // Main box
      '<rect x="46" y="46" width="68" height="98" rx="4" fill="url(#juice-front-grad)" />' +
      // White top cap on slope
      '<ellipse cx="80" cy="36" rx="9" ry="6" fill="#FFF" stroke="#E2E8F0" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="34" rx="6" ry="3.5" fill="#E2E8F0" />' +
      // Cherries illustration on pack
      '<circle cx="70" cy="100" r="14" fill="#881337" stroke="#4C0519" stroke-width="1.5" />' +
      '<circle cx="73" cy="98" r="13" fill="#BE123C" />' +
      '<ellipse cx="66" cy="94" rx="4" ry="2" fill="#FDA4AF" opacity="0.8" transform="rotate(-30 66 94)" />' +
      '<circle cx="90" cy="104" r="14" fill="#881337" stroke="#4C0519" stroke-width="1.5" />' +
      '<circle cx="92" cy="102" r="13" fill="#E11D48" />' +
      '<ellipse cx="86" cy="98" rx="4" ry="2" fill="#FDA4AF" opacity="0.8" transform="rotate(-30 86 98)" />' +
      // Cherry stems & leaf
      '<path d="M72 88 Q78 72 84 66" stroke="#15803D" stroke-width="2.5" fill="none" stroke-linecap="round" />' +
      '<path d="M92 90 Q88 74 84 66" stroke="#15803D" stroke-width="2.5" fill="none" stroke-linecap="round" />' +
      '<path d="M84 66 C88 60 98 62 100 66 C98 74 88 72 84 66 Z" fill="#22C55E" />' +
      // Labels
      '<rect x="52" y="52" width="56" height="15" rx="3" fill="#FFF" opacity="0.95" />' +
      '<text x="80" y="63" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#881337" text-anchor="middle">ВИШНЯ 100%</text>' +
      '<rect x="52" y="124" width="56" height="14" rx="2" fill="#4C0519" />' +
      '<text x="80" y="134" font-family="Consolas, monospace" font-weight="bold" font-size="7.5" fill="#FDE047" text-anchor="middle">1 ЛИТР • 100% СОК</text>' +
      // Side highlight
      '<line x1="50" y1="50" x2="50" y2="140" stroke="#FFF" stroke-width="2" opacity="0.4" />' +

    '</g>';

  // L1.3: Iced Tea (0.5L)
  PRODUCTS['iced_tea'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      // Amber Tea Bottle
      '<defs>' +
        '<linearGradient id="tea-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#92400E" />' +
          '<stop offset="30%" stop-color="#D97706" />' +
          '<stop offset="70%" stop-color="#B45309" />' +
          '<stop offset="100%" stop-color="#78350F" />' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M68 32 L92 32 L95 48 C99 58 105 70 105 84 L105 136 C105 143 99 146 91 146 L69 146 C61 146 55 143 55 136 L55 84 C55 70 61 58 65 48 Z" fill="url(#tea-grad)" />' +
      // Label
      '<rect x="55" y="80" width="50" height="38" rx="2" fill="#F59E0B" />' +
      '<rect x="55" y="84" width="50" height="30" fill="#FEF3C7" />' +
      '<text x="80" y="96" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#92400E" text-anchor="middle">ICED TEA</text>' +
      '<text x="80" y="106" font-family="Consolas, monospace" font-weight="bold" font-size="7" fill="#B45309" text-anchor="middle">ЛИМОН • 0.5Л</text>' +
      // Lemon slice on label
      '<circle cx="80" cy="126" r="12" fill="#FBBF24" stroke="#FFF" stroke-width="1.5" />' +
      '<circle cx="80" cy="126" r="10" fill="#FDE047" stroke="#F59E0B" stroke-dasharray="2,2" stroke-width="1" />' +
      '<path d="M80 116 L80 136 M70 126 L90 126 M73 119 L87 133 M73 133 L87 119" stroke="#FFF" stroke-width="1" />' +
      // Tea Leaf
      '<path d="M86 64 C94 56 100 62 98 68 C94 74 86 70 86 64 Z" fill="#16A34A" />' +
      // Cap
      '<rect x="70" y="22" width="20" height="10" rx="3" fill="#F59E0B" />' +
      '<line x1="70" y1="26" x2="90" y2="26" stroke="#B45309" stroke-width="1" />' +
      // Glass sheen
      '<path d="M60 55 L60 140" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" opacity="0.4" />' +

    '</g>';

  // L1.4: Energy Drink Can (0.25L)
  PRODUCTS['energy_drink'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="30" ry="6" fill="#000" opacity="0.3" />' +
      // Matte Graphite Can
      '<defs>' +
        '<linearGradient id="can-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#1E293B" />' +
          '<stop offset="35%" stop-color="#334155" />' +
          '<stop offset="70%" stop-color="#1E293B" />' +
          '<stop offset="100%" stop-color="#0F172A" />' +
        '</linearGradient>' +
        '<linearGradient id="cyan-neon" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#22D3EE" />' +
          '<stop offset="100%" stop-color="#0284C7" />' +
        '</linearGradient>' +
      '</defs>' +
      // Slender can
      '<rect x="58" y="34" width="44" height="110" rx="6" fill="url(#can-grad)" />' +
      // Silver rim top and bottom
      '<ellipse cx="80" cy="34" rx="22" ry="6" fill="#94A3B8" stroke="#CBD5E1" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="32" rx="16" ry="4" fill="#64748B" />' +
      // Pull tab
      '<ellipse cx="80" cy="32" rx="6" ry="3" fill="#E2E8F0" />' +
      '<ellipse cx="80" cy="144" rx="22" ry="5" fill="#475569" />' +
      // Cyan Neon Lightning
      '<polygon points="84,48 72,82 82,82 74,118 94,76 82,76" fill="url(#cyan-neon)" filter="url(#glow-gold)" />' +
      '<text x="80" y="130" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#38BDF8" text-anchor="middle" letter-spacing="1.5">ENERGY</text>' +
      '<text x="80" y="138" font-family="Consolas, monospace" font-size="6" fill="#94A3B8" text-anchor="middle">0.25 Л • TAURINE</text>' +
      // Highlight strip
      '<line x1="62" y1="40" x2="62" y2="138" stroke="#FFF" stroke-width="2" opacity="0.3" stroke-linecap="round" />' +

    '</g>';

  // L1.5: Drinking Yogurt Bottle
  PRODUCTS['drinking_yogurt'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      // Curvy bottle
      '<defs>' +
        '<linearGradient id="yogurt-bottle-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#F1F5F9" />' +
          '<stop offset="40%" stop-color="#FFFFFF" />' +
          '<stop offset="100%" stop-color="#E2E8F0" />' +
        '</linearGradient>' +
        '<linearGradient id="berry-pink-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#F43F5E" />' +
          '<stop offset="100%" stop-color="#FB7185" />' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M68 30 L92 30 C94 44 104 54 104 76 C104 90 98 100 102 118 L102 138 C102 144 96 146 88 146 L72 146 C64 146 58 144 58 138 L58 118 C62 100 56 90 56 76 C56 54 66 44 68 30 Z" fill="url(#yogurt-bottle-grad)" stroke="#CBD5E1" stroke-width="1.5" />' +
      // Pink swirl wrap label
      '<path d="M57 82 Q80 72 103 82 L102 120 Q80 128 58 120 Z" fill="url(#berry-pink-grad)" />' +
      '<text x="80" y="98" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#FFF" text-anchor="middle">ЙОГУРТ</text>' +
      '<text x="80" y="108" font-family="Consolas, monospace" font-weight="bold" font-size="6.5" fill="#FFE4E6" text-anchor="middle">КЛУБНИЧНЫЙ</text>' +
      // Strawberry icon on bottle
      '<circle cx="80" cy="126" r="6" fill="#E11D48" />' +
      '<polygon points="77,121 80,119 83,121 80,123" fill="#22C55E" />' +
      // Foil Cap
      '<ellipse cx="80" cy="30" rx="14" ry="5" fill="#F43F5E" stroke="#BE123C" stroke-width="1" />' +
      '<rect x="67" y="24" width="26" height="6" rx="2" fill="#FB7185" />' +
      // Splash wave
      '<path d="M64 64 Q80 72 96 64" stroke="#FDA4AF" stroke-width="3" fill="none" opacity="0.7" />' +

    '</g>';

  // L1.6: Fruit Water Bottle
  PRODUCTS['fruit_water'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="32" ry="7" fill="#000" opacity="0.3" />' +
      // Aquamarine clear water bottle
      '<defs>' +
        '<linearGradient id="aqua-water-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#A5F3FC" stop-opacity="0.8" />' +
          '<stop offset="40%" stop-color="#E0F2FE" stop-opacity="0.6" />' +
          '<stop offset="100%" stop-color="#38BDF8" stop-opacity="0.8" />' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M68 30 L92 30 L94 48 C98 58 104 68 104 82 L104 136 C104 143 98 146 90 146 L70 146 C62 146 56 143 56 136 L56 82 C56 68 62 58 66 48 Z" fill="url(#aqua-water-grad)" stroke="#38BDF8" stroke-width="1.5" />' +
      // Water bubbles
      '<circle cx="70" cy="120" r="3" fill="#FFF" opacity="0.8" />' +
      '<circle cx="86" cy="110" r="2.5" fill="#FFF" opacity="0.8" />' +
      '<circle cx="76" cy="95" r="2" fill="#FFF" opacity="0.7" />' +
      '<circle cx="84" cy="75" r="3.5" fill="#FFF" opacity="0.8" />' +
      '<circle cx="68" cy="65" r="2" fill="#FFF" opacity="0.7" />' +
      // Floating orange slice
      '<circle cx="76" cy="98" r="11" fill="#FB923C" stroke="#FFF" stroke-width="1.2" opacity="0.9" />' +
      '<circle cx="76" cy="98" r="8.5" fill="#FED7AA" />' +
      '<line x1="76" y1="90" x2="76" y2="106" stroke="#FB923C" stroke-width="1" />' +
      '<line x1="68" y1="98" x2="84" y2="98" stroke="#FB923C" stroke-width="1" />' +
      // Mint leaf
      '<path d="M84 82 C90 76 96 80 94 86 C90 90 84 88 84 82 Z" fill="#22C55E" opacity="0.9" />' +
      // Blue cap
      '<rect x="70" y="20" width="20" height="10" rx="3" fill="#0284C7" />' +
      // Clear label
      '<rect x="56" y="58" width="48" height="18" rx="2" fill="#FFF" opacity="0.85" />' +
      '<text x="80" y="68" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#0369A1" text-anchor="middle">AQUA FRUIT</text>' +
      '<text x="80" y="74" font-family="Consolas, monospace" font-size="5.5" fill="#0284C7" text-anchor="middle">С АРОМАТОМ</text>' +

    '</g>';

  // --- LEVEL 2: BREAKFASTS ---

  // L2.1: Cornflakes Box
  PRODUCTS['cornflakes_box'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Box 3D
      '<defs>' +
        '<linearGradient id="cereal-yellow" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#FCD34D" />' +
          '<stop offset="100%" stop-color="#F59E0B" />' +
        '</linearGradient>' +
      '</defs>' +
      // Top flap
      '<polygon points="44,38 116,38 106,24 54,24" fill="#FEF08A" />' +
      // Front box
      '<rect x="44" y="38" width="72" height="106" rx="4" fill="url(#cereal-yellow)" />' +
      // Sun rays
      '<circle cx="80" cy="74" r="22" fill="#FDE047" opacity="0.6" />' +
      '<path d="M80 46 L80 102 M52 74 L108 74 M60 54 L100 94 M60 94 L100 54" stroke="#FBBF24" stroke-width="1.5" opacity="0.5" />' +
      // Brand banner
      '<rect x="40" y="52" width="80" height="20" rx="3" fill="#DC2626" />' +
      '<text x="80" y="66" font-family="Segoe UI, sans-serif" font-weight="900" font-size="10" fill="#FFF" text-anchor="middle" letter-spacing="1">ХЛОПЬЯ</text>' +
      // Cereal bowl at bottom
      '<path d="M54 112 Q80 138 106 112 Z" fill="#0284C7" />' +
      '<ellipse cx="80" cy="112" rx="26" ry="7" fill="#FFF" />' +
      // Cornflakes flakes in bowl
      '<ellipse cx="72" cy="110" rx="5" ry="3" fill="#D97706" transform="rotate(15 72 110)" />' +
      '<ellipse cx="82" cy="112" rx="6" ry="3" fill="#B45309" transform="rotate(-20 82 112)" />' +
      '<ellipse cx="90" cy="110" rx="4" ry="2.5" fill="#D97706" />' +
      '<ellipse cx="76" cy="108" rx="4" ry="2" fill="#F59E0B" />' +
      // Corn cob icon
      '<ellipse cx="104" cy="88" rx="6" ry="12" fill="#EAB308" transform="rotate(25 104 88)" />' +
      '<path d="M102 96 C100 104 106 102 108 100" stroke="#16A34A" stroke-width="2" fill="none" />' +
      // Sugar alert tag
      '<rect x="48" y="130" width="64" height="12" rx="2" fill="#1E293B" />' +
      '<text x="80" y="139" font-family="Consolas, monospace" font-size="6.5" fill="#EF4444" font-weight="bold" text-anchor="middle">ХРУСТЯЩИЕ</text>' +
    '</g>';

  // L2.2: Strawberry Yogurt Cup
  PRODUCTS['strawberry_yogurt_cup'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      // Plastic Yogurt Pot (tapered)
      '<defs>' +
        '<linearGradient id="pot-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#FFFFFF" />' +
          '<stop offset="50%" stop-color="#FFF1F2" />' +
          '<stop offset="100%" stop-color="#FECDD3" />' +
        '</linearGradient>' +
      '</defs>' +
      '<polygon points="46,54 114,54 104,142 56,142" fill="url(#pot-grad)" stroke="#FDA4AF" stroke-width="1.5" />' +
      // Foil lid peeled up
      '<path d="M42 54 C42 46 118 46 118 54" stroke="#E2E8F0" stroke-width="4" fill="none" />' +
      '<path d="M42 54 L36 40 Q46 36 60 48" fill="#F43F5E" stroke="#E2E8F0" stroke-width="1" />' +
      // Strawberry on cup
      '<circle cx="80" cy="100" r="16" fill="#E11D48" />' +
      '<path d="M80 118 C72 108 66 98 70 90 C74 82 86 82 90 90 C94 98 88 108 80 118 Z" fill="#E11D48" />' +
      // Strawberry seeds
      '<circle cx="76" cy="94" r="1" fill="#FEF08A" />' +
      '<circle cx="84" cy="94" r="1" fill="#FEF08A" />' +
      '<circle cx="80" cy="100" r="1" fill="#FEF08A" />' +
      '<circle cx="75" cy="104" r="1" fill="#FEF08A" />' +
      '<circle cx="83" cy="104" r="1" fill="#FEF08A" />' +
      // Green cap leaf
      '<polygon points="76,86 80,82 84,86 80,87" fill="#22C55E" />' +
      '<polygon points="72,88 80,83 80,87" fill="#16A34A" />' +
      '<polygon points="88,88 80,83 80,87" fill="#16A34A" />' +
      // Text
      '<text x="80" y="74" font-family="Segoe UI, sans-serif" font-weight="900" font-size="10" fill="#BE123C" text-anchor="middle">КЛУБНИКА</text>' +
      '<rect x="58" y="128" width="44" height="10" rx="2" fill="#FB7185" />' +
      '<text x="80" y="136" font-family="Consolas, monospace" font-size="6" fill="#FFF" font-weight="bold" text-anchor="middle">ЙОГУРТ 3.2%</text>' +
    '</g>';

  // L2.3: Granola Bar / Muesli Bar
  PRODUCTS['granola_bar'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Wrapper back
      '<rect x="36" y="60" width="88" height="60" rx="4" fill="#0D9488" transform="rotate(-8 80 90)" />' +
      // Torn zigzag foil edge
      '<path d="M30 64 L34 68 L30 72 L34 76 L30 80 L34 84 L30 88 L34 92 L30 96 L34 100 L30 104" stroke="#CCFBF1" stroke-width="1.5" fill="none" transform="rotate(-8 80 90)" />' +
      // Crunchy cereal bar emerging
      '<rect x="52" y="64" width="70" height="42" rx="5" fill="#D97706" transform="rotate(-8 80 90)" stroke="#B45309" stroke-width="1.5" />' +
      // Grains, oat flakes, raisins texture
      '<ellipse cx="68" cy="80" rx="6" ry="3" fill="#FEF3C7" transform="rotate(20 68 80)" />' +
      '<ellipse cx="86" cy="76" rx="5" ry="2.5" fill="#FEF3C7" transform="rotate(-30 86 76)" />' +
      '<ellipse cx="102" cy="74" rx="6" ry="3" fill="#FEF3C7" transform="rotate(10 102 74)" />' +
      '<circle cx="78" cy="84" r="3.5" fill="#78350F" />' + // raisin
      '<circle cx="96" cy="80" r="3" fill="#78350F" />' + // raisin
      '<ellipse cx="88" cy="88" rx="5" ry="2" fill="#FEF3C7" transform="rotate(15 88 88)" />' +
      // Honey drizzle
      '<path d="M58 74 Q74 86 90 74 Q106 86 116 76" stroke="#F59E0B" stroke-width="2.5" fill="none" opacity="0.85" />' +
      // Brand tag
      '<rect x="42" y="116" width="76" height="14" rx="3" fill="#134E4A" />' +
      '<text x="80" y="126" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="7.5" fill="#5EEAD4" text-anchor="middle">FIT МЮСЛИ БАТОНЧИК</text>' +
    '</g>';

  // L2.4: Toast Bread
  PRODUCTS['toast_bread'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.3" />' +
      // Bread slice back
      '<path d="M54 62 C54 48 66 42 76 42 C82 42 88 44 92 42 C102 42 114 48 114 62 C114 74 110 78 112 116 C112 124 106 128 98 128 L70 128 C62 128 56 124 56 116 C58 78 54 74 54 62 Z" fill="#D97706" />' +
      // Front golden toast slice
      '<path d="M46 68 C46 54 58 48 68 48 C74 48 80 50 84 48 C94 48 106 54 106 68 C106 80 102 84 104 122 C104 130 98 134 90 134 L62 134 C54 134 48 130 48 122 C50 84 46 80 46 68 Z" fill="#FDE68A" stroke="#B45309" stroke-width="2" />' +
      // Inner toasted area
      '<rect x="56" y="66" width="42" height="54" rx="8" fill="#F59E0B" opacity="0.4" />' +
      // Toast grid marks
      '<line x1="62" y1="74" x2="92" y2="104" stroke="#B45309" stroke-width="2" opacity="0.4" stroke-linecap="round" />' +
      '<line x1="62" y1="90" x2="84" y2="112" stroke="#B45309" stroke-width="2" opacity="0.4" stroke-linecap="round" />' +
      '<line x1="72" y1="70" x2="94" y2="92" stroke="#B45309" stroke-width="2" opacity="0.4" stroke-linecap="round" />' +
      // Butter melting cube
      '<polygon points="72,86 84,82 88,88 76,92" fill="#FEF08A" stroke="#EAB308" stroke-width="1" />' +
      // Toast bag packaging clip
      '<rect x="94" y="36" width="16" height="12" rx="2" fill="#EF4444" />' +
      '<text x="102" y="45" font-family="Consolas, monospace" font-size="6" fill="#FFF" font-weight="bold" text-anchor="middle">CLIP</text>' +
      // Banner
      '<rect x="44" y="128" width="72" height="12" rx="2" fill="#78350F" />' +
      '<text x="80" y="137" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="7" fill="#FEF3C7" text-anchor="middle">ТОСТОВЫЙ ХЛЕБ</text>' +
    '</g>';

  // L2.5: Oatmeal Instant Pack
  PRODUCTS['oatmeal_pack'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.3" />' +
      // Kraft paper sachet
      '<defs>' +
        '<linearGradient id="kraft-paper" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#E7E5E4" />' +
          '<stop offset="50%" stop-color="#D6D3D1" />' +
          '<stop offset="100%" stop-color="#A8A29E" />' +
        '</linearGradient>' +
      '</defs>' +
      '<polygon points="46,38 114,38 110,138 50,138" fill="url(#kraft-paper)" stroke="#78716C" stroke-width="1.5" />' +
      // Top sealed crimp
      '<line x1="46" y1="44" x2="114" y2="44" stroke="#78716C" stroke-width="1.5" stroke-dasharray="2,2" />' +
      // Steaming bowl illustration
      '<path d="M60 102 Q80 120 100 102 Z" fill="#F59E0B" />' +
      '<ellipse cx="80" cy="102" rx="20" ry="5" fill="#FEF3C7" />' +
      // Steam swirls
      '<path d="M74 94 Q72 86 76 80" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.8" stroke-linecap="round" />' +
      '<path d="M80 94 Q82 84 78 78" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.8" stroke-linecap="round" />' +
      '<path d="M86 94 Q84 86 88 80" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.8" stroke-linecap="round" />' +
      // Blueberries on porridge
      '<circle cx="76" cy="101" r="3" fill="#1E3A8A" />' +
      '<circle cx="84" cy="102" r="3" fill="#1E3A8A" />' +
      // Text
      '<text x="80" y="60" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#44403C" text-anchor="middle">ОВСЯНАЯ КАША</text>' +
      '<text x="80" y="70" font-family="Consolas, monospace" font-size="6.5" fill="#B45309" font-weight="bold" text-anchor="middle">БЫСТРОГО ПРИГОТОВЛЕНИЯ</text>' +
      '<rect x="56" y="124" width="48" height="10" rx="2" fill="#78716C" />' +
      '<text x="80" y="132" font-family="Segoe UI, sans-serif" font-size="6" fill="#FFF" text-anchor="middle">ПОРЦИЯ 40 Г</text>' +
    '</g>';

  // L2.6: Chocolate Puffs Box
  PRODUCTS['chocolate_puffs'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Chocolate Brown Box
      '<defs>' +
        '<linearGradient id="choc-box-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#78350F" />' +
          '<stop offset="50%" stop-color="#451A03" />' +
          '<stop offset="100%" stop-color="#290E02" />' +
        '</linearGradient>' +
      '</defs>' +
      '<polygon points="44,36 116,36 106,22 54,22" fill="#92400E" />' +
      '<rect x="44" y="36" width="72" height="108" rx="4" fill="url(#choc-box-grad)" stroke="#B45309" stroke-width="1.5" />' +
      // Big title
      '<text x="80" y="56" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FDE047" text-anchor="middle">ШОКОЛАДНЫЕ</text>' +
      '<text x="80" y="68" font-family="Segoe UI, sans-serif" font-weight="900" font-size="12" fill="#FFF" text-anchor="middle" letter-spacing="1">ШАРИКИ</text>' +
      // Milk splash
      '<path d="M52 118 Q80 144 108 118 Q96 112 80 114 Q64 112 52 118 Z" fill="#FFF" />' +
      // 3D Chocolate Balls bouncing
      '<circle cx="68" cy="98" r="8" fill="#451A03" stroke="#92400E" stroke-width="1.5" />' +
      '<ellipse cx="66" cy="96" rx="3" ry="1.5" fill="#A16207" opacity="0.6" />' +
      '<circle cx="86" cy="92" r="9" fill="#451A03" stroke="#92400E" stroke-width="1.5" />' +
      '<ellipse cx="84" cy="89" rx="3.5" ry="2" fill="#A16207" opacity="0.6" />' +
      '<circle cx="98" cy="104" r="7" fill="#451A03" stroke="#92400E" stroke-width="1.5" />' +
      '<circle cx="60" cy="108" r="6" fill="#451A03" stroke="#92400E" stroke-width="1" />' +
      '<circle cx="78" cy="110" r="7.5" fill="#451A03" stroke="#92400E" stroke-width="1" />' +
      // Mascot smiley
      '<circle cx="80" cy="80" r="5" fill="#FBBF24" />' +
      '<circle cx="78" cy="79" r="0.8" fill="#000" />' +
      '<circle cx="82" cy="79" r="0.8" fill="#000" />' +
      '<path d="M78 82 Q80 84 82 82" stroke="#000" stroke-width="0.8" fill="none" />' +
    '</g>';

  // --- LEVEL 3: SNACKS ---

  // L3.1: Grain Bar
  PRODUCTS['grain_bar'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Golden bar wrapper
      '<rect x="36" y="54" width="88" height="66" rx="5" fill="#D97706" stroke="#92400E" stroke-width="1.5" />' +
      '<rect x="42" y="60" width="76" height="54" rx="3" fill="#FEF3C7" />' +
      // Bar illustration
      '<rect x="48" y="68" width="64" height="28" rx="4" fill="#B45309" />' +
      // Grains on bar
      '<ellipse cx="60" cy="78" rx="4" ry="2" fill="#FDE68A" transform="rotate(25 60 78)" />' +
      '<ellipse cx="72" cy="76" rx="5" ry="2.5" fill="#FDE68A" transform="rotate(-15 72 76)" />' +
      '<ellipse cx="86" cy="80" rx="4" ry="2" fill="#FDE68A" transform="rotate(30 86 80)" />' +
      '<ellipse cx="98" cy="76" rx="5" ry="2.5" fill="#FDE68A" transform="rotate(-20 98 76)" />' +
      // Cashew nut
      '<path d="M74 88 C70 88 68 84 72 82 C76 80 80 84 78 88 Z" fill="#F59E0B" />' +
      // Text
      '<text x="80" y="106" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#78350F" text-anchor="middle">ЗЛАКОВЫЙ БАТОНЧИК</text>' +
      '<rect x="46" y="124" width="68" height="12" rx="2" fill="#B45309" />' +
      '<text x="80" y="133" font-family="Consolas, monospace" font-size="6" fill="#FFF" font-weight="bold" text-anchor="middle">ЗЛАКИ И ОРЕХИ</text>' +
    '</g>';

  // L3.2: Oatmeal Cookies
  PRODUCTS['oatmeal_cookies'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Stack of 3 cookies
      // Bottom cookie
      '<ellipse cx="76" cy="120" rx="34" ry="15" fill="#92400E" stroke="#78350F" stroke-width="2" />' +
      // Middle cookie
      '<ellipse cx="84" cy="102" rx="33" ry="14" fill="#B45309" stroke="#78350F" stroke-width="2" />' +
      // Top cookie
      '<ellipse cx="80" cy="82" rx="34" ry="16" fill="#D97706" stroke="#92400E" stroke-width="2" />' +
      // Oatmeal texture cracks
      '<path d="M60 80 Q70 84 80 78 Q90 84 100 80" stroke="#78350F" stroke-width="1.5" fill="none" stroke-linecap="round" />' +
      '<path d="M66 88 Q78 86 94 88" stroke="#78350F" stroke-width="1.2" fill="none" stroke-linecap="round" />' +
      // Chocolate chips
      '<circle cx="68" cy="76" r="3" fill="#451A03" />' +
      '<circle cx="86" cy="74" r="3.5" fill="#451A03" />' +
      '<circle cx="94" cy="84" r="2.8" fill="#451A03" />' +
      '<circle cx="74" cy="86" r="3.2" fill="#451A03" />' +
      '<circle cx="84" cy="88" r="2.5" fill="#451A03" />' +
      // Banner
      '<rect x="44" y="38" width="72" height="18" rx="3" fill="#78350F" />' +
      '<text x="80" y="50" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FEF3C7" text-anchor="middle">ОВСЯНОЕ ПЕЧЕНЬЕ</text>' +
    '</g>';

  // L3.3: Chocolate Milk Carton
  PRODUCTS['chocolate_milk'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="36" ry="7" fill="#000" opacity="0.3" />' +
      // Carton
      '<defs>' +
        '<linearGradient id="choc-carton-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#5C2B09" />' +
          '<stop offset="50%" stop-color="#78350F" />' +
          '<stop offset="100%" stop-color="#451A03" />' +
        '</linearGradient>' +
      '</defs>' +
      // Slanted top
      '<polygon points="52,48 108,48 98,34 62,34" fill="#D6D3D1" />' +
      '<rect x="52" y="48" width="56" height="96" rx="4" fill="url(#choc-carton-grad)" />' +
      // Red bent straw attached
      '<path d="M96 32 L104 22 L112 24" stroke="#EF4444" stroke-width="3" stroke-linecap="round" fill="none" />' +
      '<line x1="98" y1="36" x2="98" y2="120" stroke="#FFF" stroke-width="4" opacity="0.7" />' +
      // Splash
      '<path d="M52 90 Q80 110 108 90 L108 144 L52 144 Z" fill="#451A03" />' +
      '<circle cx="80" cy="84" r="8" fill="#FEF3C7" />' +
      '<circle cx="80" cy="84" r="6" fill="#78350F" />' +
      // Text
      '<text x="80" y="66" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ШОКОЛАДНОЕ</text>' +
      '<text x="80" y="76" font-family="Segoe UI, sans-serif" font-weight="900" font-size="10" fill="#FDE047" text-anchor="middle">МОЛОКО</text>' +
    '</g>';

  // L3.4: Vanilla Waffles
  PRODUCTS['vanilla_waffles'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // 2 Layered Waffles with cream filling
      '<defs>' +
        '<linearGradient id="waffle-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#FCD34D" />' +
          '<stop offset="100%" stop-color="#D97706" />' +
        '</linearGradient>' +
      '</defs>' +
      // Waffle bottom slice
      '<rect x="44" y="86" width="72" height="34" rx="4" fill="url(#waffle-grad)" stroke="#B45309" stroke-width="1.5" />' +
      // Vanilla cream layer
      '<rect x="42" y="80" width="76" height="8" rx="3" fill="#FFFBEB" stroke="#FEF08A" stroke-width="1" />' +
      // Waffle top slice
      '<rect x="44" y="48" width="72" height="34" rx="4" fill="url(#waffle-grad)" stroke="#B45309" stroke-width="1.5" />' +
      // Waffle grid squares on top
      '<rect x="50" y="54" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="65" y="54" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="80" y="54" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="95" y="54" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="50" y="68" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="65" y="68" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="80" y="68" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      '<rect x="95" y="68" width="10" height="10" rx="1.5" fill="#B45309" opacity="0.5" />' +
      // Vanilla flower
      '<circle cx="80" cy="132" r="8" fill="#FEF08A" stroke="#EAB308" stroke-width="1" />' +
      '<text x="80" y="135" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7" fill="#78350F" text-anchor="middle">ВАНИЛЬ</text>' +
    '</g>';

  // L3.5: Peach Curd Cup
  PRODUCTS['peach_curd'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      // Curd Tub
      '<polygon points="46,58 114,58 104,142 56,142" fill="#FFF" stroke="#E2E8F0" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="58" rx="34" ry="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" />' +
      // Peach slice
      '<circle cx="80" cy="98" r="16" fill="#FB923C" stroke="#EA580C" stroke-width="1.5" />' +
      '<circle cx="80" cy="98" r="13" fill="#FDBA74" />' +
      '<ellipse cx="76" cy="94" rx="4" ry="2" fill="#FED7AA" />' +
      '<path d="M80 82 C84 76 90 78 88 84 Z" fill="#22C55E" />' +
      // Text
      '<text x="80" y="76" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#C2410C" text-anchor="middle">ТВОРОЖОК</text>' +
      '<rect x="56" y="126" width="48" height="12" rx="2" fill="#EA580C" />' +
      '<text x="80" y="135" font-family="Consolas, monospace" font-size="6.5" fill="#FFF" font-weight="bold" text-anchor="middle">ПЕРСИК • 120 Г</text>' +
    '</g>';

  // L3.6: Banana Shake
  PRODUCTS['banana_shake'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      // Tall Glass
      '<polygon points="56,44 104,44 94,144 66,144" fill="#FEF08A" stroke="#FBBF24" stroke-width="1.5" opacity="0.9" />' +
      // Whipped cream top
      '<path d="M52 44 C52 32 64 26 80 26 C96 26 108 32 108 44 Z" fill="#FFF" stroke="#E2E8F0" stroke-width="1.5" />' +
      '<circle cx="80" cy="24" r="5" fill="#EF4444" />' + // cherry on top
      // Striped straw
      '<line x1="72" y1="12" x2="88" y2="60" stroke="#F43F5E" stroke-width="4" stroke-linecap="round" />' +
      '<line x1="72" y1="12" x2="88" y2="60" stroke="#FFF" stroke-width="4" stroke-dasharray="4,4" stroke-linecap="round" />' +
      // Banana slice on rim
      '<circle cx="56" cy="46" r="10" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2" />' +
      '<circle cx="56" cy="46" r="7" fill="#FEF08A" />' +
      '<circle cx="56" cy="46" r="1" fill="#713F12" />' +
      // Text
      '<text x="80" y="86" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#854D0E" text-anchor="middle">БАНАНОВЫЙ</text>' +
      '<text x="80" y="98" font-family="Segoe UI, sans-serif" font-weight="900" font-size="11" fill="#713F12" text-anchor="middle">КОКТЕЙЛЬ</text>' +
    '</g>';

  // --- LEVEL 4: SAUCES ---

  // L4.1: Ketchup Bottle
  PRODUCTS['ketchup_bottle'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      // Red Squeezy Bottle
      '<defs>' +
        '<linearGradient id="ketchup-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#991B1B" />' +
          '<stop offset="30%" stop-color="#DC2626" />' +
          '<stop offset="70%" stop-color="#EF4444" />' +
          '<stop offset="100%" stop-color="#7F1D1D" />' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M68 36 L92 36 L96 52 C102 64 104 80 104 100 L104 136 C104 143 98 146 90 146 L70 146 C62 146 56 143 56 136 L56 100 C56 80 58 64 64 52 Z" fill="url(#ketchup-grad)" />' +
      // White Nozzle
      '<polygon points="74,36 86,36 84,20 76,20" fill="#FFF" stroke="#E2E8F0" stroke-width="1" />' +
      '<circle cx="80" cy="18" r="3" fill="#DC2626" />' +
      // Tomato Label
      '<rect x="58" y="76" width="44" height="42" rx="3" fill="#FFF" />' +
      '<circle cx="80" cy="94" r="12" fill="#DC2626" />' +
      '<path d="M80 82 C78 78 82 78 80 82 Z" fill="#16A34A" />' +
      '<polygon points="76,82 80,78 84,82" fill="#16A34A" />' +
      '<text x="80" y="112" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#991B1B" text-anchor="middle">КЕТЧУП</text>' +
      '<rect x="58" y="124" width="44" height="10" rx="2" fill="#7F1D1D" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FDE047" font-weight="bold" text-anchor="middle">ТОМАТНЫЙ</text>' +
    '</g>';

  // L4.2: BBQ Sauce Bottle
  PRODUCTS['bbq_sauce_bottle'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="36" ry="7" fill="#000" opacity="0.3" />' +
      // Dark smoky bottle
      '<defs>' +
        '<linearGradient id="bbq-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#451A03" />' +
          '<stop offset="40%" stop-color="#78350F" />' +
          '<stop offset="100%" stop-color="#290E02" />' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M68 36 L92 36 L96 52 C104 66 106 82 106 100 L106 136 C106 143 100 146 90 146 L70 146 C60 146 54 143 54 136 L54 100 C54 82 56 66 64 52 Z" fill="url(#bbq-grad)" />' +
      // Black cap
      '<rect x="70" y="24" width="20" height="12" rx="3" fill="#1E293B" stroke="#475569" stroke-width="1" />' +
      // Flame badge
      '<rect x="56" y="74" width="48" height="46" rx="3" fill="#1E293B" stroke="#B45309" stroke-width="1.5" />' +
      '<path d="M80 82 C86 90 92 96 88 106 C84 112 76 112 72 106 C68 98 76 94 80 82 Z" fill="#EA580C" />' +
      '<path d="M80 92 C84 98 86 102 84 107 C82 110 78 110 76 107 C74 103 78 100 80 92 Z" fill="#FDE047" />' +
      '<text x="80" y="116" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FBBF24" text-anchor="middle">BARBECUE</text>' +
    '</g>';

  // L4.3: Hot Sauce Bottle
  PRODUCTS['hot_sauce_bottle'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="30" ry="6" fill="#000" opacity="0.3" />' +
      // Slender hot sauce bottle
      '<path d="M72 32 L88 32 L92 46 C96 58 100 70 100 90 L100 138 C100 144 94 146 88 146 L72 146 C66 146 60 144 60 138 L60 90 C60 70 64 58 68 46 Z" fill="#DC2626" stroke="#B91C1C" stroke-width="1.5" />' +
      // Green cap
      '<polygon points="74,32 86,32 84,18 76,18" fill="#15803D" />' +
      // Chili pepper icon
      '<path d="M74 80 C86 78 94 86 88 102 C84 112 78 116 76 116 C76 116 80 104 76 94 Z" fill="#EF4444" stroke="#7F1D1D" stroke-width="1" />' +
      '<path d="M74 80 C72 76 70 74 68 76" stroke="#16A34A" stroke-width="2" fill="none" />' +
      // Fire sparks
      '<polygon points="86,72 88,76 92,76 89,79 90,83 86,81 82,83 83,79 80,76 84,76" fill="#F59E0B" />' +
      '<text x="80" y="128" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#FEF08A" text-anchor="middle">ОСТРЫЙ</text>' +
    '</g>';

  // L4.4: Teriyaki Bottle
  PRODUCTS['teriyaki_bottle'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="32" ry="6" fill="#000" opacity="0.3" />' +
      // Glossy Japanese sauce bottle
      '<path d="M70 30 L90 30 L94 48 C98 60 102 74 102 96 L102 138 C102 144 96 146 88 146 L72 146 C64 146 58 144 58 138 L58 96 C58 74 62 60 66 48 Z" fill="#18181B" stroke="#3F3F46" stroke-width="1.5" />' +
      // Gold/Red Cap
      '<rect x="72" y="18" width="16" height="12" rx="3" fill="#DC2626" />' +
      // Label
      '<rect x="60" y="74" width="40" height="46" rx="2" fill="#FEF3C7" />' +
      // Japanese Kanji decoration
      '<rect x="74" y="80" width="12" height="14" fill="#DC2626" rx="2" />' +
      '<text x="80" y="91" font-family="sans-serif" font-size="9" fill="#FFF" text-anchor="middle">照</text>' +
      '<text x="80" y="104" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7" fill="#18181B" text-anchor="middle">TERIYAKI</text>' +
      // Sesame seeds on label
      '<ellipse cx="72" cy="112" rx="1.5" ry="3" fill="#D97706" transform="rotate(30 72 112)" />' +
      '<ellipse cx="80" cy="114" rx="1.5" ry="3" fill="#D97706" transform="rotate(-20 80 114)" />' +
      '<ellipse cx="88" cy="112" rx="1.5" ry="3" fill="#D97706" transform="rotate(15 88 112)" />' +
    '</g>';

  // Extra Level 4 Sauces
  PRODUCTS['mayonnaise_jar'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="52" y="48" width="56" height="92" rx="8" fill="#FFFBEB" stroke="#E2E8F0" stroke-width="2" />' +
      '<rect x="54" y="36" width="52" height="14" rx="4" fill="#0284C7" />' +
      '<rect x="54" y="72" width="52" height="38" rx="2" fill="#0284C7" />' +
      '<text x="80" y="88" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">МАЙОНЕЗ</text>' +
      '<text x="80" y="100" font-family="Consolas, monospace" font-size="6.5" fill="#BAE6FD" text-anchor="middle">ПРОВАНСАЛЬ 67%</text>' +
    '</g>';

  PRODUCTS['mustard_jar'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="36" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="54" y="48" width="52" height="92" rx="8" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />' +
      '<rect x="56" y="36" width="48" height="14" rx="4" fill="#B45309" />' +
      '<rect x="56" y="74" width="48" height="36" rx="2" fill="#FEF9C3" />' +
      '<text x="80" y="90" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#713F12" text-anchor="middle">ГОРЧИЦА</text>' +
      '<text x="80" y="102" font-family="Segoe UI, sans-serif" font-size="6" fill="#854D0E" text-anchor="middle">РУССКАЯ ОСТРАЯ</text>' +
    '</g>';

  PRODUCTS['soy_sauce_bottle'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="32" ry="6" fill="#000" opacity="0.3" />' +
      '<path d="M68 38 L92 38 L98 56 C102 70 104 86 104 106 L104 138 C104 144 98 146 90 146 L70 146 C62 146 56 144 56 138 L56 106 C56 86 58 70 62 56 Z" fill="#18181B" stroke="#3F3F46" stroke-width="1.5" />' +
      '<polygon points="70,38 90,38 92,26 68,26" fill="#DC2626" />' +
      '<line x1="92" y1="28" x2="100" y2="24" stroke="#DC2626" stroke-width="3" stroke-linecap="round" />' +
      '<rect x="60" y="80" width="40" height="38" rx="2" fill="#F59E0B" />' +
      '<text x="80" y="96" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#000" text-anchor="middle">СОЕВЫЙ</text>' +
      '<text x="80" y="108" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#000" text-anchor="middle">СОУС</text>' +
    '</g>';

  // --- LEVEL 5: CANNED GOODS ---

  // L5.1: Canned Tuna in Water
  PRODUCTS['canned_tuna'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="46" ry="8" fill="#000" opacity="0.3" />' +
      // Flat silver tin
      '<defs>' +
        '<linearGradient id="tin-silver" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#94A3B8" />' +
          '<stop offset="30%" stop-color="#CBD5E1" />' +
          '<stop offset="70%" stop-color="#F1F5F9" />' +
          '<stop offset="100%" stop-color="#64748B" />' +
        '</linearGradient>' +
      '</defs>' +
      '<rect x="36" y="70" width="88" height="66" rx="10" fill="url(#tin-silver)" stroke="#64748B" stroke-width="2" />' +
      '<ellipse cx="80" cy="70" rx="44" ry="14" fill="#CBD5E1" stroke="#94A3B8" stroke-width="2" />' +
      '<ellipse cx="80" cy="70" rx="38" ry="11" fill="#94A3B8" />' +
      // Pull ring on top
      '<circle cx="80" cy="69" r="6" fill="none" stroke="#E2E8F0" stroke-width="2.5" />' +
      // Ocean Blue Label
      '<rect x="36" y="86" width="88" height="42" fill="#0284C7" />' +
      // Tuna fish silhouette
      '<path d="M60 102 C68 96 82 98 90 104 C94 107 100 102 102 100 C100 106 96 110 92 110 C80 114 68 110 60 102 Z" fill="#FFF" />' +
      '<polygon points="56,102 62,96 62,108" fill="#FFF" />' +
      '<text x="80" y="122" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FEF08A" text-anchor="middle">ТУНЕЦ В С/С</text>' +
      // Star badge "0g Sugar"
      '<rect x="42" y="130" width="76" height="10" rx="2" fill="#0369A1" />' +
      '<text x="80" y="137.5" font-family="Consolas, monospace" font-size="6" fill="#FFF" font-weight="bold" text-anchor="middle">В СОБСТВЕННОМ СОКУ</text>' +
    '</g>';

  // L5.2: Canned Cherries
  PRODUCTS['canned_cherries'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.3" />' +
      // Glass Jar with Cherries
      '<rect x="46" y="48" width="68" height="92" rx="8" fill="#9F1239" opacity="0.85" stroke="#E2E8F0" stroke-width="2" />' +
      // Jar neck and gold lid
      '<rect x="52" y="36" width="56" height="14" rx="4" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="36" rx="28" ry="6" fill="#FDE047" />' +
      // Floating whole cherries in jar
      '<circle cx="64" cy="80" r="10" fill="#4C0519" stroke="#881337" stroke-width="1" />' +
      '<circle cx="82" cy="74" r="11" fill="#4C0519" stroke="#881337" stroke-width="1" />' +
      '<circle cx="96" cy="84" r="9" fill="#4C0519" stroke="#881337" stroke-width="1" />' +
      '<circle cx="72" cy="104" r="11" fill="#4C0519" stroke="#881337" stroke-width="1" />' +
      '<circle cx="90" cy="106" r="10" fill="#4C0519" stroke="#881337" stroke-width="1" />' +
      // White label
      '<rect x="50" y="112" width="60" height="22" rx="3" fill="#FFF" opacity="0.9" />' +
      '<text x="80" y="122" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#881337" text-anchor="middle">ВИШНЯ</text>' +
      '<text x="80" y="130" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="6" fill="#4C0519" text-anchor="middle">В СОБСТВЕННОМ СОКУ</text>' +
    '</g>';

  // L5.3: Canned Olives
  PRODUCTS['canned_olives'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      // Metal Can
      '<rect x="48" y="44" width="64" height="98" rx="8" fill="#14532D" stroke="#64748B" stroke-width="2" />' +
      '<ellipse cx="80" cy="44" rx="32" ry="8" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5" />' +
      // Dark label with olives & olive branch
      '<rect x="48" y="66" width="64" height="58" fill="#1C1917" />' +
      '<circle cx="70" cy="94" r="9" fill="#0A0A0A" stroke="#44403C" stroke-width="1.5" />' +
      '<circle cx="90" cy="98" r="9" fill="#0A0A0A" stroke="#44403C" stroke-width="1.5" />' +
      '<path d="M64 80 Q80 84 96 78" stroke="#16A34A" stroke-width="2" fill="none" />' +
      '<ellipse cx="78" cy="80" rx="4" ry="2" fill="#22C55E" transform="rotate(-20 78 80)" />' +
      '<ellipse cx="88" cy="82" rx="4" ry="2" fill="#22C55E" transform="rotate(20 88 82)" />' +
      '<text x="80" y="116" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#FEF08A" text-anchor="middle">МАСЛИНЫ</text>' +
      '<text x="80" y="122" font-family="Consolas, monospace" font-size="5.5" fill="#A8A29E" text-anchor="middle">С КОСТОЧКОЙ</text>' +
    '</g>';

  // L5.4: Canned Beans
  PRODUCTS['canned_beans'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      // Can
      '<rect x="48" y="44" width="64" height="98" rx="8" fill="#78350F" stroke="#64748B" stroke-width="2" />' +
      '<ellipse cx="80" cy="44" rx="32" ry="8" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5" />' +
      // Red kidney beans label
      '<rect x="48" y="66" width="64" height="58" fill="#991B1B" />' +
      // 3 Kidney beans
      '<path d="M68 88 C62 88 60 96 66 100 C72 104 76 96 74 92 C72 90 70 88 68 88 Z" fill="#7F1D1D" stroke="#FEF2F2" stroke-width="0.8" />' +
      '<path d="M84 94 C78 94 76 102 82 106 C88 110 92 102 90 98 C88 96 86 94 84 94 Z" fill="#7F1D1D" stroke="#FEF2F2" stroke-width="0.8" />' +
      '<text x="80" y="80" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">ФАСОЛЬ</text>' +
      '<text x="80" y="118" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="6.5" fill="#FEF08A" text-anchor="middle">НАТУРАЛЬНАЯ</text>' +
    '</g>';

  // Extra Level 5 Canned Foods
  PRODUCTS['sweet_corn'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="48" y="44" width="64" height="98" rx="8" fill="#EAB308" stroke="#64748B" stroke-width="2" />' +
      '<ellipse cx="80" cy="44" rx="32" ry="8" fill="#CBD5E1" />' +
      '<rect x="48" y="66" width="64" height="58" fill="#15803D" />' +
      '<ellipse cx="80" cy="92" rx="10" ry="16" fill="#FDE047" stroke="#CA8A04" stroke-width="1.2" />' +
      '<text x="80" y="118" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">КУКУРУЗА</text>' +
    '</g>';

  PRODUCTS['lecho_jar'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="48" y="48" width="64" height="92" rx="8" fill="#DC2626" opacity="0.9" stroke="#E2E8F0" stroke-width="2" />' +
      '<rect x="52" y="36" width="56" height="14" rx="4" fill="#F59E0B" />' +
      '<rect x="50" y="80" width="60" height="34" rx="3" fill="#FFF" />' +
      '<text x="80" y="96" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#991B1B" text-anchor="middle">ЛЕЧО</text>' +
      '<text x="80" y="106" font-family="Segoe UI, sans-serif" font-size="6" fill="#451A03" text-anchor="middle">ИЗ ПЕРЦЕВ</text>' +
    '</g>';

  // --- LEVEL 6: DAIRY PRODUCTS ---

  // L6.1: Berry Drinking Yogurt
  PRODUCTS['berry_yogurt'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      '<defs>' +
        '<linearGradient id="berry-drink-grad" x1="0%" y1="0%" x2="100%" y2="0%">' +
          '<stop offset="0%" stop-color="#F3E8FF" />' +
          '<stop offset="50%" stop-color="#FAF5FF" />' +
          '<stop offset="100%" stop-color="#E9D5FF" />' +
        '</linearGradient>' +
      '</defs>' +
      '<path d="M68 32 L92 32 C94 46 104 56 104 78 C104 92 98 102 102 120 L102 138 C102 144 96 146 88 146 L72 146 C64 146 58 144 58 138 L58 120 C62 102 56 92 56 78 C56 56 66 46 68 32 Z" fill="url(#berry-drink-grad)" stroke="#C084FC" stroke-width="1.5" />' +
      '<path d="M57 84 Q80 74 103 84 L102 122 Q80 130 58 122 Z" fill="#9333EA" />' +
      // Blueberries and raspberries
      '<circle cx="72" cy="100" r="7" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1" />' +
      '<circle cx="86" cy="98" r="8" fill="#A855F7" stroke="#7E22CE" stroke-width="1" />' +
      '<circle cx="80" cy="108" r="7" fill="#E11D48" stroke="#9F1239" stroke-width="1" />' +
      '<rect x="67" y="24" width="26" height="8" rx="2" fill="#7E22CE" />' +
      '<text x="80" y="70" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#581C87" text-anchor="middle">ЛЕСНЫЕ ЯГОДЫ</text>' +
    '</g>';

  // L6.2: Condensed Milk Tin
  PRODUCTS['condensed_milk'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Can
      '<rect x="46" y="44" width="68" height="98" rx="6" fill="#CBD5E1" stroke="#64748B" stroke-width="2" />' +
      '<ellipse cx="80" cy="44" rx="34" ry="9" fill="#94A3B8" />' +
      // Iconic Blue & White geometric ornament
      '<rect x="46" y="58" width="68" height="74" fill="#0284C7" />' +
      // White triangles / diamonds
      '<polygon points="46,58 60,72 46,86" fill="#FFF" />' +
      '<polygon points="114,58 100,72 114,86" fill="#FFF" />' +
      '<polygon points="46,104 60,118 46,132" fill="#FFF" />' +
      '<polygon points="114,104 100,118 114,132" fill="#FFF" />' +
      '<polygon points="80,62 94,76 80,90 66,76" fill="#FFF" />' +
      '<text x="80" y="104" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">СГУЩЕНКА</text>' +
      '<text x="80" y="112" font-family="Consolas, monospace" font-size="5.5" fill="#FDE047" font-weight="bold" text-anchor="middle">ЦЕЛЬНОЕ МОЛОКО</text>' +
    '</g>';

  // L6.3: Coffee Drink Can
  PRODUCTS['coffee_drink'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      // Cup/Can with dome lid
      '<polygon points="54,46 106,46 98,142 62,142" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5" />' +
      // Dome lid
      '<path d="M52 46 C52 30 64 24 80 24 C96 24 108 30 108 46 Z" fill="#E2E8F0" opacity="0.8" stroke="#94A3B8" stroke-width="1.5" />' +
      // Brown sleeve
      '<polygon points="56,76 104,76 100,116 60,116" fill="#78350F" />' +
      // Coffee beans
      '<ellipse cx="74" cy="96" rx="5" ry="7" fill="#451A03" stroke="#92400E" stroke-width="1" transform="rotate(-15 74 96)" />' +
      '<line x1="72" y1="91" x2="76" y2="101" stroke="#78350F" stroke-width="1" />' +
      '<ellipse cx="86" cy="96" rx="5" ry="7" fill="#451A03" stroke="#92400E" stroke-width="1" transform="rotate(20 86 96)" />' +
      '<text x="80" y="130" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#78350F" text-anchor="middle">ICE COFFEE</text>' +
    '</g>';

  // L6.4: Baby Formula Tin
  PRODUCTS['baby_formula'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Pastel Blue/Yellow Tin
      '<rect x="46" y="42" width="68" height="100" rx="8" fill="#E0F2FE" stroke="#38BDF8" stroke-width="2" />' +
      '<ellipse cx="80" cy="42" rx="34" ry="8" fill="#BAE6FD" />' +
      // Measuring scoop
      '<path d="M98 28 L108 22 C112 24 114 30 110 32 L100 36 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="1" />' +
      // Teddy / Baby rattle icon
      '<circle cx="80" cy="80" r="12" fill="#FEF08A" stroke="#FBBF24" stroke-width="1.5" />' +
      '<circle cx="72" cy="70" r="4" fill="#FEF08A" stroke="#FBBF24" stroke-width="1" />' +
      '<circle cx="88" cy="70" r="4" fill="#FEF08A" stroke="#FBBF24" stroke-width="1" />' +
      '<circle cx="77" cy="78" r="1.5" fill="#000" />' +
      '<circle cx="83" cy="78" r="1.5" fill="#000" />' +
      '<path d="M78 84 Q80 86 82 84" stroke="#000" stroke-width="1" fill="none" />' +
      '<text x="80" y="106" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#0369A1" text-anchor="middle">ДЕТСКАЯ СМЕСЬ</text>' +
      '<text x="80" y="116" font-family="Consolas, monospace" font-size="6" fill="#0284C7" text-anchor="middle">ПРЕМИУМ ФОРМУЛА</text>' +
    '</g>';

  // L6.5: Caramel Pudding Cup (Multi-Select Hero!)
  PRODUCTS['caramel_pudding'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Glass dessert coupe
      '<defs>' +
        '<linearGradient id="pudding-custard" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#FEF08A" />' +
          '<stop offset="100%" stop-color="#FDE047" />' +
        '</linearGradient>' +
        '<linearGradient id="caramel-sauce" x1="0%" y1="0%" x2="0%" y2="100%">' +
          '<stop offset="0%" stop-color="#D97706" />' +
          '<stop offset="100%" stop-color="#78350F" />' +
        '</linearGradient>' +
      '</defs>' +
      // Tapered glass cup
      '<polygon points="44,56 116,56 104,142 56,142" fill="url(#pudding-custard)" stroke="#FBBF24" stroke-width="1.5" />' +
      // Thick caramel layer on top with drips
      '<path d="M44 56 C44 56 54 74 62 68 C70 62 76 82 86 72 C96 62 104 78 116 56 Z" fill="url(#caramel-sauce)" />' +
      '<ellipse cx="80" cy="56" rx="36" ry="8" fill="#B45309" />' +
      // Spoon resting
      '<path d="M106 38 L94 72" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />' +
      // Golden shine
      '<ellipse cx="76" cy="54" rx="14" ry="3" fill="#FDE68A" opacity="0.8" />' +
      // Text
      '<text x="80" y="112" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#78350F" text-anchor="middle">ПУДИНГ</text>' +
      '<rect x="52" y="126" width="56" height="12" rx="2" fill="#78350F" />' +
      '<text x="80" y="135" font-family="Consolas, monospace" font-size="6" fill="#FDE047" font-weight="bold" text-anchor="middle">ДЕСЕРТНЫЙ КРЕМ</text>' +
    '</g>';

  // --- LEVEL 7: FROZEN FOODS (HARDCORE) ---

  // L7.1: Cherry Dumplings Pack
  PRODUCTS['cherry_dumplings'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Frosty blue deep-freeze bag
      '<defs>' +
        '<linearGradient id="freeze-bag-grad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#38BDF8" />' +
          '<stop offset="50%" stop-color="#0284C7" />' +
          '<stop offset="100%" stop-color="#0369A1" />' +
        '</linearGradient>' +
      '</defs>' +
      '<rect x="42" y="38" width="76" height="106" rx="8" fill="url(#freeze-bag-grad)" stroke="#BAE6FD" stroke-width="2" />' +
      // Frost snowflakes
      '<text x="52" y="54" font-size="12" fill="#E0F2FE">❄</text>' +
      '<text x="100" y="60" font-size="10" fill="#E0F2FE">❄</text>' +
      // Dumpling with braided crimp
      '<path d="M54 94 C54 74 106 74 106 94 C106 104 54 104 54 94 Z" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5" />' +
      '<path d="M54 94 Q60 88 66 94 Q72 88 78 94 Q84 88 90 94 Q96 88 102 94" stroke="#94A3B8" stroke-width="1.5" fill="none" />' +
      // Cherry peaking out
      '<circle cx="80" cy="100" r="6" fill="#991B1B" />' +
      '<text x="80" y="68" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ВАРЕНИКИ</text>' +
      '<text x="80" y="78" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="7.5" fill="#FDE047" text-anchor="middle">С ВИШНЕЙ</text>' +
      '<rect x="48" y="126" width="64" height="12" rx="2" fill="#0C4A6E" />' +
      '<text x="80" y="135" font-family="Consolas, monospace" font-size="6" fill="#E0F2FE" text-anchor="middle">ЗАМОРОЗКА -18°C</text>' +
    '</g>';

  // L7.2: Frozen Cherries in Syrup
  PRODUCTS['cherries_in_syrup'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Icy pouch
      '<rect x="42" y="40" width="76" height="104" rx="8" fill="#881337" stroke="#38BDF8" stroke-width="2.5" />' +
      // Window with glossy syrup
      '<rect x="48" y="62" width="64" height="52" rx="4" fill="#BE123C" />' +
      '<circle cx="66" cy="84" r="10" fill="#4C0519" stroke="#FFF" stroke-width="1" />' +
      '<circle cx="86" cy="80" r="12" fill="#4C0519" stroke="#FFF" stroke-width="1" />' +
      '<circle cx="94" cy="98" r="9" fill="#4C0519" stroke="#FFF" stroke-width="1" />' +
      '<circle cx="74" cy="100" r="11" fill="#4C0519" stroke="#FFF" stroke-width="1" />' +
      // Ice crystals
      '<text x="52" y="56" font-size="12" fill="#38BDF8">❄</text>' +
      '<text x="80" y="56" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">ВИШНЯ ДЕСЕРТНАЯ</text>' +
      '<rect x="48" y="124" width="64" height="14" rx="2" fill="#4C0519" />' +
      '<text x="80" y="134" font-family="Consolas, monospace" font-size="6" fill="#FEF08A" font-weight="bold" text-anchor="middle">ОТБОРНАЯ ЯГОДА</text>' +
    '</g>';

  // L7.3: Sweet Potato in Sweet Sauce
  PRODUCTS['sweet_potato'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Pouch
      '<rect x="42" y="40" width="76" height="104" rx="8" fill="#C2410C" stroke="#38BDF8" stroke-width="2" />' +
      // Roasted sweet potato wedges
      '<path d="M54 94 C54 78 84 76 96 90 C104 100 84 114 68 112 Z" fill="#EA580C" stroke="#7C2D12" stroke-width="1.5" />' +
      '<ellipse cx="76" cy="92" rx="14" ry="6" fill="#FDBA74" />' +
      '<path d="M68 100 Q84 108 98 100" stroke="#F59E0B" stroke-width="3" fill="none" opacity="0.9" />' + // glaze
      '<text x="50" y="56" font-size="12" fill="#38BDF8">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">БАТАТ В СОУСЕ</text>' +
      '<rect x="48" y="124" width="64" height="14" rx="2" fill="#7C2D12" />' +
      '<text x="80" y="134" font-family="Consolas, monospace" font-size="6" fill="#FDE047" font-weight="bold" text-anchor="middle">ОВОЩНОЙ ДЕСЕРТ</text>' +
    '</g>';

  // L7.4: Frozen Waffles
  PRODUCTS['frozen_waffles'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="42" y="38" width="76" height="106" rx="6" fill="#0284C7" stroke="#7DD3FC" stroke-width="2" />' +
      // Frosty waffle inside
      '<rect x="52" y="66" width="56" height="42" rx="4" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />' +
      '<line x1="52" y1="80" x2="108" y2="80" stroke="#78350F" stroke-width="1" />' +
      '<line x1="52" y1="94" x2="108" y2="94" stroke="#78350F" stroke-width="1" />' +
      '<line x1="70" y1="66" x2="70" y2="108" stroke="#78350F" stroke-width="1" />' +
      '<line x1="90" y1="66" x2="90" y2="108" stroke="#78350F" stroke-width="1" />' +
      '<text x="50" y="54" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="54" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ВАФЛИ ТОСТЕР</text>' +
      '<text x="80" y="62" font-family="Segoe UI, sans-serif" font-size="6" fill="#E0F2FE" text-anchor="middle">С ВАНИЛЬЮ</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#0369A1" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FEF08A" font-weight="bold" text-anchor="middle">ДЛЯ ТОСТЕРА</text>' +
    '</g>';

  // L7.5: Glazed Strawberries
  PRODUCTS['glazed_strawberries'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.3" />' +
      // Frosted bag with glittering candied strawberries
      '<rect x="44" y="38" width="72" height="106" rx="8" fill="#BE123C" stroke="#38BDF8" stroke-width="2.5" />' +
      // Giant glazed strawberry
      '<path d="M80 114 C68 100 62 86 68 74 C74 62 86 62 92 74 C98 86 92 100 80 114 Z" fill="#E11D48" stroke="#FFF" stroke-width="2" />' +
      '<polygon points="76,68 80,62 84,68 80,69" fill="#22C55E" />' +
      // Sugar glaze sparkles
      '<text x="64" y="80" font-size="10" fill="#FFF">✦</text>' +
      '<text x="86" y="92" font-size="12" fill="#FFF">✦</text>' +
      '<text x="50" y="54" font-size="12" fill="#38BDF8">❄</text>' +
      '<text x="80" y="52" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#FFF" text-anchor="middle">КЛУБНИКА</text>' +
      '<text x="80" y="60" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="6.5" fill="#FEF08A" text-anchor="middle">В ГЛАЗУРИ</text>' +
      '<rect x="48" y="124" width="64" height="14" rx="2" fill="#881337" />' +
      '<text x="80" y="134" font-family="Consolas, monospace" font-size="6" fill="#FDE047" font-weight="bold" text-anchor="middle">СПЕЛАЯ ЯГОДА</text>' +
    '</g>';

  // L7.6: Dairy Dessert with Caramel
  PRODUCTS['caramel_dairy_dessert'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      // Ice cream tub
      '<polygon points="46,54 114,54 104,142 56,142" fill="#0369A1" stroke="#38BDF8" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="8" fill="#38BDF8" />' +
      // Ice cream swirl with caramel drizzle
      '<path d="M54 54 C54 36 68 28 80 28 C92 28 106 36 106 54 Z" fill="#FFFBEB" />' +
      '<path d="M60 48 Q80 34 100 48" stroke="#D97706" stroke-width="4" fill="none" stroke-linecap="round" />' +
      '<path d="M66 52 Q80 40 94 52" stroke="#B45309" stroke-width="2" fill="none" stroke-linecap="round" />' +
      '<text x="80" y="82" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ДЕСЕРТ</text>' +
      '<text x="80" y="94" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="7.5" fill="#FDE047" text-anchor="middle">С КАРАМЕЛЬЮ</text>' +
      '<rect x="52" y="122" width="56" height="14" rx="2" fill="#0C4A6E" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FEF08A" font-weight="bold" text-anchor="middle">СЛИВОЧНЫЙ КРЕМ</text>' +
    '</g>';

  // Extra Level 7 Frozen Options
  PRODUCTS['frozen_peas'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#15803D" stroke="#86EFAC" stroke-width="2" />' +
      '<circle cx="68" cy="86" r="7" fill="#22C55E" />' +
      '<circle cx="86" cy="84" r="8" fill="#22C55E" />' +
      '<circle cx="78" cy="98" r="7.5" fill="#22C55E" />' +
      '<text x="50" y="56" font-size="12" fill="#86EFAC">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">ГОРОШЕК</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#14532D" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#86EFAC" text-anchor="middle">МОЛОДОЙ ГОРОШЕК</text>' +
    '</g>';

  PRODUCTS['french_fries'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#DC2626" stroke="#F87171" stroke-width="2" />' +
      '<rect x="60" y="70" width="6" height="34" rx="2" fill="#FDE047" transform="rotate(-15 60 70)" />' +
      '<rect x="74" y="66" width="6" height="38" rx="2" fill="#FDE047" />' +
      '<rect x="88" y="72" width="6" height="32" rx="2" fill="#FDE047" transform="rotate(15 88 72)" />' +
      '<text x="50" y="56" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">КАРТОФЕЛЬ ФРИ</text>' +
    '</g>';

  PRODUCTS['chicken_nuggets'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#B45309" stroke="#FDE68A" stroke-width="2" />' +
      '<rect x="58" y="74" width="22" height="18" rx="6" fill="#F59E0B" stroke="#78350F" stroke-width="1.2" />' +
      '<rect x="78" y="86" width="24" height="18" rx="6" fill="#F59E0B" stroke="#78350F" stroke-width="1.2" />' +
      '<text x="50" y="56" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">НАГГЕТСЫ</text>' +
    '</g>';

  PRODUCTS['frozen_pizza'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<circle cx="80" cy="90" r="42" fill="#F59E0B" stroke="#B45309" stroke-width="2" />' +
      '<circle cx="80" cy="90" r="36" fill="#EF4444" />' +
      '<circle cx="80" cy="90" r="32" fill="#FEF08A" />' +
      '<circle cx="70" cy="80" r="6" fill="#991B1B" />' +
      '<circle cx="92" cy="84" r="5.5" fill="#991B1B" />' +
      '<circle cx="78" cy="102" r="6" fill="#991B1B" />' +
      '<rect x="68" y="90" width="8" height="4" rx="1" fill="#15803D" />' +
      '<text x="50" y="54" font-size="12" fill="#0284C7">❄</text>' +
      '<text x="80" y="44" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ПИЦЦА</text>' +
    '</g>';

PRODUCTS['lemon_sauce'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="34" ry="7" fill="#000" opacity="0.3" />' +
      '<path d="M70 24 L90 24 L92 46 C96 56 102 68 102 82 L102 136 C102 142 96 146 90 146 L70 146 C64 146 58 142 58 136 L58 82 C58 68 64 56 68 46 Z" fill="#FDE047" stroke="#EAB308" stroke-width="1.8" />' +
      '<rect x="60" y="80" width="40" height="38" rx="3" fill="#FEF08A" stroke="#CA8A04" stroke-width="1" />' +
      '<circle cx="80" cy="94" r="10" fill="#FACC15" stroke="#A16207" stroke-width="1" />' +
      '<path d="M80 84 L80 104 M70 94 L90 94 M73 87 L87 101 M87 87 L73 101" stroke="#FEF9C3" stroke-width="1.2" />' +
      '<text x="80" y="112" font-family="Segoe UI, sans-serif" font-weight="900" font-size="6.5" fill="#713F12" text-anchor="middle">ЛИМОННЫЙ</text>' +
      '<rect x="71" y="20" width="18" height="6" rx="2" fill="#E2E8F0" />' +
      '<rect x="72" y="14" width="16" height="8" rx="2" fill="#CA8A04" />' +
    '</g>';

  PRODUCTS['garlic_sauce'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="52" y="52" width="56" height="90" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />' +
      '<circle cx="64" cy="74" r="1.5" fill="#22C55E" />' +
      '<circle cx="88" cy="80" r="1.5" fill="#22C55E" />' +
      '<circle cx="72" cy="120" r="1.8" fill="#22C55E" />' +
      '<circle cx="90" cy="116" r="1.5" fill="#22C55E" />' +
      '<rect x="52" y="82" width="56" height="32" fill="#F1F5F9" stroke="#94A3B8" stroke-width="1" />' +
      '<path d="M75 98 C72 98 70 95 72 90 C74 85 80 82 80 82 C80 82 86 85 88 90 C90 95 88 98 85 98 Z" fill="#FEF08A" stroke="#CA8A04" stroke-width="1" />' +
      '<text x="80" y="108" font-family="Segoe UI, sans-serif" font-weight="900" font-size="6.5" fill="#334155" text-anchor="middle">ЧЕСНОЧНЫЙ</text>' +
      '<rect x="50" y="44" width="60" height="12" rx="4" fill="#0D9488" stroke="#115E59" stroke-width="1.5" />' +
    '</g>';

  // Extra Canned Foods (Level 5)
  PRODUCTS['canned_beef'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="56" width="68" height="86" rx="4" fill="#991B1B" stroke="#B45309" stroke-width="2" />' +
      '<ellipse cx="80" cy="56" rx="34" ry="10" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="56" rx="26" ry="6" fill="#D97706" />' +
      '<rect x="46" y="76" width="68" height="46" fill="#7F1D1D" stroke="#F59E0B" stroke-width="1" />' +
      '<path d="M68 96 C64 96 62 90 68 86 C74 82 86 82 92 86 C98 90 96 96 92 96 Z" fill="#F87171" />' +
      '<text x="80" y="106" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FEF08A" text-anchor="middle">ГОВЯДИНА</text>' +
      '<text x="80" y="116" font-family="Consolas, monospace" font-size="6.5" fill="#FFF" font-weight="bold" text-anchor="middle">ТУШЕНАЯ В С/С</text>' +
      '<ellipse cx="80" cy="142" rx="34" ry="8" fill="#7F1D1D" stroke="#B45309" stroke-width="1.5" />' +
    '</g>';

  PRODUCTS['canned_fish'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="44" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="66" width="72" height="76" rx="6" fill="#0284C7" stroke="#38BDF8" stroke-width="2" />' +
      '<ellipse cx="80" cy="66" rx="36" ry="10" fill="#BAE6FD" stroke="#0284C7" stroke-width="1.5" />' +
      '<path d="M62 100 Q80 88 98 100 Q80 112 62 100 Z" fill="#E0F2FE" stroke="#0369A1" stroke-width="1.5" />' +
      '<circle cx="88" cy="98" r="1.5" fill="#0369A1" />' +
      '<text x="80" y="86" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">РЫБНЫЕ КОНСЕРВЫ</text>' +
      '<rect x="48" y="120" width="64" height="14" rx="2" fill="#075985" />' +
      '<text x="80" y="130" font-family="Consolas, monospace" font-size="6" fill="#38BDF8" font-weight="bold" text-anchor="middle">В МАСЛЕ / ТОМАТЕ</text>' +
    '</g>';

  PRODUCTS['canned_sprats'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="46" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="40" y="74" width="80" height="66" rx="8" fill="#D97706" stroke="#FDE68A" stroke-width="2" />' +
      '<ellipse cx="80" cy="74" rx="40" ry="12" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />' +
      '<path d="M54 104 Q80 96 106 104 Q80 112 54 104 Z" fill="#FEF3C7" stroke="#92400E" stroke-width="1.2" />' +
      '<text x="80" y="94" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ШПРОТЫ</text>' +
      '<text x="80" y="126" font-family="Consolas, monospace" font-size="6.5" fill="#FEF3C7" font-weight="bold" text-anchor="middle">В МАСЛЕ • ЗОЛОТЫЕ</text>' +
    '</g>';

  PRODUCTS['canned_pineapple'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="54" width="68" height="88" rx="4" fill="#EAB308" stroke="#CA8A04" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="10" fill="#FEF08A" stroke="#CA8A04" stroke-width="1.5" />' +
      '<circle cx="80" cy="98" r="16" fill="#FDE047" stroke="#A16207" stroke-width="2" />' +
      '<circle cx="80" cy="98" r="6" fill="#EAB308" />' +
      '<text x="80" y="78" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#713F12" text-anchor="middle">АНАНАСЫ</text>' +
      '<text x="80" y="128" font-family="Consolas, monospace" font-size="6.5" fill="#713F12" font-weight="bold" text-anchor="middle">ОТБОРНЫЕ</text>' +
    '</g>';

  PRODUCTS['canned_peaches'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="54" width="68" height="88" rx="4" fill="#F97316" stroke="#C2410C" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="10" fill="#FED7AA" stroke="#C2410C" stroke-width="1.5" />' +
      '<circle cx="75" cy="96" r="14" fill="#FB923C" stroke="#9A3412" stroke-width="1.5" />' +
      '<circle cx="86" cy="98" r="12" fill="#FDBA74" stroke="#9A3412" stroke-width="1.5" />' +
      '<text x="80" y="78" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ПЕРСИКИ</text>' +
      '<text x="80" y="128" font-family="Consolas, monospace" font-size="6.5" fill="#FEF08A" font-weight="bold" text-anchor="middle">ОТБОРНЫЕ</text>' +
    '</g>';

  PRODUCTS['canned_pears'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="54" width="68" height="88" rx="4" fill="#65A30D" stroke="#4D7C0F" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="10" fill="#D9F99D" stroke="#4D7C0F" stroke-width="1.5" />' +
      '<path d="M76 86 C72 92 68 96 68 104 C68 112 74 116 80 116 C86 116 92 112 92 104 C92 96 88 92 84 86 Z" fill="#A3E635" stroke="#3F6212" stroke-width="1.5" />' +
      '<text x="80" y="76" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#FFF" text-anchor="middle">ГРУШИ</text>' +
      '<text x="80" y="130" font-family="Consolas, monospace" font-size="6.5" fill="#FEF08A" font-weight="bold" text-anchor="middle">ОТБОРНЫЕ</text>' +
    '</g>';

  PRODUCTS['canned_mandarins'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="54" width="68" height="88" rx="4" fill="#EA580C" stroke="#9A3412" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="10" fill="#FFEDD5" stroke="#9A3412" stroke-width="1.5" />' +
      '<path d="M68 92 A16 16 0 0 1 92 92 Z" fill="#FB923C" stroke="#7C2D12" stroke-width="1.2" transform="rotate(-20 80 92)" />' +
      '<path d="M72 106 A16 16 0 0 1 96 106 Z" fill="#FDBA74" stroke="#7C2D12" stroke-width="1.2" transform="rotate(15 84 106)" />' +
      '<text x="80" y="76" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">МАНДАРИНЫ</text>' +
      '<text x="80" y="130" font-family="Consolas, monospace" font-size="6.5" fill="#FEF08A" font-weight="bold" text-anchor="middle">ОТБОРНЫЕ</text>' +
    '</g>';

  PRODUCTS['canned_apples'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="54" width="68" height="88" rx="4" fill="#DC2626" stroke="#991B1B" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="10" fill="#FEE2E2" stroke="#991B1B" stroke-width="1.5" />' +
      '<circle cx="74" cy="98" r="12" fill="#EF4444" stroke="#7F1D1D" stroke-width="1.5" />' +
      '<circle cx="86" cy="98" r="12" fill="#84CC16" stroke="#365314" stroke-width="1.5" />' +
      '<text x="80" y="76" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#FFF" text-anchor="middle">ЯБЛОКИ</text>' +
      '<text x="80" y="128" font-family="Consolas, monospace" font-size="6.5" fill="#FEF08A" font-weight="bold" text-anchor="middle">ОТБОРНЫЕ</text>' +
    '</g>';

  PRODUCTS['canned_berries'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="54" width="68" height="88" rx="4" fill="#701A75" stroke="#4A044E" stroke-width="2" />' +
      '<ellipse cx="80" cy="54" rx="34" ry="10" fill="#FDF4FF" stroke="#4A044E" stroke-width="1.5" />' +
      '<circle cx="70" cy="96" r="8" fill="#BE185D" />' +
      '<circle cx="88" cy="94" r="7" fill="#3B82F6" />' +
      '<circle cx="78" cy="106" r="7.5" fill="#9333EA" />' +
      '<text x="80" y="76" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">КОМПОТ</text>' +
      '<text x="80" y="128" font-family="Consolas, monospace" font-size="6.5" fill="#FBCFE8" font-weight="bold" text-anchor="middle">ЯГОДНЫЙ</text>' +
    '</g>';

  PRODUCTS['canned_tomato_paste'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="40" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="48" y="58" width="64" height="84" rx="4" fill="#B91C1C" stroke="#7F1D1D" stroke-width="2" />' +
      '<ellipse cx="80" cy="58" rx="32" ry="9" fill="#15803D" stroke="#166534" stroke-width="1.5" />' +
      '<circle cx="80" cy="96" r="15" fill="#EF4444" stroke="#991B1B" stroke-width="1.8" />' +
      '<path d="M78 81 C78 81 80 76 84 76" stroke="#22C55E" stroke-width="2" fill="none" />' +
      '<text x="80" y="120" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7" fill="#FEF08A" text-anchor="middle">ТОМАТНАЯ ПАСТА</text>' +
    '</g>';

  // Extra Frozen Foods (Level 7)
  PRODUCTS['frozen_carrot'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#C2410C" stroke="#FB923C" stroke-width="2" />' +
      '<path d="M68 68 L92 84 L64 104 Z" fill="#F97316" stroke="#EA580C" stroke-width="1.5" />' +
      '<path d="M62 64 L68 70 M66 60 L70 68" stroke="#22C55E" stroke-width="2" stroke-linecap="round" />' +
      '<text x="50" y="56" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">МОРКОВЬ</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#7C2D12" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FED7AA" text-anchor="middle">ЗАМОРОЗКА</text>' +
    '</g>';

  PRODUCTS['frozen_berries'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#1E1B4B" stroke="#6366F1" stroke-width="2" />' +
      '<circle cx="68" cy="84" r="8" fill="#3B82F6" stroke="#1D4ED8" stroke-width="1.2" />' +
      '<circle cx="86" cy="82" r="7.5" fill="#4338CA" stroke="#312E81" stroke-width="1.2" />' +
      '<circle cx="78" cy="98" r="8.5" fill="#6366F1" stroke="#3730A3" stroke-width="1.2" />' +
      '<text x="50" y="56" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">ЧЕРНИКА</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#312E81" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#C7D2FE" text-anchor="middle">100% ЯГОДЫ</text>' +
    '</g>';

  PRODUCTS['frozen_strawberry'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#881337" stroke="#FB7185" stroke-width="2" />' +
      '<path d="M66 80 C62 86 64 96 74 104 C78 108 82 108 86 104 C96 96 98 86 94 80 C90 74 70 74 66 80 Z" fill="#E11D48" stroke="#BE123C" stroke-width="1.5" />' +
      '<text x="50" y="56" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">КЛУБНИКА</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#4C0519" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FECDD3" text-anchor="middle">СПЕЛАЯ КЛУБНИКА</text>' +
    '</g>';

  PRODUCTS['frozen_mango'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="38" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="40" width="72" height="102" rx="6" fill="#CA8A04" stroke="#FDE047" stroke-width="2" />' +
      '<rect x="62" y="76" width="16" height="16" rx="3" fill="#FACC15" stroke="#A16207" stroke-width="1.2" />' +
      '<rect x="82" y="80" width="16" height="16" rx="3" fill="#FBBF24" stroke="#A16207" stroke-width="1.2" />' +
      '<rect x="70" y="96" width="16" height="16" rx="3" fill="#EAB308" stroke="#A16207" stroke-width="1.2" />' +
      '<text x="50" y="56" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="58" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#FFF" text-anchor="middle">МАНГО</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#713F12" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FEF08A" text-anchor="middle">КУБИКИ МАНГО</text>' +
    '</g>';

  PRODUCTS['pancakes_curd'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="46" width="72" height="96" rx="6" fill="#D97706" stroke="#FDE68A" stroke-width="2" />' +
      '<ellipse cx="80" cy="80" rx="24" ry="8" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="94" rx="24" ry="8" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5" />' +
      '<ellipse cx="80" cy="108" rx="24" ry="8" fill="#FEF3C7" stroke="#B45309" stroke-width="1.5" />' +
      '<text x="50" y="58" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="60" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#FFF" text-anchor="middle">БЛИНЧИКИ</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#78350F" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FEF3C7" text-anchor="middle">С ТВОРОГОМ</text>' +
    '</g>';

  PRODUCTS['croissants_cheese'] = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="44" y="46" width="72" height="96" rx="6" fill="#B45309" stroke="#FDE68A" stroke-width="2" />' +
      '<path d="M58 96 C58 84 70 78 80 78 C90 78 102 84 102 96 C98 94 92 90 80 90 C68 90 62 94 58 96 Z" fill="#FDE047" stroke="#78350F" stroke-width="1.5" />' +
      '<text x="50" y="58" font-size="12" fill="#BAE6FD">❄</text>' +
      '<text x="80" y="60" font-family="Segoe UI, sans-serif" font-weight="900" font-size="7.5" fill="#FFF" text-anchor="middle">КРУАССАНЫ</text>' +
      '<rect x="48" y="122" width="64" height="14" rx="2" fill="#451A03" />' +
      '<text x="80" y="132" font-family="Consolas, monospace" font-size="6" fill="#FEF3C7" text-anchor="middle">С СЫРОМ</text>' +
    '</g>';

  // Vibrant supermarket product fallback SVG
  var GENERIC_PRODUCT_SVG = 
    COMMON_DEFS +
    '<g class="product-body">' +
      '<ellipse cx="80" cy="148" rx="42" ry="7" fill="#000" opacity="0.3" />' +
      '<rect x="46" y="44" width="68" height="96" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2" />' +
      '<rect x="46" y="70" width="68" height="42" fill="#0F172A" stroke="#0284C7" stroke-width="1" />' +
      '<circle cx="80" cy="91" r="16" fill="#F59E0B" opacity="0.25" />' +
      '<circle cx="80" cy="91" r="12" fill="#F59E0B" />' +
      '<text x="80" y="96" font-size="14" text-anchor="middle">🔍</text>' +
      '<text x="80" y="60" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#38BDF8" text-anchor="middle">ПРОДУКТ</text>' +
      '<text x="80" y="124" font-family="Consolas, monospace" font-weight="bold" font-size="6.5" fill="#FEF08A" text-anchor="middle">ЭТИКЕТКА</text>' +
    '</g>';

  // ==========================================
  // 3. KEY ALIAS MAPPING
  // ==========================================

  var KEY_ALIASES = {
    // Level 1: Drinks
    'l1_q1': 'soda_bottle',
    'soda': 'soda_bottle',
    'soda_can': 'soda_bottle',
    'soda_bottle': 'soda_bottle',
    'cola': 'soda_bottle',
    'газировка': 'soda_bottle',
    'сладкая газировка': 'soda_bottle',
    'газировка 0.5 л': 'soda_bottle',
    'газировка 0.5л': 'soda_bottle',

    'l1_q2': 'cherry_juice',
    'juice': 'cherry_juice',
    'cherry_juice': 'cherry_juice',
    'cherry_juice_1l': 'cherry_juice',
    'вишневый сок': 'cherry_juice',
    'вишнёвый сок': 'cherry_juice',
    'вишневый сок 1 л': 'cherry_juice',
    'вишнёвый сок 1 л': 'cherry_juice',
    'сок': 'cherry_juice',

    'l1_q3': 'iced_tea',
    'cold_tea': 'iced_tea',
    'iced_tea': 'iced_tea',
    'холодный чай': 'iced_tea',
    'холодный чай 0.5 л': 'iced_tea',
    'чай': 'iced_tea',

    'l1_q4': 'energy_drink',
    'energy': 'energy_drink',
    'energy_drink': 'energy_drink',
    'энергетик': 'energy_drink',
    'энергетический напиток': 'energy_drink',
    'энергетик 0.25 л': 'energy_drink',

    'l1_q5': 'drinking_yogurt',
    'yogurt_drink': 'drinking_yogurt',
    'drinking_yogurt': 'drinking_yogurt',
    'питьевой йогурт': 'drinking_yogurt',

    'l1_q6': 'fruit_water',
    'water': 'fruit_water',
    'fruit_water': 'fruit_water',
    'фруктовая вода': 'fruit_water',

    // Level 2: Breakfasts
    'l2_q1': 'cornflakes_box',
    'cornflakes': 'cornflakes_box',
    'corn_flakes': 'cornflakes_box',
    'cornflakes_box': 'cornflakes_box',
    'кукурузные хлопья': 'cornflakes_box',

    'l2_q2': 'strawberry_yogurt_cup',
    'strawberry_yogurt': 'strawberry_yogurt_cup',
    'strawberry_yogurt_cup': 'strawberry_yogurt_cup',
    'клубничный йогурт': 'strawberry_yogurt_cup',
    'фруктовый йогурт': 'strawberry_yogurt_cup',

    'l2_q3': 'granola_bar',
    'muesli_bar': 'granola_bar',
    'granola_bar': 'granola_bar',
    'батончик мюсли': 'granola_bar',
    'батончик мюсли «злаки и фрукты»': 'granola_bar',
    'мюсли': 'granola_bar',

    'l2_q4': 'toast_bread',
    'toast': 'toast_bread',
    'toast_bread': 'toast_bread',
    'bread': 'toast_bread',
    'хлеб для тостов': 'toast_bread',
    'хлеб': 'toast_bread',

    'l2_q5': 'oatmeal_pack',
    'instant_oatmeal': 'oatmeal_pack',
    'oatmeal_pack': 'oatmeal_pack',
    'oatmeal_instant': 'oatmeal_pack',
    'овсяная каша быстрого приготовления': 'oatmeal_pack',
    'овсяная каша б/п': 'oatmeal_pack',
    'каша': 'oatmeal_pack',

    'l2_q6': 'chocolate_puffs',
    'choco_balls': 'chocolate_puffs',
    'chocolate_puffs': 'chocolate_puffs',
    'chocolate_balls': 'chocolate_puffs',
    'шоколадные шарики': 'chocolate_puffs',

    // Level 3: Snacks
    'l3_q1': 'grain_bar',
    'cereal_bar': 'grain_bar',
    'grain_bar': 'grain_bar',
    'злаковый батончик': 'grain_bar',
    'злаковый батончик с орехами': 'grain_bar',

    'l3_q2': 'oatmeal_cookies',
    'oat_cookie': 'oatmeal_cookies',
    'oatmeal_cookies': 'oatmeal_cookies',
    'cookies': 'oatmeal_cookies',
    'печенье с овсяными хлопьями': 'oatmeal_cookies',
    'овсяное печенье': 'oatmeal_cookies',
    'печенье': 'oatmeal_cookies',

    'l3_q3': 'chocolate_milk',
    'choco_milk': 'chocolate_milk',
    'chocolate_milk': 'chocolate_milk',
    'шоколадное молоко': 'chocolate_milk',

    'l3_q4': 'vanilla_waffles',
    'waffles': 'vanilla_waffles',
    'vanilla_waffles': 'vanilla_waffles',
    'вафли с ванильной начинкой': 'vanilla_waffles',
    'вафли с ванилином': 'vanilla_waffles',
    'вафли': 'vanilla_waffles',

    'l3_q5': 'peach_curd',
    'curd_peach': 'peach_curd',
    'peach_curd': 'peach_curd',
    'curd': 'peach_curd',
    'творожок с персиком': 'peach_curd',
    'творожок': 'peach_curd',

    'l3_q6': 'banana_shake',
    'banana_milkshake': 'banana_shake',
    'banana_shake': 'banana_shake',
    'banana_cocktail': 'banana_shake',
    'банановый молочный коктейль': 'banana_shake',
    'банановый коктейль': 'banana_shake',

    // Level 4: Sauces
    'l4_q1': 'ketchup_bottle',
    'ketchup': 'ketchup_bottle',
    'ketchup_bottle': 'ketchup_bottle',
    'кетчуп': 'ketchup_bottle',
    'томатный кетчуп': 'ketchup_bottle',

    'l4_q2': 'bbq_sauce_bottle',
    'bbq': 'bbq_sauce_bottle',
    'bbq_sauce': 'bbq_sauce_bottle',
    'bbq_sauce_bottle': 'bbq_sauce_bottle',
    'соус барбекю': 'bbq_sauce_bottle',
    'барбекю': 'bbq_sauce_bottle',

    'l4_q3': 'hot_sauce_bottle',
    'hot_sauce': 'hot_sauce_bottle',
    'hot_sauce_bottle': 'hot_sauce_bottle',
    'острый соус': 'hot_sauce_bottle',
    'острый соус чили': 'hot_sauce_bottle',

    'l4_q4': 'teriyaki_bottle',
    'teriyaki': 'teriyaki_bottle',
    'teriyaki_sauce': 'teriyaki_bottle',
    'teriyaki_bottle': 'teriyaki_bottle',
    'соус терияки': 'teriyaki_bottle',
    'японский соус терияки': 'teriyaki_bottle',
    'терияки': 'teriyaki_bottle',

    'lemon_sauce': 'lemon_sauce',
    'лимонный соус': 'lemon_sauce',
    'garlic_sauce': 'garlic_sauce',
    'чесночный соус': 'garlic_sauce',
    'mayo': 'mayonnaise_jar',
    'mayonnaise': 'mayonnaise_jar',
    'майонез': 'mayonnaise_jar',
    'mustard': 'mustard_jar',
    'горчица': 'mustard_jar',
    'soy_sauce': 'soy_sauce_bottle',
    'соевый соус': 'soy_sauce_bottle',

    // Level 5: Canned Foods
    'l5_q1': 'canned_tuna',
    'tuna_can': 'canned_tuna',
    'canned_tuna': 'canned_tuna',
    'tuna': 'canned_tuna',
    'тунец в собственном соку': 'canned_tuna',
    'тунец в с/с': 'canned_tuna',
    'тунец': 'canned_tuna',
    'белковые и овощные консервы': 'canned_tuna',

    'l5_q2': 'canned_cherries',
    'cherry_canned': 'canned_cherries',
    'canned_cherries': 'canned_cherries',
    'вишня в собственном соку': 'canned_cherries',
    'вишня в с/с': 'canned_cherries',
    'фруктовые и ягодные консервы': 'canned_cherries',

    'l5_q3': 'canned_olives',
    'olives_can': 'canned_olives',
    'canned_olives': 'canned_olives',
    'olives': 'canned_olives',
    'маслины с косточкой': 'canned_olives',
    'маслины': 'canned_olives',
    'рыбные и овощные консервы': 'canned_olives',

    'l5_q4': 'canned_beans',
    'beans_canned': 'canned_beans',
    'canned_beans': 'canned_beans',
    'beans': 'canned_beans',
    'фасоль натуральная': 'canned_beans',
    'фасоль': 'canned_beans',
    'соусы и бобовые консервы': 'canned_beans',

    // Canned food options
    'beef_own_juice': 'canned_beef',
    'говядина в собственном соку': 'canned_beef',
    'tuna_own_juice': 'canned_tuna',
    'corn_water': 'sweet_corn',
    'кукуруза в воде': 'sweet_corn',
    'кукуруза': 'sweet_corn',
    'sweet_corn': 'sweet_corn',
    'peas_water': 'frozen_peas',
    'горошек в воде': 'frozen_peas',
    'beans_tomato': 'canned_beans',
    'фасоль в томатном соусе': 'canned_beans',
    'veggie_ragout': 'lecho_jar',
    'овощное рагу в томатном соусе': 'lecho_jar',
    'лечо в томатном соусе': 'lecho_jar',
    'lecho_tomato': 'lecho_jar',
    'лечо': 'lecho_jar',
    'mackerel_oil': 'canned_fish',
    'скумбрия в масле': 'canned_fish',
    'tomatoes_own_juice': 'canned_tomato_paste',
    'помидоры в собственном соку': 'canned_tomato_paste',
    'tomato_paste': 'canned_tomato_paste',
    'томатная паста': 'canned_tomato_paste',
    'pineapple_syrup': 'canned_pineapple',
    'ананасы в сиропе': 'canned_pineapple',
    'peaches_syrup': 'canned_peaches',
    'персики в сиропе': 'canned_peaches',
    'pears_syrup': 'canned_pears',
    'груши в сиропе': 'canned_pears',
    'mandarins_syrup': 'canned_mandarins',
    'мандарины в сиропе': 'canned_mandarins',
    'cherry_own_juice': 'canned_cherries',
    'strawberries_syrup': 'glazed_strawberries',
    'клубника в сиропе': 'glazed_strawberries',
    'berry_compote': 'canned_berries',
    'ягодный компот (ассорти)': 'canned_berries',
    'ягодный компот': 'canned_berries',
    'apples_syrup': 'canned_apples',
    'яблоки в сиропе': 'canned_apples',
    'tuna_tomato': 'canned_tuna',
    'tuna_oil': 'canned_tuna',
    'сардины в томатном соусе': 'canned_fish',
    'sardines_tomato': 'canned_fish',
    'шпроты в масле': 'canned_sprats',
    'sprats_oil': 'canned_sprats',
    'кукуруза в сиропе': 'sweet_corn',
    'corn_syrup': 'sweet_corn',
    'горошек в сиропе': 'frozen_peas',
    'peas_syrup': 'frozen_peas',
    'оливки без косточек': 'canned_olives',
    'olives_pitted': 'canned_olives',
    'olives_with_pit': 'canned_olives',
    'горбуша в собственном соку': 'canned_fish',
    'pink_salmon': 'canned_fish',
    'beans_natural': 'canned_beans',

    // Level 6: Dairy
    'l6_q1': 'berry_yogurt',
    'berry_yogurt': 'berry_yogurt',
    'питьевой йогурт с лесными ягодами': 'berry_yogurt',
    'питьевой йогурт со вкусом лесных ягод': 'berry_yogurt',
    'йогурт лесные ягоды': 'berry_yogurt',

    'l6_q2': 'condensed_milk',
    'condensed_milk': 'condensed_milk',
    'сгущенное молоко': 'condensed_milk',
    'сгущённое молоко': 'condensed_milk',
    'сгущенка': 'condensed_milk',
    'сгущёнка': 'condensed_milk',

    'l6_q3': 'coffee_drink',
    'coffee_drink': 'coffee_drink',
    'кофейный молочный напиток': 'coffee_drink',
    'кофейный напиток': 'coffee_drink',

    'l6_q4': 'baby_formula',
    'baby_formula': 'baby_formula',
    'детская молочная смесь': 'baby_formula',
    'детская смесь': 'baby_formula',

    'l6_q5': 'caramel_pudding',
    'caramel_pudding': 'caramel_pudding',
    'pudding': 'caramel_pudding',
    'карамельный молочный пудинг': 'caramel_pudding',
    'карамельный пудинг': 'caramel_pudding',

    // Level 7: Frozen Foods
    'l7_q1': 'cherry_dumplings',
    'cherry_vareniki': 'cherry_dumplings',
    'cherry_dumplings': 'cherry_dumplings',
    'dumplings': 'cherry_dumplings',
    'замороженные вареники с вишней': 'cherry_dumplings',
    'вареники с вишней': 'cherry_dumplings',
    'овощи vs вареники с вишней': 'cherry_dumplings',

    'l7_q2': 'cherries_in_syrup',
    'cherry_syrup_frozen': 'cherries_in_syrup',
    'cherries_in_syrup': 'cherries_in_syrup',
    'замороженная вишня в сахарном сиропе': 'cherries_in_syrup',
    'вишня в сахарном сиропе': 'cherries_in_syrup',
    'ягоды vs вишня в сахарном сиропе': 'cherries_in_syrup',

    'l7_q3': 'sweet_potato',
    'sweet_sweet_potato': 'sweet_potato',
    'sweet_potato': 'sweet_potato',
    'замороженный батат в сладком соусе': 'sweet_potato',
    'батат в сладком соусе': 'sweet_potato',
    'батат': 'sweet_potato',

    'l7_q4': 'frozen_waffles',
    'frozen_waffles': 'frozen_waffles',
    'замороженные вафли с ванильной начинкой': 'frozen_waffles',
    'замороженные вафли': 'frozen_waffles',
    'полуфабрикаты vs вафли с ванильной начинкой': 'frozen_waffles',

    'l7_q5': 'glazed_strawberries',
    'glazed_strawberry': 'glazed_strawberries',
    'glazed_strawberries': 'glazed_strawberries',
    'замороженная клубника с сахарной глазировкой': 'glazed_strawberries',
    'клубника с сахарной глазировкой': 'glazed_strawberries',
    'клубника с глазировкой': 'glazed_strawberries',
    'ягоды vs клубника с сахарной глазировкой': 'glazed_strawberries',

    'l7_q6': 'caramel_dairy_dessert',
    'caramel_dessert': 'caramel_dairy_dessert',
    'caramel_dairy_dessert': 'caramel_dairy_dessert',
    'замороженный молочный десерт с карамельным соусом': 'caramel_dairy_dessert',
    'молочный десерт с карамельным соусом': 'caramel_dairy_dessert',
    'молочный десерт с карамельным соусом (финал)': 'caramel_dairy_dessert',

    // Frozen options
    'peas': 'frozen_peas',
    'замороженный зеленый горошек': 'frozen_peas',
    'замороженный зелёный горошек': 'frozen_peas',
    'corn': 'sweet_corn',
    'замороженная кукуруза': 'sweet_corn',
    'carrot': 'frozen_carrot',
    'замороженная морковь': 'frozen_carrot',
    'french_fries': 'french_fries',
    'замороженный картофель по-деревенски': 'french_fries',
    'замороженный картофель фри': 'french_fries',
    'картофель фри': 'french_fries',
    'картофель': 'french_fries',
    'strawberry': 'frozen_strawberry',
    'замороженная клубника': 'frozen_strawberry',
    'blueberry': 'frozen_berries',
    'замороженная черника': 'frozen_berries',
    'peach_mango': 'canned_peaches',
    'замороженная смесь персика и манго': 'canned_peaches',
    'cherry_syrup': 'cherries_in_syrup',
    'pineapple': 'canned_pineapple',
    'замороженные кусочки ананаса': 'canned_pineapple',
    'veggies_carrot': 'frozen_carrot',
    'замороженные овощи с морковью': 'frozen_carrot',
    'chicken_nuggets': 'chicken_nuggets',
    'замороженные куриные наггетсы': 'chicken_nuggets',
    'куриные наггетсы': 'chicken_nuggets',
    'nuggets': 'chicken_nuggets',
    'pancakes_curd': 'pancakes_curd',
    'замороженные блинчики с творогом': 'pancakes_curd',
    'блинчики с творогом': 'pancakes_curd',
    'vareniki_potato': 'cherry_dumplings',
    'замороженные вареники с картофелем': 'cherry_dumplings',
    'croissants_cheese': 'croissants_cheese',
    'замороженные круассаны с сыром': 'croissants_cheese',
    'круассаны с сыром': 'croissants_cheese',
    'waffles_vanilla': 'frozen_waffles',
    'pizza_veggie': 'frozen_pizza',
    'замороженная пицца с овощами': 'frozen_pizza',
    'пицца с овощами': 'frozen_pizza',
    'mango': 'frozen_mango',
    'замороженное манго': 'frozen_mango',
    'cherry': 'canned_cherries',
    'замороженная вишня': 'canned_cherries',
    'berry_mix': 'frozen_berries',
    'замороженная ягодная смесь': 'frozen_berries',
    'berry_dessert': 'canned_berries',
    'замороженный ягодный десерт': 'canned_berries'
  };

  function resolveProductKey(rawKey) {
    if (!rawKey) return 'soda_bottle';
    
    // 1. Direct and normalized lookup
    var rawStr = String(rawKey).trim().toLowerCase();
    var clean = rawStr.replace(/[\s\-_.]+/g, '_');
    
    if (PRODUCTS[clean]) return clean;
    if (KEY_ALIASES[clean] && PRODUCTS[KEY_ALIASES[clean]]) return KEY_ALIASES[clean];
    if (KEY_ALIASES[rawStr] && PRODUCTS[KEY_ALIASES[rawStr]]) return KEY_ALIASES[rawStr];

    // Strip leading emoji or punctuation
    var noEmoji = rawStr.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    var noEmojiClean = noEmoji.replace(/[\s\-_.]+/g, '_');
    if (PRODUCTS[noEmojiClean]) return noEmojiClean;
    if (KEY_ALIASES[noEmojiClean] && PRODUCTS[KEY_ALIASES[noEmojiClean]]) return KEY_ALIASES[noEmojiClean];
    if (KEY_ALIASES[noEmoji] && PRODUCTS[KEY_ALIASES[noEmoji]]) return KEY_ALIASES[noEmoji];

    // 2. Keyword/Semantic Stemming
    var stems = [
      { rx: /soda|газиров|кола|cola/i, target: 'soda_bottle' },
      { rx: /вишн.*сок|cherry.*juice/i, target: 'cherry_juice' },
      { rx: /сок|juice/i, target: 'cherry_juice' },
      { rx: /чай|tea/i, target: 'iced_tea' },
      { rx: /энергет|energy/i, target: 'energy_drink' },
      { rx: /клубнич.*йогурт|strawberry.*yogurt/i, target: 'strawberry_yogurt_cup' },
      { rx: /лесн.*ягод|berry.*yogurt/i, target: 'berry_yogurt' },
      { rx: /йогурт|yogurt/i, target: 'drinking_yogurt' },
      { rx: /вод[аы]|water/i, target: 'fruit_water' },
      { rx: /хлопь|corn.*flake/i, target: 'cornflakes_box' },
      { rx: /мюсли|гранол|granola/i, target: 'granola_bar' },
      { rx: /хлеб|тост|bread|toast/i, target: 'toast_bread' },
      { rx: /каш|овсян|oatmeal/i, target: 'oatmeal_pack' },
      { rx: /шарик|puffs|balls/i, target: 'chocolate_puffs' },
      { rx: /батончик|grain.*bar|cereal/i, target: 'grain_bar' },
      { rx: /печень|cookie/i, target: 'oatmeal_cookies' },
      { rx: /шоколад.*молок|choco.*milk/i, target: 'chocolate_milk' },
      { rx: /сгущен|сгущён|condensed/i, target: 'condensed_milk' },
      { rx: /кофе|coffee/i, target: 'coffee_drink' },
      { rx: /детск.*смесь|baby.*formula/i, target: 'baby_formula' },
      { rx: /пудинг|pudding/i, target: 'caramel_pudding' },
      { rx: /вафл|waffle/i, target: 'vanilla_waffles' },
      { rx: /творог|творожок|curd/i, target: 'peach_curd' },
      { rx: /коктейл|шейк|shake/i, target: 'banana_shake' },
      { rx: /кетчуп|ketchup/i, target: 'ketchup_bottle' },
      { rx: /барбекю|bbq/i, target: 'bbq_sauce_bottle' },
      { rx: /остр|чили|hot.*sauce/i, target: 'hot_sauce_bottle' },
      { rx: /терияк|teriyaki/i, target: 'teriyaki_bottle' },
      { rx: /майонез|mayo/i, target: 'mayonnaise_jar' },
      { rx: /горчиц|mustard/i, target: 'mustard_jar' },
      { rx: /соев|soy/i, target: 'soy_sauce_bottle' },
      { rx: /лимон|lemon/i, target: 'lemon_sauce' },
      { rx: /чесноч|garlic/i, target: 'garlic_sauce' },
      { rx: /тунец|tuna/i, target: 'canned_tuna' },
      { rx: /говядин|beef|мясо/i, target: 'canned_beef' },
      { rx: /кукуруз|corn/i, target: 'sweet_corn' },
      { rx: /горош|горох|peas/i, target: 'frozen_peas' },
      { rx: /фасол|bean/i, target: 'canned_beans' },
      { rx: /лечо|рагу|lecho/i, target: 'lecho_jar' },
      { rx: /скумбри|сардин|горбуш|рыб|salmon|fish/i, target: 'canned_fish' },
      { rx: /шпрот|sprat/i, target: 'canned_sprats' },
      { rx: /томат|паст/i, target: 'canned_tomato_paste' },
      { rx: /маслин|оливк|olive/i, target: 'canned_olives' },
      { rx: /ананас|pineapple/i, target: 'canned_pineapple' },
      { rx: /персик|peach/i, target: 'canned_peaches' },
      { rx: /груш|pear/i, target: 'canned_pears' },
      { rx: /мандарин|mandarin/i, target: 'canned_mandarins' },
      { rx: /яблок|apple/i, target: 'canned_apples' },
      { rx: /вишн|cherry/i, target: 'canned_cherries' },
      { rx: /клубник.*глазир|glazed.*strawberr/i, target: 'glazed_strawberries' },
      { rx: /клубник|strawberr/i, target: 'frozen_strawberry' },
      { rx: /черник|blueberr/i, target: 'frozen_berries' },
      { rx: /ягод|компот|berry/i, target: 'canned_berries' },
      { rx: /манго|mango/i, target: 'frozen_mango' },
      { rx: /вареник|dumpling/i, target: 'cherry_dumplings' },
      { rx: /батат|sweet.*potato/i, target: 'sweet_potato' },
      { rx: /морков|carrot/i, target: 'frozen_carrot' },
      { rx: /картофел.*фри|деревенск|fries|potato/i, target: 'french_fries' },
      { rx: /наггетс|nugget/i, target: 'chicken_nuggets' },
      { rx: /блинчик|блин|pancake/i, target: 'pancakes_curd' },
      { rx: /круассан|croissant/i, target: 'croissants_cheese' },
      { rx: /пицц|pizza/i, target: 'frozen_pizza' },
      { rx: /карамел.*десерт|молочн.*десерт|dessert/i, target: 'caramel_dairy_dessert' }
    ];

    for (var i = 0; i < stems.length; i++) {
      if (stems[i].rx.test(rawStr) || stems[i].rx.test(noEmoji)) {
        if (PRODUCTS[stems[i].target]) return stems[i].target;
      }
    }

    // 3. Substring scan
    for (var k in PRODUCTS) {
      if (clean.indexOf(k) !== -1 || k.indexOf(clean) !== -1) {
        return k;
      }
    }

    return null;
  }

  // ==========================================
  // 4. UI VECTOR ICONS (viewBox="0 0 24 24")
  // ==========================================

  var ICONS = {
    'booster_5050':
      '<circle cx="12" cy="12" r="10" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5" />' +
      '<circle cx="10" cy="10" r="5" fill="none" stroke="#38BDF8" stroke-width="2" />' +
      '<line x1="14" y1="14" x2="19" y2="19" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" />' +
      '<text x="10" y="13" font-family="Consolas, monospace" font-size="6" font-weight="bold" fill="#FFF" text-anchor="middle">½</text>',

    'booster_shield':
      '<path d="M12 2 L20 6 L20 12 C20 17 12 21 12 21 C12 21 4 17 4 12 L4 6 Z" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5" />' +
      '<polygon points="12,5 17,8 17,12 C17,15.5 12,18.5 12,18.5 C12,18.5 7,15.5 7,12 L7,8 Z" fill="#0369A1" />' +
      '<circle cx="12" cy="11" r="3" fill="#FDE047" />',

    'booster_hint':
      '<path d="M9 3 L15 3 L15 7 L19 17 C20 19 18.5 21 16 21 L8 21 C5.5 21 4 19 5 17 L9 7 Z" fill="#0F172A" stroke="#10B981" stroke-width="1.5" />' +
      '<path d="M6.5 16 L17.5 16 C17 19 15.5 19.5 12 19.5 C8.5 19.5 7 19 6.5 16 Z" fill="#10B981" />' +
      '<circle cx="10" cy="12" r="1" fill="#A7F3D0" />' +
      '<circle cx="13" cy="14" r="1.2" fill="#A7F3D0" />',

    'booster_heart':
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#EF4444" stroke="#FFF" stroke-width="1" />' +
      '<rect x="11" y="6" width="2" height="6" fill="#FFF" rx="0.5" />' +
      '<rect x="9" y="8" width="6" height="2" fill="#FFF" rx="0.5" />',

    'booster_freeze':
      '<circle cx="12" cy="12" r="9" fill="#0F172A" stroke="#06B6D4" stroke-width="1.5" />' +
      '<line x1="12" y1="6" x2="12" y2="12" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" />' +
      '<line x1="12" y1="12" x2="16" y2="12" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" />' +
      '<circle cx="12" cy="12" r="1.5" fill="#FFF" />',

    'shop':
      '<path d="M6 8 L18 8 L19 20 L5 20 Z" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5" rx="2" />' +
      '<path d="M9 8 C9 5 10 3 12 3 C14 3 15 5 15 8" fill="none" stroke="#F59E0B" stroke-width="1.5" />' +
      '<circle cx="12" cy="14" r="2" fill="#FDE047" />',

    'calculator':
      '<rect x="4" y="3" width="16" height="18" rx="3" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" />' +
      '<rect x="7" y="6" width="10" height="4" fill="#0F172A" rx="1" />' +
      '<circle cx="8" cy="13" r="1" fill="#94A3B8" />' +
      '<circle cx="12" cy="13" r="1" fill="#94A3B8" />' +
      '<circle cx="16" cy="13" r="1" fill="#94A3B8" />' +
      '<circle cx="8" cy="17" r="1" fill="#94A3B8" />' +
      '<circle cx="12" cy="17" r="1" fill="#94A3B8" />' +
      '<circle cx="16" cy="17" r="1" fill="#F59E0B" />',

    'marathon':
      '<circle cx="12" cy="12" r="10" fill="#431407" stroke="#F97316" stroke-width="1.5" />' +
      '<polygon points="13,4 7,13 12,13 11,20 17,11 12,11" fill="#FDE047" />',

    'heart-full':
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#EF4444" stroke="#B91C1C" stroke-width="1" />' +
      '<ellipse cx="7.5" cy="7" rx="2.5" ry="1.2" fill="#FCA5A5" opacity="0.8" transform="rotate(-30 7.5 7)" />',

    'heart-empty':
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#1E293B" stroke="#64748B" stroke-width="1.8" />',

    'heart-danger':
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#EF4444" stroke="#991B1B" stroke-width="1" />' +
      '<path d="M12 4 L10 10 L14 13 L11 18 L12 20" stroke="#FEF2F2" stroke-width="1.8" fill="none" stroke-linecap="round" />',

    'coin':
      '<circle cx="12" cy="12" r="10" fill="#F59E0B" stroke="#B45309" stroke-width="1.5" />' +
      '<circle cx="12" cy="12" r="8" fill="#FBBF24" stroke="#D97706" stroke-dasharray="1.5,1.5" stroke-width="1" />' +
      '<polygon points="12,6 16,9 16,15 12,18 8,15 8,9" fill="#F59E0B" stroke="#92400E" stroke-width="1" />' +
      '<text x="12" y="14.5" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#78350F" text-anchor="middle">S</text>',

    'coin-bonus':
      '<circle cx="12" cy="12" r="9.5" fill="#F59E0B" stroke="#FFF" stroke-width="1" />' +
      '<circle cx="12" cy="12" r="7.5" fill="#FDE047" />' +
      '<text x="12" y="14.5" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8.5" fill="#B45309" text-anchor="middle">$</text>' +
      '<text x="18" y="7" font-size="8" fill="#FFF">✦</text>',

    'star-gold':
      '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#F59E0B" stroke="#D97706" stroke-width="1" />' +
      '<polygon points="12,4 14,8.5 19,9.2 15.5,12.7 16.3,17.5 12,15.2" fill="#FDE047" opacity="0.6" />',

    'star-empty':
      '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#1E293B" stroke="#64748B" stroke-width="1.5" />',

    'trophy':
      '<path d="M7 4h10v6a5 5 0 0 1-10 0V4z" fill="#F59E0B" stroke="#B45309" stroke-width="1.2" />' +
      '<path d="M7 6H4a2 2 0 0 0-2 2v1a4 4 0 0 0 4 4h1" stroke="#F59E0B" stroke-width="1.5" fill="none" stroke-linecap="round" />' +
      '<path d="M17 6h3a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4h-1" stroke="#F59E0B" stroke-width="1.5" fill="none" stroke-linecap="round" />' +
      '<line x1="12" y1="15" x2="12" y2="19" stroke="#B45309" stroke-width="2" />' +
      '<rect x="8" y="19" width="8" height="3" rx="1" fill="#78350F" />' +
      '<polygon points="12,6 13,8 15,8 13.5,9.5 14,11.5 12,10.2 10,11.5 10.5,9.5 9,8 11,8" fill="#FEF08A" />',

    'speaker-on':
      '<polygon points="3,9 7,9 12,4 12,20 7,15 3,15" fill="#38BDF8" stroke="#0284C7" stroke-width="1.2" />' +
      '<path d="M16 8 C17.5 9.5 17.5 14.5 16 16" stroke="#38BDF8" stroke-width="2" fill="none" stroke-linecap="round" />' +
      '<path d="M19 5 C22 8 22 16 19 19" stroke="#38BDF8" stroke-width="2" fill="none" stroke-linecap="round" />',

    'speaker-off':
      '<polygon points="3,9 7,9 12,4 12,20 7,15 3,15" fill="#64748B" stroke="#475569" stroke-width="1.2" />' +
      '<line x1="16" y1="9" x2="22" y2="15" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" />' +
      '<line x1="22" y1="9" x2="16" y2="15" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" />',

    'pause':
      '<rect x="6" y="4" width="4" height="16" rx="1.5" fill="#F8FAFC" />' +
      '<rect x="14" y="4" width="4" height="16" rx="1.5" fill="#F8FAFC" />',

    'play':
      '<polygon points="6,4 20,12 6,20" fill="#22C55E" stroke="#16A34A" stroke-width="1" stroke-linejoin="round" />',

    'gear':
      '<circle cx="12" cy="12" r="3.5" fill="none" stroke="#94A3B8" stroke-width="2" />' +
      '<path d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12 M4.93 4.93 L6.34 6.34 M17.66 17.66 L19.07 19.07 M4.93 19.07 L6.34 17.66 M17.66 6.34 L19.07 4.93" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round" />',

    'lock':
      '<rect x="5" y="11" width="14" height="10" rx="2" fill="#F59E0B" stroke="#B45309" stroke-width="1.2" />' +
      '<path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#CBD5E1" stroke-width="2.2" fill="none" stroke-linecap="round" />' +
      '<circle cx="12" cy="15" r="1.5" fill="#78350F" />' +
      '<line x1="12" y1="16.5" x2="12" y2="18.5" stroke="#78350F" stroke-width="1.2" />',

    'check':
      '<path d="M20 6L9 17L4 12" stroke="#10B981" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />',

    'cross':
      '<path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />',

    'badge':
      '<polygon points="12,2 15,5 19,5 20,9 23,12 20,15 19,19 15,19 12,22 9,19 5,19 4,15 1,12 4,9 5,5 9,5" fill="#F59E0B" stroke="#B45309" stroke-width="1" />' +
      '<circle cx="12" cy="12" r="6" fill="#FDE047" />' +
      '<text x="12" y="15" font-family="Segoe UI, sans-serif" font-weight="900" font-size="8" fill="#78350F" text-anchor="middle">★</text>',

    'magnifier':
      '<circle cx="10" cy="10" r="7" fill="none" stroke="#38BDF8" stroke-width="2.5" />' +
      '<line x1="15" y1="15" x2="21" y2="21" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round" />' +
      '<path d="M7 8 A4 4 0 0 1 12 6" stroke="#FFF" stroke-width="1.5" fill="none" stroke-linecap="round" />',

    'spoon':
      '<ellipse cx="8" cy="8" rx="5" ry="4" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1" transform="rotate(-30 8 8)" />' +
      '<path d="M11 10 L20 19 L21 21 L19 20 L10 11 Z" fill="#94A3B8" />' +
      '<ellipse cx="7.5" cy="7.5" rx="3.5" ry="2.5" fill="#FFF" stroke="#E2E8F0" stroke-width="0.8" transform="rotate(-30 7.5 7.5)" />' +
      '<circle cx="7" cy="7" r="0.8" fill="#FEF08A" />' +
      '<circle cx="8" cy="8" r="0.7" fill="#FEF08A" />',

    'diploma':
      '<rect x="4" y="3" width="16" height="18" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5" />' +
      '<line x1="7" y1="7" x2="17" y2="7" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" />' +
      '<line x1="7" y1="11" x2="17" y2="11" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" />' +
      '<line x1="7" y1="15" x2="13" y2="15" stroke="#B45309" stroke-width="1.5" stroke-linecap="round" />' +
      '<circle cx="16" cy="16" r="3" fill="#DC2626" />' +
      '<polygon points="15,19 16,17 17,19" fill="#B91C1C" />'
  };

  // ==========================================
  // 5. DETECTIVE AVATARS (viewBox="0 0 120 120")
  // ==========================================

  var AVATARS = {
    // Professor Sugar Expert
    'avatar_scientist':
      '<circle cx="60" cy="60" r="56" fill="#0F172A" stroke="#10B981" stroke-width="3" />' +
      '<ellipse cx="60" cy="66" rx="22" ry="24" fill="#FED7AA" />' +
      '<path d="M34 56 C30 42 42 30 60 30 C78 30 90 42 86 56 Z" fill="#94A3B8" />' +
      '<circle cx="34" cy="54" r="8" fill="#CBD5E1" />' +
      '<circle cx="86" cy="54" r="8" fill="#CBD5E1" />' +
      '<rect x="40" y="56" width="18" height="14" rx="4" fill="#059669" fill-opacity="0.6" stroke="#10B981" stroke-width="2" />' +
      '<rect x="62" y="56" width="18" height="14" rx="4" fill="#059669" fill-opacity="0.6" stroke="#10B981" stroke-width="2" />' +
      '<line x1="58" y1="63" x2="62" y2="63" stroke="#10B981" stroke-width="2" />' +
      '<path d="M48 76 C54 74 60 77 66 74 C72 77 66 82 60 79 C54 82 48 76 48 76 Z" fill="#CBD5E1" />' +
      '<polygon points="36,94 60,118 30,120" fill="#FFFFFF" />' +
      '<polygon points="84,94 60,118 90,120" fill="#FFFFFF" />' +
      '<polygon points="50,94 60,104 70,94 60,118" fill="#047857" />',

    // Master Chef Nutritionist
    'avatar_chef':
      '<circle cx="60" cy="60" r="56" fill="#1E293B" stroke="#F59E0B" stroke-width="3" />' +
      '<ellipse cx="60" cy="68" rx="24" ry="24" fill="#FED7AA" />' +
      '<ellipse cx="50" cy="66" rx="3" ry="3.5" fill="#0F172A" />' +
      '<ellipse cx="70" cy="66" rx="3" ry="3.5" fill="#0F172A" />' +
      '<path d="M54 78 Q60 84 66 78" stroke="#9A3412" stroke-width="2" fill="none" stroke-linecap="round" />' +
      '<rect x="44" y="38" width="32" height="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" rx="2" />' +
      '<path d="M40 38 C32 20 44 14 52 20 C56 12 66 12 70 20 C78 14 88 20 80 38 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />' +
      '<polygon points="40,94 60,112 80,94 60,118" fill="#DC2626" />',

    // Young Detective Boy
    'avatar_boy':
      '<circle cx="60" cy="60" r="56" fill="#1E293B" stroke="#38BDF8" stroke-width="3" />' +
      // Face
      '<ellipse cx="60" cy="66" rx="24" ry="26" fill="#FED7AA" />' +
      // Hair
      '<path d="M38 52 C38 40 48 34 60 34 C72 34 82 40 82 52 Z" fill="#78350F" />' +
      // Eyes
      '<ellipse cx="50" cy="64" rx="3.5" ry="4" fill="#0F172A" />' +
      '<circle cx="51.5" cy="62.5" r="1.2" fill="#FFF" />' +
      '<ellipse cx="70" cy="64" rx="3.5" ry="4" fill="#0F172A" />' +
      '<circle cx="71.5" cy="62.5" r="1.2" fill="#FFF" />' +
      // Smile
      '<path d="M54 78 Q60 84 66 78" stroke="#9A3412" stroke-width="2" fill="none" stroke-linecap="round" />' +
      // Detective Hat
      '<path d="M30 42 C30 32 46 20 60 20 C74 20 90 32 90 42 Z" fill="#92400E" stroke="#78350F" stroke-width="1.5" />' +
      '<ellipse cx="60" cy="42" rx="36" ry="6" fill="#B45309" stroke="#78350F" stroke-width="1.5" />' +
      '<rect x="36" y="38" width="48" height="5" fill="#FEF3C7" />' +
      // Trench Coat collar
      '<polygon points="40,94 60,116 34,120" fill="#B45309" />' +
      '<polygon points="80,94 60,116 86,120" fill="#B45309" />' +
      '<polygon points="54,94 60,104 66,94 60,118" fill="#DC2626" />',

    // Inquisitive Girl Detective
    'avatar_girl':
      '<circle cx="60" cy="60" r="56" fill="#1E293B" stroke="#EC4899" stroke-width="3" />' +
      // Long hair back
      '<path d="M30 60 C30 90 40 110 44 116 L76 116 C80 110 90 90 90 60 Z" fill="#B45309" />' +
      // Face
      '<ellipse cx="60" cy="66" rx="24" ry="24" fill="#FED7AA" />' +
      // Front bangs
      '<path d="M36 54 Q60 62 84 54" stroke="#92400E" stroke-width="6" fill="none" />' +
      // Glasses
      '<circle cx="48" cy="64" r="9" fill="none" stroke="#EC4899" stroke-width="2.5" />' +
      '<circle cx="72" cy="64" r="9" fill="none" stroke="#EC4899" stroke-width="2.5" />' +
      '<line x1="57" y1="64" x2="63" y2="64" stroke="#EC4899" stroke-width="2" />' +
      '<circle cx="48" cy="64" r="3" fill="#0F172A" />' +
      '<circle cx="72" cy="64" r="3" fill="#0F172A" />' +
      // Smile
      '<path d="M54 78 Q60 84 66 78" stroke="#9A3412" stroke-width="2" fill="none" stroke-linecap="round" />' +
      // Stylish Beret
      '<ellipse cx="60" cy="38" rx="30" ry="12" fill="#BE185D" transform="rotate(-10 60 38)" />' +
      '<circle cx="56" cy="24" r="3" fill="#9D174D" />' +
      // Scarf
      '<path d="M44 94 Q60 106 76 94 L80 120 L40 120 Z" fill="#F472B6" />',

    // High-Tech Cyber Detective
    'avatar_cyber':
      '<circle cx="60" cy="60" r="56" fill="#0F172A" stroke="#06B6D4" stroke-width="3" />' +
      // Sleek tech hood
      '<path d="M34 50 C34 30 46 22 60 22 C74 22 86 30 86 50 L86 100 L34 100 Z" fill="#1E293B" stroke="#0284C7" stroke-width="1.5" />' +
      // Face
      '<ellipse cx="60" cy="64" rx="20" ry="22" fill="#E2E8F0" />' +
      // Holographic Visor
      '<path d="M36 58 L84 58 L80 72 L40 72 Z" fill="#06B6D4" stroke="#22D3EE" stroke-width="2" filter="url(#glow-gold)" />' +
      '<line x1="42" y1="65" x2="78" y2="65" stroke="#FFF" stroke-width="1.5" opacity="0.9" />' +
      // Headset mic
      '<circle cx="34" cy="68" r="4" fill="#38BDF8" />' +
      '<path d="M34 68 Q44 76 54 74" stroke="#38BDF8" stroke-width="2" fill="none" />' +
      '<circle cx="54" cy="74" r="2" fill="#22D3EE" />' +
      // Neon collar
      '<polygon points="40,94 60,114 80,94 60,120" fill="#0284C7" />',

    // Classic Sherlock Master Detective
    'avatar_sherlock':
      '<circle cx="60" cy="60" r="56" fill="#1E293B" stroke="#F59E0B" stroke-width="3" />' +
      // Face
      '<ellipse cx="60" cy="66" rx="22" ry="26" fill="#FED7AA" />' +
      // Moustache
      '<path d="M46 76 C52 74 58 78 60 76 C62 78 68 74 74 76 C76 80 66 84 60 80 C54 84 44 80 46 76 Z" fill="#451A03" />' +
      // Monocle on right eye
      '<circle cx="68" cy="62" r="7" fill="#E0F2FE" fill-opacity="0.4" stroke="#F59E0B" stroke-width="2" />' +
      '<line x1="75" y1="62" x2="82" y2="76" stroke="#F59E0B" stroke-width="1.2" />' +
      '<ellipse cx="52" cy="62" rx="3" ry="3.5" fill="#0F172A" />' +
      '<circle cx="68" cy="62" r="2.5" fill="#0F172A" />' +
      // Deerstalker Hat with flaps
      '<path d="M32 40 C32 24 46 16 60 16 C74 16 88 24 88 40 Z" fill="#78350F" stroke="#451A03" stroke-width="1.5" />' +
      '<path d="M26 42 Q60 34 94 42" stroke="#451A03" stroke-width="3" fill="none" />' +
      '<path d="M34 38 L30 54 Q36 56 38 46" fill="#92400E" stroke="#451A03" stroke-width="1" />' +
      '<path d="M86 38 L90 54 Q84 56 82 46" fill="#92400E" stroke="#451A03" stroke-width="1" />' +
      // Bow on top
      '<circle cx="60" cy="16" r="3" fill="#D97706" />' +
      // Pipe
      '<path d="M68 80 Q76 90 84 86 L86 80 L92 80 L90 92 Q78 96 66 84" fill="#78350F" stroke="#451A03" stroke-width="1" />' +
      '<path d="M91 76 Q93 70 91 66" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.6" />'
  };

  // Aliases for avatars
  var AVATAR_ALIASES = {
    'boy': 'avatar_boy',
    'detective_boy': 'avatar_boy',
    'avatar_detective_boy': 'avatar_boy',
    'girl': 'avatar_girl',
    'detective_girl': 'avatar_girl',
    'avatar_detective_girl': 'avatar_girl',
    'cyber': 'avatar_cyber',
    'cyber_detective': 'avatar_cyber',
    'avatar_cyber_detective': 'avatar_cyber',
    'sherlock': 'avatar_sherlock',
    'classic': 'avatar_sherlock',
    'avatar_sherlock_classic': 'avatar_sherlock', 'scientist': 'avatar_scientist', 'avatar_scientist': 'avatar_scientist', 'chef': 'avatar_chef', 'avatar_chef': 'avatar_chef'
  };

  // ==========================================
  // 6. DETECTIVE DIPLOMA / CERTIFICATE SVG
  // ==========================================

  function getCertificateSvg(options) {
    var opts = options || {};
    var name = opts.playerName || 'Юный Детектив';
    var rank = opts.rankTitle || 'Сахарный детектив';
    var coins = opts.totalCoins != null ? opts.totalCoins : 565;
    var sugarCount = opts.sugarFound != null ? opts.sugarFound : 37;
    var date = opts.date || '30.09.2026';

    var inner =

        COMMON_DEFS +
        // Outer dark certificate base
        '<rect x="0" y="0" width="800" height="560" rx="16" fill="#0F172A" />' +
        // Certificate parchment card
        '<rect x="24" y="24" width="752" height="512" rx="12" fill="#1E293B" stroke="#F59E0B" stroke-width="3" />' +
        // Double ornate gold border
        '<rect x="36" y="36" width="728" height="488" rx="8" fill="none" stroke="#FBBF24" stroke-width="1.5" stroke-dasharray="8,4" />' +
        // Corner rosettes
        '<polygon points="44,44 56,44 56,56 44,56" fill="#F59E0B" />' +
        '<polygon points="756,44 744,44 744,56 756,56" fill="#F59E0B" />' +
        '<polygon points="44,516 56,516 56,504 44,504" fill="#F59E0B" />' +
        '<polygon points="756,516 744,516 744,504 756,504" fill="#F59E0B" />' +
        // Top Shield & Badge
        '<circle cx="400" cy="90" r="34" fill="#F59E0B" stroke="#FFF" stroke-width="2" filter="url(#glow-gold)" />' +
        '<polygon points="400,66 408,82 426,84 413,97 416,115 400,106 384,115 387,97 374,84 392,82" fill="#FFF" />' +
        // Title Ribbon
        '<text x="400" y="152" font-family="Segoe UI, sans-serif" font-weight="900" font-size="28" fill="#FDE047" text-anchor="middle" letter-spacing="3">ПОЧЁТНЫЙ ДИПЛОМ</text>' +
        '<text x="400" y="178" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="14" fill="#94A3B8" text-anchor="middle" letter-spacing="1">МИССИЯ ВЫПОЛНЕНА • 7 УРОВНЕЙ РАССЛЕДОВАНИЯ</text>' +
        // Recipient
        '<text x="400" y="224" font-family="Segoe UI, sans-serif" font-size="14" fill="#CBD5E1" text-anchor="middle">Настоящим подтверждается, что</text>' +
        '<text x="400" y="264" font-family="Segoe UI, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle">' + name + '</text>' +
        '<line x1="200" y1="276" x2="600" y2="276" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" />' +
        // Achievement proclamation
        '<text x="400" y="306" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="18" fill="#38BDF8" text-anchor="middle">Успешно разоблачил все сахарные ловушки и удостоен звания:</text>' +
        '<rect x="250" y="322" width="300" height="38" rx="8" fill="#F59E0B" filter="url(#glow-gold)" />' +
        '<text x="400" y="347" font-family="Segoe UI, sans-serif" font-weight="900" font-size="19" fill="#0F172A" text-anchor="middle" letter-spacing="1.5">★ ' + rank.toUpperCase() + ' ★</text>' +
        // 3 Skill Pillars
        '<g transform="translate(100, 380)">' +
          '<rect x="0" y="0" width="180" height="58" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1.5" />' +
          '<text x="90" y="24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#10B981" text-anchor="middle">👀 Чтение состава</text>' +
          '<text x="90" y="44" font-family="Consolas, monospace" font-size="10" fill="#94A3B8" text-anchor="middle">100% мастерство</text>' +
        '</g>' +
        '<g transform="translate(310, 380)">' +
          '<rect x="0" y="0" width="180" height="58" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1.5" />' +
          '<text x="90" y="24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#F59E0B" text-anchor="middle">🪙 Собрано монет</text>' +
          '<text x="90" y="44" font-family="Consolas, monospace" font-size="12" font-weight="bold" fill="#FDE047" text-anchor="middle">' + coins + ' / 565</text>' +
        '</g>' +
        '<g transform="translate(520, 380)">' +
          '<rect x="0" y="0" width="180" height="58" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1.5" />' +
          '<text x="90" y="24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#38BDF8" text-anchor="middle">🔎 Найдено сахаров</text>' +
          '<text x="90" y="44" font-family="Consolas, monospace" font-size="12" font-weight="bold" fill="#E0F2FE" text-anchor="middle">' + sugarCount + ' скрытых формул</text>' +
        '</g>' +
        // Footer Signatures & Date
        '<text x="140" y="490" font-family="Consolas, monospace" font-size="12" fill="#64748B">ДАТА: ' + date + '</text>' +
        '<line x1="140" y1="472" x2="260" y2="472" stroke="#64748B" stroke-width="1" />' +
        // Wax Seal
        '<circle cx="650" cy="470" r="32" fill="#DC2626" stroke="#991B1B" stroke-width="2" />' +
        '<polygon points="636,494 644,524 656,524 664,494" fill="#991B1B" />' +
        '<text x="650" y="468" font-family="Segoe UI, sans-serif" font-weight="900" font-size="10" fill="#FEF2F2" text-anchor="middle">САХАРНЫЙ</text>' +
        '<text x="650" y="480" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#FEF08A" text-anchor="middle">ДЕТЕКТИВ</text>';
    return wrapSvg('0 0 800 560', '100%', '100%', inner, 'diploma-svg');
  }

  // ==========================================
  // 7. PUBLIC API IMPLEMENTATION
  // ==========================================

  /**
   * Get SVG markup for any food product across all 7 levels.
   * @param {string} key - Product key, slug, ID or Russian name
   * @param {number|string} [width=160] - Width in px or string
   * @param {number|string} [height=160] - Height in px or string
   * @param {string} [extraClass='product-svg'] - Optional CSS class
   * @returns {string} Pure SVG markup
   */
  Graphics.getProductSvg = function(key, width, height, extraClass) {
    var resolved = resolveProductKey(key);
    var content = resolved && PRODUCTS[resolved] ? PRODUCTS[resolved] : GENERIC_PRODUCT_SVG;
    var w = width !== undefined ? width : 160;
    var h = height !== undefined ? height : 160;
    var cls = extraClass !== undefined ? extraClass : 'product-svg';
    return wrapSvg('0 0 160 160', w, h, content, cls);
  };

  /**
   * Get SVG markup for UI system icon.
   * @param {string} name - Icon name (e.g. 'heart-full', 'coin', 'gear')
   * @param {number|string} [size=24] - Size in px
   * @param {string} [extraClass='ui-icon'] - Optional CSS class
   * @returns {string} Pure SVG markup
   */
  Graphics.getIconSvg = function(name, size, extraClass) {
    if (!name) return '';
    var norm = String(name).trim().toLowerCase().replace(/_/g, '-');
    var content = ICONS[norm];
    if (!content) {
      // Check variations
      if (norm === 'heart') content = ICONS['heart-full'];
      else if (norm === 'star') content = ICONS['star-gold'];
      else if (norm === 'settings') content = ICONS['gear'];
      else if (norm === 'sound') content = ICONS['speaker-on'];
      else if (norm === 'mute') content = ICONS['speaker-off'];
      else if (norm === 'search') content = ICONS['magnifier'];
      else if (norm === 'checkmark') content = ICONS['check'];
      else if (norm === 'close') content = ICONS['cross'];
      else content = ICONS['badge'];
    }
    var s = size !== undefined ? size : 24;
    var cls = extraClass !== undefined ? extraClass : 'ui-icon';
    return wrapSvg('0 0 24 24', s, s, content, cls);
  };

  /**
   * Get SVG markup for detective player avatar.
   * @param {string} id - Avatar ID (e.g. 'avatar_boy', 'avatar_girl', 'cyber')
   * @param {number|string} [size=64] - Size in px
   * @param {string} [extraClass='avatar-svg'] - Optional CSS class
   * @returns {string} Pure SVG markup
   */
  Graphics.getAvatarSvg = function(id, size, extraClass) {
    var rawId = id ? String(id).trim().toLowerCase() : 'avatar_boy';
    var resolvedId = AVATARS[rawId] ? rawId : (AVATAR_ALIASES[rawId] || 'avatar_boy');
    var content = AVATARS[resolvedId] || AVATARS['avatar_boy'];
    var s = size !== undefined ? size : 64;
    var cls = extraClass !== undefined ? extraClass : 'avatar-svg';
    return wrapSvg('0 0 120 120', s, s, content, cls);
  };

  /**
   * Get detective diploma / certificate SVG template.
   * @param {object} [options] - Name, rank, coins, date
   * @returns {string} Pure SVG markup
   */
  Graphics.getCertificateSvg = getCertificateSvg;
  Graphics.getDetectiveDiplomaSvg = getCertificateSvg;

  /**
   * Check if a product key is recognized.
   * @param {string} key
   * @returns {boolean}
   */
  Graphics.hasProduct = function(key) {
    return resolveProductKey(key) !== null;
  };

  /**
   * List all recognized primary product keys.
   * @returns {string[]}
   */
  Graphics.getAllProductKeys = function() {
    return Object.keys(PRODUCTS);
  };

  /**
   * List all recognized icon names.
   * @returns {string[]}
   */
  Graphics.getAllIconNames = function() {
    return Object.keys(ICONS);
  };

  /**
   * List all recognized avatar IDs.
   * @returns {string[]}
   */
  Graphics.getAllAvatarIds = function() {
    return Object.keys(AVATARS);
  };

  // Mount to global SugarApp
  
  /**
   * Generates isometric 3D Sugar Cubes stack
   * @param {number} spoons - Number of teaspoons (approx 1 cube per teaspoon)
   * @returns {string} Pure SVG markup
   */
  Graphics.getSugarCubesSvg = function(spoons) {
    var count = Math.min(30, Math.max(1, Math.round(Number(spoons) || 1)));
    var cubesSvg = '';

    for (var i = 0; i < count; i++) {
      var col = i % 6;
      var layer = Math.floor(i / 6);
      var cx = 35 + (col * 32) + (layer * 4);
      var cy = 110 - (layer * 22) - (col * 2);

      cubesSvg += 
        '<g transform="translate(' + cx + ',' + cy + ')">' +
          '<polygon points="14,0 28,6 14,12 0,6" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />' +
          '<polygon points="0,6 14,12 14,24 0,18" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="1" />' +
          '<polygon points="14,12 28,6 28,18 14,24" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1" />' +
          '<circle cx="14" cy="6" r="0.8" fill="#FEF08A" />' +
          '<circle cx="8" cy="15" r="0.8" fill="#FEF08A" />' +
        '</g>';
    }

    var inner = 
      COMMON_DEFS +
      '<ellipse cx="130" cy="135" rx="115" ry="22" fill="#1E293B" stroke="#334155" stroke-width="2" />' +
      cubesSvg;

    return wrapSvg('0 0 260 160', 260, 160, inner, 'sugar-cubes-svg');
  };

  /**
   * Generates Grand Master Certificate for completing all 15 levels
   */
  Graphics.getGrandmasterDiplomaSvg = function(options) {
    var opts = options || {};
    var name = opts.playerName || 'Легендарный Детектив';
    var rank = 'ГРАНДМАСТЕР ПИЩЕВОЙ ИНСПЕКЦИИ';
    var coins = opts.totalCoins != null ? opts.totalCoins : 1200;
    var sugarCount = opts.sugarFound != null ? opts.sugarFound : 81;
    var date = opts.date || new Date().toLocaleDateString('ru-RU');

    var inner =
      COMMON_DEFS +
      '<rect x="0" y="0" width="800" height="560" rx="16" fill="#0B0F19" />' +
      '<rect x="20" y="20" width="760" height="520" rx="14" fill="#111827" stroke="#8B5CF6" stroke-width="3" />' +
      '<rect x="32" y="32" width="736" height="496" rx="10" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="12,6" />' +
      '<circle cx="400" cy="84" r="36" fill="#F59E0B" filter="url(#glow-gold)" />' +
      '<polygon points="380,94 420,94 425,74 410,82 400,68 390,82 375,74" fill="#FFFFFF" />' +
      '<text x="400" y="146" font-family="Segoe UI, sans-serif" font-weight="900" font-size="26" fill="#FDE047" text-anchor="middle" letter-spacing="4">ДИПЛОМ ГРАНДМАСТЕРА</text>' +
      '<text x="400" y="172" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="14" fill="#C4B5FD" text-anchor="middle" letter-spacing="1">15 УРОВНЕЙ • 81 ПРОДУКТ • ПОБЕДА НАД САХАРНЫМ ТИТАНОМ</text>' +
      '<text x="400" y="216" font-family="Segoe UI, sans-serif" font-size="14" fill="#94A3B8" text-anchor="middle">Высшая квалификация присвоена детективу:</text>' +
      '<text x="400" y="256" font-family="Segoe UI, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle">' + name + '</text>' +
      '<line x1="180" y1="268" x2="620" y2="268" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" />' +
      '<rect x="210" y="296" width="380" height="42" rx="8" fill="#7C3AED" filter="url(#glow-gold)" />' +
      '<text x="400" y="323" font-family="Segoe UI, sans-serif" font-weight="900" font-size="16" fill="#FFF" text-anchor="middle" letter-spacing="1.5">👑 ' + rank + ' 👑</text>' +
      '<g transform="translate(80, 360)">' +
        '<rect x="0" y="0" width="190" height="62" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1.5" />' +
        '<text x="95" y="24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#A7F3D0" text-anchor="middle">🏆 Пройдено уровней</text>' +
        '<text x="95" y="46" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#10B981" text-anchor="middle">15 / 15 (100%)</text>' +
      '</g>' +
      '<g transform="translate(305, 360)">' +
        '<rect x="0" y="0" width="190" height="62" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1.5" />' +
        '<text x="95" y="24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#FDE047" text-anchor="middle">🪙 Баланс монет</text>' +
        '<text x="95" y="46" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#F59E0B" text-anchor="middle">' + coins + ' монет</text>' +
      '</g>' +
      '<g transform="translate(530, 360)">' +
        '<rect x="0" y="0" width="190" height="62" rx="8" fill="#0F172A" stroke="#334155" stroke-width="1.5" />' +
        '<text x="95" y="24" font-family="Segoe UI, sans-serif" font-weight="bold" font-size="12" fill="#93C5FD" text-anchor="middle">🔎 Разоблачено ловушек</text>' +
        '<text x="95" y="46" font-family="Consolas, monospace" font-size="14" font-weight="bold" fill="#38BDF8" text-anchor="middle">' + sugarCount + ' продуктов</text>' +
      '</g>' +
      '<text x="120" y="480" font-family="Consolas, monospace" font-size="12" fill="#64748B">СЕРТИФИКАТ ВЫДАН: ' + date + '</text>' +
      '<circle cx="680" cy="460" r="34" fill="#7C3AED" stroke="#A78BFA" stroke-width="2" />' +
      '<text x="680" y="458" font-family="Segoe UI, sans-serif" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle">САХАРНЫЙ</text>' +
      '<text x="680" y="472" font-family="Segoe UI, sans-serif" font-weight="900" font-size="9" fill="#FDE047" text-anchor="middle">ГРАНДМАСТЕР</text>';

    return wrapSvg('0 0 800 560', '100%', '100%', inner, 'grandmaster-diploma-svg');
  };

  SugarApp.Graphics = Graphics;

  // CommonJS Node.js dual export support
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Graphics;
  }

})(typeof window !== 'undefined' ? window : global);
