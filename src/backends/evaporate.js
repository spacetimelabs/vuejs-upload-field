import { Buffer } from 'buffer'
import Evaporate from 'evaporate'
import webcrypto from 'webcrypto'

const cryptoFunction = (method, digest) => {
  return (data) => {
    const buf = Buffer.from(data)
    return webcrypto.createHash(method).update(buf).digest(digest)
  }
}

export default (options, config) => {
  const { fileInput, progress } = options
  return new Promise((resolve, reject) => {
    Evaporate.create({
      ...config,
      cryptoMd5Method: cryptoFunction('md5', 'base64'),
      cryptoHexEncodedHash256: cryptoFunction('sha256', 'hex')
    }).then(evaporate => evaporate.add({
      name: config.name,
      file: fileInput.files[0],
      progress: progress,
      complete: resolve
    }), reject)
  })
}
