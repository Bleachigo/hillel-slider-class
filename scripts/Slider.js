export function Slider(selector, userSettings = {}) {
  const sliderWrapper = document.querySelector(selector);
  if (!sliderWrapper) return;

  const settings = {
    autoPlay: true,
    showArrows: true,
    showDots: true,
    interval: 3000,
    maxWidth: '700px',
    ...userSettings,
  };

  let sliderContainer;
  let track;
  let slides;
  let currentSlideIndex = 1;
  let totalSlides;
  let nextButton;
  let prevButton;
  let isTransitioning = false;
  let intervalId = null;
  let dotsContainer;
  let isDragging = false;
  let startX = 0;
  let startTranslate = 0;

  const autoPlayInterval = settings.interval;
  const shouldAutoPlay = settings.autoPlay;
  const areNavArrows = settings.showArrows;
  const areNavDots = settings.showDots;

  function initStructure() {
    sliderWrapper.style.maxWidth = settings.maxWidth;
    sliderWrapper.style.position = 'relative';
    sliderWrapper.setAttribute('tabindex', '0');

    sliderContainer = document.createElement('div');
    sliderContainer.style.width = '100%';
    sliderContainer.style.overflow = 'hidden';

    const originalSlides = Array.from(sliderWrapper.children);
    totalSlides = originalSlides.length;
    track = document.createElement('div');
    track.style.display = 'flex';
    track.style.touchAction = 'pan-y';

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[totalSlides - 1].cloneNode(true);

    track.append(lastClone, ...originalSlides, firstClone);
    sliderContainer.append(track);

    Array.from(track.children).forEach((slide) => {
      slide.style.flex = '0 0 100%';
      slide.style.width = '100%';
    });

    sliderWrapper.append(sliderContainer);

    if (areNavArrows) {
      nextButton = createNavigationButtons('next-slide', '>');
      prevButton = createNavigationButtons('prev-slide', '<');
    }

    if (areNavDots) createDots();

    slides = track.children;
    updateSlidePosition(false);
  }

  function createNavigationButtons(className, text) {
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('slider-btn', className);
    button.textContent = text;
    sliderWrapper.append(button);
    return button;
  }

  function createDots() {
    dotsContainer = document.createElement('ul');
    dotsContainer.classList.add('slider-bullets');

    for (let i = 0; i < totalSlides; i++) {
      const bullet = document.createElement('li');
      bullet.classList.add('slider-bullets__bullet');
      bullet.dataset.index = i + 1;

      if (i === 0) bullet.classList.add('active');
      dotsContainer.append(bullet);
    }
    sliderWrapper.append(dotsContainer);
  }

  function updateSlidePosition(withAnimation = true) {
    const width = sliderContainer.offsetWidth;

    track.style.transition = withAnimation ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${currentSlideIndex * width}px)`;
  }

  function updateDots() {
    if (!areNavDots || !dotsContainer) return;

    let dotIndex = currentSlideIndex;
    if (dotIndex === slides.length - 1) dotIndex = 1;
    if (dotIndex === 0) dotIndex = totalSlides;

    dotsContainer.querySelector('.active')?.classList.remove('active');

    const currentDot = dotsContainer.querySelector(
      `.slider-bullets__bullet[data-index="${dotIndex}"]`,
    );

    currentDot?.classList.add('active');
  }

  function moveSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentSlideIndex += direction;
    updateSlidePosition();
    updateDots();
    resetTimer();
  }

  function nextSlide() {
    moveSlide(1);
  }

  function prevSlide() {
    moveSlide(-1);
  }

  function startDrag(event) {
    if (isTransitioning) return;
    isDragging = true;
    stopAutoPlay();

    startX = event.clientX;
    const width = sliderContainer.offsetWidth;

    startTranslate = -currentSlideIndex * width;
    track.style.transition = 'none';
  }

  function drag(event) {
    if (!isDragging) return;
    const currentX = event.clientX;
    const diffX = currentX - startX;

    const translate = startTranslate + diffX;
    track.style.transform = `translateX(${translate}px)`;
  }

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;

    const currentX = event.clientX;
    const movedBy = currentX - startX;

    if (movedBy < -100 && currentSlideIndex < slides.length - 1) {
      nextSlide();
    } else if (movedBy > 100 && currentSlideIndex > 0) {
      prevSlide();
    } else {
      updateSlidePosition();
    }
  }

  function setupEvents() {
    track.addEventListener('transitionend', () => {
      isTransitioning = false;

      if (currentSlideIndex === slides.length - 1) {
        currentSlideIndex = 1;
        updateSlidePosition(false);
      }

      if (currentSlideIndex === 0) {
        currentSlideIndex = slides.length - 2;
        updateSlidePosition(false);
      }

      updateDots();
    });

    nextButton?.addEventListener('click', () => nextSlide());
    prevButton?.addEventListener('click', () => prevSlide());

    sliderWrapper.addEventListener('mouseenter', () => stopAutoPlay());
    if (shouldAutoPlay) {
      sliderWrapper.addEventListener('mouseleave', () => startAutoPlay());
    }

    if (dotsContainer) {
      dotsContainer.addEventListener('click', (event) => {
        if (isTransitioning) return;
        const bullet = event.target.closest('.slider-bullets__bullet');
        if (!bullet) return;

        const targetIndex = parseInt(bullet.dataset.index);
        currentSlideIndex = targetIndex;
        updateSlidePosition();
        updateDots();
      });
    }

    track.addEventListener('pointerdown', (e) => startDrag(e));
    window.addEventListener('pointermove', (e) => drag(e));
    window.addEventListener('pointerup', (e) => endDrag(e));
    window.addEventListener('pointerleave', (e) => endDrag(e));
    track.addEventListener('dragstart', (e) => e.preventDefault());

    sliderWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    window.addEventListener('resize', () => {
      updateSlidePosition();
    });
  }

  function startAutoPlay() {
    stopAutoPlay();

    intervalId = setInterval(() => nextSlide(), autoPlayInterval);
  }

  function resetTimer() {
    clearInterval(intervalId);

    if (shouldAutoPlay) startAutoPlay();
  }

  function stopAutoPlay() {
    clearInterval(intervalId);
  }

  initStructure();
  setupEvents();
  if (shouldAutoPlay) startAutoPlay();
}
