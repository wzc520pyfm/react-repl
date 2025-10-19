import React from 'react'
import { Form, Select } from 'antd'
import { cdn, type Cdn } from '@/utils/dependency'

const Settings: React.FC = () => {
  const [cdnValue, setCdnValue] = React.useState<Cdn>(cdn.value)

  const handleCdnChange = (value: Cdn) => {
    setCdnValue(value)
    cdn.value = value
  }

  return (
    <Form layout="vertical">
      <Form.Item label="CDN">
        <Select
          value={cdnValue}
          onChange={handleCdnChange}
          style={{ width: '100%' }}
          options={[
            { value: 'jsdelivr', label: 'jsDelivr' },
            { value: 'jsdelivr-fastly', label: 'jsDelivr Fastly' },
            { value: 'unpkg', label: 'unpkg' },
          ]}
        />
      </Form.Item>
    </Form>
  )
}

export default Settings

