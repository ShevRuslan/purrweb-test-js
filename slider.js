class Slider {
  constructor({ parentElement }) {
    this.parentElement = parentElement;
    this.init();
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
}

const parent = document.querySelector(".slider");
new Slider({ parentElement: parent });
