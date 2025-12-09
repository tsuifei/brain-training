// 圖片壓縮器應用程式
class ImageCompressor {
    constructor() {
        this.files = [];
        this.quality = 80;
        this.resizeWidth = 'original';
        this.pendingCount = 0;
        this.completedCount = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        // 文件選擇
        const fileInput = document.getElementById('fileInput');
        const selectFilesBtn = document.getElementById('selectFilesBtn');
        const uploadArea = document.getElementById('uploadArea');

        selectFilesBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // 拖曳上傳
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // 品質滑桿
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.getElementById('quality-value');
        qualitySlider.addEventListener('input', (e) => {
            this.quality = parseInt(e.target.value);
            qualityValue.textContent = `${this.quality}%`;
        });

        // 尺寸選擇
        const resizeSelect = document.getElementById('resize');
        resizeSelect.addEventListener('change', (e) => {
            this.resizeWidth = e.target.value;
        });

        // 壓縮按鈕
        const compressAllBtn = document.getElementById('compressAllBtn');
        compressAllBtn.addEventListener('click', () => this.compressAll());

        // 清空按鈕
        const clearAllBtn = document.getElementById('clearAllBtn');
        clearAllBtn.addEventListener('click', () => this.clearAll());
    }

    handleFiles(fileList) {
        const newFiles = Array.from(fileList).filter(file => {
            const isImage = file.type.startsWith('image/');
            const isSupported = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
            return isImage && isSupported;
        });

        if (newFiles.length === 0) {
            alert('請選擇有效的圖片文件（JPG、PNG、WebP）');
            return;
        }

        newFiles.forEach(file => {
            const fileItem = {
                id: Date.now() + Math.random(),
                file: file,
                status: 'pending',
                originalSize: file.size,
                compressedSize: null,
                compressedBlob: null,
                preview: null
            };

            this.files.push(fileItem);
            this.createFilePreview(fileItem);
            this.renderFileItem(fileItem);
        });

        this.pendingCount = this.files.filter(f => f.status === 'pending').length;
        this.updateStats();
        document.getElementById('fileList').style.display = 'block';
    }

