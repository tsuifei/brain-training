# 管理帳號設定說明

## 📧 管理帳號

本精油訂購系統已預先配置管理帳號為：**`hello2paris@gmail.com`**

## 🎯 管理帳號的作用

所有系統自動創建的 Google Sheets 都會自動共享給此管理帳號，並且**自動放在「精油訂購APP」資料夾中**，包括：

1. **訂單記錄表** - 儲存所有客戶訂單
2. **產品列表表** - 儲存精油產品資訊

這確保 `hello2paris@gmail.com` 能夠：
- 查看所有訂單記錄
- 管理產品列表
- 編輯和更新資料
- 備份和匯出資料
- 在統一的資料夾中集中管理所有訂單資料

## 🔧 如何運作

### 自動共享和資料夾管理機制

當系統創建新的 Google Sheet 時，會自動執行以下操作：

```javascript
// Code.gs 第 10 行和第 13 行
const ADMIN_EMAIL = 'hello2paris@gmail.com';
const DRIVE_FOLDER_NAME = '精油訂購APP';

// 1. 取得或創建「精油訂購APP」資料夾
const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);

// 2. 將 Sheet 移動到該資料夾
moveToFolder(spreadsheet, folder);

// 3. 共享給管理帳號
spreadsheet.addEditor(ADMIN_EMAIL);
```

### 三個自動處理時機

1. **第一筆訂單提交時**
   - 自動創建「精油訂單記錄」Sheet
   - 自動移動到「精油訂購APP」資料夾
   - 自動共享給 `hello2paris@gmail.com`
   - 管理帳號立即獲得編輯權限

2. **執行 `createProductListSheet` 函數時**
   - 自動創建「精油產品列表」Sheet
   - 自動移動到「精油訂購APP」資料夾
   - 自動共享給管理帳號
   - 可以直接在 Sheet 中管理產品

3. **執行 `getOrCreateOrderSheet` 函數時**
   - 如果訂單記錄表不存在，會自動創建
   - 自動移動到「精油訂購APP」資料夾
   - 自動共享給管理帳號

## 📂 在 Google Drive 中查找資料

### 方法一：直接開啟資料夾（推薦）

1. 登入 `hello2paris@gmail.com`
2. 開啟 Google Drive
3. 找到「精油訂購APP」資料夾
4. 所有訂單記錄和產品列表都在這個資料夾中

### 方法二：搜尋

在 `hello2paris@gmail.com` 的 Google Drive 中搜尋：
- `精油訂單記錄` - 查找訂單資料
- `精油產品列表` - 查找產品資料
- `精油訂購APP` - 查找資料夾

### 方法三：「與我共用」

1. 登入 `hello2paris@gmail.com`
2. 開啟 Google Drive
3. 點擊左側「與我共用」
4. 找到精油相關的 Sheets（如果是其他帳號部署的情況）

### 方法四：查看日誌

在 Apps Script 執行日誌中會顯示詳細資訊：
```
找到現有資料夾: 精油訂購APP, ID: xxxxx
訂單記錄表已移動到資料夾: 精油訂購APP
已將訂單記錄表共享給管理帳號: hello2paris@gmail.com
已創建新的訂單記錄 Google Sheet，ID: xxxxx
Sheet URL: https://docs.google.com/spreadsheets/d/xxxxx/edit
```

## 🚀 部署建議

### 選項 A：使用管理帳號部署（推薦）

**優點**：所有資源都在同一個帳號下，管理最方便

步驟：
1. 使用 `hello2paris@gmail.com` 登入 Clasp
   ```bash
   clasp login
   ```
2. 創建和部署專案
   ```bash
   clasp create --title "精油訂購系統" --type webapp
   clasp push
   clasp deploy
   ```

這樣：
- Apps Script 專案在 `hello2paris@gmail.com` 的 Drive 中
- 所有 Sheets 也在同一個帳號的「精油訂購APP」資料夾中
- 不需要共享，直接擁有所有資源
- 資料管理最方便

### 選項 B：使用其他帳號部署

**適用場景**：團隊協作，不同人負責部署和管理

步驟：
1. 使用任何 Google 帳號登入 Clasp
2. 創建和部署專案
3. 系統會自動將創建的 Sheets 共享給 `hello2paris@gmail.com`

這樣：
- Apps Script 專案在部署者的 Drive 中
- 所有 Sheets 會自動移動到「精油訂購APP」資料夾（在部署者的 Drive 中）
- 所有 Sheets 會自動共享給 `hello2paris@gmail.com`
- 管理帳號可以查看和編輯 Sheets，但不擁有 Apps Script 專案
- 在 `hello2paris@gmail.com` 的 Drive 中可以在「與我共用」看到這些 Sheets

## 🔄 更改管理帳號或資料夾名稱

### 更改管理帳號

如果需要更改管理帳號，請按以下步驟：

1. 編輯 `Code.gs` 第 10 行：
   ```javascript
   const ADMIN_EMAIL = '新的管理帳號@gmail.com';
   ```

