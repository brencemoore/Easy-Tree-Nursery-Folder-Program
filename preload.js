const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getPathForFile: (file) => {
        return webUtils.getPathForFile(file);
    },

    uploadFiles: (files) => {
        return ipcRenderer.invoke('upload-files', files);
    },
});
