class Slider {
  constructor({ parentElement }) {
    this.parentElement = parentElement;
    this.init();
    this.addArrows();
  }
  init = () => {
    let width = 0;
    const childrens = this.parentElement.children;
    let elementWidth = 0;
    Array.from(childrens).forEach((children) => {
      if (elementWidth == 0) elementWidth = children.clientWidth;
      width += children.clientWidth;
    });
    let slider = `<div class="custom-slider-list" style="width:${elementWidth}px"><div class="custom-slider-track" style="width:${width}px">`;
    Array.from(childrens).forEach((children) => {
      slider += children.outerHTML;
    });
    slider += "</div></div>";
    this.parentElement.innerHTML = slider;
  };
  addArrows = () => {
    let leftArrow = document.createElement("button");
    leftArrow.classList.add("custom-slider-arrow", "custom-slider-arrow-left");
    leftArrow.innerHTML = `<img src="left-arrow.png"/>`;

    let rightArrow = document.createElement("button");
    rightArrow.classList.add("custom-slider-arrow", "custom-slider-arrow-right");
    rightArrow.innerHTML = `<img src="right-arrow.png"/>`;

    this.parentElement.appendChild(leftArrow);
    this.parentElement.appendChild(rightArrow);
  };
}

const parent = document.querySelector(".slider");
new Slider({ parentElement: parent });
