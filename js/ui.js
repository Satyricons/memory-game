// js/ui.js
import { createElement } from './dom.js';
import { TOTAL_PAIRS } from './constants.js';

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