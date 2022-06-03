import createKeyboardListener from './keyboard-listener.js'
import createGame from './game.js'
import renderScreen from './render-screen.js'
import {addPlayerToScoreBoard, removePlayerOfScoreBoard, updatePlayerScore, resetScoreBoard} from './render-scoreboard.js'
import playPlayerScoreUpSound from './sound_effects.js'

const game = createGame() 
const keyboardListener = createKeyboardListener(document)
const scoreboard = document.getElementById('scoreboard')
const socket = io()

socket.on('connect', () => {
   const playerId = socket.id
   const screen = document.getElementById('screen')
   renderScreen(playerId, screen, game, requestAnimationFrame)
})

socket.on('setup', (state) => {
   const playerId = socket.id
   game.setState(state)
   keyboardListener.registerPlayerId(playerId)
   keyboardListener.subscribe(game.movePlayer)
   keyboardListener.subscribe((command) => {
      socket.emit('move-player', command)
   })
   
   const screen = document.getElementById('screen')
   screen.width = game.state.screen.width
   screen.height = game.state.screen.width
   resetScoreBoard(document, scoreboard, game, playerId)
})

socket.on('add-player', (command) => {
   game.addPlayer(command)
   const playerId = socket.id
   
   if (playerId != command.playerId){
      addPlayerToScoreBoard(document, scoreboard, game, command.playerId ,playerId) 
   }
})

socket.on('remove-player', (command) => {
   game.removePlayer(command)
   const playerId = socket.id
   removePlayerOfScoreBoard(document, command.playerId)
})

socket.on('move-player', (command) => {
   const playerId = socket.id
   if (playerId == command.playerId) return
   game.movePlayer(command)
})

socket.on('add-fruit', (command) => {
   game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
   game.removeFruit(command)
})

socket.on('increment-score', (command) =>{
   updatePlayerScore(document, command.playerId, game)
   const playerId = socket.id
   if (playerId != command.playerId) return
   const player = game.state.players[playerId]
   playPlayerScoreUpSound(player)
})

socket.on('disconnect', () => {
   keyboardListener.unsubscribeAll()
})
