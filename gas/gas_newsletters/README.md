# Gas Newsletters - 电子报整理工具

自动将 Gmail 电子报整理到 Google Drive 的 GAS（Google Apps Script）工具。

## 功能特点

- 🔍 自动搜索指定收件人的电子报
- 📁 按星期自动分类（格式：YYYY-Wxx）
- 📝 将邮件转换为 Markdown 格式
- 📅 从 2024 年 12 月开始处理邮件
- 🔄 支持定时自动执行

## 文件结构

```
gas_newsletters/
├── .clasp.json           # Clasp 配置文件
├── appsscript.json       # GAS 项目配置
├── README.md             # 说明文档
└── src/
    ├── Code.js           # 主程序
    ├── EmailToMarkdown.js # 邮件转 Markdown 工具
    └── DriveManager.js   # Drive 文件夹管理工具
```

## 安装步骤

### 1. 安装 Clasp

```bash
npm install -g @google/clasp
```

### 2. 登录 Google 账号

```bash
clasp login
```

### 3. 创建新的 GAS 项目

在 `gas_newsletters` 目录下执行：

```bash
cd gas/gas_newsletters
clasp create --title "Newsletter Organizer" --type standalone
```

这会生成一个 Script ID 并自动更新 `.clasp.json` 文件。

### 4. 推送代码

```bash
clasp push
```

### 5. 开启 Gmail 和 Drive API

在 Google Apps Script 编辑器中：
1. 点击 "服务" (Services) 左侧的 ➕
2. 添加 "Gmail API"
3. 添加 "Drive API"

## 使用方法

### 配置（重要！）

**第一步：设置配置**

为了安全起见，敏感信息（如邮箱地址）存储在 Script Properties 中，不会暴露在代码里。

1. 打开 Google Apps Script 编辑器：
```bash
clasp open
```

2. **首次使用前必须运行 `setupConfig` 函数**：
   - 在编辑器中打开 `Code.gs` 文件
   - 找到 `setupConfig` 函数
   - 根据需要修改函数中的邮箱地址：
     ```javascript
     scriptProperties.setProperties({
       'EMAIL_RECIPIENT': 'your-email@gmail.com',  // 修改为你的邮箱
       'DRIVE_FOLDER_NAME': 'newsletters',
       'START_DATE': '2024-12-01'
     });
     ```
   - 在函数下拉菜单中选择 `setupConfig`
   - 点击运行按钮 ▶️
   - 查看日志确认配置已保存

3. 配置存储在 Script Properties 中，代码文件不包含敏感信息，可以安全地分享或提交到 Git

### 手动执行

1. 打开 Google Apps Script 编辑器（如果还没打开）：
```bash
clasp open
```

2. 在编辑器中选择函数 `runOnce` 并点击运行

3. 首次运行需要授权访问 Gmail 和 Drive

### 设置定时执行（可选）

在编辑器中运行 `createDailyTrigger()` 函数，这会创建一个每天凌晨 2 点执行的触发器。

或者手动设置：
1. 在编辑器左侧点击 "触发器" (Triggers)
2. 点击 "添加触发器"
3. 设置：
   - 函数：`processNewsletters`
   - 部署：Head
   - 事件来源：时间驱动
   - 时间类型：日计时器
   - 时间：选择合适的时间

## 输出结构

程序会在 Google Drive 创建如下结构：

```
newsletters/
├── 2024-W49/
│   ├── 2024-12-01 邮件标题1.md
│   └── 2024-12-03 邮件标题2.md
├── 2024-W50/
│   ├── 2024-12-08 邮件标题3.md
│   └── 2024-12-10 邮件标题4.md
└── 2024-W51/
    └── 2024-12-15 邮件标题5.md
```

## Markdown 文件格式

每个邮件会被转换为如下格式的 Markdown 文件：

```markdown
# 邮件标题

## 邮件信息

- **发件人**: sender@example.com
- **收件人**: ez2france.com@gmail.com
- **日期**: 2024-12-09 10:30:00

---

## 内容

邮件正文内容...

---

## 附件

- 文件名.pdf (1.2 MB)
```

## 常用命令

```bash
# 推送代码到 GAS
clasp push

# 从 GAS 拉取代码
clasp pull

# 打开在线编辑器
clasp open

# 查看日志
clasp logs

# 查看版本
clasp versions

# 部署
clasp deploy
```

## 注意事项

1. **Gmail 配额限制**：Gmail API 有配额限制，大量邮件可能需要分批处理
2. **执行时间限制**：GAS 单次执行最长 6 分钟，如果邮件过多可能需要分批处理
3. **文件名长度**：标题过长会被截断到 100 字符
4. **特殊字符**：文件名中的特殊字符会被替换为 `-`

## 故障排除

### 问题：找不到邮件
- 检查 `CONFIG.EMAIL_RECIPIENT` 是否正确
- 检查 `CONFIG.START_DATE` 日期范围
- 在 Gmail 中手动测试搜索查询

### 问题：无法创建文件
- 检查 Drive API 是否已启用
- 检查是否有足够的 Drive 存储空间
- 检查文件名是否包含非法字符

### 问题：HTML 转 Markdown 效果不佳
- 程序使用简单的 HTML 转换
- 可以考虑使用第三方库改进转换质量

## 进阶功能

### 自定义邮件搜索条件

修改 `searchNewsletterEmails()` 函数中的查询：

```javascript
const query = `to:${CONFIG.EMAIL_RECIPIENT} after:${startDateStr} subject:电子报`;
```

### 添加邮件标签

在处理完邮件后自动添加标签：

```javascript
thread.addLabel(GmailApp.getUserLabelByName('已处理'));
```

## 授权

MIT License

## 作者

Created for managing newsletters efficiently.
