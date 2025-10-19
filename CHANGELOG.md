# 更新日志

## v2.0.1 - Bug 修复 (2025-01-XX)

### 🐛 Bug 修复

#### 1. Monaco Editor Web Worker 配置错误

**问题**：
```
Uncaught Error: You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker
```

**原因**：
Monaco Editor 需要正确配置 Web Workers 才能启用语法高亮、代码补全等功能。

**解决方案**：
```typescript
// src/components/Editor.tsx
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// ... 其他 workers

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}
```

**改进**：
- ✅ 使用 Vite 的 `?worker` 语法自动处理 Worker
- ✅ 支持 TypeScript、JavaScript、JSON、CSS、HTML 等语言
- ✅ 代码智能提示和语法检查正常工作

**相关文件**：
- `src/components/Editor.tsx` - Worker 配置
- `vite.config.ts` - Vite Worker 构建配置

---

#### 2. Ant Design CDN 地址更新

**问题**：
```
Error: Ant Design is not loaded
```

**原因**：
使用了错误的 UMD 文件名。Ant Design 5.x 的 UMD 包名为 `antd-with-locales.min.js` 而不是 `antd.min.js`。

**解决方案**：
```javascript
// 之前（❌ 错误）
'antd': 'https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd.min.js'

// 现在（✅ 正确）
'antd': 'https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd-with-locales.min.js'
```

**说明**：
- `antd.min.js` - 不存在或不完整
- `antd-with-locales.min.js` - 完整的 UMD 包，包含国际化支持

**相关文件**：
- `src/composables/store.tsx` - 默认 Import Map 配置
- 所有文档中的 CDN 地址示例

**影响**：
- ✅ antd 组件现在可以正常加载和使用
- ✅ 包含完整的国际化支持
- ✅ Icons 也已更新到正确版本（5.5.1）

---

#### 2. antd is not defined 加载时序错误

**问题**：
```
Uncaught ReferenceError: antd is not defined
```

**原因**：
使用 `type="text/babel"` 时，Babel 会立即编译和执行代码，但此时 antd 等 CDN 库可能还没有加载完成。

**解决方案**：
```javascript
// 之前（❌ 错误）
<script type="text/babel">
  const { Button } = antd;  // antd 可能还未加载
</script>

// 现在（✅ 正确）
window.addEventListener('load', function() {
  // 确保所有库都已加载
  if (typeof antd === 'undefined') {
    throw new Error('Ant Design is not loaded');
  }
  
  // 手动编译和执行代码
  const transformed = Babel.transform(userCode, {
    presets: ['react']
  }).code;
  
  eval(transformed);
});
```

**改进**：
- ✅ 等待 `window.load` 事件，确保所有资源加载完成
- ✅ 检查必要的全局变量（React、ReactDOM、antd、Babel）
- ✅ 手动控制 Babel 编译时机
- ✅ 更好的错误提示

**相关文件**：
- `src/components/Preview.tsx` - `generatePreviewHTML` 函数

**测试通过**：
- ✅ React 和 antd 正确加载
- ✅ 用户代码正确编译和执行
- ✅ 错误提示更清晰

---

## v2.0.0 - 重大重构 (2025-01-XX)

### 🎉 架构改进

#### 移除 Sandpack，采用轻量级架构
- ❌ **移除**：`@codesandbox/sandpack-react` (~2MB)
- ✅ **新增**：`monaco-editor` + Babel Standalone (~500KB)
- ✅ **保持**：与 Element Plus Playground 相同的架构设计

#### 核心改变
```
从：Vue 3 + Element Plus + @vue/repl
到：React 18 + Ant Design + 自实现 REPL
```

### 🐛 Bug 修复

#### 1. 跨域错误修复 (CRITICAL)

**问题**：
```
SecurityError: Failed to read a named property 'document' from 'Window': 
Blocked a frame with origin "https://localhost:5173" from accessing a cross-origin frame.
```

**原因**：
试图通过 JavaScript 动态访问和写入 iframe 的 `contentDocument`，违反了浏览器的同源策略。

**解决方案**：
```typescript
// 之前（❌ 错误）
const iframeDoc = iframe.contentDocument
iframeDoc.open()
iframeDoc.write(html)
iframeDoc.close()

// 现在（✅ 正确）
<iframe srcDoc={html} />
```

使用 `srcDoc` 属性，iframe 内容与主页面同源，不会触发跨域限制。

**相关文件**：
- `src/components/Preview.tsx`

**提交时间**：2025-01-XX

---

#### 2. CDN 加载顺序优化

**问题**：
Babel Standalone 在 React 和 Antd 之前加载，导致编译时无法识别全局变量。

