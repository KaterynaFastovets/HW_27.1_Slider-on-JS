function Carousel(sliderLine) {
  this.container = document.createElement("div");
  this.container.className = "container";
  document.body.appendChild(this.container);

  this.sliders = [];
  this.indicators = [];
  this.slideInterval = null;
  this.intervalTime = sliderLine.intervalTime;
  this.showIndicators = sliderLine.showIndicators;
  this.numberOfSlider = sliderLine.numberOfSlider;
  this.counter = 0;
  this.step = 0;
}

Carousel.prototype.init = function () {
  this.createElements();
  this.loadImages();
  this.setupEventListeners();
};

Carousel.prototype.createElements = function () {
  this.wrapperSlider = document.createElement("div");
  this.wrapperSlider.className = "wrapper-slider";
  this.container.appendChild(this.wrapperSlider);
  this.sliderLine = document.createElement("div");
  this.sliderLine.className = "slider";
  this.wrapperSlider.appendChild(this.sliderLine);

  // indicators
  this.indicatorsContainer = document.createElement("div");
  this.indicatorsContainer.className = "img-indicators";
  this.container.appendChild(this.indicatorsContainer);

  // prev / next
  this.prevButton = document.createElement("button");
  this.prevButton.className = "prev";
  this.prevButton.textContent = "PREV";
  this.container.appendChild(this.prevButton);

  this.nextButton = document.createElement("button");
  this.nextButton.className = "next";
  this.nextButton.textContent = "NEXT";
  this.container.appendChild(this.nextButton);

  // play / pause
  this.playButton = document.createElement("button");
  this.playButton.className = "play";
  this.playButton.textContent = "PLAY";
  this.container.appendChild(this.playButton);

  this.pauseButton = document.createElement("button");
  this.pauseButton.className = "pause";
  this.pauseButton.textContent = "PAUSE";
  this.container.appendChild(this.pauseButton);
};

Carousel.prototype.loadImages = function () {
  let countSliders = 0;
  for (let i = 0; i < this.numberOfSlider; i++) {
    const img = document.createElement("img");
    img.src = `https://picsum.photos/800/600?random=${i}`;
    img.className = "slider-item";
    this.sliders.push(img);

    img.onload = () => {
      countSliders++;
      if (countSliders === this.numberOfSlider) {
        this.step = this.sliders[0].clientWidth;
        this.updateSlider();
        if (this.showIndicators) this.createIndicators();
        this.startSlide();
      }
    };

    this.sliderLine.appendChild(img);
  }
};

Carousel.prototype.createIndicators = function () {
  for (let i = 0; i < this.numberOfSlider; i++) {
    const indicator = document.createElement("span");
    indicator.className = "indicator";
    indicator.addEventListener("click", () => this.goToSlide(i));
    this.indicatorsContainer.appendChild(indicator);
    this.indicators.push(indicator);
  }
};

Carousel.prototype.updateSlider = function () {
  this.sliderLine.style.transform = `translateX(${
    -this.step * this.counter
  }px)`;
};

Carousel.prototype.updateIndicators = function () {
  this.indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === this.counter);
  });
};

Carousel.prototype.showNextSlide = function () {
  this.counter = (this.counter + 1) % this.numberOfSlider;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.showPrevSlide = function () {
  this.counter = (this.counter - 1 + this.numberOfSlider) % this.numberOfSlider;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.goToSlide = function (index) {
  this.counter = index;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.playtSlide = function () {
  if (!this.slideInterval) {
    this.slideInterval = setInterval(
      () => this.showNextSlide(),
      this.intervalTime
    );
  }
};

Carousel.prototype.pauseSlide = function () {
  if (this.slideInterval) {
    clearInterval(this.slideInterval);
    this.slideInterval = null;
  }
};

Carousel.prototype.setupEventListeners = function () {
  this.prevButton.addEventListener("click", () => this.showPrevSlide());
  this.nextButton.addEventListener("click", () => this.showNextSlide());

  this.playButton.addEventListener("click", () => this.playtSlide());
  this.pauseButton.addEventListener("click", () => this.pauseSlide());

  //Управління стрілками клавіатури вліво/вправо
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      this.showPrevSlide();
    } else if (event.key === "ArrowRight") {
      this.showNextSlide();
    }
  });

  //Тач-жести
  let firstPosition = 0;
  const positionTouch = (lastPosition) => {
    if (lastPosition < firstPosition) {
      this.showNextSlide();
    } else if (lastPosition > firstPosition) {
      this.showPrevSlide();
    }
  };

  this.sliderLine.addEventListener("touchstart", (event) => {
    startPosition = event.touches[0].clientX;
  });

  this.sliderLine.addEventListener("touchend", (event) => {
    positionTouch(event.changedTouches[0].clientX);
  });

  //Перетягування мишею
  this.sliderLine.addEventListener("mousedown", (event) => {
    startPosition = event.clientX;
  });

  this.sliderLine.addEventListener("mouseup", (event) => {
    positionTouch(event.clientX);
  });
};

const carousel = new Carousel({
  numberOfSlider: 6,
  intervalTime: 2000,
  showIndicators: true,
});
carousel.init();
