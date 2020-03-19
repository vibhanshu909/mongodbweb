const input = async message => {
  console.log(message)
  return new Promise((resolve, reject) => {
    process.stdin.on('data', data => resolve(data.toString()))
  })
}

;(async () => {
  const data = await input('enter some text: ')
  console.log('target', data)
  let charCount = data.split('').reduce((result, char) => {
    if (char in result) {
      result[char]++
    } else {
      result[char] = 1
    }
    return result
  }, {})
  charCount = Object.keys(charCount)
    .sort((a, b) => charCount[a] - charCount[b])
    .reduce((result, key) => {
      result[key] = charCount[key]
      return result
    }, {})
  let charTree = Object.keys(charCount).slice(0, 2)
  console.log('charCount', charCount)
  process.exit()
})()
