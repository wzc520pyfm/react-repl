import React, { useState } from 'react'
import { Button, Input, Space, Typography } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const App: React.FC = () => {
  const [message, setMessage] = useState('Hello World!')

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={1}>{message}</Title>
        
        <Input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type something..."
          size="large"
        />

        <Paragraph>
          <SmileOutlined style={{ color: '#1890ff', fontSize: '24px', marginRight: '8px' }} />
          Powered by Ant Design 5.x + React 18.x
        </Paragraph>

        <Button type="primary" size="large">
          Click Me
        </Button>
      </Space>
    </div>
  )
}

export default App

