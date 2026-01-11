# 部署指南 Deployment Guide

這份文件提供詳細的部署步驟，幫助你快速將精油訂購系統部署到 Google Apps Script。

## 前置需求

1. **Node.js 和 npm**：確保已安裝 Node.js（建議版本 14 或以上）
2. **Google 帳號**：需要有 Google 帳號來使用 Apps Script
3. **Clasp CLI**：Google Apps Script 的命令列工具

## 重要說明：管理帳號和資料夾設定

**本系統已設定：**
- **管理帳號**：`hello2paris@gmail.com`（Code.gs 第 10 行）
- **資料夾名稱**：「精油訂購APP」（Code.gs 第 13 行）

**自動化處理：**
- 所有自動創建的 Google Sheets（訂單記錄表、產品列表表）都會自動放在「精油訂購APP」資料夾中
- 資料夾會自動共享給管理帳號
- 所有 Sheets 也會自動共享給管理帳號
- 這確保所有訂單資料都在 `hello2paris@gmail.com` 的 Drive 中集中管理

**修改設定：**
- 更改管理帳號：修改 `Code.gs` 第 10 行的 `ADMIN_EMAIL` 變數
- 更改資料夾名稱：修改 `Code.gs` 第 13 行的 `DRIVE_FOLDER_NAME` 變數

## 步驟 1：安裝 Clasp

如果尚未安裝 Clasp，請執行：

```bash
npm install -g @google/clasp
```

驗證安裝：

```bash
clasp --version
```

## 步驟 2：登入 Google 帳號

**建議使用 `hello2paris@gmail.com` 帳號登入**，這樣所有創建的資料都會直接在此帳號的 Drive 中：

```bash
clasp login
```

這會開啟瀏覽器視窗，請選擇 `hello2paris@gmail.com` 帳號登入並授權 Clasp 存取。

**注意**：
- 如果使用其他帳號部署，系統仍會自動將創建的 Sheets 共享給 `hello2paris@gmail.com`
- 但建議直接使用管理帳號部署，這樣所有資源（Apps Script 專案和 Sheets）都會在同一個帳號下

## 步驟 3：建立 Apps Script 專案

進入專案目錄：

```bash
cd gas/essential-oils-order
```

創建新的 Apps Script 專案：

```bash
clasp create --title "精油訂購系統" --type webapp
```

這會：
- 在 Google Drive 中創建一個新的 Apps Script 專案
- 生成 `.clasp.json` 文件並包含 `scriptId`

## 步驟 4：推送程式碼

將本地程式碼推送到 Google Apps Script：

```bash
clasp push
```

如果看到檔案列表，表示推送成功！

## 步驟 5：開啟 Apps Script 編輯器

```bash
clasp open
```

這會在瀏覽器中開啟 Google Apps Script 編輯器。

## 步驟 6：設定 Google Sheets（選用）

### 選項 A：使用自動創建（推薦給初學者）

不需要任何設定，系統會在：
- 第一筆訂單時自動創建訂單記錄表
- 使用內建的預設精油產品列表

### 選項 B：手動創建產品列表 Sheet

1. 在 Apps Script 編輯器中
2. 選擇函數：`createProductListSheet`
3. 點擊「執行」按鈕（▶️）
4. 首次執行需要授權，點擊「審查權限」
5. 選擇你的 Google 帳號
6. 點擊「進階」→「前往精油訂購系統（不安全）」
7. 點擊「允許」
8. 查看執行日誌（Ctrl+Enter 或 Cmd+Enter）
9. 複製顯示的 Sheet ID

10. 在 `Code.gs` 第 7 行更新：

```javascript
const PRODUCT_SHEET_ID = '你複製的Sheet ID';
```

11. 儲存並推送更新：

```bash
clasp push
```

## 步驟 7：部署為 Web 應用程式

### 方法 A：使用 Clasp 命令（快速）

```bash
clasp deploy --description "精油訂購系統 v1.0"
```

複製顯示的部署 ID。

### 方法 B：使用 Apps Script 介面（完整控制）

1. 在 Apps Script 編輯器中
2. 點擊右上角「部署」→「新增部署作業」
3. 點擊「選取類型」→「網頁應用程式」
4. 設定：
   - **說明**：精油訂購系統 v1.0
   - **執行身分**：我
   - **具有存取權的使用者**：任何人
