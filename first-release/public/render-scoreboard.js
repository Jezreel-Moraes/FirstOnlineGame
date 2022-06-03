const ID = "_id"
const SCORE = "_score"

export function initScoreBoard(document, scoreboard, game, currentPlayerId){
   
   for (const playerId in game.state.players){
      addPlayerToScoreBoard(document, scoreboard, game, playerId, currentPlayerId)
   }
}

export function addPlayerToScoreBoard(document, scoreboard, game, playerId, currentPlayerId){
   const player = game.state.players[playerId]
   const playerScore = player.score
   
   const newRow = document.createElement('tr')
   newRow.setAttribute('id', playerId)

   const playerIdElement = document.createElement('td')
   playerIdElement.innerText = playerId
   playerIdElement.setAttribute('id', playerId + ID)
   
   const playerScoreElement = document.createElement('td')
   playerScoreElement.innerText = playerScore
   playerScoreElement.setAttribute('id', playerId + SCORE)
   
   newRow.appendChild(playerIdElement)
   newRow.appendChild(playerScoreElement)

   scoreboard.appendChild(newRow)

   if (currentPlayerId == playerId){
      newRow.style.color = 'rgb(100, 150, 255)'
   }
}

export function removePlayerOfScoreBoard(document, playerId){
   document.getElementById(playerId).remove()
}

export function updatePlayerScore(document, playerId, game){
   const player = game.state.players[playerId]
   const score = player.score
   document.getElementById(playerId + SCORE).innerText = score
}