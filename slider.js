class Slider {
  constructor({ parentElement, speed = 5 }) {
    this.elements = {
      parentElement,
      dots: [],
      arrows: {
        prevArrow: null,
        nextArrow: null,
      },
      childrens: [],
      sliderList: null,
      sliderTrack: null,
    };
    this.currentElement = {
      value: 1,
    };
    this.currentElementProxy = new Proxy(this.currentElement, {
      set: (target, key, value) => {
        this.changeDots(value);
        target[key] = value;
        return true;
      },
    });
    this.widthElement = 0;
    this.countElement = null;
    this.loading = false;
    this.speed = speed;
    this.init();
  }
  init = () => {
    this.createSlider();
    this.cloneSlider();
    this.createArrows();
    this.createDots();
  };
  createSlider = () => {
    let width = 0;

    this.elements.childrens = Array.from(this.elements.parentElement.children);
    this.countElement = this.elements.childrens.length;

    this.elements.childrens.forEach((children) => {
      if (this.widthElement == 0) this.widthElement = children.clientWidth;
      width += children.clientWidth;
    });

    width += 2 * this.widthElement;

    const list = document.createElement("div");
    list.classList.add("custom-slider-list");
    list.style.width = `${this.widthElement}px`;

    const track = document.createElement("div");
    track.classList.add("custom-slider-track");
    track.style.width = `${width}px`;
    track.style.transform = `translate3d(-${this.widthElement}px,0,0)`;

    this.elements.childrens.forEach((children) => {
      track.appendChild(children);
    });
    list.appendChild(track);
    this.elements.parentElement.appendChild(list);
    this.elements.sliderList = list;
    this.elements.sliderTrack = track;
  };
  cloneSlider = () => {
    const { childrens, sliderTrack } = this.elements;
    const cloneFirst = childrens[0].cloneNode(true);
    const cloneLast = childrens[childrens.length - 1].cloneNode(true);
    sliderTrack.appendChild(cloneFirst);
    sliderTrack.insertBefore(cloneLast, this.elements.parentElement.querySelectorAll(".slider-element")[0]);
  };
  createArrows = () => {
    this.elements.arrows.nextArrow = this.createArrow({
      customClass: "custom-slider-arrow-right",
      image: "right-arrow.png",
      handle: this.nextElement,
    });
    this.elements.arrows.prevArrow = this.createArrow({
      customClass: "custom-slider-arrow-left",
      image: "left-arrow.png",
      handle: this.prevElement,
    });
  };
  createArrow = ({ customClass, image, handle }) => {
    const { parentElement } = this.elements;

    let arrow = document.createElement("button");
    arrow.classList.add("custom-slider-arrow", customClass);

    const img = document.createElement("img");
    img.src = `${image}`;

    arrow.appendChild(img);
    arrow.addEventListener("click", handle);

    parentElement.appendChild(arrow);

    return arrow;
  };
  prevElement = () => {
    if (!this.loading) {
      const { sliderTrack } = this.elements;
      if (this.currentElementProxy.value == 1) {
        let start = this.currentElementProxy.value * this.widthElement;
        const int = setInterval(() => {
          this.loading = true;
          start -= this.speed;
          if (start == 0) {
            sliderTrack.style.transform = `translate3d(-${this.elementWidth * this.countElement}px,0,0)`;
            this.currentElementProxy.value = this.countElement;
            this.loading = false;
            clearInterval(int);
          }
          sliderTrack.style.transform = `translate3d(-${start}px,0,0)`;
        }, 1);
      } else {
        let start = this.currentElementProxy.value * this.widthElement;
        const int = setInterval(() => {
          this.loading = true;
          start -= this.speed;
          if (start == (this.currentElementProxy.value - 1) * this.widthElement) {
            this.currentElementProxy.value--;
            this.loading = false;
            clearInterval(int);
          }
          sliderTrack.style.transform = `translate3d(-${start}px,0,0)`;
        }, 1);
      }
    }
  };
  nextElement = () => {
    if (!this.loading) {
      const { sliderTrack } = this.elements;
      if (this.currentElementProxy.value == this.countElement) {
        let start = this.currentElementProxy.value * this.widthElement;
        const int = setInterval(() => {
          this.loading = true;
          start += this.speed;
          if (start == (this.currentElementProxy.value + 1) * this.widthElement) {
            sliderTrack.style.transform = `translate3d(-${this.elementWidth}px,0,0)`;
            this.currentElementProxy.value = 1;
            this.loading = false;
            clearInterval(int);
          }
          sliderTrack.style.transform = `translate3d(-${start}px,0,0)`;
        }, 1);
      } else {
        this.currentElementProxy.value++;
        let start = (this.currentElementProxy.value - 1) * this.widthElement;
        const int = setInterval(() => {
          this.loading = true;
          start += this.speed;
          if (start == this.currentElementProxy.value * this.widthElement) {
            this.loading = false;
            clearInterval(int);
          }
          sliderTrack.style.transform = `translate3d(-${start}px,0,0)`;
        }, 1);
      }
    }
  };
  deleteActiveDot = () => {
    const { dots } = this.elements;
    dots.forEach((dot) => {
      if (dot.classList.contains("dot-active")) dot.classList.remove("dot-active");
    });
  };
  changeDots = (currentElement) => {
    this.deleteActiveDot();
    const { dots } = this.elements;
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
      if (i == 0) dot.classList.add("dot-active");
      dot.classList.add("dot");
      dot.addEventListener("click", () => {
        if (!this.loading) {
          this.deleteActiveDot();
          dot.classList.add("dot-active");
          this.changeSlide(i + 1);
        }
      });
      dots.appendChild(dot);
      this.elements.dots.push(dot);
    }
    this.elements.parentElement.appendChild(dots);
  };
  changeSlide = (number) => {
    if (number == this.currentElementProxy.value) return;
    const { sliderTrack } = this.elements;
    if (number > this.currentElementProxy.value) {
      let start = this.currentElementProxy.value * this.widthElement;
      const int = setInterval(() => {
        this.loading = true;
        start += this.speed * 2;
        if (start == number * this.widthElement) {
          this.loading = false;
          clearInterval(int);
        }
        sliderTrack.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
      this.currentElementProxy.value = number;
    } else {
      let start = this.currentElementProxy.value * this.widthElement;
      const int = setInterval(() => {
        this.loading = true;
        start -= this.speed * 2;
        if (start == number * this.widthElement) {
          this.loading = false;
          clearInterval(int);
        }
        sliderTrack.style.transform = `translate3d(-${start}px,0,0)`;
      }, 1);
      this.currentElementProxy.value = number;
    }
  };
}

const parent = document.querySelector(".slider");
new Slider({ parentElement: parent, speed: 2 });
