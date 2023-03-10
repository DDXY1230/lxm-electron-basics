const { Tray,Menu } = require('electron')
function createTray(app, win) {
  const tray = new Tray('icon.png')
  tray.setToolTip('我的应用')
  tray.on('click', (e) => {
    if(e.shiftKey) {// 按住shift键单击 关闭
      app.quit()
    }else {
      // 单纯单击 显示隐藏 窗口
      // win.isVisible() ? win.hide() : win.show()
    }
  })
  tray.setContextMenu(Menu.buildFromTemplate([
    {label: 'menu-1'},
    {label: 'menu-2'},
    {label: 'menu-3'},
  ]))
}
module.exports = createTray
