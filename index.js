const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { uploadFiles } = require('./cloudflare');

const { autoUpdater } = require('electron-updater');

const { loadConfig, saveConfig } = require('./configManager');

let window;

function createWindow() {
    window = new BrowserWindow({
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

// Function checks for updates
function setupAutoUpdater() {
    autoUpdater.on('checking-for-update', () => {
        console.log('Checking for update...');
    });

    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info.version);
    });

    autoUpdater.on('update-not-available', (info) => {
        console.log('No update available.');
        console.log('Current version:', app.getVersion());
    });

    autoUpdater.on('error', (error) => {
        console.error('Update error:', error);
    });

    autoUpdater.on('download-progress', (progress) => {
        console.log(`Download progress: ${progress.percent.toFixed(1)}%`);
    });

    autoUpdater.on('update-downloaded', (info) => {
        console.log('Update downloaded:', info.version);

        if (window) {
            window.webContents.send('update-downloaded', {
                version: info.version
            });
        }
    });

    autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {

    createWindow();

    // Checks update if running app, skips for development mode
    if (!app.isPackaged) {
        console.log('Development mode: skipping auto update check.');
    } else {
        setupAutoUpdater();
    }

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

    // Installs update
    ipcMain.handle('install-update', () => {
        console.log('Installing update...');

        autoUpdater.quitAndInstall();
    });

    // Gets app version
    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });
});


