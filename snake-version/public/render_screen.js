export default function renderScreen(currentPlayerId, screen, game, requestAnimationFrame) {
   const context = screen.getContext('2d')
   const playerSize = 1
   const fruitSize = 1
   const screenSize = game.state.screenSize

   context.clearRect(0, 0, screenSize, screenSize)
   
   
   for (const playerId in game.state.players){
      const player = game.state.players[playerId]
      
      player.tail.forEach( trail => {
         context.fillStyle = (playerId != currentPlayerId) ? 'rgba(250, 100, 100, .6)' : '#F0DB4F'
         context.fillRect(trail.x, trail.y, playerSize, playerSize)
      })
      
      context.fillStyle = (playerId != currentPlayerId) ? 'rgba(150, 30, 30, .6)' : 'blue'
      context.fillRect(player.x, player.y, playerSize, playerSize)
   }
   
   const fruit = game.state.fruit
   context.fillStyle = 'red'
   context.fillRect(fruit.x, fruit.y, fruitSize, fruitSize)

   requestAnimationFrame(()=> {
      renderScreen(currentPlayerId, screen, game, requestAnimationFrame)
   })

}
