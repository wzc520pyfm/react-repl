# 🔥 紧急修复：Ant Design 加载错误

## 问题

如果你看到以下错误：
```
Error: Ant Design is not loaded
```

## 快速修复步骤

### 方法 1：清除缓存（推荐）

1. **完全刷新浏览器**
   - Windows/Linux: 按 `Ctrl + Shift + R`
   - Mac: 按 `Cmd + Shift + R`

2. **清除浏览器缓存**
   - Chrome: `Ctrl/Cmd + Shift + Delete` → 清除缓存
   - 或右键点击刷新按钮 → "清空缓存并硬性重新加载"

3. **重新加载页面**

### 方法 2：手动修复 Import Map

如果方法 1 不起作用，手动更新 CDN 地址：

1. **打开 Import Map Editor**
   - 点击顶部工具栏的 `</>` 图标

2. **检查 antd 的 URL**
   - 查找 `antd` 这一行
   - 检查 URL 是否包含 `antd-with-locales.min.js`

3. **如果是错误的地址，修改它**
   
   **错误的地址（❌）：**
   ```
   https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd.min.js
   ```
   
   **正确的地址（✅）：**
   ```
   https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd-with-locales.min.js
   ```

4. **保存更改**
   - 点击 "Save Changes"
   - 预览会自动重新加载

### 方法 3：重置到默认配置

如果以上方法都不起作用：

1. 清空浏览器地址栏的 hash（`#` 后面的所有内容）
2. 刷新页面
3. 应用会加载默认配置（已修复）

## 为什么会出现这个问题？

### 原因

Ant Design 5.x 的正确 UMD 包名是：
- ✅ `antd-with-locales.min.js` - 包含国际化的完整版
- ❌ `antd.min.js` - 这个文件不存在或不完整

之前版本使用了错误的文件名，导致 antd 无法正常加载。

## 已修复的版本

**v2.0.1** 已修复此问题，包含以下改进：

### 1. 更新默认 CDN 地址

```typescript
// src/composables/store.tsx
const getDefaultImportMap = (vers: Versions): ImportMap => ({
  'react': '...react.production.min.js',
  'react-dom': '...react-dom.production.min.js',
  'antd': '...antd-with-locales.min.js',  // ✅ 已修复
  '@ant-design/icons': '...index.umd.min.js',
})
```

### 2. 添加调试信息

现在打开浏览器控制台会看到：
```javascript
Available globals: {
  React: "object",
  ReactDOM: "object", 
  antd: "object",     // ✅ 应该是 "object"
  Babel: "object"
}
```

如果 `antd` 显示 `"undefined"`，说明 CDN 地址有问题。

### 3. 更友好的错误提示

如果加载失败，会看到详细的错误信息，包括实际使用的 CDN URL。

## 验证修复

修复后，你应该能够：

1. ✅ 看到默认示例代码正常渲染
2. ✅ 使用 Antd 组件（Button、Input 等）
3. ✅ 看到 Antd Icons 正常显示
4. ✅ 控制台没有 `antd is not defined` 错误

### 测试代码

尝试运行这段代码：

```jsx
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <Space direction="vertical">
      <Typography.Title level={2}>
        Count: {count}
      </Typography.Title>
      <Button 
        type="primary" 
        onClick={() => setCount(count + 1)}
      >
        Increment
      </Button>
    </Space>
  )
}
```

如果能正常工作，说明修复成功！

## 相关文档

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 完整的故障排查指南
- [CHANGELOG.md](./CHANGELOG.md) - 详细的更新日志
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始指南

## 仍然有问题？

### 检查清单

- [ ] 已清除浏览器缓存
- [ ] 已硬刷新页面（Ctrl+Shift+R）
- [ ] Import Map 中 antd 使用 `antd-with-locales.min.js`
- [ ] 浏览器控制台显示 `antd: "object"`
- [ ] 网络连接正常

### 调试步骤

1. **打开开发者工具** (F12)

2. **查看 Console 标签**
   - 查找 "Available globals" 日志
   - 检查 antd 的类型

3. **查看 Network 标签**
   - 刷新页面
   - 查找 `antd` 的请求
   - 确认返回状态是 200
   - 检查 URL 是否正确

4. **测试 CDN 连接**
   在浏览器新标签页直接访问：
   ```
   https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd-with-locales.min.js
   ```
   应该能下载文件

### 获取帮助

如果以上方法都无法解决，请：

1. **收集信息**
   - 浏览器版本
   - 错误截图
   - 控制台完整输出
   - Network 标签截图

2. **提交 Issue**
   访问 GitHub 仓库提交问题报告

## 更新说明

**发布日期**: 2025-01-XX  
**版本**: v2.0.1  
**严重程度**: 🔴 高（影响核心功能）  
**状态**: ✅ 已修复

---

**重要提示**: 如果你在 v2.0.1 之前保存了带有错误 CDN 地址的链接，需要按照"方法 2"手动更新 Import Map。

