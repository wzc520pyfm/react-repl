# Antd Playground 架构文档

## 架构设计理念

本项目采用与 Element Plus Playground 相同的轻量级架构设计，核心理念是：

1. **通过 CDN 加载依赖**：避免将 React 和 Antd 打包进项目
2. **浏览器内编译**：使用 Babel Standalone 在浏览器中编译 JSX
3. **iframe 隔离预览**：使用 iframe 提供安全的代码执行环境
4. **URL 状态持久化**：将代码和配置序列化到 URL 中

## 核心组件

### 1. Editor 组件 (`src/components/Editor.tsx`)

**功能**：提供代码编辑功能

**实现**：
- 使用 Monaco Editor（VS Code 的编辑器核心）
- 支持 TypeScript 语法高亮和智能提示
- 支持浅色/深色主题切换
- 实时同步编辑内容到 store

**关键代码**：
```typescript
import * as monaco from 'monaco-editor'

const editor = monaco.editor.create(container, {
  value: code,
  language: 'typescript',
  theme: dark ? 'vs-dark' : 'vs'
})
```

### 2. Preview 组件 (`src/components/Preview.tsx`)

**功能**：预览编译后的代码运行结果

**实现原理**：
1. 动态生成包含 Import Maps 的 HTML
2. 通过 UMD 格式从 CDN 加载 React、ReactDOM 和 Antd
3. 使用 Babel Standalone 在浏览器中编译 JSX
4. 在 iframe 中渲染结果

**关键流程**：

```html
<!-- Import Maps 配置 -->
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js",
    "antd": "https://cdn.jsdelivr.net/npm/antd@5.24.3/dist/antd.min.js"
  }
}
</script>

<!-- 加载库 -->
<script src="...react.production.min.js"></script>
<script src="...antd.min.js"></script>

<!-- 用户代码 -->
<script type="text/babel">
  const { useState } = React;
  const { Button } = antd;
  
  // 用户编写的代码
  function App() { ... }
  
  // 渲染
  ReactDOM.createRoot(...).render(<App />);
</script>
```

### 3. Store (`src/composables/store.tsx`)

**功能**：状态管理

**管理内容**：
- 用户代码
- React、Antd、TypeScript 版本
- 序列化/反序列化

**关键方法**：
- `updateFile`：更新代码
- `setVersion`：切换库版本
- `serialize`：序列化到 URL
- `resetFiles`：重置代码

### 4. Header 组件 (`src/components/Header.tsx`)

**功能**：顶部工具栏

**包含功能**：
- 版本选择器（React、Antd、TypeScript）
- 主题切换
- 分享链接
- 重置代码
- 刷新预览
- CDN 设置

## CDN 加载机制

### 依赖加载方式

```typescript
// src/utils/dependency.ts
export const genCdnLink = (pkg: string, version: string, path: string) => {
  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}@${version}${path}`
    case 'unpkg':
      return `https://unpkg.com/${pkg}@${version}${path}`
  }
}
```

### 为什么使用 UMD 格式？

1. **浏览器兼容**：UMD 格式可以直接在浏览器中使用
2. **全局变量**：暴露为 `React`、`ReactDOM`、`antd` 等全局变量
3. **无需构建**：不需要 webpack 或其他打包工具

### Import Maps 的作用

Import Maps 允许我们在代码中使用 ES6 import 语法，但实际加载的是 CDN 上的 UMD 版本：

```javascript
// 用户写
import { Button } from 'antd'

// 实际映射到
window.antd.Button
```

## 编译流程

### Babel Standalone

Babel Standalone 是 Babel 的浏览器版本，可以在运行时编译代码：

```html
<script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.7/babel.min.js"></script>

<script type="text/babel">
  // JSX 代码会被自动编译
  const element = <Button>Click me</Button>
</script>
```

### 编译配置

默认配置自动处理：
- JSX 语法转换
- ES6+ 特性转换
- React 相关转换

## 数据流

```
用户编辑代码
    ↓
Editor 组件 onChange
    ↓
Store.updateFile
    ↓
更新 URL hash (序列化)
    ↓
Preview 组件接收新代码
    ↓
生成新的 iframe HTML
    ↓
Babel 编译 JSX
    ↓
渲染结果
```

## 对比：为什么不用 Sandpack？

### Sandpack 的特点
- ✅ 功能完整，开箱即用
- ✅ 内置依赖管理
- ✅ 完整的构建系统
- ❌ 体积较大（~2MB）
- ❌ 黑盒实现，不易定制
- ❌ 需要打包所有依赖

### 当前架构的优势
- ✅ 轻量级（~500KB）
- ✅ 完全可控的编译流程
- ✅ 灵活的 CDN 切换
- ✅ 简单直观的代码结构
- ✅ 与 Element Plus Playground 架构一致

## 性能优化

### 1. 按需加载
只加载用户选择版本的库，不打包进项目

### 2. CDN 缓存
利用 CDN 的全球节点和浏览器缓存

### 3. 延迟编译
只在代码变化时才重新编译和渲染

### 4. iframe 沙箱
隔离代码执行，避免影响主应用

## 扩展性

### 添加新组件库

```typescript
// 1. 在 dependency.ts 中添加 CDN 配置
export const genImportMap = (versions) => ({
  ...
  'new-library': genCdnLink('new-library', version, '/dist/index.umd.js')
})

// 2. 在 Preview 组件中加载
<script src="${genCdnLink('new-library', ...)}"></script>

// 3. 在用户代码中使用
const { Component } = window.NewLibrary
```

### 添加新语言支持

只需在 Monaco Editor 中配置新的语言支持即可。

## 安全考虑

1. **iframe sandbox**：限制 iframe 的权限
2. **CSP 策略**：内容安全策略
3. **代码隔离**：用户代码在 iframe 中执行
4. **无服务端执行**：所有代码在浏览器中运行

## 总结

本架构的核心思想是：**保持简单、保持轻量、保持可控**。通过 CDN + 浏览器编译的方式，我们实现了一个完全客户端的 playground，无需服务端支持，易于部署和维护。

