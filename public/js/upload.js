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
        changeIconColor: 'weeklyUploadIcon',
    },
    {
        inputId: 'BNBReport',
        selectedFileId: 'BNBSelectedFile',
        progressBarId: 'BNBProgressBar',
        removeButtonId: 'BNBRemoveFile',
        changeIconColor: 'BNBUploadIcon',
    },
    {
        inputId: 'pdf1Report',
        selectedFileId: 'pdf1SelectedFile',
        progressBarId: 'pdf1ProgressBar',
        removeButtonId: 'pdf1RemoveFile',
        changeIconColor: 'pdf1UploadIcon',
    },
    {
        inputId: 'pdf2Report',
        selectedFileId: 'pdf2SelectedFile',
        progressBarId: 'pdf2ProgressBar',
        removeButtonId: 'pdf2RemoveFile',
        changeIconColor: 'pdf2UploadIcon',
    },
];

// Initialize upload cards
document.addEventListener('DOMContentLoaded', () => {
    uploadConfigs.forEach((config) => {
        setupFileUpload(config);
    });

    document
        .getElementById('btnFileUpload')
        .addEventListener('click', populateConfirmModal);

    document
        .getElementById('btnConfirmUpload')
        .addEventListener('click', async () => {
            console.log('Upload button clicked');

            const weeklyFile = document.getElementById('weeklyReport').files[0];
            const bnbFile = document.getElementById('BNBReport').files[0];
            const pdf1File = document.getElementById('pdf1Report').files[0];
            const pdf2File = document.getElementById('pdf2Report').files[0];

            if (!weeklyFile && !bnbFile && !pdf1File && !pdf2File) {

                Swal.fire({
                    icon: 'warning',
                    title: 'No Files Selected',
                    text: 'Please select at least one file to upload.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0d6efd',
                });
                return;
            }

            const files = [];

            if (weeklyFile) {
                files.push({
                    type: 'overall',
                    filePath: window.api.getPathForFile(weeklyFile),
                });
            }

            if (bnbFile) {
                files.push({
                    type: 'bnb',
                    filePath: window.api.getPathForFile(bnbFile),
                });
            }

            if (pdf1File) {
                files.push({
                    type: 'pdf1',
                    filePath: window.api.getPathForFile(pdf1File),
                });
            }

            if (pdf2File) {
                files.push({
                    type: 'pdf2',
                    filePath: window.api.getPathForFile(pdf2File),
                });
            }

            console.log(files);

            try {
                const result = await window.api.uploadFiles(files);

                console.log('Upload result:', result);

                if (result.some((x) => !x.success)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Upload Failed',
                        text: 'One or more files could not be uploaded. Please ensure your settings are correct.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#dc3545'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Upload Successful!',
                        text: 'All selected files were uploaded successfully.',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#198754'
                    });
                }

            } catch (error) {
                console.error('Upload error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: 'Check and ensure your settings are correct.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }
        });
});

// ======================================
// Setup each upload input
// ======================================

function setupFileUpload(config) {
    const input = document.getElementById(config.inputId);
    const selectedFileText = document.getElementById(config.selectedFileId);
    const progressBar = document.getElementById(config.progressBarId);
    const removeButton = document.getElementById(config.removeButtonId);
    const changeIconColor = document.getElementById(config.changeIconColor);

    // Browse button file selection
    input.addEventListener('change', () => {
        if (input.files.length > 0) {
            const file = input.files[0];

            resetProgress(progressBar);

            displaySelectedFile(file, selectedFileText, config.progressBarId);

            removeButton.classList.remove('d-none');
            changeIconColor.classList.add('text-success')
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
        changeIconColor,
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
        changeIconColor.classList.remove('text-success')
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
    changeIconColor,
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
        changeIconColor.classList.add('text-success');
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
// ======================================

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
    const pdf1File = document.getElementById('pdf1Report').files[0];
    const pdf2File = document.getElementById('pdf2Report').files[0];

    let html = '';

    html += '<p>The following files will be uploaded:</p>';

    html += "<ul class='list-group'>";

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Container Availability .xlsx</span>
            <strong class="text-end ms-3" style="max-width: 300px; overflow-wrap: anywhere;">
                ${weeklyFile ? weeklyFile.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>B&B Field Stock Availability .xlsx</span>
            <strong class="text-end ms-3" style="max-width: 300px; overflow-wrap: anywhere;">
                ${bnbFile ? bnbFile.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Container Availability .pdf</span>
            <strong class="text-end ms-3" style="max-width: 300px; overflow-wrap: anywhere;">
                ${pdf1File ? pdf1File.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>B&B Field Stock Availability .pdf</span>
            <strong class="text-end ms-3" style="max-width: 350px; overflow-wrap: anywhere;">
                ${pdf2File ? pdf2File.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += '</ul>';

    body.innerHTML = html;
}
