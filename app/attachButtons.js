import play from './svg/play.svg'
import pause from './svg/pause.svg'

export default function attachButtons(audioInstance) {
  const player = document.getElementById('player')
  player.innerHTML = play

  player.addEventListener('click', function clickPlayerButton(e) {
    player.innerHTML = audioInstance.toggleSound()
      ? pause
      : play
  }, false)
}
