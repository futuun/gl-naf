/**
 * Creates canvas inside body element.
 *
 * @return {!Element} A canvas.
 */
export default function createCanvas () {
  const exist = document.getElementById('glcanvas')
  if (exist) {
    exist.width = window.innerWidth * window.devicePixelRatio
    exist.height = window.innerHeight * window.devicePixelRatio
    return exist
  }

  const canvasEl = document.createElement('canvas')
  canvasEl.id = 'glcanvas'
  canvasEl.style.display = 'block'
  canvasEl.style.width = '100%'
  canvasEl.style.height = '100%'
  canvasEl.width = window.innerWidth * window.devicePixelRatio
  canvasEl.height = window.innerHeight * window.devicePixelRatio

  return document.body.appendChild(canvasEl)
}
