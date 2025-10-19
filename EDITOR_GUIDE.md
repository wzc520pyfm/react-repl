# 编辑器使用指南

## 为什么不能使用 `import` 语句？

### 问题

你可能会想写这样的代码：

```jsx
❌ 不能这样写
import { useState } from 'react'
import { Button } from 'antd'

function App() {
  const [count, setCount] = useState(0)
  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
}
```

### 原因

这是一个**浏览器内运行的 Playground**，不是完整的构建系统：

1. **没有模块打包器**：没有 webpack 或 Vite 来处理 `import` 语句
2. **使用 Babel Standalone**：在浏览器中直接编译 JSX
3. **通过 CDN 加载**：React 和 Antd 作为全局变量通过 `<script>` 标签加载

### 正确的做法

所有依赖都已经作为**全局变量**预先解构好了：

```jsx
✅ 正确的写法（直接使用全局变量）
function App() {
  const [count, setCount] = useState(0)  // useState 已经是全局变量
  
  return (
    <Button onClick={() => setCount(count + 1)}>
      Count: {count}
    </Button>
  )
}
```

## 可用的全局变量

### React Hooks

所有常用的 React Hooks 都可以直接使用：

```jsx
function App() {
  const [state, setState] = useState(0)           // ✅
  const ref = useRef(null)                        // ✅
  const memo = useMemo(() => state * 2, [state])  // ✅
  const callback = useCallback(() => {}, [])      // ✅
  
  useEffect(() => {                               // ✅
    console.log('mounted')
  }, [])
  
  return <div>All hooks work!</div>
}
```

### Ant Design 组件

所有常用的 Antd 组件都可以直接使用：

```jsx
function App() {
  return (
    <Space direction="vertical">
      <Button type="primary">Button</Button>
      <Input placeholder="Input" />
      <Card title="Card">Content</Card>
      <Typography.Title level={2}>Title</Typography.Title>
      <Form>
        <Form.Item label="Name">
          <Input />
        </Form.Item>
      </Form>
      <Table dataSource={[]} columns={[]} />
      <Modal visible={true}>Modal</Modal>
      <Alert message="Alert" type="info" />
      <Tag color="blue">Tag</Tag>
      <Divider />
      <DatePicker />
      <Select options={[]} />
      <Checkbox>Checkbox</Checkbox>
      <Radio>Radio</Radio>
      <Switch />
      <Upload>Upload</Upload>
      <Progress percent={50} />
      <Tabs items={[]} />
      <Drawer visible={true}>Drawer</Drawer>
      <Dropdown menu={{ items: [] }}>Dropdown</Dropdown>
    </Space>
  )
}
```

### Ant Design Icons

常用的图标也可以直接使用：

```jsx
function App() {
  return (
    <Space>
      <SmileOutlined style={{ fontSize: 24 }} />
      <HeartOutlined style={{ fontSize: 24, color: 'red' }} />
      <StarOutlined />
      <HomeOutlined />
      <UserOutlined />
      <SettingOutlined />
      <PlusOutlined />
      <DeleteOutlined />
      <EditOutlined />
    </Space>
  )
}
```

### 使用其他图标

如果需要其他图标，从 `icons` 对象中解构：

```jsx
function App() {
  const { 
    CheckOutlined, 
    CloseOutlined,
    UploadOutlined,
    DownloadOutlined 
  } = icons
  
  return (
    <Space>
      <CheckOutlined />
      <CloseOutlined />
      <UploadOutlined />
      <DownloadOutlined />
    </Space>
  )
}
```

## message 和其他工具

Antd 的消息提示等工具也可以直接使用：

```jsx
function App() {
  const handleClick = () => {
    message.success('Success!')    // ✅ 直接使用
    message.error('Error!')
    message.warning('Warning!')
    message.info('Info!')
  }
  
  return <Button onClick={handleClick}>Show Message</Button>
}
```

## 编辑器智能提示

### 完整的类型支持

编辑器已经配置了完整的类型定义，你会获得：

1. **自动补全**：输入 `use` 会提示所有 Hooks
2. **类型检查**：错误的用法会有红色波浪线
3. **参数提示**：鼠标悬停查看函数签名
4. **JSX 支持**：完整的 JSX 语法高亮和检查

### 示例：智能提示

```jsx
function App() {
  // 输入 "useSt" 会自动提示 useState
  const [count, setCount] = useState(0)
  //                         ^^^^^^^^ 悬停查看类型定义
  
  // 输入 "<Butt" 会自动提示 Button
  return <Button 
    type="primary"     // 输入 type= 会提示所有可能的值
    onClick={() => {}} // 完整的事件类型检查
  >
    Click me
  </Button>
}
```

## 高级用法

### 使用 Form

