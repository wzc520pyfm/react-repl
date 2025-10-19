import React, { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import './Editor.css'

// 配置 Monaco Editor 的 Web Workers
// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

interface EditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: 'vs' | 'vs-dark'
}

// 配置 Monaco 的 TypeScript 设置（只需执行一次）
let monacoConfigured = false

const configureMonaco = () => {
  if (monacoConfigured) return
  monacoConfigured = true

  // 配置 TypeScript 编译选项
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })

    // 添加 React 全局类型定义
    const reactTypes = `
      declare const React: typeof import('react');
      declare const useState: typeof import('react').useState;
      declare const useEffect: typeof import('react').useEffect;
      declare const useCallback: typeof import('react').useCallback;
      declare const useMemo: typeof import('react').useMemo;
      declare const useRef: typeof import('react').useRef;
    `

    // 添加 Antd 全局类型定义
    const antdTypes = `
      declare const antd: typeof import('antd');
      declare const Button: typeof import('antd').Button;
      declare const Input: typeof import('antd').Input;
      declare const Space: typeof import('antd').Space;
      declare const Typography: typeof import('antd').Typography;
      declare const Form: typeof import('antd').Form;
      declare const Select: typeof import('antd').Select;
      declare const Table: typeof import('antd').Table;
      declare const Modal: typeof import('antd').Modal;
      declare const message: typeof import('antd').message;
      declare const Card: typeof import('antd').Card;
      declare const Row: typeof import('antd').Row;
      declare const Col: typeof import('antd').Col;
      declare const Divider: typeof import('antd').Divider;
      declare const Tag: typeof import('antd').Tag;
      declare const Alert: typeof import('antd').Alert;
      declare const Tabs: typeof import('antd').Tabs;
      declare const Drawer: typeof import('antd').Drawer;
      declare const Dropdown: typeof import('antd').Dropdown;
      declare const Menu: typeof import('antd').Menu;
      declare const Checkbox: typeof import('antd').Checkbox;
      declare const Radio: typeof import('antd').Radio;
      declare const Switch: typeof import('antd').Switch;
      declare const DatePicker: typeof import('antd').DatePicker;
      declare const Upload: typeof import('antd').Upload;
      declare const Progress: typeof import('antd').Progress;
    `

    // 添加 Icons 全局类型定义
    const iconsTypes = `
      declare const icons: typeof import('@ant-design/icons');
      declare const SmileOutlined: typeof import('@ant-design/icons').SmileOutlined;
      declare const HeartOutlined: typeof import('@ant-design/icons').HeartOutlined;
      declare const StarOutlined: typeof import('@ant-design/icons').StarOutlined;
      declare const HomeOutlined: typeof import('@ant-design/icons').HomeOutlined;
      declare const UserOutlined: typeof import('@ant-design/icons').UserOutlined;
      declare const SettingOutlined: typeof import('@ant-design/icons').SettingOutlined;
      declare const PlusOutlined: typeof import('@ant-design/icons').PlusOutlined;
      declare const DeleteOutlined: typeof import('@ant-design/icons').DeleteOutlined;
      declare const EditOutlined: typeof import('@ant-design/icons').EditOutlined;
    `

    // 添加额外的库类型（如果用户添加了）
    const extraLibTypes = `
      declare const dayjs: any;
      declare const _: any;
      declare const axios: any;
    `

    // 将类型定义添加到 Monaco
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      reactTypes + antdTypes + iconsTypes + extraLibTypes,
      'ts:globals.d.ts'
    )

  // 禁用一些不必要的诊断
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    diagnosticCodesToIgnore: [
      1375, // 'await' expressions are only allowed at the top level of a file
      1378, // Top-level 'await' expressions are only allowed when the 'module' option is set
    ]
  })
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

    // 配置 Monaco（只执行一次）
    configureMonaco()

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

