// const fs = require('fs')
// console.log(fs)
// fs.writeFile('/Users/mac/Desktop/test.txt', 'abc', () => {
//   console.log('done.')
// })// 在桌面上写一个文件
console.log('这里是app',window.myApi.platform)
document.querySelector('#btn1').addEventListener('click', () => {
  console.log(199)
  window.myApi.handleSend()
})
document.querySelector('#btn2').addEventListener('click', () => {
  console.log(299)
  window.myApi.copy()
})
document.querySelector('#btn3').addEventListener('click', () => {
  console.log(399)
  window.myApi.show()
})
document.querySelector('#btn4').addEventListener('click', async () => {
  let result = await window.myApi.capture()
  console.log(result)
  document.querySelector('#img-4').src = result
})
document.querySelector('#btn5').addEventListener('click', async () => {
  let result = await window.myApi.testnativeImage()
})