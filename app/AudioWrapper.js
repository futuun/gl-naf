import xhr from './xhr'

/**
 * Small wrapper for simplifying frequent things
 *
 * @export
 * @class AudioWrapper
 */
export default class AudioWrapper {
  /**
   * Creates an instance of AudioWrapper.
   *
   * @param {!string} url The link to audio file
   * @param {number} fftSize 
   * @memberOf AudioWrapper
   */
  constructor(url, fftSize = 256) {
    this.pausedAt = 0
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    this.scriptProcessor = this.audioCtx.createScriptProcessor(4096, 1, 1)
    this.scriptProcessor.connect(this.audioCtx.destination)

    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.3
    this.analyser.fftSize = fftSize
    this.analyser.connect(this.scriptProcessor)

    this.loadSound(url)
  }

  /**
   * Loads sound file & decodes it into buffer
   *
   * @param {!string} url
   * @memberOf AudioWrapper
   */
  loadSound(url) {
    xhr('GET', url, null, { responseType: 'arraybuffer' })
      .then(res => this.audioCtx.decodeAudioData(res))
      .then(buffer => { this.buffer = buffer })
      .catch(error => console.error(error))
  }

  /**
   * Toggles playback
   *
   * @returns {!boolean} true if music plays
   * @memberOf AudioWrapper
   */
  toggleSound() {
    if (this.buffer) {
      if (!this.bufferSource) {
        this.playSound(this.pausedAt)
        this.pausedAt = 0
        return true
      }

      this.pauseSound()
    }
    return false
  }

  /**
   * Starts playback at given position
   *
   * @param {!number} begin Time for place to start
   * @memberOf AudioWrapper
   */
  playSound(begin = 0) {
    this.bufferSource = this.audioCtx.createBufferSource()
    this.bufferSource.connect(this.analyser)
    this.bufferSource.connect(this.audioCtx.destination)
    this.bufferSource.buffer = this.buffer
    this.bufferSource.start(0, begin)
    this.bufferSource.loop = true
  }

  /**
   * Stops playback and saves current position
   *
   * @memberOf AudioWrapper
   */
  pauseSound() {
    this.pausedAt = this.audioCtx.currentTime
    this.bufferSource.disconnect()
    this.bufferSource.stop()
    this.bufferSource = null
  }
}
