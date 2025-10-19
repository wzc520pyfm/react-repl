# 迁移说明：从 Element Plus Vue Playground 到 Antd React Playground

## 概述

本项目已成功从 Vue + Element Plus 技术栈迁移至 React + Ant Design 技术栈。

## 主要变更

### 1. 依赖更新 (package.json)

**移除的依赖：**
- Vue 相关：`vue`, `@vue/repl`, `@vueuse/core`, `@vitejs/plugin-vue`, `vue-tsc`
- Element Plus：`element-plus`
- Vue 工具：`unplugin-auto-import`, `unplugin-vue-components`

**新增的依赖：**
- React 核心：`react`, `react-dom`, `@types/react`, `@types/react-dom`
- Ant Design：`antd`
- 代码编辑器：`@codesandbox/sandpack-react`
- 构建工具：`@vitejs/plugin-react`

### 2. 构建配置更新

**vite.config.ts:**
- 替换 `@vitejs/plugin-vue` 为 `@vitejs/plugin-react`
- 移除 Vue 相关的插件配置（AutoImport, Components）
- 简化构建配置

**tsconfig.json:**
- 添加 `"jsx": "react-jsx"` 支持 React JSX
- 更新为 React 项目的 TypeScript 配置

### 3. 源代码迁移

**入口文件：**
- `src/main.ts` → `src/main.tsx`
- 使用 `ReactDOM.createRoot` 替代 Vue 的 `createApp`

**主应用组件：**
- `src/App.vue` → `src/App.tsx`
- 使用 Sandpack 替代 @vue/repl 作为代码编辑器
- 实现 React Context 进行状态管理

**组件迁移：**
- `src/components/Header.vue` → `src/components/Header.tsx`
- `src/components/Settings.vue` → `src/components/Settings.tsx`
- 使用 Ant Design 组件替代 Element Plus 组件
- 使用 React Hooks 替代 Vue Composition API

**状态管理：**
- `src/composables/store.ts` → `src/composables/store.tsx`
- 从 Vue Composables 改为 React Context API + Hooks
- 保持相同的状态序列化和 URL 同步功能

### 4. 工具函数更新

**src/utils/dependency.ts:**
- 更新版本获取函数以支持 React 和 Antd
- `getSupportedVueVersions` → `getSupportedReactVersions`
- `getSupportedEpVersions` → `getSupportedAntdVersions`
- 更新 CDN 链接生成逻辑

### 5. 模板文件更新

**删除的文件：**
- `src/template/main.vue`
- `src/template/welcome.vue`
- `src/template/element-plus.js`

**新增的文件：**
- `src/template/App.tsx` - React 应用组件示例
- `src/template/index.tsx` - React 入口文件
- `src/template/antd.ts` - Antd 样式加载脚本
- `src/template/package.json` - 示例项目的依赖配置

### 6. 清理工作

**删除的文件：**
- `src/auto-imports.d.ts` - Vue 自动导入类型定义
- `src/components.d.ts` - Vue 组件类型定义
- `src/env.d.ts` - Vue 环境类型定义

**新增的文件：**
- `src/vite-env.d.ts` - Vite 环境类型定义

### 7. 样式和配置

**unocss.config.ts:**
- 更新颜色变量从 `--el-color-primary` 到固定的 Ant Design 蓝色 `#1890ff`

**index.html:**
- 更新标题为 "Antd Playground"
- 将挂载点从 `#app` 改为 `#root`
- 移除 Vue 特定的脚本

## 功能保留

以下功能在迁移后仍然保留：

✅ 在线代码编辑和实时预览
✅ 版本切换（React、Antd、TypeScript）
✅ 深色模式支持
✅ URL 状态序列化和分享
✅ CDN 源选择（jsDelivr、unpkg）
✅ 代码重置功能
✅ 响应式布局

## 技术亮点

1. **现代化的代码编辑器**：使用 Sandpack 提供流畅的编辑体验
2. **类型安全**：完整的 TypeScript 支持
3. **组件化设计**：清晰的组件结构和职责分离
4. **状态管理**：使用 React Context API 实现简洁的状态管理
5. **URL 同步**：自动将代码状态同步到 URL，方便分享

## 后续工作建议

1. 更新 GitHub Actions 工作流（如有）
2. 更新域名和部署配置
3. 测试所有功能确保正常工作
4. 根据需要调整 UI 和样式
5. 添加更多 Antd 组件示例

## 运行项目

```bash
# 安装依赖（注意：需要 Node.js >= 20.10）
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 注意事项

- 项目要求 Node.js 版本 >= 20.10
- 如果 pnpm 版本过低，建议升级到 10.x
- esbuild 版本冲突可能需要清理 node_modules 后重新安装

