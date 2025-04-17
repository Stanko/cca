
#define PI             3.14159265358979323846264
#define TAU            6.28318530717958647692528
#define SQRT_2         1.41421356237309504880169
#define PHI            1.61803398874989484820459
#define E              2.71828182845904523536028

precision highp float;

varying vec2 vTexCoord;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

#define TIME (time * 0.1)
#define SCALE 1.

vec2 px2ShaderSpace(vec2 pxPos) {
  return (pxPos - resolution * 0.5) / min(resolution.x, resolution.y) * 2. / SCALE;
}

float sdCCA(in vec2 pos) {
  float sd = length(pos);
  return sd;
}

void main() {
  vec2 pos = px2ShaderSpace(vTexCoord * resolution);
  vec2 mousePos = px2ShaderSpace(mouse);

  mat2 M = mat2(0.2, -0.8, 1.1, -0.6) * TIME * TAU;
  M = mat2(cos(M[0][0]), cos(M[0][1]), cos(M[1][0]), cos(M[1][1]));// * 0.5 + 0.5;
  M += mat2(1.3, 0.9, -0.48, 1.4);
  M /= M[0][0] * M[1][1] - M[1][0] * M[0][1];

  vec2 m = M * (pos - mousePos);
  vec3 col = vec3(pos, 0.) + vec3(0., mousePos) + vec3(0., abs(m));
  col += 1. - step(0.1, length(m) - 0.5);

  gl_FragColor = vec4(col, 1.0);
}