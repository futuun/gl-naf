/**
 * Creates canvas inside body element.
 *
 * @return {!Element} A canvas.
 */
function createCanvas () {
  const canvasEl = document.createElement('canvas')
  canvasEl.id = 'glcanvas'
  canvasEl.style.display = 'block'
  canvasEl.style.width = (canvasEl.width = window.innerWidth) + 'px'
  canvasEl.style.height = (canvasEl.height = window.innerHeight) + 'px'

  window.onresize = function(e) {
    canvasEl.style.width = (canvasEl.width = e.target.innerWidth) + 'px'
    canvasEl.style.height = (canvasEl.height = e.target.innerHeight) + 'px'
  }

  return document.body.appendChild(canvasEl)
}

/**
 * returns rendering context.
 *
 * @param {!Element} canvas the canvas element.
 * @return {!WebGLRenderingContext} The WebGL context.
 */
function getWebGLRenderingContext(canvas) {
  let gl = null
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  } catch(e) {
    console.error("Unable to initialize WebGL. Your browser may not support it.")
    gl = null
  }

  return gl
}

/**
 *******************************************************************
 * http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 *******************************************************************
 *
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram()

  // attach the shaders.
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // link the program.
  gl.linkProgram(program)

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    // something went wrong with the link
    throw ("program filed to link:" + gl.getProgramInfoLog (program))
  }

  return program
}

/**
 *******************************************************************
 * http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
 *******************************************************************
 *
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType)

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource)

  // Compile the shader
  gl.compileShader(shader)

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    // something went wrong with the link
    throw("compile error: " + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  return shader
}

export {
  createCanvas,
  getWebGLRenderingContext,
  createProgram,
  compileShader,
}
