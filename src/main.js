const { app, BrowserWindow, ipcMain } = require('electron');
let allWin = [];
const isDevEnv = process.env.NODE_ENV === undefined;
function createWindow () {
    const win = new BrowserWindow({
        width: 400,
        height: 518,
        frame: false,
        transparent: true,
        autoHideMenuBar: true,
        show: false,
        minWidth: 400,
        minHeight:518,
        maxWidth: 400,
        maxHeight: 518,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            contextIsolation: false, // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true,
        }
    });
    win.loadFile('src/home.html');
    // win.webContents.openDevTools();

    win.once('ready-to-show', () => {
        win.show()
    })
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
    }
});

ipcMain.on('main', (event, msg) => {
    if (msg.to === 'main') {
    } else {
        sendData(msg);
    }
})

function sendData(data) {
    const wins = BrowserWindow.getAllWindows().filter(x => x.isVisible());
    const l = wins.length;
    for (let i = 0; i < l; i++) {
        wins[i].webContents.send(data.to, data);
    }
}



ipcMain.on('new-window', (event, msg) => {
    if (allWin.filter(page => page.name === msg).length === 0) {
        const wins = BrowserWindow.getAllWindows().filter(x => x.webContents.getTitle() === msg)[0];
        allWin.push({
            name: msg,
            window: wins
        });
    } else {
        event.sender.destroy();
    }
})

ipcMain.on('close-window', (event, msg) => {
    allWin = allWin.filter(page => page.name !== msg.name);
    const l = msg.childs.length;
    for (let i = 0; i < l; i++) {
        const current = allWin.filter(page => page.name === msg.childs[i]);
        if (current.length === 1) {
            current[0].window.destroy();
            allWin = allWin.filter(page => page.name !== msg.childs[i]);
        }
    }
})

console.log('is Dev Env? ', isDevEnv);
