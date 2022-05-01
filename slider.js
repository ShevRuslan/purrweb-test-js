class Slider {
  constructor({ parentElement }) {
    this.parentElement = parentElement;
    this.currentElement = 1;
    this.widthElement = 0;
    this.sliderList = null;
    this.countElement = null;
    this.init();
    this.cloneSlider();
    this.addArrows();
    this.createDots();
  }
  init = () => {
    let width = 0;
    const childrens = this.parentElement.children;
    let elementWidth = 0;
    this.countElement = Array.from(childrens).length;
    Array.from(childrens).forEach((children) => {
      if (elementWidth == 0) elementWidth = children.clientWidth;
      width += children.clientWidth;
    });
    this.widthElement = elementWidth;
    width += 2 * this.widthElement;
    let slider = `<div class="custom-slider-list" style="width:${elementWidth}px"><div class="custom-slider-track" style="width:${width}px">`;
    Array.from(childrens).forEach((children) => {
      slider += children.outerHTML;
    });
    slider += "</div></div>";

    this.parentElement.innerHTML = slider;
    this.sliderList = this.parentElement.querySelector(".custom-slider-track");
    this.sliderList.style.transform = `translate3d(-${this.widthElement}px,0,0)`;
  };
  cloneSlider = () => {
    const childrens = this.parentElement.querySelectorAll(".slider-element");
    const cloneFirst = childrens[0].cloneNode(true);
    const cloneLast = childrens[childrens.length - 1].cloneNode(true);
    this.parentElement.querySelector(".custom-slider-track").appendChild(cloneFirst);
    this.parentElement
      .querySelector(".custom-slider-track")
      .insertBefore(cloneLast, this.parentElement.querySelectorAll(".slider-element")[0]);
  };
  addArrows = () => {
    let leftArrow = document.createElement("button");
    leftArrow.classList.add("custom-slider-arrow", "custom-slider-arrow-left");
    leftArrow.innerHTML = `<img src="left-arrow.png"/>`;
    leftArrow.addEventListener("click", this.prevElement);
    let rightArrow = document.createElement("button");
    rightArrow.classList.add("custom-slider-arrow", "custom-slider-arrow-right");
    rightArrow.innerHTML = `<img src="right-arrow.png"/>`;
    rightArrow.addEventListener("click", this.nextElement);
    this.parentElement.appendChild(leftArrow);
    this.parentElement.appendChild(rightArrow);
  };
  prevElement = () => {
    if (this.currentElement == 1) {
      let start = this.currentElement * this.widthElement;
      const int = setInterval(() => {
        start -= 4;
        if (start == 0) {
          this.sliderList.style.transform = `translate3d(-${this.elementWidth * this.countElement}px,0,0)`;
          this.currentElement = this.countElement;
          clearInterval(int);
        }
        this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
    } else {
      let start = this.currentElement * this.widthElement;
      const int = setInterval(() => {
        start -= 4;
        if (start == (this.currentElement - 1) * this.widthElement) {
          this.currentElement--;
          clearInterval(int);
        }
        this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
    }
  };
  nextElement = () => {
    if (this.currentElement == 6) {
      this.currentElement++;
      let start = (this.currentElement - 1) * this.widthElement;
      const int = setInterval(() => {
        start += 4;
        if (start == this.currentElement * this.widthElement) {
          this.sliderList.style.transform = `translate3d(-${this.elementWidth}px,0,0)`;
          this.currentElement = 1;
          clearInterval(int);
        }
        this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
    } else {
      this.currentElement++;
      let start = (this.currentElement - 1) * this.widthElement;
      const int = setInterval(() => {
        start += 4;
        if (start == this.currentElement * this.widthElement) {
          clearInterval(int);
        }
        this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
      console.log(this.currentElement);
    }
  };
  deleteActiveDot = () => {
    let dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => {
      if (dot.classList.contains("dot-active")) dot.classList.remove("dot-active");
    });
  };
  createDots = () => {
    let dots = document.createElement("dots");
    dots.classList.add("dots");
    for (let i = 0; i < this.countElement; i++) {
      let dot = document.createElement("button");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        this.deleteActiveDot();
        dot.classList.add("dot-active");
        this.changeSlide(i + 1);
      });
      dots.appendChild(dot);
    }
    this.parentElement.appendChild(dots);
  };
  changeSlide = (number) => {
    if (number > this.currentElement) {
      let start = this.currentElement * this.widthElement;
      const int = setInterval(() => {
        start += 4;
        if (start == number * this.widthElement) {
          clearInterval(int);
        }
        this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
      this.currentElement = number;
    } else {
      let start = this.currentElement * this.widthElement;
      const int = setInterval(() => {
        start -= 4;
        if (start == number * this.widthElement) {
          clearInterval(int);
        }
        this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
      this.currentElement = number;
    }
  };
}

const parent = document.querySelector(".slider");
new Slider({ parentElement: parent });
