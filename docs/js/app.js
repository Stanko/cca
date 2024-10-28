// ----- Scrollbar ----- //

const updateScrollbarWidth = () => {
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty(
    '--scrollbar-width',
    `${scrollbarWidth}px`
  );
};

window.addEventListener('resize', () => {
  updateScrollbarWidth();
});

updateScrollbarWidth();

// ----- Modal ----- //

const $modal = document.querySelector('.modal');
const $modalClose = document.querySelector('.modal-close');
const $modalBackdropClose = document.querySelector('.modal-backdrop-close');
const $contactTrigger = document.querySelector('.elastic-button--contact');
const $reachOutTrigger = document.querySelector('.reach-out');

$contactTrigger.addEventListener('click', () => {
  $modal.showModal();
});

$reachOutTrigger.addEventListener('click', () => {
  $modal.showModal();
});

$modalClose.addEventListener('click', () => {
  $modal.close();
});

$modalBackdropClose.addEventListener('click', () => {
  $modal.close();
});
