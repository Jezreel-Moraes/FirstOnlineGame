import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import {Server} from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)
app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => {
   sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
   const playerId = socket.id
   
   game.addPlayer({playerId})
   game.start()

   socket.emit('setup', game.state)
   
   socket.on('disconnect', () => {
      game.removePlayer({playerId})
   })

   socket.on('move-player', (command) => {
      command.playerId = playerId
      command.type = 'move-player'
      game.movePlayer(command)
   })

})

sockets.on('disconnect', () => {
   sockets.emit('disconnect')
   game.unsubscribeAll()
})


server.listen(3000, () => {
   console.log('Server is running on port 3000')
})