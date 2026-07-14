// ======================================
// File Upload Handler
// Weekly File Uploader
// ======================================

const uploadConfigs = [
    {
        inputId: 'weeklyReport',
        selectedFileId: 'weeklySelectedFile',
        progressBarId: 'weeklyProgressBar',
        removeButtonId: 'weeklyRemoveFile',
    },
    {
        inputId: 'BNBReport',
        selectedFileId: 'BNBSelectedFile',
        progressBarId: 'BNBProgressBar',
        removeButtonId: 'BNBRemoveFile',
    },
];

// Initialize upload cards
document.addEventListener('DOMContentLoaded', () => {
    uploadConfigs.forEach((config) => {
        setupFileUpload(config);
    });

    document.getElementById("btnFileUpload").addEventListener("click", populateConfirmModal);
});

// ======================================
// Setup each upload input
// ======================================

function setupFileUpload(config) {
    const input = document.getElementById(config.inputId);
    const selectedFileText = document.getElementById(config.selectedFileId);
    const progressBar = document.getElementById(config.progressBarId);
    const removeButton = document.getElementById(config.removeButtonId);

    // Browse button file selection
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            const file = input.files[0];

            resetProgress(progressBar);

            displaySelectedFile(file, selectedFileText, config.progressBarId);

            removeButton.classList.remove('d-none');
        }
    });

    // Enable drag and drop
    const card = input.closest('.upload-card');

    setupDragAndDrop(
        card,
        input,
        selectedFileText,
        progressBar,
        config.progressBarId,
        removeButton,
    );

    // Remove selected file
    removeButton.addEventListener('click', () => {
        // Clear file input
        input.value = '';

        // Reset text
        selectedFileText.textContent = 'No file selected';

        // Reset progress bar
        resetProgress(progressBar);

        // Hide remove button
        removeButton.classList.add('d-none');
    });
}

// ======================================
// Drag and Drop
// ======================================

function setupDragAndDrop(
    card,
    input,
    selectedFileText,
    progressBar,
    progressBarId,
    removeButton,
) {
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

        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(file);

        input.files = dataTransfer.files;

        resetProgress(progressBar);

        displaySelectedFile(file, selectedFileText, progressBarId);

        removeButton.classList.remove('d-none');
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
    // progressBar.textContent = 'Ready';

    progressBar.classList.remove('bg-primary');
    progressBar.classList.add('bg-success');
}

// ======================================
// Add text to confirm upload modal
// ======================================

function populateConfirmModal() {
    const body = document.getElementById('confirmModalBody');

    // Get files
    const weeklyFile = document.getElementById('weeklyReport').files[0];
    const bnbFile = document.getElementById('BNBReport').files[0];

    let html = '';

    html += '<p>The following files will be uploaded:</p>';

    html += "<ul class='list-group'>";

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Weekly Availability</span>
            <strong>${weeklyFile ? weeklyFile.name : 'No file selected'}</strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>B&B Field Availability</span>
            <strong>${bnbFile ? bnbFile.name : 'No file selected'}</strong>
        </li>
    `;

    html += '</ul>';

    body.innerHTML = html;
}

