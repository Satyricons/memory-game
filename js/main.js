import { createHeader, createStats } from './ui.js';

console.log('Memory Game: main.js загружен');

document.body.append(
  createHeader({
    onNewGame: () => console.log('new game'),
    onShowLeaderboard: () => console.log('leaderboard'),
  }),
  createStats()
);