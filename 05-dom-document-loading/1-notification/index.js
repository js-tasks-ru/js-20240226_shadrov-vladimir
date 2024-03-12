export default class NotificationMessage {
  element;
  static lastInstance = null;

  constructor(message, {
    duration = 0,
    type = ''
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.timeout = null;
    this.element = this.createElement(this.createElementTemplate());
  }
  createElement(template) {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = template;
    return elementContainer.firstElementChild;
  }

  getElementTypeStyles() {
    const validTypes = ['success', 'error'];

    if (!validTypes.includes(this.type)) {
      throw 'В конструктор класса "NotificationMessage" не передан тип уведомления или передан не корректно. Ожидается "success" | "error"';
    }
    return this.type === 'success'
      ? 'success'
      : 'error';
  }

  createElementTemplate() {
    return (`
      <div class="notification ${this.getElementTypeStyles()}" style="--value:${this.duration * 1.1}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `);
  }

  show(container = document.body) {
    if (NotificationMessage.lastInstance && NotificationMessage.lastInstance !== this) {
      NotificationMessage.lastInstance.destroy();
    }
    container.append(this.element);
    NotificationMessage.lastInstance = this;
    this.timeout = setTimeout(() => (this.destroy()), this.duration);
  }

  hide() {
    this.removeElement();
  }

  removeElement() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timeout);
    this.hide();
  }
}
