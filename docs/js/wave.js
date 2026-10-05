/* ==========================================================
   wave.js — carbon-weave wave background (purple + black)

   Draws on <canvas id="wave"> in the hero.
   WebGL fragment shader:
     1. a slow, flowing height field (the "fabric" draped in waves)
     2. a woven carbon texture that bends with that surface
     3. thread-by-thread anisotropic highlights in purple

   Tweak the look from CONFIG below.
   ========================================================== */

(() => {

  'use strict';


  const canvas =
    document.getElementById('wave');


  if (!canvas) {

    return;

  }


  /* =========================================================
     CONFIG — change these to tune the look
     ========================================================= */

  const CONFIG = {

    /* Animation speed. 0.5 = slower, 2 = faster. */
    speed: 2,

    /* Weave cell size in CSS pixels. Smaller = finer carbon. */
    cellCss: 4.5,

    /* How much the light follows the mouse (0 = off). */
    pointerLight: 2,

    /* Overall contrast. Higher = darker darks. */
    contrast: 1.12,

    /* Colours (r, g, b from 0 to 1). */
    deep:   [0.012, 0.004, 0.030],   /* near-black base      */
    mid:    [0.30,  0.12,  0.62],    /* main purple          */
    hi:     [0.78,  0.64,  1.00],    /* thread highlights    */
    accent: [0.26,  0.20,  0.90],    /* indigo backlight     */
    glow:   [0.55,  0.22,  0.92],    /* top-right glow       */

    /* Performance limits (4K / TV screens are scaled down). */
    maxDpr: 2,
    maxPixels: 3500000,

  };


  const reduceMotion =

    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;


  /* =========================================================
     SHADERS
     ========================================================= */

  const VERTEX = `
    attribute vec2 aPos;

    void main() {
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;


  const FRAGMENT = `
    #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
    #else
      precision mediump float;
    #endif

    uniform vec2  uRes;
    uniform float uTime;
    uniform float uCell;
    uniform vec2  uLight;
    uniform float uContrast;
    uniform vec3  uDeep;
    uniform vec3  uMid;
    uniform vec3  uHi;
    uniform vec3  uAccent;
    uniform vec3  uGlow;

    const float PI = 3.14159265;


    /*
      Height field with analytic slope.
      returns vec3(height, d/dx, d/dy)
    */

    vec3 field(vec2 p, float t) {

      const float S = 2.2;

      vec2 q = p * S;


      float a1 = q.y * 1.25 - t * 0.17;

      float f1 =
        q.x * 1.55 +
        q.y * 0.85 +
        t * 0.22 +
        1.5 * sin(a1);

      vec2 d1 = vec2(
        1.55,
        0.85 + 1.5 * 1.25 * cos(a1)
      );


      float a2 = q.x * 1.05 + t * 0.11;

      float f2 =
        q.x * 2.60 -
        q.y * 1.75 -
        t * 0.28 +
        1.0 * sin(a2);

      vec2 d2 = vec2(
        2.60 + 1.05 * cos(a2),
        -1.75
      );


      float f3 =
        q.x * 5.20 +
        q.y * 3.30 +
        t * 0.37;

      vec2 d3 = vec2(5.20, 3.30);


      float h =
        0.60 * sin(f1) +
        0.32 * sin(f2) +
        0.10 * sin(f3);

      vec2 dh =
        0.60 * cos(f1) * d1 +
        0.32 * cos(f2) * d2 +
        0.10 * cos(f3) * d3;


      return vec3(h, dh * S);

    }


    void main() {

      float aspect = uRes.x / uRes.y;

      vec2 p = gl_FragCoord.xy / uRes.y;

      float t = uTime;


      vec3 fld = field(p, t);

      float h = fld.x;

      vec2 slope = fld.yz;


      /* surface normal */

      vec3 n = normalize(
        vec3(-slope * 0.30, 1.0)
      );


      /* light */

      vec3 L = normalize(
        vec3(-0.55 + uLight.x, 0.55 + uLight.y, 0.62)
      );


      /* ---------------------------------------------------
         WOVEN CARBON
         The weave coordinates are pushed around by the
         height so the threads bend with the waves.
      --------------------------------------------------- */

      float cellsPerUnit = uRes.y / uCell;

      vec2 w =
        p * cellsPerUnit +
        h * vec2(3.0, 5.0);

      vec2 id = floor(w);

      vec2 f = fract(w);


      /* plain weave: alternate which thread is on top */

      float over = mod(id.x + id.y, 2.0);


      float cross = mix(f.x, f.y, over);

      float along = mix(f.y, f.x, over);


      float profile = pow(max(sin(cross * PI), 0.0), 0.8);

      float ends = 0.60 + 0.40 * sin(along * PI);

      float weave = profile * ends;


      /* thread direction: horizontal when over, else vertical */

      vec2 T2 = mix(vec2(0.0, 1.0), vec2(1.0, 0.0), over);

      vec2 C2 = T2.yx;


      /* ---------------------------------------------------
         LIGHTING
      --------------------------------------------------- */

      float diffuse = dot(n, L);

      /* little bump across each thread */

      float bump =
        cos(cross * PI) *
        dot(C2, L.xy) * 0.9;

      diffuse += bump * 0.30;

      float lit = pow(clamp(diffuse, 0.0, 1.0), 1.4);


      /* anisotropic highlight along the thread */

      vec3 T3 = normalize(
        vec3(T2, -dot(T2, n.xy) / max(n.z, 0.2))
      );

      vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

      float th = dot(T3, H);

      float spec = pow(
        sqrt(max(1.0 - th * th, 0.0)),
        36.0
      );

      spec *= smoothstep(0.0, 0.45, dot(n, L));


      float wv = mix(0.35, 1.0, weave);


      vec3 col = uDeep;

      col += uMid * lit * wv * 1.5;

      col += uHi * spec * (0.5 + 0.5 * weave) * 1.1;


      /* indigo backlight on slopes facing away from the light */

      float away = clamp(
        -dot(n.xy, normalize(L.xy)) * 1.6,
        0.0,
        1.0
      );

      col += uAccent * away * 0.14 * wv;


      /* soft glow, top right */

      float g = exp(
        -length(
          (p - vec2(aspect * 0.90, 0.78)) *
          vec2(0.8, 1.3)
        ) * 2.2
      );

      col += uGlow * g * 0.24 * (0.6 + 0.4 * wv);


      /* darken the very top so the navbar text stays readable */

      col *= mix(1.0, 0.38, smoothstep(0.68, 1.0, p.y));


      /* tone map + contrast */

      col = col / (1.0 + col * 0.35);

      col = pow(col, vec3(uContrast));


      gl_FragColor = vec4(col, 1.0);

    }
  `;


  /* =========================================================
     WEBGL SETUP
     ========================================================= */

  let gl = null;

  let program = null;

  let uniforms = {};

  let cellPx = 6;

  let rafId = 0;

  let covered = false;

  let startTime = performance.now();

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };


  function compile(type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

      console.error(
        'wave.js shader error:',
        gl.getShaderInfoLog(shader)
      );

      return null;

    }

    return shader;

  }


  function init() {

    gl =

      canvas.getContext('webgl', {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
      }) ||

      canvas.getContext('experimental-webgl');


    if (!gl) {

      fallback();

      return false;

    }


    const vs = compile(gl.VERTEX_SHADER, VERTEX);

    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);


    if (!vs || !fs) {

      fallback();

      return false;

    }


    program = gl.createProgram();

    gl.attachShader(program, vs);

    gl.attachShader(program, fs);

    gl.linkProgram(program);


    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

      console.error(
        'wave.js link error:',
        gl.getProgramInfoLog(program)
      );

      fallback();

      return false;

    }


    gl.useProgram(program);


    /* one big triangle covering the screen */

    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'aPos');

    gl.enableVertexAttribArray(aPos);

    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);


    uniforms = {};

    [
      'uRes', 'uTime', 'uCell', 'uLight', 'uContrast',
      'uDeep', 'uMid', 'uHi', 'uAccent', 'uGlow',
    ].forEach(name => {

      uniforms[name] = gl.getUniformLocation(program, name);

    });


    gl.uniform3fv(uniforms.uDeep, CONFIG.deep);

    gl.uniform3fv(uniforms.uMid, CONFIG.mid);

    gl.uniform3fv(uniforms.uHi, CONFIG.hi);

    gl.uniform3fv(uniforms.uAccent, CONFIG.accent);

    gl.uniform3fv(uniforms.uGlow, CONFIG.glow);

    gl.uniform1f(uniforms.uContrast, CONFIG.contrast);


    return true;

  }


  /*
    If WebGL is not available: a plain purple glow,
    so the hero is never empty.
  */

  function fallback() {

    const ctx = canvas.getContext('2d');

    if (!ctx) {

      return;

    }

    canvas.width = canvas.clientWidth || window.innerWidth;

    canvas.height = canvas.clientHeight || window.innerHeight;

    const gradient = ctx.createRadialGradient(
      canvas.width * 0.8, canvas.height * 0.1, 0,
      canvas.width * 0.8, canvas.height * 0.1, canvas.width * 0.9
    );

    gradient.addColorStop(0, '#4b2a8f');

    gradient.addColorStop(1, '#05010b');

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

  }


  /* =========================================================
     SIZING
     Capped so 4K screens and TVs stay smooth.
     ========================================================= */

  let lastCssW = 0;

  let lastCssH = 0;


  function resize() {

    if (!gl) {

      return;

    }


    const cssW = canvas.clientWidth || window.innerWidth;

    const cssH = canvas.clientHeight || window.innerHeight;


    if (cssW === lastCssW && cssH === lastCssH) {

      return;

    }

    lastCssW = cssW;

    lastCssH = cssH;


    let scale = Math.min(
      window.devicePixelRatio || 1,
      CONFIG.maxDpr
    );

    let width = cssW * scale;

    let height = cssH * scale;

    const pixels = width * height;


    if (pixels > CONFIG.maxPixels) {

      const k = Math.sqrt(CONFIG.maxPixels / pixels);

      scale *= k;

      width *= k;

      height *= k;

    }


    canvas.width = Math.max(2, Math.round(width));

    canvas.height = Math.max(2, Math.round(height));


    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);


    /* keep the weave the same visual size on every screen */

    cellPx =

      CONFIG.cellCss *
      Math.max(1, cssH / 1080) *
      scale;

    cellPx = Math.max(cellPx, 3.5);

    gl.uniform1f(uniforms.uCell, cellPx);


    if (reduceMotion) {

      draw(performance.now());

    }

  }


  /* =========================================================
     DRAW LOOP
     ========================================================= */

  function draw(now) {

    if (!gl) {

      return;

    }


    pointer.x += (pointer.tx - pointer.x) * 0.04;

    pointer.y += (pointer.ty - pointer.y) * 0.04;


    const seconds =

      reduceMotion
        ? 8.0
        : ((now - startTime) / 1000) * CONFIG.speed;


    gl.uniform1f(uniforms.uTime, seconds);

    gl.uniform2f(
      uniforms.uLight,
      pointer.x * CONFIG.pointerLight,
      pointer.y * CONFIG.pointerLight
    );

    gl.drawArrays(gl.TRIANGLES, 0, 3);

  }


  function frame(now) {

    rafId = requestAnimationFrame(frame);

    draw(now);

  }


  function start() {

    if (reduceMotion || rafId || !gl) {

      return;

    }

    rafId = requestAnimationFrame(frame);

  }


  function stop() {

    if (rafId) {

      cancelAnimationFrame(rafId);

      rafId = 0;

    }

  }


  /*
    Do not waste battery:
    pause when the tab is hidden or when the About section
    has fully covered the hero.
  */

  const aboutSection =
    document.getElementById('about');


  function syncRunning() {

    if (aboutSection) {

      covered =
        aboutSection.getBoundingClientRect().top <= 0;

    }

    if (document.hidden || covered) {

      stop();

    }
    else {

      start();

    }

  }


  /* =========================================================
     EVENTS
     ========================================================= */

  window.addEventListener(
    'scroll',
    syncRunning,
    { passive: true }
  );


  document.addEventListener(
    'visibilitychange',
    syncRunning
  );


  if ('ResizeObserver' in window) {

    new ResizeObserver(resize).observe(canvas);

  }
  else {

    window.addEventListener('resize', resize);

  }


  /* the light gently follows the mouse (desktop only) */

  if (
    CONFIG.pointerLight > 0 &&
    !reduceMotion &&
    window.matchMedia('(pointer: fine)').matches
  ) {

    window.addEventListener(
      'pointermove',
      event => {

        pointer.tx = event.clientX / window.innerWidth - 0.5;

        pointer.ty = -(event.clientY / window.innerHeight - 0.5);

      },
      { passive: true }
    );

  }


  /* recover if the GPU resets the WebGL context */

  canvas.addEventListener(
    'webglcontextlost',
    event => {

      event.preventDefault();

      stop();

    }
  );


  canvas.addEventListener(
    'webglcontextrestored',
    () => {

      lastCssW = 0;

      if (init()) {

        resize();

        syncRunning();

      }

    }
  );


  /* =========================================================
     GO
     ========================================================= */

  if (init()) {

    resize();

    if (reduceMotion) {

      draw(performance.now());

    }
    else {

      syncRunning();

    }

  }

})();