# Antd Playground 功能特性

## 🎨 核心功能

### 1. 在线代码编辑器
- **Monaco Editor**：VS Code 同款编辑器
- **语法高亮**：完整的 TypeScript/JSX 支持
- **智能提示**：代码自动补全
- **主题切换**：支持浅色和深色主题

### 2. 实时预览
- **即时编译**：使用 Babel Standalone 在浏览器中编译 JSX
- **iframe 隔离**：安全的代码执行环境
- **错误提示**：友好的错误信息显示
- **自动刷新**：代码变化时自动更新预览

### 3. Import Map 编辑器 🆕
- **可视化管理**：查看所有 CDN 依赖
- **编辑功能**：修改现有包的 URL
- **添加新包**：轻松添加第三方库
- **删除包**：移除不需要的依赖
- **即时生效**：保存后立即重新加载

**默认包含：**
- React 18.3.1
- React DOM 18.3.1
- Ant Design 5.27.5
- Ant Design Icons 6.1.0

**支持添加：**
- Lodash、Day.js、GSAP 等工具库
- ECharts、Chart.js 等图表库
- 任何支持 UMD 格式的 NPM 包

### 4. 版本管理
- **React 版本**：切换不同 React 版本
- **Antd 版本**：切换不同 Ant Design 版本
- **TypeScript 版本**：切换 TypeScript 编译器版本
- **自动更新**：版本切换时自动更新 Import Map

### 5. URL 状态持久化
- **自动保存**：代码自动序列化到 URL hash
- **分享链接**：复制 URL 即可分享代码
- **无需登录**：无需账号即可使用
- **历史记录**：浏览器历史记录保存状态

### 6. CDN 源选择
- **jsDelivr**：默认，全球 CDN 网络
- **jsDelivr Fastly**：Fastly 加速节点
- **unpkg**：备选 CDN 源

### 7. 代码管理
- **重置代码**：一键恢复默认模板
- **刷新预览**：强制刷新预览环境
- **复制链接**：快速分享当前代码

### 8. 响应式设计
- **桌面优化**：完整功能体验
- **平板适配**：自适应布局
- **移动友好**：基础功能可用

## 🔧 技术特性

### 轻量级架构
- **无需构建**：直接在浏览器中运行
- **CDN 加载**：依赖从 CDN 动态加载
- **快速启动**：秒级打开和运行
- **低带宽**：核心代码小于 500KB

### 浏览器内编译
- **Babel Standalone**：JSX 转换
- **实时编译**：无延迟的编译体验
- **错误提示**：清晰的编译错误信息

### 安全隔离
- **iframe 沙箱**：用户代码在隔离环境运行
- **无服务器**：纯前端实现
- **无数据上传**：代码不离开浏览器

## 📦 预置功能

### React Hooks
预先导入常用 Hooks，直接使用：
```javascript
useState, useEffect, useCallback, useMemo, useRef
```

### Ant Design 组件
预先解构常用组件：
```javascript
Button, Input, Space, Typography, Form, Select, 
Table, Modal, message, Card, Row, Col, Divider, 
Tag, Alert, Tabs, Drawer, Dropdown, Menu, Checkbox,
Radio, Switch, DatePicker, Upload, Progress
```

### Icons
预先导入常用图标：
```javascript
SmileOutlined, HeartOutlined, StarOutlined,
HomeOutlined, UserOutlined, SettingOutlined,
PlusOutlined, DeleteOutlined, EditOutlined
```

## 🎯 使用场景

### 1. 学习 Ant Design
- 快速尝试 Antd 组件
- 查看组件效果
- 学习 API 用法

### 2. 原型开发
- 快速验证想法
- 制作 UI 原型
- 演示组件效果

### 3. Bug 复现
- 创建最小复现示例
- 分享问题链接
- 协助排查问题

### 4. 代码分享
- 分享代码片段
- 教学演示
- 技术交流

### 5. 面试准备
- 练习 React 编码
- 准备技术面试
- 快速验证算法

## 🚀 性能特点

### 加载速度
- **首次加载**：~2-3 秒（取决于网络）
- **二次加载**：~500ms（CDN 缓存）
- **代码编译**：<100ms（浏览器内编译）

### 资源大小
- **主应用**：~300KB（压缩后）
- **Monaco Editor**：~2MB（首次加载）
- **React + Antd**：通过 CDN，利用缓存

### 响应速度
- **编辑响应**：即时
- **预览更新**：<200ms
- **版本切换**：~1-2 秒

## 🔒 安全特性

### 沙箱隔离
- iframe sandbox 属性
- 限制不安全操作
- 防止恶意代码

### 无服务器风险
- 纯客户端运行
- 无数据库
- 无用户数据存储

### CORS 保护
- 仅加载信任的 CDN
- 验证资源完整性

## 📱 兼容性

### 浏览器支持
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### 功能支持
- ✅ ES2020+
- ✅ JSX/TSX
- ✅ Async/Await
- ✅ 最新 React Features

## 🎓 学习资源

### 内置示例
- 默认模板代码
- 组件使用示例
- 最佳实践

### 文档
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- [IMPORT_MAP_EXAMPLES.md](./IMPORT_MAP_EXAMPLES.md) - Import Map 示例
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构说明
- [MIGRATION.md](./MIGRATION.md) - 迁移指南

## 🔮 未来计划

### 短期 (v2.1)
- [ ] 支持多文件编辑
- [ ] 文件树视图
- [ ] 代码格式化（Prettier）
- [ ] 导出项目功能

### 中期 (v2.2)
- [ ] TypeScript 类型检查
- [ ] 代码片段库
- [ ] 键盘快捷键
- [ ] 全屏编辑模式

### 长期 (v3.0)
- [ ] 账号系统（可选）
- [ ] 作品集功能
- [ ] 协作编辑
- [ ] 插件系统

## 💡 使用技巧

### 1. 快速测试组件
直接在默认代码中修改，立即看到效果。

### 2. 添加第三方库
使用 Import Map 编辑器添加 lodash、dayjs 等工具库。

### 3. 保存作品
复制 URL 保存到书签或笔记中。

### 4. 分享代码
点击分享按钮，URL 已自动复制到剪贴板。

### 5. 深色模式
切换主题获得更舒适的编码体验。

## 🤝 贡献

欢迎提交：
- Bug 报告
- 功能建议
- 代码贡献
- 文档改进

## 📄 许可证

MIT License © 2025

---

**立即体验：** [Antd Playground](https://your-domain.com)

