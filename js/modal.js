import { createElement } from './dom.js';

let activeModal = null;

export function openModal({ title, content, buttons = [], onClose }) {
  if (activeModal) closeModal();

  // 1. Создание элементов
  const overlay = createElement('div', { className: 'modal-overlay' });
  const modal = createElement('div', { className: 'modal' });
  const titleEl = createElement('h2', { className: 'modal__title', textContent: title });
  const body = createElement('div', { className: 'modal__body', children: [content] });
  const footer = createElement('div', { className: 'modal__footer' });

  // 2. Кнопки
  const buttonEls = buttons.map(({ label, onClick, primary }) =>
    createElement('button', {
      className: primary ? 'modal__btn modal__btn--primary' : 'modal__btn',
      textContent: label,
      attrs: { type: 'button' },
      events: { click: onClick },
    })
  );
  footer.append(...buttonEls);

  // 3. Сборка
  modal.append(titleEl, body, footer);
  overlay.append(modal);
  document.body.append(overlay);

  // 4. Блокировка скролла
  document.body.classList.add('modal-open');

  // 5. Закрытие по фону
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // 6. Escape
  document.addEventListener('keydown', handleEscape);

  // 7. Запомнить
  activeModal = { overlay, onClose };
}

function handleEscape(e) {
  if (e.key === 'Escape') closeModal();
}



export function closeModal() {
  if (!activeModal) return;

  const { overlay, onClose } = activeModal;

  overlay.remove();
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleEscape);

  activeModal = null;

  if (onClose) onClose();
}