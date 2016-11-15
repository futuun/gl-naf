import createCanvas from './createCanvas'
import attachButtons from './attachButtons'
import DrawGL from './DrawGL'
import AudioWrapper from './AudioWrapper'
import fragment from './glsl/fragment.glsl'
import vertex from './glsl/vertex.glsl'
import init from './init'

const url = 'spazzmatica_polka.mp3'
let fractal = new DrawGL(createCanvas(), vertex, fragment)
let sound = new AudioWrapper(url, 32)
attachButtons(sound)
init(fractal, sound)

function hardStart(element) {
  element.parentNode.removeChild(element)
}

if (module.hot) {
  module.hot.accept('./DrawGL', () => {
    const nextDrawGL = require('./DrawGL').default
    fractal = new nextDrawGL(createCanvas(), vertex, fragment)
  })

  module.hot.accept('./AudioWrapper', () => {
    const nextAudioWrapper = require('./AudioWrapper').default
    sound.pauseSound()
    sound = new nextAudioWrapper(url, 32)
  })

  module.hot.accept('./glsl/fragment.glsl', () => {
    const nextFragment = require('./glsl/fragment.glsl')
    hardStart(createCanvas())
    let fractal = new DrawGL(createCanvas(), vertex, nextFragment)
    init(fractal)
  })

  module.hot.accept('./glsl/vertex.glsl', () => {
    const nextVertex = require('./glsl/vertex.glsl')
    hardStart(createCanvas())
    let fractal = new DrawGL(createCanvas(), nextVertex, fragment)
    init(fractal)
  })

  module.hot.accept('./createCanvas', () => {
    const nextCreateCanvas = require('./createCanvas').default
    hardStart(createCanvas())
    fractal = new DrawGL(nextCreateCanvas(), vertex, fragment)
  })

  module.hot.accept('./init', () => {
    const nextInit = require('./init').default
    nextInit(fractal)
  })
}
