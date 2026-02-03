/**
 * 精油訂購系統 - Google Apps Script
 */

// 設定你的 Google Sheet ID（部署後需要替換）
const ORDER_SHEET_ID = ''; // 訂單記錄表的 Sheet ID
const PRODUCT_SHEET_ID = '1X7RU2s_IvRUxPaSlRhSgUCd4kHWNG-ZHqHXHFzS-Kqg'; // 精油產品列表的 Sheet ID

// 主要管理帳號 Email（所有 Sheets 都會共享給這個帳號）
const ADMIN_EMAIL = 'hello2paris@gmail.com';

// Google Drive 資料夾名稱（所有訂單記錄會放在這個資料夾）
const DRIVE_FOLDER_NAME = '精油訂購APP';

/**
 * 顯示訂購頁面
 */
function doGet(e) {
  // 首次執行時，將 Apps Script 專案移動到指定資料夾
  moveScriptToFolder();

  // 如果 URL 參數指定登出頁面
  const page = e.parameter.page;
  if (page === 'logout') {
    return handleLogout();
  }

  // 直接顯示主頁面
  // GAS 會自動要求未登入的用戶進行 Google 登入
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('精油訂購系統')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 取得或創建指定的 Google Drive 資料夾
 */
function getOrCreateFolder(folderName) {
  try {
    // 在管理帳號的 Drive 中搜尋資料夾
    const folders = DriveApp.getFoldersByName(folderName);

    if (folders.hasNext()) {
      // 資料夾已存在，返回第一個
      const folder = folders.next();
      Logger.log('找到現有資料夾: ' + folderName + ', ID: ' + folder.getId());
      return folder;
    } else {
      // 資料夾不存在，創建新的
      const newFolder = DriveApp.createFolder(folderName);
      Logger.log('已創建新資料夾: ' + folderName + ', ID: ' + newFolder.getId());

      // 共享給管理帳號
      try {
        newFolder.addEditor(ADMIN_EMAIL);
        Logger.log('已將資料夾共享給管理帳號: ' + ADMIN_EMAIL);
      } catch (e) {
        Logger.log('共享資料夾失敗（可能管理帳號就是創建者）: ' + e.toString());
      }

      return newFolder;
    }
  } catch (error) {
    Logger.log('取得或創建資料夾時發生錯誤: ' + error.toString());
    return null;
  }
}

/**
 * 將 Spreadsheet 移動到指定資料夾
 */
function moveToFolder(spreadsheet, folder) {
  try {
    const file = DriveApp.getFileById(spreadsheet.getId());

    // 從所有父資料夾中移除（通常是根目錄）
    const parents = file.getParents();
    while (parents.hasNext()) {
      const parent = parents.next();
      parent.removeFile(file);
    }

    // 移動到目標資料夾
    folder.addFile(file);
    Logger.log('已將檔案移動到資料夾: ' + folder.getName());

    return true;
  } catch (error) {
    Logger.log('移動檔案到資料夾時發生錯誤: ' + error.toString());
    return false;
  }
}

/**
 * 將 Apps Script 專案本身移動到指定資料夾
 * 這個函數會在第一次執行時自動將專案移動到「精油訂購APP」資料夾
 */
function moveScriptToFolder() {
  try {
    const scriptId = ScriptApp.getScriptId();
    const scriptFile = DriveApp.getFileById(scriptId);
    const targetFolder = getOrCreateFolder(DRIVE_FOLDER_NAME);

    if (!targetFolder) {
      Logger.log('無法取得或創建目標資料夾');
      return false;
    }

    // 檢查專案是否已經在目標資料夾中
    const parents = scriptFile.getParents();
    let alreadyInFolder = false;

    while (parents.hasNext()) {
      const parent = parents.next();
      if (parent.getId() === targetFolder.getId()) {
        alreadyInFolder = true;
        break;
      }
    }

    // 如果已經在資料夾中，就不需要移動
    if (alreadyInFolder) {
      return true;
    }

    // 從所有父資料夾中移除
    const allParents = scriptFile.getParents();
    while (allParents.hasNext()) {
      const parent = allParents.next();
      parent.removeFile(scriptFile);
    }

    // 移動到目標資料夾
    targetFolder.addFile(scriptFile);
    Logger.log('已將 Apps Script 專案移動到資料夾: ' + DRIVE_FOLDER_NAME);

    return true;
  } catch (error) {
    Logger.log('移動 Apps Script 專案時發生錯誤: ' + error.toString());
    // 即使移動失敗，也不影響應用運作
    return false;
  }
}

/**
 * 取得當前登入用戶的資訊
 */
function getUserInfo() {
  try {
    // 方法 1: 使用 Session.getEffectiveUser()（更可靠）
    let email = '';
    let name = '';

    try {
      const effectiveUser = Session.getEffectiveUser();
      email = effectiveUser.getEmail();
    } catch (e) {
      Logger.log('Session.getEffectiveUser() failed: ' + e.toString());
    }

    // 方法 2: 如果方法 1 失敗，使用 Session.getActiveUser()
    if (!email) {
      try {
        const activeUser = Session.getActiveUser();
        email = activeUser.getEmail();
      } catch (e) {
        Logger.log('Session.getActiveUser() failed: ' + e.toString());
      }
    }

    // 方法 3: 檢查 OAuth Token（最後的確認）
    try {
      const token = ScriptApp.getOAuthToken();
      if (token && !email) {
        // 有 token 但無法取得 email，使用臨時識別
        email = 'authenticated-user@temp';
        Logger.log('User authenticated but email unavailable');
      }
    } catch (e) {
      Logger.log('ScriptApp.getOAuthToken() failed: ' + e.toString());
    }

    // 如果成功取得 email
    if (email && email !== 'authenticated-user@temp') {
      name = email.split('@')[0];
      return {
        isLoggedIn: true,
        email: email,
        name: name
      };
    }

    // 如果有臨時識別
    if (email === 'authenticated-user@temp') {
      return {
        isLoggedIn: true,
        email: 'user@example.com',
        name: 'User',
        isTemporary: true
      };
    }

  } catch (e) {
    Logger.log('getUserInfo error: ' + e.toString());
  }

  // 無法取得用戶資訊，視為未登入
  return {
    isLoggedIn: false,
    email: '',
    name: ''
  };
}

/**
 * 取得精油產品列表（從 Google Sheet 讀取）
 */
function getEssentialOils() {
  try {
    Logger.log('getEssentialOils() called');
    let productSheetId = PRODUCT_SHEET_ID;

    // 如果沒有設定產品列表 Sheet ID，創建範例資料
    if (!productSheetId) {
      Logger.log('No PRODUCT_SHEET_ID configured, using default oils');
      return getDefaultEssentialOils();
    }

    Logger.log('Opening product sheet: ' + productSheetId);
    const spreadsheet = SpreadsheetApp.openById(productSheetId);
    const sheet = spreadsheet.getSheetByName('產品列表');

    if (!sheet) {
      Logger.log('找不到「產品列表」工作表，使用預設資料');
      return getDefaultEssentialOils();
    }

    // 讀取所有資料（假設第一行是標題）
    const data = sheet.getDataRange().getValues();
    Logger.log('Read ' + data.length + ' rows from sheet');

    // 移除標題行
    const headers = data.shift();

    const oils = [];
    let currentId = 1;

    data.forEach(row => {
      // 跳過空行
      if (!row[0]) return;

      const nameCh = row[0];
      const nameLatin = row[1];
      const nameFr = row[2];

      // 尺寸和價格從第 4 欄開始（索引 3）
      const sizes = [];
      const prices = [];

      // 讀取尺寸和價格（假設格式為：5ml, 300, 10ml, 500, ...）
      for (let i = 3; i < row.length; i += 2) {
        const size = row[i];
        const price = row[i + 1];

        if (size && price) {
          sizes.push(String(size));
          prices.push(Number(price));
        }
      }

      if (sizes.length > 0) {
        oils.push({
          id: currentId++,
          nameCh: nameCh,
          nameLatin: nameLatin,
          nameFr: nameFr,
          sizes: sizes,
          prices: prices
        });
      }
    });

    Logger.log('Successfully loaded ' + oils.length + ' products');
    return oils.length > 0 ? oils : getDefaultEssentialOils();

  } catch (error) {
    Logger.log('讀取產品列表時發生錯誤: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    // 發生錯誤時返回預設資料，確保應用仍可運作
    return getDefaultEssentialOils();
  }
}

/**
 * 取得預設的精油產品列表（作為備用）
 */
function getDefaultEssentialOils() {
  return [
    {
      id: 1,
      nameCh: '薰衣草',
      nameLatin: 'Lavandula angustifolia',
      nameFr: 'Lavande',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [300, 500, 1200]
    },
    {
      id: 2,
      nameCh: '茶樹',
      nameLatin: 'Melaleuca alternifolia',
      nameFr: 'Tea Tree',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [250, 450, 1000]
    },
    {
      id: 3,
      nameCh: '尤加利',
      nameLatin: 'Eucalyptus globulus',
      nameFr: 'Eucalyptus',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [280, 480, 1100]
    },
    {
      id: 4,
      nameCh: '薄荷',
      nameLatin: 'Mentha piperita',
      nameFr: 'Menthe poivrée',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [280, 500, 1150]
    },
    {
      id: 5,
      nameCh: '檸檬',
      nameLatin: 'Citrus limon',
      nameFr: 'Citron',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [200, 380, 900]
    },
    {
      id: 6,
      nameCh: '甜橙',
      nameLatin: 'Citrus sinensis',
      nameFr: 'Orange douce',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [180, 350, 850]
    },
    {
      id: 7,
      nameCh: '迷迭香',
      nameLatin: 'Rosmarinus officinalis',
      nameFr: 'Romarin',
      sizes: ['5ml', '10ml', '30ml'],
      prices: [300, 520, 1200]
    },
    {
      id: 8,
      nameCh: '乳香',
      nameLatin: 'Boswellia carterii',
      nameFr: 'Encens',
      sizes: ['5ml', '10ml'],
      prices: [800, 1500]
    }
  ];
}

/**
 * 提交訂單
 */
function submitOrder(orderData) {
  try {
    Logger.log('submitOrder() called');
    Logger.log('Order data received: ' + JSON.stringify(orderData));

    // 驗證訂單資料
    if (!orderData || !orderData.customerInfo || !orderData.items || orderData.items.length === 0) {
      Logger.log('Invalid order data');
      return {
        success: false,
        message: '訂單資料不完整，請檢查後重試'
      };
    }

    // 如果沒有設定 ORDER_SHEET_ID，自動創建新的 Google Sheet
    let sheetId = ORDER_SHEET_ID;
    let sheet;

    if (!sheetId) {
      Logger.log('Creating new order sheet...');
      const spreadsheet = SpreadsheetApp.create('精油訂單記錄');
      sheetId = spreadsheet.getId();
      sheet = spreadsheet.getActiveSheet();
      sheet.setName('訂單');

      // 設定標題列
      const headers = [
        '訂單時間',
        '登入帳號',
        '客戶姓名',
        '聯絡電話',
        '電子郵件',
        '配送地址',
        '精油名稱（中文）',
        '精油名稱（拉丁文）',
        '精油名稱（法文）',
        '尺寸',
        '數量',
        '單價',
        '小計',
        '訂單總額',
        '備註'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);

      // 移動到指定資料夾
      const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
      if (folder) {
        moveToFolder(spreadsheet, folder);
        Logger.log('訂單記錄表已移動到資料夾: ' + DRIVE_FOLDER_NAME);
      }

      // 共享給管理帳號
      try {
        spreadsheet.addEditor(ADMIN_EMAIL);
        Logger.log('已將訂單記錄表共享給管理帳號: ' + ADMIN_EMAIL);
      } catch (e) {
        Logger.log('共享失敗（可能管理帳號就是創建者）: ' + e.toString());
      }

      Logger.log('已創建新的訂單記錄 Google Sheet，ID: ' + sheetId);
      Logger.log('請將此 ID 複製到 Code.gs 的 ORDER_SHEET_ID 變數中');
    } else {
      sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    }

    const timestamp = new Date();
    const { customerInfo, items, totalAmount, note, loginEmail } = orderData;

    // 準備寫入的資料
    const rows = [];
    items.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      rows.push([
        index === 0 ? timestamp : '', // 只在第一行顯示訂單時間
        index === 0 ? (loginEmail || '') : '', // 登入帳號
        index === 0 ? customerInfo.name : '',
        index === 0 ? customerInfo.phone : '',
        index === 0 ? customerInfo.email : '',
        index === 0 ? customerInfo.address : '',
        item.nameCh,
        item.nameLatin,
        item.nameFr,
        item.size,
        item.quantity,
        item.price,
        subtotal,
        index === 0 ? totalAmount : '', // 只在第一行顯示總額
        index === 0 ? note : ''
      ]);
    });

    // 將資料寫入 Sheet
    Logger.log('Writing ' + rows.length + ' rows to sheet...');
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    Logger.log('Data written successfully');

    // 發送訂單確認 Email
    try {
      sendOrderConfirmationEmail(orderData, timestamp);
      Logger.log('訂單確認 Email 已發送給: ' + customerInfo.email);
    } catch (emailError) {
      Logger.log('發送 Email 時發生錯誤: ' + emailError.toString());
      Logger.log('Email error stack: ' + emailError.stack);
      // Email 發送失敗不影響訂單提交成功
    }

    Logger.log('Order submitted successfully');
    return {
      success: true,
      message: '訂單已成功提交！',
      sheetId: sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
    };

  } catch (error) {
    Logger.log('提交訂單時發生錯誤: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    return {
      success: false,
      message: '訂單提交失敗：' + error.toString()
    };
  }
}

