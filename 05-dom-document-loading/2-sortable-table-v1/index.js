export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.bodyData = data;
    this.element = this.createElement(this.createElementTemplate());
    this.render();
    this.subElements = {};
    this.lastHeaderCellIndex = 0;

    this.getSubElements();
  }
  createElementTemplate() {
    return (`
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.createHeaderTemplate()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.createBodyTemplate()}
          </div>
          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
          <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
            <div>
              <p>No products satisfies your filter criteria</p>
              <button type="button" class="button-primary-outline">Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createHeaderTemplate() {
    return this.createHeaderRowTemplate(this.headerConfig);
  }

  createHeaderRowTemplate(headerData) {
    return headerData.map(item => this.createHeaderCellTemplate(item)).join('');
  }

  createHeaderCellTemplate(cellData) {
    const { id, title, sortable } = cellData;
    return (`
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${this.createArrowTemplate(sortable)}
      </div>
    `);
  }

  createArrowTemplate(isSortable) {
    if (!isSortable) {
      return '';
    }

    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  createBodyTemplate() {
    return this.bodyData.map(rowData => this.createBodyRowTemplate(rowData)).join('');
  }

  createBodyRowTemplate(rowData) {
    return `
        <a href="#" class="sortable-table__row">
          ${this.headerConfig.map(config => this.createBodyCellTemplate(config, rowData)).join('')}
        </a>
      `;
  }

  createBodyCellTemplate(config, rowData) {
    if (config.template) {
      return config.template(rowData.images);
    }
    return `
      <div class="sortable-table__cell">${rowData[config.id]}</div>
    `;
  }

  sort(field, direction) {
    const headerCellIndex = this.headerConfig.findIndex(item => item.id === field);
    const headerCellData = this.headerConfig[headerCellIndex];

    this.updateHeaderArrowVisibility(headerCellIndex, direction);

    const k = direction === 'asc' ? 1 : -1;

    this.bodyData.sort((a, b) => {
      if (headerCellData.sortType === 'number') {
        return k * (a[field] - b[field]);
      } else {
        return k * a[field].localeCompare(b[field], ["ru", "en"]);
      }
    });

    this.updateTableBodyContent();
  }

  updateHeaderArrowVisibility(currentCellIndex, direction) {
    if (currentCellIndex === -1) {
      return;
    }

    if (this.lastHeaderCellIndex !== currentCellIndex) {
      this.subElements.header.children[this.lastHeaderCellIndex].removeAttribute('data-order');
    }
    this.lastHeaderCellIndex = currentCellIndex;
    this.subElements.header.children[currentCellIndex].dataset.order = direction;
  }

  updateTableBodyContent() {
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  render(container = document.body) {
    container.append(this.element);
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    for (const element of elements) {
      this.subElements[element.dataset.element] = element;
    }
  }


  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

