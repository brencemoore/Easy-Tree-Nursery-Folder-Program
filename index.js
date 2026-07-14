const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { uploadFiles } = require('./cloudflare');

const { loadConfig, saveConfig } = require('./configManager');

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 800,

        minWidth: 400,
        minHeight: 400,

        icon: path.join(__dirname, 'assets', 'simple_logo', 'favicon.ico'),

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

    // Loads config.hs to settings
    ipcMain.handle('load-config', () => {
        return loadConfig();
    });

    // Saves settings to config.js
    ipcMain.handle('save-config', (event, config) => {
        saveConfig(config);

        return true;
    });

    // Gets files to upload
    ipcMain.handle('upload-files', async (event, files) => {
        console.log('Received in main.js:');
        console.log(files);

        const result = await uploadFiles(files);

        console.log('Upload result:');
        console.log(result);

        return result;

        // return await uploadFiles(files);
    });
});
