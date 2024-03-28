import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChartV1 {
  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    value = 0,
    formatHeading = (value) => value,
  } = {}) {
    super({ label, link, formatHeading, value });
    this.from = range?.from;
    this.to = range?.to;
    this.url = url;

    this.update(this.from, this.to);
  }


  async update(from, to) {
    this.element.classList.add('column-chart_loading');
    const data = await this.fetchData(from, to);
    super.update(Object.values(data));
    this.element.classList.remove('column-chart_loading');
    return data;
  }

  async fetchData(from, to) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);

    return await fetchJson(url);
  }


}
