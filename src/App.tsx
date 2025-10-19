import React, { useState, useEffect } from 'react'
import { StoreProvider, useStore } from '@/composables/store.tsx'
import Header from '@/components/Header.tsx'
import Editor from '@/components/Editor.tsx'
import Preview from '@/components/Preview.tsx'
import './App.css'

const AppContent: React.FC = () => {
  const store = useStore()
  const [loading, setLoading] = useState(true)
  const [dark, setDark] = useState(() => {
    const theme = new URLSearchParams(window.location.search).get('theme')
    return theme === 'dark'
  })

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleThemeChange = (isDark: boolean) => {
    setDark(isDark)
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header 
        onRefresh={handleRefresh} 
        dark={dark}
        onThemeChange={handleThemeChange}
      />
      <div className="playground-container">
        <div className="editor-panel">
          <Editor
            value={store.files[store.activeFile] || ''}
            onChange={(value) => store.updateFile(store.activeFile, value)}
            language="typescript"
            theme={dark ? 'vs-dark' : 'vs'}
          />
        </div>
        <div className="preview-panel">
          <Preview
            code={store.files[store.activeFile] || ''}
            reactVersion={store.versions.react}
            antdVersion={store.versions.antd}
            importMap={store.importMap}
          />
        </div>
      </div>
    </div>
  )
}

const App: React.FC = () => {
  const [initialized, setInitialized] = useState(false)
  const serializedState = window.location.hash.slice(1)

  return (
    <StoreProvider 
      serializedState={serializedState}
      onInitialized={() => setInitialized(true)}
    >
      {initialized && <AppContent />}
    </StoreProvider>
  )
}

export default App
