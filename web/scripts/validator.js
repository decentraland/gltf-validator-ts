/**
 * glTF Validator TS - Web Interface
 * Browser-compatible validator implementation with multi-file support
 */

class GLTFValidatorWeb {
    constructor() {
        this.isValidating = false;
        this.loadedFiles = new Map(); // filename -> File object
        this.mainFile = null; // The .gltf or .glb file
        this.ignoredCodes = this.loadIgnoredCodes(); // Load from localStorage
        this.showIgnored = false; // Toggle for showing/hiding ignored issues
        this.lastValidationResult = null; // Store last result for re-filtering
        this.initializeUI();
    }

    initializeUI() {
        const dropZone = document.getElementById('dropZone');
        const selectButton = document.getElementById('selectButton');
        const fileInput = document.getElementById('fileInput');
        const validateButton = document.getElementById('validateButton');
        const clearFilesButton = document.getElementById('clearFilesButton');
        const clearButton = document.getElementById('clearButton');
        const toggleRawOutput = document.getElementById('toggleRawOutput');

        // Settings and filter elements
        const settingsButton = document.getElementById('settingsButton');
        const settingsModal = document.getElementById('settingsModal');
        const closeModal = document.getElementById('closeModal');
        const addCodeButton = document.getElementById('addCodeButton');
        const addCodeInput = document.getElementById('addCodeInput');
        const clearAllCodesButton = document.getElementById('clearAllCodesButton');
        const exportCodesButton = document.getElementById('exportCodesButton');
        const importCodesButton = document.getElementById('importCodesButton');
        const toggleIgnoredButton = document.getElementById('toggleIgnoredButton');
        const manageFiltersButton = document.getElementById('manageFiltersButton');

        // Import modal elements
        const importModal = document.getElementById('importModal');
        const closeImportModal = document.getElementById('closeImportModal');
        const cancelImportButton = document.getElementById('cancelImportButton');
        const confirmImportButton = document.getElementById('confirmImportButton');

        if (!dropZone || !selectButton || !fileInput || !validateButton || !clearFilesButton || !clearButton || !toggleRawOutput) {
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
        toggleRawOutput.addEventListener('click', this.toggleRawOutput.bind(this));

        // Settings modal handlers
        if (settingsButton) settingsButton.addEventListener('click', () => this.openSettingsModal());
        if (closeModal) closeModal.addEventListener('click', () => this.closeSettingsModal());
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) this.closeSettingsModal();
            });
        }

        // Add code handlers
        if (addCodeButton) addCodeButton.addEventListener('click', () => this.addIgnoredCode());
        if (addCodeInput) {
            addCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addIgnoredCode();
            });
        }

        // Settings actions
        if (clearAllCodesButton) clearAllCodesButton.addEventListener('click', () => this.clearAllIgnoredCodes());
        if (exportCodesButton) exportCodesButton.addEventListener('click', () => this.exportIgnoredCodes());
        if (importCodesButton) importCodesButton.addEventListener('click', () => this.openImportModal());

        // Filter banner handlers
        if (toggleIgnoredButton) toggleIgnoredButton.addEventListener('click', () => this.toggleShowIgnored());
        if (manageFiltersButton) manageFiltersButton.addEventListener('click', () => this.openSettingsModal());

        // Import modal handlers
        if (closeImportModal) closeImportModal.addEventListener('click', () => this.closeImportModal());
        if (cancelImportButton) cancelImportButton.addEventListener('click', () => this.closeImportModal());
        if (confirmImportButton) confirmImportButton.addEventListener('click', () => this.importIgnoredCodes());
        if (importModal) {
            importModal.addEventListener('click', (e) => {
                if (e.target === importModal) this.closeImportModal();
            });
        }
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
        // Store result for re-filtering
        this.lastValidationResult = result;

        const issues = result.issues;

        // Count ignored issues
        const ignoredIssues = issues.messages.filter(m => this.isIssueIgnored(m));
        const hiddenCount = this.showIgnored ? 0 : ignoredIssues.length;

        // Calculate effective counts (after filtering)
        let effectiveErrors = issues.numErrors;
        let effectiveWarnings = issues.numWarnings;
        let effectiveInfos = issues.numInfos;
        let effectiveHints = issues.numHints;

        if (!this.showIgnored) {
            ignoredIssues.forEach(msg => {
                const severity = msg.severity || 0;
                if (severity === 0) effectiveErrors--;
                else if (severity === 1) effectiveWarnings--;
                else if (severity === 2) effectiveInfos--;
                else if (severity === 3) effectiveHints--;
            });
        }

        const hasErrors = effectiveErrors > 0;
        const hasWarnings = effectiveWarnings > 0;

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

        // Update counts with ignored information
        const counts = [];
        if (effectiveErrors > 0 || (issues.numErrors > effectiveErrors)) {
            const ignoredErrors = issues.numErrors - effectiveErrors;
            let errorText = `${effectiveErrors} error${effectiveErrors !== 1 ? 's' : ''}`;
            if (ignoredErrors > 0) errorText += ` (${ignoredErrors} ignored)`;
            counts.push(errorText);
        }
        if (effectiveWarnings > 0 || (issues.numWarnings > effectiveWarnings)) {
            const ignoredWarnings = issues.numWarnings - effectiveWarnings;
            let warningText = `${effectiveWarnings} warning${effectiveWarnings !== 1 ? 's' : ''}`;
            if (ignoredWarnings > 0) warningText += ` (${ignoredWarnings} ignored)`;
            counts.push(warningText);
        }
        if (effectiveInfos > 0 || (issues.numInfos > effectiveInfos)) {
            const ignoredInfos = issues.numInfos - effectiveInfos;
            let infoText = `${effectiveInfos} info${effectiveInfos !== 1 ? 's' : ''}`;
            if (ignoredInfos > 0) infoText += ` (${ignoredInfos} ignored)`;
            counts.push(infoText);
        }
        if (effectiveHints > 0 || (issues.numHints > effectiveHints)) {
            const ignoredHints = issues.numHints - effectiveHints;
            let hintText = `${effectiveHints} hint${effectiveHints !== 1 ? 's' : ''}`;
            if (ignoredHints > 0) hintText += ` (${ignoredHints} ignored)`;
            counts.push(hintText);
        }

        document.getElementById('validationCounts').textContent = counts.length > 0 ? counts.join(', ') : 'No issues found';

        // Update filter banner
        this.updateFilterBanner(hiddenCount);

        // Display structured issues
        this.displayIssues(issues);

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

    displayIssues(issues) {
        const issuesDisplay = document.getElementById('issuesDisplay');
        issuesDisplay.innerHTML = '';

        if (!issues.messages || issues.messages.length === 0) {
            issuesDisplay.innerHTML = '<p style="text-align: center; color: #28a745; padding: 20px;">✨ No issues found - validation successful!</p>';
            return;
        }

        // Group messages by severity and filter based on ignored codes
        const groupedIssues = {
            errors: [],
            warnings: [],
            infos: [],
            hints: []
        };

        issues.messages.forEach(message => {
            const isIgnored = this.isIssueIgnored(message);

            // Skip ignored issues if showIgnored is false
            if (isIgnored && !this.showIgnored) {
                return;
            }

            const severity = message.severity || 0;
            const messageWithIgnoredFlag = { ...message, _isIgnored: isIgnored };

            if (severity === 0) {
                groupedIssues.errors.push(messageWithIgnoredFlag);
            } else if (severity === 1) {
                groupedIssues.warnings.push(messageWithIgnoredFlag);
            } else if (severity === 2) {
                groupedIssues.infos.push(messageWithIgnoredFlag);
            } else if (severity === 3) {
                groupedIssues.hints.push(messageWithIgnoredFlag);
            }
        });

        // Check if there are any visible issues
        const totalVisible = groupedIssues.errors.length + groupedIssues.warnings.length +
                           groupedIssues.infos.length + groupedIssues.hints.length;

        if (totalVisible === 0) {
            issuesDisplay.innerHTML = '<p style="text-align: center; color: #28a745; padding: 20px;">✨ All issues are ignored!</p>';
            return;
        }

        // Create category displays
        if (groupedIssues.errors.length > 0) {
            issuesDisplay.appendChild(this.createIssueCategory('Errors', 'error', groupedIssues.errors, '❌', true));
        }
        if (groupedIssues.warnings.length > 0) {
            issuesDisplay.appendChild(this.createIssueCategory('Warnings', 'warning', groupedIssues.warnings, '⚠️', true));
        }
        if (groupedIssues.infos.length > 0) {
            issuesDisplay.appendChild(this.createIssueCategory('Info', 'info', groupedIssues.infos, 'ℹ️', false));
        }
        if (groupedIssues.hints.length > 0) {
            issuesDisplay.appendChild(this.createIssueCategory('Hints', 'hint', groupedIssues.hints, '💡', false));
        }
    }

    createIssueCategory(title, severity, messages, icon, expanded) {
        const category = document.createElement('div');
        category.className = 'issue-category';

        const header = document.createElement('div');
        header.className = `issue-category-header ${severity}`;

        const titleDiv = document.createElement('div');
        titleDiv.className = 'issue-category-title';
        titleDiv.innerHTML = `
            <span class="issue-category-icon">${icon}</span>
            <span>${title}</span>
            <span class="issue-category-count">(${messages.length})</span>
        `;

        const toggle = document.createElement('span');
        toggle.className = `issue-category-toggle${expanded ? '' : ' collapsed'}`;
        toggle.textContent = '▼';

        header.appendChild(titleDiv);
        header.appendChild(toggle);

        const list = document.createElement('div');
        list.className = `issue-list${expanded ? '' : ' collapsed'}`;

        messages.forEach(message => {
            list.appendChild(this.createIssueItem(message, severity));
        });

        // Add click handler to toggle
        header.addEventListener('click', () => {
            const isCollapsed = list.classList.toggle('collapsed');
            toggle.classList.toggle('collapsed', isCollapsed);
        });

        category.appendChild(header);
        category.appendChild(list);

        return category;
    }

    createIssueItem(message, severity) {
        const item = document.createElement('div');
        item.className = 'issue-item';

        // Apply ignored class if this issue is ignored
        if (message._isIgnored) {
            item.classList.add('ignored');
        }

        let content = '';

        // Add code badge if available
        if (message.code) {
            content += `<div class="issue-code-badge"><span class="issue-severity ${severity}">${this.escapeHtml(message.code)}</span></div>`;
        }

        content += `<div class="issue-message">${this.escapeHtml(message.message || 'No message')}</div>`;

        if (message.pointer) {
            content += `<div class="issue-pointer">📍 ${this.escapeHtml(message.pointer)}</div>`;
        }

        if (message.offset !== undefined) {
            content += `<div class="issue-offset">Offset: ${message.offset}</div>`;
        }

        item.innerHTML = content;

        // Add inline ignore button if code exists and not already ignored
        if (message.code && !message._isIgnored) {
            const ignoreBtn = document.createElement('button');
            ignoreBtn.className = 'issue-ignore-button';
            ignoreBtn.textContent = `🚫 Ignore ${message.code}`;
            ignoreBtn.title = `Ignore all ${message.code} issues`;
            ignoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Ignore all "${message.code}" issues in future validations?`)) {
                    this.addIgnoredCode(message.code);
                }
            });
            item.appendChild(ignoreBtn);
        }

        return item;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleRawOutput() {
        const rawOutputContent = document.getElementById('rawOutputContent');
        const toggleButton = document.getElementById('toggleRawOutput');

        if (rawOutputContent.style.display === 'none') {
            rawOutputContent.style.display = 'block';
            toggleButton.textContent = 'Hide Raw JSON';
        } else {
            rawOutputContent.style.display = 'none';
            toggleButton.textContent = 'Show Raw JSON';
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

    // ========== Ignored Codes Management ==========

    loadIgnoredCodes() {
        try {
            const stored = localStorage.getItem('gltf_ignored_codes');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load ignored codes:', error);
            return [];
        }
    }

    saveIgnoredCodes() {
        try {
            localStorage.setItem('gltf_ignored_codes', JSON.stringify(this.ignoredCodes));
        } catch (error) {
            console.error('Failed to save ignored codes:', error);
        }
    }

    addIgnoredCode(code = null) {
        const input = document.getElementById('addCodeInput');
        const codeToAdd = code || input.value.trim().toUpperCase();

        if (!codeToAdd) return;

        if (!this.ignoredCodes.includes(codeToAdd)) {
            this.ignoredCodes.push(codeToAdd);
            this.saveIgnoredCodes();
            this.updateIgnoredCodesList();

            // Re-filter current results if available
            if (this.lastValidationResult) {
                this.displayResults(this.mainFile, this.lastValidationResult);
            }
        }

        if (input) input.value = '';
    }

    removeIgnoredCode(code) {
        this.ignoredCodes = this.ignoredCodes.filter(c => c !== code);
        this.saveIgnoredCodes();
        this.updateIgnoredCodesList();

        // Re-filter current results if available
        if (this.lastValidationResult) {
            this.displayResults(this.mainFile, this.lastValidationResult);
        }
    }

    clearAllIgnoredCodes() {
        if (confirm('Are you sure you want to clear all ignored codes?')) {
            this.ignoredCodes = [];
            this.saveIgnoredCodes();
            this.updateIgnoredCodesList();

            // Re-filter current results if available
            if (this.lastValidationResult) {
                this.displayResults(this.mainFile, this.lastValidationResult);
            }
        }
    }

    exportIgnoredCodes() {
        const data = JSON.stringify(this.ignoredCodes, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gltf-ignored-codes.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importIgnoredCodes() {
        const textarea = document.getElementById('importTextarea');
        const value = textarea.value.trim();

        if (!value) return;

        try {
            const codes = JSON.parse(value);

            if (!Array.isArray(codes)) {
                alert('Invalid format. Please provide a JSON array of codes.');
                return;
            }

            // Validate all items are strings
            if (!codes.every(c => typeof c === 'string')) {
                alert('Invalid format. All codes must be strings.');
                return;
            }

            // Merge with existing codes (avoid duplicates)
            const newCodes = codes.filter(c => !this.ignoredCodes.includes(c));
            this.ignoredCodes = [...this.ignoredCodes, ...newCodes];
            this.saveIgnoredCodes();
            this.updateIgnoredCodesList();
            this.closeImportModal();

            // Re-filter current results if available
            if (this.lastValidationResult) {
                this.displayResults(this.mainFile, this.lastValidationResult);
            }

            alert(`Successfully imported ${newCodes.length} new code(s).`);
        } catch (error) {
            alert('Failed to parse JSON. Please check the format and try again.');
        }
    }

    updateIgnoredCodesList() {
        const list = document.getElementById('ignoredCodesList');
        const count = document.getElementById('ignoredCount');

        if (count) count.textContent = this.ignoredCodes.length;

        if (!list) return;

        if (this.ignoredCodes.length === 0) {
            list.innerHTML = '<p class="empty-state">No codes ignored yet</p>';
            return;
        }

        list.innerHTML = '';
        this.ignoredCodes.sort().forEach(code => {
            const item = document.createElement('div');
            item.className = 'ignored-code-item';

            const codeSpan = document.createElement('span');
            codeSpan.textContent = code;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-code-button';
            removeBtn.textContent = '×';
            removeBtn.title = 'Remove';
            removeBtn.addEventListener('click', () => this.removeIgnoredCode(code));

            item.appendChild(codeSpan);
            item.appendChild(removeBtn);
            list.appendChild(item);
        });
    }

    // ========== Modal Management ==========

    openSettingsModal() {
        this.updateIgnoredCodesList();
        document.getElementById('settingsModal').style.display = 'flex';
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    openImportModal() {
        document.getElementById('importTextarea').value = '';
        document.getElementById('importModal').style.display = 'flex';
    }

    closeImportModal() {
        document.getElementById('importModal').style.display = 'none';
    }

    // ========== Filter Management ==========

    toggleShowIgnored() {
        this.showIgnored = !this.showIgnored;
        const button = document.getElementById('toggleIgnoredButton');
        if (button) {
            button.textContent = this.showIgnored ? 'Hide Ignored' : 'Show Ignored';
        }

        // Re-display issues with new filter state
        if (this.lastValidationResult) {
            this.displayResults(this.mainFile, this.lastValidationResult);
        }
    }

    updateFilterBanner(hiddenCount) {
        const filterBanner = document.getElementById('filterBanner');
        const filterText = document.getElementById('filterText');

        if (!filterBanner || !filterText) return;

        if (hiddenCount > 0) {
            const codeCount = this.ignoredCodes.length;
            filterText.textContent = `Filtering ${codeCount} error code${codeCount !== 1 ? 's' : ''} (${hiddenCount} issue${hiddenCount !== 1 ? 's' : ''} hidden)`;
            filterBanner.style.display = 'flex';
        } else {
            filterBanner.style.display = 'none';
        }
    }

    isIssueIgnored(message) {
        return message.code && this.ignoredCodes.includes(message.code);
    }
}

// Initialize the validator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GLTFValidatorWeb();
});

// Export for potential external use
window.GLTFValidatorWeb = GLTFValidatorWeb;