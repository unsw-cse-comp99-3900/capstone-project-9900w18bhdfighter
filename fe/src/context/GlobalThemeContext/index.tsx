/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigProvider, theme as _theme } from 'antd'
import type { ThemeConfig } from 'antd'
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ThemeProvider } from 'styled-components'
import { ThemeColor, themeColor as _themeColor } from './themeConfig'

import breakPoint, { BreakPointKey } from '../../constant/breakPoint'

//https://ant.design/docs/spec/colors-cn
type Props = {
  children: ReactNode
}
type OnWidth = (
  bp: Partial<Record<BreakPointKey, any>> & { defaultValue: any }
) => typeof bp.defaultValue
interface GlobalThemeContextType {
  setThemeColor: Dispatch<ThemeColor>
  windowWidth: number

  onWidth: OnWidth
}

const GlobalThemeContext = createContext<GlobalThemeContextType>(
  {} as GlobalThemeContextType
)

export const useGlobalTheme = () => useContext(GlobalThemeContext)
const GlobalAntdThemeProvider = ({ children }: Props) => {
  const { token } = _theme.useToken()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const onWidth: OnWidth = (bp) => {
    const keysWithoutDefault = Object.keys(breakPoint).filter(
      (k) => k !== 'defaultValue'
    ) as BreakPointKey[]

    const defaultValue = bp.defaultValue

    const key = keysWithoutDefault.find((k) => {
      const value = breakPoint[k]
      return windowWidth < value
    })

    if (key) {
      return bp[key]
    }

    return defaultValue
  }
  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth)
    })
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
      })
    }
  }, [])

  const [themeState] = useState<ThemeConfig>({
    components: {
      Typography: {
        titleMarginBottom: 0,
        fontWeightStrong: 700,
      },
      Layout: {
        headerBg: _themeColor.basicBg,
        siderBg: _themeColor.basicBg,
        footerBg: _themeColor.basicBg,
        triggerBg: _themeColor.highlight,
        triggerColor: _themeColor.primary,
        triggerHeight: 48,
        headerHeight: 64,
      },
      Menu: {
        itemSelectedColor: _themeColor.grayscalePalette[0] as string,
      },
      Table: {
        rowSelectedBg: _themeColor.grayscalePalette[20] as string,
        rowSelectedHoverBg: _themeColor.grayscalePalette[20] as string,
      },
      Select: {
        optionSelectedBg: _themeColor.highlightSecondary,
        optionActiveBg: _themeColor.grayscalePalette[2] as string,
      },
      Button: {
        colorPrimaryHover: _themeColor.grayscalePalette[35] as string,
      },
    },
    token: {
      colorPrimary: _themeColor.primary,
      borderRadius: 0,
    },
  })
  const [themeColor, setThemeColor] = useState<ThemeColor>(_themeColor)

  const ctx = {
    setThemeColor,
    windowWidth,
    onWidth,
  }
  return (
    <GlobalThemeContext.Provider value={ctx}>
      <ThemeProvider
        theme={{ ...token, ...themeState, themeColor: themeColor }}
      >
        <ConfigProvider
          theme={{
            ..._theme,
            ...themeState,
          }}
        >
          {children}
        </ConfigProvider>
      </ThemeProvider>
    </GlobalThemeContext.Provider>
  )
}

export default GlobalAntdThemeProvider
