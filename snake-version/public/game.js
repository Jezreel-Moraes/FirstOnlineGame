export default function createGame() {
   const state = {
      players: {
         'player1': {
            id: 'player1',
            x: 0,
            y: 0,
            moveX: 0,
            moveY: 0,
            tailSize: 1,
            tail: []
         },
         'player2': {
            id: 'player2',
            x: 1,
            y: 10,
            moveX: 1,
            moveY: 0,
            tailSize: 5,
            tail: []
         },

      },
   
      fruit: null,
      screenSize: 40,
      stop: false
   }

   const settings = {
      intervals: {
         generateFruit: 1,
         movePlayers: 200
      },
      playerDirections: {
         up: -1,
         down: 1,
         left: -1,
         right: 1
      }
   }

   function start() {
      generateFruit()
      setInterval(movePlayersByInterval, settings.intervals.movePlayers)
   }

   // fruits

   function generateFruit() {
      const fruit = {
         x: Math.floor(Math.random() * state.screenSize),
         y: Math.floor(Math.random() * state.screenSize)
      }
      state.fruit = fruit

      const command = isFruitCollisionWithAPlayer()
      console.log(command)
      if (!command) return
      
      incrementPlayerSize(command)
      generateFruit()
   }

   function isFruitCollisionWithAPlayer(){
      const fruit = state.fruit

      for (const playerId in state.players){
         const player = state.players[playerId]
         
         for (const trail of player.tail){
            if (trail.x != fruit.x || trail.y != fruit.y) continue
            return {player}
         }
      }
      return false
   }

   // players

   function movePlayerByKeyboardCommand(command) {
      
      const acceptedMoves = {
         ArrowUp(player){
            if (player.moveY == settings.playerDirections.down && player.tailSize != 0) return false
            player.y = player.y > 0 ? --player.y : state.screenSize - 1
            
            player.moveY = settings.playerDirections.up
            player.moveX = null
            return true
         },
         
         ArrowRight(player){
            if (player.moveX == settings.playerDirections.left && player.tailSize != 0) return false
            player.x = player.x < state.screenSize - 1 ? ++player.x : 0
            
            player.moveY = null
            player.moveX = settings.playerDirections.right
            return true
         },
         
         ArrowDown(player){
            if (player.moveY == settings.playerDirections.up && player.tailSize != 0) return false
            player.y = player.y < state.screenSize - 1 ? ++player.y : 0 
            
            player.moveY = settings.playerDirections.down
            player.moveX = null
            return true
         },
         
         ArrowLeft(player){
            if (player.moveX == settings.playerDirections.right && player.tailSize != 0) return false
            player.x = player.x > 0 ? --player.x : state.screenSize - 1
            
            player.moveY = null
            player.moveX = settings.playerDirections.left
            return true
         }
      }
      
      const playerId = command.playerId
      const keyPressed = command.keyPressed
      const player = state.players[playerId]
      const moveFunction = acceptedMoves[keyPressed]

      if (! moveFunction || !player) return 
      if (!moveFunction(player)) return
      
      updatePlayerTrail({player})
      checkPlayerCollisions({player})
   }

   function incrementPlayerSize(command) {
      const player = command.player
      ++player.tailSize
      console.log('aumentando o jogador', player.id, 'para >>', player.tailSize)
   }

   // player tail
   
   function updatePlayerTrail(command) {
      addLastPlayerPositionToTail(command)
      removeOldPlayerPositionOfTail(command)
   }

   function addLastPlayerPositionToTail(command) {
      const player = command.player
      const lastPlayerPosition = {
         x: player.x,
         y: player.y
      }
      player.tail.push(lastPlayerPosition)
   }

   function removeOldPlayerPositionOfTail(command) {
      const player = command.player
      while (player.tailSize < player.tail.length) {
         player.tail.shift()
      }
   }

   // check collisions


   function checkPlayerCollisions(command) {
      checkPlayerCollisionToFruit(command)
   }

   function checkPlayerCollisionToFruit(command) {
      const player = command.player
      const fruit = state.fruit
      
      if (player.x == fruit.x && player.y == fruit.y) {
         incrementPlayerSize(command)
         generateFruit()
      }
   }



   function movePlayersByInterval() {
      for (const playerId in state.players) {
         const player = state.players[playerId]

         if (player.moveY == settings.playerDirections.up) {
            player.y = player.y > 0 ? --player.y : state.screenSize - 1

         } else if (player.moveY == settings.playerDirections.down){
            player.y = player.y < state.screenSize - 1 ? ++player.y : 0 

         } else if (player.moveX == settings.playerDirections.left){
            player.x = player.x > 0 ? --player.x : state.screenSize - 1
            
         } else if (player.moveX == settings.playerDirections.right){
            player.x = player.x < state.screenSize - 1 ? ++player.x : 0

         }

         updatePlayerTrail({player})
         checkPlayerCollisions({player})

      }
   }

   return {
      state,
      movePlayerByKeyboardCommand,
      start,
   }
}