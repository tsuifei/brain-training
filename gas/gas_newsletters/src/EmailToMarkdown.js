/**
 * 邮件转 Markdown 工具
 */

const EmailToMarkdown = {
  /**
   * 将邮件转换为 Markdown 格式
   * @param {GmailMessage} message - Gmail 邮件对象
   * @return {string} Markdown 内容
   */
  convert: function(message) {
    const subject = message.getSubject();
    const from = message.getFrom();
    const date = message.getDate();
    const to = message.getTo();
    const cc = message.getCc();

    // 获取邮件正文
    let body = message.getPlainBody();

    // 如果没有纯文本，尝试从 HTML 转换
    if (!body || body.trim() === '') {
      const htmlBody = message.getBody();
      body = this.htmlToMarkdown(htmlBody);
    }

    // 构建 Markdown 文档
    let markdown = `# ${subject}\n\n`;
    markdown += `## 邮件信息\n\n`;
    markdown += `- **发件人**: ${from}\n`;
    markdown += `- **收件人**: ${to}\n`;
    if (cc) {
      markdown += `- **抄送**: ${cc}\n`;
    }
    markdown += `- **日期**: ${Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss')}\n`;
    markdown += `\n---\n\n`;
    markdown += `## 内容\n\n`;
    markdown += body;

    // 处理附件信息
    const attachments = message.getAttachments();
    if (attachments.length > 0) {
      markdown += `\n\n---\n\n`;
      markdown += `## 附件\n\n`;
      attachments.forEach(attachment => {
        markdown += `- ${attachment.getName()} (${this.formatBytes(attachment.getSize())})\n`;
      });
    }

    return markdown;
  },

  /**
   * 生成文件名
   * @param {GmailMessage} message - Gmail 邮件对象
   * @return {string} 文件名
   */
  generateFilename: function(message) {
    const date = message.getDate();
    const subject = message.getSubject();

    // 格式化日期
    const dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');

    // 清理标题（移除特殊字符）
    const cleanSubject = subject
      .replace(/[\/\\?%*:|"<>]/g, '-')  // 替换非法字符
      .replace(/\s+/g, ' ')              // 合并多余空格
      .trim()
      .substring(0, 100);                // 限制长度

    return `${dateStr} ${cleanSubject}.md`;
  },

  /**
   * 简单的 HTML 转 Markdown
   * @param {string} html - HTML 内容
   * @return {string} Markdown 内容
   */
  htmlToMarkdown: function(html) {
    let text = html;

    // 移除 style 和 script 标签
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // 转换标题
    text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
    text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
    text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
    text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');

    // 转换粗体和斜体
    text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

    // 转换链接
    text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // 转换段落和换行
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<p[^>]*>/gi, '');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/div>/gi, '\n');
    text = text.replace(/<div[^>]*>/gi, '');

    // 转换列表
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    text = text.replace(/<\/?ul[^>]*>/gi, '\n');
    text = text.replace(/<\/?ol[^>]*>/gi, '\n');

    // 移除剩余的 HTML 标签
    text = text.replace(/<[^>]+>/g, '');

    // 解码 HTML 实体
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');

    // 清理多余的空行
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');

    return text.trim();
  },

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @return {string} 格式化后的大小
   */
  formatBytes: function(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
};
