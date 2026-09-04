/* minecraft.aiskov.com — landing page behaviour
   1. header height → --header-h
   2. edition tabs
   3. copy-to-clipboard
   4. reveal on scroll
   5. voxel island background scene
   Scene options live on <canvas id="scene">:
     data-motion="cinematic|calm|off"  data-detail="4..12"  data-palette="overworld|dusk|nether"
*/
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. header height ----------
     The header is fixed, so the hero has to reserve room for it. Its height
     changes with viewport width (the nav wraps) and with language, so it is
     measured instead of hard-coded. */

  var header = document.querySelector('.site-header');

  if (header) {
    var syncHeaderHeight = function () {
      var h = Math.round(header.getBoundingClientRect().height);
      if (h) document.documentElement.style.setProperty('--header-h', h + 'px');
    };

    syncHeaderHeight();

    if ('ResizeObserver' in window) {
      new ResizeObserver(syncHeaderHeight).observe(header);
    } else {
      window.addEventListener('resize', syncHeaderHeight);
      window.addEventListener('orientationchange', syncHeaderHeight);
    }
  }

  /* ---------- 2. tabs ---------- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab[data-tab]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel]'));

  function selectTab(name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.hidden = p.getAttribute('data-panel') !== name;
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { selectTab(t.getAttribute('data-tab')); });
  });

  /* ---------- 3. copy buttons ---------- */

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
    var timer;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var flash = function () {
        btn.classList.add('is-copied');
        clearTimeout(timer);
        timer = setTimeout(function () { btn.classList.remove('is-copied'); }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash, function () { legacyCopy(text); flash(); });
      } else {
        legacyCopy(text);
        flash();
      }
    });
  });

  /* ---------- 4. reveal on scroll ---------- */

  var revealNodes = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() { revealNodes.forEach(function (n) { n.classList.add('is-visible'); }); }

  if (!revealNodes.length) {
    /* nothing to reveal */
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealNodes.forEach(function (n) { io.observe(n); });
    setTimeout(showAll, 3500);
  }

  /* ---------- 5. voxel scene ---------- */

  var canvas = document.getElementById('scene');
  if (!canvas || !canvas.getContext) return;

  var PALETTES = {
    overworld: { grass: [111, 191, 82], dirt: [138, 106, 69], stone: [122, 129, 137], sand: [220, 203, 146], water: [62, 127, 193], log: [122, 92, 51], leaf: [79, 168, 69], glow: [255, 217, 138], fog: [8, 12, 10] },
    dusk:      { grass: [96, 140, 96],  dirt: [104, 80, 62],  stone: [96, 100, 112],  sand: [188, 168, 132], water: [58, 86, 150],  log: [96, 72, 44],  leaf: [72, 116, 84], glow: [255, 178, 110], fog: [12, 12, 20] },
    nether:    { grass: [156, 60, 48],  dirt: [110, 48, 40],  stone: [96, 58, 54],    sand: [188, 132, 88],  water: [226, 116, 48], log: [82, 44, 40],  leaf: [190, 84, 52], glow: [255, 196, 120], fog: [16, 7, 7] }
  };

  var ctx = canvas.getContext('2d');
  var pal = PALETTES[canvas.getAttribute('data-palette')] || PALETTES.overworld;
  var motion = canvas.getAttribute('data-motion') || 'cinematic';
  if (reduceMotion) motion = 'off';
  var R = Math.max(4, Math.min(12, parseInt(canvas.getAttribute('data-detail'), 10) || 9));

  var vw = 0, vh = 0, dpr = 1;
  var cubes = [], floaters = [];
  var shadeCache = Object.create(null);
  var scrollP = 0, t0 = 0, raf = 0;

  function key(x, y, z) { return x + ',' + y + ',' + z; }

  function buildWorld() {
    var solid = Object.create(null);
    var all = [];
    var heights = [];
    var x, y, z;

    function noise(a, b) {
      return Math.sin(a * 0.55) * Math.cos(b * 0.42) * 1.5 +
             Math.sin((a + b) * 0.31) * 1.0 +
             Math.cos((a - b * 1.7) * 0.19) * 0.9;
    }

    for (x = -R; x <= R; x++) {
      for (z = -R; z <= R; z++) {
        var d = Math.sqrt(x * x + z * z);
        if (d > R - 0.15) continue;
        var rim = 1 - d / R;
        var h = Math.round(noise(x, z) * rim + rim * 3.2 - 1.2);
        var bottom = h - Math.round(1.5 + rim * (R * 0.85));
        heights.push([x, z, h]);
        for (y = bottom; y <= h; y++) {
          var type;
          if (y === h) type = h <= 0 ? (h === 0 ? 'water' : 'sand') : 'grass';
          else if (y >= h - 2) type = h <= 0 ? 'sand' : 'dirt';
          else type = 'stone';
          all.push({ x: x, y: y, z: z, t: type });
          solid[key(x, y, z)] = 1;
        }
      }
    }

    var seed = 1337;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }

    var spots = heights.filter(function (s) {
      return s[2] >= 1 && Math.sqrt(s[0] * s[0] + s[1] * s[1]) < R - 2.2;
    });
    var trees = [];
    var wanted = Math.max(3, Math.round(R * 0.7));
    for (var i = 0; i < spots.length * 2 && trees.length < wanted; i++) {
      var s = spots[Math.floor(rnd() * spots.length)];
      if (!s) break;
      var clash = trees.some(function (t) {
        return Math.abs(t[0] - s[0]) + Math.abs(t[1] - s[1]) < 4;
      });
      if (!clash) trees.push(s);
    }

    trees.forEach(function (s) {
      var tx = s[0], tz = s[1], base = s[2] + 1;
      var th = 3 + Math.floor(rnd() * 2);
      for (var ty = base; ty < base + th; ty++) {
        all.push({ x: tx, y: ty, z: tz, t: 'log' });
        solid[key(tx, ty, tz)] = 1;
      }
      var top = base + th - 1;
      for (var dx = -2; dx <= 2; dx++) {
        for (var dz = -2; dz <= 2; dz++) {
          for (var dy = -1; dy <= 1; dy++) {
            if (Math.abs(dx) + Math.abs(dz) + Math.abs(dy) * 1.4 > 2.6) continue;
            var lx = tx + dx, ly = top + dy + 1, lz = tz + dz;
            if (solid[key(lx, ly, lz)]) continue;
            all.push({ x: lx, y: ly, z: lz, t: 'leaf' });
            solid[key(lx, ly, lz)] = 1;
          }
        }
      }
    });

    heights.forEach(function (s) {
      if (s[2] >= 1 && rnd() < 0.02 && !solid[key(s[0], s[2] + 1, s[1])]) {
        all.push({ x: s[0], y: s[2] + 1, z: s[1], t: 'glow' });
        solid[key(s[0], s[2] + 1, s[1])] = 1;
      }
    });

    cubes = all.filter(function (c) {
      return !(solid[key(c.x + 1, c.y, c.z)] && solid[key(c.x - 1, c.y, c.z)] &&
               solid[key(c.x, c.y, c.z + 1)] && solid[key(c.x, c.y, c.z - 1)] &&
               solid[key(c.x, c.y + 1, c.z)]);
    });

    cubes.forEach(function (c) {
      c.delay = (Math.sqrt(c.x * c.x + c.z * c.z) / R) * 0.55 + rnd() * 0.3;
    });

    var ftypes = ['stone', 'grass', 'glow', 'log', 'leaf', 'dirt', 'stone'];
    floaters = [];
    for (var f = 0; f < 7; f++) {
      floaters.push({
        r: R * 0.55 + rnd() * R * 0.7,
        a: rnd() * Math.PI * 2,
        sp: 0.06 + rnd() * 0.09,
        y: 4 + rnd() * 7,
        bob: rnd() * Math.PI * 2,
        t: ftypes[f],
        delay: 0.4 + rnd() * 0.6
      });
    }
  }

  function shade(type, mul, fogStep) {
    var k = type + '|' + mul + '|' + fogStep;
    var hit = shadeCache[k];
    if (hit) return hit;
    var base = pal[type] || pal.stone;
    var fog = pal.fog;
    var f = fogStep / 10;
    var mix = function (i) { return Math.round(base[i] * mul * (1 - f) + fog[i] * f); };
    hit = 'rgb(' + mix(0) + ',' + mix(1) + ',' + mix(2) + ')';
    shadeCache[k] = hit;
    return hit;
  }

  function resize() {
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    vw = canvas.clientWidth || window.innerWidth;
    vh = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.max(1, Math.floor(vw * dpr));
    canvas.height = Math.max(1, Math.floor(vh * dpr));
  }

  function readScroll() {
    var h = window.innerHeight || 800;
    return Math.max(0, Math.min(1, (window.pageYOffset || 0) / (h * 1.7)));
  }

  var CORNERS = [
    [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5],
    [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5]
  ];
  var FACES = [
    { idx: [4, 5, 6, 7], n: [0, 1, 0],  mul: 1 },
    { idx: [1, 5, 6, 2], n: [1, 0, 0],  mul: 0.74 },
    { idx: [0, 3, 7, 4], n: [-1, 0, 0], mul: 0.62 },
    { idx: [2, 6, 7, 3], n: [0, 0, 1],  mul: 0.68 },
    { idx: [0, 1, 5, 4], n: [0, 0, -1], mul: 0.55 }
  ];

  var px = new Float32Array(8), py = new Float32Array(8);

  function frame(single) {
    var calm = motion === 'calm';
    var t = single ? 2.6 : (performance.now() - t0) / 1000;
    var p = scrollP;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);

    var idle = calm ? 0.02 : 0.06;
    var ang = -0.75 + p * (calm ? 0.5 : 1.55) + Math.sin(t * 0.13) * idle;
    var tilt = (calm ? 0.68 : 0.72) - p * (calm ? 0.1 : 0.34);
    var fit = Math.min(vw, vh * 1.5);
    var scale = (fit / (R * 3.6)) * (1 + p * (calm ? 0.25 : 0.75));
    var ox = vw * 0.5;
    var oy = vh * (0.52 + p * (calm ? 0.06 : 0.26)) + (calm ? 0 : Math.sin(t * 0.2) * 6);

    canvas.style.opacity = String(Math.max(0.14, 1 - p * 0.92));

    var ca = Math.cos(ang), sa = Math.sin(ang);
    var ct = Math.cos(tilt), st = Math.sin(tilt);

    var grow = single ? 1 : Math.min(1, Math.max(0, (t - 0.15) / 1.7));
    function easeOut(v) { return 1 - Math.pow(1 - v, 3); }

    var items = [];
    var i, it;

    for (i = 0; i < cubes.length; i++) {
      var cu = cubes[i];
      var dy = 0, alpha = 1;
      if (grow < 1) {
        var g = Math.max(0, Math.min(1, (grow - cu.delay * 0.55) / 0.45));
        if (g <= 0) continue;
        var e = easeOut(g);
        dy = (1 - e) * 16;
        alpha = e;
      }
      var cy = cu.y + dy;
      var crz = cu.x * sa + cu.z * ca;
      items.push({ x: cu.x, y: cy, z: cu.z, t: cu.t, a: alpha, d: crz * ct - cy * st });
    }

    for (i = 0; i < floaters.length; i++) {
      var fo = floaters[i];
      var fg = single ? 1 : Math.max(0, Math.min(1, (grow - fo.delay) / 0.5));
      if (fg <= 0) continue;
      var fa = fo.a + (calm ? t * fo.sp * 0.4 : t * fo.sp);
      var fx = Math.cos(fa) * fo.r;
      var fz = Math.sin(fa) * fo.r;
      var fy = fo.y + Math.sin(t * 0.6 + fo.bob) * 0.8 + (1 - easeOut(fg)) * 14;
      var frz = fx * sa + fz * ca;
      items.push({ x: fx, y: fy, z: fz, t: fo.t, a: easeOut(fg), d: frz * ct - fy * st });
    }

    items.sort(function (a, b) { return b.d - a.d; });

    var maxD = R * 1.5 + 6;
    var lastFill = null;
    ctx.lineWidth = 1;
    ctx.lineJoin = 'miter';

    for (i = 0; i < items.length; i++) {
      it = items[i];
      for (var k = 0; k < 8; k++) {
        var cc = CORNERS[k];
        var wx = it.x + cc[0], wy = it.y + cc[1], wz = it.z + cc[2];
        px[k] = ox + (wx * ca - wz * sa) * scale;
        py[k] = oy - (wy * ct + (wx * sa + wz * ca) * st) * scale;
      }
      var fogStep = Math.max(0, Math.min(8, Math.round(((it.d + maxD * 0.2) / maxD) * 5 + 1)));
      if (it.a < 1) ctx.globalAlpha = it.a;
      for (var fi = 0; fi < FACES.length; fi++) {
        var fc = FACES[fi];
        var nrz = fc.n[0] * sa + fc.n[2] * ca;
        if (nrz * ct - fc.n[1] * st >= 0) continue;
        var fill = shade(it.t, fc.mul, fogStep);
        if (fill !== lastFill) { ctx.fillStyle = fill; ctx.strokeStyle = fill; lastFill = fill; }
        var q = fc.idx;
        ctx.beginPath();
        ctx.moveTo(px[q[0]], py[q[0]]);
        ctx.lineTo(px[q[1]], py[q[1]]);
        ctx.lineTo(px[q[2]], py[q[2]]);
        ctx.lineTo(px[q[3]], py[q[3]]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      if (it.a < 1) ctx.globalAlpha = 1;
    }
  }

  function loop() {
    frame(false);
    raf = requestAnimationFrame(loop);
  }

  buildWorld();
  resize();
  scrollP = readScroll();
  t0 = performance.now();

  window.addEventListener('resize', function () { resize(); if (motion === 'off') frame(true); });
  window.addEventListener('scroll', function () {
    scrollP = readScroll();
    if (motion === 'off') frame(true);
  }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (motion === 'off') return;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!raf) loop();
  });

  if (motion === 'off') frame(true);
  else loop();
})();
