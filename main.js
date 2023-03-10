const { app, BrowserWindow, ipcMain,dialog,globalShortcut,Menu,clipboard,desktopCapturer } = require("electron");
const path = require("path");
const WinState = require('electron-win-state').default
const createTray = require('./tray.js')
let mainMenu = require('./mainMenu') 
let contextMenu = Menu.buildFromTemplate([
  {label: 'Item 1'},
  {
    role: 'editMenu'
  }
])

const winState = new WinState({
  defaultWidth: 800,
  defaultHeight: 600,
})
// BrowserWindow构建一个浏览器窗口
const createWindow = () => {
  const win = new BrowserWindow({
    x: 100,// 窗口定位
    y: 100,// 窗口定位
    width: 1000,
    height: 800,
    ...winState.winOptions,// 自定义窗口的位置
    // frame: false, // 上面可以拖动的栏被隐藏了,拖不动了
    show: false, // 窗口不打开
    backgroundColor: '#6435c9',// 窗口背景颜色
    // titleBarStyle: 'hidden',
    webPreferences: {
      // 这两个选项太危险了,可以窥视用户的本地文件
      // nodeIntegration: true, // 和下面的隔离一起配置, 这样才能在renderer的app.js中调用node模块
      // contextIsolation: false // 不隔离,这样才能在浏览器中调用commonjs规范的node
      preload: path.resolve(__dirname, "./preload.js"),
    },
  });
  createTray(app,win)
  winState.manage(win)

  // win.loadURL('http://jx.1000phone.net')
  // win.loadURL('http://qfedu.com')
  win.loadFile("index.html");
  // win.webContents.openDevTools(); // 临时在浏览器打开一个开发者工具
  const wc = win.webContents
  wc.openDevTools() // 临时在浏览器打开一个开发者工具
  wc.on('did-finish-load', () => {// 用来监测主进程是否加载完毕
    console.log('完全加载完毕')
  })
  wc.on('dom-ready', () => {
    console.log('dom加载完毕')
  })
  wc.on('context-menu', (e, params) => {
    console.log('你点击有鼠标右键',params)

    // wc.executeJavaScript(`alert('您点击了鼠标右键呀,这是注入的javascript代码'+'${params.selectionText}')`)
    
    // dialog.showOpenDialog({
    //   buttonLabel: 'ok',// 改变选择的文案
    //   defaultPath: app.getPath('desktop'),// 默认窗口打开在桌面
    //   properties: ['multiSelections', 'createDirectory', 'openFile', 'openDirectory']
    //   //'multiSelections'是否可以多选文件, 'createDirectory'是否可以创建文件夹, 'openFile'是否可以打开文件, 'openDirectory'是否可以打开文件夹
    // }).then(result => {
    //   console.log('打开了dialog', result.filePaths)
    // })

    // dialog.showSaveDialog({}).then(result => {// 可以用来存图片等等
    //   console.log(result.filePath)
    // })

    // const answers = ['Yes', 'No', 'Maybe']
    // dialog.showMessageBox({
    //   title: 'Message Box',
    //   message: 'Please select an option',
    //   detail: 'Message details.',
    //   buttons: answers
    // }).then(({response}) => {
    //   console.log(`User selected: ${answers[response]}`)
    // })
    contextMenu.popup() // 点击右键上下文菜单
  })

  win.on('ready-to-show', () => {
    // 用户打开页面东西加载完成,比较优雅
    win.show()
  })
  // process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true' // 暂时关闭安全警告 所有的警告都关闭,比较鲁莽

  // 快捷键
  // globalShortcut.register('G', () => {

  // })
  globalShortcut.register('CommandOrControl+Y', () => {
    console.log('gg')
    globalShortcut.unregister('CommandOrControl+Y') // 注销快捷键
  })

  Menu.setApplicationMenu(mainMenu((param)=>{
    console.log('收到点击传过来的信息啦', param)
  },123,56))
  // 可以实例化第二个窗口
  // const win2 = new BrowserWindow({
  //   width: 600,
  //   height: 400,
  //   parent: win, // 以上面的第一个窗口在为父窗口 当拖拉第一个窗口的时候,这个子窗口也会跟着动
  //   modal: true // 是一个模态窗口了
  // })
  // win2.loadURL('https://www.baidu.com')

  
};

ipcMain.handle("send-event", (event, msg) => {
  console.log("主进程send-event===", msg);
  console.log('clipboard', clipboard)
  return msg;
});
ipcMain.handle("send-clipboard", (event, msg) => {
  clipboard.writeText(msg)
  return msg;
});
ipcMain.handle("send-backClipboard", (event) => {
  const content = clipboard.readText()
  return content;
});
ipcMain.handle("desktopCapturer", (event) => {
  return desktopCapturer.getSources({
    types: ['window','screen']
  }).then(async (sources) => {
    // console.log('desktopCapturer',sources)
    return sources
  })
});
// 窗口就绪 返回的是一个promise
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    // 当激活的时候,所有窗口都关闭了,我再创建一个
    if (BrowserWindow.getAllWindows.length === 0) {
      createWindow();
    }
  });
  // console.log('1000',app.getPath('desktop'))
  // console.log('1001',app.getPath('music'))
  // console.log('1002',app.getPath('temp'))
  // console.log('1003',app.getPath('userData'))
}); // 打开一个原生窗口
app.on("window-all-closed", () => {
  // 当所有的窗口关闭
  console.log("所有窗口关闭"); // 这个是在主进程里面打印的,也就是控制terminal
  if (process.platform !== "darwin") {
    //darwin这个名字就是mac系统的名字 当前这个平台是mac 或者说 ios平台
    // 因为mac系统左上角叉叉退出之后还会在dock里面存在,只有执行了quit之后才会彻底退出
    app.quit();
  }
});
app.on("before-quit", () => {
  // 窗口关闭之前做一些事情
});
app.on("browser-window-blur", () => {
  // 窗口失去焦点时做一些事情
  console.log("browser-window-blur");
  // setTimeout(() => {
  //   app.quit(); //关闭窗口
  // }, 3000);
});
app.on("browser-window-focus", () => {
  // 窗口获取焦点的时候
  console.log("browser-window-focus");
});
