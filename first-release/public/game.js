export default function createGame(){
         
   const state = {
      players: {},
      fruits: {},
      screen: {
         width:  30,
         height: 30
      }
   }

   const observers = []

   function subscribe(observerFunction){
      observers.push(observerFunction)
   }
   
   function incrementScore(command){
      const playerId = command.playerId
      state.players[playerId].score += 50

      notifyAll({
         type:'increment-score',
         playerId,
      })

   }

   function unsubscribeAll(){
      observers.forEach((observerFunction) => { observerFunction = null})
   }

   function notifyAll(command){
      observers.forEach(observerFunction => observerFunction(command))
   }

   function start(){
      const frequency = 2000
      setInterval(addFruit, frequency)
   }

   function addFruit(command){
      const fruitId = command ? command.fruitId : Math.random() * 1000000000
      const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
      const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

      state.fruits[fruitId] = {
         x: fruitX,
         y: fruitY
      }

      notifyAll({
         type: "add-fruit",
         fruitId,
         fruitX,
         fruitY
      })

   }

   function setState(newState){
      Object.assign(state, newState)
   }

   function removeFruit(command) {
      delete state.fruits[command.fruitId]

      notifyAll({
         type: "remove-fruit",
         fruitId: command.fruitId,
      })

   }

   function addPlayer(command){
      const playerId = command.playerId
      const playerX = command.playerX ? command.playerX : Math.floor(Math.random() * state.screen.width)   
      const playerY = command.playerY ? command.playerY : Math.floor(Math.random() * state.screen.height)   
      const score = 0
      
      state.players[playerId] = {
         x: playerX,
         y: playerY,
         score
      }
   
      notifyAll({
         type:'add-player',
         playerId,
         playerX,
         playerY,
      })
   }

   function removePlayer(command){
      const playerId = command.playerId
      delete state.players[playerId]

      notifyAll({
         type:'remove-player',
         playerId
      })      

   }  


   function movePlayer(command){
      notifyAll(command)
      const acceptedMoves = {
         ArrowUp(player){
            player.y = player.y > 0 ? --player.y : state.screen.height - 1
         },
         
         ArrowRight(player){
            player.x = player.x < state.screen.width - 1 ? ++player.x : 0
         },
         
         ArrowDown(player){
            player.y = player.y < state.screen.height - 1 ? ++player.y : 0 
         },
         
         ArrowLeft(player){
            player.x = player.x > 0 ? --player.x : state.screen.width - 1
         }
      }

      const keyPressed = command.keyPressed
      const playerId = command.playerId
      const player = state.players[playerId]
      const moveFunction = acceptedMoves[keyPressed]
      if (moveFunction && player) {
         moveFunction(player)
         checkForFruitCollision(playerId)  
      }
      
      function checkForFruitCollision(playerId){
         for (const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]
            
            if (player.x === fruit.x && player.y === fruit.y){
               removeFruit({fruitId})
               incrementScore({playerId})
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
      setState,
      subscribe,
      unsubscribeAll,
      incrementScore,
      start,
      state
   }
}
