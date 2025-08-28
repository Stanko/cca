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
  video.play().catch(() => {
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
