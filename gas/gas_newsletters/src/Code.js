/**
 * 主程序 - 处理电子报到 Google Drive
 */

/**
 * 获取配置（从 Script Properties 读取）
 */
function getConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();

  return {
    EMAIL_RECIPIENT: scriptProperties.getProperty('EMAIL_RECIPIENT') || '',
    DRIVE_FOLDER_NAME: scriptProperties.getProperty('DRIVE_FOLDER_NAME') || 'newsletters',
    START_DATE: new Date(scriptProperties.getProperty('START_DATE') || '2024-12-01'),
  };
}

/**
 * 设置配置（首次使用时需要运行此函数）
 * 在 Apps Script 编辑器中运行此函数来设置配置
 */
function setupConfig() {
  const scriptProperties = PropertiesService.getScriptProperties();

  // 设置配置项
  scriptProperties.setProperties({
    'EMAIL_RECIPIENT': 'ez2france.com@gmail.com',  // 修改为你的邮箱
    'DRIVE_FOLDER_NAME': 'newsletters',
    'START_DATE': '2024-12-01'
  });

  Logger.log('配置已保存到 Script Properties');
  Logger.log('EMAIL_RECIPIENT: ' + scriptProperties.getProperty('EMAIL_RECIPIENT'));
  Logger.log('DRIVE_FOLDER_NAME: ' + scriptProperties.getProperty('DRIVE_FOLDER_NAME'));
  Logger.log('START_DATE: ' + scriptProperties.getProperty('START_DATE'));
}

/**
 * 主函数 - 处理所有符合条件的邮件
 */
function processNewsletters() {
  try {
    Logger.log('开始处理电子报...');

    // 获取配置
    const CONFIG = getConfig();

    // 获取或创建主文件夹
    const mainFolder = DriveManager.getOrCreateFolder(CONFIG.DRIVE_FOLDER_NAME);
    Logger.log(`主文件夹 ID: ${mainFolder.getId()}`);

    // 搜索邮件
    const threads = searchNewsletterEmails();
    Logger.log(`找到 ${threads.length} 个邮件串`);

    let processedCount = 0;
    let skippedCount = 0;

    // 处理每个邮件串
    threads.forEach(thread => {
      const messages = thread.getMessages();

      messages.forEach(message => {
        const messageDate = message.getDate();

        // 检查日期是否在范围内
        if (messageDate < CONFIG.START_DATE) {
          skippedCount++;
          return;
        }

        try {
          // 获取星期文件夹
          const weekFolder = DriveManager.getWeekFolder(mainFolder, messageDate);

          // 转换为 Markdown 并保存
          const markdown = EmailToMarkdown.convert(message);
          const filename = EmailToMarkdown.generateFilename(message);

          // 检查文件是否已存在
          if (!DriveManager.fileExists(weekFolder, filename)) {
            DriveManager.saveMarkdownFile(weekFolder, filename, markdown);
            processedCount++;
            Logger.log(`已处理: ${filename}`);
          } else {
            Logger.log(`跳过已存在: ${filename}`);
            skippedCount++;
          }
        } catch (error) {
          Logger.log(`处理邮件失败 (${message.getSubject()}): ${error.message}`);
        }
      });
    });

    Logger.log(`处理完成！成功: ${processedCount}, 跳过: ${skippedCount}`);

  } catch (error) {
    Logger.log(`错误: ${error.message}`);
    throw error;
  }
}

/**
 * 搜索符合条件的邮件
 */
function searchNewsletterEmails() {
  const CONFIG = getConfig();
  const startDateStr = Utilities.formatDate(CONFIG.START_DATE, Session.getScriptTimeZone(), 'yyyy/MM/dd');

  // Gmail 搜索查询
  const query = `to:${CONFIG.EMAIL_RECIPIENT} after:${startDateStr}`;

  Logger.log(`搜索查询: ${query}`);

  // 搜索邮件（最多 500 个串）
  const threads = GmailApp.search(query, 0, 500);

  return threads;
}

/**
 * 手动执行一次性处理
 */
function runOnce() {
  processNewsletters();
}

/**
 * 创建每日触发器（可选）
 */
function createDailyTrigger() {
  // 删除现有触发器
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processNewsletters') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // 创建新触发器 - 每天凌晨 2 点执行
  ScriptApp.newTrigger('processNewsletters')
    .timeBased()
    .atHour(2)
    .everyDays(1)
    .create();

  Logger.log('已创建每日触发器');
}
