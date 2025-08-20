// ----- Scrollbar ----- //

const updateScrollbarWidth = () => {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty(
    "--scrollbar-width",
    `${scrollbarWidth}px`,
  );
};

window.addEventListener("resize", () => {
  updateScrollbarWidth();
});

updateScrollbarWidth();

// ----- Modal ----- //

const $modal = document.querySelector(".modal");
const $modalClose = document.querySelector(".modal-close");
const $modalBackdropClose = document.querySelector(".modal-backdrop-close");
const $contactTrigger = document.querySelector(".elastic-button--contact");
const $reachOutTrigger = document.querySelector(".reach-out");

$contactTrigger.addEventListener("click", () => {
  $modal.showModal();
});

if ($reachOutTrigger) {
  $reachOutTrigger.addEventListener("click", () => {
    $modal.showModal();
  });
}

$modalClose.addEventListener("click", () => {
  $modal.close();
});

$modalBackdropClose.addEventListener("click", () => {
  $modal.close();
});

// ----- Invaders ----- //

const $submissionsPause = document.querySelector(".submissions__pause");
const $submissionsVideos = [...document.querySelectorAll(".submissions video")];

if ($submissionsPause) {
  // Check for auto play
  const isPaused = $submissionsVideos.some(($video) => $video.paused);

  if (isPaused) {
    $submissionsPause.textContent = "Play videos";
  } else {
    $submissionsPause.textContent = "Pause videos";
  }

  $submissionsPause.addEventListener("click", () => {
    const isPaused = $submissionsVideos.some(($video) => $video.paused);

    $submissionsVideos.forEach(($video) => {
      if (isPaused) {
        $video.play();
        $submissionsPause.textContent = "Pause videos";
      } else {
        $video.pause();
        $submissionsPause.textContent = "Play videos";
      }
    });
  });
}
