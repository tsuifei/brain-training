# OAuth 登入功能部署指南

## 功能概述

此精油訂購系統已整合完整的 Google OAuth 2.0 登入流程，提供安全且用戶友好的身份驗證體驗。

### 主要功能

- ✅ Google 帳號登入（已實作）
- 🔄 Facebook 登入（待實作）
- 🔒 安全的 OAuth 2.0 認證流程
- 👤 用戶資訊顯示
- 🚪 登出功能
- 📱 響應式設計，支援手機和桌面

## 檔案結構

```
essential-oils-order/
├── Index.html          # 主訂購頁面（需登入後才能使用）
├── Login.html          # 登入頁面（新增）
├── Code.gs             # 後端邏輯（已更新）
├── appsscript.json     # Apps Script 配置
└── OAUTH_LOGIN_GUIDE.md # 本文件
```

## 部署步驟

### 1. 準備工作

確保您已經：
- 有 Google 帳號
- 安裝了 clasp（`npm install -g @google/clasp`）
- 已經執行 `clasp login`

### 2. 部署到 Google Apps Script

```bash
# 1. 切換到專案目錄
cd essential-oils-order

# 2. 推送所有檔案到 Google Apps Script
clasp push

# 3. 部署為 Web 應用
clasp deploy --description "OAuth Login Version"
```

### 3. 設定 Web 應用權限

