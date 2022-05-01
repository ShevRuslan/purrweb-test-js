class Slider {
  constructor({ parentElement }) {
    this.parentElement = parentElement;
    this.currentElement = {
      value: 1,
    };
    this.currentElementProxy = new Proxy(this.currentElement, {
      set: (target, key, value) => {
        console.log(value);
        this.changeDots(value);
        target[key] = value;
        return true;
      },
    });
    this.widthElement = 0;
    this.sliderList = null;
    this.countElement = null;
    this.loading = false;
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
    if (!this.loading) {
      requestAnimationFrame(() => {
        if (this.currentElementProxy.value == 1) {
          let start = this.currentElementProxy.value * this.widthElement;
          const int = setInterval(() => {
            this.loading = true;
            start -= 4;
            if (start == 0) {
              this.sliderList.style.transform = `translate3d(-${this.elementWidth * this.countElement}px,0,0)`;
              this.currentElementProxy.value = this.countElement;
              this.loading = false;
              clearInterval(int);
            }
            this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
          }, 1);
        } else {
          let start = this.currentElementProxy.value * this.widthElement;
          const int = setInterval(() => {
            this.loading = true;
            start -= 4;
            if (start == (this.currentElementProxy.value - 1) * this.widthElement) {
              this.currentElementProxy.value--;
              this.loading = false;
              clearInterval(int);
            }
            this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
          }, 1);
        }
      });
    }
  };
  nextElement = () => {
    if (!this.loading) {
      requestAnimationFrame(() => {
        if (this.currentElementProxy.value == this.countElement) {
          let start = this.currentElementProxy.value * this.widthElement;
          const int = setInterval(() => {
            this.loading = true;
            start += 4;
            if (start == (this.currentElementProxy.value + 1) * this.widthElement) {
              this.sliderList.style.transform = `translate3d(-${this.elementWidth}px,0,0)`;
              this.currentElementProxy.value = 1;
              this.loading = false;
              clearInterval(int);
            }
            this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
          }, 1);
        } else {
          this.currentElementProxy.value++;
          let start = (this.currentElementProxy.value - 1) * this.widthElement;
          const int = setInterval(() => {
            this.loading = true;
            start += 4;
            if (start == this.currentElementProxy.value * this.widthElement) {
              this.loading = false;
              clearInterval(int);
            }
            this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
          }, 1);
        }
      });
    }
  };
  deleteActiveDot = () => {
    let dots = document.querySelectorAll(".dot");
    dots.forEach((dot) => {
      if (dot.classList.contains("dot-active")) dot.classList.remove("dot-active");
    });
  };
  changeDots = (currentElement) => {
    this.deleteActiveDot();
    let dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      if (index + 1 == currentElement) {
        dot.classList.add("dot-active");
      }
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
    if (number != this.currentElementProxy.value) {
      requestAnimationFrame(() => {
        if (number > this.currentElementProxy.value) {
          let start = this.currentElementProxy.value * this.widthElement;
          const int = setInterval(() => {
            start += 10;
            if (start == number * this.widthElement) {
              clearInterval(int);
            }
            this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
          }, 1);
          this.currentElementProxy.value = number;
        } else {
          let start = this.currentElementProxy.value * this.widthElement;
          const int = setInterval(() => {
            start -= 10;
            if (start == number * this.widthElement) {
              clearInterval(int);
            }
            this.sliderList.style.transform = `translate3d(-${start}px,0,0)`;
          }, 1);
          this.currentElementProxy.value = number;
        }
      });
    }
  };
}

const parent = document.querySelector(".slider");
new Slider({ parentElement: parent });
