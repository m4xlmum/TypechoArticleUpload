const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
    const win = new BrowserWindow({
        width: 880,
        height: 660,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false  // 为了使用jquery，禁用nodejs
        }
    })
    win.loadFile('index.html')
    win.webContents.openDevTools()  // 打开开发者工具
}

// 如果没有窗口打开则打开一个窗口 (macOS)
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// 关闭所有窗口时退出应用 (Windows & Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
