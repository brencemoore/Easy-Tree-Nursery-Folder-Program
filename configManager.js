// ======================================
// Config Manager
// ======================================

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

// Used in config.json
const defaultConfig = {
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    urlEndpoint: '',

    uploads: {
        overall: '',
        bnb: '',
    },
};

// -------------------------------
// Load Config
// -------------------------------

function loadConfig() {
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
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

    console.log('Saved config.json');
}

module.exports = { loadConfig, saveConfig };
