/**
 * Returns promise for request
 *
 * @export
 * @param {!string} method GET, POST, PUT...
 * @param {!string} url Just url..
 * @param {object} data Optional data object
 * @param {object} custObj Optional object that will be merged with xhr object
 * @returns Promise
 */
export default function xhr(method, url, data, custObj = {}) {
  const promise = new Promise((resolve, reject) => {
    const xhr = Object.assign(new XMLHttpRequest(), custObj)

    xhr.onload = function onload() {
      if (this.status >= 200 && this.status < 300 || this.status === 304) {
        resolve(this.response)
      } else {
        reject(this.status)
      }
    }
    xhr.onerror = () => reject(this.status)
    xhr.open(method, url, true)

    if (data) xhr.send(JSON.stringify(data))
    else xhr.send()
  })

  return promise
}
