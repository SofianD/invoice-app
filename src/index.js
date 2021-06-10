const {BrowserWindow} = require('electron').remote;

window.onload = () => {
    document.title = 'home';
    let elm = document.getElementsByClassName('container')[0];
    elm.style.backgroundColor = 'whitesmoke';
    elm.style.margin = '0';
    let win = BrowserWindow.getAllWindows()[0];
    win.setSize(400, elm.offsetHeight);
    win.setMinimumSize(400, elm.offsetHeight);
    win.setMaximumSize(400, elm.offsetHeight);
    win.maximize();
    win.center()
}
const router = [
    {
        name: 'new-invoice',
        link: 'src/components/create_invoice/index.html'
    },
    {
        name: 'clients',
        link: 'src/components/clients/index.html'
    },
    {
        name: 'params',
        link: 'src/components/params/index.html'
    }
];
function createWindow (name) {
    const page = router.filter(x => x.name === name)[0];
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        transparent: false,
        autoHideMenuBar: true,
        minHeight:800,
        minWidth: 600,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            contextIsolation: false, // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true,
        }
    });

    win.loadFile(page.link);
    win.maximize();
    // win.webContents.openDevTools();
};

function closeApp(ev) {
    const wins = BrowserWindow.getAllWindows();
    for (win of wins) {
        win.destroy();
    }
}
