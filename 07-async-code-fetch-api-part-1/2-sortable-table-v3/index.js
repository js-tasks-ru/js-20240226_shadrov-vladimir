import fetchJson from './utils/fetch-json.js';
import SortableTableV2 from '../../06-events-practice/1-sortable-table-v2/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTableV3 extends SortableTableV2 {
  constructor(headersConfig, {
    url = ''
  } = {}) {
    super(headersConfig);
    this.headerConfig = headersConfig;
    this.url = url;
    this.start = 0;
    this.end = 30;
    this.delta = this.end - this.start;
    this.isDataLoading = false;

    this.renderTable();
    this.createLoadDataisteners();
  }

  async renderTable() {
    await this.loadTableData();
    this.updateTableBody();
  }

  sortOnClient() {
    super.sortOnClient(this.sorted.id, this.sorted.order);
  }

  async sortOnServer(id, order) {
    this.bodyData = await this.loadTableData();
    super.updateTableBody();

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
      const newRowData = await this.loadTableData();
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

  async loadTableData() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('_sort', this.sorted.id ?? 'title');
    url.searchParams.set('_order', this.sorted.order ?? 'asc');
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);

    const tableData = await fetchJson(url);

    if (!tableData.length) {
      alert('По заданному критерию запроса данные отсутствуют');
      return;
    } else {
      this.bodyData = [...this.bodyData, ...tableData];
      this.start = this.end;
      this.end = this.end + this.delta;
      return tableData;
    }
  }

  destroy() {
    this.removeLoadDataisteners();
    super.destroy();
  }
}
