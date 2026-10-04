import { createHeader, createStats, createBoard, renderBoard } from './ui.js';
import { createDeck } from './game.js';

console.log('Memory Game: main.js загружен');

const deck = createDeck();

document.body.append(
  createHeader({
    onNewGame: () => console.log('new game'),
    onShowLeaderboard: () => console.log('leaderboard'),
  }),
  createStats(),
  createBoard()
);

renderBoard(deck);