const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadConfig: () => ipcRenderer.invoke('load-config'),

    saveConfig: (config) => ipcRenderer.invoke('save-config', config),

    getPathForFile: (file) => {
        return webUtils.getPathForFile(file);
    },

    uploadFiles: (files) => {
        return ipcRenderer.invoke('upload-files', files);
    },

    onUpdateDownloaded: (callback) => {
        ipcRenderer.on('update-downloaded', (event, info) => {
            callback(info);
        });
    },

    installUpdate: () => {
        return ipcRenderer.invoke('install-update');
    },

    getAppVersion: () => {
        return ipcRenderer.invoke('get-app-version');
    },
});
