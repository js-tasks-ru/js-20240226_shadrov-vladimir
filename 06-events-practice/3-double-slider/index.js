
export default class DoubleSlider {
  constructor({
    min = 0,
    max = 1000,
    formatValue = (value) => '$' + value,
    selected = {},
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {
      from: selected.from || min,
      to: selected.to || max
    };
    this.element = this.createElement(this.createElementTemplate());
    this.leftSlider = this.element.querySelector('.range-slider__thumb-left');
    this.rightSlider = this.element.querySelector('.range-slider__thumb-right');
    this.leftBoundary = this.element.querySelector('span[data-element="from"]');
    this.rightBoundary = this.element.querySelector('span[data-element="to"]');
    this.rangeProgressElement = this.element.querySelector('.range-slider__progress');
    this.innerElement = this.element.querySelector('.range-slider__inner');
    this.direction = null;
    this.activeSlider = null;
    this.offsetX = null;

    this.createEventListeners();
  }
  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element;
  }

  createElementTemplate() {
    const range = this.max - this.min;
    const leftOffset = (this.selected.from - this.min) / range * 100;
    const rightOffset = (this.max - this.selected.to) / range * 100;

    return (`
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${leftOffset}%; right: ${rightOffset}%;"></span>
          <span class="range-slider__thumb-left" data-direction="left" data-draggable="true" style="left: ${leftOffset}%"></span>
          <span class="range-slider__thumb-right" data-direction="right" data-draggable="true" style="right: ${rightOffset}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `);
  }

  createEventListeners() {
    this.rightSlider.addEventListener('pointerdown', this.thumbPointerDownHandler);
    this.leftSlider.addEventListener('pointerdown', this.thumbPointerDownHandler);
    document.addEventListener('pointerup', this.thumbPointerUpHandler);
  }

  thumbPointerDownHandler = (event) => {
    const targetSlider = event.target.closest('[data-draggable="true"]');

    if (!targetSlider) {
      return;
    }

    const sliderRect = targetSlider.getBoundingClientRect();
    this.direction = targetSlider.dataset.direction;
    this.activeSlider = this.direction === 'left' ? this.leftSlider : this.rightSlider;
    this.offsetX = this.direction === 'left' ? sliderRect.right - event.clientX : sliderRect.left - event.clientX;
    document.addEventListener('pointermove', this.thumbPointerMoveHandler);
  };

  thumbPointerMoveHandler = (event) => {
    const innerElementRect = this.innerElement.getBoundingClientRect();

    if (!innerElementRect.width) {
      return;
    }

    const leftSliderPosition = (event.clientX - innerElementRect[this.direction] + this.offsetX) / innerElementRect.width * 100;
    const minLeft = this.rightSlider.offsetLeft / innerElementRect.width * 100;
    const rightSliderPositon = (innerElementRect[this.direction] - event.clientX - this.offsetX) / innerElementRect.width * 100;
    const maxRight = (innerElementRect.width - this.leftSlider.offsetLeft - this.leftSlider.clientWidth) / innerElementRect.width * 100;

    let percent = this.direction === 'left'
      ? Math.min(leftSliderPosition, minLeft)
      : Math.min(rightSliderPositon, maxRight);

    if (percent <= 0) {
      percent = 0;
    } else if (percent > 100) {
      percent = 100;
    }

    this.setSelectedRange(percent);
    this.updateView(percent);
    this.setBoundaryValues();
  };

  setBoundaryValues() {
    this.leftBoundary.textContent = this.formatValue(this.selected.from);
    this.rightBoundary.textContent = this.formatValue(this.selected.to);
  }

  updateView(percent) {
    this.activeSlider.style[this.direction] = `${percent}%`;
    this.rangeProgressElement.style[this.direction] = `${percent}%`;
  }

  setSelectedRange(percent) {
    const range = this.max - this.min;

    if (this.direction === 'left') {
      this.selected.from = Math.round(this.min + (range * percent / 100));
    } else {
      this.selected.to = Math.round(this.max - (range * percent / 100));
    }
  }

  thumbPointerUpHandler = () => {
    document.removeEventListener('pointermove', this.thumbPointerMoveHandler);

    const customEvent = new CustomEvent('range-select', { detail: this.selected, bubbles: true });
    this.element.dispatchEvent(customEvent);
  };

  destroyEventListeners() {
    this.rightSlider.removeEventListener('pointerdown', this.thumbPointerDownHandler);
    this.leftSlider.removeEventListener('pointerdown', this.thumbPointerDownHandler);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.destroyEventListeners();
    this.remove();
  }
};
