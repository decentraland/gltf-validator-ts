/**
 * glTF Validator TS - Web Interface
 * Browser-compatible validator implementation with multi-file support
 */

class GLTFValidatorWeb {
    constructor() {
        this.isValidating = false;
        this.loadedFiles = new Map(); // filename -> File object
        this.mainFile = null; // The .gltf or .glb file
        this.initializeUI();
    }

    initializeUI() {
        const dropZone = document.getElementById('dropZone');
        const selectButton = document.getElementById('selectButton');
        const fileInput = document.getElementById('fileInput');
        const validateButton = document.getElementById('validateButton');
        const clearFilesButton = document.getElementById('clearFilesButton');
        const clearButton = document.getElementById('clearButton');

        if (!dropZone || !selectButton || !fileInput || !validateButton || !clearFilesButton || !clearButton) {
            console.error('Required DOM elements not found');
            return;
        }

        // Drag and drop handlers
        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dropZone.addEventListener('drop', this.handleDrop.bind(this));

        // File selection handlers
        selectButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Action button handlers
        validateButton.addEventListener('click', this.validateFiles.bind(this));
        clearFilesButton.addEventListener('click', this.clearAllFiles.bind(this));
        clearButton.addEventListener('click', this.clearResults.bind(this));
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('dropZone').classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('dropZone').classList.remove('drag-over');
    }

