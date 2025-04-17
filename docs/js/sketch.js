
let canvas;
let time;
let theShader;
let isPlaying = true;

let ccaPos0, ccaPos;
let ccaRadius = 25.4;
let isDraggingCcaPos = false;

function preload() {
  theShader = loadShader('./glsl/shader.vert', './glsl/shader.frag');
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.id('p5Canvas');

  ccaPos0 = createVector(0, -height/2 + 110);
  ccaPos = ccaPos0.copy();
}


function draw() {
  if (!isPlaying) return; 

  time = millis() / 1000;

  theShader.setUniform("time", time);
  theShader.setUniform("resolution", [width, height]);
  theShader.setUniform("ccaPxPos", [ccaPos.x, ccaPos.y]); // flip y for glsl
  theShader.setUniform("ccaPxRadius", ccaRadius);

  shader(theShader);

  rectMode(CENTER);
  rect(0, 0, width, height);

  push();
  resetShader();
  translate(ccaPos.x, ccaPos.y);
  blendMode(DIFFERENCE);
  drawCCA();
  pop();

  if (mouseIsPressed && isDraggingCcaPos) {
    setCursor('grabbing');
  }
  else {
    setCursor(isCursorOverCCA() ? 'grab' : 'default');
  }

  if (isDraggingCcaPos) {
    ccaPos.x = lerp(ccaPos.x, mouseX - width/2, 0.2);
    ccaPos.y = lerp(ccaPos.y, mouseY - height/2, 0.2);
  }
}

function setCursor(cursorType) {
  canvas.elt.style.cursor = cursorType;
}


function isCursorOverCCA() {
  return mouseX - width/2 < ccaPos.x + ccaRadius * 3 && mouseX - width/2 > ccaPos.x - ccaRadius * 3 &&
  mouseY - height/2 < ccaPos.y + ccaRadius && mouseY - height/2 > ccaPos.y - ccaRadius;
}


function drawCCA() {
  noFill();
  strokeWeight(ccaRadius * 0.38);
  const q = pow(
    map(
      -cos(
        constrain(
          fract(time * 0.1) / 0.1, 0, 1
        ) * PI
      ), -1, 1, 0, 1
    ), 1
  );
  const q2 = pow(
    map(
      -cos(
        constrain(
          fract(time * 0.1) / 0.1, 0, 1
        ) * TAU
      ), -1, 1, 0, 1
    ), 1
  );
  const offs = q2 * ccaRadius * 2;
  const rot = q * TAU;

  // CC
  stroke(255);
  for (let i = -1; i <= 0; i++) {
    push();
    {
      translate(i * ccaRadius * 2 + i * offs, 0);
      rotate(rot);
      arc(0, 0, ccaRadius * 2, ccaRadius * 2, PI/4, PI*7/4);
    }
    pop();
  }

  // A
  stroke('#ff6868');
  push();
  {
    translate(ccaRadius * 2 + offs, 0);
    rotate(rot);
    circle(0, 0, ccaRadius * 2);
    line(ccaRadius, 0, ccaRadius, ccaRadius);
  }
  pop();
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

function mousePressed() {
  if (isCursorOverCCA()) 
    isDraggingCcaPos = true;
}
function mouseReleased() {
  isDraggingCcaPos = false;
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
