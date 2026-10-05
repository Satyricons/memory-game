import { createDeck } from './game.js';
import {
  createHeader,
  createStats,
  createBoard,
  renderBoard,
  flipCardElement,
  updateStats,
} from './ui.js';
import { MISMATCH_DELAY, TOTAL_PAIRS } from './constants.js';

console.log('Memory Game: main.js загружен');

// ---------- Состояние игры ----------
const state = {
  deck: createDeck(),
  moves: 0,
  matched: 0,
  firstCard: null,
  isLocked: false,
  isFinished: false,
  mismatchTimerId: null,
};



// ---------- Рендер ----------
document.body.append(
  createHeader({
    onNewGame: () => console.log('new game'),
    onShowLeaderboard: () => console.log('leaderboard'),
  }),
  createStats(),
  createBoard()
);

renderBoard(state.deck);

// ---------- Логика клика ----------
const boardEl = document.querySelector('[data-role="board"]');

boardEl.addEventListener('click', (e) => {
  const cardEl = e.target.closest('.card');
  if (!cardEl) return;

  const cardId = Number(cardEl.dataset.id);
  handleCardClick(cardId, cardEl);
});

function handleCardClick(cardId, cardEl) {
  // 1. Защиты
  if (state.isFinished) return;
  if (state.isLocked) return;
  if (cardEl.classList.contains('card--flipped')) return;

  // 2. Находим карточку
  const card = state.deck.find(c => c.id === cardId);
  if (!card) return;

  // 3. Переворачиваем
  flipCardElement(cardId, true);

  // 4. Первая карточка?
  if (state.firstCard === null) {
    state.firstCard = card;
    return;
  }

  // 5. Вторая карточка — считаем ход
  state.moves += 1;
  updateStats(state.moves, state.matched);

  // 6. Совпали?
  if (state.firstCard.emoji === card.emoji) {
    state.matched += 1;
    updateStats(state.moves, state.matched);
    state.firstCard.matched = true;
    card.matched = true;
    state.firstCard = null;

    // Победа?
    if (state.matched === TOTAL_PAIRS) {
      // TODO: finishGame();
    }
  } else {
    // Не совпали
    state.isLocked = true;

    const firstCardId = state.firstCard.id;
    const secondCardId = card.id;

    state.mismatchTimerId = setTimeout(() => {
      flipCardElement(firstCardId, false);
      flipCardElement(secondCardId, false);
      state.firstCard = null;
      state.isLocked = false;
      state.mismatchTimerId = null;
    }, MISMATCH_DELAY);
  }
}