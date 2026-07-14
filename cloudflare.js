// ======================================
// Cloudflare R2 Upload Handler
// ======================================

const fs = require('fs');
const path = require('path');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Load configuration
function getConfig() {
    const configPath = path.join(__dirname, 'config.json');

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    return config;
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

    const fileStream = fs.createReadStream(filePath);

    const command = new PutObjectCommand({
        Bucket: config.bucketName,
        Key: objectName,
        Body: fileStream,
    });

    try {
        await client.send(command);

        return { success: true, file: objectName };
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

    // catch (error) {
    //     console.error('Upload failed:', error);

    //     return { success: false, file: objectName, error: error.message };
    // }
}

// ======================================
// Upload multiple files
// ======================================

async function uploadFiles(files) {
    const config = getConfig();

    const results = [];

    for (const file of files) {
        let objectName;

        if (file.type === 'overall') {
            objectName = config.uploads.overall;
        }

        if (file.type === 'bnb') {
            objectName = config.uploads.bnb;
        }

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
