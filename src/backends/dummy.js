export default (options, config) => {
  const { progress, fileInput } = options
  return new Promise((resolve, reject) => {
    if (fileInput.files.length > 0) {
      let dummyProgress = 0.0
      const intervalId = window.setInterval(() => {
        progress(dummyProgress)
        dummyProgress += 0.1

        if (dummyProgress >= 1.0) {
          window.clearInterval(intervalId)
          resolve({
            path: `s3://example/${fileInput.files[0].name}`
          })
        }
      }, 100)
    } else {
      resolve({
        path: null
      })
    }
  })
}
