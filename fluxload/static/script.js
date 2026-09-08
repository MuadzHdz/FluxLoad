document.addEventListener('DOMContentLoaded', () => {
    // ===== THEME MANAGEMENT =====
    const themeSelect = document.getElementById('themeSelect');
    const storedTheme = localStorage.getItem('selectedTheme') || document.documentElement.getAttribute('data-theme') || 'tokyo-night';

    if (themeSelect) {
        themeSelect.value = storedTheme;
        themeSelect.addEventListener('change', (e) => {
            const chosen = e.target.value;
            document.documentElement.setAttribute('data-theme', chosen);
            localStorage.setItem('selectedTheme', chosen);
            document.cookie = `theme=${chosen}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
        });
    }

    // ===== CLIENT-SIDE INSTANT SEARCH FILTER =====
    const fileSearch = document.getElementById('fileSearch');
    const itemRows = document.querySelectorAll('.item-row');

    if (fileSearch) {
        fileSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            itemRows.forEach(row => {
                const name = (row.getAttribute('data-name') || '').toLowerCase();
                row.style.display = name.includes(query) ? '' : 'none';
            });
        });

        // Clear search on Escape
        fileSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                fileSearch.value = '';
                fileSearch.dispatchEvent(new Event('input'));
                fileSearch.blur();
            }
        });
    }

    // ===== WHOLE-PAGE DRAG AND DROP UPLOAD =====
    const dropOverlay = document.getElementById('dragDropOverlay');
    const fileInput = document.getElementById('fileInput');
    let dragCounter = 0;

    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dragCounter++;
        if (dropOverlay) dropOverlay.classList.add('active');
    });

    window.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter <= 0 && dropOverlay) {
            dragCounter = 0;
            dropOverlay.classList.remove('active');
        }
    });

    window.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        dragCounter = 0;
        if (dropOverlay) dropOverlay.classList.remove('active');

        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            uploadFilesBatch(e.dataTransfer.files);
        }
    });

    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files.length > 0) {
                uploadFilesBatch(fileInput.files);
            }
        });
    }

    // ===== UPLOAD PROGRESS TOAST & EXECUTION =====
    const uploadToast = document.getElementById('uploadToast');
    const toastFilename = document.getElementById('toastFilename');
    const toastProgressBar = document.getElementById('toastProgressBar');
    const toastPercent = document.getElementById('toastPercent');
    const toastDetails = document.getElementById('toastDetails');
    const toastCancelBtn = document.getElementById('toastCancelBtn');

    let currentXhr = null;

    if (toastCancelBtn) {
        toastCancelBtn.addEventListener('click', () => {
            if (currentXhr) {
                currentXhr.abort();
                currentXhr = null;
            }
            if (uploadToast) uploadToast.style.display = 'none';
        });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async function uploadFilesBatch(files) {
        if (!files || files.length === 0) return;
        const total = files.length;

        for (let i = 0; i < total; i++) {
            await uploadSingleFile(files[i], i + 1, total);
        }

        // All uploads complete, reload to show new files
        setTimeout(() => {
            window.location.reload();
        }, 600);
    }

    function uploadSingleFile(file, index, total) {
        return new Promise((resolve) => {
            const formData = new FormData();
            formData.append('file', file);

            const uploadUrl = typeof UPLOAD_URL !== 'undefined' ? UPLOAD_URL : window.location.pathname;

            const xhr = new XMLHttpRequest();
            currentXhr = xhr;

            if (uploadToast) {
                uploadToast.style.display = 'flex';
                if (toastFilename) {
                    toastFilename.textContent = `[${index}/${total}] ${file.name}`;
                }
                if (toastProgressBar) toastProgressBar.style.width = '0%';
                if (toastPercent) toastPercent.textContent = '0%';
                if (toastDetails) toastDetails.textContent = `0 / ${formatBytes(file.size)}`;
            }

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const pct = Math.round((e.loaded / e.total) * 100);
                    if (toastProgressBar) toastProgressBar.style.width = pct + '%';
                    if (toastPercent) toastPercent.textContent = pct + '%';
                    if (toastDetails) {
                        toastDetails.textContent = `${formatBytes(e.loaded)} / ${formatBytes(e.total)}`;
                    }
                }
            });

            xhr.addEventListener('load', () => {
                currentXhr = null;
                if (toastProgressBar) toastProgressBar.style.width = '100%';
                if (toastPercent) toastPercent.textContent = '100%';
                resolve();
            });

            xhr.addEventListener('error', () => {
                currentXhr = null;
                if (toastFilename) toastFilename.textContent = `Error uploading ${file.name}`;
                resolve();
            });

            xhr.addEventListener('abort', () => {
                currentXhr = null;
                resolve();
            });

            xhr.open('POST', uploadUrl, true);
            xhr.send(formData);
        });
    }

    // Auto-dismiss flashes after 4 seconds
    document.querySelectorAll('.flash-alert').forEach(el => {
        setTimeout(() => {
            el.style.transition = 'opacity 0.4s, transform 0.4s';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';
            setTimeout(() => el.remove(), 400);
        }, 4000);
    });
});

// ===== MODAL CONTROLS (GLOBAL SCOPE) =====
function openMkdirModal() {
    const modal = document.getElementById('mkdirModal');
    if (modal) {
        modal.style.display = 'flex';
        const input = document.getElementById('dirNameInput');
        if (input) input.focus();
    }
}

function closeMkdirModal() {
    const modal = document.getElementById('mkdirModal');
    if (modal) modal.style.display = 'none';
}

function showRenameDialog(path, type, name) {
    const modal = document.getElementById('renameModal');
    if (!modal) return;
    const renamePath = document.getElementById('renamePath');
    const newNameInput = document.getElementById('newNameInput');
    const renameForm = document.getElementById('renameForm');
    const renameTitle = document.getElementById('renameTitle');

    if (renamePath) renamePath.value = path;
    if (newNameInput) {
        newNameInput.value = name || path.split('/').pop();
        newNameInput.focus();
    }
    if (renameForm) renameForm.action = '/rename/' + path;
    if (renameTitle) renameTitle.textContent = `Rename ${type === 'directory' ? 'Folder' : 'File'}`;

    modal.style.display = 'flex';
}

function closeRenameModal() {
    const modal = document.getElementById('renameModal');
    if (modal) modal.style.display = 'none';
}

function confirmDelete(path, type, name) {
    const modal = document.getElementById('deleteModal');
    if (!modal) return;
    const deleteItemName = document.getElementById('deleteItemName');
    const deleteForm = document.getElementById('deleteForm');

    if (deleteItemName) deleteItemName.textContent = name || path.split('/').pop();
    if (deleteForm) deleteForm.action = '/delete/' + path;

    modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none';
}

// Global window click to close modals when clicking on backdrop
window.addEventListener('click', (event) => {
    ['mkdirModal', 'renameModal', 'deleteModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Global Escape key listener to close modals
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeMkdirModal();
        closeRenameModal();
        closeDeleteModal();
    }
});