```jsx
function App() {
  const [form] = Form.useForm()  // ✅ Form hooks 也可以直接用
  
  const onFinish = (values) => {
    message.success('Form submitted: ' + JSON.stringify(values))
  }
  
  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item 
        label="Username" 
        name="username"
        rules={[{ required: true, message: 'Please input username!' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  )
}
```

### 使用 Table

```jsx
function App() {
  const dataSource = [
    { key: '1', name: 'John', age: 32 },
    { key: '2', name: 'Jane', age: 28 },
  ]
  
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ]
  
  return <Table dataSource={dataSource} columns={columns} />
}
```

### 使用 Modal

```jsx
function App() {
  const [visible, setVisible] = useState(false)
  
  return (
    <>
      <Button onClick={() => setVisible(true)}>Open Modal</Button>
      <Modal
        title="Basic Modal"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <p>Modal content</p>
      </Modal>
    </>
  )
}
```

## 添加第三方库

### 通过 Import Map 添加

如果需要使用其他库（如 lodash、dayjs），使用 Import Map 编辑器添加：

1. 点击顶部的 `</>` 图标
2. 添加包，例如：
   - Package: `lodash`
   - URL: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`
3. 保存

### 使用添加的库

添加后，库会作为全局变量可用：

```jsx
function App() {
  // lodash 暴露为全局变量 _
  const shuffled = _.shuffle([1, 2, 3, 4, 5])
  
  // dayjs 暴露为全局变量 dayjs
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  
  return (
    <Space direction="vertical">
      <div>Shuffled: {shuffled.join(', ')}</div>
      <div>Now: {now}</div>
    </Space>
  )
}
```

## 常见问题

### Q: 为什么编辑器之前显示"未定义"错误？

A: 在 v2.0.1 之前，Monaco Editor 不知道这些全局变量的存在。现在已经添加了完整的类型定义，所有全局变量都有正确的类型提示。

### Q: 我可以使用 async/await 吗？

A: 可以！完全支持：

```jsx
function App() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data')
      const json = await response.json()
      setData(json)
    }
    fetchData()
  }, [])
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>
}
```

### Q: 我可以使用 TypeScript 类型注解吗？

A: 可以，但要记住这些是全局变量：

```jsx
function App() {
  // ✅ 可以使用类型注解
  const [count, setCount] = useState<number>(0)
  const [user, setUser] = useState<{name: string} | null>(null)
  
  return <div>{count}</div>
}
```

### Q: 如果我需要的组件没有预解构怎么办？

A: 从 `antd` 或 `icons` 对象中获取：

```jsx
function App() {
  const { Breadcrumb, Steps, Tooltip } = antd
  const { CopyOutlined, SaveOutlined } = icons
  
  return (
    <Space>
      <Breadcrumb>...</Breadcrumb>
      <Steps>...</Steps>
      <Tooltip title="tip">Hover me</Tooltip>
      <CopyOutlined />
      <SaveOutlined />
    </Space>
  )
}
```

## 最佳实践

### 1. 组件化

将复杂的 UI 拆分成多个组件：

```jsx
function UserCard({ name, age }) {
  return (
    <Card>
      <Typography.Title level={4}>{name}</Typography.Title>
      <Typography.Text>Age: {age}</Typography.Text>
    </Card>
  )
}

function App() {
  return (
    <Space>
      <UserCard name="John" age={32} />
      <UserCard name="Jane" age={28} />
    </Space>
  )
}
```

### 2. 使用自定义 Hooks

```jsx
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  const increment = useCallback(() => setCount(c => c + 1), [])
  const decrement = useCallback(() => setCount(c => c - 1), [])
  return { count, increment, decrement }
}

function App() {
  const { count, increment, decrement } = useCounter()
  
  return (
    <Space>
      <Button onClick={decrement}>-</Button>
      <span>{count}</span>
      <Button onClick={increment}>+</Button>
    </Space>
  )
}
```

### 3. 状态管理

```jsx
function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input }])
      setInput('')
    }
  }
  
  return (
    <Card title="Todo List">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onPressEnter={addTodo}
          />
          <Button type="primary" onClick={addTodo}>Add</Button>
        </Space>
        {todos.map(todo => (
          <Card key={todo.id} size="small">{todo.text}</Card>
        ))}
      </Space>
    </Card>
  )
}
```

## 编辑器快捷键

- `Ctrl/Cmd + Space`: 触发自动补全
- `Ctrl/Cmd + S`: 保存（已禁用，自动保存）
- `F12`: 跳转到定义
- `Alt + F12`: 查看定义
- `Shift + Alt + F`: 格式化代码（即将支持）

---

**总结**：不要使用 `import` 语句，所有依赖都已经作为全局变量提供。编辑器有完整的类型支持，直接使用即可！

**版本**: v2.0.1  
**最后更新**: 2025-01-XX

