function App() {
  const [message, setMessage] = useState('Hello Ant Design!')

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Typography.Title level={1}>{message}</Typography.Title>
      
      <Input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        size="large"
      />

      <Typography.Paragraph>
        <SmileOutlined style={{ color: '#1890ff', fontSize: '24px', marginRight: '8px' }} />
        Powered by Ant Design 5.x + React 18.x
      </Typography.Paragraph>

      <Button type="primary" size="large">
        Click Me
      </Button>
    </Space>
  )
}
