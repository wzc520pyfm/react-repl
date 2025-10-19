import React, { useState, useEffect } from 'react'
import { Button, Select, Tag, Popover, message, Space } from 'antd'
import { 
  DeleteOutlined, 
  ReloadOutlined, 
  ShareAltOutlined, 
  SunOutlined, 
  MoonOutlined, 
  GithubOutlined,
  SettingOutlined 
} from '@ant-design/icons'
import { useStore, type VersionKey } from '@/composables/store.tsx'
import { getSupportedReactVersions, getSupportedAntdVersions, getSupportedTSVersions } from '@/utils/dependency'
import Settings from './Settings.tsx'
import './Header.css'

interface HeaderProps {
  onRefresh: () => void
}

const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const store = useStore()
  const [showReset, setShowReset] = useState(false)
  const [dark, setDark] = useState(() => {
    const theme = new URLSearchParams(window.location.search).get('theme')
    return theme === 'dark'
  })

  const [reactVersions, setReactVersions] = useState<string[]>([])
  const [antdVersions, setAntdVersions] = useState<string[]>([])
  const [tsVersions, setTsVersions] = useState<string[]>([])

  useEffect(() => {
    const loadVersions = async () => {
      const [react, antd, ts] = await Promise.all([
        getSupportedReactVersions(),
        getSupportedAntdVersions(),
        getSupportedTSVersions(),
      ])
      setReactVersions(react)
      setAntdVersions(antd)
      setTsVersions(ts)
    }
    loadVersions()
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  const handleVersionChange = (key: VersionKey, version: string) => {
    store.setVersion(key, version)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      message.success('Sharable URL has been copied to clipboard.')
    } catch (error) {
      message.error('Failed to copy link')
    }
  }

  const handleReset = () => {
    setShowReset(false)
    store.resetFiles()
  }

  const toggleTheme = () => {
    setDark(!dark)
  }

  const resetPopoverContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ textAlign: 'center' }}>Want to reset the editor?</div>
      <Button size="small" onClick={handleReset}>
        Yes
      </Button>
    </div>
  )

  const settingsPopoverContent = <Settings />

  const appVersion = import.meta.env.APP_VERSION

  return (
    <nav className="header">
      <div className="header-left">
        <img
          src="/src/assets/logo.svg"
          alt="logo"
          className="logo"
        />
        <div className="header-title">
          <div className="title-text">Antd Playground</div>
          <Tag>v{appVersion}</Tag>
        </div>
      </div>

      <div className="header-right">
        <Space size="middle" className="version-selectors">
          <Space size="small" className="version-selector">
            <span>React:</span>
            <Select
              value={store.versions.react}
              onChange={(v) => handleVersionChange('react', v)}
              size="small"
              style={{ width: 140 }}
              showSearch
              options={reactVersions.map(v => ({ value: v, label: v }))}
            />
          </Space>

          <Space size="small" className="version-selector">
            <span>Antd:</span>
            <Select
              value={store.versions.antd}
              onChange={(v) => handleVersionChange('antd', v)}
              size="small"
              style={{ width: 140 }}
              showSearch
              options={antdVersions.map(v => ({ value: v, label: v }))}
            />
          </Space>

          <Space size="small" className="version-selector">
            <span>TypeScript:</span>
            <Select
              value={store.versions.typescript}
              onChange={(v) => handleVersionChange('typescript', v)}
              size="small"
              style={{ width: 140 }}
              showSearch
              options={tsVersions.map(v => ({ value: v, label: v }))}
            />
          </Space>
        </Space>

        <Space size="middle" className="action-buttons">
          <Popover
            content={resetPopoverContent}
            trigger="click"
            open={showReset}
            onOpenChange={setShowReset}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              title="Reset"
            />
          </Popover>

          <Button
            type="text"
            icon={<ReloadOutlined />}
            title="Refresh sandbox"
            onClick={onRefresh}
          />

          <Button
            type="text"
            icon={<ShareAltOutlined />}
            title="Copy link"
            onClick={handleCopyLink}
          />

          <Button
            type="text"
            icon={dark ? <MoonOutlined /> : <SunOutlined />}
            title="Toggle theme"
            onClick={toggleTheme}
          />

          <Button
            type="text"
            icon={<GithubOutlined />}
            title="View on GitHub"
            href="https://github.com/element-plus/element-plus-playground"
            target="_blank"
          />

          <Popover
            content={settingsPopoverContent}
            trigger="click"
            title="Settings"
          >
            <Button
              type="text"
              icon={<SettingOutlined />}
              title="Settings"
            />
          </Popover>
        </Space>
      </div>
    </nav>
  )
}

export default Header

