// Create a slider with the following features:
/*
 -- Підтримку тач-жестів для навігації слайдами на мобільних пристроях та аналогічні дії мишею на десктопних пристроях, що дозволяє
 користувачам легко перегортати слайди, використовуючи свайпи на тачскрінах або перетягування мишею.
 -- When I swiping slides (at the first-last clone) there is weird behavior e.g. they move over the border
 */

// To implement settings object!!!

export class Slider {
  #sliderWrapper;
  #wrapperWidth;
  #sliderContainer;
  #track;
  #slides;
  #currentSlideIndex = 1;
  #totalSlides;
  #nextButton;
  #prevButton;
  #isTransitioning = false;
  #intervalId;
  #autoPlayInterval;
  #dotsContainer;
  #isDragging = false;
  #startX = 0;
  #startTranslate = 0;
  #slideWidth;
  #shouldAutoPlay;
  #areNavArrows;
  #areNavDots;
  #settings;

  constructor(selector, userSettings = {}) {
    this.#sliderWrapper = document.querySelector(selector);
    if (!this.#sliderWrapper) return;

    this.#settings = {
      autoPlay: true,
      showArrows: true,
      showDots: true,
      interval: 3000,
      maxWidth: "400px",
      ...userSettings,
    };

    this.#autoPlayInterval = this.#settings.interval;
    this.#shouldAutoPlay = this.#settings.autoPlay;
    this.#areNavArrows = this.#settings.showArrows;
    this.#areNavDots = this.#settings.showDots;
    this.#wrapperWidth = this.#settings.maxWidth;

    this.#initStructure();
    this.#setupEvents();

    if (this.#shouldAutoPlay) this.startAutoPlay();
  }

  #initStructure() {
    this.#sliderWrapper.style.maxWidth = this.#settings.maxWidth;
    this.#sliderWrapper.style.position = "relative";
    this.#sliderWrapper.setAttribute("tabindex", "0");

    this.#sliderContainer = document.createElement("div");
    this.#sliderContainer.style.width = "100%";
    this.#sliderContainer.style.overflow = "hidden";

    const originalSlides = Array.from(this.#sliderWrapper.children);
    this.#totalSlides = originalSlides.length;
    this.#track = document.createElement("div");
    this.#track.style.display = "flex";

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[this.#totalSlides - 1].cloneNode(true);

    this.#track.append(lastClone, ...originalSlides, firstClone);
    this.#sliderContainer.append(this.#track);
    Array.from(this.#track.children).forEach((slide) => {
      slide.style.flex = "0 0 100%";
      slide.style.width = "100%";
    });

    this.#sliderWrapper.append(this.#sliderContainer);

    this.#slideWidth = this.#sliderContainer.offsetWidth;

    if (this.#areNavArrows) {
      this.#nextButton = this.#createNavigationButtons("next-slide", ">");
      this.#prevButton = this.#createNavigationButtons("prev-slide", "<");
    }

    if (this.#areNavDots) this.#createDots();

    this.#slides = this.#track.children;
    this.#updateSlidePosition(false);
  }

  #createNavigationButtons(className, text) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add("slider-btn", className);
    button.textContent = text;

    this.#sliderWrapper.append(button);
    return button;
  }

  #createDots() {
    this.#dotsContainer = document.createElement("ul");
    this.#dotsContainer.classList.add("slider-bullets");

    for (let i = 0; i < this.#totalSlides; i++) {
      const bullet = document.createElement("li");
      bullet.classList.add("slider-bullets__bullet");

      bullet.dataset.index = i + 1;

      if (i === 0) bullet.classList.add("active");

      this.#dotsContainer.append(bullet);
    }

    this.#sliderWrapper.append(this.#dotsContainer);
  }

  #updateSlidePosition(withAnimation = true) {
    const width = this.#sliderContainer.offsetWidth;

