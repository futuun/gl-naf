import throttle from 'lodash/throttle'

export default function init(fractal) {
  fractal.ctx.canvas.focus()
  const start = Date.now() / 1000
  let offsetX = 0
  let offsetY = 0
  let moveModyfier = .02
  let zoom = 11

  const xwidth = screen.width * window.devicePixelRatio
  const xheight = screen.height * window.devicePixelRatio
  fractal.setUniform('viewportRes', '2f', [xwidth, xheight])
  fractal.ctx.viewport(0, 0, xwidth, xheight)

  fractal.setUniform('time', '1f', [0])
  fractal.setUniform('zoom', '1f', [zoom])
  fractal.setUniform('brightness', '1f', [1])
  fractal.setUniform('color', '3f', [1, 0.5, 0.2])

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

  function nextFrame(e) {
    fractal.render()
    fractal.setUniform('time', '1f', [Date.now() / 1000 - start])
    window.requestAnimationFrame(nextFrame)
  }
  window.requestAnimationFrame(nextFrame)
}
