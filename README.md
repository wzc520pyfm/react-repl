# Antd Playground

一个轻量级的 Ant Design 在线 Playground，灵感来自 [Element Plus Playground](https://github.com/element-plus/element-plus-playground)。

## 特性

- 🎨 **实时预览**：编写 React 代码并即时查看结果
- 📦 **版本控制**：在不同版本的 React、Antd 和 TypeScript 之间切换
- 💾 **自动保存**：代码自动保存在 URL 中，方便分享
- 🌓 **深色模式**：支持深色/浅色主题切换
- 🔗 **分享**：通过 URL 分享你的代码
- ⚙️ **CDN 选项**：支持多个 CDN 提供商（jsDelivr、unpkg）
- 🪶 **轻量级**：通过 CDN 加载依赖，无需打包

## 技术架构

与原始的 Element Plus Playground 类似，本项目采用轻量级架构：

- **Monaco Editor**：强大的代码编辑器
- **Babel Standalone**：浏览器内 JSX 编译
- **Import Maps**：通过 CDN 加载 React 和 Antd
- **iframe 预览**：隔离的预览环境

### 为什么不用 Sandpack？

Sandpack 虽然功能强大，但对于简单的 playground 来说过于重量级。我们选择了更接近原始 Vue Playground 的实现方式：

1. **轻量级**：只加载必需的依赖
2. **灵活性**：完全控制编译和预览流程
3. **CDN 友好**：通过 CDN 动态加载不同版本的库
4. **简单直观**：代码结构清晰，易于理解和维护

## 技术栈

- **React 18.x**：现代 React 
- **Ant Design 5.x**：企业级 UI 设计语言
- **Monaco Editor**：VS Code 的编辑器核心
- **Vite**：新一代前端构建工具
- **TypeScript**：类型安全开发

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 工作原理

1. **编辑器**：使用 Monaco Editor 提供代码编辑功能
2. **编译**：使用 Babel Standalone 在浏览器中将 JSX 编译为 JavaScript
3. **预览**：在 iframe 中渲染编译后的代码
4. **依赖加载**：通过 Import Maps 和 UMD 从 CDN 加载 React 和 Antd
5. **状态持久化**：将代码和配置序列化到 URL hash 中

## 功能亮点

✅ 在线代码编辑和实时预览  
✅ 版本切换（React、Antd、TypeScript）  
✅ 深色模式支持  
✅ URL 状态序列化和分享  
✅ CDN 源选择（jsDelivr、unpkg）  
✅ 代码重置功能  
✅ 响应式布局  

## 致谢

- [Element Plus Playground](https://github.com/element-plus/element-plus-playground) - 原始项目灵感来源
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - 强大的代码编辑器
- [Ant Design](https://ant.design/) - 企业级 UI 设计语言
- [Babel](https://babeljs.io/) - JavaScript 编译器

## 许可证

[MIT](./LICENSE) License © 2025
