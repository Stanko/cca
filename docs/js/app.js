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
const $contactTrigger = document.querySelector('.elastic-button--contact');

$contactTrigger.addEventListener('click', () => {
  $modal.showModal();
});

$modalClose.addEventListener('click', () => {
  $modal.close();
});
