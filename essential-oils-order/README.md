# 精油訂購系統 Essential Oils Order System

一個使用 Google Apps Script 開發的精油訂購系統，支援多語言顯示（繁體中文、拉丁文、法文），訂單資料自動儲存到 Google Sheets。

## 📚 文件導覽

- **README.md** - 專案概述和功能說明（本文件）
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 詳細的部署步驟和常見問題
- **[ADMIN_ACCOUNT_SETUP.md](ADMIN_ACCOUNT_SETUP.md)** - 管理帳號設定說明
- **[OAUTH_LOGIN_GUIDE.md](OAUTH_LOGIN_GUIDE.md)** - OAuth 登入功能說明與設定指南
- **[DEPLOY_WITH_ADMIN_ACCOUNT.md](DEPLOY_WITH_ADMIN_ACCOUNT.md)** - 使用管理帳號部署指南（推薦！）
- **[CLEANUP_OLD_DEPLOYMENT.md](CLEANUP_OLD_DEPLOYMENT.md)** - 清理舊部署指南

## 🔐 管理帳號與資料夾

本系統已配置：
- **管理帳號**：`hello2paris@gmail.com`
- **資料夾名稱**：「精油訂購APP」

### 💾 資料儲存方式（兩種選擇）

#### 方式 1：直接儲存在管理帳號（推薦）✨
- 使用 `hello2paris@gmail.com` 帳號部署應用
- 所有資料直接儲存在該帳號的 Google Drive 中
- 資料位置：`hello2paris@gmail.com` 的 Drive → `精油訂購APP` 資料夾
- **部署指南**：請參考 [DEPLOY_WITH_ADMIN_ACCOUNT.md](DEPLOY_WITH_ADMIN_ACCOUNT.md)

#### 方式 2：部署後共享給管理帳號
- 使用任何 Google 帳號部署應用
- 資料儲存在部署者的 Drive 中
- 系統會自動共享給 `hello2paris@gmail.com`
- **部署指南**：請參考 [DEPLOYMENT.md](DEPLOYMENT.md) 和 [ADMIN_ACCOUNT_SETUP.md](ADMIN_ACCOUNT_SETUP.md)

## 功能特色

### 🔐 安全登入系統（NEW! v2.0）
- **Google OAuth 2.0 登入**：完整的 OAuth 2.0 認證流程
- **登入頁面**：美觀的登入介面，支援 Google 帳號
- **用戶資訊顯示**：登入後顯示用戶 Email 和登出按鈕
- **登出功能**：完善的登出流程和說明
- **Facebook 登入**：預留接口，待實作（按鈕已顯示為「即將推出」）

### 🌿 訂購功能
- **多語言精油資訊**：包含繁體中文名稱、拉丁文學名、法文名稱
- **多尺寸選擇**：支援不同容量（5ml、10ml、30ml）
- **即時價格計算**：根據選擇的尺寸和數量自動計算價格
- **購物車功能**：可以選擇多種精油後一次結帳
- **訂單來源追蹤**：每筆訂單都會記錄登入帳號

### 📊 管理功能
- **自動記錄到 Google Sheets**：訂單自動儲存，方便管理和追蹤
- **產品列表可自訂**：精油產品清單可從 Google Sheet 讀取，方便更新
- **自動資料夾管理**：所有 Sheets 自動整理到指定資料夾
- **多人協作**：自動共享給管理帳號

### 🎨 使用者體驗
- **響應式設計**：支援桌面和行動裝置
- **美觀介面**：漸變背景、圓角設計、流暢動畫
- **即時反饋**：操作成功/失敗都有明確提示

## 內建精油清單

1. 薰衣草 (Lavandula angustifolia / Lavande)
2. 茶樹 (Melaleuca alternifolia / Tea Tree)
3. 尤加利 (Eucalyptus globulus / Eucalyptus)
4. 薄荷 (Mentha piperita / Menthe poivrée)
5. 檸檬 (Citrus limon / Citron)
6. 甜橙 (Citrus sinensis / Orange douce)
7. 迷迭香 (Rosmarinus officinalis / Romarin)
8. 乳香 (Boswellia carterii / Encens)

## 部署步驟

### 1. 安裝 Clasp

```bash
npm install -g @google/clasp
```

### 2. 登入 Google 帳號

```bash
clasp login
```

