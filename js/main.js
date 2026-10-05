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
import { openModal, closeModal } from './modal.js';
import { createElement } from './dom.js';

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
  // 1. Отменяем таймер
  if (state.mismatchTimerId !== null) {
    clearTimeout(state.mismatchTimerId);
    state.mismatchTimerId = null;
  }

  // 2. Закрываем модалку
  closeModal();

  // 3. Новая колода
  state.deck = createDeck();
  state.moves = 0;
  state.matched = 0;
  state.firstCard = null;
  state.isLocked = false;
  state.isFinished = false;

  // 4. Очищаем board
  const boardEl = document.querySelector('[data-role="board"]');
  boardEl.replaceChildren();   // удаляет всех детей разом

  // 5. Рисуем заново
  renderBoard(state.deck);

  // 6. Обновляем счётчики
  updateStats(state.moves, state.matched);
}

function handleLeaderboard() {
  console.log('leaderboard — TODO');
}