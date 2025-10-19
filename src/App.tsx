import React, { useState, useEffect } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { StoreProvider, useStore } from '@/composables/store'
import Header from '@/components/Header.tsx'
import './App.css'

const AppContent: React.FC = () => {
  const store = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleRefresh = () => {
    // Sandpack handles refresh internally
    window.location.reload()
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
      <Header onRefresh={handleRefresh} />
      <div className="sandbox-container">
        <Sandpack
          template="react-ts"
          files={store.files}
          theme="auto"
          options={{
            showNavigator: true,
            showTabs: true,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: 'calc(100vh - 50px)',
          }}
          customSetup={{
            dependencies: {
              react: store.versions.react,
              'react-dom': store.versions.react,
              antd: store.versions.antd,
              '@ant-design/icons': 'latest',
            },
          }}
        />
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

