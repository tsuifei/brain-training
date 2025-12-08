class WavToMp3Converter {
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
        this.bitrateSelect = document.getElementById('bitrate');
        this.pendingCount = document.getElementById('pending-count');
        this.completedCount = document.getElementById('completed-count');

        this.attachEventListeners();
    }

    attachEventListeners() {
        // 點擊選擇文件按鈕
        this.selectFilesBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            e.preventDefault(); // 防止默認行為
            this.fileInput.click();
        });

        // 文件選擇
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(Array.from(e.target.files));
            e.target.value = ''; // 重置以允許重複選擇
        });

        // 拖拽區域點擊事件（不包括按鈕）
        this.uploadArea.addEventListener('click', (e) => {
            // 如果點擊的是按鈕或按鈕內部元素，直接返回
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
                file.name.toLowerCase().endsWith('.wav')
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
            alert('請選擇 WAV 文件');
            return;
        }

        fileList.forEach(file => {
            if (!file.name.toLowerCase().endsWith('.wav')) {
                alert(`${file.name} 不是 WAV 文件，已跳過`);
                return;
            }

            const fileObj = {
                id: this.fileIdCounter++,
                file: file,
                name: file.name,
                size: file.size,
                status: 'pending',
                progress: 0,
                mp3Blob: null
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

        fileItem.innerHTML = `
            <div class="file-icon">WAV</div>
            <div class="file-info">
                <div class="file-name">${fileObj.name}</div>
                <div class="file-meta">
                    <span>${this.formatFileSize(fileObj.size)}</span>
                    <span>比特率: ${this.bitrateSelect.value} kbps</span>
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
            const mp3Name = fileObj.name.replace(/\.wav$/i, '.mp3');
            statusHTML = `
                <span class="status-badge completed">完成</span>
                <button class="btn-download" onclick="converter.downloadFile(${fileObj.id})">下載 MP3</button>
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

        // 只有手動點擊轉換按鈕時才顯示完成提示
        if (!autoConvert) {
            alert('所有文件轉換完成！');
        }
    }

    async convertFile(fileObj) {
        try {
            fileObj.status = 'converting';
            fileObj.progress = 0;
            this.updateFileItem(fileObj);

            const arrayBuffer = await fileObj.file.arrayBuffer();
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // 獲取音頻數據
            const samples = this.getChannelData(audioBuffer);
            const sampleRate = audioBuffer.sampleRate;
            const bitrate = parseInt(this.bitrateSelect.value);

            // 更新進度
            fileObj.progress = 30;
            this.updateFileItem(fileObj);

            // 使用 lamejs 進行 MP3 編碼
            const mp3Data = this.encodeMp3(samples, sampleRate, bitrate, (progress) => {
                fileObj.progress = 30 + (progress * 0.7);
                this.updateFileItem(fileObj);
            });

            // 創建 Blob
            const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
            fileObj.mp3Blob = mp3Blob;
            fileObj.status = 'completed';
            fileObj.progress = 100;

            this.updateFileItem(fileObj);
            this.updateStats();

        } catch (error) {
            console.error('轉換錯誤:', error);
            fileObj.status = 'error';
            this.updateFileItem(fileObj);
            alert(`轉換失敗: ${fileObj.name}\n錯誤: ${error.message}`);
        }
    }

    getChannelData(audioBuffer) {
        const channels = audioBuffer.numberOfChannels;
        const samples = [];

        if (channels === 2) {
            // 立體聲
            const left = audioBuffer.getChannelData(0);
            const right = audioBuffer.getChannelData(1);
            samples.push(this.convertFloat32ToInt16(left));
            samples.push(this.convertFloat32ToInt16(right));
        } else {
            // 單聲道
            const channel = audioBuffer.getChannelData(0);
            const int16 = this.convertFloat32ToInt16(channel);
            samples.push(int16);
            samples.push(int16); // 複製到右聲道
        }

        return samples;
    }

    convertFloat32ToInt16(buffer) {
        const l = buffer.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            const s = Math.max(-1, Math.min(1, buffer[i]));
            int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16;
    }

    encodeMp3(channels, sampleRate, bitrate, progressCallback) {
        const mp3encoder = new lamejs.Mp3Encoder(2, sampleRate, bitrate);
        const mp3Data = [];

        const sampleBlockSize = 1152;
        const leftChannel = channels[0];
        const rightChannel = channels[1];

        for (let i = 0; i < leftChannel.length; i += sampleBlockSize) {
            const leftChunk = leftChannel.subarray(i, i + sampleBlockSize);
            const rightChunk = rightChannel.subarray(i, i + sampleBlockSize);

            const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
            if (mp3buf.length > 0) {
                mp3Data.push(mp3buf);
            }

            // 更新進度
            if (progressCallback) {
                const progress = (i / leftChannel.length);
                progressCallback(progress);
            }
        }

        // 完成編碼
        const mp3buf = mp3encoder.flush();
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
        }

        if (progressCallback) {
            progressCallback(1);
        }

        return mp3Data;
    }

    downloadFile(fileId) {
        const fileObj = this.files.find(f => f.id === fileId);
        if (!fileObj || !fileObj.mp3Blob) {
            alert('文件不存在或未轉換');
            return;
        }

        const url = URL.createObjectURL(fileObj.mp3Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileObj.name.replace(/\.wav$/i, '.mp3');
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
    converter = new WavToMp3Converter();
});
