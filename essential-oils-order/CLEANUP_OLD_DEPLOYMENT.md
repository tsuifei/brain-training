# 清理舊部署指南

## 📋 清理步驟總覽

部署到 hello2paris@gmail.com 完成後，需要清理舊的部署以避免：
- 舊的 URL 仍然可以訪問（造成混淆）
- 資料分散在多個地方
- 佔用不必要的儲存空間

## 🔍 第一步：找出舊部署

### 1. 確認當前有哪些部署

如果您記得舊專案的位置，可以直接找到它。如果不記得：

1. 前往 [Google Apps Script 首頁](https://script.google.com)
2. 查看「我的專案」列表
3. 找到舊的「精油訂購系統」專案

或者使用 clasp：

```bash
# 如果還保留舊的 .clasp.json.backup
cat .clasp.json.backup
# 會顯示舊專案的 scriptId
```

### 2. 檢查舊專案的部署

```bash
# 方法 1: 如果還有舊的 .clasp.json
# 暫時恢復舊設定
mv .clasp.json .clasp.json.new
mv .clasp.json.backup .clasp.json

# 查看部署列表
clasp deployments

# 恢復新設定
mv .clasp.json .clasp.json.backup
mv .clasp.json.new .clasp.json
```

## 🗑️ 第二步：刪除舊部署

### 選項 A：透過網頁介面刪除（推薦）

#### 1. 開啟舊專案

1. 前往 [Google Apps Script](https://script.google.com)
2. 找到舊的「精油訂購系統」專案
3. 點擊開啟

#### 2. 刪除所有部署

1. 點擊右上角「部署」→「管理部署」
2. 會看到所有部署的列表
3. 對於每個部署：
   - 點擊右側的「⋯」（更多選項）
   - 選擇「刪除」
   - 確認刪除

#### 3. 刪除專案（可選）

如果完全不需要舊專案：
1. 在專案列表中找到舊專案
2. 點擊右側的「⋯」
3. 選擇「移至垃圾桶」

### 選項 B：使用 Clasp 刪除

如果您還有舊專案的 scriptId：

```bash
# 1. 暫時切換到舊專案
mv .clasp.json .clasp.json.new
cat > .clasp.json << EOF
{
  "scriptId": "舊專案的scriptId",
  "rootDir": "."
}
EOF

# 2. 查看部署
clasp deployments

# 3. 刪除特定部署
clasp undeploy <deploymentId>

# 或刪除所有部署
clasp undeploy --all

# 4. 恢復新專案設定
rm .clasp.json
mv .clasp.json.new .clasp.json
```

## 🧹 第三步：清理 Google Drive 中的舊資料

### 1. 找出舊的 Google Sheets

如果舊部署創建了訂單記錄或產品列表：

1. 前往 [Google Drive](https://drive.google.com)
2. 搜尋「精油訂單記錄」或「精油產品列表」
3. 檢查檔案的擁有者：
   - 如果擁有者**不是** hello2paris@gmail.com
   - 這些就是舊部署的資料

### 2. 處理舊資料

#### 選項 A：匯出後刪除

如果舊資料中有重要的訂單：

```bash
# 1. 開啟舊的 Sheet
# 2. 檔案 → 下載 → Microsoft Excel (.xlsx)
# 3. 或複製資料到新的 Sheet
```

然後刪除舊的 Sheet：
1. 在 Google Drive 中選擇檔案
2. 點擊「移至垃圾桶」

#### 選項 B：直接刪除

如果舊資料是測試資料，沒有重要內容：
1. 在 Google Drive 中選擇檔案
2. 點擊「移至垃圾桶」

### 3. 清理「精油訂購APP」資料夾

如果有多個「精油訂購APP」資料夾：

1. 前往 Google Drive
2. 搜尋「精油訂購APP」
3. 檢查每個資料夾的擁有者
4. 保留 hello2paris@gmail.com 擁有的資料夾
5. 刪除其他資料夾（或移除共享）

## 📊 第四步：驗證清理結果

### 1. 確認舊 URL 已失效

```bash
# 如果您記得舊的 Web App URL，在瀏覽器中開啟
# 應該會顯示錯誤訊息或無法訪問
```

### 2. 確認只有一個活躍專案

1. 前往 [Google Apps Script](https://script.google.com)
2. 應該只看到一個「精油訂購系統」專案（在 hello2paris@gmail.com 下）

### 3. 確認資料位置正確

1. 登入 hello2paris@gmail.com
2. 前往 [Google Drive](https://drive.google.com)
3. 「精油訂購APP」資料夾應該在「我的雲端硬碟」中
4. 裡面有訂單記錄和產品列表（如果已創建）

## 🗂️ 清理檢查清單

完成後，確認以下項目：

- [ ] 舊的 Apps Script 專案已刪除或部署已移除
- [ ] 舊的 Google Sheets 已匯出（如需要）並刪除
- [ ] 舊的 Web App URL 已失效
- [ ] 只有一個「精油訂購APP」資料夾（在 hello2paris@gmail.com）
- [ ] 新的 Web App 正常運作
- [ ] 測試訂單資料儲存在 hello2paris@gmail.com 的 Drive 中

## 🔧 額外清理（可選）

### 清理本機備份檔案

```bash
cd /Users/tsuifei/Projects_web/VibeCoding/essential-oils-order

# 刪除備份的 .clasp.json
rm .clasp.json.backup

# 刪除其他備份檔案（如果有）
rm .clasp.json.old
```

### 清理 Google Drive 垃圾桶

1. 前往 [Google Drive 垃圾桶](https://drive.google.com/drive/trash)
2. 點擊「永久刪除垃圾桶中的所有項目」
3. 確認刪除

**注意**：永久刪除後無法復原！

## ⚠️ 重要提醒

### 刪除前請確認

1. **新部署已正常運作**
   - 測試登入功能
   - 測試訂單提交
   - 確認資料正確儲存

2. **舊資料已備份**（如有需要）
   - 匯出重要的訂單記錄
   - 保存產品列表資料

3. **通知相關人員**
   - 如果有其他人使用舊的 URL
   - 提供新的 Web App URL

### 無法刪除的情況

如果遇到「無法刪除」或「權限不足」：

1. **部署是由其他帳號創建的**
   - 需要該帳號登入才能刪除
   - 或請該帳號協助刪除

2. **檔案是由其他人擁有的**
   - 只能移除共享，無法刪除
   - 請檔案擁有者刪除

3. **仍有使用者在訪問**
   - 建議先通知使用者
   - 再進行刪除

## 📞 需要協助？

如果清理過程中遇到問題：

1. **找不到舊專案**
   - 檢查是否在其他 Google 帳號下
   - 搜尋所有包含「精油」關鍵字的專案

2. **無法刪除部署**
   - 確認是否使用正確的帳號登入
   - 檢查是否有部署權限

3. **資料無法刪除**
   - 確認檔案擁有者
   - 如果是共享檔案，只能移除共享

---

**清理日期**：建議在新部署測試完成後立即執行
**下次更新時**：直接使用 hello2paris@gmail.com 帳號，無需清理
