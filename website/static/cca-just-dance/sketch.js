let time;
let sound, amp;
let isPlaying = false;

function preload() {
  sound = loadSound("beat.mp3");
}

function setup() {
  let button = select("#playpause");

  let ctx = getAudioContext();

  button.mousePressed((e) => {
    if (isPlaying) {
      button.html("Play");
      sound.pause();
    } else {
      button.html("Pause");
      sound.play();
    }

    isPlaying = !isPlaying;
  });

  createCanvas(windowWidth, windowHeight);
  amp = new p5.Amplitude();

  if (ctx.state === "running") {
    isPlaying = true;
    sound.play();
    button.html("Pause");
  } else {
    button.html("Play");
  }
}

function draw() {
  time = millis() / 1000;

  background("#334455");
  translate(width / 2, height / 2);

  const ccaRadius = min(width, height) * 0.1;

  // let strokeFraction = -cos(time * 0.5) * 0.5 + 0.5;
  let level = amp.getLevel();
  let strokeFraction = constrain(map(level, 0, 0.5, 0, 1), 0, 1);

  if (!isPlaying && strokeFraction === 0) {
    strokeFraction = 0.5;
  }

  // if (mouseIsPressed) {
  //   strokeFraction = mouseX / width;
  // }

  drawCCA(ccaRadius, strokeFraction);
}

function drawCCA(radius, strokeFraction) {
  // jump animation
  const q = pow(
    map(-cos(constrain(fract(time * 0.1) / 0.1, 0, 1) * PI), -1, 1, 0, 1),
    1,
  );
  const q2 = pow(
    map(-cos(constrain(fract(time * 0.1) / 0.1, 0, 1) * TAU), -1, 1, 0, 1),
    1,
  );
  const offs = isPlaying ? q2 * radius * 2 : 0;
  const rot = isPlaying ? q * TAU : 0;

  noFill();
  const strokeW = strokeFraction * radius;
  strokeWeight(strokeW);

  // offset between tip of C and next circle
  const offsetDist = strokeW + radius * 0.25;

  // CC
  const R2 = radius + offsetDist;
  // circle intersection
  const x = 2 * radius - (3 * sq(radius) + sq(R2)) / (4 * radius);
  const theta = acos(x / radius);

  const cAngle = radians(30);
  stroke("#ffffff");
  for (let i = -1; i <= 0; i++) {
    push();
    {
      translate(i * radius * 2 + i * offs, 0);
      rotate(rot);
      arc(0, 0, radius * 2, radius * 2, theta, TAU - theta);
    }
    pop();
  }

  // A
  stroke("#ff6868");
  push();
  {
    translate(radius * 2 + offs, 0);
    rotate(rot);
    circle(0, 0, radius * 2);
    line(radius, 0, radius, radius);
  }
  pop();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
