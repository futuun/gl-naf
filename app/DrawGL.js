import {
  createProgram,
  compileShader,
  createCanvas,
  getWebGLRenderingContext,
} from './webGLUtils'

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
   * @param {string} vertex
   * @param {string} fragment
   *
   * @memberOf DrawGL
   */
  constructor(vertex, fragment) {
    this.ctx = getWebGLRenderingContext(createCanvas())
    this.vertexShader = compileShader(this.ctx, vertex, this.ctx.VERTEX_SHADER)
    this.fragmentShader = compileShader(this.ctx, fragment, this.ctx.FRAGMENT_SHADER)
    this.program = createProgram(this.ctx, this.vertexShader, this.fragmentShader)
    this.ctx.useProgram(this.program)
    this.uniform = {}

    this.positionAttributeLocation = this.ctx.getAttribLocation(this.program, 'a_position')
    this.buffer = this.ctx.createBuffer()
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, this.buffer)
    this.ctx.bufferData(this.ctx.ARRAY_BUFFER, new Float32Array([1, -3, -3, 1, 1, 1]), this.ctx.STATIC_DRAW)
    this.ctx.enableVertexAttribArray(this.positionAttributeLocation)
    this.ctx.vertexAttribPointer(this.positionAttributeLocation, 2, this.ctx.FLOAT, false, 0, 0)
  }

  /**
   * Sets the value of given uniform
   *
   * @param {string} name
   * @param {string} type
   * @param {number[]} value
   *
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
   *
   * @memberOf DrawGL
   */
  getWidth() {
    return this.ctx.canvas.width
  }

  /**
   * Returns height of current canvas
   *
   * @returns {number} height
   *
   * @memberOf DrawGL
   */
  getHeight() {
    return this.ctx.canvas.height
  }

  /**
   * Draws context on the screen
   *
   * @memberOf DrawGL
   */
  render() {
    this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3);
  }
}
