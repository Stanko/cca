// ----- Scrollbar ----- //

const updateScrollbarWidth = () => {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.documentElement.style.setProperty(
    "--scrollbar-width",
    scrollbarWidth + "px",
  );
};

window.addEventListener("resize", () => {
  updateScrollbarWidth();
});

updateScrollbarWidth();

// ----- Menu ----- //

const menuTrigger = document.querySelector(".header__menu-trigger");

menuTrigger.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

// ----- Disable hover effect ----- //

const disableHoverInput = document.querySelector(
  ".footer__disable-hover-input",
);
const disabledHoverDefaultValue =
  localStorage.getItem("disable-hover-effect") === "true";
disableHoverInput.checked = disabledHoverDefaultValue;

if (!disabledHoverDefaultValue) {
  console.log("add class");
  document.body.classList.add("enable-hover-effect");
}

disableHoverInput.addEventListener("change", () => {
  document.body.classList.toggle("enable-hover-effect");

  if (disableHoverInput.checked) {
    localStorage.setItem("disable-hover-effect", "true");
  } else {
    localStorage.removeItem("disable-hover-effect");
  }
});

// ----- Scroll ----- //

let isScrolled = window.scrollY > 0;

window.addEventListener("scroll", () => {
  const newIsScrolled = window.scrollY > 0;

  if (newIsScrolled !== isScrolled) {
    isScrolled = newIsScrolled;
    if (isScrolled) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  }
});

// ----- Theme ----- //

const themeButtons = document.querySelectorAll(".footer__theme-button");

const random = (min, max, decimals = 3) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (theme === "funky") {
      const isDark = random(0, 1) > 0.5;
      let bgL;
      let bgC;
      let textL;
      let borderL;
      let fgDefault;
      let noiseImage;

      if (isDark) {
        bgL = random(0, 0.35);
        bgC = random(0, 0.5);
        textL = random(0.7, 1);
        borderL = random(0.5, 0.7);
        fgDefault = `rgb(0, 0, 0, 0.1)`;
        noiseImage = "url(/img/noise-light.png)";
      } else {
        bgL = random(0.65, 1);
        bgC = random(0, 0.2);
        textL = random(0, 0.3);
        borderL = random(0.3, 0.5);
        fgDefault = `rgb(255, 255, 255, 0.1)`;
        noiseImage = "url(/img/noise.png)";
      }

      const bgH = random(0, 360);
      // Avoid range of 150 around background hue
      const textH = random(bgH + 75, 210) % 360;
      const textC = random(0, 0.5);

      const accentC = random(0.5, 0.8);
      const accentH = (bgH + 180) % 360;

      const css = [
        'html[data-theme="funky"] {',
        `--body-bg: oklch(${bgL} ${bgC} ${bgH});`,
        `--text: oklch(${textL} ${textC} ${textH});`,
        `--border-color: oklch(${borderL} ${textC} ${textH});`,
        `--fg-default: ${fgDefault};`,
        `--noise-image: ${noiseImage};`,
        `--accent: oklch(${textL} ${accentC} ${accentH});`,
        `}`,
      ].join("\n");

      const styleElement = document.querySelector(".funky-style");
      if (!styleElement) {
        const styleElement = document.createElement("style");
        styleElement.textContent = css;
        styleElement.className = "funky-style";
        document.head.appendChild(styleElement);
      } else {
        styleElement.textContent = css;
      }

      localStorage.setItem("funky-styles", css);
    }
  });
});

// ----- Modal ----- //

const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal-close");
const modalBackdropClose = document.querySelector(".modal-backdrop-close");
const contactTriggers = [...document.querySelectorAll(".contact-trigger")];

contactTriggers.forEach((contactTrigger) => {
  contactTrigger.addEventListener("click", () => {
    modal.showModal();
  });
});

modalClose.addEventListener("click", () => {
  modal.close();
});

modalBackdropClose.addEventListener("click", () => {
  modal.close();
});

// ----- Play/pause buttons for videos ----- //

const playButtons = [...document.querySelectorAll(".play-button")];

playButtons.forEach((playButton) => {
  const video = playButton.parentElement.querySelector("video");

  // If video has autoplay attribute
  if (video.autoplay) {
    video.play().catch(() => {
      // And autoplay is disabled in the browser settings
      // Change the button label to "Play"
      playButton.textContent = "Play";
    });
  } else {
    playButton.textContent = "Pause";
  }

  playButton.addEventListener("click", () => {
    const isPaused = video.paused;

    if (isPaused) {
      video.play();
      playButton.textContent = "Pause";
    } else {
      video.pause();
      playButton.textContent = "Play";
    }
  });
});

// ----- Invaders ----- //

const submissionsPause = document.querySelector(".submissions__pause");
const submissionsVideos = [...document.querySelectorAll(".submissions video")];

if (submissionsPause) {
  submissionsVideos[0].play().catch(() => {
    submissionsPause.textContent = "Play videos";
  });

  submissionsPause.addEventListener("click", () => {
    const isPaused = submissionsVideos.some((video) => video.paused);

    submissionsVideos.forEach((video) => {
      if (isPaused) {
        video.play();
        submissionsPause.textContent = "Pause videos";
      } else {
        video.pause();
        submissionsPause.textContent = "Play videos";
      }
    });
  });
}
