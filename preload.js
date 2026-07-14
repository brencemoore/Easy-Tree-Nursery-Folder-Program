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
});
