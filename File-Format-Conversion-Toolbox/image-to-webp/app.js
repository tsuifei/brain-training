class ImageToWebPConverter {
    constructor() {
        this.files = [];
        this.fileIdCounter = 0;
        this.init();
    }

    init() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.selectFilesBtn = document.getElementById('selectFilesBtn');
        this.fileList = document.getElementById('fileList');
        this.listBody = document.getElementById('listBody');
        this.convertAllBtn = document.getElementById('convertAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.widthSelect = document.getElementById('width');
        this.qualitySelect = document.getElementById('quality');
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');

        this.attachEventListeners();
    }

    attachEventListeners() {
        // 點擊選擇文件按鈕
        this.selectFilesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.fileInput.click();
        });

        // 文件選擇
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files));
            e.target.value = '';
        });

        // 拖拽區域點擊事件
        this.uploadArea.addEventListener('click', (e) => {
            if (e.target === this.selectFilesBtn || this.selectFilesBtn.contains(e.target)) {
                return;
            }
            this.fileInput.click();
        });

        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('drag-over');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('drag-over');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('drag-over');
            const files = Array.from(e.dataTransfer.files).filter(file =>
                file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
            );
            this.handleFiles(files);
        });

        // 開始轉換所有文件
        this.convertAllBtn.addEventListener('click', () => {
            this.convertAll();
        });

        // 清空列表
        this.clearAllBtn.addEventListener('click', () => {
            this.clearAll();
        });
    }

    handleFiles(fileList) {
        if (fileList.length === 0) {
            alert('請選擇 PNG 或 JPG 圖片');
            return;
        }

        fileList.forEach(file => {
            if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                alert(`${file.name} 不是支援的圖片格式，已跳過`);
                return;
            }

            const fileObj = {
                id: this.fileIdCounter++,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'pending',
                progress: 0,
                webpBlob: null,
                originalWidth: 0,
                originalHeight: 0,
                targetWidth: 0,
                targetHeight: 0
            };

            this.files.push(fileObj);
            this.addFileToList(fileObj);
        });

        this.updateStats();
        this.showFileList();

        // 自動開始轉換
        this.convertAll(true);
    }

    addFileToList(fileObj) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.id = fileObj.id;

        // 創建預覽圖片
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            img.alt = fileObj.name;

            const iconElement = fileItem.querySelector('.file-icon');
            if (iconElement) {
                iconElement.replaceWith(img);
            }
        };
        reader.readAsDataURL(fileObj.file);

        const targetWidth = this.widthSelect.value;
        const widthText = targetWidth === 'original' ? '原始尺寸' : `${targetWidth} px`;

        fileItem.innerHTML = `
            <div class="file-icon">${fileObj.type.includes('png') ? 'PNG' : 'JPG'}</div>
            <div class="file-info">
                <div class="file-name">${fileObj.name}</div>
                <div class="file-meta">
                    <span>${this.formatFileSize(fileObj.size)}</span>
                    <span>目標寬度: ${widthText}</span>
                    <span>品質: ${parseInt(parseFloat(this.qualitySelect.value) * 100)}%</span>
                </div>
            </div>
            <div class="file-status">
                <span class="status-badge pending">等待中</span>
                <button class="btn-remove" onclick="converter.removeFile(${fileObj.id})">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
        `;

        this.listBody.appendChild(fileItem);
    }

    updateFileItem(fileObj) {
        const fileItem = document.querySelector(`[data-id="${fileObj.id}"]`);
        if (!fileItem) return;

        const statusElement = fileItem.querySelector('.file-status');
        let statusHTML = '';

        if (fileObj.status === 'pending') {
            statusHTML = `
                <span class="status-badge pending">等待中</span>
                <button class="btn-remove" onclick="converter.removeFile(${fileObj.id})">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
        } else if (fileObj.status === 'converting') {
            const progressPercent = Math.round(fileObj.progress);
            statusHTML = `
                <div class="converting-status">
                    <div class="converting-info">
                        <span class="status-badge converting">轉換中</span>
                        <span class="progress-text">${progressPercent}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${fileObj.progress}%"></div>
                    </div>
                </div>
                <div class="spinner"></div>
            `;
        } else if (fileObj.status === 'completed') {
            const sizeReduction = ((1 - fileObj.webpBlob.size / fileObj.size) * 100).toFixed(1);
            statusHTML = `
                <span class="status-badge completed">完成</span>
                <span class="file-meta" style="font-size: 12px;">減少 ${sizeReduction}%</span>
                <button class="btn-download" onclick="converter.downloadFile(${fileObj.id})">下載 WebP</button>
                <button class="btn-remove" onclick="converter.removeFile(${fileObj.id})">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
        } else if (fileObj.status === 'error') {
            statusHTML = `
                <span class="status-badge error">錯誤</span>
                <button class="btn-remove" onclick="converter.removeFile(${fileObj.id})">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `;
        }

        statusElement.innerHTML = statusHTML;
    }

    async convertAll(autoConvert = false) {
        const pendingFiles = this.files.filter(f => f.status === 'pending');

        if (pendingFiles.length === 0) {
            if (!autoConvert) {
                alert('沒有待轉換的文件');
            }
            return;
        }

        this.convertAllBtn.disabled = true;

        for (const fileObj of pendingFiles) {
            await this.convertFile(fileObj);
        }

        this.convertAllBtn.disabled = false;

        if (!autoConvert) {
            alert('所有圖片轉換完成！');
        }
    }

    async convertFile(fileObj) {
        try {
            fileObj.status = 'converting';
            fileObj.progress = 0;
            this.updateFileItem(fileObj);

            // 讀取圖片
            const img = await this.loadImage(fileObj.file);
            fileObj.originalWidth = img.width;
            fileObj.originalHeight = img.height;

            fileObj.progress = 20;
            this.updateFileItem(fileObj);

            // 計算目標尺寸
            const targetWidth = this.widthSelect.value;
            let newWidth, newHeight;

            if (targetWidth === 'original') {
                newWidth = img.width;
                newHeight = img.height;
            } else {
                const maxWidth = parseInt(targetWidth);

                // 如果原圖寬度小於目標寬度，使用原尺寸
                if (img.width <= maxWidth) {
                    newWidth = img.width;
                    newHeight = img.height;
                } else {
                    // 等比例縮放
                    newWidth = maxWidth;
                    newHeight = Math.round((img.height / img.width) * maxWidth);
                }
            }

            fileObj.targetWidth = newWidth;
            fileObj.targetHeight = newHeight;

            fileObj.progress = 40;
            this.updateFileItem(fileObj);

            // 轉換為 WebP
            const webpBlob = await this.convertToWebP(img, newWidth, newHeight);
            fileObj.webpBlob = webpBlob;

            fileObj.progress = 100;
            fileObj.status = 'completed';
            this.updateFileItem(fileObj);
            this.updateStats();

        } catch (error) {
            console.error('轉換錯誤:', error);
            fileObj.status = 'error';
            this.updateFileItem(fileObj);
            alert(`轉換失敗: ${fileObj.name}\n錯誤: ${error.message}`);
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error('無法載入圖片'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('無法讀取文件'));
            reader.readAsDataURL(file);
        });
    }

    convertToWebP(img, width, height) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const quality = parseFloat(this.qualitySelect.value);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('無法轉換為 WebP'));
                    }
                },
                'image/webp',
                quality
            );
        });
    }

    downloadFile(fileId) {
        const fileObj = this.files.find(f => f.id === fileId);
        if (!fileObj || !fileObj.webpBlob) {
            alert('文件不存在或未轉換');
            return;
        }

        const url = URL.createObjectURL(fileObj.webpBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileObj.name.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    removeFile(fileId) {
        const index = this.files.findIndex(f => f.id === fileId);
        if (index === -1) return;

        const fileItem = document.querySelector(`[data-id="${fileId}"]`);
        if (fileItem) {
            fileItem.remove();
        }

        this.files.splice(index, 1);
        this.updateStats();

        if (this.files.length === 0) {
            this.hideFileList();
        }
    }

    clearAll() {
        if (this.files.length === 0) return;

        if (!confirm('確定要清空所有文件嗎？')) {
            return;
        }

        this.files = [];
        this.listBody.innerHTML = '';
        this.hideFileList();
        this.updateStats();
    }

    updateStats() {
        const pending = this.files.filter(f => f.status === 'pending' || f.status === 'converting').length;
        const completed = this.files.filter(f => f.status === 'completed').length;

        this.pendingCount.textContent = pending;
        this.completedCount.textContent = completed;
    }

    showFileList() {
        this.fileList.style.display = 'block';
    }

    hideFileList() {
        this.fileList.style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// 初始化應用
let converter;
window.addEventListener('DOMContentLoaded', () => {
    converter = new ImageToWebPConverter();
});
