const sliderLine = document.querySelector("#slider");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const indicators = document.querySelectorAll(".indicator");
const pauseButton = document.querySelector(".pause");
const playButton = document.querySelector(".play");

let position = 0;
let indicatorIndex = 0;

//Перегортання слайдів  через кнопки управління.Індикатор поточного слайду
const nextSlide = () => {
  if (position < (indicators.length - 1) * 600) {
    position += 600;
    indicatorIndex++;
  } else {
    position = 0;
    indicatorIndex = 0;
  }
  sliderLine.style.left = -position + "px";
  thisSlide(indicatorIndex);
};

const prevSlide = () => {
  if (position > 0) {
    position -= 600;
    indicatorIndex--;
  } else {
    position = (indicators.length - 1) * 600;
    indicatorIndex = indicators.length - 1;
  }
  sliderLine.style.left = -position + "px";
  thisSlide(indicatorIndex);
};

const thisSlide = (index) => {
  for (let indicator of indicators) {
    indicator.classList.remove("active");
  }
  indicators[index].classList.add("active");
};

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    position = 600 * index;
    sliderLine.style.left = -position + "px";
    indicatorIndex = index;
    thisSlide(indicatorIndex);
  });
});

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);


//Автоматичне перегортання слайдів з заданим інтервалом часу.Кнопки PLAY/PAUSE
let slideInterval = null;
const timeInterval = 2000;

function startSlide() {
  if (!slideInterval) {
    slideInterval = setInterval(nextSlide, timeInterval);
  }
}
playButton.addEventListener("click", startSlide);
startSlide();

function stopSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}
pauseButton.addEventListener("click", stopSlide);


//Управління стрілками клавіатури вліво/вправо 
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    prevSlide();
  } else if (event.key === "ArrowRight") {
    nextSlide();
  }
});

//Тач-жести
let firstPosition = 0;
const positionTouch = (lastPosition) => {
  if (lastPosition < firstPosition) {
    nextSlide();
  } else if (lastPosition > firstPosition) {
    prevSlide();
  }
};

sliderLine.addEventListener("touchstart", (event) => {
  firstPosition = event.touches[0].clientX;
  console.log(event);
});

sliderLine.addEventListener("touchend", (event) => {
  positionTouch(event.changedTouches[0].clientX);
});

//Перетягування мишею
sliderLine.addEventListener("mousedown", (event) => {
  firstPosition = event.clientX;
});

sliderLine.addEventListener("mouseup", (event) => {
  positionTouch(event.clientX);
});

