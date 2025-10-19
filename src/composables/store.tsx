import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { atou, utoa } from '@/utils/encode'
import { genCdnLink, type Versions } from '@/utils/dependency'
import defaultCode from '../template/App.tsx?raw'

export type VersionKey = 'react' | 'antd' | 'typescript'

export interface ImportMap {
  [key: string]: string
}

export interface UserOptions {
  reactVersion?: string
  antdVersion?: string
  tsVersion?: string
  importMap?: ImportMap
}

export interface SerializeState {
  code: string
  _o?: UserOptions
}

export interface StoreContextType {
  files: Record<string, string>
  activeFile: string
  setActiveFile: (filename: string) => void
  updateFile: (filename: string, content: string) => void
  versions: Versions
  setVersion: (key: VersionKey, version: string) => void
  importMap: ImportMap
  setImportMap: (importMap: ImportMap) => void
  serialize: () => string
  resetFiles: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

const APP_FILE = '/App.tsx'

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
    antd: saved?._o?.antdVersion ?? '5.27.5',
    typescript: saved?._o?.tsVersion ?? '5.8.3',
  })

  const getDefaultImportMap = (vers: Versions): ImportMap => ({
    'react': genCdnLink('react', vers.react, '/umd/react.production.min.js'),
    'react-dom': genCdnLink('react-dom', vers.react, '/umd/react-dom.production.min.js'),
    'antd': genCdnLink('antd', vers.antd, '/dist/antd.min.js'),
    '@ant-design/icons': genCdnLink('@ant-design/icons', '5.5.1', '/dist/index.umd.min.js'),
  })

  const [importMap, setImportMapState] = useState<ImportMap>(() => {
    return saved?._o?.importMap || getDefaultImportMap(versions)
  })

  const [files, setFiles] = useState<Record<string, string>>(() => {
    return {
      [APP_FILE]: saved?.code || defaultCode
    }
  })
  
  const [activeFile] = useState<string>(APP_FILE)

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
    setVersions(prev => {
      const newVersions = { ...prev, [key]: version }
      // 当 React 或 Antd 版本变化时，更新 import map
      if (key === 'react' || key === 'antd') {
        setImportMapState(prevMap => ({
          ...prevMap,
          ...(key === 'react' ? {
            'react': genCdnLink('react', version, '/umd/react.production.min.js'),
            'react-dom': genCdnLink('react-dom', version, '/umd/react-dom.production.min.js'),
          } : {}),
          ...(key === 'antd' ? {
            'antd': genCdnLink('antd', version, '/dist/antd.min.js'),
          } : {}),
        }))
      }
      return newVersions
    })
  }, [])

  const setImportMap = useCallback((newImportMap: ImportMap) => {
    setImportMapState(newImportMap)
  }, [])

  const serialize = useCallback(() => {
    const state: SerializeState = {
      code: files[APP_FILE],
      _o: {
        reactVersion: versions.react,
        antdVersion: versions.antd,
        tsVersion: versions.typescript,
        importMap: importMap,
      }
    }
    return utoa(JSON.stringify(state))
  }, [files, versions, importMap])

  const resetFiles = useCallback(() => {
    setFiles({
      [APP_FILE]: defaultCode
    })
  }, [])

  useEffect(() => {
    // Update hash in URL
    const hash = serialize()
    window.history.replaceState({}, '', `${window.location.pathname}#${hash}`)
  }, [serialize])

  const contextValue: StoreContextType = {
    files,
    activeFile,
    setActiveFile: () => {}, // 单文件模式，不需要切换
    updateFile,
    versions,
    setVersion,
    importMap,
    setImportMap,
    serialize,
    resetFiles,
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

function deserialize(text: string): SerializeState | undefined {
  try {
    return JSON.parse(atou(text))
  } catch (error) {
    console.error('Failed to deserialize state:', error)
    return undefined
  }
}
