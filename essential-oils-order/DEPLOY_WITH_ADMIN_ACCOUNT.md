# 使用管理帳號部署指南

## 目標
將精油訂購系統部署在 `hello2paris@gmail.com` 帳號下，這樣所有資料（訂單記錄、產品列表）都會直接儲存在該帳號的 Google Drive 中。

## 📋 部署步驟

### 1. 登出當前 Clasp 帳號（如果有）

```bash
# 登出當前帳號
clasp logout
```

### 2. 使用 hello2paris@gmail.com 登入 Clasp

```bash
# 使用管理帳號登入
clasp login
```

**重要**：在瀏覽器中會開啟 Google 登入頁面，請確保：
- 選擇 `hello2paris@gmail.com` 帳號
- 授權 Clasp 訪問 Google Apps Script

### 3. 切換到專案目錄

```bash
cd /Users/tsuifei/Projects_web/VibeCoding/essential-oils-order
```

### 4. 刪除舊的專案設定（如果存在）

```bash
# 備份舊的 .clasp.json（可選）
mv .clasp.json .clasp.json.backup

# 刪除 .claspignore（如果存在）
# 通常不需要刪除，但如果有問題可以重新創建
```

### 5. 創建新的 Apps Script 專案

```bash
# 使用 hello2paris@gmail.com 帳號創建新專案
clasp create --title "精油訂購系統-管理帳號" --type webapp
```

這會：
- 在 hello2paris@gmail.com 的 Google Drive 中創建新的 Apps Script 專案
- 生成新的 `.clasp.json` 文件，包含新的 `scriptId`

### 6. 推送所有程式碼

```bash
# 推送所有檔案到新專案
clasp push
```

系統會問你是否要覆蓋遠端檔案，選擇 `Yes`。

### 7. 開啟 Apps Script 編輯器

```bash
clasp open
```

**確認**：檢查瀏覽器是否使用 hello2paris@gmail.com 帳號開啟。

### 8. 部署為 Web 應用程式

在 Apps Script 編輯器中：

1. 點擊右上角「部署」→「新增部署作業」
2. 點擊「選取類型」→ 選擇「網頁應用程式」
3. 設定：
   - **說明**：精油訂購系統 v2.0
   - **執行身分**：我 (hello2paris@gmail.com)
   - **具有存取權的使用者**：任何人
4. 點擊「部署」
5. 第一次部署會要求授權：
   - 點擊「授權存取權」
   - 選擇 hello2paris@gmail.com
   - 可能會顯示「Google 尚未驗證這個應用程式」
   - 點擊「進階」→「前往精油訂購系統-管理帳號 (不安全)」
   - 點擊「允許」
6. 複製「網頁應用程式」URL

### 9. 測試部署

1. 在瀏覽器中開啟複製的 URL
2. 應該會看到登入頁面
3. 使用任何 Google 帳號登入測試

### 10. 驗證資料位置

測試下第一筆訂單後：

1. 登入 [Google Drive](https://drive.google.com) (使用 hello2paris@gmail.com)
2. 在左側或搜尋欄尋找「精油訂購APP」資料夾
3. 應該會看到：
   - 📁 精油訂購APP/
     - 📄 精油訂單記錄

**確認**：檔案的擁有者應該是 hello2paris@gmail.com

## 📝 設定 Sheet ID（可選）

如果想使用固定的 Sheet ID：

### 創建產品列表 Sheet

1. 在 Apps Script 編輯器中
2. 點擊「執行」→ 選擇 `createProductListSheet`
3. 點擊「執行」
4. 查看「執行記錄」，複製顯示的 Sheet ID
5. 在 Code.gs 第 7 行設定：

```javascript
const PRODUCT_SHEET_ID = '你複製的Sheet ID';
```

6. 重新推送：
```bash
clasp push
```

## 🔍 驗證清單

部署完成後，請確認：

- ✅ Apps Script 專案在 hello2paris@gmail.com 的 Drive 中
- ✅ Web App 可以正常訪問和登入
- ✅ 測試訂單後，訂單記錄 Sheet 在 hello2paris@gmail.com 的 Drive 中
- ✅ 訂單記錄 Sheet 在「精油訂購APP」資料夾內
- ✅ Sheet 的擁有者是 hello2paris@gmail.com

## 🔄 更新應用程式

之後要更新程式碼時：

```bash
# 1. 確保使用正確的帳號
clasp login

# 2. 修改程式碼後推送
clasp push

# 3. 創建新版本部署
clasp open
# 在編輯器中：部署 → 管理部署 → 編輯 → 版本：新版本 → 部署
```

## ⚠️ 重要注意事項

1. **帳號一致性**
   - 所有操作都必須使用 hello2paris@gmail.com 帳號
   - 包括 clasp login、開啟編輯器、部署等

2. **舊專案處理**
   - 如果之前用其他帳號部署過，那個舊專案的資料不會自動轉移
   - 舊專案的 URL 會失效
   - 需要使用新的 Web App URL

3. **授權問題**
   - 首次部署時 Google 會顯示「不安全」警告是正常的
   - 這是因為應用未經 Google 驗證
   - 點擊「進階」→「前往...（不安全）」即可

4. **Sheet ID 設定**
   - 如果不設定 PRODUCT_SHEET_ID 和 ORDER_SHEET_ID
   - 系統會自動創建新的 Sheets
   - 這些 Sheets 會直接在 hello2paris@gmail.com 的 Drive 中

## 🆘 常見問題

### Q1: clasp login 時選錯帳號怎麼辦？

```bash
# 重新登出再登入
clasp logout
clasp login
```

### Q2: 已經部署過一次，想重新部署？

```bash
# 1. 確認當前專案
clasp open

# 2. 如果不是 hello2paris@gmail.com 的專案
# 刪除 .clasp.json 重新創建
mv .clasp.json .clasp.json.old
clasp create --title "精油訂購系統-管理帳號" --type webapp
clasp push
```

### Q3: 如何確認當前使用的是哪個帳號？

```bash
# 開啟專案會在瀏覽器中顯示帳號
clasp open

# 或查看專案資訊
clasp info
```

### Q4: 資料還是沒有在 hello2paris@gmail.com 中？

檢查：
1. Apps Script 專案的擁有者是否是 hello2paris@gmail.com？
2. 部署時「執行身分」是否設為「我」？
3. 是否已經提交過測試訂單？（首次訂單會觸發 Sheet 創建）

## 📞 需要協助？

如果遇到問題：
1. 檢查 Apps Script 執行日誌：`clasp logs`
2. 在瀏覽器控制台查看錯誤訊息
3. 確認所有步驟都使用 hello2paris@gmail.com 帳號

---

**部署日期**：2026-01-11
**帳號**：hello2paris@gmail.com
**版本**：2.0 - OAuth Login System
