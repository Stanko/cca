
#define PI             3.14159265358979323846264
#define TAU            6.28318530717958647692528
#define SQRT_2         1.41421356237309504880169
#define PHI            1.61803398874989484820459
#define E              2.71828182845904523536028

precision highp float;

varying vec2 vTexCoord;

uniform float time;
uniform vec2 resolution;
uniform vec2 ccaPxPos;
uniform float ccaPxRadius;

#define TIME (time * 0.04)
#define SCALE 1.
#define MINWH min(resolution.x, resolution.y)


float px2ShaderSpace(float pxLen) {
  return pxLen / MINWH * 2. / SCALE;
}
vec2 px2ShaderSpace(vec2 pxPos) {
  return (pxPos - resolution * 0.5) / MINWH * 2. / SCALE;
}

// float sdCCA(in vec2 pos) {
//   float sd = length(pos);
//   return sd;
// }

void main() {
  vec2 pos = px2ShaderSpace(vTexCoord * resolution);
  vec2 ccaPos = px2ShaderSpace(ccaPxPos + resolution * 0.5);
  float ccaR = px2ShaderSpace(ccaPxRadius);

  mat2 M = mat2(0.2, -0.8, 1.1, -0.6) + TIME * TAU;
  M = mat2(cos(M[0][0]), cos(M[0][1]), cos(M[1][0]), cos(M[1][1]));// * 0.5 + 0.5;
  M += mat2(1.3, 0.9, -0.48, 1.4);
  M /= M[0][0] * M[1][1] - M[1][0] * M[0][1];

  vec2 m = M * (pos - ccaPos) + cos(TIME * TAU * 2.) * 0.2;
  vec3 col = vec3(pos - ccaPos, 0.) + vec3(0., abs(m));
  col += step(0.1, length(m) + sin(length(m) * 4. + m.xyy * 10.) - 0.5);
  // col = abs(col);

  #define RED vec3(1., 0.408, 0.408)
  #define GREY vec3(0.20, 0.27, 0.33)
  // col = mix(GREY, RED, col.r);
  // col = mix(col, vec3(1.), col.b);
  // col = mix(col, RED, col.g);
  col = -cos(col * PI * 3.) * 0.5 + 0.5;
  col = col.r * RED + (col.g + col.b) * GREY;

  // col = clamp(col, 0., 1.);

  col *= pow(distance(pos, ccaPos) * 0.5, 2.);
  // col = clamp(col, 0., 1.);

  col *= 0.5;
  col += mix(GREY, RED, col);

  gl_FragColor = vec4(col, 1.0);
}