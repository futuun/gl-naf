/**
 * Small wrapper for simplifying frequent things
 *
 * @export
 * @class DrawGL
 */
export default class DrawGL {
  /**
   * Creates an instance of DrawGL.
   *
   * @param {!Element} canvas The canvas element.
   * @param {string} vertex The GLSL string source code of vertex shader
   * @param {string} fragment The GLSL string source code of fragment shader
   * @memberOf DrawGL
   */
  constructor(canvas, vertex, fragment) {
    this.ctx = this.getWebGLRenderingContext(canvas)
    this.ctx.clearColor(0.0, 0.0, 0.0, 1.0)
    this.ctx.enable(this.ctx.DEPTH_TEST)
    this.ctx.depthFunc(this.ctx.LEQUAL)
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT)
    this.program = this.createProgram(
      this.compileShader(vertex, this.ctx.VERTEX_SHADER),
      this.compileShader(fragment, this.ctx.FRAGMENT_SHADER),
    )
    this.ctx.useProgram(this.program)
    this.uniform = {}

    this.derivatives = this.ctx.getExtension('OES_standard_derivatives')
    if (this.derivatives) {
      this.ctx.hint(
        this.derivatives.FRAGMENT_SHADER_DERIVATIVE_HINT_OES,
        this.ctx.NICEST,
      )
    }

    this.positionAttributeLocation = this.ctx.getAttribLocation(this.program, 'a_position')
    this.ctx.bindAttribLocation(this.program, this.positionAttributeLocation , 'a_position')
    this.squareVerticesBuffer = this.ctx.createBuffer()
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.squareVerticesBuffer)
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Int8Array([1, -3, -3, 1, 1, 1]), this.ctx.DYNAMIC_DRAW)
    this.ctx.enableVertexAttribArray(this.positionAttributeLocation)
    this.ctx.vertexAttribPointer(this.positionAttributeLocation, 2, this.ctx.BYTE, false, 0, 0)
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null)
  }

  /**
   * Returns rendering context.
   *
   * @param {!Element} canvas The canvas element.
   * @return {!WebGLRenderingContext} The WebGL context.
   * @memberOf DrawGL
   */
  getWebGLRenderingContext(canvas) {
    let gl = null

    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    } catch(e) {
      alert('Couldn\'t start WebGL. There\'s help for you at get.webgl.org/troubleshooting')
      throw new Error('Unable to initialize WebGL. Your browser may not support it.')
    }

    return gl
  }

  /**
   * Creates and compiles a shader
   *
   * @param {string} shaderSource The GLSL string source code for the shader
   * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER
   * @return {!WebGLShader} The shader
   * @memberOf DrawGL
   */
  compileShader(shaderSource, shaderType) {
    const shader = this.ctx.createShader(shaderType)

    this.ctx.shaderSource(shader, shaderSource)
    this.ctx.compileShader(shader)

    // Check if it compiled
    const success = this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)
    if (!success) {
      // something went wrong with the link
      throw new Error('Shader compile error: ' + this.ctx.getShaderInfoLog(shader))
    }

    return shader
  }

  /**
   * Creates a program from 2 shaders
   *
   * @param {!WebGLShader} vertex A vertex shader
   * @param {!WebGLShader} fragment A fragment shader
   * @return {!WebGLProgram} A program.
   * @memberOf DrawGL
   */
  createProgram(vertex, fragment) {
    const program = this.ctx.createProgram()

    this.ctx.attachShader(program, vertex)
    this.ctx.attachShader(program, fragment)
    this.ctx.linkProgram(program)

    const success = this.ctx.getProgramParameter(program, this.ctx.LINK_STATUS)
    if (!success) {
      throw new Error('Program filed to link: ' + this.ctx.getProgramInfoLog(program))
    }

    this.ctx.detachShader(program, fragment)
    this.ctx.detachShader(program, vertex)
    this.ctx.deleteShader(fragment)
    this.ctx.deleteShader(vertex)

    return program
  }

  /**
   * Sets the value of given uniform
   *
   * @param {!string} name
   * @param {!string} type
   * @param {!Array<number>} value
   * @memberOf DrawGL
   */
  setUniform(name, type, value) {
    if (!name) {
      throw new Error('Name is necessary to get uniform location')
    } else if (!/^((Matrix[2-4]fv)|([1-4](f|i)v?))$/.test(type)) {
      throw new Error(`Type: ${type} doesn't exist! It must be either `
        + 'https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform or '
        + 'https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniformMatrix'
        + ' with ommited "uniform" e.g.: 2iv, Matrix4fv'
      )
    }

    if (!this.uniform.hasOwnProperty(name)) {
      this.uniform[name] = this.ctx.getUniformLocation(this.program, name)
    }

    if (type.includes('Matrix')) {
      this.ctx[`uniform${type}`](this.uniform[name], false, value)
    } else if (type.slice(-1) === 'v') {
      this.ctx[`uniform${type}`](this.uniform[name], value)
    } else {
      this.ctx[`uniform${type}`](this.uniform[name], ...value)
    }
  }

  /**
   * Returns width of current canvas
   *
   * @returns {number} width
   * @memberOf DrawGL
   */
  getWidth() {
    return this.ctx.canvas.offsetWidth
  }

  /**
   * Returns height of current canvas
   *
   * @returns {number} height
   * @memberOf DrawGL
   */
  getHeight() {
    return this.ctx.canvas.offsetHeight
  }

  /**
   * Draws context on the screen
   * @memberOf DrawGL
   */
  render() {
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3)
  }
}
