// ======================================
// Settings
// ======================================

document.addEventListener('DOMContentLoaded', () => {
    document
        .getElementById('settingsModal')
        .addEventListener('shown.bs.modal', loadSettings);

    document
        .getElementById('btnSaveSettings')
        .addEventListener('click', saveSettings);
});

// ==============================
// Load settings to frontend
// ==============================

async function loadSettings() {
    const config = await window.api.loadConfig();

    document.getElementById('txtAccessKey').value = config.accessKeyId;
    document.getElementById('txtSecretKey').value = config.secretAccessKey;
    document.getElementById('txtBucket').value = config.bucketName;
    document.getElementById('txtEndpoint').value = config.urlEndpoint;
    document.getElementById('txtOverallFile').value = config.uploads.overall;
    document.getElementById('txtBNBFile').value = config.uploads.bnb;
}

// ================================
// Save settings to config.js
// ===============================

async function saveSettings() {
    let config = {
        accessKeyId: document.getElementById('txtAccessKey').value,
        secretAccessKey: document.getElementById('txtSecretKey').value,
        bucketName: document.getElementById('txtBucket').value,
        urlEndpoint: document.getElementById('txtEndpoint').value,
        uploads: {
            overall: document.getElementById('txtOverallFile').value,
            bnb: document.getElementById('txtBNBFile').value,
        },
    };

    await window.api.saveConfig(config);

    alert('Settings saved.');
}
