const {app, BrowserWindow} = require('electron');
const Core = require('./core');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 500,
        icon: "./icon.jpg",
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true
        }
    });

    const uA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/71.0.3578.80 Chrome/71.0.3578.80 Safari/537.36";
    win.loadURL("http://pl.grepolis.com", {userAgent: uA});

    win.webContents.once('dom-ready', () => Core.start(win));
    win.webContents.on('did-navigate', () => Core.onPageNavigate(win));

    // Emitted when the window is closed.
    win.on('closed', () => win = null);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')//MacOS fix
        app.quit();
});

app.on('activate', () => {
    if(win === null)//MacOS fix
        createWindow();
});