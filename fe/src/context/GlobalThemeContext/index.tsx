import { ConfigProvider, theme as _theme } from 'antd'
import type { ThemeConfig } from 'antd'
import { Dispatch, ReactNode, createContext, useContext, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { ThemeColor, themeColor as _themeColor } from './themeConfig'

//https://ant.design/docs/spec/colors-cn
type Props = {
  children: ReactNode
}

interface GlobalThemeContextType {
  setThemeColor: Dispatch<ThemeColor>
}

const GlobalThemeContext = createContext<GlobalThemeContextType>(
  {} as GlobalThemeContextType
)

export const useGlobalTheme = () => useContext(GlobalThemeContext)
const GlobalAntdThemeProvider = ({ children }: Props) => {
  const { token } = _theme.useToken()
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
