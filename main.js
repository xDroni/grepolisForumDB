const {app, BrowserWindow} = require('electron');
const Utils = require('./utils.js');

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

    win.webContents.once('dom-ready', async () => {
        let login = Utils.prompt('login'),
            password = Utils.prompt('password');

        await Utils.executeJS(win, () => {
            document.getElementById("login_userid").focus();
        });
        await Utils.wait(100);
        await Utils.sendKeys(win, login, 20);

        await Utils.executeJS(win, () => {
            document.getElementById("login_password").focus();
        });
        await Utils.wait(100);
        await Utils.sendKeys(win, password, 20);
        
        await Utils.executeJS(win, () => {
            document.getElementById("login_Login").click();
        });

        /*var test = await Utils.executeJS(win, () => {
            return document.querySelector('#cookie-notice > div > p').innerHTML;
        });
        Utils.saveFile(__dirname + '/test.txt', test.replace(/\s{2,}/gi, ''));*/
    });

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.