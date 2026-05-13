export function Slider(selector, userSettings = {}) {
  const sliderWrapper = document.querySelector(selector);
  if (!sliderWrapper) return;

  const settings = {
    autoPlay: true,
    showArrows: true,
    showDots: true,
    interval: 3000,
    maxWidth: '400px',
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
    sliderWrapper.style.position = 'relative';
    sliderWrapper.style.setAttribute('tabindex', '0');

    sliderContainer = document.createElement('div');
    sliderContainer.style.width = '100%';
    sliderContainer.style.overflow = 'hidden';

    const originalSlides = Array.from(sliderWrapper.children);
    totalSlides = originalSlides.length;
    track = document.createElement('div');
    track.style.display = 'flex';

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

    track.append(lastClone, ...originalSlides, firstClone);
    sliderContainer.append(track);
    Array.from(track.children).forEach((slide) => {
      slide.style.flex = '0 0 100%';
      slide.style.width = '100%';
    });

    sliderWrapper.append(sliderContainer);

    slideWidth = sliderContainer.offsetWidth;

    if (areNavArrows) {
      nextButton = createNavigationButtons('next-slide', '>');
      prevButton = createNavigationButtons('prev-slide', '<');
    }

    if (areNavDots) createDots();

    slides = track.children;
    updateSlidePosition(false);
  }
}
