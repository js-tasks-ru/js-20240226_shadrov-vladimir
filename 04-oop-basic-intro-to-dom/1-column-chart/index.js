export default class ColumnChart {
  element;
  chartHeight;
  constructor({
    data = [],
    label = "",
    value = 0,
    link = "",
    formatHeading = (value) => value,
  } = {}) {
    this.chartHeight = 50;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = this.createElement(this.createTemplate());
    this.subElements = {
      body: this.element.querySelector('[data-element="body"]'),
    };
  }

  createLinkTemplate() {
    return this.link
      ? `<a href="${this.link}" class="column-chart__link">View all</a>`
      : "";
  }

  getColumnProps() {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return this.data.map((item) => {
      return {
        percent: ((item / maxValue) * 100).toFixed(0) + "%",
        value: String(Math.floor(item * scale)),
      };
    });
  }

  createChartBarsTemplate() {
    return this.getColumnProps()
      .map(({ value, percent }) => `<div style="--value: ${value}" data-tooltip="${percent}"></div>`)
      .join("");
  }

  createChartCssClasses() {
    return this.data.length
      ? "column-chart"
      : "column-chart column-chart_loading";
  }

  createTemplate() {
    return `
        <div class="${this.createChartCssClasses()}" style="--chart-height: ${this.chartHeight}">
          <div class="column-chart__title">
            ${this.label}
            ${this.createLinkTemplate()}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
            <div data-element="body" class="column-chart__chart">
                ${this.createChartBarsTemplate()}
            </div>
          </div>
        </div>
    `;
  }

  createElement(template) {
    const container = document.createElement("div");
    container.innerHTML = template;
    return container.firstElementChild;
  }

  update(newData) {
    this.data = newData;
    this.subElements.body.innerHTML = this.createChartBarsTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
