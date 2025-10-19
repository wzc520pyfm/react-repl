# 故障排查指南

## 常见问题

### 1. `antd is not defined` 或 `Ant Design is not loaded` 错误 ✅ 已修复

**问题描述：**
```
Uncaught ReferenceError: antd is not defined
或
Error: Ant Design is not loaded
```

**原因：**
1. CDN 库加载时序问题
2. 使用了错误的 antd UMD 文件名

**解决方案（v2.0.1）：**

**正确的 Ant Design 5.x CDN 地址：**
```
✅ 正确: https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd-with-locales.min.js
❌ 错误: https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd.min.js
```

**重要**: Ant Design 5.x 必须使用 `antd-with-locales.min.js` 而不是 `antd.min.js`！

**如果仍然遇到此问题：**
1. 打开 Import Map Editor（`</>` 图标）
2. 检查 antd 的 CDN 地址是否正确
3. 如果是 `antd.min.js`，改为 `antd-with-locales.min.js`
4. 清除浏览器缓存
5. 硬刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）

**调试方法：**
打开浏览器控制台，会看到调试信息：
```javascript
Available globals: {
  React: "object",
  ReactDOM: "object",
  antd: "object",    // 应该是 "object" 而不是 "undefined"
  Babel: "object"
}
```

---

### 2. 跨域错误 ✅ 已修复

**问题描述：**
```
SecurityError: Failed to read a named property 'document' from 'Window'
```

**解决方案（v2.0.0）：**
使用 iframe 的 `srcDoc` 属性而不是动态写入 `contentDocument`。

---

### 3. 组件无法正常显示

**可能原因 1：样式未加载**

检查浏览器网络标签，确认以下资源已加载：
- Ant Design CSS: `https://cdn.jsdelivr.net/npm/antd@5.x/dist/reset.css`

**可能原因 2：版本不兼容**

确保使用的是兼容的版本：
- React 18.x
- Ant Design 5.x

**可能原因 3：组件使用错误**

检查 Antd 文档，确认组件的正确用法。

---

### 4. 代码无法编译

**错误提示：JSX syntax error**

**常见问题：**
```jsx
// ❌ 错误：忘记闭合标签
function App() {
  return <div>Hello
}

// ✅ 正确
function App() {
  return <div>Hello</div>
}
```

**常见问题：多个根元素**
```jsx
// ❌ 错误：返回多个元素
function App() {
  return (
    <div>First</div>
    <div>Second</div>
  )
}

// ✅ 正确：使用 Fragment 或包装元素
function App() {
  return (
    <>
      <div>First</div>
      <div>Second</div>
    </>
  )
}
```

---

### 5. useState 等 Hooks 无法使用

**问题：**
```
Error: Invalid hook call
```

**检查清单：**
1. ✅ Hooks 必须在函数组件内部调用
2. ✅ 不能在条件语句中调用 Hooks
3. ✅ 不能在循环中调用 Hooks
4. ✅ 函数名必须以大写字母开头（组件）

**示例：**
```jsx
// ❌ 错误：在组件外使用 Hook
const [count, setCount] = useState(0)

function App() {
  return <div>{count}</div>
}

// ✅ 正确：在组件内使用 Hook
function App() {
  const [count, setCount] = useState(0)
  return <div>{count}</div>
}
```

---

### 6. 第三方库无法使用

**问题：添加了 lodash 但提示 `_ is not defined`**

**解决步骤：**

1. **确认已添加到 Import Map**
   - 打开 Import Map Editor（`</>` 图标）
   - 检查 lodash 是否在列表中
   - URL 格式：`https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`

2. **确认使用 UMD 格式**
   - 必须是 `.min.js` 或 `.umd.js` 文件
   - 不能使用 ESM 格式（`.esm.js`）

3. **检查全局变量名**
   - lodash 的全局变量是 `_`
   - dayjs 的全局变量是 `dayjs`
   - 不同的库有不同的全局变量名

4. **在代码中使用全局变量**
```jsx
function App() {
  // 直接使用全局变量 _
  const shuffled = _.shuffle([1, 2, 3, 4, 5])
  return <div>{shuffled.join(', ')}</div>
}
```

---

### 7. 性能问题

**预览很慢**

**可能原因：**
1. 添加了太多依赖
2. CDN 连接慢
3. 代码复杂度高

