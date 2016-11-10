import DrawGL from './DrawGL'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'

let fractal

fractal = new DrawGL(vertex, fragment)

if (module.hot) {
  module.hot.accept('./DrawGL', () => {
    const nextDrawGL = require('./DrawGL').default
    fractal = new nextDrawGL()
  })
}

let cycle = 0
let offsetX = -1.1
let offsetY = 1.1
let moveModyfier = .1
let zoom = 10

fractal.setUniform('cycle', '1f', [cycle])
fractal.setUniform('viewportRes', '2f', [fractal.getWidth(), fractal.getHeight()])
fractal.setUniform('offset', '2f', [offsetX, offsetY])
fractal.setUniform('size', '1f', [8])
fractal.setUniform('speed', '1f', [1024])
fractal.setUniform('flashiness', '1f', [0.0004])
fractal.setUniform('zoom', '1f', [zoom])
fractal.setUniform('brightness', '1f', [3])
fractal.setUniform('color', '3f', [1, 0.5, 0.2])

window.onkeydown = function(e) {
  switch (e.key) {
    case 'ArrowRight':
      fractal.setUniform('offset', '2f', [offsetX += moveModyfier, offsetY])
      break;
    case 'ArrowLeft':
      fractal.setUniform('offset', '2f', [offsetX -= moveModyfier, offsetY])
      break;
    case 'ArrowUp':
      fractal.setUniform('offset', '2f', [offsetX, offsetY += moveModyfier])
      break;
    case 'ArrowDown':
      fractal.setUniform('offset', '2f', [offsetX, offsetY -= moveModyfier])
      break;
  }
}

window.addEventListener('mousewheel',function(e) {
  if (e.deltaY < 0 && zoom + 1 < 100) {
    fractal.setUniform('zoom', '1f', [zoom += .5])
  } else if (e.deltaY > 0 && zoom - 1 > 0) {
    fractal.setUniform('zoom', '1f', [zoom -= .5])
  }
}, false)

function nextFrame(e) {
  fractal.setUniform('cycle', '1f', [cycle += 1])
  fractal.render()
  window.requestAnimationFrame(nextFrame)
}
window.requestAnimationFrame(nextFrame)