    this.#track.style.transition = withAnimation
      ? "transform 0.5s ease"
      : "none";
    this.#track.style.transform = `translateX(-${this.#currentSlideIndex * width}px)`;
  }

  #updateDots() {
    if (!this.#areNavDots || !this.#dotsContainer) return;

    let dotIndex = this.#currentSlideIndex;
    if (dotIndex === this.#slides.length - 1) dotIndex = 1;
    if (dotIndex === 0) dotIndex = this.#totalSlides;

    this.#dotsContainer.querySelector(".active")?.classList.remove("active");

    const currentDot = this.#dotsContainer.querySelector(
      `.slider-bullets__bullet[data-index="${dotIndex}"]`,
    );

    currentDot?.classList.add("active");
  }

  #moveSlide(direction) {
    if (this.#isTransitioning) return;
    this.#isTransitioning = true;
    this.#currentSlideIndex += direction;
    this.#updateSlidePosition();
    this.#updateDots();
    this.#resetTimer();
  }

  #nextSlide() {
    this.#moveSlide(1);
  }

  #prevSlide() {
    this.#moveSlide(-1);
  }

  #startDrag(event) {
    if (this.#isTransitioning) return;
    this.#isDragging = true;
    this.#stopAutoPlay();

    this.#startX = event.clientX;

    this.#startTranslate = -this.#currentSlideIndex * this.#slideWidth;
    this.#track.style.transition = "none";
  }

  #drag(event) {
    if (!this.#isDragging) return;
    const currentX = event.clientX;
    const diffX = currentX - this.#startX;

    const translate = this.#startTranslate + diffX;
    this.#track.style.transform = `translateX(${translate}px)`;
  }

  #endDrag(event) {
    if (!this.#isDragging) return;
    this.#isDragging = false;

    const currentX = event.clientX;
    const movedBy = currentX - this.#startX;

    if (movedBy < -100 && this.#currentSlideIndex < this.#slides.length - 1) {
      this.#nextSlide();
    } else if (movedBy > 100 && this.#currentSlideIndex > 0) {
      this.#prevSlide();
    } else {
      this.#updateSlidePosition();
    }
  }

  #setupEvents() {
    this.#track.addEventListener("transitionend", () => {
      this.#isTransitioning = false;

      if (this.#currentSlideIndex === this.#slides.length - 1) {
        this.#currentSlideIndex = 1;
        this.#updateSlidePosition(false);
      }

      if (this.#currentSlideIndex === 0) {
        this.#currentSlideIndex = this.#slides.length - 2;
        this.#updateSlidePosition(false);
      }

      this.#updateDots();
    });

    this.#nextButton?.addEventListener("click", () => this.#nextSlide());
    this.#prevButton?.addEventListener("click", () => this.#prevSlide());

    this.#sliderWrapper.addEventListener("mouseenter", () =>
      this.#stopAutoPlay(),
    );
    if (this.#shouldAutoPlay) {
      this.#sliderWrapper.addEventListener("mouseleave", () =>
        this.startAutoPlay(),
      );
    }

    if (this.#dotsContainer) {
      this.#dotsContainer.addEventListener("click", (event) => {
        if (this.#isTransitioning) return;
        const bullet = event.target.closest(".slider-bullets__bullet");
        if (!bullet) return;

        const targetIndex = parseInt(bullet.dataset.index);
        this.#currentSlideIndex = targetIndex;
        this.#updateSlidePosition();
        this.#updateDots();
      });
    }

    this.#track.addEventListener("pointerdown", (e) => this.#startDrag(e));
    window.addEventListener("pointermove", (e) => this.#drag(e));
    window.addEventListener("pointerup", (e) => this.#endDrag(e));
    window.addEventListener("pointerleave", (e) => this.#endDrag(e));
    this.#track.addEventListener("dragstart", (e) => e.preventDefault());

    this.#sliderWrapper.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.#prevSlide();
      if (e.key === "ArrowRight") this.#nextSlide();
    });

    window.addEventListener("resize", () => {
      this.#updateSlidePosition();
    });
  }

  startAutoPlay() {
    this.#stopAutoPlay();

    this.#intervalId = setInterval(
      () => this.#nextSlide(),
      this.#autoPlayInterval,
    );
  }

  #resetTimer() {
    clearInterval(this.#intervalId);

    if (this.#shouldAutoPlay) this.startAutoPlay();
  }

  #stopAutoPlay() {
    clearInterval(this.#intervalId);
  }
}
