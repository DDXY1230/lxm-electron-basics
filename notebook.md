1. `npm i electron -D`
2. package.json 中的 "start": "electron ." 表示要运行electron了
    "start": "nodemon --exec electron ." // 实时执行

3. 有时候客户打开一个窗口,并且拖动到习惯的位置,设置好合适的大小,完成任务后关闭,希望再次打开的时候也是这个状态
那么首先需要安装一个插件` npm i electron-win-state -S`