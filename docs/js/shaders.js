export const fullscreenVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const advectionFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDissipation;

  varying vec2 vUv;

  void main() {
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    vec2 coord = vUv - uDt * velocity * uTexelSize;
    coord = clamp(coord, vec2(0.001), vec2(0.999));

    vec4 result = texture2D(uSource, coord);
    gl_FragColor = result * uDissipation;
  }
`;

// A capsule/line splat instead of a single circular point.
// For pointer motion, uPreviousPoint -> uPoint forms one continuous brush stroke,
// so fast mouse motion cannot turn into separated dots.
export const splatFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTarget;
  uniform vec2 uPoint;
  uniform vec2 uPreviousPoint;
  uniform vec3 uValue;
  uniform float uRadius;
  uniform float uAspect;

  varying vec2 vUv;

  void main() {
    vec2 p = vUv;
    vec2 a = uPreviousPoint;
    vec2 b = uPoint;

    // Work in aspect-corrected space so the brush stays round on screen.
    p.x *= uAspect;
    a.x *= uAspect;
    b.x *= uAspect;

    vec2 ab = b - a;
    float denom = max(dot(ab, ab), 1e-8);
    float t = clamp(dot(p - a, ab) / denom, 0.0, 1.0);
    vec2 closest = a + ab * t;
    vec2 d = p - closest;

    float falloff = exp(-dot(d, d) / max(uRadius, 0.00001));
    vec4 base = texture2D(uTarget, vUv);

    gl_FragColor = base + vec4(uValue * falloff, 0.0);
  }
`;

export const curlFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;

  varying vec2 vUv;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;

    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

// Very gentle vorticity confinement. The previous version was deliberately
// re-injecting lots of small-scale curl, which is exactly what creates the
// thin branching / old-screensaver-looking filaments at the cloud edges.
export const vorticityFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float uCurlStrength;
  uniform vec2 uTexelSize;
  uniform float uDt;

  varying vec2 vUv;

  void main() {
    float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 grad = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    float gradLen = length(grad);

    // Ignore tiny/noisy curls instead of normalising them into full-strength
    // directions. Also fade confinement in only for meaningful curl values.
    float gradMask = smoothstep(0.004, 0.035, gradLen);
    float curlMask = smoothstep(0.008, 0.08, abs(C));
    vec2 dir = grad / max(gradLen, 0.0001);

    vec2 force = dir * uCurlStrength * C * gradMask * curlMask;
    force.y *= -1.0;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * uDt;
    velocity = clamp(velocity, -180.0, 180.0);

    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const divergenceFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;

  varying vec2 vUv;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;

    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

export const pressureFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexelSize;

  varying vec2 vUv;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float divergence = texture2D(uDivergence, vUv).x;

    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

export const gradientSubtractFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;

  varying vec2 vUv;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= 0.5 * vec2(R - L, T - B);

    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

// A tiny 3x3 Gaussian-ish diffusion pass. Applied lightly to velocity and dye.
// It removes the high-frequency wisps/filaments without turning the whole
// background into one giant blurry gradient.
export const smoothFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uAmount;

  varying vec2 vUv;

  void main() {
    vec2 x = vec2(uTexelSize.x, 0.0);
    vec2 y = vec2(0.0, uTexelSize.y);

    vec4 C  = texture2D(uSource, vUv);
    vec4 L  = texture2D(uSource, vUv - x);
    vec4 R  = texture2D(uSource, vUv + x);
    vec4 B  = texture2D(uSource, vUv - y);
    vec4 T  = texture2D(uSource, vUv + y);
    vec4 LB = texture2D(uSource, vUv - x - y);
    vec4 LT = texture2D(uSource, vUv - x + y);
    vec4 RB = texture2D(uSource, vUv + x - y);
    vec4 RT = texture2D(uSource, vUv + x + y);

    vec4 blurred =
      C * 0.25 +
      (L + R + B + T) * 0.125 +
      (LB + LT + RB + RT) * 0.0625;

    gl_FragColor = mix(C, blurred, clamp(uAmount, 0.0, 1.0));
  }
`;

export const displayFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uDye;
  uniform vec2 uResolution;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec3 dye = max(texture2D(uDye, vUv).rgb, 0.0);

    // Suppress ultra-faint density. Those almost-invisible leftovers are the
    // ones that read as thin hair/vein lines after glow is applied.
    float density = max(dye.r, max(dye.g, dye.b));
    float body = smoothstep(0.003, 0.045, density);
    dye *= mix(0.45, 1.0, body);

    // Gentler glow than pow(..., 0.72). The old exponent strongly boosted
    // tiny low-density strands, making every little filament visible.
    vec3 glow = pow(dye, vec3(0.88)) * 1.20;

    vec3 background = vec3(0.011, 0.009, 0.017);
    background += vec3(0.018, 0.010, 0.028) *
      (0.5 + 0.5 * sin(uTime * 0.10));

    float vignette = smoothstep(0.92, 0.20, distance(vUv, vec2(0.5)));
    vec3 color = background + glow * (0.58 + 0.42 * vignette);

    // No per-frame film grain here. It made the smooth fluid look speckled.
    color = color / (1.0 + color);
    color = pow(color, vec3(0.94));

    gl_FragColor = vec4(color, 1.0);
  }
`;
