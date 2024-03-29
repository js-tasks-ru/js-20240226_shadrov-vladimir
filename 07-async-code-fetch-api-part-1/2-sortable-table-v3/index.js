import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, {
    url = '',
    isSortLocally = false,
  } = {}) {
    super(headersConfig);
    this.headerConfig = headersConfig;
    this.url = url;
    this.isDataLoading = false;
    this.isSortLocally = isSortLocally;
    this.fetchParams = {
      loadStartPosition: 0, // Для ленивой подгрузки
      loadEndPosition: 30, // Для ленивой подгрузки
      loadCount: 20, // Для ленивой подгрузки
      startDefault: 0, // Для сортировки на сервере
    };

    this.renderTable();
    this.createLoadDataisteners();

  }

  async renderTable() {
    const { loadStartPosition, loadEndPosition } = this.fetchParams;
    this.bodyData = await this.loadTableData(loadStartPosition, loadEndPosition);
    this.updateTableBody();
  }

  sortOnClient(id, order) {
    super.sortOnClient(id, order);
  }

  async sortOnServer(id, order) {
    const headerCellIndex = this.headerConfig.findIndex(item => item.id === id);
    this.bodyData = await this.loadTableData(this.fetchParams.startDefault, this.bodyData.length || this.fetchParams.loadEndPosition);
    super.updateTableBody();
    this.updateHeaderArrowVisibility(headerCellIndex, order);
  }

  sort() {
    if (this.isSortLocally) {
      this.sortOnClient(this.sorted.id, this.sorted.order);
    } else {
      this.sortOnServer(this.sorted.id, this.sorted.order);
    }
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
      const newRowData = await this.loadTableData(this.fetchParams.loadStartPosition, this.fetchParams.loadEndPosition);
      if (!newRowData.length) {
        this.isDataLoading = false;
        return;
      }
      this.bodyData = [...this.bodyData, ...newRowData];
      this.subElements.body.append(this.createNewTableRows(newRowData));
      this.isDataLoading = false;
      this.fetchParams.loadStartPosition = this.fetchParams.end;
      this.fetchParams.end = this.fetchParams.end + this.fetchParams.loadCount;
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
    const url = this.createUrl(start, end);
    const tableData = await fetchJson(url);
    return tableData;
  }

  createUrl(start, end) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_sort', this.sorted.id ?? 'title');
    url.searchParams.set('_order', this.sorted.order ?? 'asc');
    url.searchParams.set('_start', start);
    url.searchParams.set('_end', end);
    return url;
  }

  destroy() {
    this.removeLoadDataisteners();
    super.destroy();
  }
}
