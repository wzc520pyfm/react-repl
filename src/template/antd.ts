let initialized = false

export function setupAntd() {
  if (initialized) return

  // Load Antd CSS
  loadStyle()

  initialized = true
}

function loadStyle() {
  const styles = [
    'https://cdn.jsdelivr.net/npm/antd@#VERSION#/dist/reset.css',
  ]

  styles.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  })
}

