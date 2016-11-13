/**
 * "Simplicity" by JoshP
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
 */

#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif

uniform float time; // current time
uniform vec2 viewportRes;
uniform vec2 offset; // of camera position
uniform float zoom;
uniform vec3 color;
uniform int details;

const float speed = 256.;

float field(in vec3 p) {
  float strength = 7. + .00003 * log(1.e-6 + fract(sin(time) * 4373.11));

  float accum = 0.;
  float prev = 0.;
  float tw = 0.;
  for (int i = 0; i < 512; ++i) {
    if (i > details) break;
    float mag = dot(p, p);
    p = abs(p) / mag + vec3(-.5, -.4, -1.5);
    float w = exp(-float(i) / 7.);
    accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
    tw += w;
    prev = mag;
  }
  return max(0., 5. * accum / tw - .7);
}

void main() {
  vec2 uv = 2. * gl_FragCoord.xy / viewportRes.xy - 1.;
  vec2 uvs = uv * viewportRes.xy / max(viewportRes.x, viewportRes.y);
  vec3 p = vec3(uvs / zoom, 0.0) + vec3(1.0, -0.63, 0.0);
  p += .2 * vec3(offset.x, offset.y, sin(time / speed));
  float t = field(p);

  gl_FragColor = vec4(
    color.r * t * t * t,
    color.g * t * t,
    color.b * t,
    1.8
  );
}
