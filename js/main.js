import { createDeck } from './game.js';
import {
  createHeader,
  createStats,
  createBoard,
  renderBoard,
  flipCardElement,
  updateStats,
  createLeaderboardContent,
} from './ui.js';
import { MISMATCH_DELAY, TOTAL_PAIRS } from './constants.js';
import { openModal, closeModal } from './modal.js';
import { createElement } from './dom.js';
import { saveResult, getLeaderboard } from './leaderboard.js';

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
    onNewGame: handleNewGame,
    onShowLeaderboard: handleLeaderboard,
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

    if (state.matched === TOTAL_PAIRS) {
      finishGame();
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

// ---------- Победа ----------
function finishGame() {
  state.isFinished = true;
  saveResult(state.moves);   // ← сохраняем результат

  const content = createElement('p', {
    className: 'win-message',
    textContent: `Вы нашли все пары! Ходов: ${state.moves}`,
  });

  openModal({
    title: 'Победа!',
    content,
    buttons: [
      {
        label: 'Новая игра',
        onClick: () => {
          closeModal();
          handleNewGame();
        },
        primary: true,
      },
      {
        label: 'Закрыть',
        onClick: closeModal,
      },
    ],
  });
}

// ---------- Кнопки хедера ----------
function handleNewGame() {
  if (state.mismatchTimerId !== null) {
    clearTimeout(state.mismatchTimerId);
    state.mismatchTimerId = null;
  }

  closeModal();

  state.deck = createDeck();
  state.moves = 0;
  state.matched = 0;
  state.firstCard = null;
  state.isLocked = false;
  state.isFinished = false;

  const boardEl = document.querySelector('[data-role="board"]');
  boardEl.replaceChildren();
  renderBoard(state.deck);

  updateStats(state.moves, state.matched);
}

function handleLeaderboard() {
  const results = getLeaderboard();
  const content = createLeaderboardContent(results);

  openModal({
    title: 'Таблица лидеров',
    content,
    buttons: [
      { label: 'Закрыть', onClick: closeModal, primary: true },
    ],
  });
}