5. 點擊「部署」
6. 複製「網頁應用程式」URL

**重要**：這個 URL 就是你的訂購系統網址！

## 步驟 8：測試系統

1. 開啟部署的 Web 應用程式 URL
2. 使用 Google 帳號登入
3. 確認可以看到：
   - 登入資訊顯示
   - 精油產品列表
   - 可以加入購物車
   - 可以提交訂單

## 步驟 9：更新和維護

### 更新程式碼

當你修改了程式碼後：

```bash
# 推送更新
clasp push

# 創建新的部署版本
clasp deploy --description "版本 1.1 - 新增功能"
```

### 查看部署列表

```bash
clasp deployments
```

### 查看執行日誌

```bash
clasp logs
```

### 撤銷部署

```bash
clasp undeploy <deploymentId>
```

## 常見問題

### Q1: 部署後看到「需要授權」

**A**: 這是正常的。第一次使用時：
1. 點擊「審查權限」
2. 選擇你的 Google 帳號
3. 點擊「進階」→「前往精油訂購系統（不安全）」
4. 點擊「允許」

### Q2: 推送時出現權限錯誤

**A**: 確認你已經登入：

```bash
clasp login --status
```

如果未登入，重新執行：

```bash
clasp login
```

### Q3: 如何更新產品列表？

**A**:
- 如果使用 Google Sheet：直接在 Sheet 中編輯即可，無需重新部署
- 如果使用程式碼：修改 `getDefaultEssentialOils()` 函數後執行 `clasp push`

### Q4: 訂單記錄在哪裡？

**A**:
- 第一筆訂單提交後會自動創建 Google Sheet
- Sheet 名稱：「精油訂單記錄」
- 自動放在「精油訂購APP」資料夾中
- 自動共享給 `hello2paris@gmail.com`
- 在 `hello2paris@gmail.com` 的 Google Drive 中找到「精油訂購APP」資料夾即可
- 或查看 Apps Script 執行日誌中的 Sheet URL

### Q5: 如何分享訂購系統網址？

**A**:
部署後的 Web 應用程式 URL 可以直接分享給任何人。URL 格式：
```
https://script.google.com/macros/s/xxxxx/exec
```

### Q6: 可以自訂網址嗎？

**A**:
Google Apps Script 不支援自訂網址，但你可以：
1. 使用短網址服務（如 bit.ly）
2. 將 URL 嵌入到你的網站中（使用 iframe）

## 進階設定

### 使用版本控制

建議將 `.clasp.json` 中的 `scriptId` 加入 `.gitignore`：

```bash
# 已包含在 .gitignore 中
.clasp.json
```

團隊成員需要各自創建自己的 Apps Script 專案來測試。

### 設定環境變數

如果需要不同環境（開發/生產），可以：
1. 創建多個 Apps Script 專案
2. 使用不同的 `.clasp.json` 文件
3. 分別部署到不同的專案

### 自動化部署

創建 `deploy.sh` 腳本：

```bash
#!/bin/bash
echo "推送程式碼..."
clasp push

echo "創建新部署..."
clasp deploy --description "自動部署 $(date '+%Y-%m-%d %H:%M:%S')"

echo "部署完成！"
clasp deployments
```

使用：

```bash
chmod +x deploy.sh
./deploy.sh
```

## 監控和維護

### 查看使用情況

1. 開啟 Apps Script 編輯器
2. 點擊「執行作業」查看執行歷史
3. 檢查錯誤和警告

### 效能優化

- 定期清理舊的訂單記錄（超過一年的資料可以封存）
- 監控 Google Sheets 的行數（建議不超過 10,000 行）
- 如需處理大量資料，考慮使用 Google BigQuery

### 安全性建議

- 定期檢查訂單記錄的存取權限
- 不要在程式碼中硬編碼敏感資訊
- 使用 Google Sheet 的保護功能防止誤刪
- 管理帳號 `hello2paris@gmail.com` 對所有 Sheets 都有編輯權限
- 建議定期備份重要的訂單資料

## 支援和資源

- **Clasp 文檔**：https://github.com/google/clasp
- **Apps Script 文檔**：https://developers.google.com/apps-script
- **問題回報**：請在專案 GitHub 頁面提交 Issue

---

祝你部署順利！🚀
