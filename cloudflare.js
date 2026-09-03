// ======================================
// Cloudflare R2 Upload Handler
// ======================================

const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Load configuration
function getConfig() {
    const configPath = path.join(app.getPath('userData'), 'config.json');

    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

// Create Cloudflare R2 client
function createR2Client() {
    const config = getConfig();

    console.log(config.urlEndpoint);
    console.log(config.bucketName);

    return new S3Client({
        region: 'auto',

        endpoint: config.urlEndpoint,

        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        },
    });
}

// Used for uploading correct file type to cloudflare
function getContentType(filePath) {
    const extension = path.extname(filePath).toLowerCase();

    switch (extension) {
        case '.pdf':
            return 'application/pdf';

        case '.xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        case '.xls':
            return 'application/vnd.ms-excel';

        case '.csv':
            return 'text/csv';

        case '.txt':
            return 'text/plain';

        case '.html':
        case '.htm':
            return 'text/html';

        case '.json':
            return 'application/json';

        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';

        case '.png':
            return 'image/png';

        case '.gif':
            return 'image/gif';

        default:
            return 'application/octet-stream';
    }
}

// ======================================
// Upload a single file
// ======================================

async function uploadFile(filePath, objectName) {
    console.log('Uploading:');
    console.log('Path:', filePath);
    console.log('Object:', objectName);

    const config = getConfig();
    const client = createR2Client();

    if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
    }

    // Get file information
    const stats = fs.statSync(filePath);

    // Determine MIME type
    const contentType = getContentType(filePath);

    // Create file stream
    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: objectName,
        Body: fileStream,
        ContentLength: stats.size,
        ContentType: contentType,
        ContentDisposition: 'inline',
    });

    try {
        await client.send(command);

        console.log('Upload successful:', objectName);

        return {
            success: true,
            file: objectName,
        };

    } catch (error) {
        console.error('========== Cloudflare Upload Error ==========');
        console.error(error);
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        console.error('Code:', error.Code);
        console.error('Status:', error.$metadata);
        console.error('============================================');

        throw error;
    }
}

// ======================================
// Upload multiple files
// ======================================

async function uploadFiles(files) {
    const config = getConfig();

    const results = [];

    for (const file of files) {
        let objectName;

        console.log("Processing type:", file.type);

        if (file.type === 'containerXLSX') {
            objectName = config.uploads.containerXLSX;
        }

        if (file.type === 'bnbXLSX') {
            objectName = config.uploads.bnbXLSX;
        }

        if (file.type === 'containerPDF') {
            objectName = config.uploads.containerPDF;
        }

        if (file.type === 'bnbPDF') {
            objectName = config.uploads.bnbPDF;
        }

        console.log("Object name:", objectName);

        console.log('Uploading', file.filePath, 'as', objectName);

        const result = await uploadFile(file.filePath, objectName);

        results.push(result);
    }

    return results;
}

// Export functions
module.exports = {
    uploadFile,
    uploadFiles,
};
