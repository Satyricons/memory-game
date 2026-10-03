import { EMOJIS } from './constants.js';

/**
 * Перемешивает массив алгоритмом Фишера–Йейтса.
 * Возвращает новую копию, исходный массив не меняется.
 * @param {Array} array
 * @returns {Array}
 */
export function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Создаёт перемешанную колоду из 16 карточек (8 пар).
 * @returns {Array<{id: number, emoji: string, matched: boolean}>}
 */
export function createDeck() {
  const deck = [];
  let id = 0;

  for (const emoji of EMOJIS) {
    deck.push({ id: id++, emoji, matched: false });
    deck.push({ id: id++, emoji, matched: false });
  }

  return shuffle(deck);
}