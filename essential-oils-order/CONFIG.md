# 配置說明 Configuration Guide

## 🔧 需要配置的參數

在將此專案部署到您自己的環境時，請在 `Code.gs` 中修改以下參數：

### 1. Google Sheet IDs

```javascript
const ORDER_SHEET_ID = ''; // 訂單記錄表的 Sheet ID
const PRODUCT_SHEET_ID = '1X7RU2s_IvRUxPaSlRhSgUCd4kHWNG-ZHqHXHFzS-Kqg'; // 精油產品列表的 Sheet ID
```

**如何取得 Sheet ID**：
1. 開啟 Google Sheet
2. 從 URL 中複製 ID：`https://docs.google.com/spreadsheets/d/【這段是ID】/edit`

### 2. 管理員 Email

```javascript
const ADMIN_EMAIL = 'hello2paris@gmail.com';
```

**說明**：所有自動創建的 Google Sheets 都會共享給此管理員帳號。

### 3. Drive 資料夾名稱

```javascript
const DRIVE_FOLDER_NAME = '精油訂購APP';
```

**說明**：所有相關檔案都會自動整理到此資料夾中。

## 🔒 安全性注意事項

### 已保護的資訊

以下檔案已在 `.gitignore` 中被排除，不會推送到 GitHub：
- `.clasp.json` - 包含 Apps Script 專案 ID
- `.clasprc.json` - 包含 OAuth 認證資訊
- 所有 `.backup` 和 `.old` 檔案

### 可以公開的資訊

以下資訊即使公開也是安全的：
- **ADMIN_EMAIL** - 只是一個 Email 地址
- **PRODUCT_SHEET_ID / ORDER_SHEET_ID** - Google Sheets ID 有權限控制，外部無法訪問
- **DRIVE_FOLDER_NAME** - 只是資料夾名稱

### 不應公開的資訊（已被保護）

- Apps Script 專案 ID（scriptId）- 在 `.clasp.json` 中
- OAuth Token - 在 `.clasprc.json` 中
- 部署 URL - 可以公開，但建議不要分享給不需要的人

## 🚀 部署步驟

請參考 [DEPLOY_WITH_ADMIN_ACCOUNT.md](DEPLOY_WITH_ADMIN_ACCOUNT.md) 來部署此專案。

## 📝 首次設定清單

- [ ] 修改 `ADMIN_EMAIL` 為您的管理員帳號
- [ ] 執行 `createProductListSheet()` 創建產品列表
- [ ] 取得產品列表 Sheet ID
- [ ] 將 Sheet ID 設定到 `PRODUCT_SHEET_ID`
- [ ] 推送程式碼：`clasp push`
- [ ] 部署為 Web App
- [ ] 測試訂單流程

---

**最後更新**：2026-01-11
