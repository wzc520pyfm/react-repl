import React, { useEffect, useState } from 'react'
import { genCdnLink } from '@/utils/dependency'
import type { ImportMap } from '@/composables/store.tsx'
import './Preview.css'

interface PreviewProps {
  code: string
  reactVersion: string
  antdVersion: string
  importMap: ImportMap
}

const Preview: React.FC<PreviewProps> = ({ code, reactVersion, antdVersion, importMap }) => {
  const [error, setError] = useState<string | null>(null)
  const [html, setHtml] = useState('')

  useEffect(() => {
    const generatedHtml = generatePreviewHTML(code, importMap)
    setHtml(generatedHtml)
    setError(null)
  }, [code, importMap])

  return (
    <div className="preview-container">
      {error && (
        <div className="preview-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      <iframe
        className="preview-iframe"
        sandbox="allow-scripts"
        title="preview"
        srcDoc={html}
      />
    </div>
  )
}

function generatePreviewHTML(code: string, importMap: ImportMap): string {
  // 从 importMap 中获取 CDN 地址
  const reactUrl = importMap['react'] || ''
  const reactDomUrl = importMap['react-dom'] || ''
  const antdUrl = importMap['antd'] || ''
  const iconsUrl = importMap['@ant-design/icons'] || ''
  
  // 提取 antd 版本用于样式
  const antdVersion = antdUrl.match(/@([\d.]+)\//)?.[1] || '5.27.5'
  const antdCssUrl = antdUrl.replace('/dist/antd.min.js', '/dist/reset.min.css')
  
  // 加载其他自定义包
  const customPackages = Object.entries(importMap)
    .filter(([key]) => !['react', 'react-dom', 'antd', '@ant-design/icons'].includes(key))
    .map(([_, url]) => `<script src="${url}"></script>`)
    .join('\n  ')
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Ant Design 样式 -->
  <link rel="stylesheet" href="${antdCssUrl}" />
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: #fff;
    }
    #root { padding: 16px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.18/dayjs.min.js"></script>
  <!-- React -->
  <script crossorigin src="${reactUrl}"></script>
  <script crossorigin src="${reactDomUrl}"></script>
  
  <!-- Antd -->
  <script src="${antdUrl}"></script>
  <script src="${iconsUrl}"></script>
  
  <!-- 其他自定义包 -->
  ${customPackages}
  
  <!-- Babel Standalone -->
  <script src="${genCdnLink('@babel/standalone', '7.26.7', '/babel.min.js')}"></script>
  
  <script>
    // 等待所有库加载完成后再执行用户代码
    window.addEventListener('load', function() {
      try {
        // 调试信息：列出所有全局变量
        console.log('Available globals:', {
          React: typeof React,
          ReactDOM: typeof ReactDOM,
          antd: typeof antd,
          Babel: typeof Babel,
          // 检查所有可能的 antd 变量名
          AntDesign: typeof window.AntDesign,
          antDesign: typeof window.antDesign,
        });
        
        // 检查必要的库是否已加载
        if (typeof React === 'undefined') {
          throw new Error('React is not loaded. Check React CDN URL.');
        }
        if (typeof ReactDOM === 'undefined') {
          throw new Error('ReactDOM is not loaded. Check ReactDOM CDN URL.');
        }
        if (typeof antd === 'undefined') {
          throw new Error('Ant Design is not loaded. Check Antd CDN URL: ${antdUrl}');
        }
        if (typeof Babel === 'undefined') {
          throw new Error('Babel is not loaded. Check Babel CDN URL.');
        }
        
        // 用户代码（使用模板字符串转义）
        const userCode = \`
          // 解构 React hooks 和组件
          const { useState, useEffect, useCallback, useMemo, useRef } = React;
          const { 
            Button, Input, Space, Typography, 
            Form, Select, Table, Modal, message,
            Card, Row, Col, Divider, Tag, Alert,
            Tabs, Drawer, Dropdown, Menu, Checkbox,
            Radio, Switch, DatePicker, Upload, Progress
          } = antd;
          const icons = window.icons || {};
          const { 
            SmileOutlined, HeartOutlined, StarOutlined,
            HomeOutlined, UserOutlined, SettingOutlined,
            PlusOutlined, DeleteOutlined, EditOutlined
          } = icons;
          
          // 用户代码
          ${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}
          
          // 渲染到 DOM
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(App));
        \`;
        
        // 使用 Babel 编译代码
        const transformed = Babel.transform(userCode, {
          presets: ['react'],
          filename: 'app.jsx'
        }).code;
        
        // 执行编译后的代码
        eval(transformed);
        
      } catch (error) {
        document.getElementById('root').innerHTML = 
          '<div style="color: red; padding: 20px;">' +
          '<h3>Error:</h3>' +
          '<pre>' + (error.stack || error.message) + '</pre>' +
          '</div>';
        console.error(error);
      }
    });
  </script>
  
  <script>
    // 错误处理
    window.addEventListener('error', (e) => {
      console.error('Runtime error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled rejection:', e.reason);
    });
  </script>
</body>
</html>
  `.trim()
}

export default Preview

