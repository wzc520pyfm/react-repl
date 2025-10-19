import React, { useState } from 'react'
import { Modal, Form, Input, Button, Space, Table, message, Popconfirm } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { ImportMap } from '@/composables/store.tsx'
import './ImportMapEditor.css'

interface ImportMapEditorProps {
  visible: boolean
  importMap: ImportMap
  onClose: () => void
  onSave: (importMap: ImportMap) => void
}

const ImportMapEditor: React.FC<ImportMapEditorProps> = ({
  visible,
  importMap,
  onClose,
  onSave,
}) => {
  const [editingKey, setEditingKey] = useState<string>('')
  const [editingValue, setEditingValue] = useState<string>('')
  const [newKey, setNewKey] = useState<string>('')
  const [newValue, setNewValue] = useState<string>('')
  const [tempImportMap, setTempImportMap] = useState<ImportMap>(importMap)

  React.useEffect(() => {
    setTempImportMap(importMap)
  }, [importMap])

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key)
    setEditingValue(value)
  }

  const handleSaveEdit = () => {
    if (!editingKey) return
    
    const newMap = { ...tempImportMap }
    if (editingKey in newMap) {
      newMap[editingKey] = editingValue
      setTempImportMap(newMap)
      setEditingKey('')
      setEditingValue('')
      message.success('Updated successfully')
    }
  }

  const handleCancelEdit = () => {
    setEditingKey('')
    setEditingValue('')
  }

  const handleDelete = (key: string) => {
    const newMap = { ...tempImportMap }
    delete newMap[key]
    setTempImportMap(newMap)
    message.success('Deleted successfully')
  }

  const handleAdd = () => {
    if (!newKey.trim()) {
      message.error('Package name is required')
      return
    }
    if (!newValue.trim()) {
      message.error('CDN URL is required')
      return
    }
    if (newKey in tempImportMap) {
      message.error('Package already exists')
      return
    }

    const newMap = { ...tempImportMap, [newKey]: newValue }
    setTempImportMap(newMap)
    setNewKey('')
    setNewValue('')
    message.success('Added successfully')
  }

  const handleSave = () => {
    onSave(tempImportMap)
    onClose()
    message.success('Import map saved')
  }

  const handleCancel = () => {
    setTempImportMap(importMap)
    setEditingKey('')
    setNewKey('')
    setNewValue('')
    onClose()
  }

  const columns = [
    {
      title: 'Package',
      dataIndex: 'key',
      key: 'key',
      width: '30%',
      render: (text: string) => <code style={{ color: '#1890ff' }}>{text}</code>,
    },
    {
      title: 'CDN URL',
      dataIndex: 'value',
      key: 'value',
      width: '50%',
      render: (text: string, record: { key: string }) => {
        if (editingKey === record.key) {
          return (
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onPressEnter={handleSaveEdit}
              autoFocus
            />
          )
        }
        return (
          <span 
            style={{ 
              wordBreak: 'break-all',
              fontSize: '12px',
              color: '#666'
            }}
          >
            {text}
          </span>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_: any, record: { key: string; value: string }) => {
        if (editingKey === record.key) {
          return (
            <Space>
              <Button type="link" size="small" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button type="link" size="small" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Space>
          )
        }
        return (
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.key, record.value)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this package?"
              onConfirm={() => handleDelete(record.key)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const dataSource = Object.entries(tempImportMap).map(([key, value]) => ({
    key,
    value,
  }))

  return (
    <Modal
      title="Import Map Editor"
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save Changes
        </Button>,
      ]}
    >
      <div className="import-map-editor">
        <div className="import-map-table">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="small"
            scroll={{ y: 300 }}
          />
        </div>

        <div className="import-map-add">
          <h4>Add New Package</h4>
          <Form layout="vertical">
            <Form.Item label="Package Name">
              <Input
                placeholder="e.g., lodash, dayjs, @ant-design/charts"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="CDN URL">
              <Input
                placeholder="e.g., https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                block
              >
                Add Package
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="import-map-info">
          <h4>💡 Tips:</h4>
          <ul>
            <li>Use UMD format for better browser compatibility</li>
            <li>Example: <code>https://cdn.jsdelivr.net/npm/package@version/path</code></li>
            <li>You can use jsDelivr, unpkg, or any CDN provider</li>
            <li>Make sure the package exposes a global variable (UMD format)</li>
          </ul>
        </div>
      </div>
    </Modal>
  )
}

export default ImportMapEditor

