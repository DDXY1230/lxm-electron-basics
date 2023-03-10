// preload.js
// const path = require('path')
// console.log(path)
// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
// console.log(process.platform)
const {contextBridge,ipcRenderer,nativeImage} = require('electron')
const handleSend = async () => {
  let fallback = await ipcRenderer.invoke('send-event', 'hhhhh哈哈哈哈哈')
  console.log('主进程返回的fallback', fallback)
}
const copy = async () => {
  let fallback = await ipcRenderer.invoke('send-clipboard', '粘贴的内容')
  console.log('复制',fallback)
}
const show = async () => {
   let fallback = await ipcRenderer.invoke('send-backClipboard')
  console.log('粘贴',fallback)
}
const capture = async () => {// 做抓取网页缩略图的实现方式
  let sources = await ipcRenderer.invoke('desktopCapturer')
  console.log('渲染进程的desktopCapturer',sources)
  for(const source of sources){
    if(source.name == 'Document'){
      console.log(source)
      let str = source.thumbnail.crop({x: 0,y: 30,width: 1200,height: 1170})
      console.log('str', str)
     const imgSrc = str.toDataURL()
     return imgSrc
    }
  }

}
const testnativeImage = () => {
  const image = nativeImage.createFromPath('./icon@2x.png')
  console.log('image',image.getSize())
}
contextBridge.exposeInMainWorld('myApi', {
  platform: process.platform,
  handleSend,
  copy,
  show,
  capture,
  testnativeImage
})
window.addEventListener('DOMContentLoaded', () => {
  console.log(100000)
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})