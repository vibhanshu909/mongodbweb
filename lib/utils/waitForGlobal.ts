export const waitForGlobal = (
  key: string,
  callback: () => void,
  interval: number = 100,
) => {
  if (key in window) {
    callback()
  } else {
    setTimeout(async () => {
      waitForGlobal(key, callback, interval)
    }, interval)
  }
}