### 3. 建立新的 Apps Script 專案

在專案目錄中執行：

```bash
cd gas/essential-oils-order
clasp create --title "精油訂購系統" --type webapp
```

這會在當前目錄生成 `.clasp.json` 文件，其中包含 `scriptId`。

### 4. 推送程式碼到 Google Apps Script

```bash
clasp push
```

### 5. 部署 Web App

```bash
clasp deploy --description "精油訂購系統 v1.0"
```

### 6. 開啟 Apps Script 編輯器

```bash
clasp open
```

在瀏覽器中會開啟 Google Apps Script 編輯器。

### 7. 部署為 Web 應用程式

1. 在 Apps Script 編輯器中，點擊右上角的「部署」→「新增部署作業」
2. 選擇類型：「網頁應用程式」
3. 設定：
   - 描述：精油訂購系統
   - 執行身分：我
   - 具有存取權的使用者：任何人
4. 點擊「部署」
5. 複製「網頁應用程式」的 URL，這就是你的訂購系統網址

## 設定 Google Sheets

系統使用兩個 Google Sheets：
1. **訂單記錄表** - 儲存客戶訂單
2. **產品列表表** - 儲存精油產品資訊

**重要**：所有自動創建的 Google Sheets 都會：
1. 自動放在「精油訂購APP」資料夾中
2. 自動共享給管理帳號 `hello2paris@gmail.com`

這確保所有資料都在管理帳號的 Drive 中，並且集中在同一個資料夾，方便管理。

### 方式一：自動創建（推薦）

首次使用時：
- 訂單記錄表會在第一筆訂單建立時自動創建，並自動移動到「精油訂購APP」資料夾，然後共享給 `hello2paris@gmail.com`
- 產品列表如未設定，系統會使用內建的預設清單
- 如需創建產品列表，執行 `createProductListSheet` 函數會自動放在資料夾中並共享給管理帳號
- 如果「精油訂購APP」資料夾不存在，系統會自動創建

### 方式二：手動設定

#### 1. 創建產品列表 Sheet

在 Apps Script 編輯器中：
1. 開啟 Apps Script 編輯器：`clasp open`
2. 點擊「執行」→ 選擇 `createProductListSheet` 函數
3. 授權執行
4. 查看執行日誌，複製顯示的 Sheet ID
5. 在 `Code.gs` 第 7 行設定：

```javascript
const PRODUCT_SHEET_ID = '你的產品列表Sheet ID';
```

6. 重新推送程式碼：`clasp push`

#### 2. 產品列表 Sheet 格式

產品列表 Sheet 需要包含以下欄位（第一行為標題）：

| 中文名稱 | 拉丁文名稱 | 法文名稱 | 尺寸1 | 價格1 | 尺寸2 | 價格2 | 尺寸3 | 價格3 |
|---------|----------|---------|------|------|------|------|------|------|
| 薰衣草 | Lavandula angustifolia | Lavande | 5ml | 300 | 10ml | 500 | 30ml | 1200 |
| 茶樹 | Melaleuca alternifolia | Tea Tree | 5ml | 250 | 10ml | 450 | 30ml | 1000 |

**注意事項**：
- Sheet 名稱必須為「產品列表」
- 可以有 1-4 組尺寸和價格
- 價格必須是數字（不含貨幣符號）
- 尺寸格式建議：5ml, 10ml, 30ml 等

#### 3. 設定訂單記錄 Sheet（選用）

如果你想使用現有的 Google Sheet 來記錄訂單：

1. 在 Google Drive 中建立一個 Google Sheet
2. 複製 Sheet 的 ID（URL 中 `/d/` 和 `/edit` 之間的字串）
3. 在 `Code.gs` 文件的第 6 行設定：

```javascript
const ORDER_SHEET_ID = '你的訂單記錄Sheet ID';
```

4. 重新推送程式碼：`clasp push`

## 資料結構

### 訂單記錄表格式

訂單資料會以下列格式儲存到 Google Sheet：

