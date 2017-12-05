export default (options, config) => {
  const { progress } = options
  return new Promise((resolve, reject) => {
    let dummyProgress = 0.0
    const intervalId = window.setInterval(() => {
      progress(dummyProgress)
      dummyProgress += 0.1

      if (dummyProgress >= 1.0) {
        window.clearInterval(intervalId)
        resolve()
      }
    }, 100)
  })
}
