const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            contextIsolation: false, // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true,
        }
    });

    win.loadFile('src/home.html');
    win.webContents.openDevTools();
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
        console.log(BrowserWindow.getAllWindows());
    }
});

ipcMain.on('main', (event, data) => {
    if (data.to === 'main') {
        console.log(data);
    } else {
        sendData(data);
    }
})

function sendData(data) {
    const wins = BrowserWindow.getAllWindows().filter(x => x.isVisible());
    for (w of wins) {
        w.webContents.send(data.to, data);
    }
}
