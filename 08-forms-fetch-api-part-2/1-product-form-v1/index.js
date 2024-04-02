import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;

  constructor(productId) {
    this.productId = productId || '';
    this.subElements = {};
    this.mode = this.productId ? 'correct' : 'create';
    this.productUrl = 'api/rest/products';
    this.productParams = [{ id: this.productId }];
    this.categoryUrl = 'api/rest/categories';
    this.categoryParams = [{ _sort: 'weight' }, { _refs: 'subcategory' }];
  }

  async render() {
    const [productData, categoriesData] = await Promise.all([
      this.fetchData(this.productUrl, this.productParams),
      this.fetchData(this.categoryUrl, this.categoryParams)
    ]);

    this.element = this.createElement(this.createElementTemplate(productData[0], categoriesData));
    this.getSubElements();
    this.createEventListeners();

    return this.element;
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createElementTemplate(productData, categoriesData) {
    const { title, description, images, price, quantity, discount } = productData;

    return (`
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input required="" type="text" id="title" name="title" class="form-control" placeholder="Название товара" value="${escapeHtml(title)}">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" id="description" name="description" data-element="productDescription" placeholder="Описание товара">${description}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
              <ul class="sortable-list" data-element="imagesList">${this.createImagesListTemplate(images)}</ul>
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" id="subcategory" name="subcategory" id="subcategory">${this.createOptionsTemplate(categoriesData)}</select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input required="" type="number" id="price" name="price" class="form-control" placeholder="100" value="${price}">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input required="" type="number" id="discount" name="discount" class="form-control" placeholder="0" value="${discount}">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input required="" type="number" class="form-control" id="quantity" name="quantity" placeholder="1" value="${quantity}">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select class="form-control" id="status" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `);
  }

  createImagesListTemplate(images) {
    if (!images) { // Без этой проверки не проходил тест
      return;
    }
    return images.map(image => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="https://i.imgur.com/MWorX2R.jpg">
          <input type="hidden" name="source" value="${image.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${image.url}">
            <span>${image.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `;
    }).join('');
  }

  createOptionsTemplate(categoriesData) {
    return categoriesData.flatMap(option => {
      const { id, title, subcategories } = option;

      if (!id || !title || !subcategories) { // Без этой проверки не проходил тест
        return;
      }

      return subcategories.map(subcategory => {
        return `<option value="${subcategory.id}">${title} > ${subcategory.title}</option>`;
      }).join('');
    }).join('');
  }

  getSubElements() {
    const subelement = this.element.querySelectorAll('[data-element]');


    for (const element of subelement) {
      this.subElements[element.dataset.element] = element;
    }
  }

  async fetchData(url, params) {
    const urlPath = this.createUrl(url, params);
    return await fetchJson(urlPath);
  }

  createUrl(url, params) {
    const urlPath = new URL(url, BACKEND_URL);
    for (const param of params) {
      const [key, value] = Object.entries(param)[0];
      urlPath.searchParams.set(key, value);
    }
    return urlPath;
  }

  createEventListeners() {
    this.subElements.productForm.addEventListener('submit', this.save);
  }

  removeEventListeners() {
    this.subElements.productForm.removeEventListener('submit', this.save);

  }

  save = () => {
    let customEvent;

    switch (this.mode) {
      case 'correct':
        customEvent = new CustomEvent('product-updated', { bubbles: true });
        this.element.dispa;
        break;
      case 'create':
        customEvent = new CustomEvent('product-saved', { bubbles: true });
        break;
    }

    this.element.dispatchEvent(customEvent);
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}




