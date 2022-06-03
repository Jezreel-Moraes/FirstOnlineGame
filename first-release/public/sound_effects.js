export default function playPlayerScoreUpSound(player){
   (player.score % 100 === 0) ? play100PointsEffectSound() : playGetFruitSound()
}

function playGetFruitSound(){
   const audio = new Audio('/sound_effects/coin_effect.mp3')
   audio.play()
}

function play100PointsEffectSound(){
   const audio = new Audio('/sound_effects/100_points_effect.mp3')
   audio.play()
}
