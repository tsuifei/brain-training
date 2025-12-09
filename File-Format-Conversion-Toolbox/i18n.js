// 多語言翻譯系統
const translations = {
    'zh-TW': {
        // Header
        'title': 'File Format Conversion Toolbox',
        'subtitle': '檔案格式轉換工具箱',
        'badge.browser': '100% 瀏覽器端處理',
        'badge.privacy': '隱私安全',

        // Intro
        'intro.title': '專業的線上檔案格式轉換工具集',
        'intro.description': '所有轉換均在您的瀏覽器中完成，文件不會上傳到任何伺服器，保護您的隱私安全',

        // WAV to MP3 Tool
        'tool.wav.title': 'WAV to MP3',
        'tool.wav.status': '可用',
        'tool.wav.description': '將 WAV 音訊檔案轉換為 MP3 格式，支援批量轉換和自訂音質設定（128-320 kbps）',
        'tool.wav.feature1': '批量轉換',
        'tool.wav.feature2': '音質設定',
        'tool.wav.feature3': '拖曳上傳',
        'tool.wav.meta': '即時轉換',
        'tool.wav.launch': '啟動工具',

        // Image to WebP Tool
        'tool.image.title': 'PNG / JPG to WebP',
        'tool.image.status': '可用',
        'tool.image.description': '將 PNG、JPG 圖片轉換為 WebP 格式，支援批量轉換和自訂輸出寬度（800-1920px）',
        'tool.image.feature1': '批量轉換',
        'tool.image.feature2': '尺寸調整',
        'tool.image.feature3': '品質設定',
        'tool.image.meta': '即時轉換',
        'tool.image.launch': '啟動工具',

        // PDF Tool (Coming Soon)
        'tool.pdf.title': 'PDF Converter',
        'tool.pdf.status': '即將推出',
        'tool.pdf.description': 'PDF 與其他文件格式互相轉換',

        // Footer
        'footer.about.title': '關於工具箱',
        'footer.about.description': '提供各種檔案格式轉換工具，完全在瀏覽器端處理，無需上傳文件到伺服器',
        'footer.features.title': '特色',
        'footer.features.1': '100% 瀏覽器端處理',
        'footer.features.2': '完全免費使用',
        'footer.features.3': '隱私安全保護',
        'footer.features.4': '無文件大小限制',
        'footer.tech.title': '技術支援',
        'footer.tech.description': '使用現代瀏覽器以獲得最佳體驗<br>推薦：Chrome, Firefox, Safari, Edge',
        'footer.copyright': '2024 VibeCoding | Created with ❤️ by TsuiFei',
        'footer.privacy': '純瀏覽器端處理，您的文件不會上傳到服務器 | 隱私安全',

        // Skip to main
        'skip.main': '跳至主要內容',

        // Back to toolbox
        'back.toolbox': '← 回到工具總表',

        // Tool Page - WAV to MP3
        'wav.page.title': 'WAV to MP3 轉換器',
        'wav.bitrate.label': '音質設定 (Bitrate)',
        'wav.bitrate.128': '128 kbps (標準)',
        'wav.bitrate.192': '192 kbps (高品質)',
        'wav.bitrate.256': '256 kbps (極高品質)',
        'wav.bitrate.320': '320 kbps (最高品質)',
        'wav.stats.pending': '待轉換:',
        'wav.stats.completed': '已完成:',
        'wav.upload.title': '拖曳 WAV 文件到此處',
        'wav.upload.or': '或',
        'wav.upload.select': '選擇文件',
        'wav.upload.hint': '支援批量上傳多個 WAV 文件',
        'wav.list.title': '轉換列表',
        'wav.list.clear': '清空列表',
        'wav.list.convert': '開始轉換',
        'wav.back': '返回工具箱',

        // Tool Page - Image to WebP
        'image.page.title': 'Image to WebP 轉換器',
        'image.page.subtitle': 'PNG / JPG 轉 WebP 格式',
        'image.width.label': '輸出寬度 (Output Width)',
        'image.width.original': '原始尺寸',
        'image.quality.label': '圖片品質 (Quality)',
        'image.quality.70': '70% (較小檔案)',
        'image.quality.80': '80% (平衡)',
        'image.quality.90': '90% (高品質)',
        'image.quality.100': '100% (最高品質)',
        'image.upload.title': '拖曳圖片到此處',
        'image.upload.select': '選擇圖片',
        'image.upload.hint': '支援 PNG、JPG 格式，可批量上傳',
        'image.list.title': '轉換列表',
        'image.list.clear': '清空列表',
        'image.list.convert': '開始轉換',
        'image.back': '返回工具箱',
    },

    'en': {
        // Header
        'title': 'File Format Conversion Toolbox',
        'subtitle': 'File Format Conversion Toolbox',
        'badge.browser': '100% Browser-side Processing',
        'badge.privacy': 'Privacy Secured',

        // Intro
        'intro.title': 'Professional Online File Format Conversion Tools',
        'intro.description': 'All conversions are completed in your browser, files are never uploaded to any server, protecting your privacy',

        // WAV to MP3 Tool
        'tool.wav.title': 'WAV to MP3',
        'tool.wav.status': 'Available',
        'tool.wav.description': 'Convert WAV audio files to MP3 format, supports batch conversion and custom quality settings (128-320 kbps)',
        'tool.wav.feature1': 'Batch Conversion',
        'tool.wav.feature2': 'Quality Settings',
        'tool.wav.feature3': 'Drag & Drop',
        'tool.wav.meta': 'Instant Conversion',
        'tool.wav.launch': 'Launch Tool',

        // Image to WebP Tool
        'tool.image.title': 'PNG / JPG to WebP',
        'tool.image.status': 'Available',
        'tool.image.description': 'Convert PNG, JPG images to WebP format, supports batch conversion and custom output width (800-1920px)',
        'tool.image.feature1': 'Batch Conversion',
        'tool.image.feature2': 'Size Adjustment',
        'tool.image.feature3': 'Quality Settings',
        'tool.image.meta': 'Instant Conversion',
        'tool.image.launch': 'Launch Tool',

        // PDF Tool (Coming Soon)
        'tool.pdf.title': 'PDF Converter',
        'tool.pdf.status': 'Coming Soon',
        'tool.pdf.description': 'Convert between PDF and other document formats',

        // Footer
        'footer.about.title': 'About Toolbox',
        'footer.about.description': 'Provides various file format conversion tools, fully browser-side processing, no need to upload files to servers',
        'footer.features.title': 'Features',
        'footer.features.1': '100% Browser-side Processing',
        'footer.features.2': 'Completely Free',
        'footer.features.3': 'Privacy Protected',
        'footer.features.4': 'No File Size Limits',
        'footer.tech.title': 'Technical Support',
        'footer.tech.description': 'Use modern browsers for the best experience<br>Recommended: Chrome, Firefox, Safari, Edge',
        'footer.copyright': '2024 VibeCoding | Created with ❤️ by TsuiFei',
        'footer.privacy': 'Pure browser-side processing, your files are never uploaded to servers | Privacy Secured',

        // Skip to main
        'skip.main': 'Skip to main content',

        // Back to toolbox
        'back.toolbox': '← Back to Toolbox',

        // Tool Page - WAV to MP3
        'wav.page.title': 'WAV to MP3 Converter',
        'wav.bitrate.label': 'Quality Settings (Bitrate)',
        'wav.bitrate.128': '128 kbps (Standard)',
        'wav.bitrate.192': '192 kbps (High Quality)',
        'wav.bitrate.256': '256 kbps (Very High Quality)',
        'wav.bitrate.320': '320 kbps (Maximum Quality)',
        'wav.stats.pending': 'Pending:',
        'wav.stats.completed': 'Completed:',
        'wav.upload.title': 'Drag WAV files here',
        'wav.upload.or': 'or',
        'wav.upload.select': 'Select Files',
        'wav.upload.hint': 'Supports batch uploading of multiple WAV files',
        'wav.list.title': 'Conversion List',
        'wav.list.clear': 'Clear All',
        'wav.list.convert': 'Start Conversion',
        'wav.back': 'Back to Toolbox',

        // Tool Page - Image to WebP
        'image.page.title': 'Image to WebP Converter',
        'image.page.subtitle': 'PNG / JPG to WebP Format',
        'image.width.label': 'Output Width',
        'image.width.original': 'Original Size',
        'image.quality.label': 'Image Quality',
        'image.quality.70': '70% (Smaller File)',
        'image.quality.80': '80% (Balanced)',
        'image.quality.90': '90% (High Quality)',
        'image.quality.100': '100% (Maximum Quality)',
        'image.upload.title': 'Drag images here',
        'image.upload.select': 'Select Images',
        'image.upload.hint': 'Supports PNG, JPG formats, batch upload available',
        'image.list.title': 'Conversion List',
        'image.list.clear': 'Clear All',
        'image.list.convert': 'Start Conversion',
        'image.back': 'Back to Toolbox',
    },

    'fr': {
        // Header
        'title': 'File Format Conversion Toolbox',
        'subtitle': 'Boîte à outils de conversion de format de fichier',
        'badge.browser': 'Traitement 100% côté navigateur',
        'badge.privacy': 'Confidentialité sécurisée',

        // Intro
        'intro.title': 'Outils professionnels de conversion de formats de fichiers en ligne',
        'intro.description': 'Toutes les conversions sont effectuées dans votre navigateur, les fichiers ne sont jamais téléchargés vers un serveur, protégeant votre confidentialité',

        // WAV to MP3 Tool
        'tool.wav.title': 'WAV en MP3',
        'tool.wav.status': 'Disponible',
        'tool.wav.description': 'Convertir les fichiers audio WAV en format MP3, prend en charge la conversion par lots et les paramètres de qualité personnalisés (128-320 kbps)',
        'tool.wav.feature1': 'Conversion par lots',
        'tool.wav.feature2': 'Paramètres de qualité',
        'tool.wav.feature3': 'Glisser-déposer',
        'tool.wav.meta': 'Conversion instantanée',
        'tool.wav.launch': 'Lancer l\'outil',

        // Image to WebP Tool
        'tool.image.title': 'PNG / JPG en WebP',
        'tool.image.status': 'Disponible',
        'tool.image.description': 'Convertir les images PNG, JPG en format WebP, prend en charge la conversion par lots et la largeur de sortie personnalisée (800-1920px)',
        'tool.image.feature1': 'Conversion par lots',
        'tool.image.feature2': 'Ajustement de taille',
        'tool.image.feature3': 'Paramètres de qualité',
        'tool.image.meta': 'Conversion instantanée',
        'tool.image.launch': 'Lancer l\'outil',

        // PDF Tool (Coming Soon)
        'tool.pdf.title': 'Convertisseur PDF',
        'tool.pdf.status': 'Bientôt disponible',
        'tool.pdf.description': 'Convertir entre PDF et d\'autres formats de documents',

        // Footer
        'footer.about.title': 'À propos de la boîte à outils',
        'footer.about.description': 'Fournit divers outils de conversion de formats de fichiers, traitement entièrement côté navigateur, pas besoin de télécharger des fichiers vers des serveurs',
        'footer.features.title': 'Caractéristiques',
        'footer.features.1': 'Traitement 100% côté navigateur',
        'footer.features.2': 'Complètement gratuit',
        'footer.features.3': 'Confidentialité protégée',
        'footer.features.4': 'Aucune limite de taille de fichier',
        'footer.tech.title': 'Support technique',
        'footer.tech.description': 'Utilisez des navigateurs modernes pour la meilleure expérience<br>Recommandé : Chrome, Firefox, Safari, Edge',
        'footer.copyright': '2024 VibeCoding | Créé avec ❤️ par TsuiFei',
        'footer.privacy': 'Traitement pur côté navigateur, vos fichiers ne sont jamais téléchargés vers des serveurs | Confidentialité sécurisée',

        // Skip to main
        'skip.main': 'Passer au contenu principal',

        // Back to toolbox
        'back.toolbox': '← Retour à la boîte à outils',

        // Tool Page - WAV to MP3
        'wav.page.title': 'Convertisseur WAV en MP3',
        'wav.bitrate.label': 'Paramètres de qualité (Débit binaire)',
        'wav.bitrate.128': '128 kbps (Standard)',
        'wav.bitrate.192': '192 kbps (Haute qualité)',
        'wav.bitrate.256': '256 kbps (Très haute qualité)',
        'wav.bitrate.320': '320 kbps (Qualité maximale)',
        'wav.stats.pending': 'En attente :',
        'wav.stats.completed': 'Terminé :',
        'wav.upload.title': 'Glissez les fichiers WAV ici',
        'wav.upload.or': 'ou',
        'wav.upload.select': 'Sélectionner les fichiers',
        'wav.upload.hint': 'Prend en charge le téléchargement par lots de plusieurs fichiers WAV',
        'wav.list.title': 'Liste de conversion',
        'wav.list.clear': 'Tout effacer',
        'wav.list.convert': 'Commencer la conversion',
        'wav.back': 'Retour à la boîte à outils',

        // Tool Page - Image to WebP
        'image.page.title': 'Convertisseur d\'image en WebP',
        'image.page.subtitle': 'PNG / JPG en format WebP',
        'image.width.label': 'Largeur de sortie',
        'image.width.original': 'Taille originale',
        'image.quality.label': 'Qualité de l\'image',
        'image.quality.70': '70% (Fichier plus petit)',
        'image.quality.80': '80% (Équilibré)',
        'image.quality.90': '90% (Haute qualité)',
        'image.quality.100': '100% (Qualité maximale)',
        'image.upload.title': 'Glissez les images ici',
        'image.upload.select': 'Sélectionner les images',
        'image.upload.hint': 'Prend en charge les formats PNG, JPG, téléchargement par lots disponible',
        'image.list.title': 'Liste de conversion',
        'image.list.clear': 'Tout effacer',
        'image.list.convert': 'Commencer la conversion',
        'image.back': 'Retour à la boîte à outils',
    }
};

