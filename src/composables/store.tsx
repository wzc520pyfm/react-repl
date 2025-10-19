import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { atou, utoa } from '@/utils/encode'
import { genImportMap, type Versions } from '@/utils/dependency'
import antdCode from '../template/antd.ts?raw'
import appCode from '../template/App.tsx?raw'
import indexCode from '../template/index.tsx?raw'
import packageJsonCode from '../template/package.json?raw'

export type VersionKey = 'react' | 'antd' | 'typescript'

export interface UserOptions {
  reactVersion?: string
  antdVersion?: string
  tsVersion?: string
}

export interface SerializeState {
  files: Record<string, string>
  _o?: UserOptions
}

export interface StoreContextType {
  files: Record<string, string>
  activeFile: string
  setActiveFile: (filename: string) => void
  updateFile: (filename: string, content: string) => void
  versions: Versions
  setVersion: (key: VersionKey, version: string) => void
  serialize: () => string
  resetFiles: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

const APP_FILE = '/App.tsx'
const INDEX_FILE = '/index.tsx'
const ANTD_FILE = '/antd.ts'
const PACKAGE_JSON_FILE = '/package.json'

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}

interface StoreProviderProps {
  children: ReactNode
  serializedState?: string
  onInitialized?: () => void
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ 
  children, 
  serializedState,
  onInitialized 
}) => {
  const [initialized, setInitialized] = useState(false)
  const saved = serializedState ? deserialize(serializedState) : undefined

  const [versions, setVersions] = useState<Versions>({
    react: saved?._o?.reactVersion ?? '18.3.1',
    antd: saved?._o?.antdVersion ?? 'latest',
    typescript: saved?._o?.tsVersion ?? 'latest',
  })

  const [files, setFiles] = useState<Record<string, string>>(() => initFiles(saved, versions))
  const [activeFile, setActiveFile] = useState<string>(APP_FILE)

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      onInitialized?.()
    }
  }, [initialized, onInitialized])

  const updateFile = useCallback((filename: string, content: string) => {
    setFiles(prev => ({ ...prev, [filename]: content }))
  }, [])

  const setVersion = useCallback((key: VersionKey, version: string) => {
    setVersions(prev => ({ ...prev, [key]: version }))
    if (key === 'antd') {
      const newAntdCode = generateAntdCode(version)
      updateFile(ANTD_FILE, newAntdCode)
    }
  }, [updateFile])

  const serialize = useCallback(() => {
    const state: SerializeState = {
      files,
      _o: {
        reactVersion: versions.react,
        antdVersion: versions.antd,
        tsVersion: versions.typescript,
      }
    }
    return utoa(JSON.stringify(state))
  }, [files, versions])

  const resetFiles = useCallback(() => {
    const newFiles = {
      [APP_FILE]: appCode,
      [INDEX_FILE]: indexCode,
      [ANTD_FILE]: generateAntdCode(versions.antd),
      [PACKAGE_JSON_FILE]: generatePackageJson(versions),
    }
    setFiles(newFiles)
    setActiveFile(APP_FILE)
  }, [versions])

  useEffect(() => {
    // Update hash in URL
    const hash = serialize()
    window.history.replaceState({}, '', `${window.location.pathname}#${hash}`)
  }, [serialize])

  const contextValue: StoreContextType = {
    files,
    activeFile,
    setActiveFile,
    updateFile,
    versions,
    setVersion,
    serialize,
    resetFiles,
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

function deserialize(text: string): SerializeState {
  try {
    return JSON.parse(atou(text))
  } catch (error) {
    console.error('Failed to deserialize state:', error)
    return { files: {} }
  }
}

function initFiles(saved: SerializeState | undefined, versions: Versions): Record<string, string> {
  const files: Record<string, string> = {}
  
  if (saved?.files && Object.keys(saved.files).length > 0) {
    // Use saved files
    Object.entries(saved.files).forEach(([filename, content]) => {
      files[filename] = content
    })
  } else {
    // Use default template files
    files[APP_FILE] = appCode
    files[INDEX_FILE] = indexCode
    files[ANTD_FILE] = generateAntdCode(versions.antd)
    files[PACKAGE_JSON_FILE] = generatePackageJson(versions)
  }

  return files
}

function generateAntdCode(version: string): string {
  return antdCode.replace('#VERSION#', version)
}

function generatePackageJson(versions: Versions): string {
  const content = JSON.parse(packageJsonCode)
  content.dependencies = {
    react: versions.react,
    'react-dom': versions.react,
    antd: versions.antd,
    '@ant-design/icons': 'latest',
  }
  return JSON.stringify(content, null, 2)
}

