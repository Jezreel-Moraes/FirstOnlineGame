const screen = document.getElementById('screen');
const context = screen.getContext('2d');

import createGame from "./game.js";
import createKeyboardListener from "./keyboard_listener.js";
import renderScreen from "./render_screen.js";


const game = createGame();
const keyboardListener = createKeyboardListener(document);
keyboardListener.subscribe(game.movePlayerByKeyboardCommand)

const currentPlayerId = 'player1'
game.start()
renderScreen(currentPlayerId, screen, game, requestAnimationFrame);