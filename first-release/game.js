export default function createGame(){
         
   const state = {
      players: {},
      fruits: {},
      screen: {
         width: 10,
         height: 10
      }
   }

   function addFruit(command){
      const fruitId = command.fruitId
      const fruitX = command.fruitX
      const fruitY = command.fruitY

      state.fruits[fruitId] = {
         x: fruitX,
         y: fruitY
      }

   }

   function removeFruit(command) {
      delete state.fruits[command.fruitId]
   }

   function addPlayer(command){
      const playerId = command.playerId
      const playerX = command.playerX   
      const playerY = command.playerY
      
      state.players[playerId] = {
         x: playerX,
         y: playerY
      }
   }

   function removePlayer(command){
      delete state.players[command.playerId]
   }  


   function movePlayer(command){

      const acceptedMoves = {
         ArrowUp(player){
            player.y = Math.max(player.y - 1, 0) 
         },
         
         ArrowRight(player){
            player.x = Math.min(player.x + 1, state.screen.width - 1) 
         },
         
         ArrowDown(player){
            player.y = Math.min(player.y + 1, state.screen.height - 1) 
         },
         
         ArrowLeft(player){
            player.x = Math.max(player.x - 1, 0) 
         }
      }

      const keyPressed = command.keyPressed
      const player = state.players[command.playerId]
      const moveFunction = acceptedMoves[keyPressed]
      if (moveFunction && player) {
         moveFunction(player)
         checkForFruitCollision(player)
      }
      
      function checkForFruitCollision(player){
         for (const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            
            if (player.x === fruit.x && player.y === fruit.y){
               removeFruit({fruitId})
            }
         }
      }

   }

   return {
      addPlayer,
      removePlayer,
      movePlayer,
      addFruit,
      removeFruit,
      state
   }
}
