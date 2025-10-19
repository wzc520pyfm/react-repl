import { gte } from 'semver'

export interface Versions {
  react: string
  antd: string
  typescript: string
}

export interface Dependency {
  pkg?: string
  version?: string
  path: string
}

export type Cdn = 'unpkg' | 'jsdelivr' | 'jsdelivr-fastly'

// Use localStorage if available (client-side), otherwise default value
const getStoredCdn = (): Cdn => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('setting-cdn')
    if (stored === 'unpkg' || stored === 'jsdelivr' || stored === 'jsdelivr-fastly') {
      return stored
    }
  }
  return 'jsdelivr'
}

const setStoredCdn = (value: Cdn) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('setting-cdn', value)
  }
}

let cdnValue = getStoredCdn()

export const cdn = {
  get value() {
    return cdnValue
  },
  set value(newValue: Cdn) {
    cdnValue = newValue
    setStoredCdn(newValue)
  }
}

export const genCdnLink = (
  pkg: string,
  version: string | undefined,
  path: string,
) => {
  version = version ? `@${version}` : ''
  switch (cdn.value) {
    case 'jsdelivr':
      return `https://cdn.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'jsdelivr-fastly':
      return `https://fastly.jsdelivr.net/npm/${pkg}${version}${path}`
    case 'unpkg':
      return `https://unpkg.com/${pkg}${version}${path}`
  }
}

export const genImportMap = (
  { react, antd }: Partial<Versions> = {},
): Record<string, string> => {
  return {
    'react': genCdnLink('react', react, '/umd/react.production.min.js'),
    'react-dom': genCdnLink('react-dom', react, '/umd/react-dom.production.min.js'),
    'antd': genCdnLink('antd', antd, '/dist/antd.min.js'),
    '@ant-design/icons': genCdnLink('@ant-design/icons', 'latest', '/dist/index.umd.js'),
  }
}

export const getVersions = async (pkg: string): Promise<string[]> => {
  try {
    const url = `https://data.jsdelivr.com/v1/package/npm/${pkg}`
    const response = await fetch(url)
    const data = await response.json()
    return data.versions || []
  } catch (error) {
    console.error(`Failed to fetch versions for ${pkg}:`, error)
    return []
  }
}

export const getSupportedReactVersions = async (): Promise<string[]> => {
  const versions = await getVersions('react')
  return versions.filter((version) => gte(version, '18.0.0'))
}

export const getSupportedTSVersions = async (): Promise<string[]> => {
  const versions = await getVersions('typescript')
  return versions.filter(
    (version) => !version.includes('dev') && !version.includes('insiders'),
  )
}

export const getSupportedAntdVersions = async (): Promise<string[]> => {
  const versions = await getVersions('antd')
  return versions.filter((version) => gte(version, '5.0.0'))
}
