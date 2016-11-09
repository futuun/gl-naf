import {
  createProgram,
  compileShader,
} from './webGLUtils'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'

export default function start(gl) {
  const glCanvas = gl.canvas
  const vertexShader = compileShader(gl, vertex, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(gl, fragment, gl.FRAGMENT_SHADER)
  const program = createProgram(gl, vertexShader, fragmentShader)

  gl.useProgram(program)

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  var positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, -3, -3, 1, 1, 1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

  const resolutionUniformLoc = gl.getUniformLocation(program, 'viewportRes')
  gl.uniform2f(resolutionUniformLoc, glCanvas.width, glCanvas.height)

  let offsetX = -1.6
  let offsetY = .8
  let moveModyfier = .1
  const offsetUniformLoc = gl.getUniformLocation(program, 'offset')
  gl.uniform2f(offsetUniformLoc, offsetX, offsetY)
  window.onkeydown = function(e) {
    switch (e.key) {
      case 'ArrowRight':
        gl.uniform2f(offsetUniformLoc, offsetX += moveModyfier, offsetY)
        break;
      case 'ArrowLeft':
        gl.uniform2f(offsetUniformLoc, offsetX -= moveModyfier, offsetY)
        break;
      case 'ArrowUp':
        gl.uniform2f(offsetUniformLoc, offsetX, offsetY += moveModyfier)
        break;
      case 'ArrowDown':
        gl.uniform2f(offsetUniformLoc, offsetX, offsetY -= moveModyfier)
        break;
      default:
        break;
    }
  }

  const sizeUniformLoc = gl.getUniformLocation(program, 'size')
  gl.uniform1f(sizeUniformLoc, 8.)

  const speedUniformLoc = gl.getUniformLocation(program, 'speed')
  gl.uniform1f(speedUniformLoc, 1024.0)

  const flashinessUniformLoc = gl.getUniformLocation(program, 'flashiness')
  gl.uniform1f(flashinessUniformLoc, 0.4)

  const zoomUniformLoc = gl.getUniformLocation(program, 'zoom')
  let zoom = 2
  gl.uniform1f(zoomUniformLoc, zoom)
  glCanvas.addEventListener('mousewheel',function(e) {
    if (e.deltaY < 0 && zoom + 1 < 100) {
      gl.uniform1f(zoomUniformLoc, zoom += .5)
    } else if (e.deltaY > 0 && zoom - 1 > 0) {
      gl.uniform1f(zoomUniformLoc, zoom -= .5)
    }

    return false
  }, false)

  const brightnessUniformLoc = gl.getUniformLocation(program, 'brightness')
  gl.uniform1f(brightnessUniformLoc, 3)

  const colorUniformLoc = gl.getUniformLocation(program, 'color')
  gl.uniform3f(colorUniformLoc, 1, .5, .2)

  const cycleUniformLoc = gl.getUniformLocation(program, 'cycle')
  let cycle = 1
  gl.uniform1f(cycleUniformLoc, cycle)

  function render(e) {
    gl.uniform1f(cycleUniformLoc, cycle += 1)
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.requestAnimationFrame(render)
  }

  window.requestAnimationFrame(render)
}
