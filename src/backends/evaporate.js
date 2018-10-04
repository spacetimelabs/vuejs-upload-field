import { Buffer } from 'buffer'
import Evaporate from 'evaporate'
import webcrypto from 'webcrypto'

function cryptoFunction (method, digest) {
  return function (data) {
    const buf = Buffer.from(data)
    return webcrypto.createHash(method).update(buf).digest(digest)
  }
}

export default function (options, config) {
  const fileInput = options.fileInput
  const progress = options.progress
  return new Promise(function (resolve, reject) {
    const evaporateConfig = Object.assign({
      cryptoMd5Method: cryptoFunction('md5', 'base64'),
      cryptoHexEncodedHash256: cryptoFunction('sha256', 'hex')
    }, config)
    Evaporate.create(evaporateConfig).then(function (evaporate) {
      evaporate.add({
        name: config.name,
        file: fileInput.files[0],
        progress: progress,
        complete: resolve
      })
    }, reject)
  })
}
