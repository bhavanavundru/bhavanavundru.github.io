/* ==========================================================
   wave.js — animated fabric-style wave (purple + black)

   How it works: a height field made of a few sine waves is lit
   like a piece of satin and drawn at low resolution on a canvas.
   CSS scales it up smoothly and overlays the fine dot mesh.
   Sin/cos are only computed per column/row each frame (angle-addition
   trick), so the per-pixel work is just multiplications.
   ========================================================== */
(() => {
  'use strict';

  const canvas = document.getElementById('wave');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tweakables ---------- */
  const PX = 4;          // CSS pixels per canvas pixel (higher = faster, softer)
  const SPEED = 0.55;    // overall animation speed
  const SLOPE = 0.22;    // fold contrast (how strongly waves tilt the light)
  const STATIC_T = 7;    // moment shown when "reduce motion" is on

  // colour ramp, dark -> bright  [position, [r, g, b]]
  const STOPS = [
    [0.00, [3, 0, 8]],
    [0.22, [14, 3, 38]],
    [0.45, [54, 14, 124]],
    [0.68, [112, 42, 218]],
    [0.86, [178, 112, 255]],
    [1.00, [242, 228, 255]],
  ];

  // waves: [freqX, freqY, amplitude, speed, phase]
  const WAVES = [
    [ 8.0,  4.5, 0.50,  0.40, 0.0],
    [ 5.0, -7.0, 0.36, -0.30, 1.7],
    [13.0,  9.5, 0.15,  0.55, 3.1],
    [ 2.5,  2.0, 0.62,  0.20, 4.2],
  ];
  const N = WAVES.length;

  /* ---------- colour lookup table ---------- */
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const v = i / 255;
    let k = 0;
    while (k < STOPS.length - 2 && v > STOPS[k + 1][0]) k++;
    const [p0, c0] = STOPS[k];
    const [p1, c1] = STOPS[k + 1];
    const f = Math.min(1, Math.max(0, (v - p0) / (p1 - p0)));
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = c0[c] + (c1[c] - c0[c]) * f;
  }

  /* ---------- lighting ---------- */
  const norm = (x, y, z) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l]; };
  const L = norm(-0.55, -0.45, 0.70);
  const H = norm(L[0], L[1], L[2] + 1);   // half-vector (viewer looks straight on)

  /* ---------- state ---------- */
  let w = 0, h = 0, img = null, data = null;
  let px, colS, colC, rowS, rowC;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function resize() {
    const cw = canvas.clientWidth || window.innerWidth;
    const ch = canvas.clientHeight || window.innerHeight;
    w = Math.max(160, Math.round(cw / PX));
    h = Math.max(90, Math.round(ch / PX));
    canvas.width = w;
    canvas.height = h;
    img = ctx.createImageData(w, h);
    data = img.data;

    const aspect = cw / ch;
    px = new Float32Array(w);
    for (let x = 0; x < w; x++) px[x] = (x / w) * aspect;

    colS = new Float32Array(N * w);
    colC = new Float32Array(N * w);
    rowS = new Float32Array(N * h);
    rowC = new Float32Array(N * h);
    for (let k = 0; k < N; k++) {
      const fy = WAVES[k][1], ph = WAVES[k][4];
      for (let y = 0; y < h; y++) {
        const a = fy * (y / h) + ph;
        rowS[k * h + y] = Math.sin(a);
        rowC[k * h + y] = Math.cos(a);
      }
    }
  }

  function render(t) {
    const mx = mouse.x * 0.6;
    const my = mouse.y * 0.6;

    // per-frame, per-column sin/cos
    for (let k = 0; k < N; k++) {
      const fx = WAVES[k][0], sp = WAVES[k][3];
      const off = sp * t * SPEED + (k % 2 ? mx : -mx) + (k > 1 ? my : 0);
      for (let x = 0; x < w; x++) {
        const a = fx * px[x] + off;
        colS[k * w + x] = Math.sin(a);
        colC[k * w + x] = Math.cos(a);
      }
    }

    let i = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let dx = 0, dy = 0, z = 0;
        for (let k = 0; k < N; k++) {
          const cs = colS[k * w + x], cc = colC[k * w + x];
          const rs = rowS[k * h + y], rc = rowC[k * h + y];
          const a = WAVES[k][2];
          z  += a * (cs * rc + cc * rs);              // sin(col + row)
          const g = a * (cc * rc - cs * rs);          // cos(col + row)
          dx += g * WAVES[k][0];
          dy += g * WAVES[k][1];
        }

        // surface normal from the slopes
        const nx = -SLOPE * dx, ny = -SLOPE * dy;
        const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);

        const diff = Math.max(0, (nx * L[0] + ny * L[1] + L[2]) * inv);
        let s = Math.max(0, (nx * H[0] + ny * H[1] + H[2]) * inv);
        const s2 = s * s, s4 = s2 * s2, s8 = s4 * s4, s16 = s8 * s8;
        const spec = s16 * s8;                        // s^24

        let v = 0.04 + 0.60 * diff * diff + 0.28 * spec + 0.10 * z;
        v = v < 0 ? 0 : v > 1 ? 1 : v;

        const c = ((v * 255) | 0) * 3;
        data[i++] = lut[c];
        data[i++] = lut[c + 1];
        data[i++] = lut[c + 2];
        data[i++] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  // handy for debugging / screenshots
  canvas.renderAt = (t) => { if (!img) resize(); render(t); };

  /* ---------- loop ---------- */
  let raf = 0, visible = true;
  const t0 = performance.now();

  function loop(now) {
    raf = 0;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    render((now - t0) / 1000);
    if (visible) raf = requestAnimationFrame(loop);
  }

  resize();

  if (reduceMotion) {
    render(STATIC_T);
  } else {
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // stop drawing when the hero is not on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(loop);
      }).observe(canvas);
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (reduceMotion) render(STATIC_T);
    }, 120);
  });
})();