**解决方案：**
1. 只添加必要的依赖
2. 切换 CDN 源（设置 -> CDN）
3. 简化代码逻辑

**代码编译慢**

**解决方案：**
1. Babel 编译在浏览器中进行，复杂代码会慢一些
2. 减少代码量
3. 避免过深的嵌套

---

### 8. 图标无法显示

**问题：Icons 组件不渲染**

**检查：**
1. 确认 `@ant-design/icons` 已加载
2. 检查 Icon 名称是否正确
3. 确认已从 `icons` 对象中解构

**示例：**
```jsx
function App() {
  // 解构 Icon
  const { SmileOutlined, HeartOutlined } = icons;
  
  return (
    <Space>
      <SmileOutlined />
      <HeartOutlined style={{ color: 'red' }} />
    </Space>
  )
}
```

---

### 9. 网络问题

**CDN 资源无法加载**

**症状：**
- 白屏
- 控制台显示 404 或网络错误
- 长时间加载

**解决方案：**

1. **检查网络连接**
   - 确认可以访问互联网
   - 尝试访问 https://cdn.jsdelivr.net

2. **切换 CDN 源**
   - 打开设置（齿轮图标）
   - 选择不同的 CDN（jsDelivr Fastly 或 unpkg）

3. **检查防火墙**
   - 某些网络环境可能屏蔽 CDN
   - 尝试使用 VPN

4. **等待重试**
   - CDN 可能临时不可用
   - 刷新页面重试

---

### 10. 浏览器兼容性

**问题：某些功能无法使用**

**最低要求：**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**不支持：**
- IE 11 及以下
- 旧版本的移动浏览器

**检查方法：**
打开浏览器控制台，输入：
```javascript
console.log(navigator.userAgent)
```

---

## 调试技巧

### 1. 使用浏览器控制台

**打开控制台：**
- Windows/Linux: `F12` 或 `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**查看错误：**
- 切换到 Console 标签
- 红色文字表示错误
- 点击错误可以看到详细堆栈

### 2. 检查网络请求

**打开 Network 标签：**
1. F12 打开开发者工具
2. 切换到 Network 标签
3. 刷新页面
4. 查看哪些资源加载失败（红色）

**常见问题：**
- 404: 资源不存在，检查 URL
- CORS: 跨域问题，尝试其他 CDN
- Timeout: 网络超时，检查网络连接

### 3. 检查全局变量

在控制台输入：
```javascript
// 检查 React 是否加载
console.log(typeof React)  // 应该是 "object"

// 检查 antd 是否加载
console.log(typeof antd)   // 应该是 "object"

// 查看 antd 有哪些组件
console.log(Object.keys(antd))

// 查看所有全局变量
console.log(Object.keys(window))
```

### 4. 测试简单代码

如果复杂代码无法运行，尝试最简单的代码：

```jsx
function App() {
  return <div>Hello World</div>
}
```

如果这个可以运行，逐步添加功能找出问题所在。

### 5. 清除缓存

**Chrome：**
1. F12 打开开发者工具
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

**Firefox：**
1. Ctrl+Shift+Delete
2. 选择缓存
3. 清除

---

## 寻求帮助

如果以上方法都无法解决问题：

### 1. 提供完整信息

- 浏览器版本
- 操作系统
- 完整的错误信息（截图）
- 重现步骤
- 分享链接（如果可能）

### 2. 提交 Issue

访问 GitHub 仓库提交 Issue：
- 标题简洁明确
- 详细描述问题
- 提供代码示例
- 附上错误截图

### 3. 社区讨论

- Stack Overflow
- React 社区
- Ant Design 社区

---

## 最佳实践

### 1. 保持代码简洁
- 从简单开始，逐步添加功能
- 及时测试每个功能

### 2. 检查文档
- [React 文档](https://react.dev/)
- [Ant Design 文档](https://ant.design/)
- [Babel 文档](https://babeljs.io/)

### 3. 使用 console.log
```jsx
function App() {
  const [count, setCount] = useState(0)
  
  // 调试输出
  console.log('Current count:', count)
  
  return <div>{count}</div>
}
```

### 4. 善用 Import Map
- 只添加需要的库
- 使用稳定版本号
- 定期检查更新

### 5. 保存重要代码
- 复制 URL 保存
- 导出到本地（手动复制）
- 使用版本控制

---

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解最新修复和改进。

---

**最后更新**: 2025-01-XX  
**版本**: v2.0.1

