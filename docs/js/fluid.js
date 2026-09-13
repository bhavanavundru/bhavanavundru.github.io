import * as THREE from "three";
import {
  fullscreenVertexShader,
  advectionFragmentShader,
  splatFragmentShader,
  curlFragmentShader,
  vorticityFragmentShader,
  divergenceFragmentShader,
  pressureFragmentShader,
  gradientSubtractFragmentShader,
  smoothFragmentShader,
  displayFragmentShader,
} from "./shaders.js";

function makeMaterial(fragmentShader, uniforms = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: fullscreenVertexShader,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    transparent: false,
  });
}

class DoubleFBO {
  constructor(read, write) {
    this.read = read;
    this.write = write;
  }

  swap() {
    const temp = this.read;
    this.read = this.write;
    this.write = temp;
  }

  dispose() {
    this.read.dispose();
    this.write.dispose();
  }
}

export class FluidBackground {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x050507, 1);

    this.isWebGL2 = this.renderer.capabilities.isWebGL2;
    this.hasFloatBuffer =
      this.renderer.extensions.has("EXT_color_buffer_float") ||
      this.renderer.extensions.has("EXT_color_buffer_half_float");

    if (!this.isWebGL2 || !this.hasFloatBuffer) {
      this.disabled = true;
      document.body.classList.add("fluid-fallback");
      this.renderer.dispose();
      return;
    }

    this.disabled = false;
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
    this.scene.add(this.quad);

    // renderX/renderY are the last coordinates that were actually injected
    // into the simulation. Keeping these separate from pointer events means
    // several browser events between two animation frames do not leave gaps.
    this.pointer = {
      x: 0.5,
      y: 0.5,
      renderX: 0.5,
      renderY: 0.5,
      moved: false,
      initialized: false,
      lastMove: performance.now(),
    };

    this.mobile = matchMedia("(max-width: 700px)").matches;

    // A little more simulation resolution helps the pressure field remain
    // smooth, while the reduced vorticity below prevents the extra resolution
    // from turning into lots of tiny curls.
    this.simBase = this.mobile ? 192 : 288;
    this.dyeBase = this.mobile ? 420 : 760;
    this.pressureIterations = this.mobile ? 18 : 32;

    // IMPORTANT: the previous values (8/14) intentionally generated strong
    // small-scale curl. That is the main reason the cloud edges grew into
    // branching, line-like "screensaver" filaments.
    this.curlStrength = this.mobile ? 0.75 : 1.1;

    // Slightly stronger damping + explicit smoothing = soft cloud-like flow.
    this.velocityDissipation = 0.982;
    this.dyeDissipation = 0.989;
    this.velocitySmoothing = this.mobile ? 0.12 : 0.10;
    this.dyeSmoothing = this.mobile ? 0.11 : 0.085;

    this.splatRadius = this.mobile ? 0.0032 : 0.0042;

    this.ambientSeeds = this.buildAmbientSeeds();

    this.buildMaterials();
    this.resize();
    this.seed();

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerleave", this.onPointerLeave, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });

    this.raf = requestAnimationFrame(this.animate);
  }

  buildMaterials() {
    this.advectionMaterial = makeMaterial(advectionFragmentShader, {
      uVelocity: { value: null },
      uSource: { value: null },
      uTexelSize: { value: new THREE.Vector2(1, 1) },
      uDt: { value: 0.016 },
      uDissipation: { value: 0.99 },
    });

    this.splatMaterial = makeMaterial(splatFragmentShader, {
      uTarget: { value: null },
      uPoint: { value: new THREE.Vector2(0.5, 0.5) },
      uPreviousPoint: { value: new THREE.Vector2(0.5, 0.5) },
      uValue: { value: new THREE.Vector3() },
      uRadius: { value: this.splatRadius },
      uAspect: { value: 1 },
    });

    this.curlMaterial = makeMaterial(curlFragmentShader, {
      uVelocity: { value: null },
      uTexelSize: { value: new THREE.Vector2(1, 1) },
    });

    this.vorticityMaterial = makeMaterial(vorticityFragmentShader, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uCurlStrength: { value: this.curlStrength },
      uTexelSize: { value: new THREE.Vector2(1, 1) },
      uDt: { value: 0.016 },
    });

    this.divergenceMaterial = makeMaterial(divergenceFragmentShader, {
      uVelocity: { value: null },
      uTexelSize: { value: new THREE.Vector2(1, 1) },
    });

    this.pressureMaterial = makeMaterial(pressureFragmentShader, {
      uPressure: { value: null },
      uDivergence: { value: null },
      uTexelSize: { value: new THREE.Vector2(1, 1) },
    });

    this.gradientSubtractMaterial = makeMaterial(
      gradientSubtractFragmentShader,
      {
        uPressure: { value: null },
        uVelocity: { value: null },
        uTexelSize: { value: new THREE.Vector2(1, 1) },
      }
    );

    this.smoothMaterial = makeMaterial(smoothFragmentShader, {
      uSource: { value: null },
      uTexelSize: { value: new THREE.Vector2(1, 1) },
      uAmount: { value: 0.1 },
    });

    this.displayMaterial = makeMaterial(displayFragmentShader, {
      uDye: { value: null },
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
    });
  }

  getResolution(base) {
    const aspect = window.innerWidth / Math.max(window.innerHeight, 1);

    if (aspect >= 1) {
      return {
        width: Math.max(2, Math.round(base * aspect)),
        height: base,
      };
    }

    return {
      width: base,
      height: Math.max(2, Math.round(base / aspect)),
    };
  }

  makeTarget(
    width,
    height,
    filter = THREE.LinearFilter,
    format = THREE.RGBAFormat
  ) {
    return new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      format,
      minFilter: filter,
      magFilter: filter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    });
  }

  makeDouble(
    width,
    height,
    filter = THREE.LinearFilter,
    format = THREE.RGBAFormat
  ) {
    return new DoubleFBO(
      this.makeTarget(width, height, filter, format),
      this.makeTarget(width, height, filter, format)
    );
  }

  disposeTargets() {
    this.velocity?.dispose();
    this.dye?.dispose();
    this.pressure?.dispose();
    this.divergence?.dispose();
    this.curl?.dispose();
  }

  resize() {
    if (this.disabled) return;

    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);

    this.renderer.setSize(width, height, false);

    const sim = this.getResolution(this.simBase);
    const dye = this.getResolution(this.dyeBase);

    this.disposeTargets();

    this.velocity = this.makeDouble(
      sim.width,
      sim.height,
      THREE.LinearFilter,
      THREE.RGFormat
    );

    this.pressure = this.makeDouble(
      sim.width,
      sim.height,
      THREE.NearestFilter,
      THREE.RedFormat
    );

    this.divergence = this.makeTarget(
      sim.width,
      sim.height,
      THREE.NearestFilter,
      THREE.RedFormat
    );

    this.curl = this.makeTarget(
      sim.width,
      sim.height,
      THREE.NearestFilter,
      THREE.RedFormat
    );

    this.dye = this.makeDouble(dye.width, dye.height);

    this.simTexel = new THREE.Vector2(1 / sim.width, 1 / sim.height);
    this.dyeTexel = new THREE.Vector2(1 / dye.width, 1 / dye.height);

    this.displayMaterial.uniforms.uResolution.value.set(width, height);

    this.clearTarget(this.velocity.read);
    this.clearTarget(this.velocity.write);
    this.clearTarget(this.pressure.read);
    this.clearTarget(this.pressure.write);
    this.clearTarget(this.divergence);
    this.clearTarget(this.curl);
    this.clearTarget(this.dye.read);
    this.clearTarget(this.dye.write);
  }

  onResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.resize();
      this.seed();
    }, 120);
  }

  onPointerMove(event) {
    const x = event.clientX / Math.max(window.innerWidth, 1);
    const y = 1 - event.clientY / Math.max(window.innerHeight, 1);

    // The first pointer sample only initialises the brush. Without this guard,
    // entering the page can draw a huge line from the screen centre.
    if (!this.pointer.initialized) {
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointer.renderX = x;
      this.pointer.renderY = y;
      this.pointer.initialized = true;
      this.pointer.lastMove = performance.now();
      return;
    }

    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.moved = true;
    this.pointer.lastMove = performance.now();
  }

  onPointerLeave() {
    // Re-initialise on re-entry so we never connect two distant positions with
    // one giant stroke after the cursor has left the browser window.
    this.pointer.initialized = false;
    this.pointer.moved = false;
  }

  render(material, target = null) {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  clearTarget(target) {
    const old = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(target);
    this.renderer.clear(true, false, false);
    this.renderer.setRenderTarget(old);
  }

  palette(t) {
    const palette = [
      new THREE.Color("#172b63"), // dark blue
      new THREE.Color("#6d3cf3"), // existing violet
      new THREE.Color("#7167b8"), // blue-violet
      new THREE.Color("#e15acb"), // existing magenta
      new THREE.Color("#d978ad"), // pink
      new THREE.Color("#b84f5d"), // softened red
      new THREE.Color("#f3b45d"), // existing orange-yellow
      new THREE.Color("#6fbf69"), // parrot green
    ];

    // Travel slowly through the full spectrum, including a final blend back
    // into deep blue so the palette loops without a hard color jump.
    const wave = (0.5 + 0.5 * Math.sin(t * 0.95)) * palette.length;
    const from = Math.floor(wave) % palette.length;
    const to = (from + 1) % palette.length;
    const linearAmount = wave - Math.floor(wave);
    const amount = linearAmount * linearAmount * (3.0 - 2.0 * linearAmount);
    const color = palette[from].clone().lerp(palette[to], amount);

    return color.multiplyScalar(0.82);
  }

  // fromX/fromY let one shader invocation paint a continuous capsule from the
  // previous cursor position to the new one. For ordinary point splats just
  // leave them equal to x/y.
  splat(
    targetDouble,
    x,
    y,
    value,
    radius = this.splatRadius,
    fromX = x,
    fromY = y
  ) {
    this.splatMaterial.uniforms.uTarget.value = targetDouble.read.texture;
    this.splatMaterial.uniforms.uPoint.value.set(x, y);
    this.splatMaterial.uniforms.uPreviousPoint.value.set(fromX, fromY);
    this.splatMaterial.uniforms.uValue.value.copy(value);
    this.splatMaterial.uniforms.uRadius.value = radius;
    this.splatMaterial.uniforms.uAspect.value =
      window.innerWidth / Math.max(window.innerHeight, 1);

    this.render(this.splatMaterial, targetDouble.write);
    targetDouble.swap();
  }

  smooth(targetDouble, texelSize, amount) {
    this.smoothMaterial.uniforms.uSource.value = targetDouble.read.texture;
    this.smoothMaterial.uniforms.uTexelSize.value.copy(texelSize);
    this.smoothMaterial.uniforms.uAmount.value = amount;

    this.render(this.smoothMaterial, targetDouble.write);
    targetDouble.swap();
  }

  pointerSplat(time) {
    if (!this.pointer.initialized || !this.pointer.moved) return;

    let fromX = this.pointer.renderX;
    let fromY = this.pointer.renderY;
    const toX = this.pointer.x;
    const toY = this.pointer.y;

    let dx = toX - fromX;
    let dy = toY - fromY;

    const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    const screenDistance = Math.hypot(dx * aspect, dy);

    // Treat giant jumps as a fresh point instead of drawing a streak across
    // the whole page (can happen with monitor/window transitions).
    if (screenDistance > 0.30) {
      fromX = toX;
      fromY = toY;
      dx = 0;
      dy = 0;
    }

    // Lower force than before: enough movement for the fluid response, but not
    // enough to generate hard shear layers that later become skinny lines.
    const force = new THREE.Vector3(dx * 1500, dy * 1500, 0);
    force.x = THREE.MathUtils.clamp(force.x, -78, 78);
    force.y = THREE.MathUtils.clamp(force.y, -78, 78);

    this.splat(
      this.velocity,
      toX,
      toY,
      force,
      this.splatRadius * 1.15,
      fromX,
      fromY
    );

    const color = this.palette(time).multiplyScalar(1.45);
    this.splat(
      this.dye,
      toX,
      toY,
      new THREE.Vector3(color.r, color.g, color.b),
      this.splatRadius * 4.6,
      fromX,
      fromY
    );

    this.pointer.renderX = toX;
    this.pointer.renderY = toY;
    this.pointer.moved = false;
  }

  buildAmbientSeeds() {
    const count = this.mobile ? 3 : 5;
    const seeds = [];

    for (let i = 0; i < count; i++) {
      seeds.push({
        baseX: 0.18 + Math.random() * 0.64,
        baseY: 0.18 + Math.random() * 0.64,
        orbitX: 0.16 + Math.random() * 0.2,
        orbitY: 0.16 + Math.random() * 0.2,
        freqX: 0.035 + Math.random() * 0.045,
        freqY: 0.035 + Math.random() * 0.045,
        driftFreqX: 0.006 + Math.random() * 0.01,
        driftFreqY: 0.006 + Math.random() * 0.01,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        spin: Math.random() < 0.5 ? -1 : 1,
        colorPhase: Math.random() * 12,
        dyeScale: 7 + Math.random() * 5,
        lastX: null,
        lastY: null,
      });
    }

    return seeds;
  }

  ambientSplat(time) {
    if (!this.ambientSeeds) return;

    const idleFor = performance.now() - this.pointer.lastMove;
    const idleMix = Math.max(0, Math.min(1, (idleFor - 300) / 900));
    if (idleMix <= 0) return;

    for (const seed of this.ambientSeeds) {
      const driftX = Math.sin(time * seed.driftFreqX) * 0.14;
      const driftY = Math.cos(time * seed.driftFreqY) * 0.14;

      const wx = time * seed.freqX + seed.phaseX;
      const wy = time * seed.freqY + seed.phaseY;

      const x = seed.baseX + driftX + Math.sin(wx) * seed.orbitX;
      const y = seed.baseY + driftY + Math.cos(wy) * seed.orbitY;

      const vx = Math.cos(wx) * seed.freqX * seed.orbitX * seed.spin * 180;
      const vy = -Math.sin(wy) * seed.freqY * seed.orbitY * seed.spin * 180;

      const fromX = seed.lastX ?? x;
      const fromY = seed.lastY ?? y;

      this.splat(
        this.velocity,
        x,
        y,
        new THREE.Vector3(vx, vy, 0),
        this.splatRadius * 1.5,
        fromX,
        fromY
      );

      const color = this.palette(time * 0.55 + seed.colorPhase).multiplyScalar(
        0.10 * idleMix
      );

      this.splat(
        this.dye,
        x,
        y,
        new THREE.Vector3(color.r, color.g, color.b),
        this.splatRadius * seed.dyeScale,
        fromX,
        fromY
      );

      seed.lastX = x;
      seed.lastY = y;
    }
  }

  seed() {
    if (this.disabled || !this.dye || !this.velocity) return;

    const seeds = [
      [0.30, 0.62, 5.0, -2.2, 0.0],
      [0.68, 0.42, -4.5, 3.5, 1.6],
      [0.55, 0.70, 2.2, 4.0, 3.1],
      [0.22, 0.30, 3.8, 1.6, 4.4],
      [0.80, 0.68, -3.0, -2.0, 6.0],
    ];

    for (const [x, y, vx, vy, phase] of seeds) {
      this.splat(
        this.velocity,
        x,
        y,
        new THREE.Vector3(vx, vy, 0),
        this.splatRadius * 1.6
      );

      const color = this.palette(phase).multiplyScalar(0.78);
      this.splat(
        this.dye,
        x,
        y,
        new THREE.Vector3(color.r, color.g, color.b),
        this.splatRadius * 12.0
      );
    }
  }

  step(dt, time) {
    // 1) Advect velocity along itself.
    this.advectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionMaterial.uniforms.uSource.value = this.velocity.read.texture;
    this.advectionMaterial.uniforms.uTexelSize.value.copy(this.simTexel);
    this.advectionMaterial.uniforms.uDt.value = dt;
    this.advectionMaterial.uniforms.uDissipation.value =
      this.velocityDissipation;
    this.render(this.advectionMaterial, this.velocity.write);
    this.velocity.swap();

    // 2) Cursor / autonomous forces.
    this.pointerSplat(time);
    this.ambientSplat(time);

    // 3) Light velocity diffusion. This kills tiny shear spikes before the
    // vorticity pass has a chance to turn them into visible strands.
    this.smooth(this.velocity, this.simTexel, this.velocitySmoothing);

    // 4) Very mild curl / vorticity confinement.
    this.curlMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
    this.curlMaterial.uniforms.uTexelSize.value.copy(this.simTexel);
    this.render(this.curlMaterial, this.curl);

    this.vorticityMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityMaterial.uniforms.uCurl.value = this.curl.texture;
    this.vorticityMaterial.uniforms.uCurlStrength.value = this.curlStrength;
    this.vorticityMaterial.uniforms.uTexelSize.value.copy(this.simTexel);
    this.vorticityMaterial.uniforms.uDt.value = dt;
    this.render(this.vorticityMaterial, this.velocity.write);
    this.velocity.swap();

    // 5) Divergence.
    this.divergenceMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
    this.divergenceMaterial.uniforms.uTexelSize.value.copy(this.simTexel);
    this.render(this.divergenceMaterial, this.divergence);

    // 6) Pressure solve.
    this.pressureMaterial.uniforms.uDivergence.value = this.divergence.texture;
    this.pressureMaterial.uniforms.uTexelSize.value.copy(this.simTexel);

    for (let i = 0; i < this.pressureIterations; i++) {
      this.pressureMaterial.uniforms.uPressure.value = this.pressure.read.texture;
      this.render(this.pressureMaterial, this.pressure.write);
      this.pressure.swap();
    }

    // 7) Pressure projection.
    this.gradientSubtractMaterial.uniforms.uPressure.value =
      this.pressure.read.texture;
    this.gradientSubtractMaterial.uniforms.uVelocity.value =
      this.velocity.read.texture;
    this.gradientSubtractMaterial.uniforms.uTexelSize.value.copy(this.simTexel);
    this.render(this.gradientSubtractMaterial, this.velocity.write);
    this.velocity.swap();

    // 8) Advect dye.
    this.advectionMaterial.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectionMaterial.uniforms.uSource.value = this.dye.read.texture;

    // IMPORTANT FIX:
    // Velocity is stored in SIMULATION-grid cell units, so dye advection must
    // also convert velocity using simTexel. Using dyeTexel here makes the dye
    // move at a different scale than the velocity field and creates detached,
    // stretched patches as the two resolutions diverge.
    this.advectionMaterial.uniforms.uTexelSize.value.copy(this.simTexel);

    this.advectionMaterial.uniforms.uDt.value = dt;
    this.advectionMaterial.uniforms.uDissipation.value = this.dyeDissipation;
    this.render(this.advectionMaterial, this.dye.write);
    this.dye.swap();

    // 9) Very light dye diffusion gives the cloud a continuous soft surface.
    this.smooth(this.dye, this.dyeTexel, this.dyeSmoothing);
  }

  animate() {
    if (this.disabled) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 1 / 30);
    const time = this.clock.elapsedTime;

    this.step(dt, time);

    this.displayMaterial.uniforms.uDye.value = this.dye.read.texture;
    this.displayMaterial.uniforms.uTime.value = time;
    this.render(this.displayMaterial, null);

    this.raf = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.disabled) return;

    cancelAnimationFrame(this.raf);
    clearTimeout(this.resizeTimer);

    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerleave", this.onPointerLeave);
    window.removeEventListener("resize", this.onResize);

    this.disposeTargets();
    this.quad.geometry.dispose();

    [
      this.advectionMaterial,
      this.splatMaterial,
      this.curlMaterial,
      this.vorticityMaterial,
      this.divergenceMaterial,
      this.pressureMaterial,
      this.gradientSubtractMaterial,
      this.smoothMaterial,
      this.displayMaterial,
    ].forEach((material) => material.dispose());

    this.renderer.dispose();
  }
}
