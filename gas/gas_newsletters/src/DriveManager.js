/**
 * Google Drive 文件夹管理工具
 */

const DriveManager = {
  /**
   * 获取或创建文件夹
   * @param {string} folderName - 文件夹名称
   * @param {Folder} parentFolder - 父文件夹（可选，默认为根目录）
   * @return {Folder} 文件夹对象
   */
  getOrCreateFolder: function(folderName, parentFolder = null) {
    let folders;

    if (parentFolder) {
      folders = parentFolder.getFoldersByName(folderName);
    } else {
      folders = DriveApp.getFoldersByName(folderName);
    }

    if (folders.hasNext()) {
      return folders.next();
    } else {
      if (parentFolder) {
        return parentFolder.createFolder(folderName);
      } else {
        return DriveApp.createFolder(folderName);
      }
    }
  },

  /**
   * 获取邮件日期对应的星期文件夹
   * @param {Folder} parentFolder - 父文件夹
   * @param {Date} date - 日期
   * @return {Folder} 星期文件夹
   */
  getWeekFolder: function(parentFolder, date) {
    const weekFolderName = this.getWeekFolderName(date);
    return this.getOrCreateFolder(weekFolderName, parentFolder);
  },

  /**
   * 生成星期文件夹名称（格式：YYYY-Wxx）
   * @param {Date} date - 日期
   * @return {string} 星期文件夹名称
   */
  getWeekFolderName: function(date) {
    const year = date.getFullYear();
    const weekNumber = this.getWeekNumber(date);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  },

  /**
   * 获取日期是一年中的第几周（ISO 8601 标准）
   * @param {Date} date - 日期
   * @return {number} 周数
   */
  getWeekNumber: function(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  },

  /**
   * 保存 Markdown 文件到文件夹
   * @param {Folder} folder - 目标文件夹
   * @param {string} filename - 文件名
   * @param {string} content - 文件内容
   * @return {File} 创建的文件对象
   */
  saveMarkdownFile: function(folder, filename, content) {
    const blob = Utilities.newBlob(content, 'text/markdown', filename);
    return folder.createFile(blob);
  },

  /**
   * 检查文件是否存在
   * @param {Folder} folder - 文件夹
   * @param {string} filename - 文件名
   * @return {boolean} 是否存在
   */
  fileExists: function(folder, filename) {
    const files = folder.getFilesByName(filename);
    return files.hasNext();
  },

  /**
   * 列出文件夹中的所有文件
   * @param {Folder} folder - 文件夹
   * @return {Array<string>} 文件名列表
   */
  listFiles: function(folder) {
    const fileList = [];
    const files = folder.getFiles();

    while (files.hasNext()) {
      const file = files.next();
      fileList.push(file.getName());
    }

    return fileList;
  },

  /**
   * 获取文件夹路径
   * @param {Folder} folder - 文件夹
   * @return {string} 文件夹路径
   */
  getFolderPath: function(folder) {
    const parents = [];
    let current = folder;

    while (current) {
      parents.unshift(current.getName());
      const parentFolders = current.getParents();
      current = parentFolders.hasNext() ? parentFolders.next() : null;
    }

    return parents.join(' > ');
  }
};