| 欄位 | 說明 |
|------|------|
| 訂單時間 | 下單時間戳記 |
| 登入帳號 | 下單者的 Google 帳號 Email |
| 客戶姓名 | 顧客姓名 |
| 聯絡電話 | 聯絡電話 |
| 電子郵件 | Email 地址 |
| 配送地址 | 配送地址 |
| 精油名稱（中文） | 精油的繁體中文名稱 |
| 精油名稱（拉丁文） | 精油的拉丁文學名 |
| 精油名稱（法文） | 精油的法文名稱 |
| 尺寸 | 選擇的容量大小 |
| 數量 | 訂購數量 |
| 單價 | 單一商品價格 |
| 小計 | 該項商品總價 |
| 訂單總額 | 整張訂單的總金額 |
| 備註 | 客戶備註 |

### 產品列表表格式

| 欄位 | 說明 |
|------|------|
| 中文名稱 | 精油的繁體中文名稱 |
| 拉丁文名稱 | 精油的拉丁文學名 |
| 法文名稱 | 精油的法文名稱 |
| 尺寸1, 尺寸2... | 可販售的容量大小（如 5ml, 10ml） |
| 價格1, 價格2... | 對應尺寸的價格 |

## 常用 Clasp 指令

```bash
# 查看專案資訊
clasp info

# 推送程式碼
clasp push

# 拉取程式碼
clasp pull

# 查看部署列表
clasp deployments

# 開啟 Apps Script 編輯器
clasp open

# 查看日誌
clasp logs
```

## 自訂精油清單

有兩種方式可以更新精油產品列表：

### 方式一：使用 Google Sheet（推薦）

1. 在 Apps Script 編輯器中執行 `createProductListSheet()` 函數創建產品列表模板
2. 在 Google Sheets 中直接編輯產品資料
3. 系統會自動從 Sheet 讀取最新的產品列表
4. 無需重新部署程式碼

**優點**：
- 可以隨時更新產品和價格
- 不需要懂程式碼
- 支援多人協作管理

### 方式二：修改程式碼

如果不想使用 Google Sheet，可以直接修改 `Code.gs` 中的 `getDefaultEssentialOils()` 函數。

新增產品範例：

```javascript
{
  id: 9,
  nameCh: '玫瑰',
  nameLatin: 'Rosa damascena',
  nameFr: 'Rose',
  sizes: ['5ml', '10ml'],
  prices: [1200, 2200]
}
```

修改後需要重新推送：`clasp push`

## 技術規格

- **前端**：HTML5, CSS3, JavaScript
- **後端**：Google Apps Script
- **資料庫**：Google Sheets
- **認證**：Google OAuth 2.0（透過 Session.getActiveUser()）
- **部署工具**：Clasp (Command Line Apps Script Projects)

## 版本更新

### Version 2.0 (2026-01-11) - OAuth 登入系統
- ✅ 新增獨立的登入頁面（Login.html）
- ✅ 實作完整的 Google OAuth 2.0 登入流程
- ✅ 新增用戶資訊顯示欄
- ✅ 新增登出功能和登出說明頁面
- ✅ 改進 URL 路由系統（支援 ?page=login 和 ?page=logout）
- ✅ 預留 Facebook 登入接口（UI 已完成，後端待實作）
- ✅ 新增完整的 OAuth 登入功能文檔（OAUTH_LOGIN_GUIDE.md）
- ✅ 改進安全性：未登入用戶無法訪問訂購頁面

### Version 1.0 - 基礎訂購系統
- 基本的精油訂購功能
- Google Sheets 資料儲存
- 產品列表管理
- 購物車功能
- 訂單記錄

## 快速開始

1. **安裝依賴**
   ```bash
   npm install -g @google/clasp
   ```

2. **登入 Google**
   ```bash
   clasp login
   ```

3. **推送程式碼**
   ```bash
   cd essential-oils-order
   clasp push
   ```

4. **部署應用**
   - 執行 `clasp open` 開啟 Apps Script 編輯器
   - 點擊「部署」→「新增部署作業」
   - 選擇「網頁應用程式」
   - 設定權限後取得 Web App URL

5. **開始使用**
   - 訪問 Web App URL
   - 使用 Google 帳號登入
   - 開始訂購精油

詳細部署步驟請參考 [DEPLOYMENT.md](DEPLOYMENT.md)
登入功能設定請參考 [OAUTH_LOGIN_GUIDE.md](OAUTH_LOGIN_GUIDE.md)

## 授權

MIT License

## 作者

VibeCoding Project

---

**最後更新**: 2026-01-11
**版本**: 2.0 - OAuth Login System
