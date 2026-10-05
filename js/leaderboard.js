// js/leaderboard.js
import { LEADERBOARD_KEY, LEADERBOARD_LIMIT } from './constants.js';

/**
 * Читает массив результатов из localStorage.
 * @returns {Array<{ moves: number, date: string }>}
 */
function readResults() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
/**
 * Записывает массив результатов в localStorage.
 * @param {Array<{ moves: number, date: string }>} results
 */
function writeResults(results) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(results));
}

/**
 * Сортирует результаты по правилам:
 * 1. По moves (возрастание)
 * 2. При равенстве — по date (раньше — выше)
 * @param {Array} results
 * @returns {Array}
 */
function sortResults(results) {
  return [...results].sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return new Date(a.date) - new Date(b.date);
  });
}

/**
 * Сохраняет результат игры в localStorage.
 * @param {number} moves
 */
export function saveResult(moves) {
  const results = readResults();
  results.push({
    moves,
    date: new Date().toISOString(),
  });
  const sorted = sortResults(results);
  const limited = sorted.slice(0, LEADERBOARD_LIMIT);
  writeResults(limited);
}

/**
 * Возвращает отсортированный топ результатов.
 * @returns {Array<{ moves: number, date: string }>}
 */
export function getLeaderboard() {
  const results = readResults();
  return sortResults(results);
}

/**
 * Форматирует ISO-дату в ДД.ММ.ГГГГ.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}