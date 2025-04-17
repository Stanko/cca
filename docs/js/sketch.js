
let canvas;
let time;
let theShader;
let isPlaying = true;


function preload() {
  theShader = loadShader('./glsl/shader.vert', './glsl/shader.frag');
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.id('p5Canvas');
}


function draw() {
  if (!isPlaying) return; 

  time = millis() / 1000;

  theShader.setUniform("time", time);
  theShader.setUniform("resolution", [width, height]);
  theShader.setUniform("mouse", [mouseX, height - 1 - mouseY]); // flip y for glsl

  shader(theShader);

  rectMode(CENTER);
  rect(0, 0, width, height);
}


function keyPressed() {
  switch (key) {
  case ' ':
    isPlaying = !isPlaying;
    break;
  case 's':
    save();
    break;
  case 'f':
    let fs = fullscreen();
    fullscreen(!fs);
    break;
  }
}


function mouseWheel(event) {
  let wheelDist = getWheelDistance(event);
  scrollScale *= exp(wheelDist * 0.06);
}
function getWheelDistance(evt) {
  if (!evt) evt = event;
  let w = evt.wheelDelta,
  d = evt.detail;
  if (d) {
    if (w) return (w / d / 40) * d > 0 ? 1 : -1; // Opera
    else return -d / 3; // Firefox;         TODO: do not /3 for OS X
  } else return w / 120; // IE/Safari/Chrome TODO: /3 for Chrome OS X
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
