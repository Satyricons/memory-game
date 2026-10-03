import { createDeck } from './game.js';

console.log('Memory Game: main.js загружен');
const deck = createDeck();
console.log('id порядок:', deck.map(c => c.id));