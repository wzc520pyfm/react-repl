# Import Map 使用示例

## 什么是 Import Map？

Import Map 允许你从 CDN 动态加载第三方库，而无需在项目中安装它们。这使得 Playground 保持轻量级，同时支持使用任意 NPM 包。

## 默认配置

Playground 默认包含以下依赖：

```json
{
  "react": "https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js",
  "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js",
  "antd": "https://cdn.jsdelivr.net/npm/antd@5.27.5/dist/antd.min.js",
  "@ant-design/icons": "https://cdn.jsdelivr.net/npm/@ant-design/icons@6.1.0/dist/index.umd.min.js"
}
```

## 如何添加新库

### 1. 工具库 - Lodash

**添加：**
- Package: `lodash`
- URL: `https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js`

**使用：**
```jsx
function App() {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const chunked = _.chunk(numbers, 3)
  
  return (
    <Space direction="vertical">
      <Typography.Title level={3}>Lodash Example</Typography.Title>
      <div>Original: {numbers.join(', ')}</div>
      <div>Chunked: {JSON.stringify(chunked)}</div>
    </Space>
  )
}
```

### 2. 日期处理 - Day.js

**添加：**
- Package: `dayjs`
- URL: `https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js`

**使用：**
```jsx
function App() {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const nextWeek = dayjs().add(7, 'day').format('YYYY-MM-DD')
  
  return (
    <Card title="Date Examples">
      <Space direction="vertical">
        <div>Current Time: {now}</div>
        <div>Next Week: {nextWeek}</div>
      </Space>
    </Card>
  )
}
```

### 3. 动画库 - GSAP

**添加：**
- Package: `gsap`
- URL: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`

**使用：**
```jsx
function App() {
  const boxRef = useRef(null)
  
  const animate = () => {
    gsap.to(boxRef.current, {
      x: 200,
      rotation: 360,
      duration: 1,
      ease: 'power2.inOut'
    })
  }
  
  return (
    <Space direction="vertical" size="large">
      <Button type="primary" onClick={animate}>
        Animate!
      </Button>
      <div
        ref={boxRef}
        style={{
          width: 100,
          height: 100,
          background: '#1890ff',
          borderRadius: 8
        }}
      />
    </Space>
  )
}
```

### 4. Ant Design Charts

**添加：**
- Package: `@ant-design/plots`
- URL: `https://cdn.jsdelivr.net/npm/@ant-design/plots@2.3.4/dist/index.min.js`

**使用：**
```jsx
function App() {
  const { Column } = window.Plots
  
  const data = [
    { type: 'Jan', value: 38 },
    { type: 'Feb', value: 52 },
    { type: 'Mar', value: 61 },
    { type: 'Apr', value: 75 },
    { type: 'May', value: 48 },
  ]
  
  const config = {
    data,
    xField: 'type',
    yField: 'value',
  }
  
  return (
    <Card title="Sales Chart">
      <Column {...config} />
    </Card>
  )
}
```

### 5. UUID 生成

**添加：**
- Package: `uuid`
- URL: `https://cdn.jsdelivr.net/npm/uuid@9.0.1/dist/umd/uuidv4.min.js`

**使用：**
```jsx
function App() {
  const [ids, setIds] = useState([])
  
  const generateId = () => {
    const newId = uuidv4()
    setIds([...ids, newId])
  }
  
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button onClick={generateId} type="primary">
        Generate UUID
      </Button>
      {ids.map(id => (
        <Tag key={id} color="blue">{id}</Tag>
      ))}
    </Space>
  )
}
```

## 查找 UMD 包

### 方法 1: jsDelivr

访问 https://cdn.jsdelivr.net/npm/package-name@version/ 查看可用文件，寻找：
- `*.min.js` 文件
- `/dist/` 或 `/umd/` 目录
- `.umd.js` 或 `.min.js` 文件

### 方法 2: unpkg

访问 https://unpkg.com/package-name@version/ 浏览文件结构。

### 方法 3: 包的文档

查看 NPM 包的文档，通常会说明是否支持 UMD 格式以及路径。

## 常见包的 CDN 地址

### 工具库

```
lodash: https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
ramda: https://cdn.jsdelivr.net/npm/ramda@0.29.1/dist/ramda.min.js
underscore: https://cdn.jsdelivr.net/npm/underscore@1.13.6/underscore-min.js
```

### 日期处理

```
dayjs: https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
moment: https://cdn.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js
date-fns: https://cdn.jsdelivr.net/npm/date-fns@3.6.0/index.min.js
```

### 动画

```
gsap: https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
anime: https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js
```

### 数据可视化

```
echarts: https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js
chart.js: https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js
d3: https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js
```

### HTTP 客户端

```
axios: https://cdn.jsdelivr.net/npm/axios@1.7.2/dist/axios.min.js
```

## 注意事项

### 1. 必须使用 UMD 格式

只有 UMD (Universal Module Definition) 格式的包才能直接在浏览器中使用。ESM (ES Module) 格式需要构建工具支持。

### 2. 全局变量名称

不同的包暴露不同的全局变量名：
- `lodash` → `_`
- `dayjs` → `dayjs`
- `axios` → `axios`
- `React` → `React`
- `antd` → `antd`

### 3. 版本兼容性

确保使用的包版本与 React 18 兼容。

### 4. 大小考虑

虽然 CDN 有缓存，但过多的依赖会影响加载速度。只添加必要的包。

### 5. CORS

确保 CDN 支持 CORS（jsDelivr 和 unpkg 都支持）。

## 故障排查

### 包没有加载？

1. 检查浏览器控制台的网络请求
2. 确认 URL 是否正确
3. 确认包是否有 UMD 版本
4. 尝试不同的 CDN 源

### 包加载了但无法使用？

1. 检查全局变量名称
2. 查看包的文档了解正确的使用方式
3. 确认包的依赖是否也已加载

### 如何知道全局变量名？

在浏览器控制台输入 `Object.keys(window)` 查看所有全局变量，或查看包的文档。

## 高级技巧

### 1. 版本锁定

使用确切版本号而不是 `latest`：
```
❌ https://cdn.jsdelivr.net/npm/lodash/lodash.min.js
✅ https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
```

### 2. 多个 CDN 备份

jsDelivr 自动结合多个 CDN，提供更好的可用性。

### 3. 预加载优化

将常用的包添加到 Import Map 中，它们会在页面加载时一起加载。

## 贡献

如果你发现了好用的包和 CDN 地址，欢迎分享！

