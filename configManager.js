// ======================================
// Config Manager
// ======================================

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// const configPath = path.join(__dirname, 'config.json');

// Used in config.json
const defaultConfig = {
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    urlEndpoint: '',

    uploads: {
        containerXLSX: '',
        bnbXLSX: '',
        containerPDF: '',
        bnbPDF: ''
    },
};

function getConfigPath() {
    return path.join(app.getPath('userData'), 'config.json');
}

// -------------------------------
// Load Config
// -------------------------------

function loadConfig() {
    const configPath = getConfigPath();
    const configDir = app.getPath('userData');

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }

    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4));

        console.log('Created config.json');
    }

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// -------------------------------
// Save Config
// -------------------------------

function saveConfig(config) {
    const configPath = getConfigPath();

    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

    console.log('Saved config.json');
}

module.exports = { loadConfig, saveConfig };
