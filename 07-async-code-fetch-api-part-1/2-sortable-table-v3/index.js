import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, {
    url = '',
    isSortLocally = false,
    sorted = {}
  } = {}) {
    super(headersConfig);
    this.headerConfig = headersConfig;
    this.url = url;
    this.sorted.id = sorted.id || 'title';
    this.sorted.order = sorted.order || 'asc';
    this.isDataLoading = false;
    this.isSortLocally = isSortLocally;
    this.fetchParams = {
      loadStartPosition: 0, // Для ленивой подгрузки
      loadEndPosition: 30, // Для ленивой подгрузки
      loadCount: 20, // Для ленивой подгрузки
      startDefault: 0, // Для сортировки на сервере
    };

    this.render();
    this.createLoadDataisteners();
  }


  async render() {
    super.render();

    if (!this.sorted || !this.url) {
      return;
    }

    const { loadStartPosition, loadEndPosition } = this.fetchParams;
    this.bodyData = await this.loadTableData(loadStartPosition, loadEndPosition);
    this.updateTableBodyContent();
    this.updateHeaderArrowVisibility();
  }

  sortOnClient(id, order) {
    super.sortOnClient(id, order);
  }

  async sortOnServer(id, order) {
    this.bodyData = await this.loadTableData(this.fetchParams.startDefault, this.bodyData.length);
    super.updateTableBodyContent();
    this.updateHeaderArrowVisibility();
    this.sorted.id = id;
    this.sorted.order = order;
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
  }

  updateHeaderArrowVisibility() {
    const headerCellIndex = this.headerConfig.findIndex(item => item.id === this.sorted.id);

    if (headerCellIndex === -1) {
      return;
    }
    super.updateHeaderArrowVisibility(headerCellIndex, this.sorted.order);
  }

  createLoadDataisteners() {
    window.addEventListener('scroll', this.windowScrollHandler);
  }

  removeLoadDataisteners() {
    window.removeEventListener('scroll', this.windowScrollHandler);
  }

  windowScrollHandler = async () => {
    const htmlRect = document.documentElement.getBoundingClientRect();
    const bottonOffset = 150;

    if (htmlRect.bottom < document.documentElement.clientHeight + bottonOffset) {

      if (this.isDataLoading) {
        return;
      }

      this.isDataLoading = true;
      this.fetchParams.loadStartPosition = this.fetchParams.loadEndPosition;
      this.fetchParams.loadEndPosition = this.fetchParams.loadEndPosition + this.fetchParams.loadCount;
      const newRowData = await this.loadTableData(this.fetchParams.loadStartPosition, this.fetchParams.loadEndPosition);
      if (!newRowData.length) {
        this.isDataLoading = false;
        return;
      }
      this.bodyData = [...this.bodyData, ...newRowData];
      this.subElements.body.append(this.createNewTableRows(newRowData));
      this.isDataLoading = false;
    }

  };

  createNewTableRows(newRowData) {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');

    for (const row of newRowData) {
      div.innerHTML = this.createBodyRowTemplate(row);
      fragment.append(div.firstElementChild);
    }
    return fragment;
  }

  async loadTableData(start, end) {
    this.subElements.loading.style.display = 'block';
    this.subElements.emptyPlaceholder.style.display = 'none';

    const url = this.createUrl(start, end);
    const tableData = await fetchJson(url);

    if (!tableData.length) {
      this.subElements.emptyPlaceholder.style.display = 'block';
    }

    this.subElements.loading.style.display = 'none';
    return tableData;
  }

  createUrl(start, end) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_sort', this.sorted.id);
    url.searchParams.set('_order', this.sorted.order);
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);
    return url;
  }

  destroy() {
    this.removeLoadDataisteners();
    super.destroy();
  }
}
