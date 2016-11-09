import {
  createCanvas,
  getWebGLRenderingContext
} from './webGLUtils'
import init from './init'

const renderingContext = getWebGLRenderingContext(createCanvas())

init(renderingContext)

if (module.hot) {
  module.hot.accept('./init', () => {
    const nextFractal = require('./init').default
    nextFractal(renderingContext)
  })
}
