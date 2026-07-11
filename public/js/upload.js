// ======================================
// File Upload Handler
// Weekly File Uploader
// ======================================

const uploadConfigs = [
    {
        inputId: 'weeklyReport',
        selectedFileId: 'weeklySelectedFile',
        progressBarId: 'weeklyProgressBar',
    },
    {
        inputId: 'BNBReport',
        selectedFileId: 'BNBSelectedFile',
        progressBarId: 'BNBProgressBar',
    },
];

// Initialize upload cards
document.addEventListener('DOMContentLoaded', () => {
    uploadConfigs.forEach((config) => {
        setupFileUpload(config);
    });
});

// ======================================
// Setup each upload input
// ======================================

function setupFileUpload(config) {
    const input = document.getElementById(config.inputId);

    const selectedFileText = document.getElementById(config.selectedFileId);

    const progressBar = document.getElementById(config.progressBarId);

    // Browse button file selection
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            const file = input.files[0];

            displaySelectedFile(file, selectedFileText, config.progressBarId);

            resetProgress(progressBar);
        }
    });

    // Enable drag and drop
    const card = input.closest('.card');

    setupDragAndDrop(card, input, selectedFileText, progressBar);
}

// ======================================
// Drag and Drop
// ======================================

function setupDragAndDrop(card, input, selectedFileText, progressBar) {
    card.addEventListener('dragover', (event) => {
        event.preventDefault();

        card.classList.add('dragover');
    });

    card.addEventListener('dragleave', () => {
        card.classList.remove('dragover');
    });

    card.addEventListener('drop', (event) => {
        event.preventDefault();

        card.classList.remove('dragover');

        const file = event.dataTransfer.files[0];

        if (!file) {
            return;
        }

        // Assign dropped file to input
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(file);

        input.files = dataTransfer.files;

        displaySelectedFile(file, selectedFileText, config.progressBarId);

        resetProgress(progressBar);
    });
}

// ======================================
// Display Selected File
// ======================================

function displaySelectedFile(file, element, progressBarId) {
    element.textContent = `Selected: ${file.name}`;
    updateFileSelectedProgress(progressBarId);
}

// ======================================
// Reset Progress Bar
// ======================================

function resetProgress(progressBar) {
    progressBar.style.width = '0%';

    progressBar.textContent = '';

    progressBar.classList.remove('bg-success');
    progressBar.classList.add('bg-primary');
}

// ======================================
// Update Progress Bar
// Used later for Cloudflare upload
// ======================================

function updateProgress(progressBarId, percent) {
    const progressBar = document.getElementById(progressBarId);

    progressBar.style.width = `${percent}%`;

    progressBar.textContent = `${percent}%`;
}

function updateFileSelectedProgress(progressBarId) {
    const progressBar = document.getElementById(progressBarId);

    progressBar.style.width = '100%';
    progressBar.textContent = 'Ready';

    progressBar.classList.remove('bg-primary');
    progressBar.classList.add('bg-success');
}
