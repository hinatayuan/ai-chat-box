# AI 聊天框 (AI Chat Box)

一个基于 React + TypeScript 构建的现代化 AI 聊天界面组件，集成 OpenAI GPT 和 GraphQL。

## ✨ 特性

- 🎨 **现代化设计** - 渐变色彩和圆润界面
- 💬 **实时聊天** - 流畅的消息发送和接收体验
- 🤖 **OpenAI 集成** - 支持 GPT-3.5/GPT-4 模型
- 📱 **响应式布局** - 适配不同屏幕尺寸
- ⚡ **TypeScript** - 完整的类型安全
- 🎯 **GraphQL API** - 灵活的数据查询接口
- 📝 **Markdown 渲染** - 支持富文本、代码高亮、表格等
- 🔧 **模型配置** - 可调节温度、token数等参数
- 📋 **代码复制** - 一键复制代码块
- 🌈 **语法高亮** - 多种编程语言代码高亮
- 🔄 **对话历史** - 自动保存上下文
- ❌ **错误处理** - 友好的错误提示

## 🛠️ 技术栈

- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 现代化图标库
- **React Markdown** - Markdown 渲染
- **Highlight.js** - 代码语法高亮
- **GraphQL** - API 查询语言
- **Vite** - 快速的构建工具

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/hinatayuan/ai-chat-box.git
cd ai-chat-box

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置你的 GraphQL API 端点

# 启动开发服务器
npm run dev
```

## ⚙️ 环境配置

创建 `.env` 文件并配置以下变量：

```env
# GraphQL API 端点
REACT_APP_GRAPHQL_ENDPOINT=https://your-worker.workers.dev/graphql

# 可选配置
REACT_APP_APP_NAME=AI Chat Box
REACT_APP_VERSION=1.0.0
```

## 🚀 使用方法

### 基本使用

```tsx
import AIChatBox from './components/AIChatBox';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <AIChatBox />
    </div>
  );
}
```

### 自定义 GraphQL 客户端

```tsx
import { graphqlClient } from './services/graphqlClient';

// 发送消息
const response = await graphqlClient.sendMessage({
  message: '你好，请介绍一下自己',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000
});

// 健康检查
const health = await graphqlClient.healthCheck();
```

## 🎯 功能特性

### 💬 聊天功能
- ✅ 发送文本消息
- ✅ 接收 AI 响应（Markdown 格式）
- ✅ 消息时间戳
- ✅ 自动滚动到最新消息
- ✅ 打字状态指示器
- ✅ 对话历史上下文

### 🔧 高级功能
- ✅ 模型切换（GPT-3.5/GPT-4）
- ✅ 温度调节（创意性控制）
- ✅ Token 数量限制
- ✅ 设置面板
- ✅ 清空对话
- ✅ 错误处理和重试

### 📝 Markdown 支持
- ✅ 标题、段落、列表
- ✅ 代码块和语法高亮
- ✅ 表格渲染
- ✅ 链接和引用
- ✅ 一键复制代码
- ✅ 数学公式（可扩展）

### 🎨 界面功能
- ✅ 用户/AI 头像区分
- ✅ 消息气泡样式
- ✅ 在线状态指示器
- ✅ 渐变背景设计
- ✅ 响应式布局
- ✅ 自适应输入框

## 🏗️ 项目结构

```
ai-chat-box/
├── 📁 public/
│   └── index.html
├── 📁 src/
│   ├── 📁 components/
│   │   ├── AIChatBox.tsx          # 主聊天组件
│   │   └── MarkdownRenderer.tsx   # Markdown 渲染器
│   ├── 📁 services/
│   │   └── graphqlClient.ts       # GraphQL 客户端
│   ├── App.tsx                    # 应用入口
│   ├── main.tsx                   # React 入口点
│   └── index.css                  # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔗 后端 API

这个前端项目需要配合 [AI Chat Worker](https://github.com/hinatayuan/ai-chat-worker) 后端使用。

后端提供：
- GraphQL API 接口
- OpenAI GPT 模型集成
- CORS 跨域支持
- 错误处理和验证

部署后端到 Cloudflare Workers，然后在前端配置 API 端点。

## 🌟 支持的 Markdown 功能

### 代码块
```javascript
// 支持语法高亮
function hello() {
  console.log('Hello, World!');
}
```

### 表格
| 功能 | 支持 | 说明 |
|------|------|------|
| 代码高亮 | ✅ | 多种语言 |
| 表格渲染 | ✅ | 自动格式化 |
| 链接 | ✅ | 自动打开新窗口 |

### 列表
- 无序列表支持
- 有序列表支持
- 嵌套列表支持

### 其他
> 引用块支持
> 
> **粗体** 和 *斜体* 文本
> 
> `行内代码` 高亮

## 🚀 部署

### Vercel (推荐)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# 拖拽 dist 文件夹到 netlify.com
```

### GitHub Pages
项目已包含 GitHub Actions 配置，推送到 main 分支会自动部署。

## 🔧 开发

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check
```

### 自定义主题

```css
/* 修改主要颜色 */
:root {
  --primary: #3b82f6;    /* 蓝色 */
  --secondary: #8b5cf6;  /* 紫色 */
  --accent: #ec4899;     /* 粉色 */
}
```

## 📈 性能优化

- ✅ 懒加载组件
- ✅ 代码分割
- ✅ 图片优化
- ✅ CSS 压缩
- ✅ Tree shaking
- ✅ Gzip 压缩

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 这个项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m '添加一些很棒的特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

这个项目使用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解更多详情。

## 🔗 相关链接

- **后端项目**: [AI Chat Worker](https://github.com/hinatayuan/ai-chat-worker)
- **在线演示**: [Live Demo](https://hinatayuan.github.io/ai-chat-box/)
- **OpenAI API**: [官方文档](https://platform.openai.com/docs/api-reference)
- **GraphQL**: [官方网站](https://graphql.org/)

## 👨‍💻 作者

- **HinataYuan** - [GitHub](https://github.com/hinatayuan)

## ⭐ 如果这个项目对你有帮助，请给个星星！

---

**🚀 开始使用 AI Chat Box，体验下一代智能对话界面！**