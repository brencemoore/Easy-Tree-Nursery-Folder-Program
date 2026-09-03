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
    document.getElementById('txtContainerXLSXFile').value = config.uploads.containerXLSX;
    document.getElementById('txtBnbXLSXFile').value = config.uploads.bnbXLSX;
    document.getElementById('txtContainerPDFFile').value = config.uploads.containerPDF;
    document.getElementById('txtBnbPDFFile').value = config.uploads.bnbPDF; 
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
            containerXLSX: document.getElementById('txtContainerXLSXFile').value,
            bnbXLSX: document.getElementById('txtBnbXLSXFile').value,
            containerPDF: document.getElementById('txtContainerPDFFile').value,
            bnbPDF: document.getElementById('txtBnbPDFFile').value,
        },
    };

    await window.api.saveConfig(config);

    // alert('Settings saved.');
    Swal.fire({
        icon: 'success',
        title: 'Settings Updated',
        text: 'Your settings have been saved successfully.',
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true
    });

    // Close modal after successful save
    const modalElement = document.getElementById('settingsModal');
    const modal = bootstrap.Modal.getInstance(modalElement);

    if (modal) {
        modal.hide();
    }
}
