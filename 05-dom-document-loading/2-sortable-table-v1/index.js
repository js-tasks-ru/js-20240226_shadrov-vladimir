export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.bodyData = data;
    this.element = this.createElement(this.createElementTemplate());
    this.render();
    this.subElements = {
      header: document.querySelector('[data-element="header"]'),
      body: document.querySelector('[data-element="body"]'),
    };
    this.lastHeaderCellIndex = 0;
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

    this.bodyData.sort((a, b) => {
      if (headerCellData.sortType === 'number') {
        return direction === 'asc'
          ? a[field] - b[field]
          : b[field] - a[field];
      } else {
        return direction === 'asc'
          ? a[field].localeCompare(b[field], ["ru", "en"])
          : b[field].localeCompare(a[field], ["ru", "en"]);
      }

    });

    this.updateTableBody();
  }

  updateHeaderArrowVisibility(currentCellIndex, direction) {
    if (this.lastHeaderCellIndex !== currentCellIndex) {
      this.subElements.header.children[this.lastHeaderCellIndex].removeAttribute('data-order');
    }
    this.lastHeaderCellIndex = currentCellIndex;
    this.subElements.header.children[currentCellIndex].dataset.order = direction;
  }

  updateTableBody() {
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  render(container = document.body) {
    container.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

