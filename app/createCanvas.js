/**
 * Creates canvas inside body element.
 *
 * @return {!Element} A canvas.
 */
export default function createCanvas () {
  const exist = document.getElementById('glcanvas')
  if (exist) {
    exist.width = window.innerWidth
    exist.height = window.innerHeight
    return exist
  }

  const canvasEl = document.createElement('canvas')
  canvasEl.id = 'glcanvas'
  canvasEl.style.display = 'block'
  canvasEl.style.width = '100%'
  canvasEl.style.height = '100%'
  canvasEl.width = window.innerWidth
  canvasEl.height = window.innerHeight

  return document.body.appendChild(canvasEl)
}
