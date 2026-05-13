export function Slider(selector, userSettings = {}) {
  const sliderWrapper = document.querySelector(selector);
  if (!sliderWrapper) return;

  const settings = {
    autoPlay: true,
    showArrows: true,
    showDots: true,
    interval: 3000,
    maxWidth: "400px",
    ...userSettings,
  };

  let wrapperWidth; // is it needed?
  let sliderContainer;
  let track;
  let slides;
  let currentSlideIndex = 1;
  let totalSlides;
  let nextButton;
  let prevButton;
  let isTransitioning = false;
  let intervalId; // should be null assigned?
  let dotsContainer;
  let isDragging = false;
  let startX = 0;
  let startTranslate = 0;
  let slideWidth;

  const autoPlayInterval = settings.interval;
  const shouldAutoPlay = settings.autoPlay;
  const areNavArrows = settings.showArrows;
  const areNavDots = settings.showDots;

  function initStructure() {
    sliderWrapper.style.maxWidth = settings.maxWidth;
    sliderWrapper.style.position = "relative";
    sliderWrapper.style.setAttribute("tabindex", "0");
  }
}
