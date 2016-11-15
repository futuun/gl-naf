/**
 * Generate color based on given byte frequency array
 *
 * @param {Uint8Array} byteFrequency
 * @returns Array of 3 elements (r, g, b)
 */
export default function generateColor(byteFrequency) {
  const iterations = Math.floor(byteFrequency.length / 4)
  let r = 0
  let g = 0
  let b = 0

  for (var i = 0; i < iterations; i++) {
    r += byteFrequency[i]
    g += byteFrequency[i + iterations]
    b += byteFrequency[i + iterations + iterations]
  }

  return [
    r / iterations / 255,
    g / iterations / 255,
    b / iterations / 255,
  ]
}