    async handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById('dropZone').classList.remove('drag-over');

        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) {
            this.addFiles(files);
        }
    }

    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            this.addFiles(files);
        }
        // Clear the input so the same files can be selected again if needed
        event.target.value = '';
    }

    addFiles(files) {
        let hasMainFile = false;

        files.forEach(file => {
            const fileName = file.name.toLowerCase();

            // Check if it's a main glTF/GLB file
            if (fileName.endsWith('.gltf') || fileName.endsWith('.glb')) {
                this.mainFile = file;
                hasMainFile = true;
            }

            // Add to loaded files
            this.loadedFiles.set(file.name, file);
        });

        this.updateFilesDisplay();
        this.showFilesZone();

        // If we have a main file, enable validation
        const validateButton = document.getElementById('validateButton');
        validateButton.disabled = !this.mainFile;
    }

    updateFilesDisplay() {
        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';

        if (this.loadedFiles.size === 0) {
            filesList.innerHTML = '<p class="no-files">No files loaded</p>';
            return;
        }

        // Sort files: main file first, then dependencies
        const sortedFiles = Array.from(this.loadedFiles.entries()).sort((a, b) => {
            const [nameA, fileA] = a;
            const [nameB, fileB] = b;

            const isMainA = fileA === this.mainFile;
            const isMainB = fileB === this.mainFile;

            if (isMainA && !isMainB) return -1;
            if (!isMainA && isMainB) return 1;
            return nameA.localeCompare(nameB);
        });

        sortedFiles.forEach(([fileName, file]) => {
            const fileItem = document.createElement('div');
            fileItem.className = `file-item ${file === this.mainFile ? 'main-file' : ''}`;

            const fileIcon = this.getFileIcon(fileName);
            const fileStatus = this.getFileStatus(file);
            const fileSize = this.formatFileSize(file.size);

            fileItem.innerHTML = `
                <div class="file-info">
                    <span class="file-icon">${fileIcon}</span>
                    <div class="file-details">
                        <div class="file-name">${fileName}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                </div>
                <span class="file-status ${fileStatus.class}">${fileStatus.text}</span>
            `;

            filesList.appendChild(fileItem);
        });
    }

    getFileIcon(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        switch (ext) {
            case 'gltf': return '📄';
            case 'glb': return '📦';
            case 'bin': return '🗃️';
            case 'png': case 'jpg': case 'jpeg': return '🖼️';
            case 'ktx2': return '🎨';
            default: return '📎';
        }
    }

    getFileStatus(file) {
        if (file === this.mainFile) {
            return { class: 'main', text: 'Main' };
        }

        const ext = file.name.toLowerCase().split('.').pop();
        if (['bin', 'png', 'jpg', 'jpeg', 'ktx2'].includes(ext)) {
            return { class: 'dependency', text: 'Dependency' };
        }

        return { class: 'unknown', text: 'Unknown' };
    }

    showFilesZone() {
        document.getElementById('filesZone').style.display = 'block';
    }

    hideFilesZone() {
        document.getElementById('filesZone').style.display = 'none';
    }

    clearAllFiles() {
        this.loadedFiles.clear();
        this.mainFile = null;
        this.updateFilesDisplay();
        this.hideFilesZone();
        this.resetToInitialState();
    }

    resetToInitialState() {
        document.getElementById('outputZone').style.display = 'none';
        document.getElementById('dropZone').style.display = 'block';
        document.getElementById('altZone').style.display = 'block';
        document.getElementById('fileInput').value = '';
    }

    async validateFiles() {
        if (!this.mainFile || this.isValidating) {
            return;
        }

        this.isValidating = true;
        this.showLoading(this.mainFile);

        try {
            // Read the main file
            const arrayBuffer = await this.readFileAsArrayBuffer(this.mainFile);
            const uint8Array = new Uint8Array(arrayBuffer);

            // Create external resource function
            const externalResourceFunction = async (uri) => {
                // Check if we have this file loaded
                const file = this.loadedFiles.get(uri);
                if (!file) {
                    throw new Error(`External resource not available: ${uri}`);
                }

                // Read and return the file data
                const buffer = await this.readFileAsArrayBuffer(file);
                return new Uint8Array(buffer);
            };

            // Get the validator function
            const validateBytes = window.GLTFValidator?.validateBytes;
            if (!validateBytes) {
                throw new Error('GLTF Validator library not loaded');
            }

            const result = await validateBytes(uint8Array, {
                uri: this.mainFile.name,
                maxIssues: 200,
                externalResourceFunction
            });

            this.displayResults(this.mainFile, result);
        } catch (error) {
            console.error('Validation error:', error);
            this.showError(`Validation failed: ${error.message}`);
        } finally {
            this.isValidating = false;
        }
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    showLoading(file) {
        document.getElementById('dropZone').style.display = 'none';
        document.getElementById('filesZone').style.display = 'none';
        document.getElementById('altZone').style.display = 'none';
        document.getElementById('outputZone').style.display = 'block';

        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('validationStatus').innerHTML = '<div class="loading">🔄 Validating...</div>';
        document.getElementById('validationCounts').textContent = '';
        document.getElementById('outputCode').textContent = '';
    }

    showError(message) {
        document.getElementById('dropZone').style.display = 'none';
        document.getElementById('filesZone').style.display = 'none';
        document.getElementById('altZone').style.display = 'none';
        document.getElementById('outputZone').style.display = 'block';

        document.getElementById('fileName').textContent = 'Error';
        document.getElementById('fileSize').textContent = '';
        document.getElementById('validationStatus').innerHTML = `<div class="error">❌ ${message}</div>`;
        document.getElementById('validationCounts').textContent = '';
        document.getElementById('outputCode').textContent = '';
    }

    displayResults(file, result) {
        const issues = result.issues;
        const hasErrors = issues.numErrors > 0;
        const hasWarnings = issues.numWarnings > 0;

        // Update file info
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);

        // Update validation status
        let statusHtml = '';
        if (hasErrors) {
            statusHtml = '<div class="error">❌ Validation failed</div>';
        } else if (hasWarnings) {
            statusHtml = '<div class="warning">⚠️ Validation passed with warnings</div>';
        } else {
            statusHtml = '<div class="success">✅ Validation passed</div>';
        }
        document.getElementById('validationStatus').innerHTML = statusHtml;

        // Update counts
        const counts = [];
        if (issues.numErrors > 0) counts.push(`${issues.numErrors} error${issues.numErrors !== 1 ? 's' : ''}`);
        if (issues.numWarnings > 0) counts.push(`${issues.numWarnings} warning${issues.numWarnings !== 1 ? 's' : ''}`);
        if (issues.numInfos > 0) counts.push(`${issues.numInfos} info${issues.numInfos !== 1 ? 's' : ''}`);
        if (issues.numHints > 0) counts.push(`${issues.numHints} hint${issues.numHints !== 1 ? 's' : ''}`);

        document.getElementById('validationCounts').textContent = counts.length > 0 ? counts.join(', ') : 'No issues found';

        // Display JSON result
        const jsonString = JSON.stringify(result, null, 2);
        document.getElementById('outputCode').textContent = jsonString;

        // Check if result was truncated
        if (issues.messages.length >= 200) {
            document.getElementById('truncationWarning').style.display = 'block';
        } else {
            document.getElementById('truncationWarning').style.display = 'none';
        }
    }

    clearResults() {
        // Clear all files and reset to initial state
        this.clearAllFiles();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the validator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GLTFValidatorWeb();
});

// Export for potential external use
window.GLTFValidatorWeb = GLTFValidatorWeb;