/**
 * 發送訂單確認 Email
 */
function sendOrderConfirmationEmail(orderData, timestamp) {
  const { customerInfo, items, totalAmount, note, loginEmail } = orderData;

  // 建立商品列表 HTML
  let itemsHtml = '';
  items.forEach(item => {
    const subtotal = item.price * item.quantity;
    itemsHtml += `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
          <strong>${item.nameCh}</strong><br>
          <span style="color: #666; font-size: 0.9em;">${item.nameLatin}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.size}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;">NT$ ${item.price.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right;"><strong>NT$ ${subtotal.toLocaleString()}</strong></td>
      </tr>
    `;
  });

  // Email HTML 內容
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Microsoft JhengHei', 'PingFang TC', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
        .section { margin-bottom: 25px; }
        .section-title { color: #667eea; font-size: 1.2em; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #667eea; }
        .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
        .info-row { margin-bottom: 8px; }
        .info-label { font-weight: bold; color: #666; display: inline-block; min-width: 100px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #667eea; color: white; padding: 12px; text-align: left; }
        .total-box { background: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 1.3em; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌿 精油訂單確認</h1>
          <p>Essential Oils Order Confirmation</p>
        </div>
        <div class="content">
          <p>親愛的 ${customerInfo.name}，您好！</p>
          <p>感謝您的訂購！以下是您的訂單詳情：</p>

          <!-- 訂單資訊 -->
          <div class="section">
            <div class="section-title">訂單資訊 Order Information</div>
            <div class="info-box">
              <div class="info-row"><span class="info-label">訂單時間：</span>${Utilities.formatDate(timestamp, 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss')}</div>
              <div class="info-row"><span class="info-label">訂單編號：</span>${Utilities.formatDate(timestamp, 'Asia/Taipei', 'yyyyMMddHHmmss')}</div>
            </div>
          </div>

          <!-- 客戶資訊 -->
          <div class="section">
            <div class="section-title">客戶資訊 Customer Information</div>
            <div class="info-box">
              <div class="info-row"><span class="info-label">姓名：</span>${customerInfo.name}</div>
              <div class="info-row"><span class="info-label">電話：</span>${customerInfo.phone}</div>
              <div class="info-row"><span class="info-label">Email：</span>${customerInfo.email}</div>
              <div class="info-row"><span class="info-label">配送地址：</span>${customerInfo.address}</div>
            </div>
          </div>

          <!-- 訂購商品 -->
          <div class="section">
            <div class="section-title">訂購商品 Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th style="text-align: center;">尺寸</th>
                  <th style="text-align: center;">數量</th>
                  <th style="text-align: right;">單價</th>
                  <th style="text-align: right;">小計</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          ${note ? `
          <!-- 備註 -->
          <div class="section">
            <div class="section-title">備註 Note</div>
            <div class="info-box">${note}</div>
          </div>
          ` : ''}

          <!-- 總金額 -->
          <div class="total-box">
            <strong>訂單總額 Total Amount</strong><br>
            NT$ ${totalAmount.toLocaleString()}
          </div>

          <div class="footer">
            <p>如有任何問題，請聯繫我們。</p>
            <p>感謝您的支持！</p>
            <p style="margin-top: 15px;">🌿 精油訂購系統<br>Essential Oils Order System</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  // 純文字版本（備用）
  const emailText = `
精油訂單確認 / Essential Oils Order Confirmation

親愛的 ${customerInfo.name}，您好！
感謝您的訂購！以下是您的訂單詳情：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
訂單資訊 Order Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
訂單時間：${Utilities.formatDate(timestamp, 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss')}
訂單編號：${Utilities.formatDate(timestamp, 'Asia/Taipei', 'yyyyMMddHHmmss')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
客戶資訊 Customer Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
姓名：${customerInfo.name}
電話：${customerInfo.phone}
Email：${customerInfo.email}
配送地址：${customerInfo.address}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
訂購商品 Order Items
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${items.map(item => `${item.nameCh} (${item.nameLatin})
  尺寸：${item.size} | 數量：${item.quantity} | 單價：NT$ ${item.price} | 小計：NT$ ${item.price * item.quantity}`).join('\n\n')}

${note ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
備註 Note
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${note}
` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
訂單總額 Total Amount：NT$ ${totalAmount.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

如有任何問題，請聯繫我們。
感謝您的支持！

🌿 精油訂購系統
Essential Oils Order System
  `;

  // 發送 Email
  MailApp.sendEmail({
    to: customerInfo.email,
    subject: `【精油訂購系統】訂單確認 - ${Utilities.formatDate(timestamp, 'Asia/Taipei', 'yyyy-MM-dd HH:mm')}`,
    body: emailText,
    htmlBody: emailHtml,
    name: '精油訂購系統'
  });

  Logger.log('訂單確認 Email 已發送給: ' + customerInfo.email);
}

/**
 * 創建產品列表 Sheet 模板
 * 執行此函數來創建一個包含範例資料的產品列表 Sheet
 */
function createProductListSheet() {
  const spreadsheet = SpreadsheetApp.create('精油產品列表');
  const sheet = spreadsheet.getActiveSheet();
  sheet.setName('產品列表');

  // 設定標題列
  const headers = [
    '中文名稱',
    '拉丁文名稱',
    '法文名稱',
    '尺寸1',
    '價格1',
    '尺寸2',
    '價格2',
    '尺寸3',
    '價格3',
    '尺寸4',
    '價格4'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  sheet.getRange(1, 1, 1, headers.length).setBackground('#667eea');
  sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  // 加入範例資料
  const sampleData = [
    ['薰衣草', 'Lavandula angustifolia', 'Lavande', '5ml', 300, '10ml', 500, '30ml', 1200],
    ['茶樹', 'Melaleuca alternifolia', 'Tea Tree', '5ml', 250, '10ml', 450, '30ml', 1000],
    ['尤加利', 'Eucalyptus globulus', 'Eucalyptus', '5ml', 280, '10ml', 480, '30ml', 1100],
    ['薄荷', 'Mentha piperita', 'Menthe poivrée', '5ml', 280, '10ml', 500, '30ml', 1150],
    ['檸檬', 'Citrus limon', 'Citron', '5ml', 200, '10ml', 380, '30ml', 900],
    ['甜橙', 'Citrus sinensis', 'Orange douce', '5ml', 180, '10ml', 350, '30ml', 850],
    ['迷迭香', 'Rosmarinus officinalis', 'Romarin', '5ml', 300, '10ml', 520, '30ml', 1200],
    ['乳香', 'Boswellia carterii', 'Encens', '5ml', 800, '10ml', 1500, '', '']
  ];

  sheet.getRange(2, 1, sampleData.length, 9).setValues(sampleData);

  // 自動調整欄寬
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  // 移動到指定資料夾
  const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
  if (folder) {
    moveToFolder(spreadsheet, folder);
    Logger.log('產品列表表已移動到資料夾: ' + DRIVE_FOLDER_NAME);
  }

  // 共享給管理帳號
  try {
    spreadsheet.addEditor(ADMIN_EMAIL);
    Logger.log('已將產品列表表共享給管理帳號: ' + ADMIN_EMAIL);
  } catch (e) {
    Logger.log('共享失敗（可能管理帳號就是創建者）: ' + e.toString());
  }

  const sheetId = spreadsheet.getId();
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;

  Logger.log('已創建產品列表 Sheet');
  Logger.log('Sheet ID: ' + sheetId);
  Logger.log('Sheet URL: ' + sheetUrl);
  Logger.log('請將此 ID 複製到 Code.gs 的 PRODUCT_SHEET_ID 變數中');

  return {
    sheetId: sheetId,
    sheetUrl: sheetUrl
  };
}

/**
 * 取得或創建訂單記錄表
 */
function getOrCreateOrderSheet() {
  let sheetId = ORDER_SHEET_ID;

  if (!sheetId) {
    const spreadsheet = SpreadsheetApp.create('精油訂單記錄');
    sheetId = spreadsheet.getId();
    const sheet = spreadsheet.getActiveSheet();
    sheet.setName('訂單');

    // 設定標題列
    const headers = [
      '訂單時間',
      '登入帳號',
      '客戶姓名',
      '聯絡電話',
      '電子郵件',
      '配送地址',
      '精油名稱（中文）',
      '精油名稱（拉丁文）',
      '精油名稱（法文）',
      '尺寸',
      '數量',
      '單價',
      '小計',
      '訂單總額',
      '備註'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);

    // 移動到指定資料夾
    const folder = getOrCreateFolder(DRIVE_FOLDER_NAME);
    if (folder) {
      moveToFolder(spreadsheet, folder);
      Logger.log('訂單記錄表已移動到資料夾: ' + DRIVE_FOLDER_NAME);
    }

    // 共享給管理帳號
    try {
      spreadsheet.addEditor(ADMIN_EMAIL);
      Logger.log('已將訂單記錄表共享給管理帳號: ' + ADMIN_EMAIL);
    } catch (e) {
      Logger.log('共享失敗（可能管理帳號就是創建者）: ' + e.toString());
    }

    return {
      sheetId: sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
    };
  }

  return {
    sheetId: sheetId,
    sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
  };
}

/**
 * 初始化 Google 登入
 * 在 Google Apps Script 環境中，這個函數會確認用戶登入狀態
 */
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

/**
 * 取得應用程式 URL
 */
function getAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * 處理登出
 */
function handleLogout() {
  // 在 Google Apps Script 中，無法直接登出用戶
  // 顯示一個頁面告訴用戶如何登出
  const html = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>登出</title>
      <style>
        body {
          font-family: 'Microsoft JhengHei', 'PingFang TC', 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          margin: 0;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
          max-width: 500px;
          text-align: center;
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          margin-top: 20px;
          transition: background 0.3s;
        }
        .btn:hover {
          background: #5568d3;
        }
        .info {
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
          text-align: left;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>登出說明</h1>
        <p>由於此應用使用 Google 帳號認證，要完全登出請執行以下步驟：</p>
        <div class="info">
          <p><strong>1. 關閉此視窗或分頁</strong></p>
          <p><strong>2. 登出您的 Google 帳號</strong></p>
          <p>前往 <a href="https://accounts.google.com" target="_blank">https://accounts.google.com</a> 並點擊登出</p>
          <p><strong>3. 重新開啟此應用時，系統會要求您重新登入</strong></p>
        </div>
        <a href="${ScriptApp.getService().getUrl()}" class="btn">返回首頁</a>
      </div>
    </body>
    </html>
  `);

  return html.setTitle('登出')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * 登出用戶（提供給前端呼叫）
 */
function logout() {
  // 在 GAS 中無法直接登出，返回登出說明
  return {
    success: true,
    message: '請關閉瀏覽器視窗或登出 Google 帳號以完全登出',
    logoutUrl: ScriptApp.getService().getUrl() + '?page=logout'
  };
}
