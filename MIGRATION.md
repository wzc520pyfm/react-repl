# 迁移说明：从 Element Plus Vue Playground 到 Antd React Playground

## 概述

本项目已从 Vue + Element Plus 技术栈迁移至 React + Ant Design 技术栈，**并保持了与原项目相同的轻量级架构设计**。

## 核心架构保持不变

### ✅ 保留的设计理念

1. **通过 CDN 加载依赖**
   - 原项目：通过 CDN 加载 Vue 和 Element Plus
   - 新项目：通过 CDN 加载 React 和 Ant Design

2. **浏览器内编译**
   - 原项目：使用 @vue/compiler-sfc 编译 Vue SFC
   - 新项目：使用 Babel Standalone 编译 JSX

3. **Import Maps**
   - 原项目：使用 Import Maps 映射 Vue 依赖
   - 新项目：使用 Import Maps 映射 React 依赖

4. **iframe 预览**
   - 两者都使用 iframe 隔离代码执行环境

5. **URL 状态持久化**
   - 保持相同的序列化机制

### ❌ 不使用 Sandpack

与初版设计不同，最终版本**没有使用** Sandpack，原因：

1. **Sandpack 太重**：Sandpack 是一个完整的 CodeSandbox 运行时，包含构建系统、依赖管理等，体积约 2MB
2. **架构不一致**：与原项目的轻量级设计理念不符
3. **黑盒实现**：不易定制和控制

## 主要变更

### 1. 依赖更新 (package.json)

**移除的依赖：**
- Vue 相关：`vue`, `@vue/repl`, `@vueuse/core`, `@vitejs/plugin-vue`, `vue-tsc`
- Element Plus：`element-plus`
- Vue 工具：`unplugin-auto-import`, `unplugin-vue-components`
- ~~Sandpack（初版使用，最终移除）~~

**新增的依赖：**
- React 核心：`react`, `react-dom`, `@types/react`, `@types/react-dom`
- 编辑器：`monaco-editor`（对应原项目的 Monaco Editor）
- 构建工具：`@vitejs/plugin-react`

**保持轻量**：
- 总依赖数量与原项目相当
- 只在开发环境使用 React，生产环境通过 CDN 加载

### 2. 核心组件对比

#### 原项目 (@vue/repl)
```
@vue/repl 组件
├── Monaco Editor (代码编辑)
├── Vue Compiler (编译 SFC)
└── Preview iframe (预览)
```

#### 新项目（自实现）
```
自实现 Playground
├── Editor.tsx (Monaco Editor)
├── Preview.tsx (Babel + iframe)
└── Store (状态管理)
```

### 3. 编译机制对比

| 特性 | 原项目 (Vue) | 新项目 (React) |
|------|-------------|---------------|
| 编译器 | @vue/compiler-sfc | Babel Standalone |
| 编译位置 | 浏览器 | 浏览器 |
| 输入格式 | Vue SFC (.vue) | JSX (.tsx) |
| 输出格式 | ES Module | ES Module |
| CDN 加载 | ✅ | ✅ |

### 4. 文件结构变化

**原项目结构：**
```
src/
├── App.vue                    # 主应用
├── composables/
│   └── store.ts              # 使用 @vue/repl
├── components/
│   ├── Header.vue
│   └── Settings.vue
└── template/
    ├── main.vue
    ├── welcome.vue
    └── element-plus.js
```

**新项目结构：**
```
src/
├── App.tsx                    # 主应用 (React)
├── composables/
│   └── store.tsx             # 自实现状态管理
├── components/
│   ├── Header.tsx            # Antd 组件
│   ├── Settings.tsx          # Antd 组件
│   ├── Editor.tsx            # 新增：编辑器组件
│   └── Preview.tsx           # 新增：预览组件
└── template/
    └── App.tsx               # 默认示例代码
```

### 5. CDN 加载方式

#### React + Antd 通过 UMD 加载

```html
<!-- React -->
<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js"></script>

<!-- Antd -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@5.24.3/dist/reset.css" />
<script src="https://cdn.jsdelivr.net/npm/antd@5.24.3/dist/antd.min.js"></script>

<!-- Babel Standalone -->
<script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.7/babel.min.js"></script>
```

#### Import Maps 配置

```json
{
  "imports": {
    "react": "CDN_URL/react.production.min.js",
    "react-dom": "CDN_URL/react-dom.production.min.js",
    "antd": "CDN_URL/antd.min.js",
    "@ant-design/icons": "CDN_URL/icons.umd.js"
  }
}
```

### 6. 编辑器实现

#### 原项目
```typescript
// 使用 @vue/repl 提供的 Monaco 集成
import { Repl } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'

<Repl editor={Monaco} ... />
```

#### 新项目
```typescript
// 直接使用 Monaco Editor
import * as monaco from 'monaco-editor'

monaco.editor.create(container, {
  value: code,
  language: 'typescript',
  theme: dark ? 'vs-dark' : 'vs'
})
```

### 7. 预览机制

#### 原项目 (@vue/repl)
- 内部集成了 iframe 预览
- 自动处理 Vue 组件的编译和渲染
- 内置错误处理

#### 新项目（自实现）
```typescript
// 生成包含用户代码的完整 HTML
function generatePreviewHTML(code, reactVersion, antdVersion) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <!-- 加载 React、Antd、Babel -->
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          ${code}  // 用户代码
          ReactDOM.createRoot(...).render(<App />)
        </script>
      </body>
    </html>
  `
}
```

## 功能保留

以下功能在迁移后完全保留：

✅ 在线代码编辑和实时预览
✅ 版本切换（React、Antd、TypeScript）
✅ 深色模式支持
✅ URL 状态序列化和分享
✅ CDN 源选择（jsDelivr、unpkg）
✅ 代码重置功能
✅ 响应式布局
✅ 轻量级架构

## 对比总结

| 特性 | Element Plus Playground | Antd Playground |
|------|------------------------|-----------------|
| 框架 | Vue 3 | React 18 |
| 组件库 | Element Plus | Ant Design |
| 编辑器方案 | @vue/repl (内置) | 自实现 (Monaco + Babel) |
| 编译器 | @vue/compiler-sfc | Babel Standalone |
| CDN 加载 | ✅ | ✅ |
| Import Maps | ✅ | ✅ |
| iframe 预览 | ✅ | ✅ |
| 代码体积 | ~500KB | ~500KB |
| 架构理念 | 轻量级 | 轻量级 ✅ |

## 为什么自实现而不用现成方案？

### 考虑过的方案

1. **Sandpack** ❌
   - 功能完整但太重（~2MB）
   - 黑盒实现，不易定制
   - 与原项目架构不符

2. **react-live** ❌
   - 功能有限
   - 不支持多文件
   - 编辑器功能弱

3. **自实现** ✅
   - 完全可控
   - 与原项目架构一致
   - 轻量级（~500KB）
   - 灵活的 CDN 切换

## 运行项目

```bash
# 安装依赖（注意：需要 Node.js >= 20.10）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 技术亮点

1. **保持原汁原味**：与 Element Plus Playground 架构完全一致
2. **CDN 友好**：所有依赖通过 CDN 加载
3. **浏览器编译**：无需服务端支持
4. **完全客户端**：可部署到任何静态托管服务
5. **易于维护**：代码结构清晰，逻辑简单

## 参考文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 详细的架构设计文档
- [README.md](./README.md) - 项目说明
- [Element Plus Playground](https://github.com/element-plus/element-plus-playground) - 原始项目

## 许可证

MIT License © 2025