1. 前往 [Google Apps Script](https://script.google.com)
2. 開啟您的專案
3. 點擊右上角的「部署」→「管理部署」
4. 在最新的部署中，點擊「編輯」
5. 設定以下選項：
   - **Execute as**: Me (您的 Google 帳號)
   - **Who has access**: Anyone（任何人都可以訪問）
6. 點擊「更新」
7. 複製 Web 應用 URL

### 4. 測試登入流程

1. 開啟 Web 應用 URL
2. 您應該會看到登入頁面，顯示 Google 登入按鈕
3. 點擊「使用 Google 帳號登入」
4. 系統會要求授權
5. 授權後，您會被重定向到主訂購頁面
6. 確認頁面頂部顯示您的 Google 帳號資訊

## 工作原理

### 登入流程

1. **未登入用戶訪問應用**
   - `doGet()` 函數檢查用戶登入狀態
   - 如果未登入，顯示 `Login.html`

2. **用戶點擊 Google 登入按鈕**
   - 前端呼叫 `initiateGoogleLogin()`
   - 後端使用 `Session.getActiveUser()` 驗證用戶
   - 如果成功，重定向到主頁面

3. **已登入用戶訪問應用**
   - `doGet()` 檢測到用戶已登入
   - 直接顯示 `Index.html`
   - 頁面頂部顯示用戶資訊和登出按鈕

### 登出流程

1. 用戶點擊「登出」按鈕
2. 前端呼叫 `logout()` 函數
3. 重定向到登出說明頁面
4. 用戶需要登出 Google 帳號以完全登出

## 程式碼說明

### Code.gs 的關鍵函數

```javascript
// 路由函數 - 根據登入狀態顯示不同頁面
function doGet(e) {
  const userInfo = getUserInfo();
  const page = e.parameter.page;

  if (page === 'login') {
    return HtmlService.createHtmlOutputFromFile('Login');
  }

  if (page === 'logout') {
    return handleLogout();
  }

  if (!userInfo.isLoggedIn) {
    return HtmlService.createHtmlOutputFromFile('Login');
  }

  return HtmlService.createHtmlOutputFromFile('Index');
}

// 取得用戶資訊
function getUserInfo() {
  const user = Session.getActiveUser();
  const email = user.getEmail();

  if (!email) {
    return {
      isLoggedIn: false,
      email: '',
      name: ''
    };
  }

  return {
    isLoggedIn: true,
    email: email,
    name: email.split('@')[0]
  };
}

// 初始化 Google 登入
function initiateGoogleLogin() {
  const userInfo = getUserInfo();

  if (userInfo.isLoggedIn) {
    return {
      success: true,
      redirectUrl: ScriptApp.getService().getUrl()
    };
  }

  return {
    success: false,
    message: '請使用 Google 帳號登入此應用'
  };
}

// 登出
function logout() {
  return {
    success: true,
    message: '請關閉瀏覽器視窗或登出 Google 帳號以完全登出',
    logoutUrl: ScriptApp.getService().getUrl() + '?page=logout'
  };
}
```

### Login.html 的關鍵功能

```javascript
// Google 登入處理
function handleGoogleLogin() {
  showLoading(true);
  hideError();

  google.script.run
    .withSuccessHandler(function(result) {
      if (result.success) {
        window.location.href = result.redirectUrl;
      } else {
        showError(result.message || '登入失敗，請重試');
        showLoading(false);
      }
    })
    .withFailureHandler(function(error) {
      showError('登入失敗：' + error.message);
      showLoading(false);
    })
    .initiateGoogleLogin();
}
```

### Index.html 的登出處理

```javascript
// 處理登出
function handleLogout() {
  if (confirm('確定要登出嗎？\nAre you sure you want to logout?')) {
    google.script.run
      .withSuccessHandler(function(result) {
        if (result.success && result.logoutUrl) {
          window.location.href = result.logoutUrl;
        }
      })
      .withFailureHandler(function(error) {
        showMessage('登出失敗：' + error.message, 'error');
      })
      .logout();
  }
}
```

## 安全性考量

### 目前的實作

1. **Google Apps Script 內建認證**
   - 使用 `Session.getActiveUser()` 取得用戶資訊
   - Google 自動處理 OAuth 流程
   - 無需額外設定 OAuth 客戶端 ID

2. **權限控制**
   - 未登入用戶無法訪問主頁面
   - 所有敏感操作都需要登入

3. **資料隱私**
   - 只收集必要的用戶資訊（Email）
   - 訂單資料儲存在 Google Sheets 中

### 潛在的改進

如果需要更高級的 OAuth 2.0 功能，可以考慮：

1. **使用 Google Identity Services (GIS)**
   - 需要在 Google Cloud Console 創建 OAuth 客戶端 ID
   - 提供更精細的權限控制
   - 更好的用戶體驗（One Tap 登入）

2. **實作步驟**：
   ```bash
   # 1. 前往 Google Cloud Console
   https://console.cloud.google.com

   # 2. 創建新專案或選擇現有專案

   # 3. 啟用 Google+ API 或 Google Identity API

   # 4. 創建 OAuth 2.0 客戶端 ID
   # - 應用類型: Web 應用
   # - 授權的 JavaScript 來源: 您的 GAS Web 應用 URL
   # - 授權的重定向 URI: 您的 GAS Web 應用 URL

   # 5. 取得客戶端 ID

   # 6. 在 Login.html 中加入 Google Identity Services SDK
   ```

3. **在 Login.html 中使用 GIS**：
   ```html
   <script src="https://accounts.google.com/gsi/client" async defer></script>
   <script>
     function handleCredentialResponse(response) {
       // 處理 JWT ID Token
       const idToken = response.credential;

       // 傳送到後端驗證
       google.script.run
         .withSuccessHandler(onLoginSuccess)
         .verifyGoogleToken(idToken);
     }

     window.onload = function () {
       google.accounts.id.initialize({
         client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
         callback: handleCredentialResponse
       });
       google.accounts.id.renderButton(
         document.getElementById("googleSignInButton"),
         { theme: "outline", size: "large" }
       );
     };
   </script>
   ```

## Facebook 登入（待實作）

要實作 Facebook 登入，需要：

### 1. 準備工作

1. 前往 [Facebook for Developers](https://developers.facebook.com/)
2. 創建應用並取得 App ID 和 App Secret
3. 設定 OAuth 重定向 URI

### 2. 在 Code.gs 中添加

```javascript
// Facebook OAuth 設定
const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';
const FACEBOOK_APP_SECRET = 'YOUR_FACEBOOK_APP_SECRET';
const FACEBOOK_REDIRECT_URI = 'YOUR_GAS_WEB_APP_URL';

function initiateFacebookLogin() {
  const authUrl = 'https://www.facebook.com/v12.0/dialog/oauth?' +
    'client_id=' + FACEBOOK_APP_ID +
    '&redirect_uri=' + encodeURIComponent(FACEBOOK_REDIRECT_URI) +
    '&scope=email,public_profile';

  return {
    success: true,
    authUrl: authUrl
  };
}

function handleFacebookCallback(code) {
  // 使用 code 換取 access token
  const tokenUrl = 'https://graph.facebook.com/v12.0/oauth/access_token?' +
    'client_id=' + FACEBOOK_APP_ID +
    '&client_secret=' + FACEBOOK_APP_SECRET +
    '&code=' + code +
    '&redirect_uri=' + encodeURIComponent(FACEBOOK_REDIRECT_URI);

  const response = UrlFetchApp.fetch(tokenUrl);
  const data = JSON.parse(response.getContentText());
  const accessToken = data.access_token;

  // 使用 access token 取得用戶資訊
  const userInfoUrl = 'https://graph.facebook.com/v12.0/me?' +
    'fields=id,name,email' +
    '&access_token=' + accessToken;

  const userResponse = UrlFetchApp.fetch(userInfoUrl);
  const userData = JSON.parse(userResponse.getContentText());

  // 儲存用戶資訊到 PropertiesService
  PropertiesService.getUserProperties().setProperty('fb_user', JSON.stringify(userData));

  return {
    success: true,
    user: userData
  };
}
```

### 3. 在 Login.html 中更新

```javascript
// Facebook 登入處理
function handleFacebookLogin() {
  showLoading(true);
  hideError();

  google.script.run
    .withSuccessHandler(function(result) {
      if (result.success && result.authUrl) {
        // 重定向到 Facebook OAuth 頁面
        window.location.href = result.authUrl;
      } else {
        showError(result.message || '登入失敗，請重試');
        showLoading(false);
      }
    })
    .withFailureHandler(function(error) {
      showError('登入失敗：' + error.message);
      showLoading(false);
    })
    .initiateFacebookLogin();
}
```

## 常見問題

### Q1: 為什麼看不到登入頁面？

**A**: 確保您已經：
- 正確推送所有檔案（包括 Login.html）
- 重新部署應用
- 清除瀏覽器快取

### Q2: 登入後仍然顯示未登入警告？

**A**: 這可能是因為：
- 部署設定中的「Execute as」不正確，應設為「Me」
- 權限未正確授予，重新授權應用

### Q3: 如何測試登出功能？

**A**:
1. 登入應用
2. 點擊右上角的「登出」按鈕
3. 按照頁面指示登出 Google 帳號
4. 重新訪問應用 URL，應該會看到登入頁面

### Q4: 可以限制只有特定用戶才能登入嗎？

**A**: 可以！在 `getUserInfo()` 函數中添加白名單檢查：

```javascript
function getUserInfo() {
  const user = Session.getActiveUser();
  const email = user.getEmail();

  if (!email) {
    return {
      isLoggedIn: false,
      email: '',
      name: ''
    };
  }

  // 白名單檢查
  const allowedUsers = [
    'user1@gmail.com',
    'user2@gmail.com',
    'hello2paris@gmail.com'
  ];

  if (!allowedUsers.includes(email)) {
    return {
      isLoggedIn: false,
      email: '',
      name: '',
      error: '您沒有權限訪問此應用'
    };
  }

  return {
    isLoggedIn: true,
    email: email,
    name: email.split('@')[0]
  };
}
```

### Q5: 為什麼 Facebook 登入按鈕是禁用的？

**A**: Facebook 登入功能尚未完全實作。要啟用它：
1. 完成上述「Facebook 登入（待實作）」章節中的步驟
2. 在 Login.html 中移除 `disabled` 屬性和 `.disabled` 類別

## 技術支援

如有問題或需要協助，請：
1. 檢查 Google Apps Script 的執行日誌
2. 在瀏覽器控制台查看錯誤訊息
3. 參考 [Google Apps Script 文檔](https://developers.google.com/apps-script)
4. 參考 [Google Identity 文檔](https://developers.google.com/identity)

## 更新日誌

### Version 2.0 (2026-01-11)
- ✅ 新增 Login.html 登入頁面
- ✅ 實作 Google OAuth 2.0 登入流程
- ✅ 新增登出功能
- ✅ 改進用戶介面，顯示登入狀態
- ✅ 新增登入/登出相關後端函數
- 🔄 Facebook 登入功能（待實作）

### Version 1.0
- 基本的精油訂購系統
- Google Sheets 資料儲存
- 產品列表管理

---

**作者**: Claude Code
**最後更新**: 2026-01-11
