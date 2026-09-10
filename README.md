# Easy Tree File Uploader

A desktop application developed for **Easy Tree Nursery** to streamline the management and upload of weekly nursery availability data. The application provides a simple interface for uploading availability files to Cloudflare R2 while supporting multiple upload categories, local configuration management, and automatic application updates.

> **Note:** This application was developed specifically for the operational needs and workflows of **Easy Tree Nursery**. While the repository is publicly available for viewing and reference, the application is tailored to Easy Tree's specific processes, file formats, cloud-storage configuration, and business requirements. As a result, it may not be directly useful or applicable to other organizations without modification.

## Overview

Easy Tree Nursery manages a large inventory of nursery plants and regularly distributes availability information. This application was developed to simplify the recurring process of preparing and uploading availability files to cloud storage.

The application provides a user-friendly desktop interface that allows authorized users to:

- Upload weekly availability files
- Upload B&B (balled-and-burlapped) availability files
- Store files in organized Cloudflare R2 locations
- Manage application configuration locally
- Receive application updates through the built-in updater
- Perform recurring uploads without manually interacting with cloud-storage tools

The application is built as an Electron desktop application with an Express-based backend and integrates directly with Cloudflare R2.

## Features

### File Uploads

The application supports multiple upload types:

- **Overall Availability** — Weekly nursery availability data
- **B&B Availability** — Balled-and-burlapped plant availability data

Uploaded files are automatically transferred to the appropriate Cloudflare R2 storage location.

### Cloud Storage

Cloudflare R2 is used as the application's cloud storage backend.

The application handles the upload process so users do not need direct access to the underlying storage infrastructure.

### Local Configuration

Application configuration is managed locally rather than being committed to the source repository.

This allows environment-specific settings and credentials to remain separate from the application source code.

### Automatic Updates

The application includes automatic update functionality through Electron's update system.

Releases can be distributed through GitHub Releases, allowing installed versions of the application to check for and install newer versions.

### Desktop Application

The application is packaged as an Electron desktop application, providing a standalone interface for users without requiring them to manually run a web server or install development dependencies.

## Technology Stack

### Frontend

- HTML
- CSS
- JavaScript
- Bootstrap

### Application

- Electron
- Node.js
- Express.js

### Cloud

- Cloudflare R2
- S3-compatible object storage API

### Development & Distribution

- Git
- GitHub
- GitHub Releases
- Electron application packaging
- Electron automatic updates

## Architecture

The application follows a relatively simple Electron architecture designed to keep the application maintainable and easy to deploy.

```text
                    ┌──────────────────────┐
                    │     Electron App     │
                    │                      │
                    │  User Interface      │
                    │  HTML / CSS / JS     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Preload Layer    │
                    │                      │
                    │  Secure IPC Bridge   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Electron / Express  │
                    │      Backend         │
                    │                      │
                    │ Configuration        │
                    │ Upload Handling      │
                    │ Update Management    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Cloudflare R2     │
                    │                      │
                    │  Availability Files  │
                    └──────────────────────┘
```

## Project Structure

The primary source files are organized around the application's user interface, Electron process, cloud-storage integration, and configuration management.

```text
.
├── public/
│   ├── index.html
│   └── upload.js
│
├── cloudflare.js
├── configManager.js
├── index.js
├── preload.js
├── package.json
└── ...
```

### Key Files

#### `public/index.html`

Contains the primary user interface for the application.

#### `public/upload.js`

Handles client-side upload interactions and communicates with the application's backend functionality.

#### `cloudflare.js`

Contains functionality for interacting with Cloudflare R2 and uploading files to cloud storage.

#### `configManager.js`

Handles local application configuration.

Configuration is intentionally kept outside of the source-controlled application code so environment-specific settings and sensitive values are not committed to the repository.

#### `preload.js`

Provides the controlled communication layer between the Electron renderer process and application functionality.

#### `index.js`

Serves as the primary Electron application entry point and manages application startup, windows, and related desktop functionality.

## Upload Workflow

The general upload process is:

```text
User selects file
       │
       ▼
Application validates upload
       │
       ▼
Upload type is determined
       │
       ├───────────────┐
       │               │
       ▼               ▼
   Overall           B&B
 Availability     Availability
       │               │
       └───────┬───────┘
               ▼
       Cloudflare R2
               │
               ▼
        Upload complete
```

This workflow removes the need for users to manually manage cloud-storage objects or interact directly with the R2 API.

## Configuration

Configuration is stored locally and should **not be committed to the repository**.

A local configuration file is used to provide environment-specific values such as cloud-storage settings and other application configuration.

Sensitive credentials should never be placed directly in source files or committed to Git.

### Example Configuration

The exact configuration structure should be based on the current application configuration implementation.

```text
[local configuration]
    │
    ├── R2 configuration
    ├── Application settings
    └── Environment-specific values
```

> **Security:** Never commit Cloudflare credentials, API tokens, access keys, private keys, or other secrets to the repository.

## Development

### Prerequisites

To develop the application, you will need:

- Node.js
- npm
- Git
- A Cloudflare R2 account/configuration for testing uploads

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

Install dependencies:

```bash
npm install
```

Start the application using the project's configured development command:

```bash
npm start
```

> The exact development command should be verified against the current `package.json`.

## Building the Application

The application can be packaged into a distributable desktop installer for end users.

The project uses Electron packaging tools to create the Windows application distribution.

A typical production workflow is:

```text
Source Code
    │
    ▼
Install Dependencies
    │
    ▼
Build / Package
    │
    ▼
Windows Installer
    │
    ▼
GitHub Release
    │
    ▼
Automatic Updates
```

The exact build command depends on the packaging configuration defined in `package.json`.

## Releases and Updates

Production versions are distributed through GitHub Releases.

Each release should:

1. Update the application version.
2. Build the production installer.
3. Create a Git tag corresponding to the application version.
4. Create a GitHub Release.
5. Upload the generated release artifacts.
6. Mark the appropriate release as the latest production release.

Version tags follow the project's release convention, for example:

```text
v1.2.1
```

The application uses its update mechanism to check for newer published versions.

### Versioning

The project uses semantic-style version numbers:

```text
MAJOR.MINOR.PATCH
```

For example:

```text
1.2.1
```

Where:

- **MAJOR** — Significant breaking changes
- **MINOR** — New functionality that maintains compatibility
- **PATCH** — Bug fixes and minor improvements

## Security Considerations

Because the application interacts with cloud storage, credentials and access permissions should be handled carefully.

### Credentials

- Do not commit credentials to Git.
- Keep R2 credentials in local configuration or an appropriate secure mechanism.
- Rotate credentials if they are accidentally exposed.
- Use the minimum permissions necessary for the application's operations.

### Source Control

Sensitive configuration files should be excluded using `.gitignore`.

For example:

```gitignore
.env
config.local.*
*.secret
```

The exact entries should match the configuration files used by the application.

## Deployment

The intended deployment model is a standalone Windows desktop application.

End users receive a packaged installer rather than running the application from source.

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Release
    │
    ▼
Windows Installer
    │
    ▼
End User
```

Future application versions can be distributed through the application's automatic update mechanism.

## Design Goals

The application was designed around several practical goals:

- **Simplicity** — Make recurring uploads easy for non-developers.
- **Maintainability** — Keep the application architecture straightforward and understandable.
- **Automation** — Reduce repetitive manual upload and file-management tasks.
- **Security** — Keep sensitive configuration separate from source code.
- **Reliability** — Provide a consistent workflow for recurring availability uploads.
- **Updatability** — Allow new versions to be distributed without requiring users to manually reinstall the application.

## Future Improvements

Potential areas for future development include:

- Improved upload validation and error reporting
- Upload history and status tracking
- Additional availability-file types
- More detailed logging
- Improved configuration management
- Additional automated testing
- Expanded update and release automation
- More granular user permissions
- Modular/customizable file uploading

## Author

Developed as freelance software development work for **Easy Tree Nursery**.

The project provided practical experience in:

- Desktop application development
- Web development
- Cloud storage integration
- Software deployment
- Application configuration management
- Automated software updates
- Business workflow automation
