const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { uploadFiles } = require('./cloudflare');

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 800,

        minWidth: 400,
        minHeight: 400,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    window.loadFile(path.join(__dirname, 'public', 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('upload-files', async (event, files) => {

        console.log("Received in main.js:");
        console.log(files);

        const result = await uploadFiles(files);

        console.log("Upload result:");
        console.log(result);

        return result;

        // return await uploadFiles(files);
    });
});