**解决方案**：
```html
<!-- 正确的加载顺序 -->
1. React UMD
2. Antd UMD  
3. Ant Design Icons
4. Babel Standalone (最后加载)
```

**相关文件**：
- `src/components/Preview.tsx` - `generatePreviewHTML` 函数

---

#### 3. 全局变量解构问题

**问题**：
Icons 对象可能不存在或名称错误，导致解构失败。

**解决方案**：
```javascript
// 添加安全检查
const icons = window.icons || {};
const { SmileOutlined } = icons;
```

**相关文件**：
- `src/components/Preview.tsx`

---

### ✨ 新增特性

#### 1. 自实现的轻量级 REPL

**组件**：
- `Editor.tsx` - Monaco Editor 封装
- `Preview.tsx` - iframe 预览和 Babel 编译
- `Store.tsx` - 状态管理（React Context）

**优势**：
- 完全可控的编译流程
- 灵活的 CDN 切换
- 轻量级（不到 500KB）
- 代码结构清晰

---

#### 2. 增强的错误处理

```javascript
// iframe 内错误捕获
window.addEventListener('error', (e) => {
  console.error('Runtime error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled rejection:', e.reason);
});

// 渲染错误捕获
try {
  root.render(React.createElement(App));
} catch (error) {
  // 显示友好的错误信息
  document.getElementById('root').innerHTML = ...;
}
```

**相关文件**：
- `src/components/Preview.tsx`

---

#### 3. 预解构常用 API

为用户代码预先解构常用的 React hooks 和 Antd 组件：

```javascript
// React Hooks
const { useState, useEffect, useCallback, useMemo } = React;

// Antd 组件
const { 
  Button, Input, Space, Typography, 
  Form, Select, Table, Modal, message,
  Card, Row, Col, Divider, Tag, Alert
} = antd;

// Icons
const { SmileOutlined, HeartOutlined, StarOutlined } = icons;
```

**好处**：用户可以直接使用，无需额外导入。

---

### 📦 依赖变化

#### 移除的依赖
```json
{
  "vue": "^3.5.18",
  "@vue/repl": "^4.6.2",
  "@vueuse/core": "^12.8.2",
  "element-plus": "^2.10.4",
  "@vitejs/plugin-vue": "^5.2.4",
  "unplugin-auto-import": "^19.3.0",
  "unplugin-vue-components": "^28.8.0",
  "vue-tsc": "^2.2.12",
  "@codesandbox/sandpack-react": "^2.19.13"  // 初版使用，后移除
}
```

#### 新增的依赖
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "antd": "^5.27.5",
  "monaco-editor": "^0.54.0",
  "@vitejs/plugin-react": "^4.3.4",
  "@types/react": "^18.3.18",
  "@types/react-dom": "^18.3.5"
}
```

---

### 🔄 架构对比

| 特性 | Element Plus | Antd Playground |
|------|-------------|-----------------|
| 编辑器方案 | @vue/repl | Monaco Editor |
| 编译器 | @vue/compiler-sfc | Babel Standalone |
| CDN 加载 | ✅ | ✅ |
| 代码体积 | ~500KB | ~500KB |
| 架构复杂度 | 低 | 低 |

---

### 📝 文档更新

新增文档：
- `QUICKSTART.md` - 快速开始指南
- `ARCHITECTURE.md` - 详细架构说明
- `MIGRATION.md` - 迁移文档
- `CHANGELOG.md` - 本文件

更新文档：
- `README.md` - 更新为 Antd Playground 说明

---

### 🚀 性能优化

1. **CDN 缓存**：充分利用浏览器和 CDN 缓存
2. **按需加载**：只加载用户选择的版本
3. **延迟编译**：只在代码变化时重新编译
4. **iframe 隔离**：避免影响主应用性能

---

### ⚠️ 破坏性变更

1. **不再兼容 Vue 代码**：从 Vue SFC 改为 React JSX
2. **API 变化**：从 Element Plus 组件改为 Antd 组件
3. **构建配置**：从 Vue 插件改为 React 插件

---

### 🔧 迁移指南

详见 [MIGRATION.md](./MIGRATION.md)

---

### 📚 相关资源

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Babel Standalone](https://babeljs.io/docs/en/babel-standalone)
- [Ant Design](https://ant.design/)
- [Element Plus Playground](https://github.com/element-plus/element-plus-playground)

---

## v1.0.0 - 初始版本 (已弃用)

基于 Sandpack 的实现（已在 v2.0.0 中移除）

---

## 致谢

感谢 Element Plus Playground 项目提供的设计灵感和架构参考。

---

**最后更新**：2025-01-XX

