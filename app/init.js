import { Manager, Pinch, Pan, Tap } from 'hammerjs'
import toggleFullScreen from './toggleFullScreen'
import generateColor from './generateColor'

export default function init(fractal, sound) {
  const frequencyBinCount = new Uint8Array(sound.analyser.frequencyBinCount)
  const start = Date.now() / 1000
  let color = [1, .5, .2]
  let offsetX = 0
  let offsetY = 0
  let moveModyfier = .02
  let zoom = 6
  let detailsLevel = 24

  const xwidth = screen.width * window.devicePixelRatio
  const xheight = screen.height * window.devicePixelRatio
  fractal.setUniform('viewportRes', '2f', [xwidth, xheight])
  fractal.ctx.viewport(0, 0, xwidth, xheight)

  fractal.setUniform('time', '1f', [0])
  fractal.setUniform('zoom', '1f', [zoom])
  fractal.setUniform('details', '1i', [detailsLevel])
  fractal.setUniform('color', '3f', color)

  const mc = new Manager(fractal.ctx.canvas)
  const pinch = new Pinch()
  const pan = new Pan()
  const doubleTap = new Tap({ event: 'doubletap', taps: 2 })
  pinch.recognizeWith(pan)
  mc.add([pinch, pan, doubleTap])

  let currentScale = null
  let currentDeltaX = null
  let currentDeltaY = null

  // Handles pinch and pan events
  mc.on('pinch pan', function(ev) {
    // Adjusting the current pinch/pan event properties using the
    // previous ones set when they finished touching
    currentScale = zoom * ev.scale
    currentDeltaX = offsetX - (ev.deltaX / currentScale) / 100
    currentDeltaY = offsetY + (ev.deltaY / currentScale) / 100

    currentScale = Math.max(0.2, currentScale)
    currentScale = Math.min(300, currentScale)
    fractal.setUniform('zoom', '1f', [currentScale])
    fractal.setUniform('offset', '2f', [currentDeltaX, currentDeltaY])
  })

  mc.on('doubletap', function(event) {
    toggleFullScreen(fractal.ctx.canvas)
  })

  mc.on('panend pinchend', function(ev) {
    // Saving the final transforms for adjustment next time the user interacts.
    zoom = currentScale
    offsetX = currentDeltaX
    offsetY = currentDeltaY
  })

  if ('onwheel' in window) {
    fractal.ctx.canvas.addEventListener('wheel', function(e) {
      if (e.deltaY < 0 && zoom + 1 < 100) {
        fractal.setUniform('zoom', '1f', [zoom += .5])
      } else if (e.deltaY > 0 && zoom - 1 > 0) {
        fractal.setUniform('zoom', '1f', [zoom -= .5])
      }
    }, false)
  } else {
    fractal.ctx.canvas.addEventListener('mousewheel',function(e) {
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
      color = generateColor(frequencyBinCount)
      fractal.setUniform('color', '3f', color)
    }

    fractal.render()
    window.requestAnimationFrame(nextFrame)
  }
  window.requestAnimationFrame(nextFrame)
}
