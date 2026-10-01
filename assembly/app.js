const FPS = 12;
const FRAME_TIME = 1000 / FPS;

const TIME_BETWEEN_WAVES_MS = 7000;
const WAVE_DURATION_MS = 3000;

const WAVE_WIDTH = 50;
const WAVE_HEIGHT = 10;

function startRectWaves(svg) {
  if (!(svg instanceof SVGElement)) {
    throw new Error("Expected an SVGElement");
  }

  const rects = [...svg.querySelectorAll("rect")];
  if (!rects.length) return () => {};

  const items = rects
    .map((rect, index) => ({
      rect,
      positionX:
        (Number(rect.getAttribute("x")) || 0) +
        (Number(rect.getAttribute("width")) || 0) / 2,
      index,
    }))
    .sort((a, b) => a.positionX - b.positionX || a.index - b.index);

  const minX = items[0].positionX - WAVE_WIDTH;
  const maxX = items[items.length - 1].positionX + WAVE_WIDTH;
  const spanX = Math.max(1, maxX - minX);

  let running = true;
  let intervalId = 0;
  let lastFrame = 0;

  const waves = [];

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function addWave() {
    waves.push({ startTime: performance.now() });
  }

  function tick(now) {
    if (!running) return;

    if (now - lastFrame < FRAME_TIME) {
      requestAnimationFrame(tick);
      return;
    }
    lastFrame = now;

    for (const item of items) {
      let offsetY = 0;

      for (const wave of waves) {
        const t = clamp((now - wave.startTime) / WAVE_DURATION_MS, 0, 1);

        // linear movement (no easing)
        const headX = minX + t * spanX;

        const dist = Math.abs(item.positionX - headX);
        if (dist > WAVE_WIDTH) continue;

        const influence = 1 - dist / WAVE_WIDTH;
        offsetY = Math.max(offsetY, WAVE_HEIGHT * influence);
      }

      item.rect.setAttribute("transform", `translate(0 ${-offsetY})`);
    }

    for (let i = waves.length - 1; i >= 0; i--) {
      if (now - waves[i].startTime >= WAVE_DURATION_MS) {
        waves.splice(i, 1);
      }
    }

    requestAnimationFrame(tick);
  }

  addWave();
  intervalId = setInterval(addWave, TIME_BETWEEN_WAVES_MS);
  requestAnimationFrame(tick);

  return function stop() {
    running = false;
    clearInterval(intervalId);

    for (const item of items) {
      item.rect.removeAttribute("transform");
    }
  };
}

// usage
const svg = document.querySelector(".hero__logo-svg");
const stopWaves = startRectWaves(svg);
