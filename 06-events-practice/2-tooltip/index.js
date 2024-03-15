class Tooltip {
  static instance;
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }
  initialize() {
    this.element = this.createElement(this.createElementTemplate());
    this.activeTooltipElement = null;
    this.createEventListeners();
  }
  render(content) {
    this.element.innerHTML = content;
    document.body.append(this.element);
  }

  createElementTemplate() {
    return '<div class="tooltip"></div>';
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  documentPointeroverHandler = (event) => {
    const dataTooltipValue = event.target.dataset.tooltip;

    if (!dataTooltipValue) {
      return;
    }

    this.render(dataTooltipValue);
    document.body.addEventListener('pointermove', this.documentPointermoveHandler);
  };

  documentPointeroutHandler = () => {
    this.remove();
    document.body.removeEventListener('pointermove', this.documentPointermoveHandler);

  };

  documentPointermoveHandler = (event) => {
    const offset = 10;
    this.element.style.left = `${event.clientX + offset}px`;
    this.element.style.top = `${event.clientY + offset}px`;
  };

  createEventListeners() {
    document.body.addEventListener('pointerover', this.documentPointeroverHandler);
    document.body.addEventListener('pointerout', this.documentPointeroutHandler);
  }

  destroyEventListener() {
    document.body.removeEventListener('pointerover', this.documentPointeroverHandler);
    document.body.addEventListener('pointerout', this.documentPointeroutHandler);

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListener();
  }
}

export default Tooltip;
