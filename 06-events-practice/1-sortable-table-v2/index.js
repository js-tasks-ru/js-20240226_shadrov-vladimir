import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';


export default class SortableTableV2 extends SortableTableV1 {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true
  } = {}) {
    super(headersConfig, data);

    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.createEventListeners();
    super.sort(sorted.id, sorted.order);
  }

  headerPointerdownHandler = (event) => {
    const headerCellElement = event.target.closest('[data-sortable="true"]');

    if (!headerCellElement) {
      return;
    }

    const id = headerCellElement.dataset.id;
    const order = headerCellElement.dataset.order === 'asc' ? 'desc' : 'asc';

    super.sort(id, order);
  };

  sortOnClient() {
    // @TODO
  }

  sortOnServer() {
    // @TODO
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient();
    } else {
      this.sortOnServer();
    }
  }

  headerPointerdownHandler = (event) => {
    const headerCellElement = event.target.closest('[data-sortable="true"]');

    if (!headerCellElement) {
      return;
    }

    const id = headerCellElement.dataset.id;
    const order = headerCellElement.dataset.order === 'asc' ? 'desc' : 'asc';

    super.sort(id, order);
  };

  createEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.headerPointerdownHandler);
  }

  destroyEventListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.headerPointerdownHandler);

  }

  destroy() {
    super.destroy();
    this.destroyEventListeners();
  }
}
