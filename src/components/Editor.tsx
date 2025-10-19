import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import './Editor.css'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'vs' | 'vs-dark'
}

const Editor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  language = 'typescript',
  theme = 'vs'
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    // 创建编辑器实例
    monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      tabSize: 2,
      scrollBeyondLastLine: false,
    })

    // 监听内容变化
    monacoInstanceRef.current.onDidChangeModelContent(() => {
      const newValue = monacoInstanceRef.current?.getValue() || ''
      onChange(newValue)
    })

    return () => {
      monacoInstanceRef.current?.dispose()
    }
  }, [])

  // 更新主题
  useEffect(() => {
    if (monacoInstanceRef.current) {
      monaco.editor.setTheme(theme)
    }
  }, [theme])

  // 更新语言
  useEffect(() => {
    if (monacoInstanceRef.current) {
      const model = monacoInstanceRef.current.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language)
      }
    }
  }, [language])

  // 外部更新内容
  useEffect(() => {
    if (monacoInstanceRef.current && monacoInstanceRef.current.getValue() !== value) {
      monacoInstanceRef.current.setValue(value)
    }
  }, [value])

  return <div ref={editorRef} className="editor-container" />
}

export default Editor

