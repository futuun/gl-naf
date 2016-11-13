import throttle from 'lodash/throttle'
import AudioWrapper from './AudioWrapper'
import attachButtons from './attachButtons'

function drawSpectrum(array) {
  const iterations = Math.floor(array.length / 4)
  let r = 0
  let g = 0
  let b = 0

  for (var i = 0; i < iterations; i++) {
    r += array[i]
    g += array[i + iterations]
    b += array[i + iterations + iterations]
  }

  return [
    r / iterations / 255,
    g / iterations / 255,
    b / iterations / 255,
  ]
}

export default function init(fractal) {
  fractal.ctx.canvas.focus()
  const start = Date.now() / 1000
  let color = [1, .5, .2]
  let offsetX = 0
  let offsetY = 0
  let moveModyfier = .02
  let zoom = 4
  let detailsLevel = 24

  const xwidth = screen.width * window.devicePixelRatio
  const xheight = screen.height * window.devicePixelRatio
  fractal.setUniform('viewportRes', '2f', [xwidth, xheight])
  fractal.ctx.viewport(0, 0, xwidth, xheight)

  fractal.setUniform('time', '1f', [0])
  fractal.setUniform('zoom', '1f', [zoom])
  fractal.setUniform('details', '1i', [detailsLevel])
  fractal.setUniform('color', '3f', color)
  let sound = new AudioWrapper('spazzmatica_polka.mp3', 32)
  const frequencyBinCount = new Uint8Array(sound.analyser.frequencyBinCount)
  attachButtons(sound)

  window.addEventListener('resize', throttle(function(e) {
    console.log('resize', e)
    const height = e.target.innerHeight
    const width = e.target.innerWidth

    fractal.ctx.canvas.height = height
    fractal.ctx.canvas.width = width
    fractal.ctx.viewport(0, 0, width, height)
  }, 100))

  window.addEventListener('keydown', function(e) {
    console.log('keydown', e)
    switch (e.key) {
      case 'ArrowRight':
        offsetX = +(offsetX + moveModyfier / zoom).toFixed(4)
        break;
      case 'ArrowLeft':
        offsetX = +(offsetX - moveModyfier / zoom).toFixed(4)
        break;
      case 'ArrowUp':
        offsetY = +(offsetY + moveModyfier / zoom).toFixed(4)
        break;
      case 'ArrowDown':
        offsetY = +(offsetY - moveModyfier / zoom).toFixed(4)
        break;
    }

    offsetX = Math.max(0, offsetX)
    offsetX = Math.min(6, offsetX)

    offsetY = Math.max(-6, offsetY)
    offsetY = Math.min(0, offsetY)
    fractal.setUniform('offset', '2f', [offsetX, offsetY])
  }, false)

  if ('onwheel' in window) {
    fractal.ctx.canvas.addEventListener('wheel', function(e) {
      console.log('wheel', e)
      if (e.deltaY < 0 && zoom + 1 < 100) {
        fractal.setUniform('zoom', '1f', [zoom += .5])
      } else if (e.deltaY > 0 && zoom - 1 > 0) {
        fractal.setUniform('zoom', '1f', [zoom -= .5])
      }
    }, false)
  } else {
    fractal.ctx.canvas.addEventListener('mousewheel',function(e) {
      console.log('mousewheel', e)
      if (e.deltaY < 0 && zoom + 1 < 100) {
        fractal.setUniform('zoom', '1f', [zoom += .5])
      } else if (e.deltaY > 0 && zoom - 1 > 0) {
        fractal.setUniform('zoom', '1f', [zoom -= .5])
      }
    }, false)
  }

  const detail = document.getElementById('detail')
  detail.innerHTML = detailsLevel
  const detail_up = document.getElementById('detail_up')
  const detail_down = document.getElementById('detail_down')

  detail_up.addEventListener('click', function(e) {
    e.preventDefault()
    console.log('up')
    fractal.setUniform('details', '1i', [detailsLevel += 2])
    detail.innerHTML = detailsLevel
  }, false)

  detail_down.addEventListener('click', function(e) {
    e.preventDefault()
    console.log('down')
    fractal.setUniform('details', '1i', [detailsLevel -= 2])
    detail.innerHTML = detailsLevel
  }, false)

  function nextFrame(e) {
    fractal.setUniform('time', '1f', [Date.now() / 1000 - start])
    if (sound.bufferSource) {
      sound.analyser.getByteFrequencyData(frequencyBinCount)
      color = drawSpectrum(frequencyBinCount)
      fractal.setUniform('color', '3f', color)
    }

    fractal.render()
    window.requestAnimationFrame(nextFrame)
  }
  window.requestAnimationFrame(nextFrame)
}
