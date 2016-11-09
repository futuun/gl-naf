/**
 * "Simplicity" by JoshP
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/
 */

precision mediump float;
uniform float cycle; // current cycle
uniform vec2 viewportRes;
uniform vec2 offset; // of camera position
uniform float zoom;
uniform float speed; // of building the fractal
uniform float brightness;
uniform vec3 color;
uniform float flashiness;
uniform float size;
const int resolution = 24;

float field(in vec3 p) {
	float strength = size + flashiness * log(1.e-16 + fract(sin(cycle) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < resolution; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-.5, -.4, -1.5);
		float w = exp(-float(i) / 7.);
		accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
		tw += w;
		prev = mag;
	}
	return max(0., 4.3 * accum / tw - .7);
}

void main() {
	vec2 uv = 2. * gl_FragCoord.xy / viewportRes.xy - 1.;
	vec2 uvs = uv * viewportRes.xy / max(viewportRes.x, viewportRes.y);
	vec3 p = vec3(uvs / zoom, 0) + vec3(1., -1.3, 0.);
	p += .2 * vec3(offset.x, offset.y, sin(cycle / speed));

	float t = field(p);
  gl_FragColor = mix(0.1, 1.0, brightness) * vec4(color.r * t * t * t, color.g *t * t, color.b * t, 1.0);
}
