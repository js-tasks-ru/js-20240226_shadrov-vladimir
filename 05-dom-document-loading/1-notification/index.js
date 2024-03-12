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
    this.timerId = null;
    this.element = this.createElement(this.createElementTemplate());
  }

  createElement(template) {
    const elementContainer = document.createElement('div');
    elementContainer.innerHTML = template;
    return elementContainer.firstElementChild;
  }

  createElementTemplate() {
    return (`
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
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
    this.timerId = setTimeout(() => (this.destroy()), this.duration);
  }

  hide() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timerId);
    this.hide();
  }
}