// i18n 類別
class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'zh-TW';
        this.init();
    }

    init() {
        // 更新 HTML lang 屬性
        document.documentElement.lang = this.currentLanguage;

        // 翻譯頁面
        this.translatePage();

        // 設置語言切換器
        this.setupLanguageSwitcher();
    }

    translatePage() {
        // 翻譯所有帶有 data-i18n 屬性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            // 如果是 input 或 textarea，設置 placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        });

        // 翻譯所有帶有 data-i18n-attr 的屬性
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        attrElements.forEach(element => {
            const attrData = element.getAttribute('data-i18n-attr');
            const [attr, key] = attrData.split(':');
            element.setAttribute(attr, this.t(key));
        });
    }

    t(key) {
        return translations[this.currentLanguage][key] || key;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        this.translatePage();

        // 更新語言切換器的選中狀態
        this.updateLanguageSwitcher();
    }

    setupLanguageSwitcher() {
        const switcher = document.getElementById('languageSwitcher');
        if (switcher) {
            switcher.value = this.currentLanguage;
            switcher.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    updateLanguageSwitcher() {
        const switcher = document.getElementById('languageSwitcher');
        if (switcher) {
            switcher.value = this.currentLanguage;
        }
    }
}

// 頁面載入時初始化
let i18n;
document.addEventListener('DOMContentLoaded', () => {
    i18n = new I18n();
});
