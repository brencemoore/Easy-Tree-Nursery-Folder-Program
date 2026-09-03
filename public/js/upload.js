// ======================================
// File Upload Handler
// Weekly File Uploader
// ======================================

const uploadConfigs = [
    {
        inputId: 'containerXLSXReport',
        selectedFileId: 'containerXLSXSelectedFile',
        progressBarId: 'containerXLSXProgressBar',
        removeButtonId: 'containerXLSXRemoveFile',
        changeIconColor: 'containerXLSXUploadIcon',
        allowedExtensions: ['.xlsx'],
        cardTitle: 'Container Availability (.xlsx)',
    },
    {
        inputId: 'bnbXLSXReport',
        selectedFileId: 'bnbXLSXSelectedFile',
        progressBarId: 'bnbXLSXProgressBar',
        removeButtonId: 'bnbXLSXRemoveFile',
        changeIconColor: 'bnbXLSXUploadIcon',
        allowedExtensions: ['.xlsx'],
        cardTitle: 'B&B Field Stock Availability (.xlsx)',
    },
    {
        inputId: 'containerPDFReport',
        selectedFileId: 'containerPDFSelectedFile',
        progressBarId: 'containerPDFProgressBar',
        removeButtonId: 'containerPDFRemoveFile',
        changeIconColor: 'containerPDFUploadIcon',
        allowedExtensions: ['.pdf'],
        cardTitle: 'Container Availability (.pdf)',
    },
    {
        inputId: 'bnbPDFReport',
        selectedFileId: 'bnbPDFSelectedFile',
        progressBarId: 'bnbPDFProgressBar',
        removeButtonId: 'bnbPDFRemoveFile',
        changeIconColor: 'bnbPDFUploadIcon',
        allowedExtensions: ['.pdf'],
        cardTitle: 'B&B Field Stock Availability (.pdf)',
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

            const containerXLSXFile = document.getElementById('containerXLSXReport').files[0];
            const bnbXLSXFile = document.getElementById('bnbXLSXReport').files[0];
            const containerPDFFile = document.getElementById('containerPDFReport').files[0];
            const bnbPDFFile = document.getElementById('bnbPDFReport').files[0];

            if (!containerXLSXFile && !bnbXLSXFile && !containerPDFFile && !bnbPDFFile) {

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

            if (containerXLSXFile) {
                files.push({
                    type: 'containerXLSX',
                    filePath: window.api.getPathForFile(containerXLSXFile),
                });
            }

            if (bnbXLSXFile) {
                files.push({
                    type: 'bnbXLSX',
                    filePath: window.api.getPathForFile(bnbXLSXFile),
                });
            }

            if (containerPDFFile) {
                files.push({
                    type: 'containerPDF',
                    filePath: window.api.getPathForFile(containerPDFFile),
                });
            }

            if (bnbPDFFile) {
                files.push({
                    type: 'bnbPDF',
                    filePath: window.api.getPathForFile(bnbPDFFile),
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

            // Validates file extension
            if (!isValidFileType(file, config.allowedExtensions)) {
            Swal.fire({
                icon: 'error',
                title: 'Incorrect File Type',
                text: `${config.cardTitle} requires a ${config.allowedExtensions.join(' or ')} file.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
            });

            input.value = '';
            return;
        }

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
        config.allowedExtensions,
        config.cardTitle,
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
    allowedExtensions,
    cardTitle,
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

        // File extension validation
        if (!isValidFileType(file, allowedExtensions)) {
            console.log('Invalid File Type')

            Swal.fire({
                icon: 'error',
                title: 'Incorrect File Type',
                text: `${cardTitle} requires a ${allowedExtensions.join(' or ')} file.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
            });

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

// ==================================
// Validates correct file extension 
// =======================================

function isValidFileType(file, allowedExtensions) {
    const fileName = file.name.toLowerCase();

    return allowedExtensions.some((extension) =>
        fileName.endsWith(extension)
    );
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
    const containerXLSXFile = document.getElementById('containerXLSXReport').files[0];
    const bnbXLSXFile = document.getElementById('bnbXLSXReport').files[0];
    const containerPDFFile = document.getElementById('containerPDFReport').files[0];
    const bnbPDFFile = document.getElementById('bnbPDFReport').files[0];

    let html = '';

    html += '<p>The following files will be uploaded:</p>';

    html += "<ul class='list-group'>";

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Container Availability .xlsx</span>
            <strong class="text-end ms-3" style="max-width: 300px; overflow-wrap: anywhere;">
                ${containerXLSXFile ? containerXLSXFile.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>B&B Field Stock Availability .xlsx</span>
            <strong class="text-end ms-3" style="max-width: 300px; overflow-wrap: anywhere;">
                ${bnbXLSXFile ? bnbXLSXFile.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>Container Availability .pdf</span>
            <strong class="text-end ms-3" style="max-width: 300px; overflow-wrap: anywhere;">
                ${containerPDFFile ? containerPDFFile.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += `
        <li class="list-group-item d-flex justify-content-between">
            <span>B&B Field Stock Availability .pdf</span>
            <strong class="text-end ms-3" style="max-width: 350px; overflow-wrap: anywhere;">
                ${bnbPDFFile ? bnbPDFFile.name : 'No file selected'}
            </strong>
        </li>
    `;

    html += '</ul>';

    body.innerHTML = html;
}
