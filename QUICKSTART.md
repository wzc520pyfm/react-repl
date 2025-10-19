# 快速开始

## 问题修复：跨域错误

### 问题
```
SecurityError: Failed to read a named property 'document' from 'Window': 
Blocked a frame with origin "https://localhost:5173" from accessing a cross-origin frame.
```

### 解决方案
已修复！使用 `iframe` 的 `srcDoc` 属性而不是动态写入 `document`，确保 iframe 内容与主页面同源。

## 安装和运行

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 在浏览器中打开
# 通常是 http://localhost:5173 或 https://localhost:5173
```

## 使用说明

### 1. 编写代码

在左侧编辑器中编写 React 代码。已预先导入的内容：

#### React Hooks
```javascript
const { useState, useEffect, useCallback, useMemo } = React;
```

#### Antd 组件
```javascript
const { 
  Button, Input, Space, Typography, 
  Form, Select, Table, Modal, message,
  Card, Row, Col, Divider, Tag, Alert
} = antd;
```

#### Icons
```javascript
const { SmileOutlined, HeartOutlined, StarOutlined } = icons;
```

### 2. 示例代码

```jsx
function App() {
  const [count, setCount] = useState(0)

  return (
    <Space direction="vertical" size="large">
      <Typography.Title level={2}>Counter: {count}</Typography.Title>
      
      <Space>
        <Button 
          type="primary" 
          onClick={() => setCount(count + 1)}
        >
          Increment
        </Button>
        
        <Button 
          onClick={() => setCount(0)}
        >
          Reset
        </Button>
      </Space>
    </Space>
  )
}
```

### 3. 使用更多 Icons

如果需要其他 Icons，需要从 `icons` 对象中解构：

```jsx
function App() {
  const { HomeOutlined, UserOutlined, SettingOutlined } = icons;
  
  return (
    <Space>
      <Button icon={<HomeOutlined />}>Home</Button>
      <Button icon={<UserOutlined />}>User</Button>
      <Button icon={<SettingOutlined />}>Settings</Button>
    </Space>
  )
}
```

### 4. 使用 Antd 表单

```jsx
function App() {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    message.success('Form submitted: ' + JSON.stringify(values));
  };
  
  return (
    <Card title="User Form" style={{ width: 400 }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item 
          label="Username" 
          name="username"
          rules={[{ required: true, message: 'Please input username!' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        
        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="Enter email" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
```

## 功能说明

### 切换版本

在顶部工具栏可以切换：
- React 版本
- Antd 版本
- TypeScript 版本

### 主题切换

点击太阳/月亮图标切换深色/浅色主题。

### 分享代码

点击分享图标，URL 会自动包含你的代码，可以直接分享给他人。

### 重置代码

点击垃圾桶图标可以重置到默认模板。

### Import Map 编辑器 🆕

点击代码图标（`</>` ）可以打开 Import Map 编辑器，查看和管理 CDN 依赖：

**默认包含的依赖：**
- `react`: https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
- `react-dom`: https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
- `antd`: https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd-with-locales.min.js
- `@ant-design/icons`: https://cdn.jsdelivr.net/npm/@ant-design/icons@5.5.1/dist/index.umd.min.js

**功能：**
- ✏️ **编辑**：修改现有包的 CDN 地址
- ➕ **添加**：添加新的第三方库（如 lodash、dayjs 等）
- 🗑️ **删除**：移除不需要的包
- 💾 **保存**：保存后会自动重新加载预览

**添加第三方库示例：**

1. 点击 "Add New Package"
2. Package Name: `lodash`
3. CDN URL: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`
4. 点击 "Add Package"

然后在代码中就可以使用：
```jsx
function App() {
  const data = _.shuffle([1, 2, 3, 4, 5])
  return <div>{data.join(', ')}</div>
}
```

### CDN 设置

点击设置图标可以选择 CDN 源：
- jsDelivr（默认）
- jsDelivr Fastly
- unpkg

## 技术架构

本项目使用轻量级架构：

1. **Monaco Editor**：代码编辑器
2. **Babel Standalone**：浏览器内 JSX 编译
3. **CDN 加载**：React 和 Antd 通过 CDN UMD 格式加载
4. **iframe 预览**：隔离的预览环境

## 常见问题

### Q: 为什么不用 import 语句？
A: 因为我们使用 UMD 格式从 CDN 加载库，它们会暴露为全局变量（`React`、`antd` 等）。

### Q: 可以使用哪些 Antd 组件？
A: 所有 Antd 5.x 组件都可以使用，常用的已经预先解构，其他的可以从 `antd` 对象中获取：
```javascript
const { DatePicker, Upload, Drawer } = antd;
```

### Q: 可以使用异步代码吗？
A: 可以！useEffect、fetch、Promise 都可以正常使用。

### Q: 代码保存在哪里？
A: 代码自动序列化到 URL 的 hash 中，刷新页面不会丢失。

## 调试技巧

1. **查看浏览器控制台**：所有错误都会在控制台显示
2. **使用 console.log**：可以在代码中使用 `console.log()` 调试
3. **检查 Network**：查看 CDN 资源是否正确加载

## 贡献

欢迎提交 Issue 和 PR！

## 许可证

MIT License © 2025