2. 重新推送程式碼：
   ```bash
   clasp push
   ```

3. 重新部署（如果需要）：
   ```bash
   clasp deploy --description "更新管理帳號"
   ```

**注意**：
- 已創建的 Sheets 不會自動更新共享對象
- 只有新創建的 Sheets 會共享給新的管理帳號
- 如需更新現有 Sheets，請手動在 Google Drive 中調整共享設定

### 更改資料夾名稱

如果需要更改資料夾名稱，請按以下步驟：

1. 編輯 `Code.gs` 第 13 行：
   ```javascript
   const DRIVE_FOLDER_NAME = '新的資料夾名稱';
   ```

2. 重新推送程式碼：
   ```bash
   clasp push
   ```

**注意**：
- 已創建的 Sheets 不會自動移動到新資料夾
- 只有新創建的 Sheets 會放在新資料夾中
- 如需移動現有 Sheets，請手動在 Google Drive 中移動檔案

## ✅ 驗證設定

### 確認管理帳號和資料夾設定正確

1. 開啟 Apps Script 編輯器：
   ```bash
   clasp open
   ```

2. 查看 `Code.gs` 第 10 行和第 13 行：
   ```javascript
   const ADMIN_EMAIL = 'hello2paris@gmail.com';
   const DRIVE_FOLDER_NAME = '精油訂購APP';
   ```

3. 確認顯示正確的 Email 和資料夾名稱

### 測試自動共享和資料夾功能

1. 提交一筆測試訂單
2. 登入 `hello2paris@gmail.com`
3. 在 Google Drive 中找到「精油訂購APP」資料夾
4. 確認可以看到「精油訂單記錄」Sheet 在該資料夾中
5. 確認可以編輯該 Sheet
6. 檢查執行日誌確認移動和共享成功

## 🔐 權限說明

管理帳號 `hello2paris@gmail.com` 對所有自動創建的 Sheets 擁有：

- ✅ **查看權限** - 可以查看所有資料
- ✅ **編輯權限** - 可以修改資料
- ✅ **刪除權限** - 可以刪除資料（請小心操作）
- ✅ **共享權限** - 可以將 Sheet 共享給其他人
- ❌ **擁有者權限** - 不是擁有者（除非使用此帳號部署）

## 📋 管理清單

定期檢查以下項目：

- [ ] 確認「精油訂購APP」資料夾存在且正確
- [ ] 確認所有新訂單都自動放在該資料夾中
- [ ] 確認 `hello2paris@gmail.com` 可以存取資料夾和所有 Sheets
- [ ] 定期備份重要資料
- [ ] 檢查 Sheet 的共享設定
- [ ] 監控訂單資料量（建議不超過 10,000 行）
- [ ] 清理和封存舊資料到子資料夾

## 🆘 常見問題

### Q: 為什麼管理帳號看不到某個 Sheet？

**A**: 可能的原因：
1. Sheet 是在更新管理帳號設定之前創建的
2. 自動共享失敗（權限問題）
3. Sheet 已被移除共享
4. Sheet 在其他資料夾中（如果是更改資料夾名稱之前創建的）

**解決方法**：
- 在 Sheet 中手動加入 `hello2paris@gmail.com` 作為編輯者
- 手動將 Sheet 移動到「精油訂購APP」資料夾
- 或刪除 Sheet 讓系統重新創建

### Q: 可以有多個管理帳號嗎？

**A**: 目前系統只支援一個管理帳號。如需多個管理員，可以：
1. 使用管理帳號手動共享 Sheets 給其他人
2. 或修改 `Code.gs` 加入多個管理帳號的邏輯

### Q: 管理帳號或資料夾名稱可以修改嗎？

**A**: 可以，請參考本文件的「更改管理帳號或資料夾名稱」章節。注意已創建的 Sheets 需要手動調整共享設定和移動位置。

### Q: 資料夾中可以建立子資料夾嗎？

**A**: 可以！建議的資料夾結構：
```
精油訂購APP/
├── 精油訂單記錄（當前訂單）
├── 精油產品列表
├── 2024年度訂單/（封存）
├── 2025年度訂單/（封存）
└── 備份/
```

手動在 Google Drive 中建立子資料夾，然後將舊資料移入即可。

## 📞 需要協助

如果在設定管理帳號或資料夾時遇到問題，請檢查：
1. `Code.gs` 第 10 行的 `ADMIN_EMAIL` 是否正確
2. `Code.gs` 第 13 行的 `DRIVE_FOLDER_NAME` 是否正確
3. Apps Script 執行日誌是否有錯誤訊息
4. 管理帳號的 Email 地址是否輸入正確（區分大小寫）
5. 管理帳號是否啟用且可以接收共享通知
6. 檢查 Google Drive 中是否已存在同名資料夾

---

**重要提醒**：請妥善保管 `hello2paris@gmail.com` 的帳號安全，因為此帳號可以存取所有訂單資料！
