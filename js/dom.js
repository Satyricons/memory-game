// js/dom.js

/**
 * Создаёт DOM-элемент с заданными параметрами.
 * @param {string} tag - имя тега
 * @param {Object} [options]
 * @param {string} [options.className]
 * @param {string} [options.textContent]
 * @param {Object<string,string>} [options.attrs]
 * @param {Object<string,EventListener>} [options.events]
 * @param {Array<Node>} [options.children]
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
  const el = document.createElement(tag);

  const { className, textContent, attrs, events, children } = options;

  // 1. Классы
  if (className) {
    el.className = className;
  }

  // 2. Текст
  if (textContent !== undefined) {
    el.textContent = textContent;
  }

  // 3. Атрибуты
  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      el.setAttribute(name, value);
    }
  }

  // 4. События
  if (events) {
    for (const [eventName, handler] of Object.entries(events)) {
      el.addEventListener(eventName, handler);
    }
  }

  // 5. Дети
  if (children) {
    el.append(...children);
  }

  return el;
}