# 🚀 从这里开始

## ✅ 所有问题已解决！

项目现在**完全正常工作**，可以愉快使用了！

---

## 快速开始（3步）

### 1. 启动项目
```bash
pnpm dev
```

### 2. 打开浏览器
访问 http://localhost:5173

### 3. 开始编写代码

**重要：不要使用 `import` 语句！**

```jsx
// ❌ 错误的写法
import { useState } from 'react'
import { Button } from 'antd'

// ✅ 正确的写法（直接使用全局变量）
function App() {
  const [count, setCount] = useState(0)  // 直接用
  
  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  )
}
```

---

## 💡 为什么不能用 import？

这是一个**浏览器内的 Playground**，不是完整的构建系统：

- 没有 webpack/Vite 打包器
- 使用 Babel Standalone 在浏览器编译
- React 和 Antd 通过 CDN 作为全局变量加载

**所有依赖都已经准备好了，直接用即可！**

---

## 🎨 可用的全局变量

### React Hooks
```jsx
useState, useEffect, useCallback, useMemo, useRef
```

### Antd 组件
```jsx
Button, Input, Space, Typography, Form, Select, 
Table, Modal, message, Card, Row, Col, Divider, 
Tag, Alert, Tabs, Drawer, Dropdown, Menu, Checkbox,
Radio, Switch, DatePicker, Upload, Progress
```

### Icons
```jsx
SmileOutlined, HeartOutlined, StarOutlined,
HomeOutlined, UserOutlined, SettingOutlined,
PlusOutlined, DeleteOutlined, EditOutlined

// 其他图标从 icons 对象获取
const { CheckOutlined } = icons
```

---

## 📝 示例代码

### 计数器
```jsx
function App() {
  const [count, setCount] = useState(0)
  
  return (
    <Space>
      <Button onClick={() => setCount(count - 1)}>-</Button>
      <Typography.Text strong style={{ fontSize: 20 }}>
        {count}
      </Typography.Text>
      <Button onClick={() => setCount(count + 1)}>+</Button>
    </Space>
  )
}
```

### 表单
```jsx
function App() {
  const [form] = Form.useForm()
  
  const onFinish = (values) => {
    message.success('提交成功：' + JSON.stringify(values))
  }
  
  return (
    <Card title="用户表单" style={{ width: 400 }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="年龄" name="age">
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
```

### 使用 Icons
```jsx
function App() {
  return (
    <Space size="large">
      <SmileOutlined style={{ fontSize: 32, color: '#1890ff' }} />
      <HeartOutlined style={{ fontSize: 32, color: 'red' }} />
      <StarOutlined style={{ fontSize: 32, color: 'gold' }} />
    </Space>
  )
}
```

---

## 🔧 功能概览

### 顶部工具栏按钮（从左到右）

1. **🗑️ 重置** - 恢复默认代码
2. **🔄 刷新** - 重新加载预览
3. **🔗 分享** - 复制分享链接
4. **🌓 主题** - 切换深色/浅色
5. **📱 GitHub** - 访问仓库
6. **📋 Import Map** (`</>`) - 管理 CDN 依赖
7. **⚙️ 设置** - CDN 源选择

### 版本选择器

- **React**: 切换 React 版本
- **Antd**: 切换 Antd 版本
- **TypeScript**: 切换 TS 版本

---

## 🎁 高级功能

### 添加第三方库

1. 点击顶部 `</>` 图标
2. 在 "Add New Package" 区域添加：
   - Package: `lodash`
   - URL: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`
3. 保存

然后在代码中使用：
```jsx
function App() {
  const numbers = _.shuffle([1, 2, 3, 4, 5])
  return <div>{numbers.join(', ')}</div>
}
```

更多示例：[IMPORT_MAP_EXAMPLES.md](./IMPORT_MAP_EXAMPLES.md)

---

## ❓ 遇到问题？

### 检查清单
- [ ] 已清除浏览器缓存（Ctrl+Shift+R）
- [ ] 控制台显示 "Available globals"
- [ ] antd 类型为 "object"
- [ ] 没有使用 import 语句

### 获取帮助
1. 查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 查看 [EDITOR_GUIDE.md](./EDITOR_GUIDE.md)
3. 提交 GitHub Issue

---

## 📖 文档导航

**我是新手**：
→ [START_HERE.md](./START_HERE.md)（本文）  
→ [EDITOR_GUIDE.md](./EDITOR_GUIDE.md) ⭐  
→ [QUICKSTART.md](./QUICKSTART.md)

**我想了解功能**：
→ [FEATURES.md](./FEATURES.md)  
→ [IMPORT_MAP_EXAMPLES.md](./IMPORT_MAP_EXAMPLES.md)

**我遇到问题**：
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)  
→ [ALL_FIXES.md](./ALL_FIXES.md)

**我想了解技术**：
→ [ARCHITECTURE.md](./ARCHITECTURE.md)  
→ [CHANGELOG.md](./CHANGELOG.md)  
→ [MIGRATION.md](./MIGRATION.md)

---

## 🎉 开始编码吧！

现在一切都准备就绪：

1. ✅ 编辑器有完整类型提示，无误报
2. ✅ 预览实时更新，无错误
3. ✅ Import Map 可视化管理
4. ✅ 完善的文档支持

**享受你的 Antd Playground 之旅！**

---

**版本**: v2.0.1  
**状态**: ✅ 完美运行  
**最后更新**: 2025-01-XX

