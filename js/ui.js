// js/ui.js
import { createElement } from './dom.js';
import { TOTAL_PAIRS } from './constants.js';
import { formatDate } from './leaderboard.js';

/**
 * Хедер с двумя кнопками: «Новая игра» и «Таблица лидеров».
 * Колбэки передаются аргументами, чтобы не завязываться на game.js.
 * @param {{ onNewGame: () => void, onShowLeaderboard: () => void }} handlers
 * @returns {HTMLElement}
 */
export function createHeader({ onNewGame, onShowLeaderboard }) {
  const newGameBtn = createElement('button', {
    className: 'header__btn',
    textContent: 'Новая игра',
    attrs: { type: 'button' },
    events: { click: onNewGame },
  });

  const leaderboardBtn = createElement('button', {
    className: 'header__btn',
    textContent: 'Таблица лидеров',
    attrs: { type: 'button' },
    events: { click: onShowLeaderboard },
  });

  return createElement('header', {
    className: 'header',
    children: [newGameBtn, leaderboardBtn],
  });
}

/**
 * Блок со счётчиками ходов и найденных пар.
 * @returns {HTMLElement}
 */
export function createStats() {
  const moves = createElement('p', {
    className: 'stats__item',
    attrs: { 'data-role': 'moves' },
    textContent: `Ходы: 0`,
  });

  const pairs = createElement('p', {
    className: 'stats__item',
    attrs: { 'data-role': 'pairs' },
    textContent: `Пары: 0 / ${TOTAL_PAIRS}`,
  });

  return createElement('div', {
    className: 'stats',
    children: [moves, pairs],
  });
}

export function createBoard() {
  return createElement('div', {
    className: 'board',
    attrs: { 'data-role': 'board' },
  });
}

/**
 * Одна карточка: рубашка + лицо с эмодзи.
 * @param {{ id: number, emoji: string }} card
 * @returns {HTMLElement}
 */
export function createCard(card) {
  const back = createElement('div', {
    className: 'card__face card__face--back',
    textContent: '?',
  });

  const front = createElement('div', {
    className: 'card__face card__face--front',
    textContent: card.emoji,
  });

  return createElement('div', {
    className: 'card',
    attrs: { 'data-id': String(card.id) },
    children: [back, front],
  });
}

export function renderBoard(deck) {
  const board = document.querySelector('[data-role="board"]');
  if (!board) return;

  const cards = deck.map(createCard);
  board.append(...cards);
}

/** функция переворота */

export function flipCardElement(cardId, flipped) {
  const el = document.querySelector(`.card[data-id="${cardId}"]`);
  if (!el) return;
  el.classList.toggle('card--flipped', flipped);
}

/**
 * Обновляет счётчики ходов и пар в DOM.
 * @param {number} moves
 * @param {number} matched
 */
export function updateStats(moves, matched) {
  const movesEl = document.querySelector('[data-role="moves"]');
  const pairsEl = document.querySelector('[data-role="pairs"]');

  if (movesEl) {
    movesEl.textContent = `Ходы: ${moves}`;
  }

  if (pairsEl) {
    pairsEl.textContent = `Пары: ${matched} / ${TOTAL_PAIRS}`;
  }
}

/**
 * Строит контент для модалки таблицы лидеров.
 * @param {Array<{ moves: number, date: string }>} results
 * @returns {HTMLElement}
 */
export function createLeaderboardContent(results) {
  if (results.length === 0) {
    return createElement('p', {
      className: 'leaderboard__empty',
      textContent: 'Пока нет результатов',
    });
  }

  // Заголовок таблицы
  const headerRow = createElement('tr', {
    children: [
      createElement('th', { textContent: 'Место' }),
      createElement('th', { textContent: 'Ходы' }),
      createElement('th', { textContent: 'Дата' }),
    ],
  });

  // Строки данных
  const bodyRows = results.map((result, index) => {
    const place = createElement('td', { textContent: String(index + 1) });
    const moves = createElement('td', { textContent: String(result.moves) });
    const date = createElement('td', { textContent: formatDate(result.date) });

    return createElement('tr', { children: [place, moves, date] });
  });

  const thead = createElement('thead', { children: [headerRow] });
  const tbody = createElement('tbody', { children: bodyRows });

  return createElement('table', {
    className: 'leaderboard',
    children: [thead, tbody],
  });
}