    createFilePreview(fileItem) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fileItem.preview = e.target.result;
            const img = document.querySelector(`[data-file-id="${fileItem.id}"] .file-preview`);
            if (img) img.src = e.target.result;
        };
        reader.readAsDataURL(fileItem.file);
    }

    renderFileItem(fileItem) {
        const listBody = document.getElementById('listBody');
        const fileItemEl = document.createElement('div');
        fileItemEl.className = 'file-item';
        fileItemEl.setAttribute('data-file-id', fileItem.id);

        fileItemEl.innerHTML = `
            <img class="file-preview" src="" alt="Preview">
            <div class="file-info">
                <div class="file-name">${fileItem.file.name}</div>
                <div class="file-size">
                    原始大小: ${this.formatFileSize(fileItem.originalSize)}
                    ${fileItem.compressedSize ? `<br><span class="compressed">壓縮後: ${this.formatFileSize(fileItem.compressedSize)}</span>` : ''}
                </div>
                ${fileItem.compressedSize ? `<div class="size-reduction">節省 ${this.calculateReduction(fileItem)}%</div>` : ''}
            </div>
            <div class="file-status ${fileItem.status}">${this.getStatusText(fileItem.status)}</div>
            <div class="file-actions">
                <button class="btn-download" ${fileItem.status !== 'completed' ? 'disabled' : ''}>下載</button>
            </div>
        `;

        // 下載按鈕事件
        const downloadBtn = fileItemEl.querySelector('.btn-download');
        downloadBtn.addEventListener('click', () => this.downloadFile(fileItem));

        listBody.appendChild(fileItemEl);
    }

    async compressAll() {
        const pendingFiles = this.files.filter(f => f.status === 'pending');

        for (const fileItem of pendingFiles) {
            await this.compressFile(fileItem);
        }
    }

    async compressFile(fileItem) {
        fileItem.status = 'compressing';
        this.updateFileItem(fileItem);

        try {
            const compressedBlob = await this.compressImage(fileItem.file);
            fileItem.compressedBlob = compressedBlob;
            fileItem.compressedSize = compressedBlob.size;
            fileItem.status = 'completed';

            this.pendingCount--;
            this.completedCount++;
            this.updateStats();
            this.updateFileItem(fileItem);
        } catch (error) {
            console.error('壓縮失敗:', error);
            alert(`壓縮 ${fileItem.file.name} 時發生錯誤`);
            fileItem.status = 'pending';
            this.updateFileItem(fileItem);
        }
    }

    compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 計算尺寸
                    let width = img.width;
                    let height = img.height;

                    if (this.resizeWidth !== 'original') {
                        const targetWidth = parseInt(this.resizeWidth);
                        if (width > targetWidth) {
                            height = (height * targetWidth) / width;
                            width = targetWidth;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // 繪製圖片
                    ctx.drawImage(img, 0, 0, width, height);

                    // 轉換為 Blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('轉換失敗'));
                            }
                        },
                        file.type,
                        this.quality / 100
                    );
                };

                img.onerror = () => reject(new Error('圖片載入失敗'));
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('文件讀取失敗'));
            reader.readAsDataURL(file);
        });
    }

    updateFileItem(fileItem) {
        const fileItemEl = document.querySelector(`[data-file-id="${fileItem.id}"]`);
        if (!fileItemEl) return;

        // 更新文件大小信息
        const fileSizeEl = fileItemEl.querySelector('.file-size');
        let sizeHTML = `原始大小: ${this.formatFileSize(fileItem.originalSize)}`;
        if (fileItem.compressedSize) {
            sizeHTML += `<br><span class="compressed">壓縮後: ${this.formatFileSize(fileItem.compressedSize)}</span>`;
        }
        fileSizeEl.innerHTML = sizeHTML;

        // 更新節省百分比
        const fileInfo = fileItemEl.querySelector('.file-info');
        const existingReduction = fileInfo.querySelector('.size-reduction');
        if (existingReduction) existingReduction.remove();

        if (fileItem.compressedSize) {
            const reduction = document.createElement('div');
            reduction.className = 'size-reduction';
            reduction.textContent = `節省 ${this.calculateReduction(fileItem)}%`;
            fileInfo.appendChild(reduction);
        }

        // 更新狀態
        const statusEl = fileItemEl.querySelector('.file-status');
        statusEl.className = `file-status ${fileItem.status}`;
        statusEl.textContent = this.getStatusText(fileItem.status);

        // 更新下載按鈕
        const downloadBtn = fileItemEl.querySelector('.btn-download');
        downloadBtn.disabled = fileItem.status !== 'completed';
    }

    downloadFile(fileItem) {
        if (!fileItem.compressedBlob) return;

        const url = URL.createObjectURL(fileItem.compressedBlob);
        const a = document.createElement('a');
        a.href = url;

        // 生成新文件名
        const originalName = fileItem.file.name;
        const nameParts = originalName.split('.');
        const extension = nameParts.pop();
        const baseName = nameParts.join('.');
        a.download = `${baseName}_compressed.${extension}`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearAll() {
        if (confirm('確定要清空所有文件嗎？')) {
            this.files = [];
            this.pendingCount = 0;
            this.completedCount = 0;
            document.getElementById('listBody').innerHTML = '';
            document.getElementById('fileList').style.display = 'none';
            this.updateStats();
        }
    }

    updateStats() {
        document.getElementById('pending-count').textContent = this.pendingCount;
        document.getElementById('completed-count').textContent = this.completedCount;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    calculateReduction(fileItem) {
        if (!fileItem.compressedSize) return 0;
        const reduction = ((fileItem.originalSize - fileItem.compressedSize) / fileItem.originalSize) * 100;
        return Math.max(0, Math.round(reduction));
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': '待壓縮',
            'compressing': '壓縮中',
            'completed': '已完成'
        };
        return statusTexts[status] || status;
    }
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
    new ImageCompressor();
});
